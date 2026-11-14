import { Metadata } from 'next';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import JsonLd from '@/components/JsonLd';
import { getWhatsAppLink } from '@/lib/utils';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Hotel Booking & Safari Lodge Reservations',
  description:
    'Best rates on safari lodges, beach resorts, city hotels, and private villas in Kenya, East Africa & worldwide. Expert booking with Lindberg Safaris.',
  alternates: { canonical: `${SITE_URL}/services/hotel-booking` },
  openGraph: {
    title: 'Hotel Booking & Safari Lodge Reservations | Lindberg Safaris',
    description:
      'Best rates on safari lodges, beach resorts, city hotels, and private villas in Kenya, East Africa & worldwide.',
    url: `${SITE_URL}/services/hotel-booking`,
  },
  twitter: { card: 'summary_large_image' },
};

const collections = [
  {
    title: 'Safari Lodges & Camps',
    description:
      "Immersive Nature, Refined Comfort. Experience the wild without sacrificing luxury. We specialize in booking lodges and camps that place you at the heart of nature—where you can wake up to the sights and sounds of the world's most breathtaking landscapes and sleep under vast, star-filled skies.",
    image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1771068856/Hotel-1_mnwc2j.png',
  },
  {
    title: 'Beach Resorts',
    description:
      'Coastal Luxury, Tailored to You. From the turquoise waters of Diani to the vibrant shores of Zanzibar, we find the perfect coastal retreat. Whether you seek total seclusion or an active resort with world-class water sports, our consultants scan the region for your perfect match.',
    image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1771068787/Hotel-2_gy0n7i.jpg',
  },
  {
    title: 'City Hotels',
    description:
      'The Pulse of the World’s Greatest Cities. Stay where the action is. Our urban collection puts you minutes away from culture, cuisine, and commerce. Perfect for business travelers or city-breakers, we secure stays that balance high-speed connectivity with ultimate comfort.',
    image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1771068788/Hotel-3_myb5d9.jpg',
  },
  {
    title: 'The Luxury Collection',
    description:
      'Exclusivity without boundaries. For the discerning traveler, we offer access to the world’s most prestigious addresses. Our luxury portfolio features private villas, high-end safari estates, and sophisticated suites where intuitive service and refined design are the standard.',
    image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1771068787/Hotel-4_z69vaj.jpg',
  },
  {
    title: 'Family-Friendly Stays',
    description:
      'Effortless travel for the whole family. We make traveling with loved ones easy. Our family-friendly selection focuses on properties that offer space, safety, and fun, ensuring a smooth experience for parents and unforgettable memories for children.',
    image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1771068787/Hotel-5_lbxo84.jpg',
  },
  {
    title: 'Private Residences & Apartments',
    description:
      'For travelers who value privacy, space, and independence. We offer a curated selection of luxury villas, serviced apartments, and private holiday homes—ideal for families, groups, or long-term stays.',
    image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1771068787/Hotel-6_xqxdfg.jpg',
  },
  {
    title: 'Staycations',
    description:
      'The Art of the Local Escape. You don’t have to travel far to feel a world away. Our staycation collection features handpicked gems in your own backyard—perfect for weekend resets, anniversaries, or a quick change of scenery without the airport stress.',
    image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1771068840/Hotel-7_cdtatj.png',
  },
];

export default function HotelBookingPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Hotel Booking & Safari Lodge Reservations',
    provider: {
      '@type': 'TravelAgency',
      name: 'Lindberg Safaris',
      url: SITE_URL,
    },
    serviceType: 'Hotel & Lodge Reservations',
    areaServed: 'East Africa & Worldwide',
  };

  return (
    <>
      <JsonLd schema={schema} />

      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[600px] flex items-center justify-center text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              'url("https://res.cloudinary.com/dbqdpitah/image/upload/v1771068856/Hotel-1_mnwc2j.png")',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <Container className="relative z-10 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6">
            Hotels &amp; Lodges Worldwide
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide mb-8">
            Curated Stays, Unmatched Comfort, and Global Hospitality
          </p>
          <a
            href={getWhatsAppLink("Hello! I'm interested in booking a hotel or lodge through Lindberg Safaris.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="bg-primary hover:bg-primary-light text-white font-medium px-8 py-3">
              Book Your Stay
            </Button>
          </a>
        </Container>
      </div>

      {/* Collections Section */}
      <Section className="bg-primary">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
              Explore Our Collections
            </h2>
            <p className="text-gray-100 max-w-2xl mx-auto">
              From wilderness luxury to urban sophistication, find the perfect retreat for your journey.
            </p>
          </div>

          <div className="space-y-16">
            {collections.map((col, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row gap-8 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="md:w-1/2">
                  <div className="overflow-hidden rounded-2xl shadow-xl h-80">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={col.image}
                      alt={col.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 text-white">
                  <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4">{col.title}</h3>
                  <p className="text-gray-200 leading-relaxed mb-6">{col.description}</p>
                  <a
                    href={getWhatsAppLink(`Hello! I'm interested in your ${col.title} options.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                      Inquire About {col.title}
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
