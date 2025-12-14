import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
    const [loading, setLoading] = useState(true);
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

    // Mock Partners Data
    const partners = [
        { name: 'Partner 1', logo: 'https://via.placeholder.com/150x80?text=Partner+1' },
        { name: 'Partner 2', logo: 'https://via.placeholder.com/150x80?text=Partner+2' },
        { name: 'Partner 3', logo: 'https://via.placeholder.com/150x80?text=Partner+3' },
        { name: 'Partner 4', logo: 'https://via.placeholder.com/150x80?text=Partner+4' },
        { name: 'Partner 5', logo: 'https://via.placeholder.com/150x80?text=Partner+5' },
        { name: 'Partner 6', logo: 'https://via.placeholder.com/150x80?text=Partner+6' },
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [toursRes, hotDealsRes] = await Promise.all([
                    api.tours.getAll(),
                    api.hotDeals.getAll()
                ]);

                // Get featured tours or first 3
                const allTours = toursRes.data || [];
                const featuredTours = allTours.filter((t: any) => t.featured).slice(0, 3);
                setTours(featuredTours.length > 0 ? featuredTours : allTours.slice(0, 3));

                // Get Hot Deals
                setHotDeals(hotDealsRes.data || []);

                console.log('Tours:', toursRes.data);
                console.log('Hot Deals:', hotDealsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                // Keep empty arrays on error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                            <div className="absolute inset-0 bg-black/40" />
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
                <Section className="bg-gray-50">
                    <Container>
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-bold mb-4">
                                <Tag size={16} /> Hot Deals
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-3 text-gray-900">Exclusive Offers</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Limited time offers on our most popular safari packages.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {hotDeals.map((deal) => (
                                <div key={deal._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
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

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {partners.map((_, index) => (
                            <div key={index} className="flex justify-center">
                                <div className="h-24 bg-gray-200 w-full rounded flex items-center justify-center text-gray-400 font-bold text-lg">
                                    {/* Placeholder for actual logos */}
                                    LOGO {index + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* 4. Destinations */}
            <Section className="bg-gray-50">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-900">Explore Top Destinations</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">From the vast plains of the Serengeti to the pristine beaches of Zanzibar.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.values(regionData).map((region) => (
                            <Link to={`/regions/${region.id}`} key={region.id} className="group relative overflow-hidden rounded-xl h-80 block">
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-500 z-10" />
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
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
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

            {/* 6. Travel With Us (Value Propositions) */}
            <Section className="bg-secondary/30">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-900">Travel With Us</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Why choose Lindberg Safaris for your next adventure?</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <h3 className="text-xl font-serif font-bold mb-2">25+ Years Experience</h3>
                            <p className="text-gray-600">Deep local knowledge and expertise in crafting perfect safari itineraries since 1998.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <h3 className="text-xl font-serif font-bold mb-2">Safe & Secure</h3>
                            <p className="text-gray-600">Your safety is our priority. We provide 24/7 support and work with trusted partners.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                            </div>
                            <h3 className="text-xl font-serif font-bold mb-2">Tailored Journeys</h3>
                            <p className="text-gray-600">Every trip is unique. We customize every detail to match your preferences and dreams.</p>
                        </div>
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
