import { Node, mergeAttributes } from '@tiptap/core';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';

// ---------------------------------------------------------------------------
// Server-side Tiptap custom nodes (matching TiptapEditor.tsx & cms-migration)
// ---------------------------------------------------------------------------

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]{11}).*/
  );
  return match ? match[1] : null;
}

function extractVimeoId(url: string): string | null {
  const match = url.match(/(?:vimeo\.com\/(?:video\/)?)(\d+)/i);
  return match ? match[1] : null;
}

function toSafeEmbedUrl(rawUrl: string): string | null {
  const url = rawUrl.trim();
  if (!url) return null;
  const ytId = extractYoutubeId(url);
  if (ytId) return `https://www.youtube.com/embed/${ytId}`;
  const vimeoId = extractVimeoId(url);
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}`;
  return null;
}

const ExternalImageNode = Node.create({
  name: 'externalImage',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      url: { default: null },
      alt: { default: null },
      caption: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'figure[data-external-image]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const url = typeof HTMLAttributes.url === 'string' ? HTMLAttributes.url.trim() : '';
    if (!url) return ['span'];
    const alt = typeof HTMLAttributes.alt === 'string' ? HTMLAttributes.alt : '';
    const caption = typeof HTMLAttributes.caption === 'string' ? HTMLAttributes.caption.trim() : '';

    const innerChildren: unknown[] = [
      ['img', { src: url, alt, class: 'w-full h-auto rounded-xl shadow-2xl' }],
    ];
    if (caption) {
      innerChildren.push([
        'figcaption',
        { class: 'mt-4 text-center text-sm text-gray-500 italic' },
        caption,
      ]);
    }

    return [
      'figure',
      mergeAttributes({ class: 'my-12 flex flex-col items-center' }),
      ['div', { class: 'w-full' }, ...innerChildren],
    ] as [string, Record<string, unknown>, ...unknown[]];
  },
});

const CustomImageNode = Node.create({
  name: 'customImage',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      url: { default: null },
      alt: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'figure[data-custom-image]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const url = typeof HTMLAttributes.url === 'string' ? HTMLAttributes.url.trim() : '';
    if (!url) return ['span'];
    const alt = typeof HTMLAttributes.alt === 'string' ? HTMLAttributes.alt : '';

    return [
      'figure',
      mergeAttributes({ class: 'my-8 flex justify-center' }),
      ['img', { src: url, alt, class: 'w-full mx-auto h-auto rounded-lg shadow-md' }],
    ] as [string, Record<string, unknown>, ...unknown[]];
  },
});

const VideoEmbedNode = Node.create({
  name: 'videoEmbed',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      url: { default: null },
      caption: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-video-embed]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const rawUrl = typeof HTMLAttributes.url === 'string' ? HTMLAttributes.url : '';
    const embedUrl = toSafeEmbedUrl(rawUrl);
    if (!embedUrl) return ['span'];

    const caption = typeof HTMLAttributes.caption === 'string' ? HTMLAttributes.caption.trim() : '';
    const children: unknown[] = [
      [
        'div',
        { class: 'aspect-video w-full rounded-xl overflow-hidden shadow-2xl bg-black' },
        [
          'iframe',
          {
            src: embedUrl,
            title: 'Embedded video player',
            frameborder: '0',
            allow:
              'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
            allowfullscreen: 'true',
            class: 'w-full h-full',
          },
        ],
      ],
    ];
    if (caption) {
      children.push([
        'figcaption',
        { class: 'mt-4 text-center text-sm text-gray-500 italic' },
        caption,
      ]);
    }

    return [
      'figure',
      mergeAttributes({ class: 'my-12' }),
      ...children,
    ] as [string, Record<string, unknown>, ...unknown[]];
  },
});

const SERVER_EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [2, 3, 4, 5] },
    link: {
      openOnClick: false,
      HTMLAttributes: {
        rel: 'noopener noreferrer',
      },
    },
    underline: {},
  }),
  ImageExtension.configure({ inline: false }),
  ExternalImageNode,
  CustomImageNode,
  VideoEmbedNode,
];

// ---------------------------------------------------------------------------
// HTML Sanitizer (strict allowlist + YouTube/Vimeo-only iframes)
// ---------------------------------------------------------------------------

const ALLOWED_TAGS = new Set([
  'p',
  'br',
  'hr',
  'h2',
  'h3',
  'h4',
  'h5',
  'ul',
  'ol',
  'li',
  'blockquote',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'del',
  'code',
  'pre',
  'a',
  'img',
  'figure',
  'figcaption',
  'div',
  'span',
  'iframe',
]);

const VOID_TAGS = new Set(['br', 'hr', 'img']);
const STRIP_WITH_BODY_TAGS = new Set(['script', 'style', 'svg', 'math', 'object', 'embed', 'template']);

const ALLOWED_ATTRS_BY_TAG: Record<string, Set<string>> = {
  '*': new Set(['class']),
  a: new Set(['href', 'target', 'rel', 'title', 'class']),
  img: new Set(['src', 'alt', 'title', 'class', 'width', 'height']),
  iframe: new Set(['src', 'title', 'frameborder', 'allow', 'allowfullscreen', 'class']),
};

const ALLOWED_IFRAME_SRC_RE =
  /^https:\/\/(?:www\.youtube\.com\/embed\/|www\.youtube-nocookie\.com\/embed\/|player\.vimeo\.com\/video\/)[A-Za-z0-9_-]+(?:\?[^"'<>]*)?$/i;

function decodeBasicEntities(s: string): string {
  return s
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function escapeAttr(val: string): string {
  return val
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function isSafeUrl(raw: string): boolean {
  const cleaned = decodeBasicEntities(raw).replace(/[\u0000-\u0020]+/g, '').trim();
  if (!cleaned) return false;
  if (cleaned.startsWith('/') || cleaned.startsWith('#') || cleaned.startsWith('?')) {
    return !cleaned.startsWith('//');
  }
  return /^(?:https?:|mailto:|tel:)/i.test(cleaned);
}

function parseAttributes(rawAttrStr: string): Array<[string, string]> {
  const attrs: Array<[string, string]> = [];
  const attrRe = /([a-zA-Z_:][a-zA-Z0-9_.:-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match: RegExpExecArray | null;
  while ((match = attrRe.exec(rawAttrStr)) !== null) {
    const name = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? '';
    attrs.push([name, value]);
  }
  return attrs;
}

export function sanitizeRichHtml(html: string): string {
  if (!html) return '';

  // Remove HTML comments and dangerous tags along with their inner content
  let cleaned = html.replace(/<!--[\s\S]*?-->/g, '');
  for (const tag of STRIP_WITH_BODY_TAGS) {
    const bodyRe = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
    cleaned = cleaned.replace(bodyRe, '');
  }

  let skipIframeDepth = 0;

  return cleaned.replace(/<\/?([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>/g, (full, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    const isClosing = full.startsWith('</');

    if (isClosing) {
      if (tag === 'iframe' && skipIframeDepth > 0) {
        skipIframeDepth--;
        return '';
      }
      if (!ALLOWED_TAGS.has(tag) || VOID_TAGS.has(tag)) return '';
      return `</${tag}>`;
    }

    if (!ALLOWED_TAGS.has(tag)) {
      return '';
    }

    const allowedForTag = ALLOWED_ATTRS_BY_TAG[tag] ?? ALLOWED_ATTRS_BY_TAG['*'];
    const parsedAttrs = parseAttributes(rawAttrs);
    const keptAttrs: string[] = [];
    let iframeSrcValid = tag !== 'iframe';
    let hasRel = false;
    let hasTargetBlank = false;

    for (const [attrName, attrVal] of parsedAttrs) {
      if (attrName.startsWith('on') || attrName === 'style') continue;
      if (!allowedForTag.has(attrName)) continue;

      if (attrName === 'href' || attrName === 'src') {
        const decoded = decodeBasicEntities(attrVal).trim();
        if (tag === 'iframe') {
          if (!ALLOWED_IFRAME_SRC_RE.test(decoded)) {
            iframeSrcValid = false;
            continue;
          }
          iframeSrcValid = true;
        } else if (!isSafeUrl(decoded)) {
          continue;
        }
        keptAttrs.push(`${attrName}="${escapeAttr(decoded)}"`);
        continue;
      }

      if (attrName === 'rel') hasRel = true;
      if (attrName === 'target' && attrVal === '_blank') hasTargetBlank = true;

      if (attrName === 'allowfullscreen') {
        keptAttrs.push('allowfullscreen');
      } else {
        keptAttrs.push(`${attrName}="${escapeAttr(decodeBasicEntities(attrVal))}"`);
      }
    }

    if (tag === 'iframe' && !iframeSrcValid) {
      if (!rawAttrs.trim().endsWith('/')) {
        skipIframeDepth++;
      }
      return '';
    }

    if (tag === 'a' && hasTargetBlank && !hasRel) {
      keptAttrs.push('rel="noopener noreferrer"');
    }

    const attrSuffix = keptAttrs.length > 0 ? ` ${keptAttrs.join(' ')}` : '';
    return `<${tag}${attrSuffix}>`;
  });
}

// ---------------------------------------------------------------------------
// Public converter
// ---------------------------------------------------------------------------

/**
 * ProseMirror throws `RangeError: Empty text nodes are not allowed` if any
 * `{ type: 'text', text: '' }` node exists in migrated Tiptap JSON.
 * Recursively prune empty text nodes before passing to `generateHTML`.
 */
function stripEmptyTextNodes(node: unknown): unknown {
  if (!node || typeof node !== 'object') return node;
  const obj = node as Record<string, unknown>;
  if (Array.isArray(obj.content)) {
    const cleanedChildren = obj.content
      .filter((child) => {
        if (!child || typeof child !== 'object') return false;
        const c = child as Record<string, unknown>;
        return !(c.type === 'text' && (typeof c.text !== 'string' || c.text.length === 0));
      })
      .map(stripEmptyTextNodes);
    return { ...obj, content: cleanedChildren };
  }
  return obj;
}

/**
 * Render a stored Tiptap JSON document to sanitized HTML on the server.
 * Returns empty string for empty or invalid documents.
 */
export function tiptapJsonToHtml(doc: unknown): string {
  if (!doc || typeof doc !== 'object') return '';
  const record = doc as { type?: unknown; content?: unknown[] };
  if (record.type !== 'doc' || !Array.isArray(record.content) || record.content.length === 0) {
    return '';
  }

  try {
    const normalizedDoc = stripEmptyTextNodes(record);
    const rawHtml = generateHTML(
      normalizedDoc as Parameters<typeof generateHTML>[0],
      SERVER_EXTENSIONS
    );
    const sanitized = sanitizeRichHtml(rawHtml).trim();
    const plain = sanitized.replace(/<[^>]+>/g, '').trim();
    const hasMedia = /<(?:img|iframe|hr)\b/i.test(sanitized);
    if (!plain && !hasMedia) return '';
    return sanitized;
  } catch (err) {
    console.error('[tiptapJsonToHtml] Failed to render Tiptap JSON:', err);
    return '';
  }
}
