'use client';

import { useEffect, useState } from 'react';
import { Node, mergeAttributes } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import {
  Bold,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo,
  Unlink,
  Video,
} from 'lucide-react';
import { EMPTY_TIPTAP_DOC } from '@/lib/cms/validation';

/**
 * Custom Tiptap node matching migrated Sanity `externalImage` blocks:
 * { type: 'externalImage', attrs: { url, alt, caption } }
 */
const ExternalImageNode = Node.create({
  name: 'externalImage',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      url: { default: null },
      alt: { default: null },
      caption: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-external-image]',
        getAttrs: (el) => {
          const dom = el as HTMLElement;
          const img = dom.querySelector('img');
          const cap = dom.querySelector('figcaption');
          return {
            url: img?.getAttribute('src') || null,
            alt: img?.getAttribute('alt') || null,
            caption: cap?.textContent || null,
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const url = HTMLAttributes.url || '';
    const alt = HTMLAttributes.alt || '';
    const caption = HTMLAttributes.caption || '';
    const children: unknown[] = [
      ['img', { src: url, alt, class: 'rounded-md max-h-80 mx-auto object-contain' }],
    ];
    if (caption) {
      children.push([
        'figcaption',
        { class: 'text-xs text-stone-500 text-center mt-1.5 italic' },
        caption,
      ]);
    }
    return [
      'figure',
      mergeAttributes({ 'data-external-image': 'true', class: 'my-4 p-2 rounded border border-stone-200 bg-stone-50' }),
      ...children,
    ] as [string, Record<string, unknown>, ...unknown[]];
  },
});

/**
 * Custom Tiptap node matching migrated Sanity `image` blocks in themed_packages:
 * { type: 'customImage', attrs: { url, alt } }
 */
const CustomImageNode = Node.create({
  name: 'customImage',
  group: 'block',
  atom: true,
  selectable: true,

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
    return [
      'figure',
      mergeAttributes({ 'data-custom-image': 'true', class: 'my-4 p-2 rounded border border-stone-200 bg-stone-50' }),
      [
        'img',
        {
          src: HTMLAttributes.url || '',
          alt: HTMLAttributes.alt || '',
          class: 'rounded-md max-h-80 mx-auto object-contain',
        },
      ],
    ];
  },
});

/**
 * Custom Tiptap node matching migrated Sanity `videoEmbed` blocks:
 * { type: 'videoEmbed', attrs: { url, caption } }
 */
const VideoEmbedNode = Node.create({
  name: 'videoEmbed',
  group: 'block',
  atom: true,
  selectable: true,

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
    const url = HTMLAttributes.url || '';
    const caption = HTMLAttributes.caption || '';
    const children: unknown[] = [
      ['div', { class: 'text-xs font-semibold text-primary uppercase tracking-wider mb-1' }, 'Video Embed'],
      ['div', { class: 'text-sm text-gray-800 break-all underline' }, url],
    ];
    if (caption) {
      children.push(['div', { class: 'text-xs text-stone-500 mt-1 italic' }, caption]);
    }
    return [
      'div',
      mergeAttributes({
        'data-video-embed': 'true',
        class: 'my-4 p-3 rounded-md border border-primary/30 bg-secondary/40',
      }),
      ...children,
    ] as [string, Record<string, unknown>, ...unknown[]];
  },
});

interface TiptapEditorProps {
  value: Record<string, unknown> | null | undefined;
  onChange: (json: Record<string, unknown>) => void;
  error?: string;
}

export default function TiptapEditor({ value, onChange, error }: TiptapEditorProps) {
  const [modalMode, setModalMode] = useState<'link' | 'image' | 'video' | null>(null);
  const [inputUrl, setInputUrl] = useState('');
  const [inputAlt, setInputAlt] = useState('');
  const [inputCaption, setInputCaption] = useState('');

  const initialContent =
    value && typeof value === 'object' && value.type === 'doc' ? value : EMPTY_TIPTAP_DOC;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4, 5] },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { class: 'text-primary underline' },
        },
        underline: {},
      }),
      ImageExtension.configure({ inline: false }),
      ExternalImageNode,
      CustomImageNode,
      VideoEmbedNode,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose max-w-none min-h-[280px] p-4 focus:outline-none text-gray-900',
      },
    },
    onUpdate({ editor: ed }) {
      onChange(ed.getJSON() as Record<string, unknown>);
    },
  });

  // Sync external reset / initial load if value changes externally
  useEffect(() => {
    if (!editor) return;
    const incoming =
      value && typeof value === 'object' && value.type === 'doc' ? value : EMPTY_TIPTAP_DOC;
    const currentStr = JSON.stringify(editor.getJSON());
    const incomingStr = JSON.stringify(incoming);
    if (currentStr !== incomingStr && !editor.isFocused) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="rounded-lg border border-stone-300 bg-stone-50 p-4 text-sm text-stone-500">
        Loading editor...
      </div>
    );
  }

  const openModal = (mode: 'link' | 'image' | 'video') => {
    if (mode === 'link') {
      const existingHref = editor.getAttributes('link').href as string | undefined;
      setInputUrl(existingHref || '');
    } else {
      setInputUrl('');
    }
    setInputAlt('');
    setInputCaption('');
    setModalMode(mode);
  };

  const submitModal = () => {
    const url = inputUrl.trim();
    if (!url) return;

    if (modalMode === 'link') {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    } else if (modalMode === 'image') {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'externalImage',
          attrs: {
            url,
            alt: inputAlt.trim() || null,
            caption: inputCaption.trim() || null,
          },
        })
        .run();
    } else if (modalMode === 'video') {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'videoEmbed',
          attrs: {
            url,
            caption: inputCaption.trim() || null,
          },
        })
        .run();
    }
    setModalMode(null);
  };

  const btnCls = (active: boolean) =>
    `p-1.5 rounded text-xs transition-colors ${
      active
        ? 'bg-primary text-white'
        : 'text-stone-700 hover:bg-stone-200/70'
    }`;

  return (
    <div className="rounded-lg border border-stone-300 bg-surface overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-stone-50 border-b border-stone-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnCls(editor.isActive('bold'))}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnCls(editor.isActive('italic'))}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={btnCls(editor.isActive('underline'))}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={btnCls(editor.isActive('strike'))}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-stone-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnCls(editor.isActive('heading', { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btnCls(editor.isActive('heading', { level: 3 }))}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={btnCls(editor.isActive('heading', { level: 4 }))}
          title="Heading 4"
        >
          <Heading4 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={btnCls(editor.isActive('heading', { level: 5 }))}
          title="Heading 5"
        >
          <Heading5 className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-stone-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnCls(editor.isActive('bulletList'))}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnCls(editor.isActive('orderedList'))}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnCls(editor.isActive('blockquote'))}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-stone-300 mx-1" />

        <button
          type="button"
          onClick={() => openModal('link')}
          className={btnCls(editor.isActive('link'))}
          title="Add/Edit Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className={btnCls(false)}
            title="Remove Link"
          >
            <Unlink className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => openModal('image')}
          className={btnCls(false)}
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => openModal('video')}
          className={btnCls(false)}
          title="Insert Video Embed"
        >
          <Video className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-stone-300 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={`${btnCls(false)} disabled:opacity-35`}
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={`${btnCls(false)} disabled:opacity-35`}
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Inline Dialog for Link / Image / Video */}
      {modalMode && (
        <div className="p-3 bg-secondary/40 border-b border-stone-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-800 uppercase">
              {modalMode === 'link'
                ? 'Set Link URL'
                : modalMode === 'image'
                ? 'Insert Image Block'
                : 'Insert Video Embed'}
            </span>
            <button
              type="button"
              onClick={() => setModalMode(null)}
              className="text-xs text-stone-500 hover:text-stone-700"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder={
                modalMode === 'link'
                  ? 'https://...'
                  : modalMode === 'image'
                  ? 'Image URL (https://res.cloudinary.com/...)'
                  : 'YouTube / Vimeo URL'
              }
              className="rounded border border-stone-300 bg-white px-2.5 py-1.5 text-sm"
            />
            {modalMode === 'image' && (
              <input
                type="text"
                value={inputAlt}
                onChange={(e) => setInputAlt(e.target.value)}
                placeholder="Alt text (recommended)"
                className="rounded border border-stone-300 bg-white px-2.5 py-1.5 text-sm"
              />
            )}
            {(modalMode === 'image' || modalMode === 'video') && (
              <input
                type="text"
                value={inputCaption}
                onChange={(e) => setInputCaption(e.target.value)}
                placeholder="Caption (optional)"
                className="rounded border border-stone-300 bg-white px-2.5 py-1.5 text-sm"
              />
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={submitModal}
              className="px-3 py-1 rounded bg-primary text-white text-xs font-medium hover:bg-primary-light"
            >
              Insert
            </button>
          </div>
        </div>
      )}

      {/* Editor Canvas */}
      <EditorContent editor={editor} />

      {error && (
        <div className="px-3 py-2 bg-red-50 border-t border-red-200 text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
