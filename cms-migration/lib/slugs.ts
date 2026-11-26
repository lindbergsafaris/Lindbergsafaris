/**
 * slugs.ts
 *
 * Slug utilities for the migration.
 * Uses the EXACT same slugify() function as next-app/src/lib/slugUtils.ts.
 */

/** Convert any string to a URL-safe lowercase slug. Copied from next-app/src/lib/slugUtils.ts. */
export function slugify(text: string): string {
  return (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^a-z0-9\s-]/g, '')   // keep alphanum, space, hyphen
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Returns true if the string looks like a Sanity document _id (UUID). */
export function isUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

/**
 * Hardcoded slug overrides keyed by Sanity _id.
 * These override whatever slug is stored in the NDJSON.
 */
export const SLUG_OVERRIDES: Record<string, string> = {
  // tour: "VISIT LAMU"
  'tour-visit-lamu':              'visit-lamu',
  // blog: "Altitude Training Kenya"
  'blogPost-altitude-training':   'altitude-training-kenya',
  // themed package
  'themedPackage-journey-faith':  'the-journey-of-faith-transformative-pilgrimage-experiences',
  // destination: fix typo ambosseli -> amboseli
  'ambosseli-national-park':      'amboseli-national-park',
};

/**
 * Returns the canonical slug for a document, applying overrides.
 * @param sanityId  The Sanity _id
 * @param rawSlug   The slug value from the NDJSON (may be absent / dirty)
 * @param title     Fallback title to slugify when rawSlug is absent
 */
export function getSlug(sanityId: string, rawSlug: string | undefined, title?: string): string {
  // 1. Check override by _id
  if (SLUG_OVERRIDES[sanityId]) return SLUG_OVERRIDES[sanityId];

  // 2. Check override by rawSlug (e.g. typo fix)
  if (rawSlug && SLUG_OVERRIDES[rawSlug]) return SLUG_OVERRIDES[rawSlug];

  // 3. Use rawSlug (trimmed + lowercased)
  if (rawSlug && rawSlug.trim()) {
    const cleaned = slugify(rawSlug.trim());
    if (cleaned) return cleaned;
  }

  // 4. Derive from title
  if (title) {
    const derived = slugify(title);
    if (derived) return derived;
  }

  throw new Error(`Cannot derive slug for Sanity document ${sanityId}`);
}
