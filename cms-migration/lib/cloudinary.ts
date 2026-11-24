/**
 * cloudinary.ts
 *
 * Normalises every image shape found in Sanity data into the standard
 * ImageMeta shape stored in Supabase JSONB columns.
 *
 * Shape: { public_id, url, alt, width?, height? }
 * width / height are intentionally omitted (we don't have them yet).
 *
 * Cloudinary URL patterns handled:
 *   https://res.cloudinary.com/<cloud>/image/upload/<optional-transforms>/<optional-v123>/name.ext
 */

export interface ImageMeta {
  public_id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

/** Domains accepted as Cloudinary URLs. */
const CLOUDINARY_DOMAINS = ['res.cloudinary.com'];

export function isCloudinaryUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return CLOUDINARY_DOMAINS.includes(hostname);
  } catch {
    return false;
  }
}

/**
 * Parse public_id from a Cloudinary URL.
 * Strips: protocol, host, /image/upload/, optional transform segments,
 *         optional version segment (v\d+/), and file extension.
 * Returns the full folder-qualified public_id (e.g. "folder/name").
 */
export function parsePublicId(url: string): string {
  try {
    const { pathname } = new URL(url);
    // pathname: /dbqdpitah/image/upload/[transforms/][v123/]public_id.ext
    // Remove leading slash and cloud-name prefix up to /image/upload/
    const uploadMarker = '/image/upload/';
    const idx = pathname.indexOf(uploadMarker);
    if (idx === -1) return '';

    let rest = pathname.slice(idx + uploadMarker.length);

    // Strip named transform segments (e.g. q_auto/f_auto/) – they contain underscores and letters
    // A segment is a transform if it matches known prefixes OR looks like param_value
    rest = rest.replace(/^(?:[a-zA-Z][a-zA-Z0-9]*_[^/]+\/)+/, '');

    // Strip version segment (v followed by digits)
    rest = rest.replace(/^v\d+\//, '');

    // Strip file extension
    const dotIdx = rest.lastIndexOf('.');
    if (dotIdx !== -1) rest = rest.slice(0, dotIdx);

    return rest;
  } catch {
    return '';
  }
}

/** Non-Cloudinary images flagged during migration. */
export const nonCloudinaryWarnings: string[] = [];

function normaliseOne(raw: unknown): ImageMeta | null {
  if (!raw) return null;

  // Plain string URL
  if (typeof raw === 'string') {
    if (!raw.trim()) return null;
    if (!isCloudinaryUrl(raw)) {
      nonCloudinaryWarnings.push(raw);
    }
    return { public_id: parsePublicId(raw), url: raw };
  }

  if (typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;

  // { url } or { url, alt } or { url, alt, width, height }
  const url = typeof obj.url === 'string' ? obj.url : '';
  const alt = typeof obj.alt === 'string' ? obj.alt : undefined;
  const width = typeof obj.width === 'number' ? obj.width : undefined;
  const height = typeof obj.height === 'number' ? obj.height : undefined;

  if (url) {
    if (!isCloudinaryUrl(url)) nonCloudinaryWarnings.push(url);
    const result: ImageMeta = { public_id: parsePublicId(url), url, alt };
    if (width) result.width = width;
    if (height) result.height = height;
    return result;
  }

  // Sanity asset reference with { asset: { url } }
  const asset = obj.asset as Record<string, unknown> | undefined;
  if (asset && typeof asset.url === 'string' && asset.url) {
    if (!isCloudinaryUrl(asset.url)) nonCloudinaryWarnings.push(asset.url);
    return { public_id: parsePublicId(asset.url), url: asset.url, alt };
  }

  return null;
}

/** Normalise a single image field (string, object, or null). */
export function normaliseImage(raw: unknown): ImageMeta | null {
  return normaliseOne(raw);
}

/** Normalise an array of images. Skips nulls. */
export function normaliseImages(raw: unknown): ImageMeta[] {
  if (!Array.isArray(raw)) {
    const single = normaliseOne(raw);
    return single ? [single] : [];
  }
  return raw.map(normaliseOne).filter((x): x is ImageMeta => x !== null);
}
