import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

const collections = [
    {
        title: "Safari Lodges & Camps",
        description: "Immersive Nature, Refined Comfort. Experience the wild without sacrificing luxury. We specialize in booking lodges and camps that place you at the heart of nature—where you can wake up to the sights and sounds of the world's most breathtaking landscapes and sleep under vast, star-filled skies.",
        image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1771068856/Hotel-1_mnwc2j.png"
    },
    {
        title: "Beach Resorts",
        description: "Coastal Luxury, Tailored to You. From the turquoise waters of the Diani to the vibrant shores of the Maldives, we find the perfect coastal retreat. Whether you seek total seclusion or an active resort with world-class water sports, our engines scan the globe for your perfect match.",
        image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1771068787/Hotel-2_gy0n7i.jpg"
    },
    {
        title: "City Hotels",
        description: "The Pulse of the World’s Greatest Cities. Stay where the action is. Our urban collection puts you minutes away from culture, cuisine, and commerce. Perfect for business travelers or city-breakers, we secure stays that balance high-speed connectivity with ultimate comfort.",
        image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1771068788/Hotel-3_myb5d9.jpg"
    },
    {
        title: "The Luxury Collection",
        description: "Exclusivity without boundaries. For the discerning traveler, we offer access to the world’s most prestigious addresses. Our luxury portfolio features private villas, high-end safari estates, and sophisticated suites where intuitive service and refined design are the standard.",
        image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1771068787/Hotel-4_z69vaj.jpg"
    },
    {
        title: "Family-Friendly Stays",
        description: "Effortless travel for the whole family. We make traveling with loved ones easy. Our family-friendly selection focuses on properties that offer space, safety, and fun, ensuring a smooth experience for parents and unforgettable memories for children.",
        image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1771068787/Hotel-5_lbxo84.jpg"
    },
    {
        title: "Private Residences & Apartments",
        description: "For travelers who value privacy, space, and independence. We offer a curated selection of luxury villas, serviced apartments, and private holiday homes—ideal for families, groups, or long-term stays.",
        image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1771068787/Hotel-6_xqxdfg.jpg"
    },
    {
        title: "Staycations",
        description: "The Art of the Local Escape. You don’t have to travel far to feel a world away. Our staycation collection features handpicked gems in your own backyard—perfect for weekend resets, anniversaries, or a quick change of scenery without the airport stress.",
        image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1771068840/Hotel-7_cdtatj.png"
    }
];

const HotelBooking = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative h-[70vh] min-h-[600px] flex items-center justify-center text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' }}
                >
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <Container className="relative z-10 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
                        Find Your Perfect Stay, <br />
                        <span className="text-primary italic">anywhere in the World</span>
                    </h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide mb-10 text-gray-100">
                        Global access. Local expertise. Unbeatable rates. From secluded safari hideaways to the glittering skylines of Dubai, we leverage world-class booking technology to secure your ideal accommodation at the best possible price.
                    </p>
                    <a
                        href={getWhatsAppLink("Hello! I'm interested in booking a hotel stay with Lindberg Safaris. Could you please help me find the perfect accommodation?")}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button size="lg" className="px-10 rounded-full">
                            Book Your Stay Now
                        </Button>
                    </a>
                </Container>
            </div>

            {/* Sub-Headline Section */}
            <Section className="bg-white">
                <Container>
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-gray-900">
                            Your Global Home Away from Home
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed mb-6">
                            At Lindberg Holidays and Safaris, we believe your stay should be as extraordinary as your destination. By integrating with leading global booking engines, we provide real-time access to thousands of properties across every continent.
                        </p>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Whether you’re looking for a boutique sanctuary by the Pyramids of Giza, a luxury wildlife lodge in a world-renowned reserve, or a five-star resort on Palm Jumeirah, our platform ensures you get the most competitive rates and seamless reservations.
                        </p>
                    </div>
                </Container>
            </Section>

            {/* Explore Our Collections */}
            <Section className="bg-gray-50">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif font-bold mb-4">Explore Our Collections</h2>
                        <div className="h-1 w-20 bg-primary mx-auto" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {collections.map((collection, index) => (
                            <div
                                key={index}
                                className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col ${index === 6 ? 'lg:col-start-2' : ''}`}
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={collection.image}
                                        alt={collection.title}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary tracking-widest uppercase">
                                        Collection
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">
                                        {collection.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                                        {collection.description}
                                    </p>
                                    <a
                                        href={getWhatsAppLink(`Hello! I'm interested in inquiring about the "${collection.title}" collection. Could you provide more details?`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-primary font-bold hover:gap-2 transition-all"
                                    >
                                        Enquire Now <ArrowRight size={18} className="ml-1" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* CTA Section */}
            <Section className="bg-primary text-white">
                <Container className="text-center">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
                        Ready for Your Next Escape?
                    </h2>
                    <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                        Let us handle the details while you look forward to the journey. Contact our experts for personalized hotel recommendations and booking assistance.
                    </p>
                    <a
                        href={getWhatsAppLink("Hello! I'm ready for my next escape and would like to get a personal quote for a hotel booking.")}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-10 rounded-full transition-all">
                            Get a Personal Quote
                        </Button>
                    </a>
                </Container>
            </Section>
        </Layout>
    );
};

export default HotelBooking;
