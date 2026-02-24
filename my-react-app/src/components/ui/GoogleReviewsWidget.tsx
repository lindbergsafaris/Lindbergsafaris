import { useEffect, useRef } from 'react';

const GoogleReviewsWidget = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Create script element
        const script = document.createElement('script');
        script.src = "https://elfsightcdn.com/platform.js";
        script.async = true;

        // Append to container
        containerRef.current.appendChild(script);

        return () => {
            // Cleanup: remove script from container
            if (containerRef.current && script.parentNode === containerRef.current) {
                containerRef.current.removeChild(script);
            }
        };
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4 text-white text-shadow-sm">Guest Reviews</h2>

            <div ref={containerRef} className="reviews-widget-container min-h-[200px]">
                <div
                    className="elfsight-app-ab815ad9-b6ae-466e-af65-87a739d0b122"
                    data-elfsight-app-lazy
                />
            </div>
        </div>
    );
};

export default GoogleReviewsWidget;
