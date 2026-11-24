/**
 * redirects.ts
 *
 * Builds all redirect rows needed after migration.
 * Rules:
 * - No chains (from must map to a canonical destination, not another redirect)
 * - No self-redirects
 * - Covers: dirty slug paths, typo paths, percent-encoded paths, UUID paths
 */

import { isUUID } from '../lib/slugs.ts';
import type { SanityDoc } from './loader.ts';

export interface RedirectRow {
  from_path: string;
  to_path: string;
  status_code: number;
  is_active: boolean;
  note: string;
}

/** Percent-encode a path segment (spaces → %20, etc.). */
function pctEncode(segment: string): string {
  return encodeURIComponent(segment).replace(/%2F/g, '/');
}

export function buildRedirects(
  docs: SanityDoc[],
  slugMap: Map<string, string>, // sanityId → canonical slug
  typeMap: Map<string, string>, // sanityId → _type
): RedirectRow[] {
  const rows: RedirectRow[] = [];

  function add(from: string, to: string, note: string) {
    if (from === to) return; // skip self-redirects
    rows.push({ from_path: from, to_path: to, status_code: 301, is_active: true, note });
  }

  for (const doc of docs) {
    const type = doc._type;
    const id = doc._id;
    const canonicalSlug = slugMap.get(id);
    if (!canonicalSlug) continue;

    // ---- UUIDs in old Sanity URLs ----
    if (isUUID(id)) {
      if (type === 'tour') {
        add(`/tours/${id}`, `/tours/${canonicalSlug}`, `UUID redirect tour ${id}`);
      } else if (type === 'blogPost') {
        add(`/blog/${id}`, `/blog/${canonicalSlug}`, `UUID redirect blog ${id}`);
      } else if (type === 'accommodation') {
        add(`/accommodation/view/${id}`, `/accommodation/${canonicalSlug}`, `UUID redirect accommodation ${id}`);
      } else if (type === 'destinationPost') {
        add(`/destinations/${id}`, `/destinations/${canonicalSlug}`, `UUID redirect destination ${id}`);
      }
    }

    // ---- Slug typos / case fixes ----
    // tour: VISIT LAMU (old slug might be uppercase or spaced)
    if (type === 'tour') {
      const rawSlug = ((doc.slug as Record<string,unknown>)?.current as string | undefined) ?? '';
      if (rawSlug && rawSlug !== canonicalSlug) {
        const pct = pctEncode(rawSlug);
        add(`/tours/${rawSlug}`, `/tours/${canonicalSlug}`, `Old slug → canonical: ${rawSlug}`);
        if (pct !== rawSlug) {
          add(`/tours/${pct}`, `/tours/${canonicalSlug}`, `Percent-encoded old slug: ${rawSlug}`);
        }
      }
    }

    // blog
    if (type === 'blogPost') {
      const rawSlug = ((doc.slug as Record<string,unknown>)?.current as string | undefined) ?? '';
      if (rawSlug && rawSlug !== canonicalSlug) {
        add(`/blog/${rawSlug}`, `/blog/${canonicalSlug}`, `Old blog slug → canonical`);
      }
    }

    // destination: ambosseli → amboseli
    if (type === 'destinationPost') {
      const rawSlug = ((doc.slug as Record<string,unknown>)?.current as string | undefined) ?? '';
      if (rawSlug === 'ambosseli-national-park') {
        add(`/destinations/ambosseli-national-park`, `/destinations/amboseli-national-park`, 'Fix ambosseli typo');
      }
    }

    // themed package: uppercase slug → lowercase
    if (type === 'themedPackage') {
      const rawSlug = ((doc.slug as Record<string,unknown>)?.current as string | undefined) ?? '';
      if (rawSlug && rawSlug !== canonicalSlug) {
        const pct = pctEncode(rawSlug);
        add(`/packages/${rawSlug}`, `/packages/${canonicalSlug}`, `Themed package old slug`);
        if (pct !== rawSlug) {
          add(`/packages/${pct}`, `/packages/${canonicalSlug}`, `Themed package percent-encoded`);
        }
      }
    }
  }

  // Deduplicate by from_path (keep first occurrence)
  const seen = new Set<string>();
  return rows.filter((r) => {
    if (seen.has(r.from_path)) return false;
    seen.add(r.from_path);
    return true;
  });
}
