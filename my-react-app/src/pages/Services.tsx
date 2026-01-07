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

const Services = () => {
    const { data: servicesData, error: servicesError } = useSWR<{ data: Service[] }>('services', () => api.services.getAll());
    const services = servicesData?.data || [];
    const loading = !servicesData && !servicesError;

    return (
        <Layout>
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
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p className="mt-4 text-gray-600">Loading services...</p>
                        </div>
                    ) : services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {services.map((service) => {
                                const IconComponent = iconMap[service.icon || ''] || Compass;
                                return (
                                    <div key={service._id} className="bg-secondary-light p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="mb-6 bg-primary-light/10 w-20 h-20 rounded-full flex items-center justify-center">
                                            <IconComponent size={40} className="text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold mb-3">{service.title}</h3>
                                        <p className="text-gray-600 mb-6">{service.description}</p>
                                        {service.features && (
                                            <ul className="mb-6 space-y-2">
                                                {service.features.map((feature: string, idx: number) => (
                                                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {/* Link logic could be dynamic based on service type or a field in Sanity */}
                                        <Link
                                            to="/contact"
                                            className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-dark transition-colors"
                                        >
                                            Inquire Now <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">No services available yet.</p>
                        </div>
                    )}
                </Container>
            </Section>
        </Layout>
    );
};

export default Services;
