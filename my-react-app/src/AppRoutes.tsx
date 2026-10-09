import { useEffect, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import LoadingScreen from '@/components/ui/LoadingScreen';

// Page Imports (Static or Lazy)
import Tours from '@/pages/Tours';
import TourDetail from '@/pages/TourDetail';
import DestinationDetail from '@/pages/DestinationDetail';
import RegionDestinations from '@/pages/RegionDestinations';
import Services from '@/pages/Services';
import Transport from '@/pages/services/Transport';
import Hotels from '@/pages/services/Hotels';
import HotelBooking from '@/pages/services/HotelBooking';
import Flights from '@/pages/services/Flights';
import Visa from '@/pages/services/Visa';
import CustomItineraries from '@/pages/services/CustomItineraries';
import Contact from '@/pages/Contact';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Quiz from '@/pages/Quiz';
import ThemedPackage from '@/pages/ThemedPackage';
import AccommodationCategory from '@/pages/AccommodationCategory';
import AccommodationDetail from '@/pages/AccommodationDetail';
import Company from '@/pages/Company';
import Gallery from '@/pages/Gallery';

const CompanyRedirect = ({ section }: { section: string }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById(section);
    if (element) {
      setTimeout(() => {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [section]);

  return <Company />;
};

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<Tours />} />

        {/* Tours: canonical slug route; UUID route handled inside TourDetail (redirects) */}
        <Route path="/tours/:id" element={<TourDetail />} />

        <Route path="/regions/:region" element={<RegionDestinations />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />

        {/* Destination typo fix: ambosseli → amboseli */}
        <Route
          path="/destinations/ambosseli-national-park"
          element={<Navigate to="/destinations/amboseli-national-park" replace />}
        />

        <Route path="/services" element={<Services />} />
        <Route path="/services/transport" element={<Transport />} />
        {/* /services/hotels is noindex thin content; canonical → hotel-booking */}
        <Route path="/services/hotels" element={<Hotels />} />
        <Route path="/services/hotel-booking" element={<HotelBooking />} />
        <Route path="/services/flights" element={<Flights />} />
        <Route path="/services/airticketing" element={<Flights />} />
        <Route path="/services/visa" element={<Visa />} />
        <Route path="/services/custom-itineraries" element={<CustomItineraries />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />

        {/* Blog: canonical slug route; UUID handled inside BlogPost (redirects) */}
        <Route path="/blog/:id" element={<BlogPost />} />

        <Route path="/quiz" element={<Quiz />} />
        <Route path="/company" element={<Company />} />
        <Route path="/gallery" element={<Gallery />} />

        {/* Redirects for old company section pages */}
        <Route path="/about" element={<CompanyRedirect section="about" />} />
        <Route path="/calling" element={<CompanyRedirect section="calling" />} />
        <Route path="/impact" element={<CompanyRedirect section="impact" />} />
        <Route path="/faqs" element={<CompanyRedirect section="faqs" />} />
        <Route path="/testimonials" element={<CompanyRedirect section="testimonials" />} />

        {/* Dynamic Themed Packages */}
        <Route path="/packages/:category" element={<ThemedPackage />} />

        {/* Accommodation: canonical slug route (no "view" segment) */}
        <Route path="/accommodation/:type" element={<AccommodationCategory />} />

        {/* Legacy UUID route — AccommodationDetail detects UUID and redirects to slug */}
        <Route path="/accommodation/view/:id" element={<AccommodationDetail />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
