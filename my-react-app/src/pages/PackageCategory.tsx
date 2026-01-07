import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import TourCard from '@/components/tours/TourCard';
import api from '@/lib/api';
import { Package } from '@/types';

const PackageCategory = () => {
    const { category } = useParams();
    const { data: packagesData, error: packagesError } = useSWR<{ data: Package[] }>(category ? `packages-${category}` : null, () => api.packages.getByCategory(category!));
    const packages = packagesData?.data || [];
    const loading = !packagesData && !packagesError;

    // Mapping slug to readable title and description (fallback/static info)
    const categoryInfo: Record<string, { title: string; description: string }> = {
        'wildlife': {
            title: "Wildlife Safaris",
            description: "Immerse yourself in the heart of the African wilderness. Witness the Big Five and the Great Migration."
        },
        'climbing': {
            title: "Mountain Climbing",
            description: "Conquer the peaks of Mount Kilimanjaro and Mount Kenya with our expert guides."
        },
        'cruise': {
            title: "Cruise Holiday",
            description: "Relax and unwind on luxury cruises along the beautiful East African coast."
        },
        'adventure': {
            title: "Adventure Packages",
            description: "For the thrill-seekers: white water rafting, bungee jumping, and more."
        },
        'pilgrimages': {
            title: "Pilgrimages",
            description: "Spiritual journeys to sacred sites and historical religious landmarks."
        },
        'corporate': {
            title: "Educational & Corporate Trips",
            description: "Team building, conferences, and educational tours tailored for groups."
        }
    };

    const info = categoryInfo[category || ''] || {
        title: "Themed Packages",
        description: "Explore our wide range of curated travel packages."
    };

    return (
        <Layout>
            <div className="bg-primary text-white py-20">
                <Container>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 capitalize">{info.title}</h1>
                    <p className="text-lg text-primary-light max-w-2xl">{info.description}</p>
                </Container>
            </div>

            <Section className="bg-primary">
                <Container>
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            <p className="mt-4 text-gray-600">Loading packages...</p>
                        </div>
                    ) : packages.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {packages.map((pkg) => (
                                <TourCard
                                    key={pkg._id}
                                    id={pkg._id}
                                    title={pkg.title}
                                    image={pkg.image?.url || "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                                    duration={pkg.duration || ''}
                                    groupSize="Contact us"
                                    price={pkg.price || 0}
                                    rating={0}
                                    reviews={0}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-lg">
                            <p className="text-gray-600 text-lg">No packages found for this category.</p>
                            <p className="text-gray-500 text-sm mt-2">Check back later or contact us for custom itineraries.</p>
                        </div>
                    )}
                </Container>
            </Section>
        </Layout>
    );
};

export default PackageCategory;
