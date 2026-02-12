import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import LanguageSelector from '@/components/LanguageSelector';
import { cn } from '@/lib/utils';

const Header = () => {
    const { t } = useTranslation('common');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: t('nav.home'), path: '/' },
        {
            name: t('nav.services'),
            path: '#',
            dropdown: [
                { name: t('services.airticketing'), path: '/services/airticketing' },
                { name: t('services.hotelBooking'), path: '/services/hotel-booking' },
                { name: t('services.transportServices'), path: '/services/transport' },
                { name: t('services.visaApplications'), path: '/services/visa' },
                { name: t('services.customItineraries'), path: '/services/custom-itineraries' },
            ]
        },
        {
            name: t('nav.themedPackages'),
            path: '#',
            dropdown: [
                { name: t('packages.wildlifeSafaris'), path: '/packages/wildlife' },
                { name: t('packages.mountainClimbing'), path: '/packages/climbing' },
                { name: t('packages.cruiseHoliday'), path: '/packages/cruise' },
                { name: t('packages.adventurePackages'), path: '/packages/adventure' },
                { name: t('packages.pilgrimages'), path: '/packages/pilgrimages' },
                { name: t('packages.corporateTrips'), path: '/packages/corporate' },
            ]
        },
        {
            name: t('nav.accommodation'),
            path: '#',
            dropdown: [
                { name: t('accommodation.lodges'), path: '/accommodation/lodges' },
                { name: t('accommodation.holidayHomes'), path: '/accommodation/holiday-homes' },
                { name: t('accommodation.townHotels'), path: '/accommodation/town-hotels' },
                { name: t('accommodation.luxuryCamps'), path: '/accommodation/luxury-camps' },
                { name: t('accommodation.resortHotels'), path: '/accommodation/resort-hotels' },
                { name: t('accommodation.bushCamps'), path: '/accommodation/bush-camps' },
            ]
        },
        {
            name: t('nav.destination'),
            path: '#',
            dropdown: [
                { name: t('destinations.kenya'), path: '/destinations/kenya', bold: true },
                { name: t('destinations.africa'), path: '/regions/africa' },
                { name: t('destinations.middleEast'), path: '/regions/middle-east' },
                { name: t('destinations.europe'), path: '/regions/europe' },
                { name: t('destinations.america'), path: '/regions/america' },
                { name: t('destinations.oceania'), path: '/regions/oceania' },
                { name: t('destinations.southAmerica'), path: '/regions/south-america' },
                { name: t('destinations.northAmerica'), path: '/regions/north-america' },
            ]
        },
        {
            name: t('nav.company'),
            path: '#',
            dropdown: [
                { name: 'About Us', path: '/company' },
                { name: 'Gallery', path: '/gallery' },
            ]
        },
        { name: t('nav.blog'), path: '/blog' },
        { name: t('nav.contact'), path: '/contact' },
    ];

    const toggleDropdown = (name: string) => {
        if (openDropdown === name) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(name);
        }
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-cover bg-center bg-no-repeat",
                isScrolled ? "shadow-md py-3" : "py-4"
            )}
            style={{
                backgroundImage: `linear-gradient(to bottom, rgba(238, 214, 175, 0.95), rgba(218, 165, 32, 0.95)), url("/safari-background.png")`
            }}
        >
            <Container className="flex items-center justify-between">
                <Link to="/" className="shrink-0 mr-8">
                    <img src="/logo.png" alt="Lindberg Safaris" className="h-16 w-auto" />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-6 flex-1 justify-center">
                    {navItems.map((item) => (
                        <div key={item.name} className="relative group">
                            {item.dropdown ? (
                                <button
                                    className="flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-primary transition-colors py-2"
                                    onClick={() => toggleDropdown(item.name)}
                                    onMouseEnter={() => setOpenDropdown(item.name)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    {item.name}
                                    <ChevronDown size={14} />
                                </button>
                            ) : (
                                <Link
                                    to={item.path}
                                    className="text-sm font-medium text-gray-800 hover:text-primary transition-colors py-2 block"
                                >
                                    {item.name}
                                </Link>
                            )}

                            {/* Dropdown Menu */}
                            {item.dropdown && (
                                <div
                                    className={cn(
                                        "absolute top-full left-0 w-56 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-200 origin-top-left",
                                        openDropdown === item.name ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
                                    )}
                                    onMouseEnter={() => setOpenDropdown(item.name)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <div className="py-2">
                                        {item.dropdown.map((subItem) => (
                                            <Link
                                                key={subItem.name}
                                                to={subItem.path}
                                                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary ${subItem.bold ? 'font-bold' : ''}`}
                                            >
                                                {subItem.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="hidden lg:flex items-center gap-4 ml-4">
                    <LanguageSelector />
                    <a
                        href="https://www.tripadvisor.com/Attraction_Review-g294207-d17384036-Reviews-Lindberg_Holidays_and_Safaris-Nairobi.html"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:opacity-80 transition-opacity"
                    >
                        <img src="/tripadvisor.jpg" alt="TripAdvisor" className="w-8 h-8 rounded-full" />
                    </a>
                    <Link to="/contact">
                        <Button size="sm" variant="primary">
                            {t('nav.bookNow')}
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="lg:hidden p-2 text-gray-800"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </Container>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg lg:hidden flex flex-col p-4 gap-2 max-h-[80vh] overflow-y-auto">
                    {navItems.map((item) => (
                        <div key={item.name}>
                            {item.dropdown ? (
                                <div>
                                    <button
                                        className="flex items-center justify-between w-full text-base font-medium text-gray-800 py-2 border-b border-gray-100"
                                        onClick={() => toggleDropdown(item.name)}
                                    >
                                        {item.name}
                                        <ChevronDown size={16} className={cn("transition-transform", openDropdown === item.name ? "rotate-180" : "")} />
                                    </button>
                                    {openDropdown === item.name && (
                                        <div className="pl-4 py-2 bg-gray-50 space-y-2">
                                            {item.dropdown.map((subItem) => (
                                                <Link
                                                    key={subItem.name}
                                                    to={subItem.path}
                                                    className={`block text-sm text-gray-600 hover:text-primary ${subItem.bold ? 'font-bold' : ''}`}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to={item.path}
                                    className="block text-base font-medium text-gray-800 hover:text-primary py-2 border-b border-gray-100"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    ))}
                    <Button className="w-full mt-4">{t('nav.bookNow')}</Button>
                </div>
            )}
        </header>
    );
};

export default Header;
