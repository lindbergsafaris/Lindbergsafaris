import Link from 'next/link';
import { ChevronRight, Handshake } from 'lucide-react';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import TourCard from '@/components/tours/TourCard';
import PopupOffer from '@/components/ui/PopupOffer';
import TeamSection from '@/components/sections/TeamSection';
import GoogleReviewsWidget from '@/components/ui/GoogleReviewsWidget';
import MailchimpForm from '@/components/ui/MailchimpForm';
import HeroSlider from '@/components/home/HeroSlider';
import HotDealsSection from '@/components/home/HotDealsSection';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/siteConfig';
import {
  getTours,
  getHotDeals,
  getDestinationCategories,
  getHeroSlides,
  getPartners,
  getTeamMembers,
  getPopupOffer,
} from '@/lib/data';
import { Tour, HeroSlide, Partner } from '@/types';

export const revalidate = 60;

const fallbackSlides: HeroSlide[] = [
  { _id: 'fallback-1', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1774850774/carousel_nprg6k.jpg', title: 'Discover East Africa', subtitle: 'Unforgettable safaris tailored just for you', primaryButtonText: 'Start Your Journey', primaryButtonLink: '/contact', secondaryButtonText: 'View Our Tours', secondaryButtonLink: '/tours' },
  { _id: 'fallback-2', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770824814/WhatsApp_Image_2026-02-10_at_17.18.25_zvduyr.jpg', title: 'Wildlife Encounters', subtitle: 'Experience the magic of African wildlife up close', primaryButtonText: 'Start Your Journey', primaryButtonLink: '/contact', secondaryButtonText: 'View Our Tours', secondaryButtonLink: '/tours' },
  { _id: 'fallback-3', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770892041/Vehicle_khehig.jpg', title: 'Expert Guided Tours', subtitle: 'Professional guides with decades of experience', primaryButtonText: 'Start Your Journey', primaryButtonLink: '/contact', secondaryButtonText: 'View Our Tours', secondaryButtonLink: '/tours' },
  { _id: 'fallback-4', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1772176017/RPK_rxvnwy.jpg', title: 'Luxury Camps & Lodges', subtitle: 'Stay in breathtaking accommodations in the wild', primaryButtonText: 'Start Your Journey', primaryButtonLink: '/contact', secondaryButtonText: 'View Our Tours', secondaryButtonLink: '/tours' },
  { _id: 'fallback-5', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770892892/Boeing_787-8_Dreamliner_Kenya_Airways_5Y-KZA_Large_rqu4mz.jpg', title: 'Seamless Air Ticketing', subtitle: 'Book flights to any destination worldwide', primaryButtonText: 'Start Your Journey', primaryButtonLink: '/contact', secondaryButtonText: 'View Our Tours', secondaryButtonLink: '/tours' },
  { _id: 'fallback-6', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1774850774/carousel2_kf3i7r.jpg', title: 'Beach & Safari Combo', subtitle: 'The perfect blend of wildlife and pristine beaches', primaryButtonText: 'Start Your Journey', primaryButtonLink: '/contact', secondaryButtonText: 'View Our Tours', secondaryButtonLink: '/tours' },
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

export default async function HomePage() {
  const [allTours, hotDeals, destinationCategories, heroSlides, partnersData, teamMembers, popupOffer] = await Promise.all([
    getTours(),
    getHotDeals(),
    getDestinationCategories(),
    getHeroSlides(),
    getPartners(),
    getTeamMembers(),
    getPopupOffer(),
  ]);

  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : fallbackSlides;
  const partners = partnersData && partnersData.length > 0 ? partnersData : fallbackPartners;
  const featuredTours = allTours.filter((t: Tour) => t.featured).slice(0, 3);
  const tours = featuredTours.length > 0 ? featuredTours : allTours.slice(0, 3);

  const travelAgencySchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Lindberg Safaris',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1774850774/carousel_nprg6k.jpg',
    description: 'Tailor-made luxury safaris, wildlife adventures, and bespoke holidays in Kenya, Tanzania, Uganda, and Rwanda.',
    address: { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'Kenya' },
  };

  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Lindberg Safaris',
    url: SITE_URL,
  };

  return (
    <>
      <JsonLd schema={[travelAgencySchema, webSiteSchema]} />
      <PopupOffer initialOffer={popupOffer} />

      {/* 1. Hero Carousel */}
      <HeroSlider slides={slides} />

      {/* 2. Hot Deals */}
      {hotDeals.length > 0 && (
        <Section className="bg-primary">
          <Container>
            <div className="text-center mb-16 relative">
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-red-600 transform -skew-x-12 -translate-y-2"></div>
                <div className="relative px-8 py-3">
                  <h2 className="text-3xl md:text-5xl font-black mb-0 text-white uppercase tracking-tighter italic">
                    Hot Deals
                  </h2>
                </div>
                <div className="absolute -left-4 top-0 bottom-0 w-8 bg-red-600 transform -skew-x-12 z-0"></div>
                <div className="absolute -right-4 top-0 bottom-0 w-8 bg-red-600 transform -skew-x-12 z-0"></div>
              </div>
              <p className="text-lg text-gray-100 max-w-2xl mx-auto mt-6 font-medium bg-black/20 backdrop-blur-sm inline-block px-6 py-2 rounded-full">
                Limited-time offers on our best safari experiences
              </p>
            </div>
            <HotDealsSection deals={hotDeals} />
          </Container>
        </Section>
      )}

      {/* 3. Partners */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold mb-4">
              <Handshake size={16} /> Trusted Partners
            </div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-900">Our Partners & Affiliates</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We work with the best in the industry to deliver exceptional safari experiences.</p>
          </div>
          <div className="flex flex-wrap gap-4 md:gap-8 items-start opacity-80 hover:opacity-100 transition-all duration-500">
            {partners.map((partner: Partner, index: number) => {
              const logoUrl = typeof partner.logo === 'string' ? partner.logo : partner.logo?.url || '';
              return (
                <div key={partner._id || index} className="flex-grow flex flex-col items-center gap-3 basis-[40%] md:basis-[20%] lg:basis-[12%]">
                  {partner.website ? (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex justify-center items-center h-32 bg-secondary-light p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoUrl} alt={partner.name} className="max-h-full max-w-full object-contain transition-all duration-300" />
                    </a>
                  ) : (
                    <div className="w-full flex justify-center items-center h-32 bg-secondary-light p-4 rounded-lg shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoUrl} alt={partner.name} className="max-h-full max-w-full object-contain transition-all duration-300" />
                    </div>
                  )}
                  <p className="text-xs md:text-sm font-bold text-gray-700 text-center uppercase tracking-tight line-clamp-2 px-1">
                    {partner.name}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 4. Destinations */}
      <Section className="bg-primary">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white">Explore Our Destinations</h2>
            <p className="text-gray-100 max-w-2xl mx-auto">Discover incredible destinations across East Africa and beyond.</p>
          </div>
          <div className="flex flex-wrap gap-6">
            {(destinationCategories || []).map((region) => (
              <Link
                href={`/regions/${region.slug}`}
                key={region._id}
                className="group relative overflow-hidden rounded-xl h-80 block flex-grow basis-full md:basis-[calc(50%-1.5rem)] lg:basis-[calc(33.333%-1.5rem)]"
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-500 z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={region.image?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80'}
                  alt={region.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                  <h3 className="text-2xl font-serif font-bold mb-2">{region.name}</h3>
                  <p className="text-sm text-gray-200 line-clamp-2 mb-3">{region.description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-light group-hover:text-white transition-colors">
                    Explore Region <ChevronRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. Tours */}
      <Section>
        <Container>
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-900">Popular Safari Tours</h2>
              <p className="text-gray-600 max-w-xl">Handpicked safari experiences across the best wildlife destinations in East Africa.</p>
            </div>
            <Link href="/tours" className="hidden md:block">
              <Button variant="outline">View All Tours</Button>
            </Link>
          </div>

          {tours.length > 0 ? (
            <div className="flex flex-wrap gap-8 text-left">
              {tours.map((tour) => (
                <div key={tour._id} className="flex-grow basis-full md:basis-[calc(50%-2rem)] lg:basis-[calc(33.333%-2rem)]">
                  <TourCard
                    id={tour.slug?.current || tour._id}
                    title={tour.title}
                    image={tour.images?.[0]?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    duration={tour.duration}
                    groupSize={tour.groupSize || 'Contact us'}
                    price={tour.price}
                    rating={tour.rating || 0}
                    reviews={tour.reviews || 0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary-light rounded-lg">
              <p className="text-gray-600">No tours available at the moment. Check back soon!</p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/tours">
              <Button variant="outline" className="w-full">View All Tours</Button>
            </Link>
          </div>
        </Container>
      </Section>

      {/* Our Clients Section */}
      <Section className="bg-secondary border-b border-gray-100">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-900">Our Valued Clients</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Trusted by organizations and travelers from across the globe.</p>
          </div>
          <div className="flex flex-wrap gap-8 justify-center items-start">
            {[
              { name: 'Rasor Expeditions', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.31.59_6ef53a09_kgh022.jpg' },
              { name: 'Don Bosco Church', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.31.59_ca7bae5c_umiwbi.jpg' },
              { name: 'Fusion Capital', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.31.59_ae547141_oqvaum.jpg' },
              { name: 'Britam', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.32.50_349792e2_jclmvq.jpg' },
              { name: 'Kingdom Bank', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.32.50_6d3bd8ca_kalep2.jpg' }
            ].map((client, index) => (
              <div key={index} className="flex flex-col items-center gap-3 flex-grow basis-[40%] md:basis-[18%] lg:basis-[18%]">
                <div className="w-40 h-40 flex items-center justify-center p-4 transition-all duration-300 bg-white rounded-lg shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain" />
                </div>
                <p className="text-xs md:text-sm font-bold text-gray-700 text-center uppercase tracking-tight">
                  {client.name}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 6. Travel With Us */}
      <Section className="bg-primary">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white">Why Travel With Us</h2>
            <p className="text-gray-100 max-w-2xl mx-auto">Our commitment to excellence sets us apart.</p>
          </div>
          <div className="flex flex-wrap gap-8">
            {[
              { title: 'Unmatched Experience', description: 'Over a decade of crafting memorable safari experiences across East Africa.', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770892041/Vehicle_khehig.jpg' },
              { title: 'Safety First', description: 'Your safety is our top priority with well-maintained vehicles and experienced drivers.', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770824812/WhatsApp_Image_2026-02-10_at_17.18.26_3_tnwxox.jpg' },
              { title: 'Tailored Experiences', description: 'Every safari is customized to match your preferences and budget.', image: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1770892042/vehicle7_vomea0.jpg' },
            ].map((item, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl h-[300px] group shadow-lg border border-white/10 flex-grow basis-full md:basis-[calc(50%-2rem)] lg:basis-[calc(33.333%-2rem)]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url("${item.image}")` }}
                />
                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />
                <div className="relative h-full flex flex-col justify-end p-8 z-10 text-center md:text-left">
                  <h3 className="text-xl font-serif font-bold mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-100 text-sm md:text-base">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Video & Affiliates */}
      <Section className="bg-primary">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white">Experience the Adventure</h2>
            <p className="text-gray-100 max-w-2xl mx-auto">Watch our safari experiences and meet our affiliate partners.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="w-full">
              <div className="relative pt-[56.25%] rounded-xl overflow-hidden shadow-lg">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/9Gi7_2C5U1o?si=sBEpRxH_hWkbwamE&start=20"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold mb-8 text-white text-center md:text-left">Affiliate Members</h3>
              <div className="flex flex-wrap gap-6">
                {[
                  'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812605/IMG-20251214-WA0020_vakifx.jpg',
                  'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812606/IMG-20251214-WA0022_im5faz.jpg',
                  'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812605/IMG-20251214-WA0021_ijcenx.jpg',
                  'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812604/IMG-20251214-WA0019_ncbbga.jpg',
                ].map((logoUrl, index) => (
                  <div key={index} className="flex-grow flex justify-center items-center h-32 bg-secondary-light p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 basis-[45%] md:basis-[22%]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoUrl} alt={`Affiliate Member ${index + 1}`} className="max-h-full max-w-full object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 7. Team */}
      <Section className="bg-primary">
        <TeamSection initialMembers={teamMembers} />
      </Section>

      {/* Google Reviews */}
      <Section className="bg-primary pb-0">
        <GoogleReviewsWidget />
      </Section>

      {/* Newsletter */}
      <Section className="bg-primary text-white pt-0">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Stay Updated</h2>
            <p className="text-white opacity-90 mb-8">Subscribe to our newsletter for exclusive deals and safari inspiration.</p>
            <MailchimpForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
