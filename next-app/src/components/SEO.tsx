/**
 * In Next.js App Router, metadata is handled natively via `generateMetadata` or `metadata` exports,
 * and structured data is rendered via `<JsonLd schema={...} />`.
 * This stub ensures no legacy imports cause build failures.
 */
import JsonLd from './JsonLd';

export default function SEO({ schema }: { schema?: object | object[] }) {
  if (!schema) return null;
  return <JsonLd schema={schema} />;
}
