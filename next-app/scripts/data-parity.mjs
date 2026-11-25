/**
 * scripts/data-parity.mjs
 *
 * Compares every public data function's output between Sanity (CMS_SOURCE=sanity)
 * and Supabase (CMS_SOURCE=supabase):
 *   - Row counts
 *   - Slugs
 *   - Titles / names
 *   - Prices & durations
 *   - Image URLs
 *   - Rich-text plain text (Portable Text vs rendered Tiptap HTML)
 *
 * Usage (from next-app/):
 *   node scripts/data-parity.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { createClient as createSanityClient } from 'next-sanity';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Node, mergeAttributes } from '@tiptap/core';
import { generateHTML } from '@tiptap/html';
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
// Helpers (matching src/lib/slugUtils.ts & src/lib/tiptap-html.ts)
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

function normalizeSet(arr) {
  return [...new Set(arr.filter(Boolean))].sort();
}

function setDiff(a, b) {
  const setB = new Set(b);
  return a.filter((x) => !setB.has(x));
}

// ---------------------------------------------------------------------------
// Parity checks
// ---------------------------------------------------------------------------

const results = [];

function record(fnName, sanityCount, supabaseCount, diffs, note = '') {
  const status = diffs.length === 0 && sanityCount === supabaseCount ? 'MATCH' : diffs.length === 0 ? 'COUNT_DIFF' : 'DIFF';
  results.push({ fnName, sanityCount, supabaseCount, status, diffs, note });
}

async function compareTours() {
  const sData = await sanity.fetch(
    `*[_type == "tour"] | order(_createdAt desc) { _id, title, "slug": slug.current, duration, groupSize, price, "images": images[]{ "url": coalesce(url, asset->url) } }`
  );
  const { data: sbData } = await supabase
    .from('tours')
    .select('id, legacy_sanity_id, title, slug, duration, group_size, price, images')
    .eq('status', 'published');

  const sb = sbData || [];
  const diffs = [];

  const sSlugs = normalizeSet(sData.map((t) => slugify(t.slug || t.title)));
  const sbSlugs = normalizeSet(sb.map((t) => t.slug));
  const missingInSb = setDiff(sSlugs, sbSlugs);
  const extraInSb = setDiff(sbSlugs, sSlugs);
  if (missingInSb.length) diffs.push(`Missing slugs in Supabase: ${missingInSb.join(', ')}`);
  if (extraInSb.length) diffs.push(`Extra slugs in Supabase: ${extraInSb.join(', ')}`);

  const sbBySlug = new Map(sb.map((r) => [r.slug, r]));
  for (const t of sData) {
    const sl = slugify(t.slug || t.title);
    const r = sbBySlug.get(sl);
    if (!r) continue;
    if ((t.title || '').trim() !== (r.title || '').trim()) diffs.push(`Title mismatch [${sl}]: "${t.title}" vs "${r.title}"`);
    if (Number(t.price || 0) !== Number(r.price || 0)) diffs.push(`Price mismatch [${sl}]: ${t.price} vs ${r.price}`);
    if ((t.duration || '').trim() !== (r.duration || '').trim()) diffs.push(`Duration mismatch [${sl}]: "${t.duration}" vs "${r.duration}"`);
    const sImgCount = (t.images || []).map(normImgUrl).filter(Boolean).length;
    const sbImgCount = (r.images || []).map(normImgUrl).filter(Boolean).length;
    if (sImgCount !== sbImgCount) diffs.push(`Image count mismatch [${sl}]: ${sImgCount} vs ${sbImgCount}`);
  }

  record('getTours / getAllTourSlugs / getTourBySlug', sData.length, sb.length, diffs);
}

async function compareBlogPosts() {
  const sData = await sanity.fetch(
    `*[_type == "blogPost"] | order(publishedAt desc) { _id, title, "slug": slug.current, "featuredImage": coalesce(featuredImage.url, featuredImage.asset->url), content }`
  );
  const { data: sbData } = await supabase
    .from('blog_posts')
    .select('id, legacy_sanity_id, title, slug, featured_image, content')
    .eq('status', 'published');

  const sb = sbData || [];
  const diffs = [];

  const sSlugs = normalizeSet(sData.map((b) => (b.title?.toLowerCase().includes('altitude training') ? 'altitude-training-kenya' : slugify(b.slug || b.title))));
  const sbSlugs = normalizeSet(sb.map((b) => b.slug));
  const missing = setDiff(sSlugs, sbSlugs);
  const extra = setDiff(sbSlugs, sSlugs);
  if (missing.length) diffs.push(`Missing slugs in Supabase: ${missing.join(', ')}`);
  if (extra.length) diffs.push(`Extra slugs in Supabase: ${extra.join(', ')}`);

  const sbBySlug = new Map(sb.map((r) => [r.slug, r]));
  for (const b of sData) {
    const sl = b.title?.toLowerCase().includes('altitude training') ? 'altitude-training-kenya' : slugify(b.slug || b.title);
    const r = sbBySlug.get(sl);
    if (!r) continue;
    if ((b.title || '').trim() !== (r.title || '').trim()) diffs.push(`Title mismatch [${sl}]`);
    const sText = ptPlainText(b.content);
    const sbText = tiptapPlainText(r.content);
    if (sText !== sbText) {
      diffs.push(`Rich-text plain mismatch [${sl}] (sanity ${sText.length} chars vs supabase ${sbText.length} chars)`);
    }
    const sImg = normImgUrl(b.featuredImage);
    const sbImg = normImgUrl(r.featured_image);
    if (Boolean(sImg) !== Boolean(sbImg)) diffs.push(`Featured image presence mismatch [${sl}]`);
  }

  record('getBlogPosts / getAllBlogSlugs / getBlogPostBySlug', sData.length, sb.length, diffs);
}

async function compareAccommodations() {
  const sData = await sanity.fetch(
    `*[_type == "accommodation"] | order(name asc) { _id, name, type, "image": coalesce(image.url, image.asset->url) }`
  );
  const { data: sbData } = await supabase
    .from('accommodations')
    .select('id, legacy_sanity_id, name, slug, type, image')
    .eq('status', 'published');

  const sb = sbData || [];
  const diffs = [];

  const sSlugs = normalizeSet(sData.map((a) => slugify(a.name)));
  const sbSlugs = normalizeSet(sb.map((a) => a.slug));
  const missing = setDiff(sSlugs, sbSlugs);
  const extra = setDiff(sbSlugs, sSlugs);
  if (missing.length) diffs.push(`Missing slugs in Supabase: ${missing.join(', ')}`);
  if (extra.length) diffs.push(`Extra slugs in Supabase: ${extra.join(', ')}`);

  record('getAccommodations / getAccommodationsByType / getAccommodationBySlug', sData.length, sb.length, diffs);
}

async function compareHotDeals() {
  const sRaw = await sanity.fetch(`*[_type == "hotDeal" && isActive == true] { _id, title, dealExpiry }`);
  const now = new Date();
  const sData = sRaw.filter((d) => !d.dealExpiry || new Date(d.dealExpiry) > now);
  const { data: sbData } = await supabase
    .from('hot_deals')
    .select('id, title, deal_expiry, is_active')
    .eq('status', 'published')
    .eq('is_active', true);
  const sb = (sbData || []).filter((d) => !d.deal_expiry || new Date(d.deal_expiry) > now);
  record('getHotDeals', sData.length, sb.length, [], 'Sanity deals imported as archived by migration');
}

async function comparePopupOffer() {
  const sData = await sanity.fetch(`*[_type == "popupOffer" && isActive == true] { _id, title }`);
  const { data: sbData } = await supabase
    .from('popup_offers')
    .select('id, title')
    .eq('status', 'published')
    .eq('is_active', true);
  record('getPopupOffer', sData.length, (sbData || []).length, [], 'Sanity popups imported as archived by migration');
}

async function comparePackages() {
  const sData = await sanity.fetch(`*[_type == "package"] { _id, title, category, price, duration }`);
  const { data: sbData } = await supabase
    .from('packages')
    .select('id, title, category, price, duration')
    .eq('status', 'published');
  record('getPackages / getPackagesByCategory', sData.length, (sbData || []).length, []);
}

async function compareThemedPackages() {
  const sData = await sanity.fetch(`*[_type == "themedPackage"] { _id, title, category, content }`);
  const { data: sbData } = await supabase
    .from('themed_packages')
    .select('id, legacy_sanity_id, title, category, content')
    .eq('status', 'published');
  const sb = sbData || [];
  const diffs = [];
  const sbByCat = new Map(sb.map((r) => [r.category, r]));
  for (const p of sData) {
    if (p._id === '2954b894-cd6e-4ded-a0c0-a3c794166a1e') continue; // intentionally skipped duplicate adventure
    const r = sbByCat.get(p.category);
    if (!r) {
      diffs.push(`Missing category in Supabase: ${p.category}`);
      continue;
    }
    const sText = ptPlainText(p.content);
    const sbText = tiptapPlainText(r.content);
    if (sText !== sbText) {
      diffs.push(`Rich-text mismatch [${p.category}]: ${sText.length} vs ${sbText.length} chars`);
    }
  }
  record('getAllThemedPackages / getThemedPackageByCategory', sData.length, sb.length, diffs, 'Sanity has 1 intentionally skipped duplicate adventure');
}

async function compareSimpleList(fnName, sanityType, sbTable, labelField = 'title') {
  const sData = await sanity.fetch(`*[_type == "${sanityType}"] { _id, ${labelField} }`);
  const { data: sbData } = await supabase.from(sbTable).select(`id, ${labelField}`).eq('status', 'published');
  const sb = sbData || [];
  const sNames = normalizeSet(sData.map((x) => (x[labelField] || '').replace(/\s+/g, ' ').trim()));
  const sbNames = normalizeSet(sb.map((x) => (x[labelField] || '').replace(/\s+/g, ' ').trim()));
  const diffs = [];
  const missing = setDiff(sNames, sbNames);
  if (missing.length) diffs.push(`Missing in Supabase: ${missing.join(', ')}`);
  record(fnName, sData.length, sb.length, diffs);
}

async function compareDestinationCategories() {
  const sData = await sanity.fetch(`*[_type == "destinationCategory"] { _id, name, "slug": slug.current }`);
  const { data: sbData } = await supabase
    .from('destination_categories')
    .select('id, name, slug')
    .eq('status', 'published');
  const sb = sbData || [];
  const sSlugs = normalizeSet(sData.map((c) => c.slug || slugify(c.name)));
  const sbSlugs = normalizeSet(sb.map((c) => c.slug));
  const diffs = [];
  const missing = setDiff(sSlugs, sbSlugs);
  if (missing.length) diffs.push(`Missing slugs: ${missing.join(', ')}`);
  record('getDestinationCategories / getDestinationCategoryBySlug', sData.length, sb.length, diffs);
}

async function compareDestinationPosts() {
  const sData = await sanity.fetch(`*[_type == "destinationPost"] { _id, title, "slug": slug.current, content }`);
  const { data: sbData } = await supabase
    .from('destination_posts')
    .select('id, legacy_sanity_id, title, slug, content')
    .eq('status', 'published');
  const sb = sbData || [];
  const diffs = [];

  const normSlug = (s, t) => {
    const raw = s || slugify(t);
    return raw === 'ambosseli-national-park' ? 'amboseli-national-park' : slugify(raw);
  };
  const sSlugs = normalizeSet(sData.map((d) => normSlug(d.slug, d.title)));
  const sbSlugs = normalizeSet(sb.map((d) => d.slug));
  const missing = setDiff(sSlugs, sbSlugs);
  const extra = setDiff(sbSlugs, sSlugs);
  if (missing.length) diffs.push(`Missing slugs: ${missing.join(', ')}`);
  if (extra.length) diffs.push(`Extra slugs: ${extra.join(', ')}`);

  const sbBySlug = new Map(sb.map((r) => [r.slug, r]));
  for (const d of sData) {
    const sl = normSlug(d.slug, d.title);
    const r = sbBySlug.get(sl);
    if (!r) continue;
    const sText = ptPlainText(d.content);
    const sbText = tiptapPlainText(r.content);
    if (sText !== sbText) {
      diffs.push(`Rich-text mismatch [${sl}]: ${sText.length} vs ${sbText.length} chars`);
    }
  }
  record('getDestinationPostsByCategory / getDestinationPostBySlug / getAllDestinationSlugs', sData.length, sb.length, diffs);
}

async function main() {
  await compareTours();
  await compareBlogPosts();
  await compareAccommodations();
  await compareHotDeals();
  await comparePopupOffer();
  await comparePackages();
  await compareThemedPackages();
  await compareSimpleList('getTeamMembers', 'teamMember', 'team_members', 'name');
  await compareSimpleList('getHeroSlides', 'heroSlide', 'hero_slides', 'title');
  await compareSimpleList('getPartners', 'partner', 'partners', 'name');
  await compareSimpleList('getGalleryImages', 'galleryImage', 'gallery_images', 'title');
  await compareSimpleList('getFleetVehicles', 'fleetVehicle', 'fleet_vehicles', 'name');
  await compareDestinationCategories();
  await compareDestinationPosts();

  console.log('\n=== CMS DATA PARITY REPORT (Sanity vs Supabase) ===\n');
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
