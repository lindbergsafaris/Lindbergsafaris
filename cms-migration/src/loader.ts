/**
 * loader.ts
 *
 * Reads and parses the Sanity NDJSON export.
 * Filters to published documents only (skips drafts.*).
 * Special case: the Olare Mara Kempinski draft is handled separately.
 */

import { createReadStream } from 'fs';
import { createInterface } from 'readline';

export type SanityDoc = Record<string, unknown> & {
  _id: string;
  _type: string;
  _rev?: string;
};

/** ID of the Olare Mara Kempinski DRAFT we need to diff (but not import). */
export const OLARE_DRAFT_ID = 'drafts.938b63a4-4605-49f0-8c91-063a1a7f23bb';
/** ID of the published Olare Mara Kempinski record. */
export const OLARE_PUBLISHED_ID = '1fb9709e-50fa-4276-9288-83bc367b876f';

export interface LoadResult {
  docs: SanityDoc[];
  olareDraft: SanityDoc | null;
}

export async function loadNdjson(filePath: string): Promise<LoadResult> {
  const rl = createInterface({
    input: createReadStream(filePath, 'utf8'),
    crlfDelay: Infinity,
  });

  const docs: SanityDoc[] = [];
  let olareDraft: SanityDoc | null = null;

  for await (const line of rl) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const doc = JSON.parse(trimmed) as SanityDoc;

    if (doc._id === OLARE_DRAFT_ID) {
      olareDraft = doc;
      // Do NOT add to docs — we only diff it
      continue;
    }

    // Skip all other drafts
    if (doc._id.startsWith('drafts.')) continue;

    docs.push(doc);
  }

  return { docs, olareDraft };
}

/** Group docs by _type. */
export function groupByType(docs: SanityDoc[]): Map<string, SanityDoc[]> {
  const map = new Map<string, SanityDoc[]>();
  for (const doc of docs) {
    const list = map.get(doc._type) ?? [];
    list.push(doc);
    map.set(doc._type, list);
  }
  return map;
}
