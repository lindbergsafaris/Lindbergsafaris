import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Check, Plane, Train, Bus, Ship } from 'lucide-react';

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
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Ticketing Services</h1>
                    <p className="text-xl font-light tracking-wide">All Your Travel Tickets in One Place</p>
                </Container>
            </div>

            {/* Main Services Overview */}
            <Section>
                <Container>
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="md:w-1/2 order-2 md:order-1">
                            <img
                                src="https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Travel Booking"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                        <div className="md:w-1/2 order-1 md:order-2">
                            <h2 className="text-3xl font-serif font-bold mb-6">Comprehensive Ticketing Solutions</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                We handle all your ticketing needs from start to finish. Whether you need flight tickets,
                                train reservations, bus bookings, or ferry passes, our dedicated team ensures you get the
                                best rates and most convenient schedules for a seamless journey.
                            </p>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3 text-gray-700">
                                    <div className="bg-primary/10 p-1 rounded-full text-primary">
                                        <Check size={16} />
                                    </div>
                                    <span>Competitive rates across all travel modes</span>
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
                                    <span>Group booking discounts available</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-700">
                                    <div className="bg-primary/10 p-1 rounded-full text-primary">
                                        <Check size={16} />
                                    </div>
                                    <span>Multi-modal journey planning</span>
                                </li>
                            </ul>
                            <Button size="lg">Request a Quote</Button>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* Service Types Grid */}
            <Section className="bg-primary">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3 text-white">Our Ticketing Services</h2>
                        <p className="text-gray-100 max-w-2xl mx-auto">
                            From flights to ferries, we've got your travel covered
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Flight Tickets */}
                        <div className="bg-secondary-light rounded-xl p-6 hover:shadow-lg transition-all">
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-primary">
                                <Plane size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Flight Tickets</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Domestic and international flights with major airlines at competitive prices
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-primary flex-shrink-0" />
                                    <span>All major airlines</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-primary flex-shrink-0" />
                                    <span>Best price guarantee</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-primary flex-shrink-0" />
                                    <span>Flexible booking options</span>
                                </li>
                            </ul>
                        </div>

                        {/* Train Tickets */}
                        <div className="bg-secondary-light rounded-xl p-6 hover:shadow-lg transition-all">
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-primary">
                                <Train size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Train Reservations</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Comfortable rail travel across the region with reserved seating
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-primary flex-shrink-0" />
                                    <span>SGR & regional trains</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-primary flex-shrink-0" />
                                    <span>Class upgrades available</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-primary flex-shrink-0" />
                                    <span>Group reservations</span>
                                </li>
                            </ul>
                        </div>

                        {/* Bus Tickets */}
                        <div className="bg-secondary-light rounded-xl p-6 hover:shadow-lg transition-all">
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-primary">
                                <Bus size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Bus Bookings</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Reliable coach services for intercity and cross-border travel
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-primary flex-shrink-0" />
                                    <span>Premium coaches</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-primary flex-shrink-0" />
                                    <span>Multiple daily departures</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-primary flex-shrink-0" />
                                    <span>Safe & comfortable</span>
                                </li>
                            </ul>
                        </div>

                        {/* Ferry Tickets */}
                        <div className="bg-secondary-light rounded-xl p-6 hover:shadow-lg transition-all">
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-primary">
                                <Ship size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-900">Ferry Services</h3>
                            <p className="text-gray-600 text-sm mb-4">
                                Coastal and island connections including Zanzibar ferries
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-primary flex-shrink-0" />
                                    <span>Fast ferry options</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-primary flex-shrink-0" />
                                    <span>Zanzibar connections</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check size={14} className="text-primary flex-shrink-0" />
                                    <span>Island hopping packages</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Container>
            </Section>

            {/* Why Choose Us */}
            <Section>
                <Container>
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-serif font-bold mb-6">Why Book With Us?</h2>
                        <p className="text-gray-600 leading-relaxed mb-8">
                            As your one-stop travel solution, we simplify the entire booking process.
                            Our experienced team monitors prices, manages reservations, and provides
                            instant support whenever you need it. Focus on your journey while we handle the details.
                        </p>
                        <Button size="lg">Contact Us for Bookings</Button>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default Flights;
