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
 * - Idempotent: upserts on legacy_sanity_id
 * - Never deletes rows. Never touches profiles.
 * - Never logs SUPABASE_SERVICE_ROLE_KEY
 */

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

import { loadNdjson, groupByType, OLARE_PUBLISHED_ID, OLARE_DRAFT_ID } from './loader.ts';
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
import { slugify } from '../lib/slugs.ts';

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

const HERO_SLIDES_SEED = JSON.parse(
  readFileSync(resolve(__dirname, '..', 'seed', 'hero-slides.json'), 'utf8')
) as Record<string, unknown>[];

const PARTNERS_SEED = JSON.parse(
  readFileSync(resolve(__dirname, '..', 'seed', 'partners.json'), 'utf8')
) as Record<string, unknown>[];

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

// ---------------------------------------------------------------------------
// Seed upsert (by name, not legacy_sanity_id)
// ---------------------------------------------------------------------------

async function upsertSeeds(
  table: string,
  rows: Row[],
  dryRun: boolean,
  conflictColumn: string
): Promise<{ inserted: number; errors: string[] }> {
  if (dryRun) {
    writeJson(`${table}-seed`, rows);
    return { inserted: rows.length, errors: [] };
  }
  const supabase = await getClient();
  const { error } = await supabase
    .from(table)
    .upsert(rows, { onConflict: conflictColumn, ignoreDuplicates: false });
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
    if (key.startsWith('_')) continue; // skip metadata
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

  // Maps for FK resolution (sanityId → new DB id or slug)
  // We build slug maps eagerly so redirects can reference them.
  const categorySlugMap = new Map<string, string>(); // sanityId → slug
  const categoryDbIdMap = new Map<string, string>(); // sanityId → db uuid (populated only on --commit)

  // ---- A. Destination Categories ----
  const catDocs = byType.get('destinationCategory') ?? [];
  const catRows = catDocs.map((d) => {
    const row = transformDestinationCategory(d);
    categorySlugMap.set(d._id, row.slug);
    return row;
  });
  const catResult = await upsert('destination_categories', catRows, !IS_COMMIT);
  sections.push({ table: 'destination_categories', count: catResult.inserted });
  allErrors.push(...catResult.errors);
  console.log(`  destination_categories: ${catResult.inserted} rows`);

  // If commit mode, fetch the newly inserted IDs
  if (IS_COMMIT) {
    const supabase = await getClient();
    const { data } = await supabase
      .from('destination_categories')
      .select('id, legacy_sanity_id')
      .in('legacy_sanity_id', catDocs.map((d) => d._id));
    for (const row of (data ?? [])) {
      categoryDbIdMap.set(row.legacy_sanity_id, row.id);
    }
  }

  // ---- B. Destination Posts ----
  const destDocs = byType.get('destinationPost') ?? [];
  const destRows = destDocs.map((d) => transformDestinationPost(d, categoryDbIdMap));
  // Build slug map for redirects
  const destSlugMap = new Map<string, string>(destRows.map((r, i) => [destDocs[i]._id, r.slug]));
  const destResult = await upsert('destination_posts', destRows, !IS_COMMIT);
  sections.push({ table: 'destination_posts', count: destResult.inserted });
  allErrors.push(...destResult.errors);
  console.log(`  destination_posts: ${destResult.inserted} rows`);

  // ---- C. Themed Packages ----
  const themeDocs = byType.get('themedPackage') ?? [];
  const themeRows = themeDocs.map(transformThemedPackage);
  const themeSlugMap = new Map<string, string>(themeRows.map((r, i) => [themeDocs[i]._id, r.slug]));
  const themeDbIdMap = new Map<string, string>();
  const themeResult = await upsert('themed_packages', themeRows, !IS_COMMIT);
  sections.push({ table: 'themed_packages', count: themeResult.inserted });
  allErrors.push(...themeResult.errors);
  console.log(`  themed_packages: ${themeResult.inserted} rows`);

  if (IS_COMMIT) {
    const supabase = await getClient();
    const { data } = await supabase
      .from('themed_packages')
      .select('id, legacy_sanity_id')
      .in('legacy_sanity_id', themeDocs.map((d) => d._id));
    for (const row of (data ?? [])) {
      themeDbIdMap.set(row.legacy_sanity_id, row.id);
    }
  }

  // ---- D. Packages (0 records in Sanity, skip) ----
  sections.push({ table: 'packages', count: 0, skipped: 0 });

  // ---- E. Tours ----
  const tourDocs = byType.get('tour') ?? [];
  const tourRawRows = tourDocs.map(transformTour);
  // Resolve themed_package FK
  const tourRows = tourRawRows.map((r) => {
    const row = { ...r } as Record<string, unknown>;
    const ref = row._themed_package_sanity_ref as string | undefined;
    delete row._themed_package_sanity_ref;
    if (ref) row.themed_package_id = themeDbIdMap.get(ref) ?? null;
    return row;
  });
  const tourSlugMap = new Map<string, string>(tourRawRows.map((r, i) => [tourDocs[i]._id, r.slug]));
  const tourResult = await upsert('tours', tourRows, !IS_COMMIT);
  sections.push({ table: 'tours', count: tourResult.inserted });
  allErrors.push(...tourResult.errors);
  console.log(`  tours: ${tourResult.inserted} rows`);

  // ---- F. Blog Posts ----
  const blogDocs = byType.get('blogPost') ?? [];
  const blogRawRows = blogDocs.map(transformBlogPost);
  // Resolve author FK (team_members) – skip for now, resolve after team_members upsert
  const blogSlugMap = new Map<string, string>(blogRawRows.map((r, i) => [blogDocs[i]._id, r.slug]));
  const blogRows = blogRawRows.map((r) => {
    const row = { ...r } as Record<string, unknown>;
    delete row._author_sanity_ref; // resolve after team_members
    return row;
  });
  const blogResult = await upsert('blog_posts', blogRows, !IS_COMMIT);
  sections.push({ table: 'blog_posts', count: blogResult.inserted });
  allErrors.push(...blogResult.errors);
  console.log(`  blog_posts: ${blogResult.inserted} rows`);

  // ---- G. Accommodations ----
  const accomDocs = byType.get('accommodation') ?? [];
  const accomRawRows = accomDocs.map(transformAccommodation);
  // Resolve destination_id FK
  let destDbIdMap = new Map<string, string>();
  if (IS_COMMIT) {
    const supabase = await getClient();
    const { data } = await supabase
      .from('destination_posts')
      .select('id, legacy_sanity_id')
      .in('legacy_sanity_id', destDocs.map((d) => d._id));
    for (const row of (data ?? [])) {
      destDbIdMap.set(row.legacy_sanity_id, row.id);
    }
  }
  const accomRows = accomRawRows.map((r) => {
    const row = { ...r } as Record<string, unknown>;
    const ref = row._destination_sanity_ref as string | undefined;
    delete row._destination_sanity_ref;
    if (ref) row.destination_id = destDbIdMap.get(ref) ?? null;
    return row;
  });
  const accomSlugMap = new Map<string, string>(accomRawRows.map((r, i) => [accomDocs[i]._id, r.slug]));
  const accomResult = await upsert('accommodations', accomRows, !IS_COMMIT);
  sections.push({ table: 'accommodations', count: accomResult.inserted });
  allErrors.push(...accomResult.errors);
  console.log(`  accommodations: ${accomResult.inserted} rows`);

  // ---- H. Hot Deals ----
  const hotDocs = byType.get('hotDeal') ?? [];
  let tourDbIdMap = new Map<string, string>();
  if (IS_COMMIT) {
    const supabase = await getClient();
    const { data } = await supabase
      .from('tours')
      .select('id, legacy_sanity_id')
      .in('legacy_sanity_id', tourDocs.map((d) => d._id));
    for (const row of (data ?? [])) {
      tourDbIdMap.set(row.legacy_sanity_id, row.id);
    }
  }
  const hotRows = hotDocs.map((d) => {
    const row = { ...transformHotDeal(d) } as Record<string, unknown>;
    const ref = row._tour_sanity_ref as string | undefined;
    delete row._tour_sanity_ref;
    if (ref) row.tour_id = tourDbIdMap.get(ref) ?? null;
    return row;
  });
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
  const teamDbIdMap = new Map<string, string>();
  const teamResult = await upsert('team_members', teamRows, !IS_COMMIT);
  sections.push({ table: 'team_members', count: teamResult.inserted });
  allErrors.push(...teamResult.errors);
  console.log(`  team_members: ${teamResult.inserted} rows`);

  if (IS_COMMIT) {
    const supabase = await getClient();
    const { data } = await supabase
      .from('team_members')
      .select('id, legacy_sanity_id')
      .in('legacy_sanity_id', teamDocs.map((d) => d._id));
    for (const row of (data ?? [])) {
      teamDbIdMap.set(row.legacy_sanity_id, row.id);
    }
    // Update blog_posts with author_id
    for (const raw of blogRawRows) {
      const ref = raw._author_sanity_ref;
      if (!ref) continue;
      const teamId = teamDbIdMap.get(ref);
      if (!teamId) continue;
      const sanityId = blogDocs.find((d) => ((d.author as Record<string,unknown>)?._ref) === ref)?._id;
      if (!sanityId) continue;
      await supabase.from('blog_posts').update({ author_id: teamId }).eq('legacy_sanity_id', sanityId);
    }
  }

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
  const heroResult = await upsertSeeds('hero_slides', HERO_SLIDES_SEED, !IS_COMMIT, 'display_order');
  sections.push({ table: 'hero_slides (seed)', count: heroResult.inserted });
  allErrors.push(...heroResult.errors);
  console.log(`  hero_slides (seed): ${heroResult.inserted} rows`);

  // ---- N. Partners (seed) ----
  const partnerResult = await upsertSeeds('partners', PARTNERS_SEED, !IS_COMMIT, 'name');
  sections.push({ table: 'partners (seed)', count: partnerResult.inserted });
  allErrors.push(...partnerResult.errors);
  console.log(`  partners (seed): ${partnerResult.inserted} rows`);

  // ---- O. Redirects ----
  // Merge all slug maps
  const slugMap = new Map<string, string>([
    ...Array.from(destSlugMap),
    ...Array.from(themeSlugMap),
    ...Array.from(tourSlugMap),
    ...Array.from(blogSlugMap),
    ...Array.from(accomSlugMap),
  ]);
  const typeMap = new Map<string, string>(docs.map((d) => [d._id, d._type]));
  const redirectRows = buildRedirects(docs, slugMap, typeMap);

  if (!IS_COMMIT) {
    writeJson('redirects', redirectRows);
  } else {
    const supabase = await getClient();
    const { error } = await supabase.from('redirects').upsert(redirectRows, { onConflict: 'from_path' });
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
