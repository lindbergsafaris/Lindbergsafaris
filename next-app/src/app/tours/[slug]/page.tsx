import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { Clock, Users, MapPin, Check, X, Star } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import TourItinerary from '@/components/tours/TourItinerary';
import TourBookingForm from '@/components/tours/TourBookingForm';
import JsonLd from '@/components/JsonLd';
import { getTourBySlug, getTourById, getAllTourSlugs } from '@/lib/data';
import { isUUID } from '@/lib/slugUtils';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllTourSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (isUUID(slug)) {
    const tour = await getTourById(slug);
    if (tour?.slug?.current) {
      return {
        title: `${tour.title} | Lindberg Safaris`,
        alternates: { canonical: `${SITE_URL}/tours/${tour.slug.current}` },
      };
    }
  }

  const tour = await getTourBySlug(slug);
  if (!tour) return { title: 'Tour Not Found | Lindberg Safaris' };

  const tourImage = tour.images?.[0]?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801';
  const description = tour.description
    ? tour.description.slice(0, 155).replace(/\s+/g, ' ').trim() + '...'
    : 'Book this custom safari tour with Lindberg Safaris.';
  const tourUrl = `${SITE_URL}/tours/${tour.slug?.current || slug}`;

  return {
    title: `${tour.title} | Lindberg Safaris`,
    description,
    alternates: { canonical: tourUrl },
    openGraph: {
      title: `${tour.title} | Lindberg Safaris`,
      description,
      url: tourUrl,
      images: [{ url: tourImage, width: 1200, height: 630, alt: tour.title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tour.title} | Lindberg Safaris`,
      description,
      images: [tourImage],
    },
  };
}

export default async function TourDetailPage({ params }: PageProps) {
  const { slug } = await params;

  if (isUUID(slug)) {
    const tour = await getTourById(slug);
    if (tour?.slug?.current) {
      permanentRedirect(`/tours/${tour.slug.current}`);
    }
    notFound();
  }

  const tour = await getTourBySlug(slug);
  if (!tour) {
    notFound();
  }

  const tourImage = tour.images?.[0]?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80';
  const priceNumber = typeof tour.price === 'number' ? tour.price : parseInt(String(tour.price).replace(/[^0-9]/g, '') || '0');

  const tourSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tour.title,
    description: tour.description || `${tour.title} by Lindberg Safaris`,
    image: tour.images?.map((img) => img.url) || [tourImage],
    brand: {
      '@type': 'Brand',
      name: 'Lindberg Safaris',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: priceNumber,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Lindberg Safaris',
      },
    },
  };

  return (
    <>
      <JsonLd schema={tourSchema} />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] flex items-end pb-12 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url("${tourImage}")` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>

        <Container className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary-light mb-2 font-medium">
                <MapPin size={18} />
                {tour.location || 'East Africa'}
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{tour.title}</h1>
              <div className="flex flex-wrap gap-4 md:gap-8 text-sm md:text-base text-gray-200">
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  {tour.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  {tour.groupSize || 'Flexible'}
                </div>
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-accent fill-accent" />
                  {tour.rating || 5.0} ({tour.reviews || 0} Reviews)
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 min-w-[280px]">
              <div className="text-sm text-gray-200 mb-1">Starting From</div>
              <div className="text-3xl font-bold text-white mb-4">
                KSH {tour.price} <span className="text-sm font-normal text-gray-300">/ person</span>
              </div>
              <a
                href="#booking-form"
                className="w-full block text-center bg-primary text-white hover:bg-primary-light py-3 px-6 rounded-md font-medium transition-colors"
              >
                Book This Tour
              </a>
            </div>
          </div>
        </Container>
      </div>

      <Section className="bg-primary">
        <Container>
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="mb-10">
                <h2 className="text-2xl font-serif font-bold mb-4 text-white">Overview</h2>
                <div className="text-gray-100 leading-relaxed mb-6 prose max-w-none whitespace-pre-line">
                  {tour.description}
                </div>

                {tour.highlights && tour.highlights.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold mb-3 text-white">Highlights</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tour.highlights.map((highlight: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-gray-100">
                          <Check size={18} className="text-accent mt-1 shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {tour.itinerary && tour.itinerary.length > 0 && (
                <TourItinerary days={tour.itinerary} />
              )}

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <h3 className="font-bold text-lg mb-4 text-green-800">What&apos;s Included</h3>
                  <ul className="space-y-2">
                    {tour.included && tour.included.length > 0 ? (
                      tour.included.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                          <Check size={16} className="text-green-600 mt-1 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 italic">Information not available</li>
                    )}
                  </ul>
                </div>
                <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                  <h3 className="font-bold text-lg mb-4 text-red-800">What&apos;s Excluded</h3>
                  <ul className="space-y-2">
                    {tour.excluded && tour.excluded.length > 0 ? (
                      tour.excluded.map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                          <X size={16} className="text-red-500 mt-1 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500 italic">Information not available</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <TourBookingForm
                tourTitle={tour.title}
                tourPrice={tour.price}
                tourDuration={tour.duration}
              />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
