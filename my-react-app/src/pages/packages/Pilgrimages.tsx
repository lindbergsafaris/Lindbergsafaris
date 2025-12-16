import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { BookOpen, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pilgrimages = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1548625361-188866171542?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
                        Pilgrimages
                    </h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto text-gray-200 mb-8">
                        Journeys of faith, reflection, and spiritual renewal.
                    </p>
                    <Link to="/contact">
                        <Button size="lg" className="bg-accent hover:bg-accent/90 text-white border-none">
                            Plan Your Journey
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
                                Walking in the Footsteps of History
                            </h2>
                            <div className="prose prose-lg text-gray-600 leading-relaxed space-y-6">
                                <p>
                                    A pilgrimage is more than just a trip; it is a spiritual quest, a time for introspection, and an opportunity to connect with one's faith on a deeper level.
                                    Lindberg Safaris organizes specialized pilgrimage tours to some of the most sacred sites in the region and beyond.
                                </p>
                                <p>
                                    Whether you are seeking to visit the historic churches of Ethiopia, the holy sites of Israel, or the shrines of Uganda, we handle all the logistics with sensitivity and care.
                                    Our itineraries are designed to allow ample time for prayer, meditation, and community worship, ensuring a meaningful and transformative experience.
                                </p>
                                <h3 className="text-2xl font-serif font-bold text-gray-800 mt-8 mb-4">The Holy Land Experience</h3>
                                <p>
                                    Walk where Jesus walked. Our tours to Israel and Jordan bring the Bible to life.
                                    Visit Bethlehem, Jerusalem, the Sea of Galilee, and the Dead Sea.
                                    Guided by knowledgeable spiritual leaders and local experts, you will gain new insights into the scriptures and the history of your faith.
                                </p>
                                <div className="grid grid-cols-2 gap-4 my-8">
                                    <img
                                        src="https://res.cloudinary.com/di5ga8z9i/image/upload/v1765899792/Kaaba_in_Makkah___Holy_Kaaba_Sunrise___Hajj_Umrah_Inspiration_b6ta1k.jpg"
                                        alt="Jerusalem"
                                        className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                                    />
                                    <img
                                        src="https://images.unsplash.com/photo-1519817650390-64a93db51149?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Church"
                                        className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-gray-800 mt-8 mb-4">Namugongo Martyrs Shrine</h3>
                                <p>
                                    In Uganda, the Namugongo Martyrs Shrine commemorates the 45 martyrs who were killed for their faith in the late 19th century.
                                    Every year on June 3rd, millions of pilgrims from around the world gather here.
                                    We organize group trips to this significant event, as well as private visits throughout the year.
                                </p>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/3 space-y-8">
                            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                                <h3 className="text-xl font-bold mb-6">Our Services</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Users size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Group Packages</h4>
                                            <p className="text-sm text-gray-600">Join a community of like-minded believers on a shared journey.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <BookOpen size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Spiritual Guidance</h4>
                                            <p className="text-sm text-gray-600">Accompanied by clergy or spiritual directors to lead worship.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Heart size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Comfort & Care</h4>
                                            <p className="text-sm text-gray-600">We take care of all travel arrangements so you can focus on your faith.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="relative rounded-xl overflow-hidden h-64 group cursor-pointer">
                                <img
                                    src="https://res.cloudinary.com/di5ga8z9i/image/upload/v1765899792/16_Inspiring_Landscaping_in_the_Woods_Ideas_tj6eji.jpg"
                                    alt="Lalibela"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <p className="text-sm font-medium mb-1">Discover</p>
                                    <h4 className="text-xl font-bold">Ethiopia's Rock-Hewn Churches</h4>
                                </div>
                            </div>

                            <div className="bg-accent text-white p-8 rounded-xl text-center">
                                <h3 className="text-2xl font-serif font-bold mb-4">A Journey of Faith</h3>
                                <p className="mb-6 text-white/90">Contact us to organize your pilgrimage for yourself or your church group.</p>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-accent">
                                        Contact Us
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

export default Pilgrimages;
