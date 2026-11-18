import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, MapPin, Check } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import JsonLd from '@/components/JsonLd';
import { getWhatsAppLink } from '@/lib/utils';
import { createBreadcrumbsSchema } from '@/lib/breadcrumbs';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Custom Safari Itineraries Kenya',
  description:
    'Tailor-made Kenya safaris and customized East African travel itineraries. Private game drives, Great Migration specials, and bespoke luxury holidays with Lindberg Safaris.',
  alternates: { canonical: `${SITE_URL}/services/custom-itineraries` },
  openGraph: {
    title: 'Custom Safari Itineraries Kenya | Lindberg Safaris',
    description:
      'Tailor-made Kenya safaris and customized East African travel itineraries. Private game drives, Great Migration specials.',
    url: `${SITE_URL}/services/custom-itineraries`,
  },
  twitter: { card: 'summary_large_image' },
};

const itineraries = [
  {
    title: 'Great Migration Safari',
    image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1772005636/custom3_djob7r.png',
    location: 'Masai Mara National Reserve',
    dates: 'July | August | September | October',
    description:
      'Begin your journey in Nairobi before heading to the legendary Masai Mara National Reserve, the stage for Africa’s greatest wildlife spectacle — the Great Migration. With two game drives daily, you’ll witness vast herds of wildebeest and zebras sweeping across the savannah, while lions, leopards, elephants, rhinos, and buffalo roam freely.',
    highlights: [
      'Daily game drives at prime wildlife viewing times',
      'Chance to witness the dramatic wildebeest river crossings',
      'Spotting the Big Five in iconic African landscapes',
      'Small-group and private safari experiences',
    ],
  },
  {
    title: 'Kenya Safari: Amboseli, Laikipia & Masai Mara',
    image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1772005636/custom2_alilvz.png',
    location: 'Amboseli, Laikipia & Masai Mara',
    dates: 'Year-Round',
    description:
      'Begin your journey in Nairobi before heading straight into the heart of the wilderness. Experience game drives beneath snow-capped Mount Kilimanjaro in Amboseli, discover endangered wildlife and conservancy models in Laikipia, and witness big cats and savanna vistas in the Masai Mara.',
    highlights: [
      'Experience three iconic safari regions in one seamless journey',
      'Witness elephant herds against the Kilimanjaro backdrop',
      'Conservancy walking safaris, night drives, and camel treks in Laikipia',
      'Premier predator action in the world-famous Masai Mara',
    ],
  },
  {
    title: 'Cultural Tour – Nairobi',
    image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1772005636/custom4_y0h6wn.png',
    location: 'Nairobi',
    dates: 'Year-Round',
    description:
      'Dive into the heart of Nairobi on a journey that blends heritage, modern life, and local experiences. Guided by Nairobi natives, explore historic landmarks, bustling markets, artisan workshops, and vibrant matatu culture while savoring authentic Kenyan cuisine.',
    highlights: [
      'Nairobi city landmarks: KICC rooftop, historical monuments, and urban galleries',
      'Local artisan workshops and vibrant craft markets',
      'Matatu art culture and modern Kenyan culinary experiences',
      'Authentic storytelling and community interactions',
    ],
  },
];

export default function CustomItinerariesPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Custom Safari Itineraries Kenya',
    provider: {
      '@type': 'TravelAgency',
      name: 'Lindberg Safaris',
      url: SITE_URL,
    },
    serviceType: 'Tailor-Made Safari Itineraries',
    areaServed: 'Kenya & East Africa',
  };

  const breadcrumbsSchema = createBreadcrumbsSchema([
    { name: 'Services', url: '/services' },
    { name: 'Custom Itineraries', url: '/services/custom-itineraries' },
  ]);

  return (
    <>
      <JsonLd schema={schema} />
      <JsonLd schema={breadcrumbsSchema} />

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              'url("https://res.cloudinary.com/dbqdpitah/image/upload/v1772005636/custom3_djob7r.png")',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <Container className="relative z-10 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            Custom Safari Itineraries in Kenya
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide mb-6">
            Handcrafted Safaris Designed Around Your Dreams
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary-light text-white font-medium px-8 py-3">
              Design Your Custom Itinerary
            </Button>
          </Link>
        </Container>
      </div>

      {/* Itineraries List */}
      <Section className="bg-gray-50 py-16">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Featured Custom Journeys
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every itinerary can be customized to match your travel dates, group size, and preferred pace.
            </p>
          </div>

          <div className="space-y-16">
            {itineraries.map((itinerary, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col lg:flex-row"
              >
                <div className="lg:w-1/2 relative min-h-[300px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={itinerary.image}
                    alt={itinerary.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1.5 text-primary font-medium">
                        <MapPin size={16} />
                        {itinerary.location}
                      </div>
                      {itinerary.dates && (
                        <div className="flex items-center gap-1.5">
                          <Calendar size={16} />
                          {itinerary.dates}
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-gray-900">
                      {itinerary.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{itinerary.description}</p>
                    <div className="space-y-2 mb-8">
                      {itinerary.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <Check size={16} className="text-primary mt-0.5 shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4 items-center">
                    <a
                      href={getWhatsAppLink(
                        `Hello! I'm interested in the ${itinerary.title} custom itinerary.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button>Inquire via WhatsApp</Button>
                    </a>
                    <Link href="/contact">
                      <Button variant="outline">Contact Our Experts</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
