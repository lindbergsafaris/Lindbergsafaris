import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import Home from '@/pages/Home';
import ScrollToTop from '@/components/ScrollToTop';
import LoadingScreen from '@/components/ui/LoadingScreen';

// Lazy load pages
const Tours = lazy(() => import('@/pages/Tours'));
const TourDetail = lazy(() => import('@/pages/TourDetail'));
const DestinationDetail = lazy(() => import('@/pages/DestinationDetail'));
const RegionDestinations = lazy(() => import('@/pages/RegionDestinations'));
const Services = lazy(() => import('@/pages/Services'));
const Transport = lazy(() => import('@/pages/services/Transport'));
const Hotels = lazy(() => import('@/pages/services/Hotels'));
const HotelBooking = lazy(() => import('@/pages/services/HotelBooking'));
const Flights = lazy(() => import('@/pages/services/Flights'));
const Visa = lazy(() => import('@/pages/services/Visa'));
const CustomItineraries = lazy(() => import('@/pages/services/CustomItineraries'));
const WildlifeSafaris = lazy(() => import('@/pages/packages/WildlifeSafaris'));
const MountainClimbing = lazy(() => import('@/pages/packages/MountainClimbing'));
const CruiseHoliday = lazy(() => import('@/pages/packages/CruiseHoliday'));
const AdventurePackages = lazy(() => import('@/pages/packages/AdventurePackages'));
const Pilgrimages = lazy(() => import('@/pages/packages/Pilgrimages'));
const CorporateTrips = lazy(() => import('@/pages/packages/CorporateTrips'));
const Contact = lazy(() => import('@/pages/Contact'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const Quiz = lazy(() => import('@/pages/Quiz'));
const PackageCategory = lazy(() => import('@/pages/PackageCategory'));
const AccommodationCategory = lazy(() => import('@/pages/AccommodationCategory'));
const AccommodationDetail = lazy(() => import('@/pages/AccommodationDetail'));
const Company = lazy(() => import('@/pages/Company'));
const Gallery = lazy(() => import('@/pages/Gallery'));

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
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:id" element={<TourDetail />} />
          <Route path="/regions/:region" element={<RegionDestinations />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/transport" element={<Transport />} />
          <Route path="/services/hotels" element={<Hotels />} />
          <Route path="/services/hotel-booking" element={<HotelBooking />} />
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
          <Route path="/gallery" element={<Gallery />} />

          {/* Redirects for old company section pages */}
          <Route path="/about" element={<CompanyRedirect section="about" />} />
          <Route path="/calling" element={<CompanyRedirect section="calling" />} />
          <Route path="/impact" element={<CompanyRedirect section="impact" />} />
          <Route path="/faqs" element={<CompanyRedirect section="faqs" />} />
          <Route path="/testimonials" element={<CompanyRedirect section="testimonials" />} />

          {/* Themed Packages */}
          <Route path="/packages/wildlife" element={<WildlifeSafaris />} />
          <Route path="/packages/climbing" element={<MountainClimbing />} />
          <Route path="/packages/cruise" element={<CruiseHoliday />} />
          <Route path="/packages/adventure" element={<AdventurePackages />} />
          <Route path="/packages/pilgrimages" element={<Pilgrimages />} />
          <Route path="/packages/corporate" element={<CorporateTrips />} />

          {/* Dynamic Categories */}
          <Route path="/packages/:category" element={<PackageCategory />} />
          <Route path="/accommodation/:type" element={<AccommodationCategory />} />
          <Route path="/accommodation/view/:id" element={<AccommodationDetail />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
