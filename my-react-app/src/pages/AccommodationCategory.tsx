import useSWR from 'swr';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import { Star, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { Accommodation } from '@/types';

const AccommodationCategory = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const { data: accommodationsData, error: accommodationsError } = useSWR<{ data: Accommodation[] }>(type ? `accommodations-${type}` : null, () => api.accommodations.getByType(type!));
    const accommodations = accommodationsData?.data || [];
    const loading = !accommodationsData && !accommodationsError;

    const typeInfo: Record<string, { title: string; description: string }> = {
        'lodges': {
            title: "Safari Lodges",
            description: "Comfortable and luxurious lodges located within or near national parks."
        },
        'holiday-homes': {
            title: "Holiday Homes",
            description: "Private villas and homes for families and groups seeking exclusivity."
        },
        'town-hotels': {
            title: "Town Hotels",
            description: "Convenient city hotels in Nairobi, Mombasa, and Arusha."
        },
        'luxury-camps': {
            title: "Luxury Tented Camps",
            description: "Glamping experiences that combine nature with 5-star amenities."
        },
        'resort-hotels': {
            title: "Resort Hotels",
            description: "Beachfront resorts with pools, spas, and all-inclusive options."
        },
        'bush-camps': {
            title: "Bush Camps",
            description: "Authentic and immersive camping experiences close to nature."
        }
    };

    const info = typeInfo[type || ''] || {
        title: "Accommodation",
        description: "Find the perfect place to stay during your safari."
    };

    return (
        <Layout>
            {/* Hero Section with Background Image */}
            <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: `url("https://res.cloudinary.com/dbqdpitah/image/upload/v1771310598/pexels-renato-conti-1385524-2677843_rcoj7q.jpg")` }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <Container className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 capitalize">{info.title}</h1>
                    <p className="text-lg text-gray-100 max-w-2xl">{info.description}</p>
                </Container>
            </div>

            <Section className="bg-primary">
                <Container>
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            <p className="mt-4 text-gray-600">Loading accommodations...</p>
                        </div>
                    ) : accommodations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {accommodations.map((acc) => (
                                <div key={acc._id} className="bg-secondary-light rounded-xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-all">
                                    <div className="h-64 overflow-hidden relative">
                                        <img
                                            src={acc.image?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                            alt={acc.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                            <Star size={12} className="text-accent fill-accent" />
                                            {acc.rating || 5}.0
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-1 text-sm text-gray-500 mb-2">
                                            <MapPin size={14} className="text-primary" />
                                            {acc.location || 'Unknown Location'}
                                        </div>
                                        <h3 className="text-xl font-serif font-bold mb-4">{acc.name}</h3>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div>
                                                <span className="text-xs text-gray-500 block">From</span>
                                                <span className="text-lg font-bold text-primary">KSH {acc.pricePerNight}</span>
                                                <span className="text-xs text-gray-500"> / night</span>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => navigate(`/accommodation/view/${acc._id}`)}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-secondary rounded-lg">
                            <p className="text-gray-600 text-lg">No accommodations found for this category.</p>
                            <p className="text-gray-500 text-sm mt-2">Check back later.</p>
                        </div>
                    )}
                </Container>
            </Section>
        </Layout>
    );
};

export default AccommodationCategory;
