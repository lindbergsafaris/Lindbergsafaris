import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    keywords?: string;
    schema?: object | object[];
    noindex?: boolean;
}

const SITE_NAME = "Lindberg Safaris";
const DOMAIN = "https://lindbergsafaris.com";
const DEFAULT_IMAGE = "https://res.cloudinary.com/dbqdpitah/image/upload/v1774850774/carousel_nprg6k.jpg";
const DEFAULT_DESCRIPTION = "Experience tailor-made luxury safaris, wildlife adventures, and bespoke holidays in Kenya, Tanzania, Uganda, and Rwanda with Lindberg Safaris.";
const DEFAULT_KEYWORDS = "Kenya safari, East Africa safaris, Masai Mara tour, luxury safari Kenya, Lindberg Safaris, African wildlife safaris, Kenya holiday packages";

const SEO: React.FC<SEOProps> = ({
    title,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    url,
    type = 'website',
    keywords = DEFAULT_KEYWORDS,
    schema,
    noindex = false,
}) => {
    let locationPath = '';
    try {
        const location = useLocation();
        locationPath = location.pathname;
    } catch {
        // Fallback for non-router contexts during rendering if any
        locationPath = '';
    }

    const canonicalUrl = url || `${DOMAIN}${locationPath.startsWith('/') ? locationPath : `/${locationPath}`}`;

    const formattedTitle = title.toLowerCase().includes(SITE_NAME.toLowerCase())
        ? title
        : `${title} | ${SITE_NAME}`;

    const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{formattedTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={formattedTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@LindbergSafaris" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={formattedTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Structured Data (JSON-LD) */}
            {schemas.map((s, index) => (
                <script key={index} type="application/ld+json">
                    {JSON.stringify(s)}
                </script>
            ))}
        </Helmet>
    );
};

export default SEO;

