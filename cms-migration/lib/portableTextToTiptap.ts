/**
 * portableTextToTiptap.ts
 *
 * Converts a Sanity Portable Text block array to a Tiptap JSON document.
 * Supported block types:
 *   - paragraph (style: 'normal')
 *   - headings h2, h3, h4
 *   - blockquote
 *   - bulletList / orderedList (listItem: 'bullet' | 'number'), nested
 *   - marks: strong, em, code, underline, strike-through, link
 * Custom block types:
 *   - externalImage -> { type: 'externalImage', attrs: { url, alt, caption } }
 *   - image         -> { type: 'customImage',   attrs: { url, alt } }
 *   - videoEmbed    -> { type: 'videoEmbed',     attrs: { url, caption } }
 */

export interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: TiptapMark[];
}

export interface TiptapMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface TiptapDoc {
  type: 'doc';
  content: TiptapNode[];
}

/** Empty Tiptap document – matches the DB column default. */
export const EMPTY_DOC: TiptapDoc = { type: 'doc', content: [] };

// ---------------------------------------------------------------------------
// Internal Portable Text types
// ---------------------------------------------------------------------------

interface MarkDef {
  _key: string;
  _type: string;
  href?: string;
  url?: string;
  [k: string]: unknown;
}

interface Span {
  _type: 'span';
  _key?: string;
  text: string;
  marks?: string[];
}

interface PTBlock {
  _type: 'block';
  _key?: string;
  style?: string;
  listItem?: 'bullet' | 'number';
  level?: number;
  children?: Span[];
  markDefs?: MarkDef[];
}

interface ExternalImageBlock {
  _type: 'externalImage';
  _key?: string;
  url?: string;
  alt?: string;
  caption?: string;
}

interface ImageBlock {
  _type: 'image';
  _key?: string;
  url?: string;
  asset?: { url?: string };
  alt?: string;
}

interface VideoEmbedBlock {
  _type: 'videoEmbed';
  _key?: string;
  url?: string;
  caption?: string;
}

type PTNode = PTBlock | ExternalImageBlock | ImageBlock | VideoEmbedBlock | Record<string, unknown>;

// ---------------------------------------------------------------------------
// Mark conversion
// ---------------------------------------------------------------------------

// Supported decorator marks — throw on anything else not in markDefs
const SUPPORTED_DECORATORS = new Set(['strong','em','code','underline','strike-through','strikethrough']);

function convertMark(markKey: string, markDefs: MarkDef[]): TiptapMark | null {
  // Decorator marks
  switch (markKey) {
    case 'strong':        return { type: 'bold' };
    case 'em':            return { type: 'italic' };
    case 'code':          return { type: 'code' };
    case 'underline':     return { type: 'underline' };
    case 'strike-through':
    case 'strikethrough': return { type: 'strike' };
  }
  // Reference marks (links etc.)
  const def = markDefs.find((d) => d._key === markKey);
  if (!def) {
    // Unknown decorator mark not in markDefs — fail hard
    throw new Error(`Unsupported Portable Text mark: "${markKey}" (not a known decorator and not in markDefs)`);
  }
  if (def._type === 'link') {
    const href = (def.href ?? def.url ?? '') as string;
    return { type: 'link', attrs: { href, target: null, rel: null } };
  }
  // Unknown markDef type — fail hard
  throw new Error(`Unsupported Portable Text markDef type: "${def._type}" (key: "${markKey}")`);
}

// ---------------------------------------------------------------------------
// Span → Tiptap text node
// ---------------------------------------------------------------------------

function convertSpan(span: Span, markDefs: MarkDef[]): TiptapNode {
  const marks: TiptapMark[] = [];
  for (const m of span.marks ?? []) {
    const converted = convertMark(m, markDefs);
    if (converted) marks.push(converted);
  }
  const node: TiptapNode = { type: 'text', text: span.text };
  if (marks.length) node.marks = marks;
  return node;
}

// ---------------------------------------------------------------------------
// Block → Tiptap paragraph/heading/blockquote node
// ---------------------------------------------------------------------------

function convertBlock(block: PTBlock): TiptapNode {
  const markDefs: MarkDef[] = block.markDefs ?? [];
  const content: TiptapNode[] = (block.children ?? []).map((c) => convertSpan(c, markDefs));

  const style = block.style ?? 'normal';

  if (style === 'blockquote') {
    return { type: 'blockquote', content: [{ type: 'paragraph', content }] };
  }
  if (style === 'h2') return { type: 'heading', attrs: { level: 2 }, content };
  if (style === 'h3') return { type: 'heading', attrs: { level: 3 }, content };
  if (style === 'h4') return { type: 'heading', attrs: { level: 4 }, content };
  if (style === 'h5') return { type: 'heading', attrs: { level: 5 }, content };
  if (style === 'h1') {
    // h1 is unusual in body content — convert but callers should warn
    return { type: 'heading', attrs: { level: 1 }, content };
  }
  if (style === 'h6') {
    // h6 is unusual in body content — convert but callers should warn
    return { type: 'heading', attrs: { level: 6 }, content };
  }
  if (style === 'normal') return { type: 'paragraph', content };

  // Any other style is unsupported — fail hard so the caller notices
  throw new Error(`Unsupported Portable Text block style: "${style}"`);
}

// ---------------------------------------------------------------------------
// List coalescing
// ---------------------------------------------------------------------------

interface ListGroup {
  listType: 'bulletList' | 'orderedList';
  level: number;
  items: PTBlock[];
}

function blockToListItem(block: PTBlock): TiptapNode {
  const markDefs: MarkDef[] = block.markDefs ?? [];
  const content: TiptapNode[] = (block.children ?? []).map((c) => convertSpan(c, markDefs));
  return {
    type: 'listItem',
    content: [{ type: 'paragraph', content }],
  };
}

function listTypeFor(item: 'bullet' | 'number'): 'bulletList' | 'orderedList' {
  return item === 'bullet' ? 'bulletList' : 'orderedList';
}

// ---------------------------------------------------------------------------
// Custom block nodes
// ---------------------------------------------------------------------------

function convertExternalImage(block: ExternalImageBlock): TiptapNode {
  return {
    type: 'externalImage',
    attrs: {
      url: block.url ?? null,
      alt: block.alt ?? null,
      caption: block.caption ?? null,
    },
  };
}

function convertImage(block: ImageBlock): TiptapNode {
  const url = block.url ?? block.asset?.url ?? null;
  return {
    type: 'customImage',
    attrs: { url, alt: block.alt ?? null },
  };
}

function convertVideoEmbed(block: VideoEmbedBlock): TiptapNode {
  return {
    type: 'videoEmbed',
    attrs: { url: block.url ?? null, caption: block.caption ?? null },
  };
}

// ---------------------------------------------------------------------------
// Main converter
// ---------------------------------------------------------------------------

export function portableTextToTiptap(blocks: unknown[]): TiptapDoc {
  if (!Array.isArray(blocks) || blocks.length === 0) return EMPTY_DOC;

  const content: TiptapNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i] as PTNode;

    if (!block || typeof block !== 'object') { i++; continue; }

    const type = (block as Record<string, unknown>)._type as string;

    // ---- custom blocks ----
    if (type === 'externalImage') {
      content.push(convertExternalImage(block as ExternalImageBlock));
      i++;
      continue;
    }
    if (type === 'image') {
      content.push(convertImage(block as ImageBlock));
      i++;
      continue;
    }
    if (type === 'videoEmbed') {
      content.push(convertVideoEmbed(block as VideoEmbedBlock));
      i++;
      continue;
    }

    // ---- list blocks: coalesce consecutive items at the same level ----
    if (type === 'block') {
      const ptBlock = block as PTBlock;
      if (ptBlock.listItem) {
        const listType = listTypeFor(ptBlock.listItem);
        const level = ptBlock.level ?? 1;

        // Collect consecutive blocks with same listItem+level
        const items: TiptapNode[] = [];
        while (
          i < blocks.length &&
          (blocks[i] as PTBlock)._type === 'block' &&
          (blocks[i] as PTBlock).listItem === ptBlock.listItem &&
          ((blocks[i] as PTBlock).level ?? 1) === level
        ) {
          items.push(blockToListItem(blocks[i] as PTBlock));
          i++;
        }
        content.push({ type: listType, content: items });
        continue;
      }

      // ---- regular block ----
      content.push(convertBlock(ptBlock));
      i++;
      continue;
    }

    // unknown block type – skip
    i++;
  }

  return { type: 'doc', content };
}

// ---------------------------------------------------------------------------
// Plain-text extraction (for round-trip verification)
// ---------------------------------------------------------------------------

export function extractPlainText(doc: TiptapDoc): string {
  function walkNode(node: TiptapNode): string {
    if (node.type === 'text') return node.text ?? '';
    return (node.content ?? []).map(walkNode).join('');
  }
  return doc.content.map(walkNode).join('\n');
}

export function extractPlainTextFromPT(blocks: unknown[]): string {
  if (!Array.isArray(blocks)) return '';
  const parts: string[] = [];
  for (const block of blocks) {
    const b = block as Record<string, unknown>;
    if (b._type === 'block') {
      const children = (b.children ?? []) as Array<{ text?: string }>;
      parts.push(children.map((c) => c.text ?? '').join(''));
    }
  }
  return parts.join('\n');
}
