import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calendar, Info, MapPin } from 'lucide-react';
import { PortableText } from '@portabletext/react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import DestinationInquiryForm from '@/components/destinations/DestinationInquiryForm';
import JsonLd from '@/components/JsonLd';
import { getDestinationPostBySlug, getAllDestinationSlugs } from '@/lib/data';
import { destinationsData } from '@/data/destinations';
import { createBreadcrumbsSchema } from '@/lib/breadcrumbs';
import { SITE_URL } from '@/lib/siteConfig';
import { Destination, PlaceToVisit } from '@/types';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const sanitySlugs = await getAllDestinationSlugs();
  const staticSlugs = Object.keys(destinationsData);
  const allSlugs = Array.from(new Set([...sanitySlugs, ...staticSlugs]));
  return allSlugs.map((slug) => ({ slug }));
}

async function getDestination(slug: string): Promise<Destination | null> {
  const post = await getDestinationPostBySlug(slug);
  if (post) {
    return {
      _id: post._id,
      name: post.title,
      slug: { current: post.slug },
      description: post.excerpt || '',
      heroImage: { url: post.image?.url },
      content: post.content,
    } as Destination;
  }

  const staticDest = destinationsData[slug];
  if (staticDest) {
    return {
      _id: staticDest.id,
      name: staticDest.name,
      tagline: staticDest.tagline,
      description: staticDest.description,
      heroImage: { url: staticDest.heroImage },
      highlights: staticDest.highlights,
      practicalInfo: staticDest.practicalInfo,
      placesToVisit: staticDest.placesToVisit,
      slug: { current: slug },
    } as Destination;
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = await getDestination(slug);

  if (!destination) return { title: 'Destination Not Found | Lindberg Safaris' };

  const destImage = destination.heroImage?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801';
  const description = destination.description
    ? destination.description.slice(0, 155)
    : `Explore ${destination.name} safari packages and tour itineraries with Lindberg Safaris.`;
  const destUrl = `${SITE_URL}/destinations/${slug}`;

  return {
    title: `${destination.name} Safari & Travel Guide | Lindberg Safaris`,
    description,
    alternates: { canonical: destUrl },
    openGraph: {
      title: `${destination.name} Safari & Travel Guide | Lindberg Safaris`,
      description,
      url: destUrl,
      images: [{ url: destImage, width: 1200, height: 630, alt: destination.name }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${destination.name} Safari & Travel Guide | Lindberg Safaris`,
      description,
      images: [destImage],
    },
  };
}

export default async function DestinationDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const destination = await getDestination(slug);

  if (!destination) {
    notFound();
  }

  const destImage = destination.heroImage?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: destination.name,
    description: destination.description,
    image: destImage,
  };

  const breadcrumbsSchema = createBreadcrumbsSchema([
    { name: 'Destinations', url: '/#destinations' },
    { name: destination.name, url: `/destinations/${slug}` },
  ]);

  return (
    <>
      <JsonLd schema={schema} />
      <JsonLd schema={breadcrumbsSchema} />

      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url("${destImage}")` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">{destination.name}</h1>
          {destination.tagline && (
            <p className="text-xl md:text-2xl font-light tracking-wide">{destination.tagline}</p>
          )}
        </Container>
      </div>

      <Section className="bg-primary">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-serif font-bold mb-6 text-white">Overview</h2>
              <p className="text-gray-100 leading-relaxed mb-8 text-lg whitespace-pre-line">
                {destination.description}
              </p>

              {destination.content && (
                <div className="prose prose-lg prose-invert text-gray-100 leading-relaxed mb-8 max-w-none">
                  {Array.isArray(destination.content) ? (
                    <PortableText
                      value={destination.content}
                      components={{
                        types: {
                          image: ({ value }) => {
                            if (!value?.url) return null;
                            return (
                              <figure className="my-8">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={value.url}
                                  alt={value.alt || 'Destination Image'}
                                  className="w-full mx-auto h-auto rounded-lg shadow-md"
                                />
                                {value.caption && (
                                  <figcaption className="text-center text-sm text-gray-400 mt-2 italic">
                                    {value.caption}
                                  </figcaption>
                                )}
                              </figure>
                            );
                          },
                          externalImage: ({ value }) => {
                            if (!value?.url) return null;
                            return (
                              <figure className="my-8">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={value.url}
                                  alt={value.alt || 'Destination Image'}
                                  className="w-full mx-auto h-auto rounded-lg shadow-md"
                                />
                                {value.caption && (
                                  <figcaption className="text-center text-sm text-gray-400 mt-2 italic">
                                    {value.caption}
                                  </figcaption>
                                )}
                              </figure>
                            );
                          },
                        },
                      }}
                    />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: destination.content }} />
                  )}
                </div>
              )}

              {/* Highlights */}
              {destination.highlights && destination.highlights.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-bold mb-6 text-white">Highlights</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {destination.highlights.map((highlight: string, index: number) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700 bg-secondary p-3 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Places to Visit */}
              {destination.placesToVisit && destination.placesToVisit.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-serif font-bold mb-8 text-white">
                    Top Places to Visit in {destination.name}
                  </h3>
                  <div className="space-y-12">
                    {destination.placesToVisit.map((place: PlaceToVisit, index: number) => (
                      <div key={index} className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="md:w-1/2 overflow-hidden rounded-xl shadow-md">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={place.image}
                            alt={place.title}
                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="md:w-1/2">
                          <h4 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                            <MapPin size={20} className="text-accent" />
                            {place.title}
                          </h4>
                          <p className="text-gray-100 leading-relaxed">{place.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {destination.practicalInfo && (
                <div className="bg-secondary-light p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-serif font-bold mb-6 border-b pb-2">Practical Info</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <Calendar className="text-primary shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm">Best Time to Visit</h4>
                        <p className="text-sm text-gray-600">{destination.practicalInfo.bestTime || 'Contact us'}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Info className="text-primary shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm">Visa Info</h4>
                        <p className="text-sm text-gray-600">{destination.practicalInfo.visaInfo || 'Contact us'}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 flex items-center justify-center font-bold text-primary text-xs border border-primary rounded-full">
                        C
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Currency</h4>
                        <p className="text-sm text-gray-600">{destination.practicalInfo.currency || 'Contact us'}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 flex items-center justify-center font-bold text-primary text-xs border border-primary rounded-full">
                        L
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Language</h4>
                        <p className="text-sm text-gray-600">{destination.practicalInfo.language || 'Contact us'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <DestinationInquiryForm destinationName={destination.name} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
