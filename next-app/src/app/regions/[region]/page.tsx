import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import DestinationCard from '@/components/destinations/DestinationCard';
import RegionNavigator from '@/components/destinations/RegionNavigator';
import JsonLd from '@/components/JsonLd';
import {
  getDestinationCategories,
  getDestinationCategoryBySlug,
  getDestinationPostsByCategory,
} from '@/lib/data';
import { createBreadcrumbsSchema } from '@/lib/breadcrumbs';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ region: string }>;
}

export async function generateStaticParams() {
  const categories = await getDestinationCategories();
  return categories.map((cat) => ({ region: cat.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region } = await params;
  const category = await getDestinationCategoryBySlug(region);

  const fallbackName = region
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const name = category?.name || fallbackName;
  const description = category?.description || `Explore top safari destinations and tour packages in ${name}.`;
  const canonicalUrl = `${SITE_URL}/regions/${region}`;
  const image = category?.image?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801';

  return {
    title: `${name} Safaris & Tour Destinations | Lindberg Safaris`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${name} Safaris & Tour Destinations | Lindberg Safaris`,
      description,
      url: canonicalUrl,
      images: [{ url: image, width: 1200, height: 630, alt: name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} Safaris & Tour Destinations | Lindberg Safaris`,
      description,
      images: [image],
    },
  };
}

export default async function RegionDestinationsPage({ params }: PageProps) {
  const { region } = await params;
  const [category, posts, allCategories] = await Promise.all([
    getDestinationCategoryBySlug(region),
    getDestinationPostsByCategory(region),
    getDestinationCategories(),
  ]);

  if (!category && posts.length === 0) {
    // If not found in Sanity, check if fallback can render or notFound
    const fallbackCategoryName = region
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    if (!fallbackCategoryName) notFound();
  }

  const fallbackCategoryName = region
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const activeName = category?.name || fallbackCategoryName;
  const activeDesc = category?.description || `Explore top safari destinations and tour packages in ${activeName}.`;
  const activeImage = category?.image?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: activeName,
    description: activeDesc,
    url: `${SITE_URL}/regions/${region}`,
    image: activeImage,
  };

  const breadcrumbsSchema = createBreadcrumbsSchema([
    { name: 'Regions', url: '/#destinations' },
    { name: activeName, url: `/regions/${region}` },
  ]);

  return (
    <>
      <JsonLd schema={schema} />
      <JsonLd schema={breadcrumbsSchema} />

      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url("${activeImage}")` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{activeName} Safari Destinations</h1>
          <p className="text-xl font-light tracking-wide max-w-2xl mx-auto">{activeDesc}</p>
        </Container>
      </div>

      <Section className="bg-primary pt-8 pb-4">
        <Container>
          <RegionNavigator currentRegion={region} initialRegions={allCategories} />
        </Container>
      </Section>

      <Section className="bg-primary pt-4">
        <Container>
          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10 text-gray-200">
              <p className="text-lg">Destinations for {activeName} are currently being updated.</p>
              <p className="text-sm mt-2 text-gray-300">Contact us to plan your personalized safari in this region.</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-8">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="flex-grow basis-full md:basis-[calc(50%-2rem)] lg:basis-[calc(25%-2rem)] max-w-full"
                >
                  <DestinationCard
                    id={post.slug}
                    name={post.title}
                    image={post.image?.url || ''}
                    tourCount={post.tourCount || 0}
                  />
                </div>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
