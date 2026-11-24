/**
 * portableTextToTiptap.test.ts
 *
 * Unit tests for the Portable Text → Tiptap converter.
 * Uses real content shapes extracted from cms-source/data.ndjson.
 */

import { portableTextToTiptap, extractPlainText, extractPlainTextFromPT, EMPTY_DOC } from '../lib/portableTextToTiptap';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function para(text: string) {
  return { type: 'paragraph', content: [{ type: 'text', text }] };
}

// ---------------------------------------------------------------------------
// 1. Empty / null input
// ---------------------------------------------------------------------------

describe('portableTextToTiptap – edge cases', () => {
  test('null input returns EMPTY_DOC', () => {
    expect(portableTextToTiptap(null as unknown as unknown[])).toEqual(EMPTY_DOC);
  });

  test('empty array returns EMPTY_DOC', () => {
    expect(portableTextToTiptap([])).toEqual(EMPTY_DOC);
  });

  test('array with null entries does not crash', () => {
    const result = portableTextToTiptap([null, undefined]);
    expect(result.type).toBe('doc');
    expect(result.content).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// 2. Paragraphs
// ---------------------------------------------------------------------------

describe('paragraphs', () => {
  test('simple normal block becomes a paragraph', () => {
    const input = [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Hello world', marks: [] }],
        markDefs: [],
      },
    ];
    const result = portableTextToTiptap(input);
    expect(result.content).toHaveLength(1);
    expect(result.content[0]).toEqual(para('Hello world'));
  });

  test('multiple paragraphs', () => {
    const input = [
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'First', marks: [] }], markDefs: [] },
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Second', marks: [] }], markDefs: [] },
    ];
    const result = portableTextToTiptap(input);
    expect(result.content).toHaveLength(2);
    expect(result.content[0]).toEqual(para('First'));
    expect(result.content[1]).toEqual(para('Second'));
  });
});

// ---------------------------------------------------------------------------
// 3. Headings
// ---------------------------------------------------------------------------

describe('headings', () => {
  test.each([['h2', 2], ['h3', 3], ['h4', 4], ['h5', 5]])('style %s → heading level %d', (style, level) => {
    const input = [
      {
        _type: 'block',
        style,
        children: [{ _type: 'span', text: 'Heading text', marks: [] }],
        markDefs: [],
      },
    ];
    const result = portableTextToTiptap(input);
    expect(result.content[0].type).toBe('heading');
    expect(result.content[0].attrs?.level).toBe(level);
    expect(result.content[0].content?.[0].text).toBe('Heading text');
  });

  test('h5 preserves text in plain-text extraction', () => {
    const input = [
      { _type: 'block', style: 'h5', children: [{ _type: 'span', text: 'Sub-section', marks: [] }], markDefs: [] },
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Body text', marks: [] }], markDefs: [] },
    ];
    const result = portableTextToTiptap(input);
    const text = extractPlainText(result);
    expect(text).toContain('Sub-section');
    expect(text).toContain('Body text');
  });
});

// ---------------------------------------------------------------------------
// 4. Blockquote
// ---------------------------------------------------------------------------

describe('blockquote', () => {
  test('blockquote wraps in paragraph', () => {
    const input = [
      {
        _type: 'block',
        style: 'blockquote',
        children: [{ _type: 'span', text: 'A wise quote', marks: [] }],
        markDefs: [],
      },
    ];
    const result = portableTextToTiptap(input);
    expect(result.content[0].type).toBe('blockquote');
    expect(result.content[0].content?.[0].type).toBe('paragraph');
    expect(result.content[0].content?.[0].content?.[0].text).toBe('A wise quote');
  });
});

// ---------------------------------------------------------------------------
// 5. Marks (decorators)
// ---------------------------------------------------------------------------

describe('marks – decorators', () => {
  const cases: [string, string][] = [
    ['strong',        'bold'],
    ['em',            'italic'],
    ['code',          'code'],
    ['underline',     'underline'],
    ['strike-through','strike'],
  ];

  test.each(cases)('mark %s → %s', (sanityMark, tiptapMark) => {
    const input = [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'marked', marks: [sanityMark] }],
        markDefs: [],
      },
    ];
    const result = portableTextToTiptap(input);
    const textNode = result.content[0].content?.[0];
    expect(textNode?.marks?.some((m) => m.type === tiptapMark)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 6. Link mark
// ---------------------------------------------------------------------------

describe('marks – link', () => {
  test('link markDef becomes a link mark with href', () => {
    const input = [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'click here', marks: ['link1'] }],
        markDefs: [{ _key: 'link1', _type: 'link', href: 'https://example.com' }],
      },
    ];
    const result = portableTextToTiptap(input);
    const textNode = result.content[0].content?.[0];
    const linkMark = textNode?.marks?.find((m) => m.type === 'link');
    expect(linkMark).toBeDefined();
    expect(linkMark?.attrs?.href).toBe('https://example.com');
  });
});

// ---------------------------------------------------------------------------
// 7. Bullet list
// ---------------------------------------------------------------------------

describe('lists', () => {
  test('bullet list items are coalesced into bulletList', () => {
    const input = [
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        children: [{ _type: 'span', text: 'Item A', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        children: [{ _type: 'span', text: 'Item B', marks: [] }],
        markDefs: [],
      },
    ];
    const result = portableTextToTiptap(input);
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe('bulletList');
    expect(result.content[0].content).toHaveLength(2);
    expect(result.content[0].content?.[0].type).toBe('listItem');
  });

  test('ordered list items are coalesced into orderedList', () => {
    const input = [
      {
        _type: 'block',
        style: 'normal',
        listItem: 'number',
        level: 1,
        children: [{ _type: 'span', text: 'Step 1', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        listItem: 'number',
        level: 1,
        children: [{ _type: 'span', text: 'Step 2', marks: [] }],
        markDefs: [],
      },
    ];
    const result = portableTextToTiptap(input);
    expect(result.content[0].type).toBe('orderedList');
    expect(result.content[0].content).toHaveLength(2);
  });

  test('list followed by paragraph separates correctly', () => {
    const input = [
      {
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        children: [{ _type: 'span', text: 'Bullet', marks: [] }],
        markDefs: [],
      },
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'After list', marks: [] }],
        markDefs: [],
      },
    ];
    const result = portableTextToTiptap(input);
    expect(result.content).toHaveLength(2);
    expect(result.content[0].type).toBe('bulletList');
    expect(result.content[1].type).toBe('paragraph');
  });
});

// ---------------------------------------------------------------------------
// 8. Custom blocks
// ---------------------------------------------------------------------------

describe('custom block types', () => {
  test('externalImage block', () => {
    const input = [
      {
        _type: 'externalImage',
        url: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1234/test.jpg',
        alt: 'Test',
        caption: 'Caption text',
      },
    ];
    const result = portableTextToTiptap(input);
    expect(result.content[0].type).toBe('externalImage');
    expect(result.content[0].attrs?.url).toContain('cloudinary');
    expect(result.content[0].attrs?.alt).toBe('Test');
    expect(result.content[0].attrs?.caption).toBe('Caption text');
  });

  test('image block', () => {
    const input = [
      {
        _type: 'image',
        url: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1234/photo.jpg',
        alt: 'Photo',
      },
    ];
    const result = portableTextToTiptap(input);
    expect(result.content[0].type).toBe('customImage');
    expect(result.content[0].attrs?.url).toContain('cloudinary');
  });

  test('videoEmbed block', () => {
    const input = [
      {
        _type: 'videoEmbed',
        url: 'https://www.youtube.com/watch?v=abc123',
        caption: 'Watch this',
      },
    ];
    const result = portableTextToTiptap(input);
    expect(result.content[0].type).toBe('videoEmbed');
    expect(result.content[0].attrs?.url).toBe('https://www.youtube.com/watch?v=abc123');
    expect(result.content[0].attrs?.caption).toBe('Watch this');
  });
});

// ---------------------------------------------------------------------------
// 9. Real content samples (shapes from actual data.ndjson)
// ---------------------------------------------------------------------------

describe('real content samples', () => {
  // Blog post content shape (simplified from actual Altitude Training Kenya post)
  const blogContentSample = [
    {
      _type: 'block',
      style: 'normal',
      _key: 'intro',
      children: [
        { _type: 'span', _key: 's1', text: 'Kenya offers world-class ', marks: [] },
        { _type: 'span', _key: 's2', text: 'altitude training', marks: ['strong'] },
        { _type: 'span', _key: 's3', text: ' at elevations exceeding 2,400m.', marks: [] },
      ],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'h2',
      _key: 'h2a',
      children: [{ _type: 'span', _key: 's4', text: 'Top Locations', marks: [] }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      _key: 'b2',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', _key: 's5', text: 'Iten – Home of Champions', marks: [] }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'normal',
      _key: 'b3',
      listItem: 'bullet',
      level: 1,
      children: [{ _type: 'span', _key: 's6', text: 'Eldoret Training Camps', marks: [] }],
      markDefs: [],
    },
  ];

  test('blog post sample converts correctly', () => {
    const result = portableTextToTiptap(blogContentSample);
    expect(result.type).toBe('doc');
    // paragraph + heading + bulletList = 3 nodes
    expect(result.content).toHaveLength(3);
    expect(result.content[0].type).toBe('paragraph');
    expect(result.content[1].type).toBe('heading');
    expect(result.content[1].attrs?.level).toBe(2);
    expect(result.content[2].type).toBe('bulletList');
    expect(result.content[2].content).toHaveLength(2);
  });

  test('plain text round-trip preserves text content', () => {
    const result = portableTextToTiptap(blogContentSample);
    const tiptapText = extractPlainText(result);
    const ptText = extractPlainTextFromPT(blogContentSample);
    // Every word in PT text should appear somewhere in Tiptap text (whitespace-insensitive)
    const tiptapNorm = tiptapText.replace(/\s+/g, '');
    const ptNorm = ptText.replace(/\s+/g, '');
    expect(tiptapNorm).toBe(ptNorm);
  });

  // Destination post with link – real shape from amboseli description
  const destinationSample = [
    {
      _type: 'block',
      style: 'normal',
      _key: 'd1',
      children: [
        { _type: 'span', _key: 'ds1', text: 'Visit ', marks: [] },
        { _type: 'span', _key: 'ds2', text: 'Amboseli National Park', marks: ['ref1'] },
        { _type: 'span', _key: 'ds3', text: ' for stunning views.', marks: [] },
      ],
      markDefs: [
        { _key: 'ref1', _type: 'link', href: 'https://www.kws.go.ke/amboseli' },
      ],
    },
  ];

  test('destination post with link converts correctly', () => {
    const result = portableTextToTiptap(destinationSample);
    expect(result.content[0].type).toBe('paragraph');
    const linked = result.content[0].content?.find((n) =>
      n.marks?.some((m) => m.type === 'link')
    );
    expect(linked).toBeDefined();
    expect(linked?.marks?.find((m) => m.type === 'link')?.attrs?.href).toBe('https://www.kws.go.ke/amboseli');
  });

  // Themed package with mixed content
  const themedPackageSample = [
    {
      _type: 'block',
      style: 'normal',
      _key: 'tp1',
      children: [{ _type: 'span', _key: 'ts1', text: 'Faith-based journeys to sacred sites.', marks: [] }],
      markDefs: [],
    },
    {
      _type: 'block',
      style: 'blockquote',
      _key: 'tp2',
      children: [{ _type: 'span', _key: 'ts2', text: 'A journey of a thousand miles begins with faith.', marks: [] }],
      markDefs: [],
    },
    {
      _type: 'externalImage',
      _key: 'tp3',
      url: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1234/faith.jpg',
      alt: 'Sacred site',
      caption: 'A pilgrimage destination',
    },
  ];

  test('themed package with blockquote and externalImage', () => {
    const result = portableTextToTiptap(themedPackageSample);
    expect(result.content).toHaveLength(3);
    expect(result.content[0].type).toBe('paragraph');
    expect(result.content[1].type).toBe('blockquote');
    expect(result.content[2].type).toBe('externalImage');
  });
});

// ---------------------------------------------------------------------------
// 10. Multiple marks on a single span
// ---------------------------------------------------------------------------

describe('multiple marks on one span', () => {
  test('bold + italic applied together', () => {
    const input = [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Important!', marks: ['strong', 'em'] }],
        markDefs: [],
      },
    ];
    const result = portableTextToTiptap(input);
    const textNode = result.content[0].content?.[0];
    const types = textNode?.marks?.map((m) => m.type) ?? [];
    expect(types).toContain('bold');
    expect(types).toContain('italic');
  });
});

// ---------------------------------------------------------------------------
// 11. Fail-fast: unsupported block styles and marks
// ---------------------------------------------------------------------------

describe('fail-fast on unsupported content', () => {
  test('unknown block style throws an error', () => {
    const input = [
      {
        _type: 'block',
        style: 'fancy-style',
        children: [{ _type: 'span', text: 'Text', marks: [] }],
        markDefs: [],
      },
    ];
    expect(() => portableTextToTiptap(input)).toThrow(/unsupported.*style.*fancy-style/i);
  });

  test('unknown decorator mark throws an error', () => {
    const input = [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Text', marks: ['rainbow'] }],
        markDefs: [],
      },
    ];
    expect(() => portableTextToTiptap(input)).toThrow(/unsupported.*mark.*rainbow/i);
  });

  test('unknown markDef type throws an error', () => {
    const input = [
      {
        _type: 'block',
        style: 'normal',
        children: [{ _type: 'span', text: 'Text', marks: ['ref1'] }],
        markDefs: [{ _key: 'ref1', _type: 'footnote' }],
      },
    ];
    expect(() => portableTextToTiptap(input)).toThrow(/unsupported.*markDef.*footnote/i);
  });

  test('h5 does NOT throw', () => {
    const input = [
      { _type: 'block', style: 'h5', children: [{ _type: 'span', text: 'OK', marks: [] }], markDefs: [] },
    ];
    expect(() => portableTextToTiptap(input)).not.toThrow();
    const result = portableTextToTiptap(input);
    expect(result.content[0]).toMatchObject({ type: 'heading', attrs: { level: 5 } });
  });

  test('h1 does NOT throw (unusual but allowed)', () => {
    const input = [
      { _type: 'block', style: 'h1', children: [{ _type: 'span', text: 'Title', marks: [] }], markDefs: [] },
    ];
    expect(() => portableTextToTiptap(input)).not.toThrow();
  });
});
