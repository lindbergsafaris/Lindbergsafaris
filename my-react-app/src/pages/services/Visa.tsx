import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Check, ArrowRight } from 'lucide-react';
import { getWhatsAppLink } from '@/lib/utils';

const visaTypes = [
    { name: "Schengen Visas", image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1771070434/visa-application1_kwg8pk.jpg" },
    { name: "US Visas", image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1771070435/visa-application2_nnkj1a.jpg" },
    { name: "UK Visas", image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1771070433/visa-application3_cj3sdf.jpg" },
    { name: "Australia Visas", image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1771070440/visa-application4_g2zxj7.png" },
    { name: "New Zealand Visas", image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1771070433/visa-application5_x3j0a1.jpg" },
    { name: "Indonesia e-Visa", image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1771070433/visa-application7_qqm5c1.jpg" },
    { name: "Qatar e-Visa", image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1771070434/visa-application8_ts1zcy.jpg" },
    { name: "Dubai Visa", image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1771070434/visa-application9_nthjjs.jpg" },
    { name: "Egypt Visa", image: "https://res.cloudinary.com/dbqdpitah/image/upload/v1771070435/visa-application10_rpxlab.jpg" }
];

const helpItems = [
    "Visa eligibility assessment",
    "Document checklist tailored to your profile",
    "Travel itinerary & accommodation support",
    "Filling of the visa form online",
    "Application form review and correction",
    "Appointment guidance & embassy procedures",
    "Advice on improving future applications"
];

const Visa = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative h-[50vh] min-h-[400px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://res.cloudinary.com/dbqdpitah/image/upload/v1771070434/visa-application1_kwg8pk.jpg")' }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <Container className="relative z-10 text-center max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Your Gateway to the World, Simplified</h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide italic">
                        Expert Guidance for a Stress-Free Visa Application Process
                    </p>
                </Container>
            </div>

            {/* Intro Section */}
            <Section>
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <p className="text-xl text-gray-700 leading-relaxed text-center mb-16">
                            Applying for a visa can be overwhelming — unclear requirements, strict embassy rules, and the fear of rejection. Our visa application support service is designed to remove the guesswork and give you confidence at every step.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                            <div>
                                <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900 border-l-4 border-primary pl-4">Why Visa Matters to Your Travel</h2>
                                <div className="space-y-4 text-gray-600 leading-relaxed">
                                    <p>
                                        A visa is more than a stamp in a passport; it is the conditional authorization that grants a foreigner permission to enter, remain within, or leave a territory. For any international traveler, securing the correct visa is the foundational step of a successful journey, ensuring legal compliance and peace of mind.
                                    </p>
                                    <p>
                                        Countries utilize the visa application process to regulate entry, protect national security, and ensure public health standards are met. Attempting to navigate international borders without the proper documentation can lead to immediate deportation, significant fines, and long-term travel bans.
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        Our service is designed to eliminate this risk, transforming a complex bureaucratic hurdle into a simple, stress-free formality.
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900 border-l-4 border-primary pl-4">Our Commitment to Global Mobility</h2>
                                <div className="space-y-4 text-gray-600 leading-relaxed">
                                    <p>
                                        We recognize that the dream of travel, study, or business abroad is often overshadowed by the anxiety of the visa application process. Our mission is to empower global mobility by providing an expert, reliable, and human-centered service.
                                    </p>
                                    <p>
                                        We offer this service not merely as a transaction, but as a commitment to ensuring your journey begins on solid ground. We believe that with the right guidance, every traveler can confidently meet the requirements of any destination.
                                    </p>
                                    <p>
                                        This allows them to focus on the purpose of their trip, not the paperwork.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-20 border border-gray-100 shadow-sm">
                            <h2 className="text-3xl font-serif font-bold mb-8 text-center text-gray-900">Why Choose Us?</h2>
                            <p className="text-gray-600 text-center mb-10 max-w-3xl mx-auto">
                                Amongst other many providers of visa application services, ours is engineered to stand apart by focusing on what matters most to the modern traveler: certainty, clarity, and control. We move beyond simple form-filling to offer a truly comprehensive and differentiated experience.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {helpItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm">
                                        <div className="flex-shrink-0 bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center text-primary">
                                            <Check size={18} />
                                        </div>
                                        <span className="text-gray-800 font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* Visa Types Grid */}
            <Section className="bg-white pt-0">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Common Visa Applications</h2>
                        <p className="text-gray-600">We assist with visa applications for major destinations across the globe</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {visaTypes.map((visa, index) => (
                            <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg aspect-[4/3]">
                                <img
                                    src={visa.image}
                                    alt={visa.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">{visa.name}</h3>
                                    <a
                                        href={getWhatsAppLink(`Hello! I'm inquiring about the ${visa.name} application process. Could you please provide more information?`)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-primary font-bold hover:gap-2 transition-all"
                                    >
                                        Start My Application <ArrowRight size={18} className="ml-2" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="max-w-4xl mx-auto mt-20 text-center">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
                            <p className="text-amber-800 text-sm italic">
                                Visa approval is at the sole discretion of the relevant embassy or consulate and cannot be guaranteed. Our role is to provide expert guidance and a carefully prepared, compliant application, minimizing the risk of administrative errors and ensuring a smooth, professional process from start to finish.
                            </p>
                        </div>
                        <h2 className="text-3xl font-serif font-bold mb-6">Ready to travel without the worry?</h2>
                        <p className="text-xl text-gray-700 mb-10">
                            Contact us today to speak with a Visa Specialist and begin your application.
                        </p>
                        <a
                            href={getWhatsAppLink("Hello! I'm interested in starting a visa application. Could I speak with a Visa Specialist?")}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button size="lg" className="px-12 rounded-full py-6 text-xl">
                                Get your visa today!
                            </Button>
                        </a>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default Visa;
