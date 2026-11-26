/**
 * Cloudinary URL parsing & ImageMeta normalization helpers for the CMS Admin.
 * Matches the DB JSONB shape: { public_id, url, alt, width?, height? }.
 */

export interface CmsImageMeta {
  public_id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export function isCloudinaryUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === 'res.cloudinary.com';
  } catch {
    return false;
  }
}

/**
 * Parses public_id from a Cloudinary URL.
 * Handles optional transformation segments (e.g. q_auto/f_auto/) and version segments (v123456/).
 */
export function parseCloudinaryPublicId(url: string): string {
  try {
    const { pathname } = new URL(url.trim());
    const uploadMarker = '/image/upload/';
    const idx = pathname.indexOf(uploadMarker);
    if (idx === -1) return '';

    let rest = pathname.slice(idx + uploadMarker.length);
    // Strip named/parameter transform segments (e.g. q_auto/, c_fill,w_800/)
    while (/^[a-zA-Z][a-zA-Z0-9]*_[^/]+\//.test(rest)) {
      rest = rest.replace(/^[a-zA-Z][a-zA-Z0-9]*_[^/]+\//, '');
    }
    // Strip version segment (v123456789/)
    rest = rest.replace(/^v\d+\//, '');
    // Strip extension
    const dotIdx = rest.lastIndexOf('.');
    if (dotIdx !== -1) {
      rest = rest.slice(0, dotIdx);
    }
    return rest;
  } catch {
    return '';
  }
}

export function buildImageMetaFromUrl(
  url: string,
  alt = '',
  dims?: { width?: number; height?: number }
): CmsImageMeta {
  const trimmed = url.trim();
  const parsedId = parseCloudinaryPublicId(trimmed);
  const meta: CmsImageMeta = {
    public_id: parsedId || trimmed,
    url: trimmed,
    alt,
  };
  if (typeof dims?.width === 'number' && !Number.isNaN(dims.width) && dims.width > 0) {
    meta.width = Math.round(dims.width);
  }
  if (typeof dims?.height === 'number' && !Number.isNaN(dims.height) && dims.height > 0) {
    meta.height = Math.round(dims.height);
  }
  return meta;
}
