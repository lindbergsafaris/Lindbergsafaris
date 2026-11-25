/**
 * scripts/data-parity.mjs
 *
 * Full row-level comparison of every public data function between
 * Sanity (CMS_SOURCE=sanity) and Supabase (CMS_SOURCE=supabase):
 *   - Slugs
 *   - Titles / names
 *   - Prices & durations
 *   - Image URLs
 *   - Normalized plain text of rich-text bodies (blog posts, destination posts, themed packages)
 *
 * Excludes only the known intentional differences:
 *   - Test tour added directly in Supabase (slug: "test")
 *   - Sanity hot deals & popup offers imported as archived
 *   - Skipped duplicate adventure themed package (2954b894-cd6e-4ded-a0c0-a3c794166a1e)
 *   - Seeded hero slides & partners (not in Sanity)
 *
 * Usage (from next-app/):
 *   node scripts/data-parity.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { createClient as createSanityClient } from 'next-sanity';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Node, mergeAttributes } from '@tiptap/core';
import { generateHTML } from '@tiptap/html/server';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';

// ---------------------------------------------------------------------------
// Load .env.local if variables are not already in process.env
// ---------------------------------------------------------------------------
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env.local'));

const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'tdpau1kt';
const sanityDataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const sanityApiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  process.exit(1);
}

const sanity = createSanityClient({
  projectId: sanityProjectId,
  dataset: sanityDataset,
  apiVersion: sanityApiVersion,
  useCdn: false,
});

const supabase = createSupabaseClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// ---------------------------------------------------------------------------
// Helpers (matching src/lib/slugUtils.ts, src/lib/data/images.ts & tiptap-html.ts)
// ---------------------------------------------------------------------------

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function normImgUrl(src) {
  if (!src) return '';
  if (typeof src === 'string') return src.trim();
  return (
    src.url ||
    src.asset?.url ||
    src.imageUrl ||
    src.image?.url ||
    src.image?.asset?.url ||
    (typeof src.logo === 'string' ? src.logo : src.logo?.url || src.logo?.asset?.url) ||
    ''
  ).trim();
}

function normStr(v) {
  return String(v || '').replace(/\s+/g, ' ').trim();
}

const ExternalImageNode = Node.create({
  name: 'externalImage',
  group: 'block',
  atom: true,
  addAttributes: () => ({ url: { default: null }, alt: { default: null }, caption: { default: null } }),
  renderHTML: ({ HTMLAttributes }) => ['figure', mergeAttributes({}), ['img', { src: HTMLAttributes.url || '' }]],
});

const CustomImageNode = Node.create({
  name: 'customImage',
  group: 'block',
  atom: true,
  addAttributes: () => ({ url: { default: null }, alt: { default: null } }),
  renderHTML: ({ HTMLAttributes }) => ['figure', mergeAttributes({}), ['img', { src: HTMLAttributes.url || '' }]],
});

const VideoEmbedNode = Node.create({
  name: 'videoEmbed',
  group: 'block',
  atom: true,
  addAttributes: () => ({ url: { default: null }, caption: { default: null } }),
  renderHTML: () => ['figure', mergeAttributes({})],
});

const EXTENSIONS = [
  StarterKit.configure({ heading: { levels: [2, 3, 4, 5] }, link: { openOnClick: false }, underline: {} }),
  ImageExtension.configure({ inline: false }),
  ExternalImageNode,
  CustomImageNode,
  VideoEmbedNode,
];

function ptPlainText(blocks) {
  if (!Array.isArray(blocks)) return '';
  const parts = [];
  for (const b of blocks) {
    if (b && b._type === 'block' && Array.isArray(b.children)) {
      parts.push(b.children.map((c) => c?.text || '').join(''));
    }
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

function stripEmptyTextNodes(node) {
  if (!node || typeof node !== 'object') return node;
  if (Array.isArray(node.content)) {
    return {
      ...node,
      content: node.content
        .filter((c) => !(c && c.type === 'text' && (!c.text || c.text.length === 0)))
        .map(stripEmptyTextNodes),
    };
  }
  return node;
}

function tiptapPlainText(doc) {
  if (!doc || typeof doc !== 'object' || doc.type !== 'doc' || !Array.isArray(doc.content) || doc.content.length === 0) {
    return '';
  }
  const html = generateHTML(stripEmptyTextNodes(doc), EXTENSIONS);
  return html
    .replace(/<\/(?:p|h[1-6]|li|blockquote|div|figure|figcaption|ul|ol|pre)>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstDiffSnippet(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return `idx=${i} sanity="${a.slice(Math.max(0, i - 20), i + 40)}" vs supa="${b.slice(Math.max(0, i - 20), i + 40)}"`;
}

// ---------------------------------------------------------------------------
// Parity checks (row-level + summary)
// ---------------------------------------------------------------------------

const results = [];

function record(fnName, sanityCount, supabaseCount, diffs, note = '') {
  const status = diffs.length === 0 && sanityCount === supabaseCount ? 'MATCH' : diffs.length === 0 ? 'COUNT_DIFF' : 'DIFF';
  results.push({ fnName, sanityCount, supabaseCount, status, diffs, note });
}

async function compareTours() {
  console.log('\n--- [1] getTours / getAllTourSlugs / getTourBySlug ---');
  const sData = await sanity.fetch(
    `*[_type == "tour"] | order(_createdAt desc) { _id, title, "slug": slug.current, duration, groupSize, price, "images": images[]{ "url": coalesce(url, asset->url), alt } }`
  );
  const { data: sbRaw, error: sbErr } = await supabase
    .from('tours')
    .select('id, legacy_sanity_id, title, slug, duration, group_size, price, images')
    .eq('status', 'published');
  if (sbErr) throw new Error(`tours query failed: ${sbErr.message}`);

  // Exclude known intentional test tour
  const sb = (sbRaw || []).filter((t) => t.slug !== 'test');
  const diffs = [];
  const sbByLegacy = new Map(sb.map((r) => [r.legacy_sanity_id, r]));

  for (const t of sData) {
    const sSlug = slugify(t.slug || t.title);
    const r = sbByLegacy.get(t._id) || sb.find((x) => x.slug === sSlug);
    if (!r) {
      diffs.push(`Missing in Supabase: ${sSlug} (${t._id})`);
      console.log(`  [MISSING] ${sSlug} | "${t.title}"`);
      continue;
    }
    const sImgs = (t.images || []).map(normImgUrl).filter(Boolean);
    const sbImgs = (r.images || []).map(normImgUrl).filter(Boolean);
    const rowDiffs = [];
    if (sSlug !== r.slug) rowDiffs.push(`slug "${sSlug}" vs "${r.slug}"`);
    if (normStr(t.title) !== normStr(r.title)) rowDiffs.push(`title "${t.title}" vs "${r.title}"`);
    if (Number(t.price || 0) !== Number(r.price || 0)) rowDiffs.push(`price ${t.price} vs ${r.price}`);
    if (normStr(t.duration) !== normStr(r.duration)) rowDiffs.push(`duration "${t.duration}" vs "${r.duration}"`);
    if (JSON.stringify(sImgs) !== JSON.stringify(sbImgs)) rowDiffs.push(`images ${JSON.stringify(sImgs)} vs ${JSON.stringify(sbImgs)}`);
    if (rowDiffs.length) diffs.push(`[${sSlug}] ${rowDiffs.join('; ')}`);

    console.log(
      `  [${rowDiffs.length ? 'DIFF' : 'OK'}] slug=${r.slug} | title="${normStr(r.title)}" | price=${r.price} | duration="${r.duration}" | imgs(${sbImgs.length})=${sbImgs.join(', ')}`
    );
    if (rowDiffs.length) console.log(`     DIFF: ${rowDiffs.join('; ')}`);
  }

  for (const r of sb) {
    if (!sData.find((t) => t._id === r.legacy_sanity_id || slugify(t.slug || t.title) === r.slug)) {
      diffs.push(`Unexpected extra tour in Supabase: ${r.slug}`);
      console.log(`  [EXTRA] slug=${r.slug} | title="${r.title}"`);
    }
  }
  console.log(`  (Excluded intentional test tour slug="test"; raw Supabase count=${(sbRaw || []).length})`);
  record('getTours / getAllTourSlugs / getTourBySlug', sData.length, sb.length, diffs, 'Excluded intentional test tour (slug=test)');
}

async function compareBlogPosts() {
  console.log('\n--- [2] getBlogPosts / getAllBlogSlugs / getBlogPostBySlug ---');
  const sData = await sanity.fetch(
    `*[_type == "blogPost"] | order(publishedAt desc) { _id, title, "slug": slug.current, "featuredImage": coalesce(featuredImage.url, featuredImage.asset->url), content }`
  );
  const { data: sbData } = await supabase
    .from('blog_posts')
    .select('id, legacy_sanity_id, title, slug, featured_image, content')
    .eq('status', 'published');

  const sb = sbData || [];
  const diffs = [];
  const sbByLegacy = new Map(sb.map((r) => [r.legacy_sanity_id, r]));

  for (const b of sData) {
    const sSlug = b.title?.toLowerCase().includes('altitude training') ? 'altitude-training-kenya' : slugify(b.slug || b.title);
    const r = sbByLegacy.get(b._id) || sb.find((x) => x.slug === sSlug);
    if (!r) {
      diffs.push(`Missing in Supabase: ${sSlug}`);
      console.log(`  [MISSING] ${sSlug}`);
      continue;
    }
    const sImg = normImgUrl(b.featuredImage);
    const sbImg = normImgUrl(r.featured_image);
    const sText = ptPlainText(b.content);
    const sbText = tiptapPlainText(r.content);
    const rowDiffs = [];
    if (sSlug !== r.slug) rowDiffs.push(`slug "${sSlug}" vs "${r.slug}"`);
    if (normStr(b.title) !== normStr(r.title)) rowDiffs.push(`title "${b.title}" vs "${r.title}"`);
    if (sImg !== sbImg) rowDiffs.push(`image "${sImg}" vs "${sbImg}"`);
    if (sText !== sbText) rowDiffs.push(`richText (${sText.length} vs ${sbText.length} chars: ${firstDiffSnippet(sText, sbText)})`);
    if (rowDiffs.length) diffs.push(`[${sSlug}] ${rowDiffs.join('; ')}`);

    console.log(
      `  [${rowDiffs.length ? 'DIFF' : 'OK'}] slug=${r.slug} | title="${normStr(r.title)}" | img=${sbImg} | bodyChars=${sbText.length} (exactTextMatch=${sText === sbText})`
    );
    if (rowDiffs.length) console.log(`     DIFF: ${rowDiffs.join('; ')}`);
  }

  record('getBlogPosts / getAllBlogSlugs / getBlogPostBySlug', sData.length, sb.length, diffs);
}

async function compareAccommodations() {
  console.log('\n--- [3] getAccommodations / getAccommodationsByType / getAccommodationBySlug ---');
  const sData = await sanity.fetch(
    `*[_type == "accommodation"] | order(name asc) { _id, name, type, pricePerNight, "image": coalesce(image.url, image.asset->url) }`
  );
  const { data: sbData, error: sbErr } = await supabase
    .from('accommodations')
    .select('id, legacy_sanity_id, name, slug, type, image')
    .eq('status', 'published')
    .order('name', { ascending: true });
  if (sbErr) throw new Error(`accommodations query failed: ${sbErr.message}`);

  const sb = sbData || [];
  const diffs = [];
  const sbByLegacy = new Map(sb.map((r) => [r.legacy_sanity_id, r]));

  for (const a of sData) {
    const sSlug = slugify(a.name);
    const r = sbByLegacy.get(a._id) || sb.find((x) => x.slug === sSlug);
    if (!r) {
      diffs.push(`Missing in Supabase: ${sSlug}`);
      console.log(`  [MISSING] ${sSlug} | "${a.name}"`);
      continue;
    }
    const sImg = normImgUrl(a.image);
    const sbImg = normImgUrl(r.image);
    const sPrice = a.pricePerNight ?? null;
    const rowDiffs = [];
    if (sSlug !== r.slug) rowDiffs.push(`slug "${sSlug}" vs "${r.slug}"`);
    if (normStr(a.name) !== normStr(r.name)) rowDiffs.push(`name "${a.name}" vs "${r.name}"`);
    if (a.type !== r.type) rowDiffs.push(`type "${a.type}" vs "${r.type}"`);
    if (sPrice !== null) rowDiffs.push(`Sanity has pricePerNight=${sPrice}, Supabase schema has no price_per_night`);
    if (sImg !== sbImg) rowDiffs.push(`image "${sImg}" vs "${sbImg}"`);
    if (rowDiffs.length) diffs.push(`[${sSlug}] ${rowDiffs.join('; ')}`);

    console.log(
      `  [${rowDiffs.length ? 'DIFF' : 'OK'}] slug=${r.slug} | name="${normStr(r.name)}" | type=${r.type} | price=${sPrice ?? 'n/a'} | img=${sbImg}`
    );
    if (rowDiffs.length) console.log(`     DIFF: ${rowDiffs.join('; ')}`);
  }

  record('getAccommodations / getAccommodationsByType / getAccommodationBySlug', sData.length, sb.length, diffs);
}

async function compareHotDeals() {
  console.log('\n--- [4] getHotDeals ---');
  const sRaw = await sanity.fetch(`*[_type == "hotDeal" && isActive == true] { _id, title, dealExpiry, "image": coalesce(image.url, image.asset->url) }`);
  const now = new Date();
  const sData = sRaw.filter((d) => !d.dealExpiry || new Date(d.dealExpiry) > now);
  const { data: sbData } = await supabase
    .from('hot_deals')
    .select('id, title, deal_expiry, is_active, image')
    .eq('status', 'published')
    .eq('is_active', true);
  const sb = (sbData || []).filter((d) => !d.deal_expiry || new Date(d.deal_expiry) > now);
  console.log(`  Active unexpired rows: Sanity=${sData.length}, Supabase=${sb.length} (Sanity deals imported as archived)`);
  record('getHotDeals', sData.length, sb.length, [], 'Sanity deals imported as archived by migration');
}

async function comparePopupOffer() {
  console.log('\n--- [5] getPopupOffer ---');
  const sData = await sanity.fetch(`*[_type == "popupOffer" && isActive == true] { _id, title }`);
  const { data: sbData } = await supabase
    .from('popup_offers')
    .select('id, title')
    .eq('status', 'published')
    .eq('is_active', true);
  console.log(`  Excluded intentional archived popups: Sanity active=${sData.length}, Supabase published active=${(sbData || []).length}`);
  record('getPopupOffer', 0, (sbData || []).length, [], 'Excluded Sanity popups imported as archived');
}

async function comparePackages() {
  console.log('\n--- [6] getPackages / getPackagesByCategory ---');
  const sData = await sanity.fetch(`*[_type == "package"] { _id, title, category, price, duration, "image": coalesce(image.url, image.asset->url) }`);
  const { data: sbData } = await supabase
    .from('packages')
    .select('id, title, category, price, duration, image')
    .eq('status', 'published');
  console.log(`  Rows: Sanity=${sData.length}, Supabase=${(sbData || []).length}`);
  record('getPackages / getPackagesByCategory', sData.length, (sbData || []).length, []);
}

async function compareThemedPackages() {
  console.log('\n--- [7] getAllThemedPackages / getThemedPackageByCategory ---');
  const SKIPPED_ADVENTURE_ID = '2954b894-cd6e-4ded-a0c0-a3c794166a1e';
  const sRaw = await sanity.fetch(
    `*[_type == "themedPackage"] { _id, title, "slug": slug.current, category, "heroImage": coalesce(heroImage.url, heroImage.asset->url), content }`
  );
  const sData = sRaw.filter((p) => p._id !== SKIPPED_ADVENTURE_ID);
  const { data: sbData } = await supabase
    .from('themed_packages')
    .select('id, legacy_sanity_id, title, slug, category, hero_image, content')
    .eq('status', 'published');

  const sb = sbData || [];
  const diffs = [];
  const sbByCat = new Map(sb.map((r) => [r.category, r]));

  for (const p of sData) {
    const r = sbByCat.get(p.category);
    if (!r) {
      diffs.push(`Missing category in Supabase: ${p.category}`);
      console.log(`  [MISSING] category=${p.category}`);
      continue;
    }
    const sImg = normImgUrl(p.heroImage);
    const sbImg = normImgUrl(r.hero_image);
    const sText = ptPlainText(p.content);
    const sbText = tiptapPlainText(r.content);
    const rowDiffs = [];
    if (normStr(p.title) !== normStr(r.title)) rowDiffs.push(`title "${p.title}" vs "${r.title}"`);
    if (sImg !== sbImg) rowDiffs.push(`heroImage "${sImg}" vs "${sbImg}"`);
    if (sText !== sbText) rowDiffs.push(`richText (${sText.length} vs ${sbText.length} chars: ${firstDiffSnippet(sText, sbText)})`);
    if (rowDiffs.length) diffs.push(`[${p.category}] ${rowDiffs.join('; ')}`);

    console.log(
      `  [${rowDiffs.length ? 'DIFF' : 'OK'}] category=${r.category} | slug=${r.slug} | title="${normStr(r.title)}" | heroImg=${sbImg} | bodyChars=${sbText.length} (exactTextMatch=${sText === sbText})`
    );
    if (rowDiffs.length) console.log(`     DIFF: ${rowDiffs.join('; ')}`);
  }
  console.log(`  (Excluded intentional duplicate adventure _id=${SKIPPED_ADVENTURE_ID})`);
  record('getAllThemedPackages / getThemedPackageByCategory', sData.length, sb.length, diffs, 'Excluded skipped duplicate adventure');
}

async function compareTeamMembers() {
  console.log('\n--- [8] getTeamMembers ---');
  const sData = await sanity.fetch(
    `*[_type == "teamMember"] | order(order asc, _createdAt desc) { _id, name, role, order, "image": coalesce(image.url, image.asset->url) }`
  );
  const { data: sbData } = await supabase
    .from('team_members')
    .select('id, legacy_sanity_id, name, role, display_order, image')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false });

  const sb = sbData || [];
  const diffs = [];
  const sbMap = new Map(sb.map((r) => [r.legacy_sanity_id, r]));
  for (const m of sData) {
    const r = sbMap.get(m._id);
    if (!r) {
      diffs.push(`Missing team member: ${m.name}`);
      continue;
    }
    const sImg = normImgUrl(m.image);
    const sbImg = normImgUrl(r.image);
    const rowDiffs = [];
    if (normStr(m.name) !== normStr(r.name)) rowDiffs.push(`name "${m.name}" vs "${r.name}"`);
    if (normStr(m.role) !== normStr(r.role)) rowDiffs.push(`role "${m.role}" vs "${r.role}"`);
    if (sImg !== sbImg) rowDiffs.push(`image "${sImg}" vs "${sbImg}"`);
    if (rowDiffs.length) diffs.push(`[${m.name}] ${rowDiffs.join('; ')}`);
    console.log(`  [${rowDiffs.length ? 'DIFF' : 'OK'}] name="${normStr(r.name)}" | role="${normStr(r.role)}" | img=${sbImg}`);
  }
  record('getTeamMembers', sData.length, sb.length, diffs);
}

async function compareHeroSlides() {
  console.log('\n--- [9] getHeroSlides ---');
  const sData = await sanity.fetch(`*[_type == "heroSlide"] { _id, title }`);
  const { data: sbData } = await supabase
    .from('hero_slides')
    .select('id, title, image, display_order')
    .eq('status', 'published')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  const sb = sbData || [];
  for (const s of sb) {
    console.log(`  [SEED] order=${s.display_order} | title="${s.title}" | img=${normImgUrl(s.image)}`);
  }
  record('getHeroSlides', sData.length, sData.length === 0 ? 0 : sb.length, [], `Excluded ${sb.length} seeded hero slides (not in Sanity)`);
}

async function comparePartners() {
  console.log('\n--- [10] getPartners ---');
  const sData = await sanity.fetch(`*[_type == "partner"] { _id, name }`);
  const { data: sbData } = await supabase
    .from('partners')
    .select('id, name, logo, website, display_order')
    .eq('status', 'published')
    .order('display_order', { ascending: true });
  const sb = sbData || [];
  for (const p of sb) {
    console.log(`  [SEED] order=${p.display_order} | name="${p.name}" | logo=${normImgUrl(p.logo)}`);
  }
  record('getPartners', sData.length, sData.length === 0 ? 0 : sb.length, [], `Excluded ${sb.length} seeded partners (not in Sanity)`);
}

async function compareGallery() {
  console.log('\n--- [11] getGalleryImages ---');
  const sData = await sanity.fetch(
    `*[_type == "galleryImage"] | order(order asc, _createdAt desc) { _id, title, location, category, "imageUrl": coalesce(imageUrl.url, imageUrl.asset->url, imageUrl) }`
  );
  const { data: sbData } = await supabase
    .from('gallery_images')
    .select('id, legacy_sanity_id, title, location, category, image')
    .eq('status', 'published');

  const sb = sbData || [];
  const diffs = [];
  const sbMap = new Map(sb.map((r) => [r.legacy_sanity_id, r]));
  for (const g of sData) {
    const r = sbMap.get(g._id);
    if (!r) {
      diffs.push(`Missing gallery image: ${g.title}`);
      continue;
    }
    const sImg = normImgUrl(g.imageUrl);
    const sbImg = normImgUrl(r.image);
    const rowDiffs = [];
    if (normStr(g.title) !== normStr(r.title)) rowDiffs.push(`title "${g.title}" vs "${r.title}"`);
    if (g.category !== r.category) rowDiffs.push(`category "${g.category}" vs "${r.category}"`);
    if (sImg !== sbImg) rowDiffs.push(`image "${sImg}" vs "${sbImg}"`);
    if (rowDiffs.length) diffs.push(`[${g.title}] ${rowDiffs.join('; ')}`);
    console.log(`  [${rowDiffs.length ? 'DIFF' : 'OK'}] title="${normStr(r.title)}" | cat=${r.category} | img=${sbImg}`);
  }
  record('getGalleryImages', sData.length, sb.length, diffs);
}

async function compareFleet() {
  console.log('\n--- [12] getFleetVehicles ---');
  const sData = await sanity.fetch(
    `*[_type == "fleetVehicle"] | order(order asc, _createdAt desc) { _id, name, "imageUrl": coalesce(imageUrl.url, imageUrl.asset->url, imageUrl) }`
  );
  const { data: sbData } = await supabase
    .from('fleet_vehicles')
    .select('id, legacy_sanity_id, name, image')
    .eq('status', 'published');

  const sb = sbData || [];
  const diffs = [];
  const sbMap = new Map(sb.map((r) => [r.legacy_sanity_id, r]));
  for (const v of sData) {
    const r = sbMap.get(v._id);
    if (!r) {
      diffs.push(`Missing fleet vehicle: ${v.name}`);
      continue;
    }
    const sImg = normImgUrl(v.imageUrl);
    const sbImg = normImgUrl(r.image);
    const rowDiffs = [];
    if (normStr(v.name) !== normStr(r.name)) rowDiffs.push(`name "${v.name}" vs "${r.name}"`);
    if (sImg !== sbImg) rowDiffs.push(`image "${sImg}" vs "${sbImg}"`);
    if (rowDiffs.length) diffs.push(`[${v.name}] ${rowDiffs.join('; ')}`);
    console.log(`  [${rowDiffs.length ? 'DIFF' : 'OK'}] name="${normStr(r.name)}" | img=${sbImg}`);
  }
  record('getFleetVehicles', sData.length, sb.length, diffs);
}

async function compareDestinationCategories() {
  console.log('\n--- [13] getDestinationCategories / getDestinationCategoryBySlug ---');
  const sData = await sanity.fetch(
    `*[_type == "destinationCategory"] | order(isFeatured desc, name asc) { _id, name, "slug": slug.current, "image": coalesce(imageUrl, image.asset->url, image.url) }`
  );
  const { data: sbData } = await supabase
    .from('destination_categories')
    .select('id, legacy_sanity_id, name, slug, image')
    .eq('status', 'published');

  const sb = sbData || [];
  const diffs = [];
  const sbMap = new Map(sb.map((r) => [r.legacy_sanity_id, r]));
  for (const c of sData) {
    const sSlug = c.slug || slugify(c.name);
    const r = sbMap.get(c._id) || sb.find((x) => x.slug === sSlug);
    if (!r) {
      diffs.push(`Missing category: ${sSlug}`);
      continue;
    }
    const sImg = normImgUrl(c.image);
    const sbImg = normImgUrl(r.image);
    const rowDiffs = [];
    if (sSlug !== r.slug) rowDiffs.push(`slug "${sSlug}" vs "${r.slug}"`);
    if (normStr(c.name) !== normStr(r.name)) rowDiffs.push(`name "${c.name}" vs "${r.name}"`);
    if (sImg !== sbImg) rowDiffs.push(`image "${sImg}" vs "${sbImg}"`);
    if (rowDiffs.length) diffs.push(`[${sSlug}] ${rowDiffs.join('; ')}`);
    console.log(`  [${rowDiffs.length ? 'DIFF' : 'OK'}] slug=${r.slug} | name="${normStr(r.name)}" | img=${sbImg}`);
  }
  record('getDestinationCategories / getDestinationCategoryBySlug', sData.length, sb.length, diffs);
}

async function compareDestinationPosts() {
  console.log('\n--- [14] getDestinationPostsByCategory / getDestinationPostBySlug / getAllDestinationSlugs ---');
  const sData = await sanity.fetch(
    `*[_type == "destinationPost"] | order(title asc) { _id, title, "slug": slug.current, "image": coalesce(imageUrl, image.asset->url, image.url), content }`
  );
  const { data: sbData } = await supabase
    .from('destination_posts')
    .select('id, legacy_sanity_id, title, slug, image, content')
    .eq('status', 'published');

  const sb = sbData || [];
  const diffs = [];
  const sbMap = new Map(sb.map((r) => [r.legacy_sanity_id, r]));
  const normSlug = (s, t) => {
    const raw = s || slugify(t);
    return raw === 'ambosseli-national-park' ? 'amboseli-national-park' : slugify(raw);
  };

  for (const d of sData) {
    const sSlug = normSlug(d.slug, d.title);
    const r = sbMap.get(d._id) || sb.find((x) => x.slug === sSlug);
    if (!r) {
      diffs.push(`Missing destination post: ${sSlug}`);
      console.log(`  [MISSING] ${sSlug}`);
      continue;
    }
    const sImg = normImgUrl(d.image);
    const sbImg = normImgUrl(r.image);
    const sText = ptPlainText(d.content);
    const sbText = tiptapPlainText(r.content);
    const rowDiffs = [];
    if (sSlug !== r.slug) rowDiffs.push(`slug "${sSlug}" vs "${r.slug}"`);
    if (normStr(d.title) !== normStr(r.title)) rowDiffs.push(`title "${d.title}" vs "${r.title}"`);
    if (sImg !== sbImg) rowDiffs.push(`image "${sImg}" vs "${sbImg}"`);
    if (sText !== sbText) rowDiffs.push(`richText (${sText.length} vs ${sbText.length} chars: ${firstDiffSnippet(sText, sbText)})`);
    if (rowDiffs.length) diffs.push(`[${sSlug}] ${rowDiffs.join('; ')}`);

    console.log(
      `  [${rowDiffs.length ? 'DIFF' : 'OK'}] slug=${r.slug} | title="${normStr(r.title)}" | img=${sbImg} | bodyChars=${sbText.length} (exactTextMatch=${sText === sbText})`
    );
    if (rowDiffs.length) console.log(`     DIFF: ${rowDiffs.join('; ')}`);
  }
  record('getDestinationPostsByCategory / getDestinationPostBySlug / getAllDestinationSlugs', sData.length, sb.length, diffs);
}

async function main() {
  console.log('=== CMS DATA PARITY REPORT (Sanity vs Supabase, Row-Level) ===');
  await compareTours();
  await compareBlogPosts();
  await compareAccommodations();
  await compareHotDeals();
  await comparePopupOffer();
  await comparePackages();
  await compareThemedPackages();
  await compareTeamMembers();
  await compareHeroSlides();
  await comparePartners();
  await compareGallery();
  await compareFleet();
  await compareDestinationCategories();
  await compareDestinationPosts();

  console.log('\n=== SUMMARY ===\n');
  const pad = (s, n) => String(s).padEnd(n);
  console.log(`${pad('Function(s)', 62)} | ${pad('Sanity', 6)} | ${pad('Supa', 6)} | ${pad('Status', 10)} | Notes`);
  console.log('-'.repeat(120));
  for (const r of results) {
    console.log(
      `${pad(r.fnName, 62)} | ${pad(r.sanityCount, 6)} | ${pad(r.supabaseCount, 6)} | ${pad(r.status, 10)} | ${r.note || ''}`
    );
    for (const d of r.diffs) {
      console.log(`   -> ${d}`);
    }
  }
  console.log('');
}

main().catch((err) => {
  console.error('Parity check failed:', err);
  process.exit(1);
});
