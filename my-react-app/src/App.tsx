import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from '@/pages/Home';
import Tours from '@/pages/Tours';
import TourDetail from '@/pages/TourDetail';
import Destinations from '@/pages/Destinations';
import DestinationDetail from '@/pages/DestinationDetail';
import RegionDestinations from '@/pages/RegionDestinations';
import Services from '@/pages/Services';
import Transport from '@/pages/services/Transport';
import Hotels from '@/pages/services/Hotels';
import Flights from '@/pages/services/Flights';
import Visa from '@/pages/services/Visa';
import CustomItineraries from '@/pages/services/CustomItineraries';
import Contact from '@/pages/Contact';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Quiz from '@/pages/Quiz';
import PackageCategory from '@/pages/PackageCategory';
import AccommodationCategory from '@/pages/AccommodationCategory';
import Company from '@/pages/Company';
import ScrollToTop from '@/components/ScrollToTop';

// Component to handle redirects with hash navigation
const CompanyRedirect = ({ section }: { section: string }) => {
  // Redirect to company page and scroll to section
  useEffect(() => {
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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/tours/:id" element={<TourDetail />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/regions/:region" element={<RegionDestinations />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/transport" element={<Transport />} />
        <Route path="/services/hotels" element={<Hotels />} />
        <Route path="/services/hotel-booking" element={<Hotels />} /> {/* Alias for dropdown link */}
        <Route path="/services/flights" element={<Flights />} />
        <Route path="/services/airticketing" element={<Flights />} /> {/* Alias for dropdown link */}
        <Route path="/services/visa" element={<Visa />} />
        <Route path="/services/custom-itineraries" element={<CustomItineraries />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/quiz" element={<Quiz />} />

        {/* Company Page - Consolidated */}
        <Route path="/company" element={<Company />} />

        {/* Redirects for old company section pages */}
        <Route path="/about" element={<CompanyRedirect section="about" />} />
        <Route path="/calling" element={<CompanyRedirect section="calling" />} />
        <Route path="/impact" element={<CompanyRedirect section="impact" />} />
        <Route path="/faqs" element={<CompanyRedirect section="faqs" />} />
        <Route path="/testimonials" element={<CompanyRedirect section="testimonials" />} />

        {/* Dynamic Categories */}
        <Route path="/packages/:category" element={<PackageCategory />} />
        <Route path="/accommodation/:type" element={<AccommodationCategory />} />
      </Routes>
    </Router>
  );
}

export default App;
