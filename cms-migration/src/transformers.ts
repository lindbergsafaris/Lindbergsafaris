/**
 * transformers.ts
 *
 * Maps each Sanity document type to the Supabase row shape.
 * Returns null if a document should be skipped.
 */

import { normaliseImage, normaliseImages } from '../lib/cloudinary.ts';
import { portableTextToTiptap, EMPTY_DOC } from '../lib/portableTextToTiptap.ts';
import { slugify, getSlug } from '../lib/slugs.ts';
import type { SanityDoc } from './loader.ts';

const EMPTY_CONTENT = JSON.stringify(EMPTY_DOC);

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

function richText(v: unknown): string {
  if (!v) return EMPTY_CONTENT;
  if (Array.isArray(v)) return JSON.stringify(portableTextToTiptap(v));
  return EMPTY_CONTENT;
}

function isoDate(v: unknown): string | null {
  if (!v) return null;
  if (typeof v !== 'string') return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

/** Map Sanity gallery category to the allowed DB set. */
const GALLERY_CATEGORY_MAP: Record<string, string> = {
  wildlife:    'wildlife',
  landscape:   'landscapes',
  landscapes:  'landscapes',
  safari:      'safari',
  culture:     'culture',
  travel:      'travel',
  beach:       'beach',
  mountain:    'mountains',
  mountains:   'mountains',
  camp:        'camps',
  camps:       'camps',
  lodge:       'camps',
  family:      'family',
  birding:     'birding',
  birdlife:    'birding',
};

function mapGalleryCategory(raw: unknown): string {
  const s = str(raw).toLowerCase();
  return GALLERY_CATEGORY_MAP[s] ?? 'wildlife';
}

// ---------------------------------------------------------------------------
// Destination Categories
// ---------------------------------------------------------------------------

export function transformDestinationCategory(doc: SanityDoc) {
  return {
    legacy_sanity_id: doc._id,
    name: str(doc.name),
    slug: getSlug(doc._id, str((doc.slug as Record<string,unknown>)?.current), str(doc.name)),
    description: str(doc.description) || null,
    icon: str(doc.icon) || null,
    display_order: num(doc.order, 0),
  };
}

// ---------------------------------------------------------------------------
// Destination Posts
// ---------------------------------------------------------------------------

export function transformDestinationPost(doc: SanityDoc, categoryIdMap: Map<string, string>) {
  const catRef = (doc.category as Record<string, unknown>)?._ref as string | undefined;
  const destination_category_id = catRef ? categoryIdMap.get(catRef) ?? null : null;

  const rawSlug = str((doc.slug as Record<string,unknown>)?.current);
  // Fix known typo
  const slug = rawSlug === 'ambosseli-national-park' ? 'amboseli-national-park'
              : getSlug(doc._id, rawSlug, str(doc.title));

  return {
    legacy_sanity_id: doc._id,
    destination_category_id,
    title: str(doc.title),
    slug,
    excerpt: str(doc.excerpt) || null,
    content: richText(doc.content),
    cover_image: normaliseImage(doc.coverImage ?? doc.image) ? JSON.stringify(normaliseImage(doc.coverImage ?? doc.image)) : null,
    gallery: normaliseImages(doc.gallery).length ? JSON.stringify(normaliseImages(doc.gallery)) : null,
    is_featured: bool(doc.isFeatured),
    seo_title: str(doc.seoTitle) || null,
    seo_description: str(doc.seoDescription) || null,
    status: 'published',
    published_at: isoDate(doc._updatedAt ?? doc._createdAt),
  };
}

// ---------------------------------------------------------------------------
// Themed Packages
// ---------------------------------------------------------------------------

export function transformThemedPackage(doc: SanityDoc) {
  const rawSlug = str((doc.slug as Record<string,unknown>)?.current);
  const slug = rawSlug ? rawSlug.toLowerCase().trim().replace(/\s+/g, '-').replace(/-+/g, '-')
              : slugify(str(doc.title));

  return {
    legacy_sanity_id: doc._id,
    title: str(doc.title),
    slug,
    description: richText(doc.description ?? doc.content),
    cover_image: normaliseImage(doc.image ?? doc.coverImage) ? JSON.stringify(normaliseImage(doc.image ?? doc.coverImage)) : null,
    icon: str(doc.icon) || null,
    display_order: num(doc.order, 0),
    is_active: bool(doc.isActive, true),
    seo_title: str(doc.seoTitle) || null,
    seo_description: str(doc.seoDescription) || null,
  };
}

// ---------------------------------------------------------------------------
// Tours
// ---------------------------------------------------------------------------

export function transformTour(doc: SanityDoc) {
  const rawSlug = str((doc.slug as Record<string,unknown>)?.current);
  // "VISIT LAMU" override
  const slug = str(doc.title).toUpperCase().includes('VISIT LAMU') ? 'visit-lamu'
              : getSlug(doc._id, rawSlug, str(doc.title));

  // Itinerary: array of day objects sorted by day number
  const itineraryRaw = Array.isArray(doc.itinerary) ? doc.itinerary as Record<string, unknown>[] : [];
  const itinerary = itineraryRaw
    .map((item) => ({
      day: num(item.day),
      title: str(item.title),
      description: str(item.description),
      accommodation: str(item.accommodation) || null,
      meals: str(item.meals) || null,
    }))
    .sort((a, b) => a.day - b.day);

  const themedRef = (doc.themedPackage as Record<string,unknown>)?._ref as string | undefined;

  return {
    legacy_sanity_id: doc._id,
    title: str(doc.title),
    slug,
    excerpt: str(doc.excerpt) || null,
    content: richText(doc.content),
    cover_image: normaliseImage(doc.image ?? doc.coverImage) ? JSON.stringify(normaliseImage(doc.image ?? doc.coverImage)) : null,
    gallery: normaliseImages(doc.gallery).length ? JSON.stringify(normaliseImages(doc.gallery)) : null,
    duration_days: num(doc.durationDays ?? doc.duration),
    price: num(doc.price ?? doc.priceFrom),
    currency: (str(doc.currency) || 'KES').toUpperCase() as 'KES' | 'USD' | 'EUR',
    group_size: num(doc.groupSize),
    difficulty: str(doc.difficulty) || null,
    is_featured: bool(doc.isFeatured),
    itinerary: JSON.stringify(itinerary),
    reviews_count: num(doc.reviewsCount ?? doc.reviews, 0),
    rating: doc.rating != null ? num(doc.rating) : null,
    includes: Array.isArray(doc.includes) ? JSON.stringify(doc.includes) : JSON.stringify([]),
    excludes: Array.isArray(doc.excludes) ? JSON.stringify(doc.excludes) : JSON.stringify([]),
    destinations: Array.isArray(doc.destinations) ? JSON.stringify(doc.destinations) : JSON.stringify([]),
    _themed_package_sanity_ref: themedRef ?? null,
    seo_title: str(doc.seoTitle) || null,
    seo_description: str(doc.seoDescription) || null,
    status: 'published',
    published_at: isoDate(doc._updatedAt ?? doc._createdAt),
  };
}

// ---------------------------------------------------------------------------
// Blog Posts
// ---------------------------------------------------------------------------

export function transformBlogPost(doc: SanityDoc) {
  const rawSlug = str((doc.slug as Record<string,unknown>)?.current);
  const title = str(doc.title);
  const slug = title.toLowerCase().includes('altitude training') ? 'altitude-training-kenya'
              : getSlug(doc._id, rawSlug, title);

  const authorRef = (doc.author as Record<string,unknown>)?._ref as string | undefined;

  return {
    legacy_sanity_id: doc._id,
    title,
    slug,
    excerpt: str(doc.excerpt) || null,
    content: richText(doc.content ?? doc.body),
    cover_image: normaliseImage(doc.coverImage ?? doc.mainImage) ? JSON.stringify(normaliseImage(doc.coverImage ?? doc.mainImage)) : null,
    category: str(doc.category),
    tags: Array.isArray(doc.tags) ? JSON.stringify(doc.tags) : JSON.stringify([]),
    _author_sanity_ref: authorRef ?? null,
    seo_title: str(doc.seoTitle) || null,
    seo_description: str(doc.seoDescription) || null,
    status: 'published',
    published_at: isoDate(doc.publishedAt ?? doc._updatedAt ?? doc._createdAt),
  };
}

// ---------------------------------------------------------------------------
// Accommodations
// ---------------------------------------------------------------------------

export function transformAccommodation(doc: SanityDoc) {
  const name = str(doc.name ?? doc.title);
  const slug = slugify(name);

  const destRef = (doc.destination as Record<string,unknown>)?._ref as string | undefined;

  // amenities: Sanity stores them as array of objects with name key
  const amenitiesRaw = Array.isArray(doc.amenities) ? doc.amenities as Record<string,unknown>[] : [];
  const amenities = amenitiesRaw.map((a) => str(a.name ?? a)).filter(Boolean);

  return {
    legacy_sanity_id: doc._id,
    name,
    slug,
    type: str(doc.type ?? doc.accommodationType),
    description: richText(doc.description ?? doc.content),
    cover_image: normaliseImage(doc.image ?? doc.coverImage) ? JSON.stringify(normaliseImage(doc.image ?? doc.coverImage)) : null,
    gallery: normaliseImages(doc.gallery ?? doc.images).length ? JSON.stringify(normaliseImages(doc.gallery ?? doc.images)) : null,
    amenities: JSON.stringify(amenities),
    price_per_night: doc.pricePerNight != null ? num(doc.pricePerNight) : null,
    is_featured: bool(doc.isFeatured),
    _destination_sanity_ref: destRef ?? null,
    seo_title: str(doc.seoTitle) || null,
    seo_description: str(doc.seoDescription) || null,
    status: 'published',
    published_at: isoDate(doc._updatedAt ?? doc._createdAt),
  };
}

// ---------------------------------------------------------------------------
// Hot Deals  (imported as archived)
// ---------------------------------------------------------------------------

export function transformHotDeal(doc: SanityDoc) {
  const tourRef = (doc.tour as Record<string,unknown>)?._ref as string | undefined;
  return {
    legacy_sanity_id: doc._id,
    title: str(doc.title),
    description: richText(doc.description ?? doc.content),
    image: normaliseImage(doc.image) ? JSON.stringify(normaliseImage(doc.image)) : null,
    original_price: num(doc.originalPrice ?? doc.price),
    discounted_price: num(doc.discountedPrice ?? doc.salePrice),
    discount_percentage: doc.discountPercentage != null ? num(doc.discountPercentage) : null,
    valid_from: isoDate(doc.validFrom ?? doc.startDate),
    valid_until: isoDate(doc.validUntil ?? doc.endDate),
    _tour_sanity_ref: tourRef ?? null,
    status: 'archived',
  };
}

// ---------------------------------------------------------------------------
// Popup Offers  (imported as archived)
// ---------------------------------------------------------------------------

export function transformPopupOffer(doc: SanityDoc) {
  return {
    legacy_sanity_id: doc._id,
    title: str(doc.title),
    message: richText(doc.message ?? doc.content),
    button_text: str(doc.buttonText) || null,
    button_link: str(doc.buttonLink ?? doc.link) || null,
    image: normaliseImage(doc.image) ? JSON.stringify(normaliseImage(doc.image)) : null,
    valid_from: isoDate(doc.validFrom ?? doc.startDate),
    valid_until: isoDate(doc.validUntil ?? doc.endDate),
    status: 'archived',
  };
}

// ---------------------------------------------------------------------------
// Team Members
// ---------------------------------------------------------------------------

export function transformTeamMember(doc: SanityDoc) {
  return {
    legacy_sanity_id: doc._id,
    name: str(doc.name),
    role: str(doc.role ?? doc.position),
    bio: richText(doc.bio ?? doc.description),
    photo: normaliseImage(doc.photo ?? doc.image) ? JSON.stringify(normaliseImage(doc.photo ?? doc.image)) : null,
    display_order: num(doc.order, 0),
    is_active: bool(doc.isActive, true),
  };
}

// ---------------------------------------------------------------------------
// Gallery Images
// ---------------------------------------------------------------------------

export function transformGalleryImage(doc: SanityDoc) {
  return {
    legacy_sanity_id: doc._id,
    image: normaliseImage(doc.image ?? doc.photo) ? JSON.stringify(normaliseImage(doc.image ?? doc.photo)) : null,
    alt: str(doc.alt ?? doc.title) || null,
    caption: str(doc.caption) || null,
    category: mapGalleryCategory(doc.category),
    display_order: num(doc.order, 0),
    is_featured: bool(doc.isFeatured),
  };
}

// ---------------------------------------------------------------------------
// Fleet Vehicles
// ---------------------------------------------------------------------------

export function transformFleetVehicle(doc: SanityDoc) {
  const name = str(doc.name ?? doc.title).replace(/\s+/g, ' ').trim(); // trim internal whitespace
  return {
    legacy_sanity_id: doc._id,
    name,
    description: richText(doc.description ?? doc.content),
    image: normaliseImage(doc.image ?? doc.photo) ? JSON.stringify(normaliseImage(doc.image ?? doc.photo)) : null,
    passenger_capacity: doc.capacity != null ? num(doc.capacity) : (doc.passengerCapacity != null ? num(doc.passengerCapacity) : null),
    features: Array.isArray(doc.features) ? JSON.stringify(doc.features) : JSON.stringify([]),
    display_order: num(doc.order, 0),
  };
}
