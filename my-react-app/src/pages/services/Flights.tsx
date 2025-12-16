import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Check } from 'lucide-react';

const Flights = () => {
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
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Flight Ticketing</h1>
                    <p className="text-xl font-light tracking-wide">Seamless connections to your dream destination.</p>
                </Container>
            </div>

            <Section>
                <Container>
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/2 order-2 md:order-1">
                            <img
                                src="https://res.cloudinary.com/di5ga8z9i/image/upload/v1765554600/IMG-20251212-WA0013_xpz1j2.jpg"
                                alt="Airplane"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                        <div className="md:w-1/2 order-1 md:order-2">
                            <h2 className="text-3xl font-serif font-bold mb-6">Domestic & International Flights</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                We simplify your travel planning by handling all your flight bookings.
                                Whether you need a domestic flight to a national park or an international connection,
                                our team ensures you get the best rates and most convenient schedules.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-gray-700">
                                    <div className="bg-primary/10 p-1 rounded-full text-primary">
                                        <Check size={16} />
                                    </div>
                                    <span>Competitive rates on all major airlines</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-700">
                                    <div className="bg-primary/10 p-1 rounded-full text-primary">
                                        <Check size={16} />
                                    </div>
                                    <span>24/7 support for changes and cancellations</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-700">
                                    <div className="bg-primary/10 p-1 rounded-full text-primary">
                                        <Check size={16} />
                                    </div>
                                    <span>Group booking discounts</span>
                                </li>
                            </ul>
                            <Button size="lg">Book a Flight</Button>
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default Flights;
