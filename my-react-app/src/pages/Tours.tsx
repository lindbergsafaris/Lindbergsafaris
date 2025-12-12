import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import TourCard from '@/components/tours/TourCard';
import TourFilter from '@/components/tours/TourFilter';
import api from '@/lib/api';
import LoadingScreen from '@/components/ui/LoadingScreen';

const Tours = () => {
    const [tours, setTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                const response = await api.tours.getAll();
                setTours(response.data || []);
            } catch (err: any) {
                console.error('Error fetching tours:', err);
                setError(err.message || 'Failed to load tours');
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <Layout>
            {/* Hero Section */}
            <div className="bg-gray-900 text-white py-20">
                <Container>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Safari Tours</h1>
                    <p className="text-lg text-gray-300 max-w-2xl">
                        Discover our handpicked collection of unforgettable safari experiences across East Africa.
                    </p>
                </Container>
            </div>

            <Section>
                <Container>
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <aside className="lg:w-1/4">
                            <TourFilter />
                        </aside>

                        {/* Tours Grid */}
                        <div className="lg:w-3/4">


                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                                    <p className="font-bold">Error loading tours</p>
                                    <p className="text-sm">{error}</p>
                                    <p className="text-sm mt-2">Make sure the backend server is running on port 5000</p>
                                </div>
                            )}

                            {!error && tours.length === 0 && (
                                <div className="text-center py-20 bg-gray-50 rounded-lg">
                                    <p className="text-gray-600 text-lg">No tours found.</p>
                                    <p className="text-gray-500 text-sm mt-2">Add tours in Sanity Studio to see them here.</p>
                                </div>
                            )}

                            {!error && tours.length > 0 && (
                                <>
                                    <div className="mb-6">
                                        <p className="text-gray-600">
                                            Showing <span className="font-bold">{tours.length}</span> {tours.length === 1 ? 'tour' : 'tours'}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                                </>
                            )}
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default Tours;
