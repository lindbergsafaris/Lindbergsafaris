import { Metadata } from 'next';
import { Check } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import JsonLd from '@/components/JsonLd';
import { getFleetVehicles } from '@/lib/data';
import { getWhatsAppLink } from '@/lib/utils';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Safari Transport & Car Hire',
  description:
    'Reliable safari transport services in Kenya — custom 4x4 Land Cruisers, Nairobi airport transfers, chauffeur drive, and overland tour vehicles. Book today.',
  alternates: { canonical: `${SITE_URL}/services/transport` },
  openGraph: {
    title: 'Safari Transport & Car Hire | Lindberg Safaris',
    description:
      'Reliable safari transport services in Kenya — custom 4x4 Land Cruisers, Nairobi airport transfers, and chauffeur drive.',
    url: `${SITE_URL}/services/transport`,
  },
  twitter: { card: 'summary_large_image' },
};

const fallbackFleetUrls = [
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1773828030/car3_ww1lxp.jpg',
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1773828034/car8_rhpsug.jpg',
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1773828031/car4_sncpif.jpg',
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1773828037/car6_g7u49u.jpg',
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1773828034/car7_qh5i8l.jpg',
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1773828044/car2_vzh6vs.jpg',
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1773828040/Car1_e0z8yq.jpg',
  'https://res.cloudinary.com/dbqdpitah/image/upload/v1773828041/car5_drfmr6.jpg',
];

const features = ['Car Hire', 'Airport & Railway Transfers', 'Safari Vehicles', 'Group Bookings'];

export default async function TransportPage() {
  const sanityFleet = await getFleetVehicles();
  const fleet =
    sanityFleet && sanityFleet.length > 0
      ? sanityFleet
      : fallbackFleetUrls.map((url, i) => ({
          _id: `fallback-${i}`,
          imageUrl: url,
          name: `Fleet Vehicle ${i + 1}`,
        }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Safari Transport Services in Kenya',
    provider: {
      '@type': 'TravelAgency',
      name: 'Lindberg Safaris',
      url: SITE_URL,
    },
    serviceType: 'Transport & Car Rental',
    areaServed: 'Kenya',
  };

  return (
    <>
      <JsonLd schema={schema} />

      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              'url("https://res.cloudinary.com/dbqdpitah/image/upload/v1770892041/Vehicle_khehig.jpg")',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 uppercase">
            Safari Transport Services in Kenya
          </h1>
          <p className="text-xl font-light tracking-wide italic">
            Connecting people, destinations, and unforgettable memories
          </p>
        </Container>
      </div>

      <Section>
        <Container>
          <div className="flex flex-col gap-10">
            {/* Intro Section */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-serif font-bold mb-6 text-primary underline underline-offset-8 decoration-accent/30">
                  Travel in Comfort &amp; Style
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  We offer daily and long-term car rentals, airport and railway transfers, and
                  tailor-made safaris, turning every journey into a smooth, safe, and unforgettable
                  experience. With our reliable vehicles and professional drivers, you can relax and
                  enjoy every moment of the ride!
                </p>
                <ul className="space-y-3 mb-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700">
                      <div className="bg-primary/10 p-1 rounded-full text-primary">
                        <Check size={16} />
                      </div>
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={getWhatsAppLink("Hello! I'm interested in a transport service quote.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="shadow-lg hover:shadow-primary/20 transition-all">
                    Request a Quote
                  </Button>
                </a>
              </div>
              <div className="md:w-1/2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://res.cloudinary.com/dbqdpitah/image/upload/v1770892041/vehicle5_vy2gbe.jpg"
                  alt="Safari Vehicle"
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl border-4 border-white"
                />
              </div>
            </div>

            {/* Car Hire Section */}
            <div className="flex flex-col md:flex-row-reverse gap-8 items-center pt-8">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-serif font-bold mb-6 text-primary underline underline-offset-8 decoration-accent/30">
                  Car Hire
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Take the wheel and explore the city or beyond at your own pace! Our fleet of
                  well-maintained, air-conditioned vehicles, from saloons and sedans to SUVs and luxury
                  models, is designed for comfort, convenience, and style. Whether it&apos;s a business
                  trip, a weekend getaway, or a leisurely drive, we make every journey seamless,
                  enjoyable, and memorable.
                </p>
              </div>
              <div className="md:w-1/2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://res.cloudinary.com/dbqdpitah/image/upload/v1770892041/Vehicle_khehig.jpg"
                  alt="Fleet Car"
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl border-4 border-white"
                />
              </div>
            </div>

            {/* Fleet Gallery */}
            <div className="pt-12">
              <h2 className="text-3xl font-serif font-bold text-center mb-8 text-primary">
                Our Fleet Gallery
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {fleet.map((vehicle, index) => {
                  const imgUrl =
                    typeof vehicle.imageUrl === 'string'
                      ? vehicle.imageUrl
                      : (vehicle.imageUrl as any)?.url || '';
                  return (
                    <div
                      key={vehicle._id || index}
                      className="group relative h-64 rounded-xl overflow-hidden shadow-md"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={vehicle.name || 'Safari Vehicle'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
