import useSWR from 'swr';
import api from '@/lib/api';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import { Link } from 'react-router-dom';
import { Car, Hotel, Plane, Compass, ArrowRight, Map, Shield, Users, Heart, LucideIcon } from 'lucide-react';
import { Service } from '@/types';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    'Car': Car,
    'Hotel': Hotel,
    'Plane': Plane,
    'Compass': Compass,
    'Map': Map,
    'Shield': Shield,
    'Users': Users,
    'Heart': Heart,
};

// Fallback services — shown when Sanity has no documents yet
const fallbackServices: Service[] = [
    {
        _id: 'fb-transport',
        title: 'Transport Services',
        description: 'We offer daily and long-term car rentals, airport and railway transfers, and tailor-made safaris — turning every journey into a smooth, safe, and unforgettable experience.',
        icon: 'Car',
        slug: '/services/transport',
        features: ['Car Hire', 'Airport & Railway Transfers', 'Safari Vehicles', 'Group Bookings'],
        order: 1,
    },
    {
        _id: 'fb-flights',
        title: 'Ticketing Services',
        description: 'Experience hassle-free travel with our all-in-one ticketing services — air, cruise, train, bus, and ferry — with flexible options and reliable support from start to finish.',
        icon: 'Plane',
        slug: '/services/flights',
        features: ['Air Ticketing', 'Cruise Ticketing', 'Train Ticketing', 'Bus & Ferry Ticketing'],
        order: 2,
    },
    {
        _id: 'fb-visa',
        title: 'Visa Application Support',
        description: 'Our visa application support service removes the guesswork and gives you confidence at every step — from eligibility assessment to final submission.',
        icon: 'Shield',
        slug: '/services/visa',
        features: ['Visa Eligibility Assessment', 'Document Checklist', 'Application Form Review', 'Embassy Appointment Guidance'],
        order: 3,
    },
    {
        _id: 'fb-itineraries',
        title: 'Custom Itineraries',
        description: 'Tailor-made safari and travel itineraries crafted to your interests, budget, and schedule — from the Great Migration to coastal escapes.',
        icon: 'Compass',
        slug: '/services/custom-itineraries',
        features: ['Safari Packages', 'Cultural Tours', 'Honeymoon Safaris', 'Golf & Safari Adventures'],
        order: 4,
    },
    {
        _id: 'fb-hotels',
        title: 'Hotels & Accommodation',
        description: 'We have partnered with the finest accommodation providers across East Africa to offer exclusive rates and unparalleled hospitality for every traveler.',
        icon: 'Hotel',
        slug: '/services/hotels',
        features: ['Luxury Lodges', 'Boutique Hotels', 'Tented Camps', 'Budget Options'],
        order: 5,
    },
    {
        _id: 'fb-hotel-booking',
        title: 'Hotel Booking',
        description: 'Let us handle your hotel reservations — from budget guesthouses to five-star resorts — across East Africa and beyond, with the best available rates.',
        icon: 'Map',
        slug: '/services/hotel-booking',
        features: ['Best Rate Guarantee', 'Instant Confirmation', 'Group Reservations', 'Special Occasion Arrangements'],
        order: 6,
    },
];

// Skeleton card while loading
const SkeletonCard = () => (
    <div className="bg-secondary-light p-8 rounded-xl shadow-sm border border-gray-100 animate-pulse">
        <div className="mb-6 w-20 h-20 rounded-full bg-gray-200" />
        <div className="h-7 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-6" />
        <div className="space-y-2 mb-6">
            {[1, 2, 3].map(i => <div key={i} className="h-3 bg-gray-200 rounded w-4/5" />)}
        </div>
        <div className="h-5 bg-gray-200 rounded w-32" />
    </div>
);

const Services = () => {
    const { data: servicesData, isLoading } = useSWR('services', () => api.services.getAll());
    const services: Service[] = servicesData?.data && servicesData.data.length > 0
        ? servicesData.data
        : fallbackServices;

    return (
        <Layout>
            {/* Hero */}
            <div className="bg-primary text-white py-20">
                <Container>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Services</h1>
                    <p className="text-lg text-gray-100 max-w-2xl">
                        Beyond safaris, we offer a comprehensive range of travel services to make your trip seamless.
                    </p>
                </Container>
            </div>

            <Section className="bg-primary">
                <Container>
                    {isLoading ? (
                        <div className="flex flex-wrap gap-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex-grow basis-full md:basis-[calc(50%-2rem)]">
                                    <SkeletonCard />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-8">
                            {services.map((service) => {
                                const IconComponent = iconMap[service.icon || ''] || Compass;
                                const linkTarget = service.slug || '/contact';
                                const isInternalDetailPage = service.slug && service.slug !== '/contact';

                                return (
                                    <div
                                        key={service._id}
                                        className="bg-secondary-light p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col flex-grow basis-full md:basis-[calc(50%-2rem)]"
                                    >
                                        {/* Icon */}
                                        <div className="mb-6 bg-primary-light/10 w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <IconComponent size={40} className="text-primary" />
                                        </div>

                                        {/* Title & Description */}
                                        <h3 className="text-2xl font-serif font-bold mb-3">{service.title}</h3>
                                        <p className="text-gray-600 mb-6">{service.description}</p>

                                        {/* Features */}
                                        {service.features && service.features.length > 0 && (
                                            <ul className="mb-6 space-y-2">
                                                {service.features.map((feature: string, idx: number) => (
                                                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {/* CTA Link — pushed to bottom */}
                                        <div className="mt-auto pt-4">
                                            <Link
                                                to={linkTarget}
                                                className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors"
                                            >
                                                {isInternalDetailPage ? 'Learn More' : 'Inquire Now'}
                                                <ArrowRight size={18} />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Container>
            </Section>
        </Layout>
    );
};

export default Services;
