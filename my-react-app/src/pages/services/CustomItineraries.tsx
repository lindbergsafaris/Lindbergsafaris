import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Check, Map, Compass, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomItineraries = () => {
    const features = [
        "Personalized consultation to understand your preferences",
        "Tailor-made routes and schedules",
        "Exclusive access to private reserves and experiences",
        "Flexible pacing and activity choices",
        "24/7 support during your trip"
    ];

    return (
        <Layout>
            <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Custom Itineraries</h1>
                    <p className="text-xl font-light tracking-wide">Your Journey. Your Way.</p>
                </Container>
            </div>

            <Section>
                <Container>
                    <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
                        <div className="md:w-1/2">
                            <h2 className="text-3xl font-serif font-bold mb-6">Designed Around You</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                No two travelers are alike, and neither should their journeys be. Whether you dream of tracking
                                gorillas in Rwanda, witnessing the Great Migration, or relaxing on a private island, we craft
                                itineraries that reflect your unique style, interests, and budget.
                            </p>
                            <ul className="space-y-3 mb-8">
                                {features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-3 text-gray-700">
                                        <div className="bg-primary/10 p-1 rounded-full text-primary">
                                            <Check size={16} />
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/contact">
                                <Button size="lg">Plan My Trip</Button>
                            </Link>
                        </div>
                        <div className="md:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Map Planning"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Compass size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Expert Advice</h3>
                            <p className="text-gray-600">Leverage our deep local knowledge to discover hidden gems and avoid tourist traps.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Map size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Flexible Routing</h3>
                            <p className="text-gray-600">Combine multiple destinations and experiences seamlessly into one cohesive journey.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Unforgettable Memories</h3>
                            <p className="text-gray-600">Create moments that matter with experiences curated specifically for you.</p>
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default CustomItineraries;
