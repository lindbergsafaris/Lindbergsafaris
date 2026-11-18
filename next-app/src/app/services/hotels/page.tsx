import { Metadata } from 'next';
import Link from 'next/link';
import { Star } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import JsonLd from '@/components/JsonLd';
import { createBreadcrumbsSchema } from '@/lib/breadcrumbs';
import { SITE_URL } from '@/lib/siteConfig';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Luxury Safari Lodges & Hotel Booking East Africa',
  description:
    'Book top-rated safari lodges, tented camps, town hotels, and beachfront resorts across Kenya and Tanzania with Lindberg Safaris.',
  robots: { index: false, follow: true },
  alternates: { canonical: `${SITE_URL}/services/hotels` },
};

export default function HotelsPage() {
  const breadcrumbsSchema = createBreadcrumbsSchema([
    { name: 'Services', url: '/services' },
    { name: 'Hotels', url: '/services/hotels' },
  ]);

  return (
    <>
      <JsonLd schema={breadcrumbsSchema} />
      <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <Container className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Hotels &amp; Accommodation</h1>
          <p className="text-xl font-light tracking-wide">
            Luxury Lodges. Boutique Hotels. Tented Camps.
          </p>
        </Container>
      </div>

      <Section>
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-serif font-bold mb-6">Curated Stays for Every Traveler</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              We have partnered with the finest accommodation providers across East Africa to offer you
              exclusive rates and unparalleled hospitality. Whether you prefer a luxury tented camp in
              the Masai Mara or a boutique hotel in Nairobi, we have the perfect place for you.
            </p>
          </div>

          <div className="flex flex-wrap gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group flex-grow basis-full md:basis-[calc(50%-2rem)] lg:basis-[calc(33.333%-2rem)]"
              >
                <div className="h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Hotel"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 text-accent mb-2">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Luxury Safari Lodge</h3>
                  <p className="text-gray-500 text-sm mb-4">Masai Mara, Kenya</p>
                  <p className="text-gray-600 text-sm mb-6">
                    Experience world-class safari accommodation with breathtaking savanna views,
                    five-star dining, and private game drives.
                  </p>
                  <Link href="/services/hotel-booking">
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
