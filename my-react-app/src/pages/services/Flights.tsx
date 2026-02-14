import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Check } from 'lucide-react';

const Flights = () => {
    const partnerLogos = [
        "https://res.cloudinary.com/dbqdpitah/image/upload/v1771066708/ticket-9_bohmmc.png",
        "https://res.cloudinary.com/dbqdpitah/image/upload/v1771066708/ticket-8_vowihp.png",
        "https://res.cloudinary.com/dbqdpitah/image/upload/v1771066708/ticket-7_lpuiux.png",
        "https://res.cloudinary.com/dbqdpitah/image/upload/v1771066709/ticket-10_rrpvle.png",
        "https://res.cloudinary.com/dbqdpitah/image/upload/v1771066708/ticket-2_xs5rtj.png",
        "https://res.cloudinary.com/dbqdpitah/image/upload/v1771066707/ticket-1_yoeazb.png",
        "https://res.cloudinary.com/dbqdpitah/image/upload/v1771066708/ticket-4_qz926o.png",
        "https://res.cloudinary.com/dbqdpitah/image/upload/v1771066708/ticket-3_qlpo02.png",
        "https://res.cloudinary.com/dbqdpitah/image/upload/v1771066707/ticket-6_ryuplv.png",
        "https://res.cloudinary.com/dbqdpitah/image/upload/v1771066707/ticket-5_xt3c9n.png"
    ];

    return (
        <Layout>
            <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80")' }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Ticketing Services</h1>
                    <p className="text-xl font-light tracking-wide">Seamless Travel Solutions Across Air, Sea, and Land</p>
                </Container>
            </div>

            {/* Main Services Overview */}
            <Section>
                <Container>
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/2 order-2 md:order-1">
                            <img
                                src="https://res.cloudinary.com/dbqdpitah/image/upload/v1770892892/Boeing_787-8_Dreamliner_Kenya_Airways_5Y-KZA_Large_rqu4mz.jpg"
                                alt="Travel Booking"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                        <div className="md:w-1/2 order-1 md:order-2">
                            <h2 className="text-3xl font-serif font-bold mb-6">Experience hassle-free travel</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Experience hassle-free travel with our all-in-one ticketing services. Whether flying across continents, cruising the seas, or exploring scenic routes by train, bus, or ferry, every journey is made simple, affordable, and personalized. Our team ensures smooth bookings, flexible options, and reliable support from start to finish.
                            </p>
                            <Button size="lg">Request a Quote</Button>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* Service Types Grid */}
            <Section className="bg-gray-50">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">What We Offer</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Comprehensive solutions for every travel mode
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Air Ticketing */}
                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                                <img src="https://res.cloudinary.com/dbqdpitah/image/upload/v1771067327/ticket-11_l9gexs.png" alt="Air Ticketing" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Air Ticketing</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Access domestic and international flights with top airlines. Enjoy competitive fares, flexible travel classes, and instant confirmations for stress-free journeys.
                            </p>
                        </div>

                        {/* Cruise Ticketing */}
                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                                <img src="https://res.cloudinary.com/dbqdpitah/image/upload/v1771067327/ticket-12_vbwndm.png" alt="Cruise Ticketing" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Cruise Ticketing</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Sail in comfort with global cruise routes, luxury or budget options, and all-inclusive packages covering meals, entertainment, and excursions.
                            </p>
                        </div>

                        {/* Train Ticketing */}
                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                                <img src="https://res.cloudinary.com/dbqdpitah/image/upload/v1771067331/ticket-13_mtta1x.png" alt="Train Ticketing" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Train Ticketing</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Discover scenic routes with flexible schedules, affordable fares, and comfortable travel classes for both short and long-distance trips.
                            </p>
                        </div>

                        {/* Bus & Ferry Ticketing */}
                        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                                <img src="https://res.cloudinary.com/dbqdpitah/image/upload/v1771067324/ticket-14_v3zdao.png" alt="Bus & Ferry Ticketing" className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Bus & Ferry Ticketing</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Connect to cities, towns, and coastal destinations with reliable operators, flexible timings, and comfortable travel options.
                            </p>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* Why Book With Us */}
            <Section>
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-serif font-bold mb-4">Why Book With Us</h2>
                            <p className="text-gray-600">Experience the difference of a personalized travel service</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary mt-1">
                                    <Check size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Global Reach</h4>
                                    <p className="text-gray-600 text-sm">Partnerships with leading airlines, cruise lines, and transport networks worldwide.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary mt-1">
                                    <Check size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Competitive Pricing</h4>
                                    <p className="text-gray-600 text-sm">Exclusive deals and discounts across all travel modes.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary mt-1">
                                    <Check size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">24/7 Support</h4>
                                    <p className="text-gray-600 text-sm">Dedicated assistance for bookings, changes, or cancellations anytime.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary mt-1">
                                    <Check size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Flexible Options</h4>
                                    <p className="text-gray-600 text-sm">Economy to luxury choices tailored to every traveler's comfort and budget.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary mt-1">
                                    <Check size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Personalized Service</h4>
                                    <p className="text-gray-600 text-sm">Every ticket is handled with care to ensure a smooth, enjoyable journey.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* Partner Logos */}
            <Section className="bg-gray-50 border-t border-gray-100">
                <Container>
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-serif font-bold text-gray-800">Our Trusted Partners</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity duration-500">
                        {partnerLogos.map((logo, index) => (
                            <div key={index} className="w-full flex justify-center">
                                <img
                                    src={logo}
                                    alt={`Partner Logo ${index + 1}`}
                                    className="max-h-12 w-auto object-contain transition-transform hover:scale-110 duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* Closing CTA */}
            <Section>
                <Container className="text-center">
                    <div className="max-w-3xl mx-auto bg-primary/5 rounded-2xl p-10 md:p-16 border border-primary/10">
                        <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900">Your Journey, Our Priority</h2>
                        <p className="text-gray-700 leading-relaxed mb-8 text-lg">
                            At Lindberg holiday, every ticket booked is more than a reservation — it's the beginning of a seamless travel experience. Whether by air, sea, rail, or road, we make sure your journey is effortless, comfortable, and unforgettable.
                        </p>
                        <Button size="lg" className="px-10">Contact Us for Bookings</Button>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default Flights;
