import { SITE_NAME } from './siteConfig';

export interface RouteMetadata {
    title: string;
    description: string;
    h1: string;
    keywords?: string;
    canonical?: string;
    noindex?: boolean;
}

/**
 * Ensures text is strictly between minLen and maxLen characters.
 * Trims only at word boundaries and appends clean punctuation.
 */
export function clampDescription(text: string, minLen = 120, maxLen = 158): string {
    let clean = (text || '')
        .replace(/\s+/g, ' ')
        .replace(/affordable/gi, 'fair value')
        .trim();

    if (clean.length > maxLen) {
        const truncated = clean.slice(0, maxLen);
        const lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > minLen - 20) {
            clean = truncated.slice(0, lastSpace).replace(/[,;:.\s-]+$/, '') + '.';
        } else {
            clean = truncated.trim().replace(/[,;:.\s-]+$/, '') + '.';
        }
    }

    if (clean.length < minLen) {
        const cta = " Book your tailor-made experience with Lindberg Safaris today.";
        const full = clean.replace(/\.*$/, '') + '.' + cta;
        if (full.length <= maxLen && full.length >= minLen) {
            clean = full;
        } else if (full.length > maxLen) {
            clean = clampDescription(full, minLen, maxLen);
        } else {
            // pad slightly if still too short
            clean = (clean.replace(/\.*$/, '') + '. Inquire with Lindberg Safaris for customized packages.').slice(0, maxLen);
        }
    }

    return clean;
}

/**
 * Formats page titles to be strictly 30 to 60 characters:
 * "Keyword First | Brand Last"
 */
export function formatTitle(title: string): string {
    const brand = SITE_NAME; // "Lindberg Safaris"
    const cleaned = (title || '')
        .replace(/&amp;/g, '&')
        .replace(/\|.*$/g, '')
        .trim();

    const withBrand = `${cleaned} | ${brand}`;
    if (withBrand.length <= 60 && withBrand.length >= 30) {
        return withBrand;
    }

    if (withBrand.length > 60) {
        const maxClean = 60 - ` | ${brand}`.length;
        const shortened = cleaned.slice(0, maxClean).trim().replace(/[,;:\s-]+$/, '');
        return `${shortened} | ${brand}`;
    }

    // < 30 chars
    const extended = `${cleaned} Kenya & East Africa | ${brand}`;
    if (extended.length <= 60) return extended;
    return withBrand;
}

/**
 * Route-specific meta descriptions conforming to 120–160 chars.
 */
export function getMetaDescription(routeType: string, data?: any): string {
    // 1. If CMS record has description between 120 and 160 chars, use it (ensuring no 'affordable')
    if (data?.description && typeof data.description === 'string') {
        const d = data.description.trim().replace(/affordable/gi, 'fair value');
        if (d.length >= 120 && d.length <= 160) {
            return d;
        }
    }

    switch (routeType) {
        case 'home':
            return "Tailor-made luxury safaris, wildlife adventures, and holiday packages in Kenya, Tanzania, Uganda & Rwanda. Book your East Africa dream trip with Lindberg Safaris.";

        case 'services':
            return "Full suite of Kenya travel services: safari transport, flight ticketing, visa assistance, hotel booking, and custom itineraries. Plan your trip with us.";

        case 'services/airticketing':
        case 'services/flights':
            return "Seamless air ticketing, domestic bush flights, and international cruise bookings in Kenya. Expert travel coordination with Lindberg Safaris. Inquire now.";

        case 'services/hotel-booking':
            return "Best rates on safari lodges, beach resorts, city hotels, and private villas in Kenya, East Africa & worldwide. Expert booking with Lindberg Safaris.";

        case 'services/hotels':
            return "Book top-rated safari lodges, tented camps, town hotels, and beachfront resorts across Kenya and Tanzania with Lindberg Safaris. Plan your stay.";

        case 'services/transport':
            return "Reliable safari transport services in Kenya — custom 4x4 Land Cruisers, Nairobi airport transfers, chauffeur drive, and overland tour vehicles. Book today.";

        case 'services/visa':
            return "Hassle-free visa assistance for Schengen, US, UK, Australia, Dubai, and East Africa travel. Expert guidance for a smooth application. Contact Lindberg Safaris.";

        case 'services/custom-itineraries':
            return "Tailor-made safari itineraries across Kenya, Tanzania & East Africa — Great Migration circuits, luxury lodge routes, and coastal beach extensions. Plan now.";

        case 'packages': {
            const cat = data?.category || data?.name || 'Safari';
            const catFormatted = cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ');
            return clampDescription(
                `Curated ${catFormatted} holiday packages across East Africa. Expert safari guides, wildlife game drives, and handpicked luxury camps. Reserve with Lindberg Safaris.`
            );
        }

        case 'accommodation-category': {
            const type = data?.type || 'lodges';
            const typeMap: Record<string, string> = {
                'lodges': "Book safari lodges inside Kenya's top national parks — Masai Mara, Amboseli, Tsavo. Comfortable stays steps from big five wildlife. Reserve with Lindberg Safaris.",
                'holiday-homes': "Exclusive private villas and holiday homes for families and groups in Kenya. Self-catering beach cottages, garden retreats, and secluded estate properties.",
                'town-hotels': "Convenient and comfortable city hotels in Nairobi, Mombasa, and Arusha. Business-friendly stays, airport hotels, and boutique properties. Book today.",
                'luxury-camps': "Glamping at its finest — 5-star luxury tented camps in the Masai Mara, Serengeti, and beyond. Private plunge pools, gourmet dining, and guided game drives.",
                'resort-hotels': "Beachfront resort hotels on the Kenyan coast, Zanzibar, and Indian Ocean islands. Pools, spas, and all-inclusive packages for your perfect tropical holiday.",
                'bush-camps': "Authentic mobile bush camps and permanent wilderness campsites in Kenya's remotest reserves. Immersive nature experiences with expert guides. Book with us."
            };
            return typeMap[type] || "Discover the perfect places to stay across East Africa — luxury tented camps, safari lodges, private villas, and beachfront resorts. Book with Lindberg Safaris.";
        }

        case 'accommodation-detail': {
            const name = data?.name || 'Safari Lodge';
            const loc = data?.location ? ` in ${data.location}` : ' in East Africa';
            const raw = data?.description ? `${name}${loc}: ${data.description}` : `Book your luxury stay at ${name}${loc}. Enjoy world-class hospitality, gourmet dining, and direct safari access with Lindberg Safaris.`;
            return clampDescription(raw);
        }

        case 'regions': {
            const region = data?.name || 'East Africa';
            return clampDescription(
                `Explore top safari destinations, national parks, and wildlife reserves in ${region} with Lindberg Safaris. Custom itineraries and expert safari guides.`
            );
        }

        case 'destinations': {
            const dest = data?.title || data?.name || 'Kenya Destination';
            const raw = data?.description || data?.excerpt
                ? `${dest}: ${data.description || data.excerpt}`
                : `Plan your safari adventure to ${dest} with Lindberg Safaris. Discover iconic wildlife, premier game lodges, and unforgettable wilderness tours.`;
            return clampDescription(raw);
        }

        case 'tours':
            return "Explore our curated collection of Kenya safaris, Masai Mara tours, Tanzania wildlife safaris, and custom East African holiday packages with expert guides.";

        case 'tour-detail': {
            const title = data?.title || 'East Africa Safari Tour';
            const duration = data?.duration ? ` (${data.duration})` : '';
            const raw = data?.description
                ? `${title}${duration}: ${data.description}`
                : `Experience ${title}${duration} with Lindberg Safaris. Handpicked safari lodges, professional wildlife guides, and all transport included. Book today.`;
            return clampDescription(raw);
        }

        case 'blog':
            return "Read expert Kenya safari travel guides, wildlife photography tips, itinerary planning advice, and safari stories from Lindberg Safaris. Get inspired.";

        case 'blog-detail': {
            const title = data?.title || 'Safari Story';
            const raw = data?.excerpt
                ? `${title}: ${data.excerpt}`
                : `Read "${title}" on Lindberg Safaris. Expert travel tips, wildlife insights, and practical safari guidance for East Africa travelers.`;
            return clampDescription(raw);
        }

        case 'company':
            return "Learn about Lindberg Safaris, our story, values, conservation impact, expert guides, and commitment to luxury African safari experiences. Contact us.";

        case 'gallery':
            return "Explore our stunning photo gallery capturing Kenya wildlife, lion sightings, elephant herds, coastal safaris, and high-end fleet transport. Get inspired.";

        case 'contact':
            return "Contact Lindberg Safaris to plan your customized Kenya safari, book wildlife tours, or inquire about luxury holidays in East Africa. Get in touch.";

        case 'quiz':
            return "Take our quick safari quiz to find your ideal Kenya safari, wildlife adventure, or luxury holiday package matched to your travel preferences.";

        default:
            return "Experience tailor-made luxury safaris, wildlife adventures, and bespoke holidays in Kenya, Tanzania, Uganda, and Rwanda with Lindberg Safaris. Book today.";
    }
}

/**
 * Standardized H1 headings with primary keywords.
 */
export function getPageH1(routeType: string, data?: any): string {
    switch (routeType) {
        case 'home':
            return data?.title || "Luxury Kenya Safaris & Tailor-Made East Africa Tours";
        case 'services':
            return "Safari & Travel Services in Kenya";
        case 'services/airticketing':
        case 'services/flights':
            return "Air & Cruise Ticketing Services in Kenya";
        case 'services/hotel-booking':
            return "Hotel Booking & Safari Lodge Reservations";
        case 'services/hotels':
            return "Hotels & Accommodation Booking in Kenya";
        case 'services/transport':
            return "Safari Transport Services in Kenya";
        case 'services/visa':
            return "Visa Application Assistance in Kenya";
        case 'services/custom-itineraries':
            return "Custom Safari Itineraries in Kenya & East Africa";
        case 'packages': {
            const cat = data?.category || data?.name || 'Safari';
            const catFormatted = cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ');
            return `${catFormatted} Safari Packages in East Africa`;
        }
        case 'accommodation-category': {
            const type = data?.type || 'lodges';
            const typeMap: Record<string, string> = {
                'lodges': "Safari Lodges in Kenya & East Africa",
                'holiday-homes': "Holiday Homes & Private Villas in Kenya",
                'town-hotels': "Town Hotels in Nairobi, Mombasa & Arusha",
                'luxury-camps': "Luxury Tented Camps in Kenya & Tanzania",
                'resort-hotels': "Beach Resort Hotels in Kenya & Zanzibar",
                'bush-camps': "Bush Camps & Wilderness Camps in Kenya"
            };
            return typeMap[type] || "Safari Accommodation in East Africa";
        }
        case 'accommodation-detail':
            return data?.name ? `${data.name}` : "Safari Accommodation";
        case 'regions': {
            const region = data?.name || 'East Africa';
            return `${region} Safari Destinations & Tours`;
        }
        case 'destinations': {
            const dest = data?.title || data?.name || 'Destination';
            return `${dest} Safari Travel Guide`;
        }
        case 'tours':
            return "Safari Tours & Holiday Packages in East Africa";
        case 'tour-detail':
            return data?.title || "Safari Tour Package";
        case 'blog':
            return "Kenya Safari Journal & Travel Blog";
        case 'blog-detail':
            return data?.title || "Safari Journal Article";
        case 'company':
            return "About Lindberg Safaris — Kenya Tour Operator";
        case 'gallery':
            return "African Safari Wildlife & Travel Gallery";
        case 'contact':
            return "Contact Lindberg Safaris | Plan Your Safari";
        case 'quiz':
            return "Find Your Perfect Safari Quiz";
        default:
            return "Lindberg Safaris — East Africa Safari Specialists";
    }
}

/**
 * Standardized SEO titles (30 to 60 characters).
 */
export function getPageTitle(routeType: string, data?: any): string {
    switch (routeType) {
        case 'home':
            return "Kenya Safaris & East Africa Tours | Lindberg Safaris";
        case 'services':
            return "Safari & Travel Services Kenya | Lindberg Safaris";
        case 'services/airticketing':
        case 'services/flights':
            return "Air & Cruise Ticketing in Kenya | Lindberg Safaris";
        case 'services/hotel-booking':
            return "Hotel Booking & Lodge Stays | Lindberg Safaris";
        case 'services/hotels':
            return "Safari Hotels & Lodges Kenya | Lindberg Safaris";
        case 'services/transport':
            return "Safari Transport & Car Hire | Lindberg Safaris";
        case 'services/visa':
            return "Visa Application Assistance | Lindberg Safaris";
        case 'services/custom-itineraries':
            return "Custom Safari Itineraries | Lindberg Safaris";
        case 'packages': {
            const cat = data?.category || data?.name || 'Holiday';
            const catFormatted = cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ');
            return formatTitle(`${catFormatted} Packages`);
        }
        case 'accommodation-category': {
            const type = data?.type || 'lodges';
            const map: Record<string, string> = {
                'lodges': "Safari Lodges in East Africa",
                'holiday-homes': "Holiday Homes & Private Villas Kenya",
                'town-hotels': "Town Hotels Nairobi & Mombasa",
                'luxury-camps': "Luxury Tented Camps Kenya",
                'resort-hotels': "Beach Resort Hotels Kenya",
                'bush-camps': "Bush Camps in Kenya"
            };
            return formatTitle(map[type] || "Safari Accommodation");
        }
        case 'accommodation-detail':
            return formatTitle(data?.name || "Safari Accommodation");
        case 'regions':
            return formatTitle(`${data?.name || 'Africa'} Safaris & Tours`);
        case 'destinations':
            return formatTitle(`${data?.title || data?.name || 'Safari'} Guide`);
        case 'tours':
            return "East Africa Safari Tours | Lindberg Safaris";
        case 'tour-detail':
            return formatTitle(data?.title || "Safari Tour");
        case 'blog':
            return "Safari Journal & Travel Guides | Lindberg Safaris";
        case 'blog-detail':
            return formatTitle(data?.title || "Safari Story");
        case 'company':
            return "About Lindberg Safaris | East Africa Tour Operator";
        case 'gallery':
            return "Safari Photo Gallery | African Wildlife Pictures";
        case 'contact':
            return "Contact Lindberg Safaris | Plan Your African Trip";
        case 'quiz':
            return "Find Your Perfect Safari Quiz | Lindberg Safaris";
        default:
            return "Lindberg Safaris | East Africa Safari Holidays";
    }
}
