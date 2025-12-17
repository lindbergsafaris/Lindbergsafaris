import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const Header = () => {
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
        { name: 'Home', path: '/' },
        {
            name: 'Services',
            path: '#',
            dropdown: [
                { name: 'Airticketing', path: '/services/airticketing' },
                { name: 'Hotel Booking', path: '/services/hotel-booking' },
                { name: 'Transport Services', path: '/services/transport' },
                { name: 'Visa Applications', path: '/services/visa' },
                { name: 'Custom Itineraries', path: '/services/custom-itineraries' },
            ]
        },
        {
            name: 'Themed Packages',
            path: '#',
            dropdown: [
                { name: 'Wildlife Safaris', path: '/packages/wildlife' },
                { name: 'Mountain Climbing', path: '/packages/climbing' },
                { name: 'Cruise Holiday', path: '/packages/cruise' },
                { name: 'Adventure Packages', path: '/packages/adventure' },
                { name: 'Pilgrimages', path: '/packages/pilgrimages' },
                { name: 'Educational & Corporate Trips', path: '/packages/corporate' },
            ]
        },
        {
            name: 'Accommodation',
            path: '#',
            dropdown: [
                { name: 'Lodges', path: '/accommodation/lodges' },
                { name: 'Holiday Homes', path: '/accommodation/holiday-homes' },
                { name: 'Town Hotels', path: '/accommodation/town-hotels' },
                { name: 'Luxury Camps', path: '/accommodation/luxury-camps' },
                { name: 'Resort Hotels', path: '/accommodation/resort-hotels' },
                { name: 'Bush Camps', path: '/accommodation/bush-camps' },
            ]
        },
        {
            name: 'Destination',
            path: '#',
            dropdown: [
                { name: 'Africa', path: '/regions/africa' },
                { name: 'Middle East', path: '/regions/middle-east' },
                { name: 'Europe', path: '/regions/europe' },
            ]
        },
        { name: 'Company', path: '/company' },
        { name: 'Blog', path: '/blog' },
        { name: 'Contact', path: '/contact' },
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
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-white/80 backdrop-blur-sm py-4"
            )}
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
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary"
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
                            Book Now
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
                                                    className="block text-sm text-gray-600 hover:text-primary"
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
                    <Button className="w-full mt-4">Book Now</Button>
                </div>
            )}
        </header>
    );
};

export default Header;
