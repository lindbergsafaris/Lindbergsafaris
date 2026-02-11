import Layout from '@/components/layout/Layout';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import LocationMap from '@/components/ui/LocationMap';

const Contact = () => {
    return (
        <Layout>
            {/* Hero */}
            <div className="relative h-[40vh] min-h-[300px] flex items-center justify-center text-white">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' }}
                >
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <Container className="relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">Contact Us</h1>
                    <p className="text-xl font-light tracking-wide">Let's plan your dream safari.</p>
                </Container>
            </div>

            <Section className="bg-primary">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl font-serif font-bold mb-6 text-white">Get in Touch</h2>
                            <p className="text-gray-100 mb-8">
                                Have a question or ready to book? Fill out the form below and our team will get back to you within 24 hours.
                            </p>

                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-1">First Name</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-600 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-1">Last Name</label>
                                        <input type="text" className="w-full px-4 py-2 border border-gray-600 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">Email Address</label>
                                    <input type="email" className="w-full px-4 py-2 border border-gray-600 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">Subject</label>
                                    <select className="w-full px-4 py-2 border border-gray-600 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20 [&>option]:text-gray-900">
                                        <option>General Inquiry</option>
                                        <option>Booking Request</option>
                                        <option>Partnership</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-1">Message</label>
                                    <textarea rows={5} className="w-full px-4 py-2 border border-gray-600 bg-white/10 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white/20"></textarea>
                                </div>

                                <Button size="lg" className="w-full md:w-auto">Send Message</Button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-secondary p-8 rounded-xl h-fit">
                            <h3 className="text-xl font-serif font-bold mb-6">Contact Information</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-secondary-light p-2 rounded-full shadow-sm text-primary shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Our Office</h4>
                                        <p className="text-gray-600">United Bible Society, Ground Floor, Ndemi Rd</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-secondary-light p-2 rounded-full shadow-sm text-primary shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Phone</h4>
                                        <p className="text-gray-600">+254743377948</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-secondary-light p-2 rounded-full shadow-sm text-primary shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Email</h4>
                                        <p className="text-gray-600">lindberg@lindbergsafari.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-secondary-light p-2 rounded-full shadow-sm text-primary shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Business Hours</h4>
                                        <p className="text-gray-600">Mon - Fri: 8:00 AM - 6:00 PM</p>
                                        <p className="text-gray-600">Sat: 9:00 AM - 1:00 PM</p>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <LocationMap className="mt-8 h-64 rounded-lg shadow-md" />
                        </div>
                    </div>
                </Container>
            </Section>
        </Layout>
    );
};

export default Contact;
