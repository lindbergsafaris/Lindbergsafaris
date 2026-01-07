import { useState } from 'react';
import useSWR from 'swr';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Info, MapPin, Send } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { Destination, PlaceToVisit } from '@/types';
import { getWhatsAppLink } from '@/lib/utils';

const DestinationDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { data: destinationData, error: destinationError } = useSWR<{ data: Destination }>(id ? `destination-${id}` : null, () => api.destinations.getById(id!));
    const destination = destinationData?.data || null;
    const loading = !destinationData && !destinationError;

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const message = `Inquiry for ${destination?.name || 'Safari'}:\n\nName: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`;
        const whatsappLink = getWhatsAppLink(message);
        window.open(whatsappLink, '_blank');
    };

    if (loading) {
        return (
            <Layout>
                <div className="h-[50vh] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    if (!destination) {
        return (
            <Layout>
                <Container className="py-20 text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Destination Not Found</h2>
                    <p className="text-gray-600">The destination you are looking for does not exist or has been moved.</p>
                    <Link to="/destinations">
                        <Button className="mt-6">Back to Destinations</Button>
                    </Link>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            {/* Hero */}
            <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: `url("${destination.heroImage}")` }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">{destination.name}</h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide">{destination.tagline}</p>
                </Container>
            </div>

            <Section className="bg-primary">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <h2 className="text-3xl font-serif font-bold mb-6 text-white">Overview</h2>
                            <p className="text-gray-100 leading-relaxed mb-8 text-lg">
                                {destination.description}
                            </p>

                            {/* Highlights */}
                            {destination.highlights && destination.highlights.length > 0 && (
                                <div className="mb-12">
                                    <h3 className="text-2xl font-bold mb-6 text-white">Highlights</h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {destination.highlights.map((highlight: string, index: number) => (
                                            <li key={index} className="flex items-center gap-3 text-gray-700 bg-secondary p-3 rounded-lg">
                                                <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
                                                <span>{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Places to Visit (Blog Style) */}
                            {destination.placesToVisit && destination.placesToVisit.length > 0 && (
                                <div className="mb-12">
                                    <h3 className="text-2xl font-serif font-bold mb-8 text-white">Top Places to Visit in {destination.name}</h3>
                                    <div className="space-y-12">
                                        {destination.placesToVisit.map((place: PlaceToVisit, index: number) => (
                                            <div key={index} className="flex flex-col md:flex-row gap-8 items-start">
                                                <div className="md:w-1/2 overflow-hidden rounded-xl shadow-md">
                                                    <img
                                                        src={place.image}
                                                        alt={place.title}
                                                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="md:w-1/2">
                                                    <h4 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
                                                        <MapPin size={20} className="text-accent" />
                                                        {place.title}
                                                    </h4>
                                                    <p className="text-gray-100 leading-relaxed">
                                                        {place.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Practical Info */}
                            {destination.practicalInfo && (
                                <div className="bg-secondary-light p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-serif font-bold mb-6 border-b pb-2">Practical Info</h3>
                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <Calendar className="text-primary shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-sm">Best Time to Visit</h4>
                                                <p className="text-sm text-gray-600">{destination.practicalInfo.bestTime || 'Contact us'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <Info className="text-primary shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-sm">Visa Info</h4>
                                                <p className="text-sm text-gray-600">{destination.practicalInfo.visaInfo || 'Contact us'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-6 h-6 flex items-center justify-center font-bold text-primary text-xs border border-primary rounded-full">C</div>
                                            <div>
                                                <h4 className="font-bold text-sm">Currency</h4>
                                                <p className="text-sm text-gray-600">{destination.practicalInfo.currency || 'Contact us'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-6 h-6 flex items-center justify-center font-bold text-primary text-xs border border-primary rounded-full">L</div>
                                            <div>
                                                <h4 className="font-bold text-sm">Language</h4>
                                                <p className="text-sm text-gray-600">{destination.practicalInfo.language || 'Contact us'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Inquiry Form */}
                            <div className="bg-white/10 p-6 rounded-xl border border-white/20 sticky top-24">
                                <h3 className="text-xl font-serif font-bold mb-2 text-white">Plan Your Trip</h3>
                                <p className="text-sm text-gray-200 mb-6">Interested in {destination.name}? Send us an inquiry and we'll help you plan the perfect safari.</p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">Your Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-white/10 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-white/10 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-1">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={4}
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-white/10 text-white focus:ring-2 focus:ring-white/20 focus:border-transparent outline-none resize-none"
                                            placeholder={`I'm interested in visiting ${destination.name}...`}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full flex items-center justify-center gap-2">
                                        <Send size={18} />
                                        Send Inquiry via WhatsApp
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default DestinationDetail;
