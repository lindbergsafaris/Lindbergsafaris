'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getDestinationCategories } from '@/lib/data';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import LanguageSelector from '@/components/LanguageSelector';
import { cn } from '@/lib/utils';
import '@/lib/i18n';

const Header = () => {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin') ?? false;
  const { t } = useTranslation('common');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [destinationCategories, setDestinationCategories] = useState<any[]>([]);

  useEffect(() => {
    if (isAdmin) return;
    const fetchCategories = async () => {
      try {
        const data = await getDestinationCategories();
        setDestinationCategories(data || []);
      } catch (error) {
        console.error('Failed to fetch destination categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const THRESHOLD = 10;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < THRESHOLD) {
        setIsVisible(true);
        setIsScrolled(false);
        lastScrollY = currentScrollY;
        return;
      }

      setIsScrolled(true);
      const delta = currentScrollY - lastScrollY;

      if (Math.abs(delta) > THRESHOLD) {
        setIsVisible(delta < 0);
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t('nav.home', 'Home'), path: '/' },
    {
      name: t('nav.services', 'Services'),
      path: '#',
      dropdown: [
        { name: t('services.airticketing', 'Air Ticketing'), path: '/services/airticketing' },
        { name: t('services.hotelBooking', 'Hotel Booking'), path: '/services/hotel-booking' },
        { name: t('services.transportServices', 'Transport Services'), path: '/services/transport' },
        { name: t('services.visaApplications', 'Visa Applications'), path: '/services/visa' },
        { name: t('services.customItineraries', 'Custom Itineraries'), path: '/services/custom-itineraries' },
      ],
    },
    {
      name: t('nav.themedPackages', 'Themed Packages'),
      path: '#',
      dropdown: [
        { name: t('packages.wildlifeSafaris', 'Wildlife Safaris'), path: '/packages/wildlife' },
        { name: t('packages.mountainClimbing', 'Mountain Climbing'), path: '/packages/climbing' },
        { name: t('packages.cruiseHoliday', 'Cruise Holidays'), path: '/packages/cruise' },
        { name: t('packages.adventurePackages', 'Adventure Packages'), path: '/packages/adventure' },
        { name: t('packages.pilgrimages', 'Pilgrimages & Faith'), path: '/packages/pilgrimages' },
        { name: t('packages.corporateTrips', 'Corporate & Educational'), path: '/packages/corporate' },
      ],
    },
    {
      name: t('nav.accommodation', 'Accommodation'),
      path: '#',
      dropdown: [
        { name: t('accommodation.lodges', 'Lodges'), path: '/accommodation/lodges' },
        { name: t('accommodation.holidayHomes', 'Holiday Homes'), path: '/accommodation/holiday-homes' },
        { name: t('accommodation.townHotels', 'Town Hotels'), path: '/accommodation/town-hotels' },
        { name: t('accommodation.luxuryCamps', 'Luxury Camps'), path: '/accommodation/luxury-camps' },
        { name: t('accommodation.resortHotels', 'Resort Hotels'), path: '/accommodation/resort-hotels' },
        { name: t('accommodation.bushCamps', 'Bush Camps'), path: '/accommodation/bush-camps' },
      ],
    },
    {
      name: t('nav.destination', 'Destinations'),
      path: '#',
      dropdown:
        destinationCategories.length > 0
          ? destinationCategories.map((cat) => ({
              name: cat.name,
              path: `/regions/${cat.slug}`,
              bold: cat.isFeatured === true,
            }))
          : [
              { name: t('destinations.kenya', 'Kenya'), path: '/destinations/kenya', bold: true },
              { name: t('destinations.africa', 'Africa'), path: '/regions/africa', bold: false },
            ],
    },
    {
      name: t('nav.company', 'Company'),
      path: '#',
      dropdown: [
        { name: 'About Us', path: '/company' },
        { name: 'Gallery', path: '/gallery' },
      ],
    },
    { name: t('nav.blog', 'Blog'), path: '/blog' },
    { name: t('nav.contact', 'Contact'), path: '/contact' },
  ];

  const toggleDropdown = (name: string) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
    }
  };

  if (isAdmin) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-cover bg-center bg-no-repeat",
        isScrolled ? "shadow-md py-3" : "py-4"
      )}
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(238, 214, 175, 0.95), rgba(218, 165, 32, 0.95)), url("/safari-background.png")`,
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease, padding 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <Container className="flex items-center justify-between">
        <Link href="/" className="shrink-0 mr-8 flex items-center">
          <Image
            src="/logo.png"
            alt="Lindberg Safaris"
            width={160}
            height={64}
            className="h-16 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 flex-1 justify-center">
          {navItems.map((item) => (
            <div key={item.name} className="relative group">
              {item.dropdown ? (
                <button
                  className="flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-primary transition-colors py-2 whitespace-nowrap cursor-pointer"
                  onClick={() => toggleDropdown(item.name)}
                  onMouseEnter={() => setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  {item.name}
                  <ChevronDown size={14} />
                </button>
              ) : (
                <Link
                  href={item.path}
                  className="text-sm font-medium text-gray-800 hover:text-primary transition-colors py-2 block whitespace-nowrap"
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
                        href={subItem.path}
                        className={`block px-4 py-2 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary ${(subItem as any).bold ? 'font-bold' : ''}`}
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
            aria-label="TripAdvisor Reviews"
          >
            <Image
              src="/tripadvisor.jpg"
              alt="TripAdvisor"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full"
            />
          </a>
          <Link href="/contact">
            <Button size="sm" variant="primary">
              {t('nav.bookNow', 'Book Now')}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-gray-800"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
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
                          href={subItem.path}
                          className={`block text-sm text-gray-600 hover:text-primary ${(subItem as any).bold ? 'font-bold' : ''}`}
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
                  href={item.path}
                  className="block text-base font-medium text-gray-800 hover:text-primary py-2 border-b border-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
          <div className="pt-2 flex items-center justify-between">
            <LanguageSelector />
          </div>
          <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full mt-4">{t('nav.bookNow', 'Book Now')}</Button>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
