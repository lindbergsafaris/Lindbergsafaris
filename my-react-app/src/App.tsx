import { BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import MetaPixelTracker from '@/components/MetaPixelTracker';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <MetaPixelTracker />
      <AppRoutes />
    </Router>
  );
}

export default App;
