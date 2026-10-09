import useSWR from 'swr';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import DestinationCard from '@/components/destinations/DestinationCard';
import RegionNavigator from '@/components/destinations/RegionNavigator';
import LoadingScreen from '@/components/ui/LoadingScreen';
import SEO from '@/components/SEO';
import api from '@/lib/api';

const RegionDestinations = () => {
    const { region } = useParams<{ region: string }>();

    const { data: categoryData, error: categoryError } = useSWR(
        region ? `region-category-${region}` : null,
        () => api.destinationCategory.getBySlug(region!)
    );

    const { data: postsData } = useSWR(
        region ? `region-posts-${region}` : null,
        () => api.destinationPost.getByCategory(region!)
    );

    const category = categoryData?.data;
    const posts = postsData?.data || [];
    const loading = !categoryData && !categoryError;

    if (loading) {
        return <LoadingScreen />;
    }

    const fallbackCategoryName = region ? region.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Region';
    const activeCategory = category || {
        name: fallbackCategoryName,
        description: `Explore top safari destinations and tour packages in ${fallbackCategoryName}.`,
        image: { url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80' }
    };

    return (
        <Layout>
            <SEO
                title={`${activeCategory.name} Safaris & Tour Destinations`}
                description={activeCategory.description || `Discover top safari destinations and game reserves in ${activeCategory.name} with Lindberg Safaris.`}
                image={activeCategory.image?.url}
            />
            <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: `url("${activeCategory.image?.url || 'https://images.unsplash.com/photo-1516426122078-c23e76319801'}")` }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{activeCategory.name}</h1>
                    <p className="text-xl font-light tracking-wide">{activeCategory.description}</p>
                </Container>
            </div>

            <Section className="bg-primary pt-8 pb-4">
                <Container>
                    <RegionNavigator currentRegion={region} />
                </Container>
            </Section>

            <Section className="bg-primary pt-4">
                <Container>
                    <div className="flex flex-wrap gap-8">
                        {posts.map((post: any) => (
                            <div key={post._id} className="flex-grow basis-full md:basis-[calc(50%-2rem)] lg:basis-[calc(25%-2rem)] max-w-full">
                                <DestinationCard
                                    id={post.slug} // Using slug as ID for navigation
                                    name={post.title}
                                    image={post.image?.url || ''}
                                    tourCount={post.tourCount || 0}
                                />
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default RegionDestinations;
