import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, MapPin, Check, ArrowLeft } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import JsonLd from '@/components/JsonLd';
import AccommodationBookingForm from '@/components/accommodation/AccommodationBookingForm';
import {
  getAccommodationsByType,
  getAccommodationBySlug,
  getAllAccommodationSlugs,
} from '@/lib/data';
import { slugify } from '@/lib/slugUtils';
import { createBreadcrumbsSchema } from '@/lib/breadcrumbs';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

const ACCOMMODATION_CATEGORIES = [
  'lodges',
  'holiday-homes',
  'town-hotels',
  'luxury-camps',
  'resort-hotels',
  'bush-camps',
];

const CATEGORY_INFO: Record<string, { title: string; h1: string; description: string }> = {
  lodges: {
    title: 'Safari Lodges in East Africa',
    h1: 'Safari Lodges in Kenya & East Africa',
    description: "Book safari lodges inside Kenya's top national parks — Masai Mara, Amboseli, Tsavo. Comfortable stays steps from big five wildlife. Reserve with Lindberg Safaris.",
  },
  'holiday-homes': {
    title: 'Holiday Homes & Private Villas Kenya',
    h1: 'Holiday Homes & Private Villas in Kenya',
    description: 'Exclusive private villas and holiday homes for families and groups in Kenya. Self-catering beach cottages, garden retreats, and secluded estate properties.',
  },
  'town-hotels': {
    title: 'Town Hotels in Nairobi, Mombasa & Arusha',
    h1: 'Town Hotels in Nairobi, Mombasa & Arusha',
    description: 'Convenient and comfortable city hotels in Nairobi, Mombasa, and Arusha. Business-friendly stays, airport hotels, and boutique properties. Book today.',
  },
  'luxury-camps': {
    title: 'Luxury Tented Camps in Kenya & Tanzania',
    h1: 'Luxury Tented Camps in Kenya & Tanzania',
    description: 'Glamping at its finest — 5-star luxury tented camps in the Masai Mara, Serengeti, and beyond. Private plunge pools, gourmet dining, and guided game drives.',
  },
  'resort-hotels': {
    title: 'Beach Resort Hotels in Kenya & Zanzibar',
    h1: 'Beach Resort Hotels in Kenya & Zanzibar',
    description: 'Beachfront resort hotels on the Kenyan coast, Zanzibar, and Indian Ocean islands. Pools, spas, and all-inclusive packages for your perfect tropical holiday.',
  },
  'bush-camps': {
    title: 'Bush Camps & Wilderness Camps in Kenya',
    h1: 'Bush Camps & Wilderness Camps in Kenya',
    description: "Authentic mobile bush camps and permanent wilderness campsites in Kenya's remotest reserves. Immersive nature experiences with expert guides. Book with us.",
  },
};

interface PageProps {
  params: Promise<{ type: string }>;
}

export async function generateStaticParams() {
  const accSlugs = await getAllAccommodationSlugs();
  const allParams = [
    ...ACCOMMODATION_CATEGORIES.map((cat) => ({ type: cat })),
    ...accSlugs.map((slug) => ({ type: slug })),
  ];
  return allParams;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;

  if (ACCOMMODATION_CATEGORIES.includes(type)) {
    const info = CATEGORY_INFO[type] || {
      title: 'Accommodation in East Africa',
      description: 'Discover safari lodges, luxury tented camps, and hotels across East Africa.',
    };
    const canonicalUrl = `${SITE_URL}/accommodation/${type}`;
    return {
      title: `${info.title} | Lindberg Safaris`,
      description: info.description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: `${info.title} | Lindberg Safaris`,
        description: info.description,
        url: canonicalUrl,
      },
    };
  }

  // Otherwise, it's an accommodation detail page
  const acc = await getAccommodationBySlug(type);
  if (!acc) return { title: 'Accommodation Not Found | Lindberg Safaris' };

  const canonicalUrl = `${SITE_URL}/accommodation/${slugify(acc.name)}`;
  const image = acc.image?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945';
  const description = acc.description
    ? acc.description.slice(0, 155)
    : `Book your stay at ${acc.name} in ${acc.location || 'East Africa'} with Lindberg Safaris.`;

  return {
    title: `${acc.name} | Lindberg Safaris`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${acc.name} | Lindberg Safaris`,
      description,
      url: canonicalUrl,
      images: [{ url: image, width: 1200, height: 630, alt: acc.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${acc.name} | Lindberg Safaris`,
      description,
      images: [image],
    },
  };
}

export default async function AccommodationPolymorphicPage({ params }: PageProps) {
  const { type } = await params;
  const isCategory = ACCOMMODATION_CATEGORIES.includes(type);

  if (isCategory) {
    const info = CATEGORY_INFO[type] || {
      title: 'Accommodation in East Africa',
      h1: 'Accommodation in East Africa',
      description: 'Discover the perfect place to stay for your East Africa safari.',
    };
    const accommodations = await getAccommodationsByType(type);

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: info.title,
      description: info.description,
      url: `${SITE_URL}/accommodation/${type}`,
      numberOfItems: accommodations.length,
      itemListElement: accommodations.map((acc, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: acc.name,
        url: `${SITE_URL}/accommodation/${slugify(acc.name)}`,
      })),
    };

    const breadcrumbsSchema = createBreadcrumbsSchema([
      { name: 'Accommodation', url: '/services/hotel-booking' },
      { name: info.title, url: `/accommodation/${type}` },
    ]);

    return (
      <>
        <JsonLd schema={schema} />
        <JsonLd schema={breadcrumbsSchema} />

        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-white">
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: `url("https://res.cloudinary.com/dbqdpitah/image/upload/v1771310598/pexels-renato-conti-1385524-2677843_rcoj7q.jpg")`,
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <Container className="relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 capitalize">{info.h1}</h1>
            <p className="text-lg text-gray-100 max-w-2xl mx-auto">{info.description}</p>
          </Container>
        </div>

        <Section className="bg-primary">
          <Container>
            {accommodations.length > 0 ? (
              <div className="flex flex-wrap gap-8">
                {accommodations.map((acc) => {
                  const accSlug = slugify(acc.name);
                  return (
                    <div
                      key={acc._id}
                      className="bg-secondary-light rounded-xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-all flex flex-col flex-grow basis-full md:basis-[calc(50%-2rem)] lg:basis-[calc(33.333%-2rem)]"
                    >
                      <div className="h-64 overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            acc.image?.url ||
                            'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                          }
                          alt={acc.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                          <Star size={12} className="text-accent fill-accent" />
                          {acc.rating || 5}.0
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                            <MapPin size={14} className="text-primary" />
                            {acc.location || 'East Africa'}
                          </div>
                          <h2 className="text-xl font-serif font-bold mb-4">{acc.name}</h2>
                        </div>
                        <div className="flex items-center justify-end mt-4">
                          <Link href={`/accommodation/${accSlug}`}>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-secondary rounded-lg">
                <p className="text-gray-600 text-lg">No accommodations found for this category.</p>
                <p className="text-gray-500 text-sm mt-2">Check back later or contact us for custom bookings.</p>
              </div>
            )}
          </Container>
        </Section>
      </>
    );
  }

  // Detail View
  const accommodation = await getAccommodationBySlug(type);
  if (!accommodation) {
    notFound();
  }

  const accSlug = slugify(accommodation.name);
  const canonicalUrl = `${SITE_URL}/accommodation/${accSlug}`;
  const accImage =
    accommodation.image?.url ||
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';

  const accSchema = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: accommodation.name,
    description: accommodation.description || `${accommodation.name} in ${accommodation.location}`,
    image: accImage,
    url: canonicalUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: accommodation.location || 'Kenya',
    },
    ...(accommodation.rating ? { starRating: { '@type': 'Rating', ratingValue: accommodation.rating } } : {}),
  };

  const categorySlug = accommodation.type || 'lodges';
  const categoryName = CATEGORY_INFO[categorySlug]?.title || 'Accommodation';
  const breadcrumbsSchema = createBreadcrumbsSchema([
    { name: 'Accommodation', url: '/services/hotel-booking' },
    { name: categoryName, url: `/accommodation/${categorySlug}` },
    { name: accommodation.name, url: `/accommodation/${accSlug}` },
  ]);

  return (
    <>
      <JsonLd schema={accSchema} />
      <JsonLd schema={breadcrumbsSchema} />

      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] bg-gray-900">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={accImage}
            alt={accommodation.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        <Container className="relative h-full flex flex-col justify-end pb-16 text-white">
          <Link
            href={`/accommodation/${accommodation.type || 'lodges'}`}
            className="inline-flex items-center text-white hover:bg-white/20 w-fit mb-6 px-3 py-1.5 rounded-md transition-all text-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to {accommodation.type?.replace('-', ' ') || 'List'}
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-primary-light mb-2">
                <MapPin size={18} />
                {accommodation.location || 'East Africa'}
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{accommodation.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Star size={16} className="text-accent fill-accent" />
                  <span className="font-bold">{accommodation.rating || 5}.0</span>
                </div>
                <span className="text-gray-300 capitalize">{accommodation.type?.replace('-', ' ')}</span>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-4">
              <a
                href="#booking-form"
                className="bg-primary hover:bg-primary-light text-white font-medium px-6 py-3 rounded-md transition-colors"
              >
                Inquire Now
              </a>
            </div>
          </div>
        </Container>
      </div>

      <Section className="bg-primary">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-6 text-white">About this Place</h2>
                <div className="text-gray-100 leading-relaxed text-lg whitespace-pre-line">
                  {accommodation.description ||
                    `Experience the ultimate in comfort and style at ${accommodation.name}. Nestled in the heart of ${accommodation.location || 'East Africa'}, this accommodation offers a perfect blend of modern amenities and authentic African charm.`}
                </div>
              </div>

              {/* Amenities */}
              {accommodation.amenities && accommodation.amenities.length > 0 && (
                <div>
                  <h3 className="text-2xl font-serif font-bold mb-6 text-white">Amenities & Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {accommodation.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-white/10 p-3 rounded-lg border border-white/10 text-white"
                      >
                        <Check size={18} className="text-accent shrink-0" />
                        <span className="text-sm font-medium">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Booking Form */}
            <div className="lg:col-span-1">
              <AccommodationBookingForm
                accommodationName={accommodation.name}
                accommodationLocation={accommodation.location}
              />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
