import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import DestinationCard from '@/components/destinations/DestinationCard';

import { regionData } from '@/data/destinations';
import { SubDestination } from '@/types';

const RegionDestinations = () => {
    const { region } = useParams<{ region: string }>();
    const data = regionData[region || ''] || null;

    if (!data) {
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
                    style={{ backgroundImage: `url("${data.image}")` }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">{data.title}</h1>
                    <p className="text-xl font-light tracking-wide">{data.description}</p>
                </Container>
            </div>

            <Section className="bg-primary">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data.subDestinations.map((dest: SubDestination) => (
                            <DestinationCard
                                key={dest.id}
                                id={dest.id} // Note: This ID should ideally map to a real destination ID in Sanity if we want the detail page to work dynamically.
                                name={dest.name}
                                image={dest.image}
                                tourCount={dest.tourCount}
                            />
                        ))}
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default RegionDestinations;
