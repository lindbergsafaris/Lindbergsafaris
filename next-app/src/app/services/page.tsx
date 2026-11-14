import { Metadata } from 'next';
import Link from 'next/link';
import {
  Car,
  Hotel,
  Plane,
  Compass,
  ArrowRight,
  Map,
  Shield,
  Users,
  Heart,
  LucideIcon,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Safari & Travel Services Kenya',
  description:
    'Full suite of Kenya travel services: safari transport, flight ticketing, visa assistance, hotel booking, and custom itineraries. Plan your trip with us.',
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    title: 'Safari & Travel Services Kenya | Lindberg Safaris',
    description:
      'Full suite of Kenya travel services: safari transport, flight ticketing, visa assistance, hotel booking, and custom itineraries.',
    url: `${SITE_URL}/services`,
  },
  twitter: { card: 'summary_large_image' },
};

const iconMap: Record<string, LucideIcon> = {
  Car,
  Hotel,
  Plane,
  Compass,
  Map,
  Shield,
  Users,
  Heart,
};

const services = [
  {
    _id: 'fb-transport',
    title: 'Transport Services',
    description:
      'We offer daily and long-term car rentals, airport and railway transfers, and tailor-made safaris — turning every journey into a smooth, safe, and unforgettable experience.',
    icon: 'Car',
    slug: '/services/transport',
    features: ['Car Hire', 'Airport & Railway Transfers', 'Safari Vehicles', 'Group Bookings'],
  },
  {
    _id: 'fb-flights',
    title: 'Ticketing Services',
    description:
      'Experience hassle-free travel with our all-in-one ticketing services — air, cruise, train, bus, and ferry — with flexible options and reliable support from start to finish.',
    icon: 'Plane',
    slug: '/services/flights',
    features: ['Air Ticketing', 'Cruise Ticketing', 'Train Ticketing', 'Bus & Ferry Ticketing'],
  },
  {
    _id: 'fb-visa',
    title: 'Visa Application Support',
    description:
      'Our visa application support service removes the guesswork and gives you confidence at every step — from eligibility assessment to final submission.',
    icon: 'Shield',
    slug: '/services/visa',
    features: [
      'Visa Eligibility Assessment',
      'Document Checklist',
      'Application Form Review',
      'Embassy Appointment Guidance',
    ],
  },
  {
    _id: 'fb-itineraries',
    title: 'Custom Itineraries',
    description:
      'Tailor-made safari and travel itineraries crafted to your interests, budget, and schedule — from the Great Migration to coastal escapes.',
    icon: 'Compass',
    slug: '/services/custom-itineraries',
    features: ['Safari Packages', 'Cultural Tours', 'Honeymoon Safaris', 'Golf & Safari Adventures'],
  },
  {
    _id: 'fb-hotels',
    title: 'Hotels & Accommodation',
    description:
      'We have partnered with the finest accommodation providers across East Africa to offer exclusive rates and unparalleled hospitality for every traveler.',
    icon: 'Hotel',
    slug: '/services/hotels',
    features: ['Luxury Lodges', 'Boutique Hotels', 'Tented Camps', 'Budget Options'],
  },
  {
    _id: 'fb-hotel-booking',
    title: 'Hotel Booking',
    description:
      'Let us handle your hotel reservations — from budget guesthouses to five-star resorts — across East Africa and beyond, with the best available rates.',
    icon: 'Map',
    slug: '/services/hotel-booking',
    features: [
      'Best Rate Guarantee',
      'Instant Confirmation',
      'Group Reservations',
      'Special Occasion Arrangements',
    ],
  },
];

export default function ServicesPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Safari & Travel Services in Kenya',
    provider: {
      '@type': 'TravelAgency',
      name: 'Lindberg Safaris',
      url: SITE_URL,
    },
    serviceType: 'Travel Services',
    areaServed: 'East Africa',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Travel Services',
      itemListElement: services.map((s, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.title,
          description: s.description,
        },
        position: index + 1,
      })),
    },
  };

  return (
    <>
      <JsonLd schema={schema} />

      {/* Hero */}
      <div className="bg-primary text-white py-20">
        <Container>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Safari &amp; Travel Services in Kenya
          </h1>
          <p className="text-lg text-gray-100 max-w-2xl">
            Beyond safaris, we offer a comprehensive range of travel services to make your trip
            seamless.
          </p>
        </Container>
      </div>

      <Section className="bg-primary">
        <Container>
          <div className="flex flex-wrap gap-8">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon || ''] || Compass;
              const linkTarget = service.slug || '/contact';
              const isInternalDetailPage = service.slug && service.slug !== '/contact';

              return (
                <div
                  key={service._id}
                  className="bg-secondary-light p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col flex-grow basis-full md:basis-[calc(50%-2rem)]"
                >
                  {/* Icon */}
                  <div className="mb-6 bg-primary-light/10 w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0">
                    <IconComponent size={40} className="text-primary" />
                  </div>

                  {/* Title & Description */}
                  <h2 className="text-2xl font-serif font-bold mb-3">{service.title}</h2>
                  <p className="text-gray-600 mb-6">{service.description}</p>

                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                    <ul className="mb-6 space-y-2">
                      {service.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA Link */}
                  <div className="mt-auto pt-4">
                    <Link
                      href={linkTarget}
                      className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors"
                    >
                      {isInternalDetailPage ? 'Learn More' : 'Inquire Now'}
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
