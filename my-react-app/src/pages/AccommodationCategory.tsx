import useSWR from 'swr';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import { Star, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';
import SEO from '@/components/SEO';
import api from '@/lib/api';
import { Accommodation } from '@/types';

const AccommodationCategory = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const { data: accommodationsData, error: accommodationsError } = useSWR<{ data: Accommodation[] }>(type ? `accommodations-${type}` : null, () => api.accommodations.getByType(type!));
    const accommodations = accommodationsData?.data || [];
    const loading = !accommodationsData && !accommodationsError;

    const typeInfo: Record<string, { title: string; description: string; h1: string }> = {
        'lodges': {
            title: "Safari Lodges in East Africa",
            h1: "Safari Lodges in Kenya & East Africa",
            description: "Book safari lodges inside Kenya's top national parks — Masai Mara, Amboseli, Tsavo. Comfortable stays steps from big five wildlife. Reserve with Lindberg Safaris."
        },
        'holiday-homes': {
            title: "Holiday Homes & Private Villas Kenya",
            h1: "Holiday Homes & Private Villas in Kenya",
            description: "Exclusive private villas and holiday homes for families and groups in Kenya. Self-catering beach cottages, garden retreats, and secluded estate properties."
        },
        'town-hotels': {
            title: "Town Hotels in Nairobi, Mombasa & Arusha",
            h1: "Town Hotels in Nairobi, Mombasa & Arusha",
            description: "Convenient and comfortable city hotels in Nairobi, Mombasa, and Arusha. Business-friendly stays, airport hotels, and boutique properties. Book today."
        },
        'luxury-camps': {
            title: "Luxury Tented Camps in Kenya & Tanzania",
            h1: "Luxury Tented Camps in Kenya & Tanzania",
            description: "Glamping at its finest — 5-star luxury tented camps in the Masai Mara, Serengeti, and beyond. Private plunge pools, gourmet dining, and guided game drives."
        },
        'resort-hotels': {
            title: "Beach Resort Hotels in Kenya & Zanzibar",
            h1: "Beach Resort Hotels in Kenya & Zanzibar",
            description: "Beachfront resort hotels on the Kenyan coast, Zanzibar, and Indian Ocean islands. Pools, spas, and all-inclusive packages for your perfect tropical holiday."
        },
        'bush-camps': {
            title: "Bush Camps & Wilderness Camps in Kenya",
            h1: "Bush Camps & Wilderness Camps in Kenya",
            description: "Authentic mobile bush camps and permanent wilderness campsites in Kenya's remotest reserves. Immersive nature experiences with expert guides. Book with us."
        }
    };

    const info = typeInfo[type || ''] || {
        title: "Accommodation in East Africa",
        h1: "Accommodation in East Africa",
        description: "Discover the perfect place to stay for your East Africa safari — from luxury tented camps to private beach resorts, town hotels, and holiday homes."
    };

    return (
        <Layout>
            <SEO
                title={info.title}
                description={info.description}
            />
            {/* Hero Section with Background Image */}
            <div className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: `url("https://res.cloudinary.com/dbqdpitah/image/upload/v1771310598/pexels-renato-conti-1385524-2677843_rcoj7q.jpg")` }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <Container className="relative z-10">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 capitalize">{info.h1}</h1>
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
                        <div className="flex flex-wrap gap-8">
                            {accommodations.map((acc) => (
                                <div key={acc._id} className="bg-secondary-light rounded-xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-md transition-all flex flex-col flex-grow basis-full md:basis-[calc(50%-2rem)] lg:basis-[calc(33.333%-2rem)]">
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
                                        <div className="flex items-center justify-end mt-4">
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
