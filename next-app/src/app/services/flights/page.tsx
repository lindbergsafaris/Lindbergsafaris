import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import JsonLd from '@/components/JsonLd';
import { getWhatsAppLink } from '@/lib/utils';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Air & Cruise Ticketing in Kenya',
  description:
    'Seamless air ticketing, domestic bush flights, and international cruise bookings in Kenya. Expert travel coordination with Lindberg Safaris. Inquire now.',
  alternates: { canonical: `${SITE_URL}/services/flights` },
  openGraph: {
    title: 'Air & Cruise Ticketing in Kenya | Lindberg Safaris',
    description:
      'Seamless air ticketing, domestic bush flights, and international cruise bookings in Kenya.',
    url: `${SITE_URL}/services/flights`,
  },
  twitter: { card: 'summary_large_image' },
};

const partnerLogos = [
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1771066708/ticket-9_bohmmc.png',
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1771066708/ticket-8_vowihp.png',
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1771066708/ticket-7_lpuiux.png',
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1771066709/ticket-10_rrpvle.png',
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1771066708/ticket-2_xs5rtj.png',
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1771066707/ticket-1_yoeazb.png',
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1771066708/ticket-4_qz926o.png',
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1771066708/ticket-3_qlpo02.png',
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1771066707/ticket-6_ryuplv.png',
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1771066707/ticket-5_xt3c9n.png',
];

export default function FlightsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Air & Cruise Ticketing in Kenya',
    provider: {
      '@type': 'TravelAgency',
      name: 'Lindberg Safaris',
      url: SITE_URL,
    },
    serviceType: 'Airline & Cruise Ticketing',
    areaServed: 'Worldwide',
  };

  return (
    <>
      <JsonLd schema={schema} />

      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            Air &amp; Cruise Ticketing Services in Kenya
          </h1>
          <p className="text-xl font-light tracking-wide">
            Seamless Travel Solutions Across Air, Sea, and Land
          </p>
        </Container>
      </div>

      {/* Main Services Overview */}
      <Section>
        <Container>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 order-2 md:order-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://res.cloudinary.com/dbqdpitah/image/upload/v1770892892/Boeing_787-8_Dreamliner_Kenya_Airways_5Y-KZA_Large_rqu4mz.jpg"
                alt="Travel Booking"
                className="w-full h-72 object-cover rounded-lg shadow-xl"
              />
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <h2 className="text-3xl font-serif font-bold mb-6">Experience hassle-free travel</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Experience hassle-free travel with our all-in-one ticketing services. Whether flying
                across continents, cruising the seas, or exploring scenic routes by train, bus, or
                ferry, every journey is made simple, affordable, and personalized. Our team ensures
                smooth bookings, flexible options, and reliable support from start to finish.
              </p>
              <a
                href={getWhatsAppLink(
                  "Hello! I'm interested in requesting a quote for your ticketing services."
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg">Request a Quote</Button>
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Service Types Grid */}
      <Section className="bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">What We Offer</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for every travel mode
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 flex-grow basis-full md:basis-[calc(50%-2rem)] lg:basis-[calc(25%-2rem)]">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://res.cloudinary.com/dbqdpitah/image/upload/v1771067327/ticket-11_l9gexs.png"
                  alt="Air Ticketing"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Air Ticketing</h3>
              <p className="text-gray-600 text-sm mb-4">
                Access domestic and international flights with top airlines. Enjoy competitive fares,
                flexible travel classes, and instant confirmations for stress-free journeys.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 flex-grow basis-full md:basis-[calc(50%-2rem)] lg:basis-[calc(25%-2rem)]">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://res.cloudinary.com/dbqdpitah/image/upload/v1771067327/ticket-12_vbwndm.png"
                  alt="Cruise Ticketing"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Cruise Ticketing</h3>
              <p className="text-gray-600 text-sm mb-4">
                Sail in comfort with global cruise routes, luxury or budget options, and all-inclusive
                packages covering meals, entertainment, and excursions.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 flex-grow basis-full md:basis-[calc(50%-2rem)] lg:basis-[calc(25%-2rem)]">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://res.cloudinary.com/dbqdpitah/image/upload/v1771067327/ticket-13_a8k9ea.png"
                  alt="Train Ticketing"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Train Ticketing</h3>
              <p className="text-gray-600 text-sm mb-4">
                Enjoy scenic rail journeys like the Madaraka Express SGR or international rail networks
                with simple seat reservations, flexible schedules, and easy ticketing.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 flex-grow basis-full md:basis-[calc(50%-2rem)] lg:basis-[calc(25%-2rem)]">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://res.cloudinary.com/dbqdpitah/image/upload/v1771067327/ticket-14_p1u5p1.png"
                  alt="Bus & Ferry"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Bus &amp; Ferry</h3>
              <p className="text-gray-600 text-sm mb-4">
                Affordable and scenic transport for city-to-city or island connections with reliable
                operators, guaranteed seating, and hassle-free scheduling.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Partner Logos */}
      <Section>
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-gray-800">
              Our Airline &amp; Cruise Partners
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-80 hover:opacity-100 transition-opacity">
            {partnerLogos.map((logo, index) => (
              <div
                key={index}
                className="w-24 h-16 flex items-center justify-center p-2 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt={`Partner ${index + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
