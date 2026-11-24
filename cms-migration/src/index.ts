/**
 * index.ts – CMS Migration Orchestrator
 *
 * Usage:
 *   tsx src/index.ts                    # dry-run (default)
 *   tsx src/index.ts --commit           # write to Supabase
 *   tsx src/index.ts --source <path>    # use a different NDJSON file
 *
 * Safety:
 * - Dry-run by default (--commit required to write)
 * - Idempotent: upserts on legacy_sanity_id / old_path
 * - Never deletes rows. Never touches profiles.
 * - Never logs SUPABASE_SERVICE_ROLE_KEY
 */

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

import { loadNdjson, OLARE_PUBLISHED_ID } from './loader.ts';
import { groupByType } from './loader.ts';
import { validateAll } from './validator.ts';
import {
  transformDestinationCategory,
  transformDestinationPost,
  transformThemedPackage,
  transformTour,
  transformBlogPost,
  transformAccommodation,
  transformHotDeal,
  transformPopupOffer,
  transformTeamMember,
  transformGalleryImage,
  transformFleetVehicle,
} from './transformers.ts';
import { buildRedirects } from './redirects.ts';
import { writeJson, writeReport, ensureOutDir, type ReportSection } from './report.ts';
import { nonCloudinaryWarnings } from '../lib/cloudinary.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const IS_COMMIT = args.includes('--commit');
const sourceIdx = args.indexOf('--source');
const SOURCE_PATH =
  sourceIdx !== -1 && args[sourceIdx + 1]
    ? resolve(args[sourceIdx + 1])
    : resolve(REPO_ROOT, 'cms-source', 'data.ndjson');

// ---------------------------------------------------------------------------
// Seed files
// ---------------------------------------------------------------------------

const HERO_SLIDES_SEED = (
  JSON.parse(readFileSync(resolve(__dirname, '..', 'seed', 'hero-slides.json'), 'utf8')) as Record<string, unknown>[]
).map((row) => ({
  ...row,
  status: 'published',
  legacy_sanity_id: `seed-hero-slide-${row.display_order}`,
}));

const PARTNERS_SEED = (
  JSON.parse(readFileSync(resolve(__dirname, '..', 'seed', 'partners.json'), 'utf8')) as Record<string, unknown>[]
).map((row) => ({
  ...row,
  status: 'published',
  legacy_sanity_id: `seed-partner-${row.display_order}`,
}));

// ---------------------------------------------------------------------------
// Supabase client (only needed for --commit)
// ---------------------------------------------------------------------------

async function getClient() {
  const { supabase } = await import('./config.ts');
  return supabase;
}

// ---------------------------------------------------------------------------
// Upsert helper (dry-run aware)
// ---------------------------------------------------------------------------

type Row = Record<string, unknown>;

async function upsert(
  table: string,
  rows: Row[],
  dryRun: boolean,
  conflictColumn = 'legacy_sanity_id'
): Promise<{ inserted: number; errors: string[] }> {
  if (rows.length === 0) return { inserted: 0, errors: [] };

  if (dryRun) {
    writeJson(table, rows);
    return { inserted: rows.length, errors: [] };
  }

  const supabase = await getClient();
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: conflictColumn, ignoreDuplicates: false });

  if (error) {
    return { inserted: 0, errors: [`${table}: ${error.message}`] };
  }
  return { inserted: rows.length, errors: [] };
}

async function upsertSeeds(
  table: string,
  rows: Row[],
  dryRun: boolean
): Promise<{ inserted: number; errors: string[] }> {
  if (dryRun) {
    writeJson(`${table}-seed`, rows);
    return { inserted: rows.length, errors: [] };
  }
  const supabase = await getClient();
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: 'legacy_sanity_id', ignoreDuplicates: false });
  if (error) return { inserted: 0, errors: [`${table} seed: ${error.message}`] };
  return { inserted: rows.length, errors: [] };
}

// ---------------------------------------------------------------------------
// Olare Mara Kempinski diff
// ---------------------------------------------------------------------------

interface OlareDiff {
  field: string;
  published: unknown;
  draft: unknown;
}

function diffOlare(published: Record<string, unknown>, draft: Record<string, unknown>): OlareDiff[] {
  const diffs: OlareDiff[] = [];
  const allKeys = new Set([...Object.keys(published), ...Object.keys(draft)]);
  for (const key of allKeys) {
    if (key.startsWith('_')) continue;
    const pub = published[key];
    const dft = draft[key];
    if (JSON.stringify(pub) !== JSON.stringify(dft)) {
      diffs.push({ field: key, published: pub, draft: dft });
    }
  }
  return diffs;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`\n🚀 CMS Migration – ${IS_COMMIT ? '⚠️  COMMIT MODE' : 'DRY RUN'}`);
  console.log(`Source: ${SOURCE_PATH}\n`);

  ensureOutDir();

  // 1. Load NDJSON
  const { docs, olareDraft } = await loadNdjson(SOURCE_PATH);
  console.log(`Loaded ${docs.length} published documents.`);

  // 2. Validate
  validateAll(docs);
  console.log('✓ Validation passed.');

  // 3. Group by type
  const byType = groupByType(docs);
  const sections: ReportSection[] = [];
  const allErrors: string[] = [];

  const categoryDbIdMap = new Map<string, string>(); // sanityId -> db uuid (populated on --commit)

  // ---- A. Destination Categories ----
  const catDocs = byType.get('destinationCategory') ?? [];
  const catRows = catDocs.map(transformDestinationCategory);
  const catResult = await upsert('destination_categories', catRows, !IS_COMMIT);
  sections.push({ table: 'destination_categories', count: catResult.inserted });
  allErrors.push(...catResult.errors);
  console.log(`  destination_categories: ${catResult.inserted} rows`);

  if (IS_COMMIT) {
    const supabase = await getClient();
    const { data, error } = await supabase
      .from('destination_categories')
      .select('id, legacy_sanity_id')
      .in('legacy_sanity_id', catDocs.map((d) => d._id));
    if (error) allErrors.push(`fetch destination_categories ids: ${error.message}`);
    for (const row of data ?? []) {
      categoryDbIdMap.set(row.legacy_sanity_id, row.id);
    }
  }

  // ---- B. Destination Posts ----
  const destDocs = byType.get('destinationPost') ?? [];
  const destRows = destDocs.map((d) => transformDestinationPost(d, categoryDbIdMap));
  const destSlugMap = new Map<string, string>(destRows.map((r, i) => [destDocs[i]._id, r.slug]));
  const destResult = await upsert('destination_posts', destRows, !IS_COMMIT);
  sections.push({ table: 'destination_posts', count: destResult.inserted });
  allErrors.push(...destResult.errors);
  console.log(`  destination_posts: ${destResult.inserted} rows`);

  // ---- C. Themed Packages ----
  // Note: 0002_tables.sql has category TEXT NOT NULL UNIQUE (6 allowed categories).
  // Sanity data currently has 2 docs in category 'adventure':
  //   - 07422e07 ("HIGH ALTITUDE TRAINING PROGRAMME ", created 2026-06-29 — also exists as tour fd6ea14a)
  //   - 2954b894 ("Adventure Package", created 2026-02-26, slug 'adventure-package')
  // Keep one per category (preferring the canonical category-named 'adventure-package' if present)
  // and flag any duplicate loudly.
  const themeDocs = byType.get('themedPackage') ?? [];
  const themeWarnings: string[] = [];
  const themeByCategory = new Map<string, ReturnType<typeof transformThemedPackage>>();
  let themeSkipped = 0;

  // Prefer canonical slug 'adventure-package' over duplicate 'high-altitude-training-programme'
  const sortedThemeDocs = [...themeDocs].sort((a, b) => {
    const aSlug = ((a.slug as Record<string, unknown>)?.current as string) ?? '';
    const bSlug = ((b.slug as Record<string, unknown>)?.current as string) ?? '';
    if (aSlug === 'adventure-package') return -1;
    if (bSlug === 'adventure-package') return 1;
    return 0;
  });

  for (const doc of sortedThemeDocs) {
    const row = transformThemedPackage(doc);
    if (themeByCategory.has(row.category)) {
      const kept = themeByCategory.get(row.category)!;
      themeSkipped++;
      const msg = `Duplicate themed_packages.category="${row.category}": skipped ${row.legacy_sanity_id} ("${row.title}") in favour of ${kept.legacy_sanity_id} ("${kept.title}") due to UNIQUE constraint on category.`;
      themeWarnings.push(msg);
      console.warn(`  ⚠️  ${msg}`);
      continue;
    }
    themeByCategory.set(row.category, row);
  }

  const themeRows = [...themeByCategory.values()];
  const themeResult = await upsert('themed_packages', themeRows, !IS_COMMIT);
  sections.push({
    table: 'themed_packages',
    count: themeResult.inserted,
    skipped: themeSkipped,
    warnings: themeWarnings,
  });
  allErrors.push(...themeResult.errors);
  console.log(`  themed_packages: ${themeResult.inserted} rows${themeSkipped ? ` (${themeSkipped} duplicate category skipped)` : ''}`);

  // ---- D. Packages (0 records in Sanity, skip) ----
  sections.push({ table: 'packages', count: 0, skipped: 0 });

  // ---- E. Tours ----
  const tourDocs = byType.get('tour') ?? [];
  const tourRows = tourDocs.map(transformTour);
  const tourSlugMap = new Map<string, string>(tourRows.map((r, i) => [tourDocs[i]._id, r.slug]));
  const tourResult = await upsert('tours', tourRows, !IS_COMMIT);
  sections.push({ table: 'tours', count: tourResult.inserted });
  allErrors.push(...tourResult.errors);
  console.log(`  tours: ${tourResult.inserted} rows`);

  // ---- F. Blog Posts ----
  const blogDocs = byType.get('blogPost') ?? [];
  const blogRows = blogDocs.map(transformBlogPost);
  const blogSlugMap = new Map<string, string>(blogRows.map((r, i) => [blogDocs[i]._id, r.slug]));
  const blogResult = await upsert('blog_posts', blogRows, !IS_COMMIT);
  sections.push({ table: 'blog_posts', count: blogResult.inserted });
  allErrors.push(...blogResult.errors);
  console.log(`  blog_posts: ${blogResult.inserted} rows`);

  // ---- G. Accommodations ----
  const accomDocs = byType.get('accommodation') ?? [];
  const accomRows = accomDocs.map(transformAccommodation);
  const accomSlugMap = new Map<string, string>(accomRows.map((r, i) => [accomDocs[i]._id, r.slug]));
  const accomResult = await upsert('accommodations', accomRows, !IS_COMMIT);
  sections.push({ table: 'accommodations', count: accomResult.inserted });
  allErrors.push(...accomResult.errors);
  console.log(`  accommodations: ${accomResult.inserted} rows`);

  // ---- H. Hot Deals ----
  const hotDocs = byType.get('hotDeal') ?? [];
  const hotRows = hotDocs.map(transformHotDeal);
  const hotResult = await upsert('hot_deals', hotRows, !IS_COMMIT);
  sections.push({ table: 'hot_deals', count: hotResult.inserted });
  allErrors.push(...hotResult.errors);
  console.log(`  hot_deals: ${hotResult.inserted} rows (archived)`);

  // ---- I. Popup Offers ----
  const popupDocs = byType.get('popupOffer') ?? [];
  const popupRows = popupDocs.map(transformPopupOffer);
  const popupResult = await upsert('popup_offers', popupRows, !IS_COMMIT);
  sections.push({ table: 'popup_offers', count: popupResult.inserted });
  allErrors.push(...popupResult.errors);
  console.log(`  popup_offers: ${popupResult.inserted} rows (archived)`);

  // ---- J. Team Members ----
  const teamDocs = byType.get('teamMember') ?? [];
  const teamRows = teamDocs.map(transformTeamMember);
  const teamResult = await upsert('team_members', teamRows, !IS_COMMIT);
  sections.push({ table: 'team_members', count: teamResult.inserted });
  allErrors.push(...teamResult.errors);
  console.log(`  team_members: ${teamResult.inserted} rows`);

  // ---- K. Gallery Images ----
  const galleryDocs = byType.get('galleryImage') ?? [];
  const galleryRows = galleryDocs.map(transformGalleryImage);
  const galleryResult = await upsert('gallery_images', galleryRows, !IS_COMMIT);
  sections.push({ table: 'gallery_images', count: galleryResult.inserted });
  allErrors.push(...galleryResult.errors);
  console.log(`  gallery_images: ${galleryResult.inserted} rows`);

  // ---- L. Fleet Vehicles ----
  const fleetDocs = byType.get('fleetVehicle') ?? [];
  const fleetRows = fleetDocs.map(transformFleetVehicle);
  const fleetResult = await upsert('fleet_vehicles', fleetRows, !IS_COMMIT);
  sections.push({ table: 'fleet_vehicles', count: fleetResult.inserted });
  allErrors.push(...fleetResult.errors);
  console.log(`  fleet_vehicles: ${fleetResult.inserted} rows`);

  // ---- M. Hero Slides (seed) ----
  const heroResult = await upsertSeeds('hero_slides', HERO_SLIDES_SEED, !IS_COMMIT);
  sections.push({ table: 'hero_slides (seed)', count: heroResult.inserted });
  allErrors.push(...heroResult.errors);
  console.log(`  hero_slides (seed): ${heroResult.inserted} rows`);

  // ---- N. Partners (seed) ----
  const partnerResult = await upsertSeeds('partners', PARTNERS_SEED, !IS_COMMIT);
  sections.push({ table: 'partners (seed)', count: partnerResult.inserted });
  allErrors.push(...partnerResult.errors);
  console.log(`  partners (seed): ${partnerResult.inserted} rows`);

  // ---- O. Redirects ----
  const slugMap = new Map<string, string>([
    ...Array.from(destSlugMap),
    ...Array.from(tourSlugMap),
    ...Array.from(blogSlugMap),
    ...Array.from(accomSlugMap),
  ]);
  const redirectRows = buildRedirects(docs, slugMap);

  if (!IS_COMMIT) {
    writeJson('redirects', redirectRows);
  } else {
    const supabase = await getClient();
    const { error } = await supabase
      .from('redirects')
      .upsert(redirectRows, { onConflict: 'old_path' });
    if (error) allErrors.push(`redirects: ${error.message}`);
  }
  console.log(`  redirects: ${redirectRows.length} rows`);

  // ---- P. Olare Mara Kempinski Diff ----
  let olareDiffs: { field: string; published: unknown; draft: unknown }[] = [];
  const olarePub = docs.find((d) => d._id === OLARE_PUBLISHED_ID);
  if (olarePub && olareDraft) {
    olareDiffs = diffOlare(
      olarePub as Record<string, unknown>,
      olareDraft as Record<string, unknown>
    );
  }

  // ---- Q. Report ----
  const reportPath = writeReport({
    sections,
    olareDiff: olareDiffs,
    redirectCount: redirectRows.length,
    nonCloudinaryUrls: [...nonCloudinaryWarnings],
    dryRun: !IS_COMMIT,
  });

  // ---- Summary ----
  const totalRows = sections.reduce((s, r) => s + r.count, 0) + redirectRows.length;
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Total planned rows: ${totalRows}`);
  if (nonCloudinaryWarnings.length) {
    console.warn(`\n⚠️  ${nonCloudinaryWarnings.length} non-Cloudinary image URL(s) found – see report`);
  }
  if (allErrors.length) {
    console.error(`\n❌ ${allErrors.length} error(s):`);
    for (const e of allErrors) console.error(`   ${e}`);
    process.exit(1);
  }
  console.log(`\n${IS_COMMIT ? '✅ Migration complete.' : '✅ Dry run complete.'}`);
  console.log(`Report: ${reportPath}\n`);
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
