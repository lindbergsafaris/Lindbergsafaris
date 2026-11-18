'use client';

import Script from 'next/script';

const GoogleReviewsWidget = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4 text-white text-shadow-sm">
        Guest Reviews
      </h2>

      <div className="reviews-widget-container min-h-[200px]">
        <div
          className="elfsight-app-ab815ad9-b6ae-466e-af65-87a739d0b122"
          data-elfsight-app-lazy
        />
      </div>

      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="lazyOnload"
      />
    </div>
  );
};

export default GoogleReviewsWidget;
