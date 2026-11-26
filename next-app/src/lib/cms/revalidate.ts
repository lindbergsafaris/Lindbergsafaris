import { revalidatePath, revalidateTag } from 'next/cache';
import type { ContentTypeConfig } from './types';

/**
 * Revalidates Next.js cache tags and public routes affected by an admin content change.
 */
export function revalidatePublicContent(
  config: ContentTypeConfig,
  record?: Record<string, unknown> | null,
  previousSlug?: string | null
): void {
  for (const tag of config.revalidateTags) {
    revalidateTag(tag, { expire: 0 });
  }

  const slug = typeof record?.slug === 'string' ? record.slug : null;
  const category = typeof record?.category === 'string' ? record.category : null;
  const accType = typeof record?.type === 'string' ? record.type : null;

  switch (config.slug) {
    case 'tours':
      revalidatePath('/');
      revalidatePath('/tours');
      revalidatePath('/sitemap.xml');
      if (slug) revalidatePath(`/tours/${slug}`);
      if (previousSlug && previousSlug !== slug) revalidatePath(`/tours/${previousSlug}`);
      break;
    case 'blog-posts':
      revalidatePath('/blog');
      revalidatePath('/sitemap.xml');
      if (slug) revalidatePath(`/blog/${slug}`);
      if (previousSlug && previousSlug !== slug) revalidatePath(`/blog/${previousSlug}`);
      break;
    case 'accommodations':
      revalidatePath('/services/hotel-booking');
      revalidatePath('/sitemap.xml');
      if (accType) revalidatePath(`/accommodation/${accType}`);
      if (slug) revalidatePath(`/accommodation/${slug}`);
      if (previousSlug && previousSlug !== slug) revalidatePath(`/accommodation/${previousSlug}`);
      break;
    case 'hot-deals':
    case 'popup-offers':
    case 'hero-slides':
      revalidatePath('/');
      break;
    case 'team-members':
    case 'partners':
      revalidatePath('/');
      revalidatePath('/company');
      break;
    case 'gallery-images':
      revalidatePath('/gallery');
      break;
    case 'fleet-vehicles':
      revalidatePath('/services/transport');
      break;
    case 'destination-categories':
      revalidatePath('/');
      revalidatePath('/sitemap.xml');
      revalidatePath('/regions/[region]', 'page');
      if (slug) revalidatePath(`/regions/${slug}`);
      break;
    case 'destination-posts':
      revalidatePath('/sitemap.xml');
      revalidatePath('/regions/[region]', 'page');
      if (slug) revalidatePath(`/destinations/${slug}`);
      if (previousSlug && previousSlug !== slug) revalidatePath(`/destinations/${previousSlug}`);
      break;
    case 'themed-packages':
      revalidatePath('/sitemap.xml');
      revalidatePath('/packages/[category]', 'page');
      if (category) revalidatePath(`/packages/${category}`);
      break;
    case 'packages':
      revalidatePath('/packages/[category]', 'page');
      if (category) revalidatePath(`/packages/${category}`);
      break;
    default:
      break;
  }
}
