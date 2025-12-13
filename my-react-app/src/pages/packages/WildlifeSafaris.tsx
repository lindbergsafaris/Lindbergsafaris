import { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { ArrowRight, Camera, Binoculars, Map } from 'lucide-react';
import { Link } from 'react-router-dom';

const WildlifeSafaris = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-white overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=2068&q=80")' }}
                >
                    <div className="absolute inset-0 bg-black/40" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
                        Wildlife Safaris
                    </h1>
                    <p className="text-xl md:text-2xl font-light tracking-wide max-w-2xl mx-auto text-gray-200 mb-8">
                        Witness the majesty of the African wilderness in its purest form.
                    </p>
                    <Link to="/contact">
                        <Button size="lg" className="bg-accent hover:bg-accent/90 text-white border-none">
                            Plan Your Safari
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
                                The Ultimate Safari Experience
                            </h2>
                            <div className="prose prose-lg text-gray-600 leading-relaxed space-y-6">
                                <p>
                                    Embarking on a wildlife safari with Lindberg Safaris is more than just a vacation; it is a journey into the heart of nature.
                                    East Africa is home to some of the world's most spectacular wildlife populations, offering unparalleled opportunities to observe animals in their natural habitats.
                                </p>
                                <p>
                                    From the vast plains of the Serengeti and the Masai Mara to the rugged landscapes of Tsavo and Samburu, our bespoke itineraries are designed to maximize your game-viewing potential.
                                    Whether you dream of witnessing the Great Migration, tracking the Big Five, or marveling at the diverse birdlife, our expert guides will ensure an unforgettable experience.
                                </p>
                                <h3 className="text-2xl font-serif font-bold text-gray-800 mt-8 mb-4">The Big Five & Beyond</h3>
                                <p>
                                    The term "Big Five" was originally coined by big-game hunters to describe the five most difficult animals to hunt on foot: the lion, leopard, rhinoceros, elephant, and Cape buffalo.
                                    Today, seeing these magnificent creatures is the highlight of any safari. But the magic doesn't stop there. You'll also encounter cheetahs, giraffes, zebras, hippos, and a myriad of antelope species.
                                </p>
                                <div className="grid grid-cols-2 gap-4 my-8">
                                    <img
                                        src="https://images.unsplash.com/photo-1547970810-dc1eac37d174?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Elephant"
                                        className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                                    />
                                    <img
                                        src="https://images.unsplash.com/photo-1535591273668-578e31182c4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                        alt="Lion"
                                        className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-gray-800 mt-8 mb-4">Conservation First</h3>
                                <p>
                                    We are deeply committed to conservation and sustainable tourism. By choosing Lindberg Safaris, you are directly contributing to the protection of these fragile ecosystems and the communities that coexist with them.
                                    We partner with eco-friendly lodges and support local conservation initiatives to ensure that future generations can also enjoy the wonders of the wild.
                                </p>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:w-1/3 space-y-8">
                            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
                                <h3 className="text-xl font-bold mb-6">Why Choose Us?</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Binoculars size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Expert Guides</h4>
                                            <p className="text-sm text-gray-600">Our guides are certified experts with years of experience in the bush.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Camera size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Photography Focus</h4>
                                            <p className="text-sm text-gray-600">Vehicles equipped for the perfect shot, with bean bags and charging points.</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-accent/10 p-2 rounded-full text-accent">
                                            <Map size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Custom Itineraries</h4>
                                            <p className="text-sm text-gray-600">Tailor-made safaris to suit your pace, interests, and budget.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <div className="relative rounded-xl overflow-hidden h-64 group cursor-pointer">
                                <img
                                    src="https://images.unsplash.com/photo-1519066629447-267fffa62d4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Luxury Camp"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <p className="text-sm font-medium mb-1">Accommodation</p>
                                    <h4 className="text-xl font-bold">Luxury Lodges & Camps</h4>
                                </div>
                            </div>

                            <div className="bg-accent text-white p-8 rounded-xl text-center">
                                <h3 className="text-2xl font-serif font-bold mb-4">Ready to go?</h3>
                                <p className="mb-6 text-white/90">Contact us today to start planning your dream wildlife safari.</p>
                                <Link to="/contact">
                                    <Button variant="outline" className="w-full border-white text-white hover:bg-white hover:text-accent">
                                        Get a Quote
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

export default WildlifeSafaris;
