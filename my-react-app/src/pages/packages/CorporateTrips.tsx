import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Briefcase, Users, Award, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

const CorporateTrips = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2032&q=80")' }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
                        Educational & Corporate Trips
                    </h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto text-gray-200 mb-8">
                        Inspire your team, reward success, and broaden horizons.
                    </p>
                    <Link to="/contact">
                        <Button size="lg" className="bg-accent hover:bg-accent/90 text-white border-none">
                            Plan Your Event
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
                                Business Beyond the Boardroom
                            </h2>
                            <div className="prose prose-lg text-gray-600 leading-relaxed space-y-6">
                                <p>
                                    In today's fast-paced business world, taking time to connect, recharge, and learn outside the office is essential.
                                    Lindberg Safaris specializes in organizing corporate retreats, team-building excursions, and educational trips that deliver real value.
                                </p>
                                <p>
                                    We understand that every organization has unique goals. Whether you want to foster better communication among your staff, reward top performers with a luxury incentive trip, or organize a conference in a stunning location, we tailor our services to meet your specific needs.
                                </p>
                                <h3 className="text-2xl font-serif font-bold text-gray-800 mt-8 mb-4">Team Building in the Wild</h3>
                                <p>
                                    Swap the fluorescent lights for the African sun. Our team-building programs are designed to challenge and unite your team.
                                    From bush survival skills and orienteering challenges to collaborative conservation projects, we create shared experiences that build trust and camaraderie.
                                </p>
                                <div className="grid grid-cols-2 gap-4 my-8">
                                    <img
                                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Team Meeting"
                                        className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                                    />
                                    <img
                                        src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Conference"
                                        className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-gray-800 mt-8 mb-4">Educational Tours</h3>
                                <p>
                                    For schools and universities, we offer educational tours that bring the classroom to life.
                                    Students can learn about biology, geography, history, and culture firsthand.
                                    Our itineraries are safe, supervised, and packed with learning opportunities, from visiting historical sites to engaging with local communities.
                                </p>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/3 space-y-8">
                            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                                <h3 className="text-xl font-bold mb-6">Why Partner With Us?</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Briefcase size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Seamless Logistics</h4>
                                            <p className="text-sm text-gray-600">We handle flights, transfers, accommodation, and conference facilities.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Award size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Incentive Travel</h4>
                                            <p className="text-sm text-gray-600">Create unforgettable rewards for your top achievers.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Coffee size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Productive Environment</h4>
                                            <p className="text-sm text-gray-600">Venues that inspire creativity and focus.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="relative rounded-xl overflow-hidden h-64 group cursor-pointer">
                                <img
                                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Meeting"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <p className="text-sm font-medium mb-1">Facilities</p>
                                    <h4 className="text-xl font-bold">World-Class Venues</h4>
                                </div>
                            </div>

                            <div className="bg-accent text-white p-8 rounded-xl text-center">
                                <h3 className="text-2xl font-serif font-bold mb-4">Elevate Your Business</h3>
                                <p className="mb-6 text-white/90">Contact our corporate travel specialists to discuss your requirements.</p>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-accent">
                                        Request Proposal
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

export default CorporateTrips;
