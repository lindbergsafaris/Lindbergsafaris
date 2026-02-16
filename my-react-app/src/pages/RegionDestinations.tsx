import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import DestinationCard from '@/components/destinations/DestinationCard';
import RegionNavigator from '@/components/destinations/RegionNavigator';
import LoadingScreen from '@/components/ui/LoadingScreen';
import api from '@/lib/api';

const RegionDestinations = () => {
    const { region } = useParams<{ region: string }>();
    const [category, setCategory] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!region) return;
            setLoading(true);
            try {
                // Fetch Category Details
                const categoryRes = await api.destinationCategory.getBySlug(region);
                setCategory(categoryRes.data);

                // Fetch Posts for this Category
                if (categoryRes.data) {
                    const postsRes = await api.destinationPost.getByCategory(region);
                    setPosts(postsRes.data || []);
                }
            } catch (error) {
                console.error('Error fetching region data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [region]);

    if (loading) {
        return <LoadingScreen />;
    }

    if (!category) {
        return (
            <Layout>
                <Container>
                    <div className="py-20 text-center">
                        <h1 className="text-3xl font-bold mb-4">Region Not Found</h1>
                        <p>The region you are looking for does not exist.</p>
                    </div>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: `url("${category.image.url}")` }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{category.name}</h1>
                    <p className="text-xl font-light tracking-wide">{category.description}</p>
                </Container>
            </div>

            <Section className="bg-primary pt-8 pb-4">
                <Container>
                    <RegionNavigator currentRegion={region} />
                </Container>
            </Section>

            <Section className="bg-primary pt-4">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <DestinationCard
                                key={post._id}
                                id={post.slug} // Using slug as ID for navigation
                                name={post.title}
                                image={post.image.url}
                                tourCount={post.tourCount || 0}
                            />
                        ))}
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default RegionDestinations;
