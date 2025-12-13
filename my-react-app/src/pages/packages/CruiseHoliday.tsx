import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Anchor, Sun, Wine, Ship } from 'lucide-react';
import { Link } from 'react-router-dom';

const CruiseHoliday = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2064&q=80")' }}
                >
                    <div className="absolute inset-0 bg-black/30" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
                        Cruise Holidays
                    </h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto text-gray-200 mb-8">
                        Set sail on a journey of luxury, relaxation, and discovery.
                    </p>
                    <Link to="/contact">
                        <Button size="lg" className="bg-accent hover:bg-accent/90 text-white border-none">
                            Find Your Cruise
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
                                Ocean Escapes & Coastal Charms
                            </h2>
                            <div className="prose prose-lg text-gray-600 leading-relaxed space-y-6">
                                <p>
                                    There is something undeniably magical about being on the water. The gentle rhythm of the waves, the endless horizon, and the salty sea breeze create a sense of peace and freedom that is hard to find elsewhere.
                                    Our cruise packages are designed to let you experience the beauty of the coastline from a unique perspective.
                                </p>
                                <p>
                                    From traditional Dhow safaris along the Swahili coast to luxury ocean liners exploring the Indian Ocean islands, we offer a variety of cruising experiences.
                                    Whether you are looking for a romantic sunset dinner cruise or a multi-day island-hopping adventure, we can arrange the perfect voyage for you.
                                </p>
                                <h3 className="text-2xl font-serif font-bold text-gray-800 mt-8 mb-4">Dhow Safaris: A Timeless Tradition</h3>
                                <p>
                                    Step back in time and board a traditional wooden dhow, the sailing vessels that have plied these waters for centuries.
                                    Explore the mangrove forests of Lamu, snorkel in the pristine waters of the Kisite-Mpunguti Marine Park, or enjoy a seafood feast on a sandbank in Zanzibar.
                                    A dhow safari is an authentic and intimate way to connect with the culture and history of the East African coast.
                                </p>
                                <div className="grid grid-cols-2 gap-4 my-8">
                                    <img
                                        src="https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Dhow Boat"
                                        className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                                    />
                                    <img
                                        src="https://images.unsplash.com/photo-1505881402582-c5bc11054f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Luxury Cruise"
                                        className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-gray-800 mt-8 mb-4">Luxury Yacht Charters</h3>
                                <p>
                                    For the ultimate in privacy and exclusivity, consider chartering a private yacht.
                                    With a dedicated crew to cater to your every whim, you can explore hidden coves, swim in secluded bays, and anchor wherever you please.
                                    It is the perfect option for families, groups of friends, or couples seeking a truly bespoke holiday experience.
                                </p>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/3 space-y-8">
                            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                                <h3 className="text-xl font-bold mb-6">Onboard Experience</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Wine size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Gourmet Dining</h4>
                                            <p className="text-sm text-gray-600">Savor fresh seafood and international cuisine prepared by expert chefs.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Sun size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Sunset Views</h4>
                                            <p className="text-sm text-gray-600">Witness breathtaking sunsets over the ocean from the deck of your ship.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Anchor size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Island Hopping</h4>
                                            <p className="text-sm text-gray-600">Visit multiple destinations without the hassle of packing and unpacking.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="relative rounded-xl overflow-hidden h-64 group cursor-pointer">
                                <img
                                    src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Tropical Beach"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <p className="text-sm font-medium mb-1">Destinations</p>
                                    <h4 className="text-xl font-bold">Zanzibar, Lamu & Beyond</h4>
                                </div>
                            </div>

                            <div className="bg-accent text-white p-8 rounded-xl text-center">
                                <h3 className="text-2xl font-serif font-bold mb-4">Set Sail With Us</h3>
                                <p className="mb-6 text-white/90">Book your cruise holiday today and let the ocean be your guide.</p>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-accent">
                                        Inquire Now
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

export default CruiseHoliday;
