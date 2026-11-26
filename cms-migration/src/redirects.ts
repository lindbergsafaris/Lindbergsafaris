/**
 * redirects.ts
 *
 * Builds all redirect rows needed after migration.
 * Matches supabase/migrations/0002_tables.sql `redirects` table:
 *   (old_path, new_path, status_code)
 *
 * Rules:
 * - No chains (old_path maps directly to canonical new_path)
 * - No self-redirects
 * - Covers: dirty slug paths, typo paths, percent-encoded paths, UUID paths
 */

import { isUUID } from '../lib/slugs.ts';
import type { SanityDoc } from './loader.ts';

export interface RedirectRow {
  old_path: string;
  new_path: string;
  status_code: number;
}

/** Percent-encode a path segment (spaces -> %20, etc.). */
function pctEncode(segment: string): string {
  return encodeURIComponent(segment).replace(/%2F/g, '/');
}

export function buildRedirects(
  docs: SanityDoc[],
  slugMap: Map<string, string>, // sanityId -> canonical slug
): RedirectRow[] {
  const rows: RedirectRow[] = [];

  function add(oldPath: string, newPath: string) {
    if (oldPath === newPath) return;
    rows.push({ old_path: oldPath, new_path: newPath, status_code: 301 });
  }

  for (const doc of docs) {
    const type = doc._type;
    const id = doc._id;
    const canonicalSlug = slugMap.get(id);
    if (!canonicalSlug) continue;

    // ---- UUIDs in old Sanity URLs ----
    if (isUUID(id)) {
      if (type === 'tour') {
        add(`/tours/${id}`, `/tours/${canonicalSlug}`);
      } else if (type === 'blogPost') {
        add(`/blog/${id}`, `/blog/${canonicalSlug}`);
      } else if (type === 'accommodation') {
        add(`/accommodation/view/${id}`, `/accommodation/${canonicalSlug}`);
      } else if (type === 'destinationPost') {
        add(`/destinations/${id}`, `/destinations/${canonicalSlug}`);
      }
    }

    // ---- Dirty slugs / case fixes / percent-encoded variants ----
    if (type === 'tour') {
      const rawSlug = ((doc.slug as Record<string, unknown>)?.current as string | undefined) ?? '';
      if (rawSlug && rawSlug !== canonicalSlug) {
        const pct = pctEncode(rawSlug);
        add(`/tours/${rawSlug}`, `/tours/${canonicalSlug}`);
        if (pct !== rawSlug) {
          add(`/tours/${pct}`, `/tours/${canonicalSlug}`);
        }
      }
    }

    if (type === 'blogPost') {
      const rawSlug = ((doc.slug as Record<string, unknown>)?.current as string | undefined) ?? '';
      if (rawSlug && rawSlug !== canonicalSlug) {
        add(`/blog/${rawSlug}`, `/blog/${canonicalSlug}`);
        const pct = pctEncode(rawSlug);
        if (pct !== rawSlug) {
          add(`/blog/${pct}`, `/blog/${canonicalSlug}`);
        }
      }
    }

    // destination: ambosseli -> amboseli
    if (type === 'destinationPost') {
      const rawSlug = ((doc.slug as Record<string, unknown>)?.current as string | undefined) ?? '';
      if (rawSlug === 'ambosseli-national-park') {
        add('/destinations/ambosseli-national-park', '/destinations/amboseli-national-park');
      }
    }

    // themed packages: /packages/[category] routes by category slug — no slug-based redirects needed
  }

  // Deduplicate by old_path (keep first occurrence)
  const seen = new Set<string>();
  return rows.filter((r) => {
    if (seen.has(r.old_path)) return false;
    seen.add(r.old_path);
    return true;
  });
}
