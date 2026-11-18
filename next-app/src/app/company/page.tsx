import { Metadata } from 'next';
import { Handshake } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import LocationMap from '@/components/ui/LocationMap';
import GoogleReviewsWidget from '@/components/ui/GoogleReviewsWidget';
import TeamSection from '@/components/sections/TeamSection';
import CompanyFaqAccordion from '@/components/company/CompanyFaqAccordion';
import JsonLd from '@/components/JsonLd';
import { getPartners, getTeamMembers } from '@/lib/data';
import { SITE_URL } from '@/lib/siteConfig';
import { Partner } from '@/types';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'About Us | East Africa Safari Experts',
  description:
    'Discover Lindberg Safaris: our story, conservation mission, community impact, leadership team, and traveler reviews across Kenya, Tanzania & Rwanda.',
  alternates: { canonical: `${SITE_URL}/company` },
  openGraph: {
    title: 'About Us | Lindberg Safaris',
    description:
      'Discover Lindberg Safaris: our story, conservation mission, community impact, and leadership team.',
    url: `${SITE_URL}/company`,
  },
  twitter: { card: 'summary_large_image' },
};

const navSections = [
  { id: 'about', label: 'About Us' },
  { id: 'calling', label: 'Our Calling' },
  { id: 'impact', label: 'Our Impact' },
  { id: 'team', label: 'Our Team' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'faqs', label: 'FAQs' },
];

const values = [
  {
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Safety First',
    description: 'Your safety is our top priority. We use well-maintained vehicles and experienced guides.',
  },
  {
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Expert Guides',
    description: 'Our guides are passionate, knowledgeable, and dedicated to making your safari unforgettable.',
  },
  {
    image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Sustainable Tourism',
    description: 'We are committed to conservation and supporting local communities.',
  },
  {
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Excellence',
    description: 'We strive for excellence in every aspect of your journey, from planning to execution.',
  },
];

const callingItems = [
  {
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Our Mission',
    description: 'To connect people with the raw beauty of nature and create unforgettable experiences that inspire conservation and cultural appreciation.',
  },
  {
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Our Passion',
    description: "We are driven by a deep love for Africa's wilderness and a commitment to sharing its magic with the world while preserving it for future generations.",
  },
  {
    image: 'https://images.unsplash.com/photo-1535941339077-2dd1c7963098?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Conservation First',
    description: 'We believe in responsible tourism that protects wildlife, empowers local communities, and ensures the sustainability of our natural heritage.',
  },
];

const impactItems = [
  {
    title: 'Supporting Anti-Poaching Units',
    description: 'A portion of every safari booking goes directly to funding anti-poaching patrols and wildlife protection initiatives.',
    image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770824813/WhatsApp_Image_2026-02-10_at_17.18.26_2_ire2q6.jpg',
  },
  {
    title: 'Funding Local Schools',
    description: 'We partner with communities to build and support schools, providing education opportunities for children in rural areas.',
    image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770824812/WhatsApp_Image_2026-02-10_at_17.18.26_3_tnwxox.jpg',
  },
  {
    title: 'Planting Trees',
    description: 'Our reforestation program has planted over 10,000 trees, helping to restore habitats and combat climate change.',
    image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770824821/WhatsApp_Image_2026-02-10_at_17.17.30_smziyr.jpg',
  },
  {
    title: 'Community Empowerment',
    description: 'We employ local guides, source from local suppliers, and ensure tourism benefits reach the communities we visit.',
    image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

const fallbackPartners: Partner[] = [
  { name: 'Legend Tours', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812606/IMG-20251214-WA0024_fcc5e0.jpg' },
  { name: 'Emirates', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812606/IMG-20251214-WA0023_jwsxce.jpg' },
  { name: 'Magical Kenya', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812606/IMG-20251214-WA0022_im5faz.jpg' },
  { name: 'Kenya Tourism Board', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812605/IMG-20251214-WA0021_ijcenx.jpg' },
  { name: 'Costa', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812605/IMG-20251214-WA0025_mokzmf.jpg' },
  { name: 'Kenya Tourism Federation', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812605/IMG-20251214-WA0020_vakifx.jpg' },
  { name: 'Ministry of Tourism & Wildlife', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812604/IMG-20251214-WA0019_ncbbga.jpg' },
];

const faqCategories = [
  {
    title: 'Booking & Payment',
    items: [
      {
        question: 'How do I book a safari or tour package with Lindberg?',
        answer: 'You can book by contacting us directly through our website, email, or WhatsApp. Our tour consultants will work with you to finalize your itinerary.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept bank transfers, credit cards (Visa/Mastercard), and mobile money payments (M-Pesa).',
      },
      {
        question: 'Do I need to pay a deposit when booking?',
        answer: 'Yes, a deposit is required to secure your booking, with the balance payable before the start of your safari.',
      },
      {
        question: 'Can I pay in installments?',
        answer: 'Yes, we offer flexible payment plans. Please discuss this with your tour consultant during booking.',
      },
      {
        question: 'What is your cancellation policy?',
        answer: 'Cancellation policies vary by package and season. Please refer to our Terms and Conditions provided at the time of booking.',
      },
    ],
  },
  {
    title: 'Tour Packages',
    items: [
      {
        question: 'What types of safaris do you offer?',
        answer: 'We offer wildlife safaris, beach holidays, cultural tours, bird watching tours, and photography safaris in Kenya, Tanzania, Uganda, and Rwanda.',
      },
      {
        question: 'Can I customize my tour package?',
        answer: 'Absolutely! We specialize in tailor-made itineraries to suit your preferences, budget, and interests.',
      },
      {
        question: 'What is included in a safari package?',
        answer: 'Packages generally include accommodation, meals on full board, transport in safari vehicles, park fees, and the services of an English-speaking driver-guide.',
      },
      {
        question: 'Do you offer group discounts?',
        answer: 'Yes, we offer discounts for groups, families, and repeat clients. Contact us for a quote.',
      },
    ],
  },
  {
    title: 'Travel Information',
    items: [
      {
        question: 'Do I need a visa to travel with Lindberg?',
        answer: 'Visa requirements depend on your nationality and the destination. We provide guidance on how to apply for e-visas for Kenya, Tanzania, and other East African countries.',
      },
      {
        question: 'Do you offer travel insurance?',
        answer: 'We highly recommend that all travelers purchase comprehensive travel insurance. While we have AMREF Flying Doctors evacuation cover, personal medical and travel insurance is the traveler’s responsibility.',
      },
    ],
  },
  {
    title: 'Customer Support',
    items: [
      {
        question: 'What if I need to change my booking?',
        answer: 'Changes are subject to availability and may incur additional charges depending on the timing and third-party policies (hotels/airlines).',
      },
      {
        question: 'What should I do in case of an emergency during my trip?',
        answer: 'You will have access to a 24/7 emergency contact number, and our guides are trained to handle emergencies on the ground.',
      },
      {
        question: 'How can I provide feedback after my trip?',
        answer: 'We value your feedback! You can leave a review on our website, TripAdvisor, or send us an email directly.',
      },
    ],
  },
];

export default async function CompanyPage() {
  const [sanityPartners, teamMembers] = await Promise.all([
    getPartners(),
    getTeamMembers(),
  ]);

  const partners = sanityPartners && sanityPartners.length > 0 ? sanityPartners : fallbackPartners;

  // Flatten FAQs for schema
  const allFaqs = faqCategories.flatMap((cat) => cat.items);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd schema={faqSchema} />

      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            About Lindberg Safaris | East Africa Experts
          </h1>
          <p className="text-xl font-light tracking-wide max-w-2xl mx-auto">
            Passionate about Africa, committed to conservation, and dedicated to exceptional travel experiences.
          </p>
        </Container>
      </div>

      {/* Quick Navigation Bar */}
      <div className="sticky top-20 z-30 bg-primary/95 backdrop-blur-md border-b border-white/10 py-3">
        <Container>
          <nav className="flex justify-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
            {navSections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="text-sm font-medium text-gray-200 hover:text-white whitespace-nowrap transition-colors"
              >
                {sec.label}
              </a>
            ))}
          </nav>
        </Container>
      </div>

      {/* 1. About Us Section */}
      <section id="about" className="py-16 bg-white scroll-mt-28">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-gray-900">
              Our Story &amp; Values
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Lindberg Safaris was born from a deep love for Africa&apos;s untamed landscapes, vibrant cultures,
              and magnificent wildlife. Over the past decade, we have grown into one of East Africa&apos;s most
              trusted luxury safari and travel operators, creating tailor-made adventures that leave a lasting mark.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-secondary-light rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col"
              >
                <div className="h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={v.image}
                    alt={v.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <h3 className="text-xl font-serif font-bold mb-2 text-gray-900">{v.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. Our Calling Section */}
      <section id="calling" className="py-16 bg-primary text-white scroll-mt-28">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Our Calling</h2>
            <p className="text-gray-100 leading-relaxed text-lg">
              We see travel not just as a getaway, but as a bridge between cultures and a catalyst for conservation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {callingItems.map((item, i) => (
              <div
                key={i}
                className="bg-white/10 rounded-xl overflow-hidden border border-white/20 flex flex-col"
              >
                <div className="h-56 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-200 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. Our Impact Section */}
      <section id="impact" className="py-16 bg-white scroll-mt-28">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-gray-900">
              Our Community &amp; Conservation Impact
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Responsible travel that gives back. Every safari with Lindberg directly benefits local wildlife
              preservation and community development projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactItems.map((impact, i) => (
              <div
                key={i}
                className="bg-secondary-light rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col"
              >
                <div className="h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={impact.image}
                    alt={impact.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <h3 className="text-xl font-serif font-bold mb-2 text-gray-900">{impact.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{impact.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Leadership Team Section */}
      <section id="team" className="py-16 bg-primary scroll-mt-28">
        <TeamSection initialMembers={teamMembers} />
      </section>

      {/* Partners Marquee */}
      <Section className="bg-white">
        <Container>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold mb-4">
              <Handshake size={16} /> Industry Partners
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-900">
              Our Trusted Partners
            </h2>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-8 items-start opacity-80 hover:opacity-100 transition-all duration-500">
            {partners.map((partner: Partner, index: number) => {
              const logoUrl = typeof partner.logo === 'string' ? partner.logo : partner.logo?.url || '';
              return (
                <div
                  key={partner._id || index}
                  className="flex-grow flex flex-col items-center gap-3 basis-[40%] md:basis-[20%] lg:basis-[12%]"
                >
                  <div className="w-full flex justify-center items-center h-32 bg-secondary-light p-4 rounded-lg shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoUrl}
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <p className="text-xs md:text-sm font-bold text-gray-700 text-center uppercase tracking-tight line-clamp-2 px-1">
                    {partner.name}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 5. Testimonials Section */}
      <section id="testimonials" className="py-16 bg-primary pb-0 scroll-mt-28">
        <GoogleReviewsWidget />
      </section>

      {/* 6. FAQs Section */}
      <section id="faqs" className="py-16 bg-primary scroll-mt-28">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-100 leading-relaxed text-lg">
              Everything you need to know about planning, booking, and experiencing your East Africa safari.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <CompanyFaqAccordion categories={faqCategories} />
          </div>
        </Container>
      </section>

      {/* Location Map Section */}
      <Section className="bg-white">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Visit Our Office</h2>
            <p className="text-gray-600">United Bible Societies Building, Nairobi, Kenya</p>
          </div>
          <div className="h-96 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <LocationMap />
          </div>
        </Container>
      </Section>
    </>
  );
}
