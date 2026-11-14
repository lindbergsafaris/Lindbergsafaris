export interface NormalizedImage {
  url: string;
  alt: string;
}

export function normalizeImage(
  source: any,
  fallbackAlt: string = 'Lindberg Safaris'
): NormalizedImage | null {
  if (!source) return null;

  if (typeof source === 'string') {
    const trimmed = source.trim();
    return trimmed ? { url: trimmed, alt: fallbackAlt } : null;
  }

  const url =
    source.url ||
    source.asset?.url ||
    source.imageUrl ||
    source.image?.url ||
    source.image?.asset?.url ||
    (typeof source.logo === 'string'
      ? source.logo
      : source.logo?.url || source.logo?.asset?.url) ||
    '';

  if (!url || typeof url !== 'string' || !url.trim()) return null;

  const alt = source.alt || source.asset?.alt || fallbackAlt;
  return { url: url.trim(), alt };
}

export function normalizeImageList(
  list: any[] | undefined | null,
  fallbackAlt: string = 'Lindberg Safaris'
): NormalizedImage[] {
  if (!Array.isArray(list)) return [];
  return list
    .map((item, idx) =>
      normalizeImage(item, `${fallbackAlt} image ${idx + 1}`)
    )
    .filter((img): img is NormalizedImage => img !== null);
}
