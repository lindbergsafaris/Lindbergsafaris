import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation(['common', 'home']);
    const [tours, setTours] = useState<Tour[]>([]);
    const [hotDeals, setHotDeals] = useState<HotDeal[]>([]);

    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770824816/WhatsApp_Image_2026-02-10_at_17.18.58_ogv7ye.jpg",
            title: t('home:hero.slide1.title'),
            subtitle: t('home:hero.slide1.subtitle')
        },
        {
            id: 2,
            image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770824814/WhatsApp_Image_2026-02-10_at_17.18.25_zvduyr.jpg",
            title: t('home:hero.slide2.title'),
            subtitle: t('home:hero.slide2.subtitle')
        },
        {
            id: 3,
            image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770892041/Vehicle_khehig.jpg",
            title: t('home:hero.slide3.title'),
            subtitle: t('home:hero.slide3.subtitle')
        },
        {
            id: 4,
            image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770894189/visa3_oasvox.jpg",
            title: t('home:hero.slide4.title'),
            subtitle: t('home:hero.slide4.subtitle')
        },
        {
            id: 5,
            image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770892892/Boeing_787-8_Dreamliner_Kenya_Airways_5Y-KZA_Large_rqu4mz.jpg",
            title: t('home:hero.slide5.title'),
            subtitle: t('home:hero.slide5.subtitle')
        },
        {
            id: 6,
            image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1770894402/custom_llzlln.jpg",
            title: t('home:hero.slide6.title'),
            subtitle: t('home:hero.slide6.subtitle')
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
        { name: 'Anne Karegi', role: 'Accounts', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813226/IMG-20251214-WA0031_bazmkr.jpg' },
        { name: 'Ray Muriiki', role: 'Finance Analyst', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0028_ija8zw.jpg' },
        { name: 'David Njabia', role: 'Tour Consultant', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0027_zjsjki.jpg' },
        { name: 'Jacinter Njoroge', role: 'Tour Consultant', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0026_ay6xve.jpg' },
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
                                        <Button size="lg">{t('common:buttons.startYourJourney')}</Button>
                                    </Link>
                                    <Link to="/tours">
                                        <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                                            {t('common:buttons.viewOurTours')}
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
                                <Tag size={16} /> {t('home:hotDeals.badge')}
                            </div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-3 text-white">{t('home:hotDeals.title')}</h2>
                            <p className="text-lg text-gray-100 max-w-2xl mx-auto">{t('home:hotDeals.description')}</p>
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
                                            {t('common:buttons.inquireDeal')}
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
                            <Handshake size={16} /> {t('home:partners.badge')}
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-900">{t('home:partners.title')}</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">{t('home:partners.description')}</p>
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
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white">{t('home:destinations.title')}</h2>
                        <p className="text-gray-100 max-w-2xl mx-auto">{t('home:destinations.description')}</p>
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
                                        {t('common:buttons.exploreRegion')} <ChevronRight size={16} />
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
                            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-900">{t('home:tours.title')}</h2>
                            <p className="text-gray-600 max-w-xl">{t('home:tours.description')}</p>
                        </div>
                        <Link to="/tours" className="hidden md:block">
                            <Button variant="outline">{t('common:buttons.viewAllTours')}</Button>
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
                            <p className="text-gray-600">{t('home:tours.noToursAvailable')}</p>
                        </div>
                    )}

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/tours">
                            <Button variant="outline" className="w-full">{t('common:buttons.viewAllTours')}</Button>
                        </Link>
                    </div>
                </Container>
            </Section>

            {/* Our Clients Section */}
            <Section className="bg-secondary border-b border-gray-100">
                <Container>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-gray-900">{t('home:clients.title')}</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">{t('home:clients.description')}</p>
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
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white">{t('home:travelWithUs.title')}</h2>
                        <p className="text-gray-100 max-w-2xl mx-auto">{t('home:travelWithUs.description')}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: t('home:travelWithUs.experience.title'),
                                description: t('home:travelWithUs.experience.description'),
                                image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            },
                            {
                                title: t('home:travelWithUs.safety.title'),
                                description: t('home:travelWithUs.safety.description'),
                                image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            },
                            {
                                title: t('home:travelWithUs.tailored.title'),
                                description: t('home:travelWithUs.tailored.description'),
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
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white">{t('home:travelWithUs.videoSection.title')}</h2>
                        <p className="text-gray-100 max-w-2xl mx-auto">{t('home:travelWithUs.videoSection.description')}</p>
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
                            <h3 className="text-2xl font-serif font-bold mb-8 text-white text-center md:text-left">{t('home:travelWithUs.videoSection.affiliateMembers')}</h3>
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
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white">{t('home:team.title')}</h2>
                        <p className="text-gray-100 max-w-2xl mx-auto">{t('home:team.description')}</p>
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
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">{t('home:newsletter.title')}</h2>
                        <p className="text-primary-light mb-8">{t('home:newsletter.description')}</p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder={t('home:newsletter.placeholder')}
                                className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                            />
                            <Button variant="secondary" size="lg">{t('common:buttons.subscribeNow')}</Button>
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default Home;
