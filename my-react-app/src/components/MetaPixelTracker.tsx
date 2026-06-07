import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Declare fbq on window for TypeScript
declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

/**
 * Tracks SPA route changes and fires Meta Pixel PageView events.
 * The initial PageView is handled by the base pixel code in index.html,
 * so this component only fires on subsequent navigations.
 */
const MetaPixelTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Fire PageView on every route change
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [location.pathname]);

  return null;
};

export default MetaPixelTracker;
