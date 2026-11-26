/**
 * Security tests for sanitizeRichHtml (tiptap-html.ts).
 *
 * Proves every dangerous payload is neutralised:
 *   1. <script> (closed and unclosed)
 *   2. <img src=x onerror=alert(1)>
 *   3. <a href="javascript:alert(1)"> (raw, entity-encoded, protocol-relative bypass)
 *   4. <svg onload=alert(1)> (closed and self-closing/unclosed)
 *   5. Any style="..." attribute
 *   6. <iframe src="https://evil.example">
 *   7. <iframe src="https://www.youtube.com/embed/abc" onload="x">
 *   8. <img src="data:...">
 *   Plus verification that editor-produced h2..h5 are allowed and h1/h6/table are stripped.
 */
import { sanitizeRichHtml } from '../src/lib/tiptap-html';

function doesNotContain(output: string, pattern: RegExp | string, label: string) {
  const match = typeof pattern === 'string' ? output.includes(pattern) : pattern.test(output);
  if (match) {
    throw new Error(
      `FAIL [${label}]: pattern found in output:\n  pattern: ${pattern}\n  output: ${output}`
    );
  }
}

function contains(output: string, pattern: RegExp | string, label: string) {
  const match = typeof pattern === 'string' ? output.includes(pattern) : pattern.test(output);
  if (!match) {
    throw new Error(
      `FAIL [${label}]: expected pattern missing:\n  expected: ${pattern}\n  output: ${output}`
    );
  }
}

test('1a. neutralises <script>alert(1)</script> and its body', () => {
  const out = sanitizeRichHtml('<p>hello</p><script>alert(1)</script><p>world</p>');
  doesNotContain(out, /<script/i, 'no script tag');
  doesNotContain(out, 'alert(1)', 'no script body');
  contains(out, '<p>hello</p>', 'safe p kept');
});

test('1b. neutralises unclosed <script>alert(1)', () => {
  const out = sanitizeRichHtml('<p>ok</p><script>alert(1)');
  doesNotContain(out, /<script/i, 'no unclosed script tag');
  doesNotContain(out, 'alert(1)', 'no unclosed script body');
});

test('2a. neutralises exact <img src=x onerror=alert(1)>', () => {
  const out = sanitizeRichHtml('<img src=x onerror=alert(1)>');
  doesNotContain(out, /onerror/i, 'no onerror');
  doesNotContain(out, 'alert(1)', 'no payload');
  doesNotContain(out, '<img', 'broken img with invalid src dropped');
});

test('2b. strips onerror from valid https <img>', () => {
  const out = sanitizeRichHtml('<img src="https://example.com/img.jpg" onerror=alert(1) alt="x">');
  doesNotContain(out, /onerror/i, 'no onerror attribute');
  doesNotContain(out, 'alert(1)', 'no alert');
  contains(out, 'src="https://example.com/img.jpg"', 'safe src kept');
});

test('3a. neutralises <a href="javascript:alert(1)">', () => {
  const out = sanitizeRichHtml('<a href="javascript:alert(1)">click</a>');
  doesNotContain(out, /javascript:/i, 'no javascript: href');
  doesNotContain(out, 'alert(1)', 'no alert');
});

test('3b. neutralises entity-encoded javascript: and /&#47; protocol-relative bypasses', () => {
  const out1 = sanitizeRichHtml('<a href="&#106;avascript:alert(1)">x</a>');
  doesNotContain(out1, /href=/i, 'no encoded js href');
  const out2 = sanitizeRichHtml('<a href="&#x6a;avascript:alert(1)">x</a>');
  doesNotContain(out2, /href=/i, 'no hex js href');
  const out3 = sanitizeRichHtml('<a href="/&#47;evil.example/steal">x</a>');
  doesNotContain(out3, /href=/i, 'no entity protocol-relative bypass');
});

test('4a. neutralises <svg onload=alert(1)> (unclosed/self-closing)', () => {
  const out = sanitizeRichHtml('<svg onload=alert(1)>');
  doesNotContain(out, /<svg/i, 'no svg');
  doesNotContain(out, /onload/i, 'no onload');
  doesNotContain(out, 'alert(1)', 'no alert');
});

test('4b. neutralises <svg onload=alert(1)><circle/></svg>', () => {
  const out = sanitizeRichHtml('<svg onload=alert(1)><circle r="10"/></svg>');
  doesNotContain(out, /<svg/i, 'no svg');
  doesNotContain(out, /onload/i, 'no onload');
  doesNotContain(out, 'circle', 'no svg children');
});

test('5. strips style="..." attribute on any tag', () => {
  const out = sanitizeRichHtml(
    '<p style="color:red;background:url(x)">p</p>' +
      '<a href="https://example.com" style="position:fixed">a</a>' +
      '<img src="https://example.com/a.jpg" alt="a" style="width:9999px">'
  );
  doesNotContain(out, /style\s*=/i, 'no style attributes');
  contains(out, '<p>p</p>', 'p content kept');
  contains(out, 'href="https://example.com"', 'safe href kept');
});

test('6. neutralises <iframe src="https://evil.example">', () => {
  const out1 = sanitizeRichHtml('<iframe src="https://evil.example">');
  doesNotContain(out1, /<iframe/i, 'no unclosed evil iframe');
  doesNotContain(out1, 'evil.example', 'no evil url');

  const out2 = sanitizeRichHtml('<iframe src="https://evil.example">fallback</iframe>');
  doesNotContain(out2, /<iframe/i, 'no evil iframe');
  doesNotContain(out2, 'evil.example', 'no evil url');
});

test('7. allows YouTube embed iframe while stripping onload="x"', () => {
  const out = sanitizeRichHtml(
    '<iframe src="https://www.youtube.com/embed/abc" onload="x"></iframe>'
  );
  contains(out, 'src="https://www.youtube.com/embed/abc"', 'youtube embed preserved');
  doesNotContain(out, /onload/i, 'onload stripped from youtube iframe');
});

test('8. neutralises <img> with data: URL', () => {
  const out = sanitizeRichHtml(
    '<img src="data:image/png;base64,iVBORw0KGgo=" alt="x">'
  );
  doesNotContain(out, /data:/i, 'no data: URL');
  doesNotContain(out, '<img', 'img with data: URL dropped');
});

test('9. keeps h2-h5 and strips h1, h6, style tag, and table tags', () => {
  const out = sanitizeRichHtml(
    '<h1>H1</h1><h2>H2</h2><h5>H5</h5><h6>H6</h6>' +
      '<style>body{display:none}</style>' +
      '<table><tr><td>cell</td></tr></table>'
  );
  contains(out, '<h2>H2</h2>', 'h2 kept');
  contains(out, '<h5>H5</h5>', 'h5 kept');
  doesNotContain(out, /<h1|<h6|<style|<table|<tr|<td/i, 'disallowed tags stripped');
  doesNotContain(out, 'display:none', 'style body stripped');
});
