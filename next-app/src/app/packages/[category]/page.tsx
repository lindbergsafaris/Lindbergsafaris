import { Metadata } from 'next';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import TourCard from '@/components/tours/TourCard';
import JsonLd from '@/components/JsonLd';
import {
  getThemedPackageByCategory,
  getPackagesByCategory,
  getAllThemedPackages,
} from '@/lib/data';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

const KNOWN_CATEGORIES = [
  'wildlife',
  'climbing',
  'cruise',
  'adventure',
  'pilgrimages',
  'corporate',
];

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const themed = await getAllThemedPackages();
  const sanityCategories = themed.map((p) => p.category).filter(Boolean);
  const categories = Array.from(new Set([...KNOWN_CATEGORIES, ...sanityCategories]));
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const themed = await getThemedPackageByCategory(category);

  const formattedName = category
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const title = themed?.title || `${formattedName} Packages`;
  const description =
    themed?.description ||
    `Explore bespoke ${formattedName.toLowerCase()} safari packages and holiday itineraries with Lindberg Safaris.`;
  const canonicalUrl = `${SITE_URL}/packages/${category}`;
  const image = themed?.heroImage?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801';

  return {
    title: `${title} | Lindberg Safaris`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${title} | Lindberg Safaris`,
      description,
      url: canonicalUrl,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Lindberg Safaris`,
      description,
      images: [image],
    },
  };
}

export default async function ThemedPackagePage({ params }: PageProps) {
  const { category } = await params;
  const [themedPackage, packages] = await Promise.all([
    getThemedPackageByCategory(category),
    getPackagesByCategory(category),
  ]);

  const formattedName = category
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const title = themedPackage?.title || `${formattedName} Packages`;
  const heroImage =
    themedPackage?.heroImage?.url ||
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80';
  const description =
    themedPackage?.description ||
    `Experience the best of East Africa with our specially curated ${formattedName.toLowerCase()} adventures.`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description,
    url: `${SITE_URL}/packages/${category}`,
    numberOfItems: packages.length,
    itemListElement: packages.map((pkg, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: pkg.title,
      description: pkg.description,
      image: pkg.image?.url,
    })),
  };

  return (
    <>
      <JsonLd schema={schema} />

      {/* Hero Section */}
      <div className="relative min-h-[500px] flex items-center justify-center text-white pt-28 pb-16">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url("${heroImage}")` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 capitalize">{title}</h1>
          <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto text-gray-200 mb-8">
            {description}
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white border-none">
              Plan Your Trip
            </Button>
          </Link>
        </Container>
      </div>

      {/* Content Section */}
      <Section className="bg-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {themedPackage?.content && (
              <div className="prose prose-lg text-gray-600 leading-relaxed mb-12">
                {Array.isArray(themedPackage.content) ? (
                  <PortableText
                    value={themedPackage.content}
                    components={{
                      types: {
                        image: ({ value }) => {
                          if (!value?.url) return null;
                          return (
                            <div className="flex justify-center my-8">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={value.url}
                                alt={value.alt || 'Themed Package'}
                                className="rounded-lg shadow-md max-w-full h-auto"
                              />
                            </div>
                          );
                        },
                      },
                    }}
                  />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: themedPackage.content }} />
                )}
              </div>
            )}

            {/* Packages Grid */}
            <div className="mt-12">
              <h2 className="text-3xl font-serif font-bold mb-8 text-gray-900 text-center">
                Available {title}
              </h2>
              {packages.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-lg">
                    Custom packages available on request for this category.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Contact our safari consultants for bespoke itineraries.
                  </p>
                  <Link href="/contact" className="inline-block mt-4">
                    <Button variant="primary">Inquire Now</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {packages.map((pkg) => (
                    <TourCard
                      key={pkg._id}
                      id={pkg._id}
                      title={pkg.title}
                      image={pkg.image?.url || heroImage}
                      duration={pkg.duration || 'Flexible'}
                      groupSize="Custom"
                      price={pkg.price || 0}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
