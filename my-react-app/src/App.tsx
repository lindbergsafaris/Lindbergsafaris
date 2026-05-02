// ============================================================
// SHUTDOWN MODE — All routes temporarily disabled by developer
// To restore the site, remove the ShutdownScreen component below
// and uncomment the original App function at the bottom of this file.
// ============================================================

// -- Original imports (preserved for restoration) --
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useEffect, Suspense, lazy } from 'react';
// import Home from '@/pages/Home';
// import ScrollToTop from '@/components/ScrollToTop';
// import LoadingScreen from '@/components/ui/LoadingScreen';
// const Tours = lazy(() => import('@/pages/Tours'));
// const TourDetail = lazy(() => import('@/pages/TourDetail'));
// const DestinationDetail = lazy(() => import('@/pages/DestinationDetail'));
// const RegionDestinations = lazy(() => import('@/pages/RegionDestinations'));
// const Services = lazy(() => import('@/pages/Services'));
// const Transport = lazy(() => import('@/pages/services/Transport'));
// const Hotels = lazy(() => import('@/pages/services/Hotels'));
// const HotelBooking = lazy(() => import('@/pages/services/HotelBooking'));
// const Flights = lazy(() => import('@/pages/services/Flights'));
// const Visa = lazy(() => import('@/pages/services/Visa'));
// const CustomItineraries = lazy(() => import('@/pages/services/CustomItineraries'));
// const Contact = lazy(() => import('@/pages/Contact'));
// const Blog = lazy(() => import('@/pages/Blog'));
// const BlogPost = lazy(() => import('@/pages/BlogPost'));
// const Quiz = lazy(() => import('@/pages/Quiz'));
// const ThemedPackage = lazy(() => import('@/pages/ThemedPackage'));
// const AccommodationCategory = lazy(() => import('@/pages/AccommodationCategory'));
// const AccommodationDetail = lazy(() => import('@/pages/AccommodationDetail'));
// const Company = lazy(() => import('@/pages/Company'));
// const Gallery = lazy(() => import('@/pages/Gallery'));

// -- Shutdown Screen Component --
const ShutdownScreen = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    padding: '2rem',
    boxSizing: 'border-box',
    textAlign: 'center',
  }}>
    {/* Icon */}
    <div style={{
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '2rem',
      border: '2px solid rgba(255,255,255,0.15)',
    }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>

    {/* Heading */}
    <h1 style={{
      color: '#ffffff',
      fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
      fontWeight: '700',
      margin: '0 0 1rem 0',
      lineHeight: '1.3',
      letterSpacing: '-0.02em',
    }}>
      Site Temporarily Unavailable
    </h1>

    {/* Message */}
    <p style={{
      color: 'rgba(255,255,255,0.65)',
      fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)',
      maxWidth: '480px',
      lineHeight: '1.7',
      margin: '0 0 2.5rem 0',
    }}>
      This site has been temporarily shut down by the developer.
    </p>

    {/* WhatsApp Button */}
    <a
      href="https://wa.me/254795544180"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        background: '#25D366',
        color: '#ffffff',
        textDecoration: 'none',
        padding: '0.85rem 2rem',
        borderRadius: '50px',
        fontSize: '1rem',
        fontWeight: '600',
        letterSpacing: '0.01em',
        boxShadow: '0 4px 24px rgba(37,211,102,0.35)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 32px rgba(37,211,102,0.45)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 24px rgba(37,211,102,0.35)';
      }}
    >
      {/* WhatsApp SVG icon */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      Contact Developer
    </a>
  </div>
);

// -- Active App (Shutdown Mode) --
function App() {
  return <ShutdownScreen />;
}

export default App;

// ============================================================
// ORIGINAL APP (commented out — restore by replacing the
// ShutdownScreen App above with the code block below)
// ============================================================

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { useEffect, Suspense, lazy } from 'react';
// import Home from '@/pages/Home';
// import ScrollToTop from '@/components/ScrollToTop';
// import LoadingScreen from '@/components/ui/LoadingScreen';
//
// const CompanyRedirect = ({ section }: { section: string }) => {
//   useEffect(() => {
//     const element = document.getElementById(section);
//     if (element) {
//       setTimeout(() => {
//         const offset = 100;
//         const elementPosition = element.getBoundingClientRect().top;
//         const offsetPosition = elementPosition + window.pageYOffset - offset;
//         window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
//       }, 100);
//     }
//   }, [section]);
//   return <Company />;
// };
//
// function App() {
//   return (
//     <Router>
//       <ScrollToTop />
//       <Suspense fallback={<LoadingScreen />}>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/tours" element={<Tours />} />
//           <Route path="/tours/:id" element={<TourDetail />} />
//           <Route path="/regions/:region" element={<RegionDestinations />} />
//           <Route path="/destinations/:id" element={<DestinationDetail />} />
//           <Route path="/services" element={<Services />} />
//           <Route path="/services/transport" element={<Transport />} />
//           <Route path="/services/hotels" element={<Hotels />} />
//           <Route path="/services/hotel-booking" element={<HotelBooking />} />
//           <Route path="/services/flights" element={<Flights />} />
//           <Route path="/services/airticketing" element={<Flights />} />
//           <Route path="/services/visa" element={<Visa />} />
//           <Route path="/services/custom-itineraries" element={<CustomItineraries />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/blog" element={<Blog />} />
//           <Route path="/blog/:id" element={<BlogPost />} />
//           <Route path="/quiz" element={<Quiz />} />
//           <Route path="/company" element={<Company />} />
//           <Route path="/gallery" element={<Gallery />} />
//           <Route path="/about" element={<CompanyRedirect section="about" />} />
//           <Route path="/calling" element={<CompanyRedirect section="calling" />} />
//           <Route path="/impact" element={<CompanyRedirect section="impact" />} />
//           <Route path="/faqs" element={<CompanyRedirect section="faqs" />} />
//           <Route path="/testimonials" element={<CompanyRedirect section="testimonials" />} />
//           <Route path="/packages/:category" element={<ThemedPackage />} />
//           <Route path="/accommodation/:type" element={<AccommodationCategory />} />
//           <Route path="/accommodation/view/:id" element={<AccommodationDetail />} />
//         </Routes>
//       </Suspense>
//     </Router>
//   );
// }
