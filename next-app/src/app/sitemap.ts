import { MetadataRoute } from 'next';
import {
  getAllTourSlugs,
  getAllBlogSlugs,
  getAllDestinationSlugs,
  getDestinationCategories,
  getAllThemedPackages,
  getAllAccommodationSlugs,
} from '@/lib/data';
import { destinationsData } from '@/data/destinations';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 3600;

const ACCOMMODATION_CATEGORIES = [
  'lodges',
  'holiday-homes',
  'town-hotels',
  'luxury-camps',
  'resort-hotels',
  'bush-camps',
];

const KNOWN_PACKAGE_CATEGORIES = [
  'wildlife',
  'climbing',
  'cruise',
  'adventure',
  'pilgrimages',
  'corporate',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static core pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/tours`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/company`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/services/transport`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/services/flights`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/services/hotel-booking`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/services/visa`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/services/custom-itineraries`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/gallery`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
  ];

  // Tours
  const tourSlugs = await getAllTourSlugs();
  const tourRoutes: MetadataRoute.Sitemap = tourSlugs.map((slug) => ({
    url: `${SITE_URL}/tours/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Blog posts
  const blogSlugs = await getAllBlogSlugs();
  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Destinations
  const sanityDestSlugs = await getAllDestinationSlugs();
  const staticDestSlugs = Object.keys(destinationsData);
  const allDestSlugs = Array.from(new Set([...sanityDestSlugs, ...staticDestSlugs]));
  const destRoutes: MetadataRoute.Sitemap = allDestSlugs.map((slug) => ({
    url: `${SITE_URL}/destinations/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Regions
  const categories = await getDestinationCategories();
  const regionRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/regions/${cat.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Themed Packages
  const themed = await getAllThemedPackages();
  const themedCats = Array.from(
    new Set([...KNOWN_PACKAGE_CATEGORIES, ...themed.map((p) => p.category).filter(Boolean)])
  );
  const packageRoutes: MetadataRoute.Sitemap = themedCats.map((cat) => ({
    url: `${SITE_URL}/packages/${cat}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Accommodations: categories + individual accommodations
  const accCategoryRoutes: MetadataRoute.Sitemap = ACCOMMODATION_CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/accommodation/${cat}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const accSlugs = await getAllAccommodationSlugs();
  const accDetailRoutes: MetadataRoute.Sitemap = accSlugs.map((slug) => ({
    url: `${SITE_URL}/accommodation/${encodeURIComponent(slug)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...tourRoutes,
    ...blogRoutes,
    ...destRoutes,
    ...regionRoutes,
    ...packageRoutes,
    ...accCategoryRoutes,
    ...accDetailRoutes,
  ];
}
