import useSWR from 'swr';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import DestinationCard from '@/components/destinations/DestinationCard';
import api from '@/lib/api';
import { Destination } from '@/types';

const Destinations = () => {


    const { data: destinationsData, error: destinationsError } = useSWR<{ data: Destination[] }>('destinations', () => api.destinations.getAll());
    const destinations = destinationsData?.data || [];
    const loading = !destinationsData && !destinationsError;
    const error = destinationsError ? (destinationsError as Error).message || 'Failed to load destinations' : null;

    return (
        <Layout>
            <div className="bg-primary text-white py-20">
                <Container>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Destinations</h1>
                    <p className="text-lg text-gray-100 max-w-2xl">
                        Discover the most breathtaking locations across East Africa.
                    </p>
                </Container>
            </div>

            <Section className="bg-primary">
                <Container>
                    {loading && (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p className="mt-4 text-gray-600">Loading destinations...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                            <p className="font-bold">Error loading destinations</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {!loading && !error && destinations.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-lg">
                            <p className="text-gray-600 text-lg">No destinations found.</p>
                            <p className="text-gray-500 text-sm mt-2">Add destinations in Sanity Studio.</p>
                        </div>
                    )}

                    {!loading && !error && destinations.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {destinations.map((dest) => (
                                <DestinationCard
                                    key={dest._id}
                                    id={dest._id}
                                    name={dest.name}
                                    image={dest.cardImage?.url || dest.heroImage?.url || 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                    tourCount={dest.tourCount || 0}
                                />
                            ))}
                        </div>
                    )}
                </Container>
            </Section>
        </Layout>
    );
};

export default Destinations;
