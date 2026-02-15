import { useEffect, useRef } from 'react';

const TrustIndexWidget = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Create script element
        const script = document.createElement('script');
        script.src = "https://cdn.trustindex.io/loader.js?b51220164a4785796896ea261fd";
        script.async = true;
        script.defer = true;

        // Append to specific container instead of body
        containerRef.current.appendChild(script);

        return () => {
            // Cleanup: remove script from container
            if (containerRef.current && script.parentNode === containerRef.current) {
                containerRef.current.removeChild(script);
            }
        };
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-8 text-primary">Testimonials</h2>

            {/* 
               The container where the script will be injected.
               TrustIndex loader scripts often inject the widget relative to the script tag location.
               By putting the script inside this div, the widget should render here.
            */}
            <div
                ref={containerRef}
                className="trustindex-widget-container min-h-[300px]"
            >
                {/* Script will be injected here by useEffect */}
            </div>
        </div>
    );
};

export default TrustIndexWidget;
