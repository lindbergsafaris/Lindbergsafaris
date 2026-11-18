import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import ToursClientView from '@/components/tours/ToursClientView';
import JsonLd from '@/components/JsonLd';
import { getTours } from '@/lib/data';
import { createBreadcrumbsSchema } from '@/lib/breadcrumbs';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'East Africa Safari Tours',
  description: 'Explore our curated collection of Kenya safaris, Masai Mara tours, Tanzania wildlife safaris, and custom East African holiday packages with expert guides.',
  alternates: { canonical: `${SITE_URL}/tours` },
  openGraph: {
    title: 'East Africa Safari Tours | Lindberg Safaris',
    description: 'Explore our curated collection of Kenya safaris, Masai Mara tours, Tanzania wildlife safaris, and custom East African holiday packages.',
    url: `${SITE_URL}/tours`,
  },
  twitter: { card: 'summary_large_image' },
};

export default async function ToursPage() {
  const tours = await getTours();

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Safari Tours & Packages',
    url: `${SITE_URL}/tours`,
    numberOfItems: tours.length,
    itemListElement: tours.map((tour, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/tours/${tour.slug?.current || tour._id}`,
      name: tour.title,
    })),
  };

  const breadcrumbsSchema = createBreadcrumbsSchema([
    { name: 'Tours', url: '/tours' },
  ]);

  return (
    <>
      <JsonLd schema={itemListSchema} />
      <JsonLd schema={breadcrumbsSchema} />
      {/* Hero Section */}
      <div className="bg-primary text-white py-20">
        <Container>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Safari Tours &amp; Holiday Packages in East Africa</h1>
          <p className="text-lg text-gray-100 max-w-2xl">
            Discover our handpicked collection of unforgettable safari experiences across East Africa.
          </p>
        </Container>
      </div>

      <Section className="bg-primary">
        <Container>
          <ToursClientView initialTours={tours} />
        </Container>
      </Section>
    </>
  );
}
