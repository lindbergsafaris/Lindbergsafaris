import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import Container from '@/components/ui/Container';
import LocationMap from '@/components/ui/LocationMap';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 md:py-16">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {/* Brand Column */}
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-white mb-4">Lindberg Safaris</h3>
                        <p className="text-sm leading-relaxed mb-6">
                            Crafting unforgettable safari experiences for over 25 years.
                            Discover the magic of Africa with our personalized journeys.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-primary transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-primary transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/tours" className="hover:text-primary transition-colors">Our Tours</Link></li>
                            <li><Link to="/destinations" className="hover:text-primary transition-colors">Destinations</Link></li>
                            <li><Link to="/blog" className="hover:text-primary transition-colors">Travel Blog</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Services</h4>
                        <ul className="space-y-2">
                            <li><Link to="/services/safaris" className="hover:text-primary transition-colors">Safaris & Tours</Link></li>
                            <li><Link to="/services/hotels" className="hover:text-primary transition-colors">Hotels & Accommodation</Link></li>
                            <li><Link to="/services/transport" className="hover:text-primary transition-colors">Transport Services</Link></li>
                            <li><Link to="/services/flights" className="hover:text-primary transition-colors">Flight Ticketing</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-primary shrink-0" />
                                <span>123 Safari Way, Nairobi, Kenya</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-primary shrink-0" />
                                <span>+254 700 123 456</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-primary shrink-0" />
                                <span>info@lindbergsafaris.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800">
                    <h4 className="text-lg font-bold text-white mb-6">Visit Us</h4>
                    <LocationMap className="h-64 md:h-80 w-full rounded-lg" />
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Lindberg Safaris. All rights reserved.</p>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
