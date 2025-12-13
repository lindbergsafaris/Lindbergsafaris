import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { hotels } from '@/data/hotels';
import { Star, MapPin, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HotelBooking = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0 transform scale-105 animate-slow-zoom"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
                </div>
                <Container className="relative z-10 text-center">
                    <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-sm font-medium tracking-widest uppercase mb-6 backdrop-blur-sm">
                        Exclusive Collection
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
                        Sanctuaries of <br />
                        <span className="text-accent italic">Serenity & Style</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto text-gray-200 mb-10">
                        Discover a curated selection of the world's most exquisite hotels, where luxury knows no bounds.
                    </p>
                    <Link to="#collection">
                        <Button size="lg" className="bg-white text-black hover:bg-gray-100 border-none">
                            Explore Collection
                        </Button>
                    </Link>
                </Container>
            </div>

            {/* Intro Section */}
            <Section className="bg-white py-24">
                <Container>
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-gray-900">
                            Redefining the Art of Hospitality
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-12">
                            At Lindberg Safaris, we believe that where you stay is just as important as where you go.
                            Our team has handpicked a collection of properties that offer more than just a place to sleep—they
                            offer an experience. From historic manors to luxury tented camps, each property in our portfolio
                            has been chosen for its unique character, exceptional service, and commitment to excellence.
                        </p>
                        <div className="h-1 w-24 bg-accent mx-auto" />
                    </div>
                </Container>
            </Section>

            {/* Hotel Collection */}
            <div id="collection" className="bg-gray-50">
                {hotels.map((hotel, index) => (
                    <section key={hotel.id} className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <Container>
                            <div className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                                {/* Image Side */}
                                <div className="w-full lg:w-1/2">
                                    <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
                                        <img
                                            src={hotel.image}
                                            alt={hotel.name}
                                            className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md py-2 px-4 rounded-full shadow-sm flex items-center gap-2">
                                            <div className="flex gap-0.5 text-accent">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={14} fill="currentColor" />
                                                ))}
                                            </div>
                                            <span className="text-xs font-bold tracking-wide text-gray-900">PREMIUM</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="w-full lg:w-1/2 space-y-8">
                                    <div>
                                        <div className="flex items-center gap-2 text-accent font-medium mb-3">
                                            <MapPin size={18} />
                                            <span className="uppercase tracking-wider text-sm">{hotel.location}</span>
                                        </div>
                                        <h3 className="text-4xl font-serif font-bold text-gray-900 mb-6">
                                            {hotel.name}
                                        </h3>
                                        <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                                            {hotel.description.split('\n\n').map((paragraph, idx) => (
                                                <p key={idx}>{paragraph}</p>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {hotel.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-gray-700">
                                                <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                                    <Check size={14} className="text-accent" />
                                                </div>
                                                <span className="text-sm font-medium">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 flex items-center gap-4">
                                        <Link to="/contact">
                                            <Button size="lg" className="group">
                                                Book Your Stay
                                                <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
                                            </Button>
                                        </Link>
                                        <span className="text-gray-500 text-sm">
                                            Starting from <span className="text-gray-900 font-bold text-lg">{hotel.priceRange}</span> / night
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </section>
                ))}
            </div>

            {/* CTA Section */}
            <Section className="bg-gray-900 text-white py-24">
                <Container className="text-center">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                        Ready to Experience the Extraordinary?
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Contact our travel specialists today to start planning your dream getaway to one of these exclusive properties.
                    </p>
                    <Link to="/contact">
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
                            Contact Us Now
                        </Button>
                    </Link>
                </Container>
            </Section>
        </Layout>
    );
};

export default HotelBooking;
