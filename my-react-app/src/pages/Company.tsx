import { useState, useEffect } from 'react';
import { Shield, Users, Heart, Award, Plus, Minus, Star, Quote, TrendingUp } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import LoadingScreen from '@/components/ui/LoadingScreen';
import LocationMap from '@/components/ui/LocationMap';
import { Testimonial } from '@/types';

const Company = () => {
    const [openFaqIndex, setOpenFaqIndex] = useState<string | null>(null);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
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
            image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Our Mission",
            description: "To connect people with the raw beauty of nature and create unforgettable experiences that inspire conservation and cultural appreciation."
        },
        {
            image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            title: "Our Passion",
            description: "We are driven by a deep love for Africa's wilderness and a commitment to sharing its magic with the world while preserving it for future generations."
        },
        {
            image: "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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

    // Team Data
    const teamMembers = [
        { name: 'Charles Mwiti', role: 'CEO', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0030_nc0mt7.jpg' },
        { name: 'Lucy Kathurima', role: 'Director', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0029_rmfaxp.jpg' },
        { name: 'Jadiel Mwongera', role: 'Operations', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813226/IMG-20251214-WA0032_ezxukj.jpg' },
        { name: 'Anne Karegi', role: 'Accounts', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813226/IMG-20251214-WA0031_bazmkr.jpg' },
        { name: 'Ray Muriiki', role: 'Finance Analyst', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0028_ija8zw.jpg' },
        { name: 'David Njabia', role: 'Tour Consultant', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0027_zjsjki.jpg' },
        { name: 'Jacinter Njoroge', role: 'Tour Consultant', image: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765813225/IMG-20251214-WA0026_ay6xve.jpg' },
    ];

    // Partners Data
    const partners = [
        { name: 'Partner 1', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812606/IMG-20251214-WA0024_fcc5e0.jpg' },
        { name: 'Partner 2', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812606/IMG-20251214-WA0023_jwsxce.jpg' },
        { name: 'Partner 3', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812606/IMG-20251214-WA0022_im5faz.jpg' },
        { name: 'Partner 4', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812605/IMG-20251214-WA0021_ijcenx.jpg' },
        { name: 'Partner 5', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812605/IMG-20251214-WA0025_mokzmf.jpg' },
        { name: 'Partner 6', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812605/IMG-20251214-WA0020_vakifx.jpg' },
        { name: 'Partner 7', logo: 'https://res.cloudinary.com/di5ga8z9i/image/upload/v1765812604/IMG-20251214-WA0019_ncbbga.jpg' },
    ];

    // Static FAQ Data
    const faqCategories = [
        {
            title: "General Information",
            items: [
                {
                    question: "What services does Lindberg Holidays & Safaris offer?",
                    answer: "We offer a wide range of travel services including custom safari itineraries, beach holidays, cultural tours, mountain climbing, hotel bookings, and airport transfers across East Africa."
                },
                {
                    question: "What is a safari, and what does it include?",
                    answer: "A safari is an adventurous journey to observe wildlife in their natural habitat. Our packages typically include transport in 4x4 vehicles, professional guides, park entrance fees, accommodation, and meals."
                },
                {
                    question: "Where is Lindberg Holidays & Safaris located?",
                    answer: "Our head office is located in Nairobi, Kenya, at United Bible Society, Ground Floor, Ndemi Rd."
                },
                {
                    question: "How long has Lindberg Holidays & Safaris been in operation?",
                    answer: "We have over 25 years of combined experience in the tourism industry, providing exceptional safari experiences."
                },
                {
                    question: "How can I contact Lindberg for inquiries?",
                    answer: "You can reach us via email at lindberg@lindbergsafari.com, by phone at +254743377948, or through the contact form on our website."
                }
            ]
        },
        {
            title: "Booking and Payments",
            items: [
                {
                    question: "How do I book a safari or tour package with Lindberg?",
                    answer: "You can book by contacting us directly through our website, email, or WhatsApp. Our tour consultants will work with you to finalize your itinerary."
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept bank transfers, credit cards (Visa/Mastercard), and mobile money payments (M-Pesa)."
                },
                {
                    question: "Do I need to pay a deposit when booking?",
                    answer: "Yes, a deposit is required to secure your booking, with the balance payable before the start of your safari."
                },
                {
                    question: "Can I pay in installments?",
                    answer: "Yes, we offer flexible payment plans. Please discuss this with your tour consultant during booking."
                },
                {
                    question: "What is your cancellation policy?",
                    answer: "Cancellation policies vary by package and season. Please refer to our Terms and Conditions provided at the time of booking."
                }
            ]
        },
        {
            title: "Tour Packages",
            items: [
                {
                    question: "What types of safaris do you offer?",
                    answer: "We offer wildlife safaris, beach holidays, cultural tours, bird watching tours, and photography safaris in Kenya, Tanzania, Uganda, and Rwanda."
                },
                {
                    question: "Can I customize my tour package?",
                    answer: "Absolutely! We specialize in tailor-made itineraries to suit your preferences, budget, and interests."
                },
                {
                    question: "What is included in a safari package?",
                    answer: "Packages generally include accommodation, meals on full board, transport in safari vehicles, park fees, and the services of an English-speaking driver-guide."
                },
                {
                    question: "Do you offer group discounts?",
                    answer: "Yes, we offer discounts for groups, families, and repeat clients. Contact us for a quote."
                }
            ]
        },
        {
            title: "Travel Information",
            items: [
                {
                    question: "Do I need a visa to travel with Lindberg?",
                    answer: "Visa requirements depend on your nationality and the destination. We provide guidance on how to apply for e-visas for Kenya, Tanzania, and other East African countries."
                },
                {
                    question: "Do you offer travel insurance?",
                    answer: "We highly recommend that all travelers purchase comprehensive travel insurance. While we have AMREF Flying Doctors evacuation cover, personal medical and travel insurance is the traveler's responsibility."
                }
            ]
        },
        {
            title: "Customer Support",
            items: [
                {
                    question: "What if I need to change my booking?",
                    answer: "Changes are subject to availability and may incur additional charges depending on the timing and third-party policies (hotels/airlines)."
                },
                {
                    question: "What should I do in case of an emergency during my trip?",
                    answer: "You will have access to a 24/7 emergency contact number, and our guides are trained to handle emergencies on the ground."
                },
                {
                    question: "How can I provide feedback after my trip?",
                    answer: "We value your feedback! You can leave a review on our website, TripAdvisor, or send us an email directly."
                },
                {
                    question: "Do you have a loyalty or referral program?",
                    answer: "Yes, we appreciate our returning guests and referrals. Ask us about our loyalty benefits."
                }
            ]
        },
        {
            title: "Partner and Affiliate Programs",
            items: [
                {
                    question: "Do you work with travel agents or external sales agents?",
                    answer: "Yes, we have a partner program for travel agents. Please contact our sales team for more information."
                }
            ]
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [testimonialsRes] = await Promise.all([
                    api.testimonial.getAll()
                ]);
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

    const toggleFaq = (categoryIndex: number, itemIndex: number) => {
        const key = `${categoryIndex}-${itemIndex}`;
        setOpenFaqIndex(openFaqIndex === key ? null : key);
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
            <Section id="about" className="scroll-mt-20 bg-primary">
                <Container>
                    <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
                        <div className="md:w-1/2">
                            <h2 className="text-4xl font-serif font-bold mb-6 text-white">About Us</h2>
                            <p className="text-gray-100 leading-relaxed mb-4">
                                Lindberg Safaris was born out of a deep love for the African wilderness.
                                Founded by a team of experienced safari enthusiasts, our mission is to share the magic of East Africa with the world.
                            </p>
                            <p className="text-gray-100 leading-relaxed">
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
                        <h3 className="text-3xl font-serif font-bold mb-4 text-white">Why Choose Us</h3>
                        <p className="text-gray-100 max-w-2xl mx-auto">
                            We go above and beyond to ensure your safari is everything you dreamed of and more.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-secondary p-8 rounded-xl text-center hover:bg-white hover:shadow-md transition-all">
                                <div className="bg-secondary-light w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
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
                            <div
                                key={index}
                                className="relative overflow-hidden rounded-xl h-[350px] group shadow-lg border border-white/10"
                            >
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url("${item.image}")` }}
                                />
                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />

                                <div className="relative h-full flex flex-col justify-end p-8 z-10">
                                    <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                                    <p className="text-gray-100 leading-relaxed text-sm md:text-base">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* Our Impact Section */}
            <Section id="impact" className="bg-primary scroll-mt-20">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white">Our Impact</h2>
                        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
                            Making a difference in East Africa
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <p className="text-lg text-gray-100 leading-relaxed mb-12 text-center">
                            Every safari you book contributes to conservation efforts and community development.
                            We believe that tourism should benefit both wildlife and the people who live alongside it.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {impactItems.map((item, index) => (
                                <div key={index} className="bg-secondary-light p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
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
            <Section id="faqs" className="scroll-mt-20 bg-primary">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
                            Find answers to your most common travel questions right here
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-12">
                        {faqCategories.map((category, catIndex) => (
                            <div key={catIndex}>
                                <h3 className="text-2xl font-serif font-bold mb-6 text-white border-b border-white/20 pb-2">{category.title}</h3>
                                <div className="space-y-4">
                                    {category.items.map((item, itemIndex) => {
                                        const isOpen = openFaqIndex === `${catIndex}-${itemIndex}`;
                                        return (
                                            <div key={itemIndex} className="border border-white/20 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm">
                                                <button
                                                    className="w-full flex items-center justify-between p-6 hover:bg-white/10 transition-colors text-left"
                                                    onClick={() => toggleFaq(catIndex, itemIndex)}
                                                >
                                                    <span className="font-bold text-lg text-white pr-4">{item.question}</span>
                                                    {isOpen ? (
                                                        <Minus className="text-white shrink-0" />
                                                    ) : (
                                                        <Plus className="text-white shrink-0" />
                                                    )}
                                                </button>
                                                <div
                                                    className={cn(
                                                        "transition-all duration-300 ease-in-out overflow-hidden",
                                                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                    )}
                                                >
                                                    <div className="p-6 pt-0 text-gray-200 leading-relaxed border-t border-white/10">
                                                        {item.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Still Have Questions CTA */}
                    <div className="mt-16 text-center bg-white/10 backdrop-blur-md p-10 rounded-2xl border border-white/20 max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h3>
                        <p className="text-gray-200 mb-8">
                            Can't find the answer you're looking for? Our team is here to help you plan your perfect safari.
                        </p>
                        <button
                            onClick={() => window.location.href = '/contact'}
                            className="px-8 py-3 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-colors"
                        >
                            Contact Us
                        </button>
                    </div>
                </Container>
            </Section>

            {/* Testimonials Section */}
            <Section id="testimonials" className="bg-primary scroll-mt-20">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white">Guest Reviews</h2>
                        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
                            Read what our travelers have to say about their Lindberg Safaris experience
                        </p>
                    </div>

                    {testimonials.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {testimonials.map((item, index) => (
                                <div key={item._id || index} className="bg-secondary-light p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-all">
                                    <Quote className="text-primary/20 mb-4 h-10 w-10" />
                                    <p className="text-gray-600 mb-6 italic flex-grow">"{item.text}"</p>

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
                        <div className="text-center py-12 bg-secondary-light rounded-lg">
                            <p className="text-gray-600">No testimonials available yet.</p>
                        </div>
                    )}
                </Container>
            </Section>
            {/* Team Section */}
            <Section className="bg-primary">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white">Meet Our Team</h2>
                        <p className="text-gray-100 max-w-2xl mx-auto">The passionate experts behind your unforgettable journeys.</p>
                    </div>

                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:pb-0">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="snap-center shrink-0 w-[80%] sm:w-[45%] md:w-auto group text-center">
                                <div className="relative mb-4 overflow-hidden rounded-lg aspect-[3/4]">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
                                </div>
                                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                <p className="text-gray-200 font-medium">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* Partners Section */}
            <Section className="bg-primary">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white">Our Trusted Partners</h2>
                        <p className="text-gray-100 max-w-2xl mx-auto">Collaborating with the best to deliver excellence.</p>
                    </div>

                    <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 no-scrollbar md:grid md:grid-cols-4 lg:grid-cols-7 md:gap-8 items-center opacity-80 hover:opacity-100 transition-all duration-500 pb-4 md:pb-0">
                        {partners.map((partner, index) => (
                            <div key={index} className="snap-center shrink-0 w-[40%] md:w-auto flex justify-center items-center h-32 bg-secondary-light p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100">
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="max-h-full max-w-full object-contain transition-all duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* Location Section */}
            <Section className="bg-primary scroll-mt-20">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-white">Find Us</h2>
                        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
                            Visit our offices in Nairobi
                        </p>
                    </div>
                    <LocationMap className="h-[400px] w-full shadow-lg border border-gray-100" />
                </Container>
            </Section>
        </Layout>
    );
};

export default Company;
