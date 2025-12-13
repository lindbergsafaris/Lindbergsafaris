import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Mountain, Cloud, Thermometer, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const MountainClimbing = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1650630669225-22d733595670?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
                        Mountain Climbing
                    </h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto text-gray-200 mb-8">
                        Conquer the peaks of Africa and stand on top of the world.
                    </p>
                    <Link to="/contact">
                        <Button size="lg" className="bg-accent hover:bg-accent/90 text-white border-none">
                            Start Your Ascent
                        </Button>
                    </Link>
                </Container>
            </div>

            {/* Content Section */}
            <Section className="bg-white py-20">
                <Container>
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Main Article */}
                        <div className="lg:w-2/3">
                            <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900">
                                Reach New Heights
                            </h2>
                            <div className="prose prose-lg text-gray-600 leading-relaxed space-y-6">
                                <p>
                                    For those with an adventurous spirit and a desire to challenge themselves, mountain climbing in East Africa offers some of the most rewarding experiences on the planet.
                                    The region is home to two of the continent's highest peaks: Mount Kilimanjaro and Mount Kenya.
                                </p>
                                <p>
                                    Whether you are a seasoned mountaineer or a first-time trekker, we have a route and an itinerary that suits your skill level.
                                    Our expeditions are led by experienced guides who prioritize safety and success, ensuring that you have the best possible chance of reaching the summit.
                                </p>
                                <h3 className="text-2xl font-serif font-bold text-gray-800 mt-8 mb-4">Mount Kilimanjaro: The Roof of Africa</h3>
                                <p>
                                    Rising majestically from the Tanzanian plains, Mount Kilimanjaro is the highest free-standing mountain in the world.
                                    Climbing "Kili" is a bucket-list achievement for many. We offer treks on various routes, including the scenic Machame Route and the gentler Marangu Route.
                                    Traversing through five distinct climate zones, from rainforest to arctic summit, is an experience you will never forget.
                                </p>
                                <div className="grid grid-cols-2 gap-4 my-8">
                                    <img
                                        src="https://images.unsplash.com/photo-1609198092458-38a293c7ac4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Kilimanjaro"
                                        className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                                    />
                                    <img
                                        src="https://images.unsplash.com/photo-1589553416260-f586c8f1514f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Climbers"
                                        className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-gray-800 mt-8 mb-4">Mount Kenya: The Monarch of Mountains</h3>
                                <p>
                                    Often overshadowed by its taller neighbor, Mount Kenya offers a more technical and rugged climbing experience.
                                    With its jagged peaks, glacial valleys, and unique afro-alpine flora, it is a climber's paradise.
                                    Point Lenana, the third highest peak, is accessible to trekkers, while the twin summits of Batian and Nelion require technical climbing skills.
                                </p>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/3 space-y-8">
                            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                                <h3 className="text-xl font-bold mb-6">Expedition Highlights</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Trophy size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">High Success Rates</h4>
                                            <p className="text-sm text-gray-600">Our carefully planned acclimatization schedules maximize your summit chances.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Mountain size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Expert Porters</h4>
                                            <p className="text-sm text-gray-600">Our dedicated team carries the load, allowing you to focus on the climb.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Cloud size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Quality Gear</h4>
                                            <p className="text-sm text-gray-600">We provide high-quality tents and camping equipment for your comfort.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="relative rounded-xl overflow-hidden h-64 group cursor-pointer">
                                <img
                                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Mountain View"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <p className="text-sm font-medium mb-1">Preparation</p>
                                    <h4 className="text-xl font-bold">Training & Gear Guides</h4>
                                </div>
                            </div>

                            <div className="bg-accent text-white p-8 rounded-xl text-center">
                                <h3 className="text-2xl font-serif font-bold mb-4">Challenge Yourself</h3>
                                <p className="mb-6 text-white/90">Contact us to plan your expedition to the top of Africa.</p>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-accent">
                                        Book Your Climb
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default MountainClimbing;
