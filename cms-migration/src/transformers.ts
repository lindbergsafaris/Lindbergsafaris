/**
 * transformers.ts
 *
 * Maps each Sanity document type to the exact Supabase Postgres row shape
 * defined in supabase/migrations/0002_tables.sql.
 *
 * Note on JSONB columns: values are kept as native JS objects / arrays
 * (not pre-stringified) so @supabase/supabase-js sends valid JSONB objects/arrays
 * matching all jsonb_typeof(...) CHECK constraints.
 */

import { normaliseImage, normaliseImages } from '../lib/cloudinary.ts';
import { portableTextToTiptap, EMPTY_DOC, type TiptapDoc } from '../lib/portableTextToTiptap.ts';
import { slugify, getSlug } from '../lib/slugs.ts';
import type { SanityDoc } from './loader.ts';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v.trim() : fallback;
}

function num(v: unknown, fallback = 0): number {
  const n = Number(v);
  return isNaN(n) ? fallback : n;
}

function bool(v: unknown, fallback = false): boolean {
  return typeof v === 'boolean' ? v : fallback;
}

function stringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => (typeof item === 'string' ? item.trim() : String(item ?? '').trim()))
    .filter(Boolean);
}

function richTextDoc(v: unknown): TiptapDoc {
  if (!v) return EMPTY_DOC;
  if (Array.isArray(v)) return portableTextToTiptap(v);
  return EMPTY_DOC;
}

function isoDate(v: unknown): string | null {
  if (!v || typeof v !== 'string') return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * Identity mapping for gallery_images.category.
 * DB CHECK constraint: ('wildlife', 'scenery', 'tours', 'accommodations', 'adventures').
 */
const ALLOWED_GALLERY_CATEGORIES = new Set([
  'wildlife',
  'scenery',
  'tours',
  'accommodations',
  'adventures',
]);

function mapGalleryCategory(raw: unknown): string {
  const s = str(raw).toLowerCase();
  if (!s) return 'wildlife';
  if (ALLOWED_GALLERY_CATEGORIES.has(s)) return s;
  throw new Error(
    `Gallery image has unrecognised category: "${s}". Allowed values: ${[...ALLOWED_GALLERY_CATEGORIES].join(', ')}`
  );
}

// ---------------------------------------------------------------------------
// 1. Destination Categories
// ---------------------------------------------------------------------------

const DESTINATION_CATEGORY_DISPLAY_ORDER: Record<string, number> = {
  kenya: 1,
  africa: 2,
  asia: 3,
  europe: 4,
  'latin-america': 5,
  'middle-east': 6,
  oceania: 7,
  'usa-canada': 8,
};

export function transformDestinationCategory(doc: SanityDoc) {
  const rawSlug = str((doc.slug as Record<string, unknown>)?.current);
  const slug = getSlug(doc._id, rawSlug, str(doc.name));
  return {
    legacy_sanity_id: doc._id,
    name: str(doc.name),
    slug,
    description: str(doc.description) || null,
    image: normaliseImage(doc.imageUrl ?? doc.image),
    is_featured: bool(doc.isFeatured, false),
    display_order: DESTINATION_CATEGORY_DISPLAY_ORDER[slug] ?? 100,
    status: 'published' as const,
    published_at: isoDate(doc._updatedAt ?? doc._createdAt),
    created_at: isoDate(doc._createdAt) ?? new Date().toISOString(),
    updated_at: isoDate(doc._updatedAt) ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 2. Destination Posts
// ---------------------------------------------------------------------------

export function transformDestinationPost(
  doc: SanityDoc,
  categoryIdMap: Map<string, string>
) {
  const catRef = (doc.category as Record<string, unknown>)?._ref as string | undefined;
  const category_id = catRef ? categoryIdMap.get(catRef) ?? null : null;

  const rawSlug = str((doc.slug as Record<string, unknown>)?.current);
  const slug =
    rawSlug === 'ambosseli-national-park'
      ? 'amboseli-national-park'
      : getSlug(doc._id, rawSlug, str(doc.title));

  return {
    legacy_sanity_id: doc._id,
    category_id,
    title: str(doc.title),
    slug,
    excerpt: str(doc.excerpt) || null,
    image: normaliseImage(doc.imageUrl ?? doc.image ?? doc.coverImage),
    tour_count: Math.max(0, Math.trunc(num(doc.tourCount, 0))),
    content: richTextDoc(doc.content),
    seo_title: str(doc.seoTitle) || null,
    seo_description: str(doc.seoDescription) || null,
    status: 'published' as const,
    published_at: isoDate(doc._updatedAt ?? doc._createdAt),
    created_at: isoDate(doc._createdAt) ?? new Date().toISOString(),
    updated_at: isoDate(doc._updatedAt) ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 3. Themed Packages
// ---------------------------------------------------------------------------

export function transformThemedPackage(doc: SanityDoc) {
  const rawSlug = str((doc.slug as Record<string, unknown>)?.current);
  const slug = rawSlug
    ? slugify(rawSlug)
    : slugify(str(doc.title));

  return {
    legacy_sanity_id: doc._id,
    title: str(doc.title),
    slug,
    category: str(doc.category).toLowerCase(),
    hero_image: normaliseImage(doc.heroImage ?? doc.image ?? doc.coverImage),
    description: str(doc.description),
    content: richTextDoc(doc.content),
    seo_title: str(doc.seoTitle) || null,
    seo_description: str(doc.seoDescription) || null,
    status: 'published' as const,
    published_at: isoDate(doc._updatedAt ?? doc._createdAt),
    created_at: isoDate(doc._createdAt) ?? new Date().toISOString(),
    updated_at: isoDate(doc._updatedAt) ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 4. Tours
// ---------------------------------------------------------------------------

export function transformTour(doc: SanityDoc) {
  const rawSlug = str((doc.slug as Record<string, unknown>)?.current);
  const slug = str(doc.title).toUpperCase().includes('VISIT LAMU')
    ? 'visit-lamu'
    : getSlug(doc._id, rawSlug, str(doc.title));

  const itineraryRaw = Array.isArray(doc.itinerary)
    ? (doc.itinerary as Record<string, unknown>[])
    : [];
  const itinerary = itineraryRaw
    .map((item) => ({
      day: num(item.day),
      title: str(item.title),
      description: str(item.description),
      accommodation: str(item.accommodation) || null,
      meals: str(item.meals) || null,
    }))
    .sort((a, b) => a.day - b.day);

  const rawDiff = str(doc.difficulty).toLowerCase();
  const difficulty =
    rawDiff === 'easy' || rawDiff === 'moderate' || rawDiff === 'challenging'
      ? rawDiff
      : null;

  return {
    legacy_sanity_id: doc._id,
    title: str(doc.title),
    slug,
    location: str(doc.location) || 'Unknown',
    description: str(doc.description),
    duration: str(doc.duration) || 'Flexible',
    group_size: str(doc.groupSize) || null,
    difficulty,
    price: num(doc.price ?? doc.priceFrom),
    currency: (str(doc.currency) || 'KES').toUpperCase() as 'KES' | 'USD' | 'EUR',
    rating: doc.rating != null ? num(doc.rating) : null,
    reviews: Math.max(0, Math.trunc(num(doc.reviews ?? doc.reviewsCount, 0))),
    images: normaliseImages(doc.images ?? doc.gallery),
    highlights: stringArray(doc.highlights),
    itinerary,
    included: stringArray(doc.included ?? doc.includes),
    excluded: stringArray(doc.excluded ?? doc.excludes),
    featured: bool(doc.featured ?? doc.isFeatured, false),
    seo_title: str(doc.seoTitle) || null,
    seo_description: str(doc.seoDescription) || null,
    status: 'published' as const,
    published_at: isoDate(doc._updatedAt ?? doc._createdAt),
    created_at: isoDate(doc._createdAt) ?? new Date().toISOString(),
    updated_at: isoDate(doc._updatedAt) ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 5. Blog Posts
// ---------------------------------------------------------------------------

export function transformBlogPost(doc: SanityDoc) {
  const rawSlug = str((doc.slug as Record<string, unknown>)?.current);
  const title = str(doc.title);
  const slug = title.toLowerCase().includes('altitude training')
    ? 'altitude-training-kenya'
    : getSlug(doc._id, rawSlug, title);

  return {
    legacy_sanity_id: doc._id,
    title,
    slug,
    excerpt: str(doc.excerpt),
    content: richTextDoc(doc.content ?? doc.body),
    featured_image: normaliseImage(doc.featuredImage ?? doc.coverImage ?? doc.mainImage),
    author: str(doc.author) || 'Lindberg Safaris',
    category: str(doc.category),
    read_time: str(doc.readTime) || null,
    seo_title: str(doc.seoTitle) || null,
    seo_description: str(doc.seoDescription) || null,
    status: 'published' as const,
    published_at: isoDate(doc.publishedAt ?? doc._updatedAt ?? doc._createdAt),
    created_at: isoDate(doc._createdAt) ?? new Date().toISOString(),
    updated_at: isoDate(doc._updatedAt) ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 6. Accommodations
// ---------------------------------------------------------------------------

export function transformAccommodation(doc: SanityDoc) {
  const name = str(doc.name ?? doc.title);
  const slug = slugify(name);

  // Preserve { name, image? } objects to match 0002_tables.sql & next-app Amenity type
  const amenitiesRaw: unknown[] = Array.isArray(doc.amenities) ? doc.amenities : [];
  const amenities = amenitiesRaw
    .map((a) => {
      if (typeof a === 'string') {
        const aName = a.trim();
        return aName ? { name: aName } : null;
      }
      if (typeof a === 'object' && a !== null) {
        const obj = a as Record<string, unknown>;
        const aName = str(obj.name);
        if (!aName) return null;
        const aImg = normaliseImage(obj.image);
        return aImg ? { name: aName, image: aImg } : { name: aName };
      }
      return null;
    })
    .filter((x): x is { name: string; image?: NonNullable<ReturnType<typeof normaliseImage>> } => x !== null);

  return {
    legacy_sanity_id: doc._id,
    name,
    slug,
    type: str(doc.type ?? doc.accommodationType),
    location: str(doc.location) || null,
    description: typeof doc.description === 'string' ? doc.description.trim() || null : null,
    image: normaliseImage(doc.image ?? doc.coverImage),
    rating: doc.rating != null ? num(doc.rating) : null,
    amenities,
    sections: Array.isArray(doc.sections) ? doc.sections : [],
    seo_title: str(doc.seoTitle) || null,
    seo_description: str(doc.seoDescription) || null,
    status: 'published' as const,
    published_at: isoDate(doc._updatedAt ?? doc._createdAt),
    created_at: isoDate(doc._createdAt) ?? new Date().toISOString(),
    updated_at: isoDate(doc._updatedAt) ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 7. Hot Deals (imported as archived)
// ---------------------------------------------------------------------------

export function transformHotDeal(doc: SanityDoc) {
  const publishedAt = isoDate(doc._updatedAt ?? doc._createdAt);
  return {
    legacy_sanity_id: doc._id,
    title: str(doc.title),
    image: normaliseImage(doc.image),
    whatsapp_number: str(doc.whatsappNumber) || '+254743377948',
    whatsapp_message: str(doc.whatsappMessage) || null,
    deal_expiry: isoDate(doc.dealExpiry) ?? publishedAt ?? new Date().toISOString(),
    tag: str(doc.tag) || 'ON SALE',
    is_active: bool(doc.isActive, true),
    status: 'archived' as const,
    published_at: publishedAt,
    created_at: isoDate(doc._createdAt) ?? new Date().toISOString(),
    updated_at: isoDate(doc._updatedAt) ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 8. Popup Offers (imported as archived)
// ---------------------------------------------------------------------------

export function transformPopupOffer(doc: SanityDoc) {
  return {
    legacy_sanity_id: doc._id,
    title: str(doc.title),
    description: typeof doc.description === 'string' ? doc.description.trim() || null : null,
    image: normaliseImage(doc.image),
    cta_text: str(doc.ctaText) || 'Claim Offer',
    cta_link: str(doc.ctaLink ?? doc.link) || '/contact',
    is_active: bool(doc.isActive, true),
    start_date: isoDate(doc.startDate),
    end_date: isoDate(doc.endDate),
    status: 'archived' as const,
    published_at: isoDate(doc._updatedAt ?? doc._createdAt),
    created_at: isoDate(doc._createdAt) ?? new Date().toISOString(),
    updated_at: isoDate(doc._updatedAt) ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 9. Team Members
// ---------------------------------------------------------------------------

export function transformTeamMember(doc: SanityDoc) {
  return {
    legacy_sanity_id: doc._id,
    name: str(doc.name),
    role: str(doc.role ?? doc.position),
    image: normaliseImage(doc.image ?? doc.photo),
    display_order: num(doc.order, 0),
    status: 'published' as const,
    published_at: isoDate(doc._updatedAt ?? doc._createdAt),
    created_at: isoDate(doc._createdAt) ?? new Date().toISOString(),
    updated_at: isoDate(doc._updatedAt) ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 10. Gallery Images
// ---------------------------------------------------------------------------

export function transformGalleryImage(doc: SanityDoc) {
  return {
    legacy_sanity_id: doc._id,
    title: str(doc.title ?? doc.alt) || 'Untitled',
    location: str(doc.location) || null,
    category: mapGalleryCategory(doc.category),
    image: normaliseImage(doc.imageUrl ?? doc.image ?? doc.photo),
    display_order: num(doc.order, 0),
    status: 'published' as const,
    published_at: isoDate(doc._updatedAt ?? doc._createdAt),
    created_at: isoDate(doc._createdAt) ?? new Date().toISOString(),
    updated_at: isoDate(doc._updatedAt) ?? new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 11. Fleet Vehicles
// ---------------------------------------------------------------------------

export function transformFleetVehicle(doc: SanityDoc) {
  const name = str(doc.name ?? doc.title).replace(/\s+/g, ' ').trim();
  return {
    legacy_sanity_id: doc._id,
    name,
    image: normaliseImage(doc.imageUrl ?? doc.image ?? doc.photo),
    display_order: num(doc.order, 0),
    status: 'published' as const,
    published_at: isoDate(doc._updatedAt ?? doc._createdAt),
    created_at: isoDate(doc._createdAt) ?? new Date().toISOString(),
    updated_at: isoDate(doc._updatedAt) ?? new Date().toISOString(),
  };
}
