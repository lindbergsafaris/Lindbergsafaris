import { useState, useEffect } from 'react';
import { Shield, Users, Heart, Award, Plus, Minus, Star, Quote, Target, TrendingUp, Leaf } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import LoadingScreen from '@/components/ui/LoadingScreen';

const Company = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
    const [faqs, setFaqs] = useState<any[]>([]);
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Navigation items for quick jump
    const navSections = [
        { id: 'about', label: 'About Us' },
        { id: 'calling', label: 'Our Calling' },
        { id: 'impact', label: 'Our Impact' },
        { id: 'faqs', label: 'FAQs' },
        { id: 'testimonials', label: 'Testimonials' },
    ];

    // About section values
    const values = [
        {
            icon: <Shield size={32} className="text-primary" />,
            title: "Safety First",
            description: "Your safety is our top priority. We use well-maintained vehicles and experienced guides."
        },
        {
            icon: <Users size={32} className="text-primary" />,
            title: "Expert Guides",
            description: "Our guides are passionate, knowledgeable, and dedicated to making your safari unforgettable."
        },
        {
            icon: <Heart size={32} className="text-primary" />,
            title: "Sustainable Tourism",
            description: "We are committed to conservation and supporting local communities."
        },
        {
            icon: <Award size={32} className="text-primary" />,
            title: "Excellence",
            description: "We strive for excellence in every aspect of your journey, from planning to execution."
        }
    ];

    // Calling section items
    const callingItems = [
        {
            icon: <Target size={40} className="text-white" />,
            title: "Our Mission",
            description: "To connect people with the raw beauty of nature and create unforgettable experiences that inspire conservation and cultural appreciation."
        },
        {
            icon: <Heart size={40} className="text-white" />,
            title: "Our Passion",
            description: "We are driven by a deep love for Africa's wilderness and a commitment to sharing its magic with the world while preserving it for future generations."
        },
        {
            icon: <Leaf size={40} className="text-white" />,
            title: "Conservation First",
            description: "We believe in responsible tourism that protects wildlife, empowers local communities, and ensures the sustainability of our natural heritage."
        }
    ];

    // Impact section items
    const impactItems = [
        {
            title: "Supporting Anti-Poaching Units",
            description: "A portion of every safari booking goes directly to funding anti-poaching patrols and wildlife protection initiatives."
        },
        {
            title: "Funding Local Schools",
            description: "We partner with communities to build and support schools, providing education opportunities for children in rural areas."
        },
        {
            title: "Planting Trees",
            description: "Our reforestation program has planted over 10,000 trees, helping to restore habitats and combat climate change."
        },
        {
            title: "Community Empowerment",
            description: "We employ local guides, source from local suppliers, and ensure tourism benefits reach the communities we visit."
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [faqsRes, testimonialsRes] = await Promise.all([
                    api.faq.getAll(),
                    api.testimonial.getAll()
                ]);
                setFaqs(faqsRes.data || []);
                setTestimonials(testimonialsRes.data || []);
            } catch (error) {
                console.error('Error fetching company data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Account for fixed header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&auto=format&fit=crop&w=2072&q=80")' }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4">Our Company</h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide mb-8">Passionate about Africa. Dedicated to You.</p>

                    {/* Quick Navigation */}
                    <div className="flex flex-wrap justify-center gap-3 mt-8">
                        {navSections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className="px-6 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-white/20 transition-all text-sm font-medium"
                            >
                                {section.label}
                            </button>
                        ))}
                    </div>
                </Container>
            </div>

            {/* About Us Section */}
            <Section id="about" className="scroll-mt-20">
                <Container>
                    <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
                        <div className="md:w-1/2">
                            <h2 className="text-4xl font-serif font-bold mb-6 text-gray-900">About Us</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Lindberg Safaris was born out of a deep love for the African wilderness.
                                Founded by a team of experienced safari enthusiasts, our mission is to share the magic of East Africa with the world.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                With over 25 years of combined experience, we specialize in crafting bespoke safari itineraries that cater to your unique interests and preferences.
                                Whether you dream of witnessing the Great Migration, tracking gorillas in the mist, or relaxing on pristine beaches, we are here to make it happen.
                            </p>
                        </div>
                        <div className="md:w-1/2">
                            <img
                                src="https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                alt="Safari Landscape"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                    </div>

                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-serif font-bold mb-4 text-gray-900">Why Choose Us</h3>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We go above and beyond to ensure your safari is everything you dreamed of and more.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-gray-50 p-8 rounded-xl text-center hover:bg-white hover:shadow-md transition-all">
                                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    {value.icon}
                                </div>
                                <h4 className="text-xl font-bold mb-3 text-gray-900">{value.title}</h4>
                                <p className="text-gray-600 text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* Our Calling Section */}
            <Section id="calling" className="bg-gradient-to-br from-primary to-primary-dark text-white scroll-mt-20">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Our Calling</h2>
                        <p className="text-xl text-primary-light max-w-3xl mx-auto">
                            Why we do what we do
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {callingItems.map((item, index) => (
                            <div key={index} className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/15 transition-all">
                                <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-primary-light leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* Our Impact Section */}
            <Section id="impact" className="bg-secondary/20 scroll-mt-20">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gray-900">Our Impact</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Making a difference in East Africa
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <p className="text-lg text-gray-600 leading-relaxed mb-12 text-center">
                            Every safari you book contributes to conservation efforts and community development.
                            We believe that tourism should benefit both wildlife and the people who live alongside it.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {impactItems.map((item, index) => (
                                <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                                            <TrendingUp className="text-primary" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                                            <p className="text-gray-600 leading-relaxed">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Container>
            </Section>

            {/* FAQs Section */}
            <Section id="faqs" className="scroll-mt-20">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to know before your African adventure
                        </p>
                    </div>

                    {faqs.length > 0 ? (
                        <div className="max-w-3xl mx-auto space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={faq._id || index} className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors text-left"
                                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                    >
                                        <span className="font-bold text-lg text-gray-900 pr-4">{faq.question}</span>
                                        {openFaqIndex === index ? (
                                            <Minus className="text-primary shrink-0" />
                                        ) : (
                                            <Plus className="text-primary shrink-0" />
                                        )}
                                    </button>
                                    <div
                                        className={cn(
                                            "transition-all duration-300 ease-in-out overflow-hidden",
                                            openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        )}
                                    >
                                        <div className="p-6 pt-0 bg-white text-gray-600 leading-relaxed border-t border-transparent">
                                            {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <p className="text-gray-600">No FAQs available yet.</p>
                        </div>
                    )}
                </Container>
            </Section>

            {/* Testimonials Section */}
            <Section id="testimonials" className="bg-gray-50 scroll-mt-20">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-gray-900">Guest Reviews</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Read what our travelers have to say about their Lindberg Safaris experience
                        </p>
                    </div>

                    {testimonials.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonials.map((item, index) => (
                                <div key={item._id || index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all">
                                    <Quote className="text-primary/20 mb-4 h-10 w-10" />
                                    <p className="text-gray-600 mb-6 italic flex-grow">"{item.text || item.content}"</p>

                                    <div className="flex items-center gap-1 text-accent mb-4">
                                        {[...Array(item.rating || 5)].map((_, i) => (
                                            <Star key={i} size={16} fill="currentColor" stroke="none" />
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-50">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0">
                                            <img
                                                src={item.image?.url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                                            <span className="text-xs text-gray-500">{item.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-lg">
                            <p className="text-gray-600">No testimonials available yet.</p>
                        </div>
                    )}
                </Container>
            </Section>
        </Layout>
    );
};

export default Company;
