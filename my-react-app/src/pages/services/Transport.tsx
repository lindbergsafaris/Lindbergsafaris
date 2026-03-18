import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Check } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

const Transport = () => {
    const features = [
        "Modern fleet of 4x4 Land Cruisers",
        "Professional, experienced drivers",
        "Airport transfers (JKIA & Wilson)",
        "Private hire for safaris",
        "Corporate transport solutions"
    ];

    return (
        <Layout>
            <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://res.cloudinary.com/dbqdpitah/image/upload/v1770892041/Vehicle_khehig.jpg")' }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Transport Services</h1>
                    <p className="text-xl font-light tracking-wide">Reliable. Comfortable. Safe.</p>
                </Container>
            </div>

            <Section>
                <Container>
                    <div className="flex flex-col gap-10">
                        {/* Intro Section */}
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-serif font-bold mb-6 text-primary">Travel in Comfort & Style</h2>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    At Lindberg Safaris, we understand that the journey is just as important as the destination.
                                    That's why we maintain a fleet of modern, well-maintained vehicles designed for the rugged African terrain
                                    without compromising on comfort.
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
                                <a
                                    href={getWhatsAppLink("Hello! I'm interested in a transport service quote.")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button size="lg">Request a Quote</Button>
                                </a>
                            </div>
                            <div className="md:w-1/2">
                                <img
                                    src="https://res.cloudinary.com/dbqdpitah/image/upload/v1770892041/vehicle5_vy2gbe.jpg"
                                    alt="Safari Vehicle"
                                    className="w-full h-72 object-cover rounded-lg shadow-xl"
                                />
                            </div>
                        </div>

                        {/* Our Fleet Section */}
                        <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-serif font-bold mb-6 text-primary">Our Fleet</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    We take pride in our diverse fleet of vehicles, catering to different group sizes and travel preferences.
                                </p>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">4x4 Land Cruisers</h3>
                                        <p className="text-gray-600">The ultimate safari vehicle. Features include pop-up roofs for 360-degree game viewing, large windows, fridge for cold drinks, and charging ports.</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">Safari Vans</h3>
                                        <p className="text-gray-600">Perfect for budget-conscious travelers and smaller groups. These 4x4 minivans also feature pop-up roofs and are capable of handling most park terrains.</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">Executive Transfer Vehicles</h3>
                                        <p className="text-gray-600">Luxury sedans and SUVs for airport transfers and city travel, ensuring you arrive at your meetings or hotel in style.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <img
                                    src="https://res.cloudinary.com/dbqdpitah/image/upload/v1770892042/vehicle7_vomea0.jpg"
                                    alt="Lindberg Fleet"
                                    className="w-full h-72 object-cover rounded-lg shadow-xl"
                                />
                            </div>
                        </div>

                        {/* Airport Transfers Section */}
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                            <h2 className="text-3xl font-serif font-bold mb-6 text-center text-primary">Airport Transfers</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="font-bold text-xl mb-3">JKIA & Wilson Airport</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        We offer 24/7 airport transfer services to and from Jomo Kenyatta International Airport (JKIA) and Wilson Airport.
                                        Our drivers track your flight status to ensure they are there when you land, regardless of delays.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl mb-3">Meet & Greet</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Upon arrival, you will be welcomed by our professional staff holding a sign with your name.
                                        We assist with luggage and ensure a smooth transition to your hotel or next destination.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Safety Section */}
                        <div className="text-center max-w-3xl mx-auto mb-12">
                            <h2 className="text-3xl font-serif font-bold mb-6 text-primary">Safety & Maintenance</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Your safety is non-negotiable. All our vehicles undergo rigorous servicing before every single trip.
                                They are equipped with:
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                {['First Aid Kits', 'Fire Extinguishers', 'Spare Tyres', 'Radio Calls/Phones', 'GPS Tracking'].map((item) => (
                                    <span key={item} className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Fleet Gallery Showcase */}
                        <div className="border-t border-gray-100 pt-12">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Our Fleet Showcase</h2>
                                <p className="text-gray-600">Explore the vehicles that drive your adventures across East Africa</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    "https://res.cloudinary.com/dbqdpitah/image/upload/v1773828030/car3_ww1lxp.jpg",
                                    "https://res.cloudinary.com/dbqdpitah/image/upload/v1773828034/car8_rhpsug.jpg",
                                    "https://res.cloudinary.com/dbqdpitah/image/upload/v1773828031/car4_sncpif.jpg",
                                    "https://res.cloudinary.com/dbqdpitah/image/upload/v1773828037/car6_g7u49u.jpg",
                                    "https://res.cloudinary.com/dbqdpitah/image/upload/v1773828034/car7_qh5i8l.jpg",
                                    "https://res.cloudinary.com/dbqdpitah/image/upload/v1773828044/car2_vzh6vs.jpg",
                                    "https://res.cloudinary.com/dbqdpitah/image/upload/v1773828040/Car1_e0z8yq.jpg",
                                    "https://res.cloudinary.com/dbqdpitah/image/upload/v1773828041/car5_drfmr6.jpg"
                                ].map((img, index) => (
                                    <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 group">
                                        <img
                                            src={img}
                                            alt={`Lindberg Fleet ${index + 1}`}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default Transport;
