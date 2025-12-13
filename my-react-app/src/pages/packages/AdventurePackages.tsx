import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Zap, Wind, Waves, Bike } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdventurePackages = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
                        Adventure Packages
                    </h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto text-gray-200 mb-8">
                        Get your adrenaline pumping with our high-octane experiences.
                    </p>
                    <Link to="/contact">
                        <Button size="lg" className="bg-accent hover:bg-accent/90 text-white border-none">
                            Choose Your Adventure
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
                                Thrills Beyond the Game Drive
                            </h2>
                            <div className="prose prose-lg text-gray-600 leading-relaxed space-y-6">
                                <p>
                                    East Africa is known for its wildlife, but it is also a playground for adrenaline junkies.
                                    If you are looking to add a dash of excitement to your holiday, our adventure packages are just what you need.
                                    From the rushing waters of the Nile to the skies above Diani Beach, there is no shortage of heart-pounding activities to choose from.
                                </p>
                                <p>
                                    We partner with certified and experienced operators to ensure that your safety is never compromised while you push your limits.
                                    Whether you want to leap off a bridge, raft down class V rapids, or kitesurf on pristine waters, we can make it happen.
                                </p>
                                <h3 className="text-2xl font-serif font-bold text-gray-800 mt-8 mb-4">White Water Rafting</h3>
                                <p>
                                    The Tana River in Kenya and the Nile River in Uganda offer some of the best white water rafting in the world.
                                    Navigate through tumultuous rapids, paddle through calm stretches, and enjoy the stunning river scenery.
                                    It is an exhilarating team activity that will leave you soaked and smiling.
                                </p>
                                <div className="grid grid-cols-2 gap-4 my-8">
                                    <img
                                        src="https://images.unsplash.com/photo-1530866495561-507c9faab2ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Rafting"
                                        className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                                    />
                                    <img
                                        src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Surfing"
                                        className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-gray-800 mt-8 mb-4">Skydiving & Bungee Jumping</h3>
                                <p>
                                    For the ultimate rush, take to the skies. Skydiving over the Kenyan coast offers breathtaking views of the turquoise ocean and white sandy beaches.
                                    Or, test your nerve with a bungee jump over the Nile in Jinja. These are experiences that will stay with you for a lifetime.
                                </p>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/3 space-y-8">
                            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                                <h3 className="text-xl font-bold mb-6">Activities Available</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Waves size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Water Sports</h4>
                                            <p className="text-sm text-gray-600">Kitesurfing, windsurfing, jet skiing, and deep-sea fishing.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Wind size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Air Adventures</h4>
                                            <p className="text-sm text-gray-600">Skydiving, paragliding, and hot air balloon safaris.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Bike size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Land Action</h4>
                                            <p className="text-sm text-gray-600">Quad biking, mountain biking, and rock climbing.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="relative rounded-xl overflow-hidden h-64 group cursor-pointer">
                                <img
                                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Diving"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <p className="text-sm font-medium mb-1">Explore</p>
                                    <h4 className="text-xl font-bold">Scuba Diving & Snorkeling</h4>
                                </div>
                            </div>

                            <div className="bg-accent text-white p-8 rounded-xl text-center">
                                <h3 className="text-2xl font-serif font-bold mb-4">Live on the Edge</h3>
                                <p className="mb-6 text-white/90">Contact us to book your next adrenaline-filled adventure.</p>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-accent">
                                        Get Started
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

export default AdventurePackages;
