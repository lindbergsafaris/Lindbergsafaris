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
import { slugify } from '@/lib/slugUtils';
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

  // Core public static pages (strictly indexable only; NO /quiz, NO /gallery, NO /services/hotels)
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
  ];

  // Tours (clean slugs only)
  const tourSlugs = await getAllTourSlugs();
  const cleanTourSlugs = Array.from(new Set(tourSlugs.map((s) => slugify(s)).filter(Boolean)));
  const tourRoutes: MetadataRoute.Sitemap = cleanTourSlugs.map((slug) => ({
    url: `${SITE_URL}/tours/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Blog posts (clean slugs only)
  const blogSlugs = await getAllBlogSlugs();
  const cleanBlogSlugs = Array.from(new Set(blogSlugs.map((s) => slugify(s)).filter(Boolean)));
  const blogRoutes: MetadataRoute.Sitemap = cleanBlogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Destinations (clean slugs only)
  const sanityDestSlugs = await getAllDestinationSlugs();
  const staticDestSlugs = Object.keys(destinationsData);
  const allDestSlugs = Array.from(
    new Set([...sanityDestSlugs, ...staticDestSlugs].map((s) => slugify(s)).filter(Boolean))
  );
  const destRoutes: MetadataRoute.Sitemap = allDestSlugs.map((slug) => ({
    url: `${SITE_URL}/destinations/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Regions
  const categories = await getDestinationCategories();
  const regionRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${SITE_URL}/regions/${slugify(cat.slug || cat.name)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Themed Packages
  const themed = await getAllThemedPackages();
  const themedCats = Array.from(
    new Set([...KNOWN_PACKAGE_CATEGORIES, ...themed.map((p) => p.category).filter(Boolean)].map(slugify))
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
  const cleanAccSlugs = Array.from(new Set(accSlugs.map(slugify).filter(Boolean)));
  const accDetailRoutes: MetadataRoute.Sitemap = cleanAccSlugs.map((slug) => ({
    url: `${SITE_URL}/accommodation/${slug}`,
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
