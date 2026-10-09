/**
 * Slug utilities — shared between client code and Node scripts.
 * This file MUST stay dependency-free (no Node-only imports) so it works
 * in both Vite (browser/SSR) and in Node scripts.
 */

/** Convert any string to a URL-safe lowercase slug. */
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // strip diacritics
        .replace(/[^a-z0-9\s-]/g, '')   // keep alphanum, space, hyphen
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

/**
 * Returns true if a string looks like a Sanity document _id (UUID format).
 * e.g. "375d71f3-af81-4df3-a7dc-cc599371abe9"
 */
export function isUUID(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
