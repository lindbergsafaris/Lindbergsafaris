import { Metadata } from 'next';
import { Check } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import JsonLd from '@/components/JsonLd';
import { getWhatsAppLink } from '@/lib/utils';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Visa Application Assistance in Kenya',
  description:
    'Hassle-free visa assistance for Schengen, US, UK, Australia, Dubai, and East Africa travel. Expert guidance for a smooth application. Contact Lindberg Safaris.',
  alternates: { canonical: `${SITE_URL}/services/visa` },
  openGraph: {
    title: 'Visa Application Assistance in Kenya | Lindberg Safaris',
    description:
      'Hassle-free visa assistance for Schengen, US, UK, Australia, Dubai, and East Africa travel.',
    url: `${SITE_URL}/services/visa`,
  },
  twitter: { card: 'summary_large_image' },
};

const visaTypes = [
  { name: 'Schengen Visas', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1771070434/visa-application1_kwg8pk.jpg' },
  { name: 'US Visas', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1771070435/visa-application2_nnkj1a.jpg' },
  { name: 'UK Visas', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1771070433/visa-application3_cj3sdf.jpg' },
  { name: 'Australia Visas', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1771070440/visa-application4_g2zxj7.png' },
  { name: 'New Zealand Visas', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1771070433/visa-application5_x3j0a1.jpg' },
  { name: 'Indonesia e-Visa', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1771070433/visa-application7_qqm5c1.jpg' },
  { name: 'Qatar e-Visa', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1771070434/visa-application8_ts1zcy.jpg' },
  { name: 'Dubai Visa', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1771070434/visa-application9_nthjjs.jpg' },
  { name: 'Egypt Visa', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1771070435/visa-application10_rpxlab.jpg' },
];

const helpItems = [
  'Visa eligibility assessment',
  'Document checklist tailored to your profile',
  'Travel itinerary & accommodation support',
  'Filling of the visa form online',
  'Application form review and correction',
  'Appointment guidance & embassy procedures',
  'Advice on improving future applications',
];

export default function VisaPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Visa Application Assistance in Kenya',
    provider: {
      '@type': 'TravelAgency',
      name: 'Lindberg Safaris',
      url: SITE_URL,
    },
    serviceType: 'Visa Consulting & Support',
    areaServed: 'Kenya & Worldwide',
  };

  return (
    <>
      <JsonLd schema={schema} />

      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              'url("https://res.cloudinary.com/dbqdpitah/image/upload/v1771070434/visa-application1_kwg8pk.jpg")',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <Container className="relative z-10 text-center max-w-5xl">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
            Visa Application Assistance in Kenya
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-wide italic">
            Your Gateway to the World, Simplified
          </p>
        </Container>
      </div>

      {/* Intro Section */}
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-6">
              Expert Guidance Every Step of the Way
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Navigating visa applications can be daunting, time-consuming, and full of complex
              requirements. Our visa application support service removes the guesswork and gives you
              confidence at every step. While we do not issue visas or guarantee approvals—as that is
              the sole discretion of embassies and immigration authorities—we ensure your application
              is complete, accurate, and presented in the best possible light.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-serif font-bold mb-6 text-primary">How We Help You</h3>
              <ul className="space-y-4">
                {helpItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-primary/10 p-1.5 rounded-full text-primary mt-0.5">
                      <Check size={18} />
                    </div>
                    <span className="text-gray-700 font-medium text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a
                  href={getWhatsAppLink("Hello! I need assistance with a visa application.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg">Get Visa Support Now</Button>
                </a>
              </div>
            </div>

            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://res.cloudinary.com/dbqdpitah/image/upload/v1771070435/visa-application2_nnkj1a.jpg"
                alt="Visa Application Assistance"
                className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
              />
            </div>
          </div>

          {/* Visa Destinations */}
          <div className="pt-8">
            <h3 className="text-3xl font-serif font-bold text-center mb-8 text-primary">
              Popular Visa Destinations We Support
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {visaTypes.map((visa, index) => (
                <div
                  key={index}
                  className="group relative h-48 rounded-xl overflow-hidden shadow-md flex items-end p-6 text-white"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url("${visa.image}")` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <h4 className="relative z-10 text-xl font-bold font-serif">{visa.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
