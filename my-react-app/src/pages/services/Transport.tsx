import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Check } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

const Transport = () => {
    const features = [
        "Car Hire",
        "Airport & Railway Transfers",
        "Safari Vehicles",
        "Group Bookings"
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
                    <p className="text-xl font-light tracking-wide">Connecting people, destinations, and unforgettable memories</p>
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
                                    We offer daily and long-term car rentals, airport and railway transfers, and tailor-made safaris, turning every journey into a smooth, safe, and unforgettable experience. With our reliable vehicles and professional drivers, you can relax and enjoy every moment of the ride!
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

                        {/* Car Hire Section */}
                        <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-serif font-bold mb-6 text-primary">Car Hire</h2>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    Take the wheel and explore the city or beyond at your own pace! Our fleet of well-maintained, air-conditioned vehicles, from saloons and sedans to SUVs and luxury models, is designed for comfort, convenience, and style. Whether it's a business trip, a weekend getaway, or a leisurely drive, we make every journey seamless, enjoyable, and memorable.
                                </p>
                            </div>
                            <div className="md:w-1/2">
                                <img
                                    src="https://res.cloudinary.com/dbqdpitah/image/upload/v1770892042/vehicle7_vomea0.jpg"
                                    alt="Lindberg Fleet"
                                    className="w-full h-72 object-cover rounded-lg shadow-xl"
                                />
                            </div>
                        </div>

                        {/* Airport & Railway Transfers Section */}
                        <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                            <h2 className="text-3xl font-serif font-bold mb-6 text-center text-primary">Airport & Railway Transfers</h2>
                            <p className="text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
                                Travel stress-free to your destination with our reliable, air-conditioned vehicles and professional drivers. Whether you're arriving at the airport or the Nairobi railway station, we ensure a smooth, comfortable, and timely transfer. From solo travelers to groups, we make every journey convenient, seamless, and enjoyable.
                            </p>
                        </div>

                        {/* Safari Vehicles Section */}
                        <div className="text-center max-w-5xl mx-auto">
                            <h2 className="text-3xl font-serif font-bold mb-6 text-primary">Safari Vehicles</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Experience the ultimate safari adventure in our rugged, air-conditioned 4x4s and Terran SUVs—built to handle every terrain with ease while keeping you comfortable. From day trips around Nairobi to full safaris in the Masai Mara, Amboseli, and beyond, our vehicles are perfect for families, groups, or solo explorers. Travel safely, explore freely, and make every journey unforgettable.
                            </p>
                        </div>

                        {/* Group Bookings Section */}
                        <div className="bg-primary/5 p-8 rounded-xl border border-primary/10">
                            <h2 className="text-3xl font-serif font-bold mb-6 text-center text-primary">Group Bookings</h2>
                            <p className="text-gray-600 leading-relaxed text-center max-w-3xl mx-auto">
                                Travel together with ease and comfort. We provide spacious, air-conditioned vehicles for group travel, corporate outings, events, tours, and family trips. Our professional drivers and well-maintained fleet ensure safe, coordinated, and stress-free transport for groups of all sizes.
                            </p>
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
