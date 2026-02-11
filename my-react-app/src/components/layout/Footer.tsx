import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Container from '@/components/ui/Container';
import LocationMap from '@/components/ui/LocationMap';

const Footer = () => {
    const { t } = useTranslation('common');

    return (
        <footer
            className="relative text-gray-800 py-12 md:py-16 bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: `linear-gradient(to bottom, rgba(238, 214, 175, 0.85), rgba(218, 165, 32, 0.85)), url("/safari-background.png")`
            }}
        >
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 relative z-10">
                    {/* Brand Column */}
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">{t('footer.brandName')}</h3>
                        <p className="text-sm leading-relaxed mb-6 font-medium">
                            {t('footer.brandDescription')}
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/LindbergHolidaysAndSafaris" target="_blank" rel="noopener noreferrer" className="hover:text-primary-dark transition-colors"><Facebook size={20} /></a>
                            <a href="https://www.instagram.com/Lindbergholidays" target="_blank" rel="noopener noreferrer" className="hover:text-primary-dark transition-colors"><Instagram size={20} /></a>
                            <a href="https://www.tiktok.com/@Lindberg.holidays" target="_blank" rel="noopener noreferrer" className="hover:text-primary-dark transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                </svg>
                            </a>
                            <a href="https://www.linkedin.com/company/lindbergholidayssafaris/" target="_blank" rel="noopener noreferrer" className="hover:text-primary-dark transition-colors"><Linkedin size={20} /></a>
                            <a href="https://x.com/LindbergSafaris" target="_blank" rel="noopener noreferrer" className="hover:text-primary-dark transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                                    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4">{t('footer.quickLinks')}</h4>
                        <ul className="space-y-2 font-medium">
                            <li><Link to="/about" className="hover:text-primary-dark transition-colors">{t('footer.aboutUs')}</Link></li>
                            <li><Link to="/tours" className="hover:text-primary-dark transition-colors">{t('footer.ourTours')}</Link></li>
                            <li><Link to="/destinations" className="hover:text-primary-dark transition-colors">{t('footer.destinations')}</Link></li>
                            <li><Link to="/blog" className="hover:text-primary-dark transition-colors">{t('footer.travelBlog')}</Link></li>
                            <li><Link to="/contact" className="hover:text-primary-dark transition-colors">{t('footer.contactUs')}</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4">{t('footer.services')}</h4>
                        <ul className="space-y-2 font-medium">
                            <li><Link to="/services/safaris" className="hover:text-primary-dark transition-colors">{t('footer.safarisAndTours')}</Link></li>
                            <li><Link to="/services/hotels" className="hover:text-primary-dark transition-colors">{t('footer.hotelsAndAccommodation')}</Link></li>
                            <li><Link to="/services/transport" className="hover:text-primary-dark transition-colors">{t('footer.transportServices')}</Link></li>
                            <li><Link to="/services/flights" className="hover:text-primary-dark transition-colors">{t('footer.flightTicketing')}</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4">{t('footer.contactInfo')}</h4>
                        <ul className="space-y-4 font-medium">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-primary-dark shrink-0" />
                                <span>United Bible Society, Ground Floor, Ndemi Rd</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-primary-dark shrink-0" />
                                <div>
                                    <p>0745654619</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-primary-dark shrink-0" />
                                <div>
                                    <p>lindberg@lindbergsafari.com</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-600/30">
                    <h4 className="text-lg font-bold text-gray-900 mb-6">{t('footer.visitUs')}</h4>
                    <LocationMap className="h-64 md:h-80 w-full rounded-lg shadow-lg" />
                </div>

                <div className="border-t border-gray-600/30 mt-12 pt-8 text-center text-sm text-gray-700 font-medium">
                    <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
                </div>
            </Container >
        </footer >
    );
};

export default Footer;
