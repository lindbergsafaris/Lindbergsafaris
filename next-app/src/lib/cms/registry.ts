import type { ContentTypeConfig } from './types';
import { toursConfig } from './configs/tours.config';
import { blogPostsConfig } from './configs/blogPosts.config';
import { accommodationsConfig } from './configs/accommodations.config';

export const CONTENT_TYPE_CONFIGS: ContentTypeConfig[] = [
  toursConfig,
  blogPostsConfig,
  accommodationsConfig,
];

const CONFIG_BY_SLUG = new Map<string, ContentTypeConfig>(
  CONTENT_TYPE_CONFIGS.map((c) => [c.slug, c])
);

export function getContentTypeConfig(slug: string): ContentTypeConfig | null {
  return CONFIG_BY_SLUG.get(slug) ?? null;
}
