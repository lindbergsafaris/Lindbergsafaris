import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import { Link } from 'react-router-dom';
import { Car, Hotel, Plane, Compass, ArrowRight, Map, Shield, Users, Heart } from 'lucide-react';

// Icon mapping
const iconMap: Record<string, any> = {
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
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const servicesList = [
        {
            _id: '1',
            title: 'Airticketing',
            description: 'Best flight deals and seamless booking experiences for international and local travel.',
            icon: 'Plane',
            features: ['International Flights', 'Local Flights', 'Best Price Guarantee', '24/7 Support']
        },
        {
            _id: '2',
            title: 'Hotel Booking',
            description: 'Luxury accommodations in the heart of nature, from bush camps to 5-star resorts.',
            icon: 'Hotel',
            features: ['Luxury Resorts', 'Bush Camps', 'City Hotels', 'Best Rates']
        },
        {
            _id: '3',
            title: 'Transport Services',
            description: 'Comfortable and reliable transport solutions for your entire journey.',
            icon: 'Car',
            features: ['Airport Transfers', 'Safari Jeeps', 'Car Hire', 'Professional Drivers']
        },
        {
            _id: '4',
            title: 'Visa Applications',
            description: 'Hassle-free visa assistance to ensure smooth entry into your destination.',
            icon: 'Shield',
            features: ['Visa Advice', 'Application Assistance', 'Document Review', 'Fast Processing']
        },
        {
            _id: '5',
            title: 'Custom Itineraries',
            description: 'Tailor-made packages designed specifically for your unique preferences and budget.',
            icon: 'Map',
            features: ['Personalized Planning', 'Flexible Schedules', 'Expert Advice', 'Unique Experiences']
        }
    ];

    useEffect(() => {
        // Simulate loading for smooth UX or just set immediately
        setServices(servicesList);
        setLoading(false);
    }, []);

    return (
        <Layout>
            <div className="bg-gray-900 text-white py-20">
                <Container>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Our Services</h1>
                    <p className="text-lg text-gray-300 max-w-2xl">
                        Beyond safaris, we offer a comprehensive range of travel services to make your trip seamless.
                    </p>
                </Container>
            </div>

            <Section>
                <Container>
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p className="mt-4 text-gray-600">Loading services...</p>
                        </div>
                    ) : services.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {services.map((service) => {
                                const IconComponent = iconMap[service.icon] || Compass;
                                return (
                                    <div key={service._id} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
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
