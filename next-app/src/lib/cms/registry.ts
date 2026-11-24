import type { ContentTypeConfig } from './types';
import { toursConfig } from './configs/tours.config';
import { blogPostsConfig } from './configs/blogPosts.config';
import { accommodationsConfig } from './configs/accommodations.config';
import { hotDealsConfig } from './configs/hotDeals.config';
import { popupOffersConfig } from './configs/popupOffers.config';
import { destinationCategoriesConfig } from './configs/destinationCategories.config';
import { destinationPostsConfig } from './configs/destinationPosts.config';
import { themedPackagesConfig } from './configs/themedPackages.config';
import { packagesConfig } from './configs/packages.config';
import { teamMembersConfig } from './configs/teamMembers.config';
import { galleryImagesConfig } from './configs/galleryImages.config';
import { fleetVehiclesConfig } from './configs/fleetVehicles.config';
import { heroSlidesConfig } from './configs/heroSlides.config';
import { partnersConfig } from './configs/partners.config';
import { redirectsConfig } from './configs/redirects.config';

export const CONTENT_TYPE_CONFIGS: ContentTypeConfig[] = [
  toursConfig,
  blogPostsConfig,
  accommodationsConfig,
  hotDealsConfig,
  popupOffersConfig,
  destinationCategoriesConfig,
  destinationPostsConfig,
  themedPackagesConfig,
  packagesConfig,
  teamMembersConfig,
  galleryImagesConfig,
  fleetVehiclesConfig,
  heroSlidesConfig,
  partnersConfig,
  redirectsConfig,
];

const CONFIG_BY_SLUG = new Map<string, ContentTypeConfig>(
  CONTENT_TYPE_CONFIGS.map((c) => [c.slug, c])
);

export function getContentTypeConfig(slug: string): ContentTypeConfig | null {
  return CONFIG_BY_SLUG.get(slug) ?? null;
}
