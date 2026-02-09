import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { ChevronLeft, ChevronRight, Tag, Handshake } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import TourCard from '@/components/tours/TourCard';
import SEO from '@/components/SEO';
import api from '@/lib/api';
import { getWhatsAppLink } from '@/lib/utils';
import PopupOffer from '@/components/ui/PopupOffer';
import { regionData } from '@/data/destinations';
import LoadingScreen from '@/components/ui/LoadingScreen';

import { Tour, HotDeal } from '@/types';

const Home = () => {
    const [tours, setTours] = useState<Tour[]>([]);
    const [hotDeals, setHotDeals] = useState<HotDeal[]>([]);

    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80",
            title: "Discover Africa's Wild Heart",
            subtitle: "Experience the magic of the savannah with personalized safaris tailored to your dreams."
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80", // Resort/Pool image
            title: "Hotel Booking",
            subtitle: "Luxury accommodations in the heart of nature, from bush camps to 5-star resorts."
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80", // Travel/Transport
            title: "Transport Services",
            subtitle: "Comfortable and reliable transport solutions for your entire journey."
        },
        {
            id: 4,
            image: "https://res.cloudinary.com/di5ga8z9i/image/upload/v1765555649/visas_vc54gx.jpg", // Passport/Visa
            title: "Visa Application",
            subtitle: "Hassle-free visa assistance to ensure smooth entry into your destination."
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80", // Airplane/Ticketing
            title: "Ticketing",
            subtitle: "Best flight deals and seamless booking experiences for international and local travel."
        },
        {
            id: 6,
            image: "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Map/Planning
            title: "Custom Itineraries",
            subtitle: "Tailor-made packages designed specifically for your unique preferences and budget."
        }
    ];

    // Partners Data
    const partners = [
        { name: 'Partner 1', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812606/IMG-20251214-WA0024_fcc5e0.jpg' },
        { name: 'Partner 2', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812606/IMG-20251214-WA0023_jwsxce.jpg' },
        { name: 'Partner 3', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812606/IMG-20251214-WA0022_im5faz.jpg' },
        { name: 'Partner 4', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812605/IMG-20251214-WA0021_ijcenx.jpg' },
        { name: 'Partner 5', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812605/IMG-20251214-WA0025_mokzmf.jpg' },
        { name: 'Partner 6', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812605/IMG-20251214-WA0020_vakifx.jpg' },
        { name: 'Partner 7', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812604/IMG-20251214-WA0019_ncbbga.jpg' },
    ];

    // Team Data
    const teamMembers = [
        { name: 'Charles Mwiti', role: 'CEO', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0030_nc0mt7.jpg' },
        { name: 'Lucy Kathurima', role: 'Director', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0029_rmfaxp.jpg' },
        { name: 'Jadiel Mwongera', role: 'Operations', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813226/IMG-20251214-WA0032_ezxukj.jpg' },
        { name: 'Ann Karegi', role: 'Accounts', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813226/IMG-20251214-WA0031_bazmkr.jpg' },
        { name: 'Ray Muriki', role: 'Finance Analyst', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0028_ija8zw.jpg' },
        { name: 'David Njabi', role: 'Tour Consultant', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0027_zjsjki.jpg' },
        { name: 'Jascinter Anne Njabia', role: 'Tour Consultant', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0026_ay6xve.jpg' },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 2500); // Reduced speed by 50% (twice as fast)
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const { data: toursData, error: toursError } = useSWR('tours', () => api.tours.getAll().then(res => res.data));
    const { data: hotDealsData, error: hotDealsError } = useSWR('hotDeals', () => api.hotDeals.getAll().then(res => res.data));

    useEffect(() => {
        if (toursData) {
            // Get featured tours or first 3
            const allTours = toursData || [];
            const featuredTours = allTours.filter((t: Tour) => t.featured).slice(0, 3);
            setTours(featuredTours.length > 0 ? featuredTours : allTours.slice(0, 3));
        }
    }, [toursData]);

    useEffect(() => {
        if (hotDealsData) {
            setHotDeals(hotDealsData || []);
        }
    }, [hotDealsData]);

    const loading = (!toursData && !toursError) || (!hotDealsData && !hotDealsError);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <Layout>
            <SEO
                title="Home"
                description="Experience the magic of East Africa with Lindberg Safaris. Tailor-made luxury safaris in Kenya, Tanzania, Uganda, and Rwanda."
            />

            <PopupOffer />

            {/* 1. Carousel (Hero) */}
            <div className="relative h-screen min-h-[600px] flex items-center justify-center text-white overflow-hidden group">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url("${slide.image}")` }}
                        >
                            <div className="absolute inset-0 bg-black/50" />
                        </div>
                        <Container className="relative h-full flex items-center justify-center text-center z-20">
                            <div className="max-w-4xl mx-auto px-4">
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight animate-fade-in-up">
                                    {slide.title}
                                </h1>
                                <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-100 animate-fade-in-up delay-100">
                                    {slide.subtitle}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
                                    <Link to="/contact">
                                        <Button size="lg">Start Your Journey</Button>
                                    </Link>
                                    <Link to="/tours">
                                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                                            View Our Tours
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </Container>
                    </div>
                ))}

                {/* Carousel Controls */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={32} />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Next slide"
                >
                    <ChevronRight size={32} />
                </button>

                {/* Carousel Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/80'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* 2. Hot Deals */}
            {hotDeals.length > 0 && (
                <Section className="bg-primary">
                    <Container>
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                                <Tag size={16} /> Hot Deals
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-3 text-white">Exclusive Offers</h2>
                            <p className="text-lg text-gray-100 max-w-2xl mx-auto">Limited time offers on our most popular safari packages.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {hotDeals.map((deal) => (
                                <div key={deal._id} className="bg-secondary-light rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                    <div className="relative h-48 overflow-hidden">
                                        {deal.tag && (
                                            <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                                                {deal.tag}
                                            </div>
                                        )}
                                        <img
                                            src={deal.image?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                            alt={deal.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2 text-gray-900">{deal.title}</h3>
                                        <div className="flex justify-between items-center mb-4">
                                            {/* <span className="text-gray-500 text-sm">{deal.duration}</span> */}
                                            <div className="text-right w-full">
                                                {deal.originalPrice && (
                                                    <span className="text-gray-400 line-through text-sm block">KSH {deal.originalPrice}</span>
                                                )}
                                                <span className="text-primary font-bold text-lg">KSH {deal.price}</span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => window.open(getWhatsAppLink(`I am interested in the ${deal.title} offer`), '_blank')}
                                        >
                                            Inquire Deal
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Container>
                </Section>
            )}

            {/* 3. Partners */}
            <Section>
                <Container>
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bold mb-4">
                            <Handshake size={16} /> Our Partners
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-900">Trusted By The Best</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">We work with world-class partners to ensure your journey is seamless.</p>
                    </div>

                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 no-scrollbar md:grid md:grid-cols-4 lg:grid-cols-7 md:gap-8 items-center opacity-80 hover:opacity-100 transition-all duration-500 pb-4 md:pb-0">
                        {partners.map((partner, index) => (
                            <div key={index} className="snap-center shrink-0 w-[40%] md:w-auto flex justify-center items-center h-32 bg-secondary-light p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="max-h-full max-w-full object-contain transition-all duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* 4. Destinations */}
            <Section className="bg-primary">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white">Explore Top Destinations</h2>
                        <p className="text-gray-100 max-w-2xl mx-auto">From the vast plains of the Serengeti to the pristine beaches of Zanzibar.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.values(regionData).map((region) => (
                            <Link to={`/regions/${region.id}`} key={region.id} className="group relative overflow-hidden rounded-xl h-80 block">
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-500 z-10" />
                                <img
                                    src={region.image}
                                    alt={region.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                                    <h3 className="text-2xl font-serif font-bold mb-2">{region.title}</h3>
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
                            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-900">Signature Safaris</h2>
                            <p className="text-gray-600 max-w-xl">Handpicked experiences that showcase the very best of African wildlife and landscapes.</p>
                        </div>
                        <Link to="/tours" className="hidden md:block">
                            <Button variant="outline">View All Tours</Button>
                        </Link>
                    </div>

                    {tours.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tours.map((tour) => (
                                <TourCard
                                    key={tour._id}
                                    id={tour._id}
                                    title={tour.title}
                                    image={tour.images?.[0]?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                    duration={tour.duration}
                                    groupSize={tour.groupSize || 'Contact us'}
                                    price={tour.price}
                                    rating={tour.rating || 0}
                                    reviews={tour.reviews || 0}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-secondary-light rounded-lg">
                            <p className="text-gray-600">No tours available yet. Add tours in Sanity Studio!</p>
                        </div>
                    )}

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/tours">
                            <Button variant="outline" className="w-full">View All Tours</Button>
                        </Link>
                    </div>
                </Container>
            </Section>

            {/* Our Clients Section */}
            <Section className="bg-secondary border-b border-gray-100">
                <Container>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-900">Our Clients</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Trusted by leading organizations and happy travelers.</p>
                    </div>

                    {/* Desktop Grid */}
                    <div className="hidden md:grid md:grid-cols-5 gap-8 items-center justify-items-center">
                        {[
                            'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.31.59_6ef53a09_kgh022.jpg',
                            'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.31.59_ca7bae5c_umiwbi.jpg',
                            'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.31.59_ae547141_oqvaum.jpg',
                            'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.32.50_349792e2_jclmvq.jpg',
                            'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.32.50_6d3bd8ca_kalep2.jpg'
                        ].map((logo, index) => (
                            <div key={index} className="w-40 h-40 flex items-center justify-center p-4 transition-all duration-300">
                                <img src={logo} alt={`Client ${index + 1}`} className="max-w-full max-h-full object-contain" />
                            </div>
                        ))}
                    </div>

                    {/* Mobile Marquee */}
                    <div className="md:hidden overflow-hidden relative">
                        <div className="flex w-[200%] animate-marquee">
                            {/* First set of logos */}
                            <div className="flex w-1/2 justify-around items-center gap-8 px-4">
                                {[
                                    'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.31.59_6ef53a09_kgh022.jpg',
                                    'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.31.59_ca7bae5c_umiwbi.jpg',
                                    'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.31.59_ae547141_oqvaum.jpg',
                                    'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.32.50_349792e2_jclmvq.jpg',
                                    'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.32.50_6d3bd8ca_kalep2.jpg'
                                ].map((logo, index) => (
                                    <div key={`m1-${index}`} className="w-32 h-32 flex-shrink-0 flex items-center justify-center p-2">
                                        <img src={logo} alt={`Client ${index + 1}`} className="max-w-full max-h-full object-contain" />
                                    </div>
                                ))}
                            </div>
                            {/* Duplicate set for seamless loop */}
                            <div className="flex w-1/2 justify-around items-center gap-8 px-4">
                                {[
                                    'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.31.59_6ef53a09_kgh022.jpg',
                                    'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.31.59_ca7bae5c_umiwbi.jpg',
                                    'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.31.59_ae547141_oqvaum.jpg',
                                    'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.32.50_349792e2_jclmvq.jpg',
                                    'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765971170/WhatsApp_Image_2025-12-14_at_20.32.50_6d3bd8ca_kalep2.jpg'
                                ].map((logo, index) => (
                                    <div key={`m2-${index}`} className="w-32 h-32 flex-shrink-0 flex items-center justify-center p-2">
                                        <img src={logo} alt={`Client ${index + 1}`} className="max-w-full max-h-full object-contain" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* 6. Travel With Us (Value Propositions) */}
            <Section className="bg-primary">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white">Travel With Us</h2>
                        <p className="text-gray-100 max-w-2xl mx-auto">Why choose Lindberg Safaris for your next adventure?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "25+ Years Experience",
                                description: "Deep local knowledge and expertise in crafting perfect safari itineraries since 1998.",
                                image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            },
                            {
                                title: "Safe & Secure",
                                description: "Your safety is our priority. We provide 24/7 support and work with trusted partners.",
                                image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            },
                            {
                                title: "Tailored Journeys",
                                description: "Every trip is unique. We customize every detail to match your preferences and dreams.",
                                image: "https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="relative overflow-hidden rounded-xl h-[300px] group shadow-lg border border-white/10"
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

            {/* New Travel With Us Section (Video & Affiliates) */}
            <Section className="bg-primary">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white">Travel With Us</h2>
                        <p className="text-gray-100 max-w-2xl mx-auto">See what makes our journeys special and meet our trusted partners.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left Column: Video */}
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

                        {/* Right Column: Affiliate Members */}
                        <div>
                            <h3 className="text-2xl font-serif font-bold mb-8 text-white text-center md:text-left">Affiliate Members</h3>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812605/IMG-20251214-WA0020_vakifx.jpg',
                                    'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812606/IMG-20251214-WA0022_im5faz.jpg',
                                    'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812605/IMG-20251214-WA0021_ijcenx.jpg',
                                    'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812604/IMG-20251214-WA0019_ncbbga.jpg'
                                ].map((logoUrl, index) => (
                                    <div key={index} className="flex justify-center items-center h-32 bg-secondary-light p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100">
                                        <img
                                            src={logoUrl}
                                            alt={`Affiliate Member ${index + 1}`}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* 7. Our Team */}
            <Section className="bg-primary">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white">Meet Our Team</h2>
                        <p className="text-gray-100 max-w-2xl mx-auto">The passionate experts behind your unforgettable journeys.</p>
                    </div>

                    {/* Mobile Horizontal Scroll View */}
                    <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 no-scrollbar">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="snap-center shrink-0 w-[80%] sm:w-[45%] group text-center">
                                <div className="relative mb-4 overflow-hidden rounded-lg aspect-[3/4]">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                <p className="text-gray-200 font-medium">{member.role}</p>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Grid View */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="group text-center">
                                <div className="relative mb-4 overflow-hidden rounded-lg aspect-[3/4]">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                <p className="text-gray-200 font-medium">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* Newsletter */}
            <Section className="bg-primary text-white">
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Stay Inspired</h2>
                        <p className="text-primary-light mb-8">Subscribe to our newsletter for safari tips, exclusive offers, and travel inspiration.</p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            <Button variant="secondary" size="lg">Subscribe Now</Button>
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default Home;
