export interface Image {
    url: string;
    publicId?: string;
    alt?: string;
}

export interface Tour {
    _id: string;
    title: string;
    slug: { current: string };
    price: number;
    location: string;
    description: string;
    duration: string;
    groupSize?: string;
    difficulty?: string;
    rating?: number;
    reviews?: number;
    images?: Image[];
    highlights?: string[];
    itinerary?: {
        day: number;
        title: string;
        description: string;
        accommodation?: string;
        meals?: string;
    }[];
    included?: string[];
    excluded?: string[];
    featured?: boolean;
}

export interface HotDeal {
    _id: string;
    title: string;
    tag?: string;
    image: Image;
    originalPrice?: number | string;
    price: number | string;
    duration?: string;
    description?: string;
}

export interface Partner {
    name: string;
    logo: string;
}

export interface Region {
    id: string;
    title: string;
    description: string;
    image: string;
}

export interface PopupOffer {
    _id: string;
    title: string;
    description?: string;
    image?: Image;
    ctaText?: string;
    ctaLink?: string;
    isActive?: boolean;
    startDate?: string;
    endDate?: string;
}

export interface SubDestination {
    id: string;
    name: string;
    image: string;
    tourCount: number;
}

export interface PlaceToVisit {
    title: string;
    description: string;
    image: string;
}

export interface AccommodationSection {
    title: string;
    content?: string;
    images?: Image[];
}

export interface Service {
    _id: string;
    title: string;
    slug: { current: string };
    description: string;
    icon?: string;
    image?: Image;
    features?: string[];
    order?: number;
}

export interface Package {
    _id: string;
    title: string;
    slug: { current: string };
    category: string;
    description?: string;
    image?: Image;
    price?: number;
    duration?: string;
}

export interface Destination {
    _id: string;
    name: string;
    slug: { current: string };
    tagline?: string;
    description: string;
    heroImage?: Image;
    cardImage?: Image;
    highlights?: string[];
    bestTimeToVisit?: string;
    visaInfo?: string;
    currency?: string;
    language?: string;
    tourCount?: number;
    placesToVisit?: PlaceToVisit[];
    practicalInfo?: {
        bestTime?: string;
        visaInfo?: string;
        currency?: string;
        language?: string;
    };
}

export interface FAQ {
    _id: string;
    question: string;
    answer: string;
    order?: number;
}



export interface Accommodation {
    _id: string;
    name: string;
    type?: string;
    location?: string;
    description?: string;
    image?: Image;
    rating?: number;
    pricePerNight?: string;
    priceRange?: string;
    amenities?: string[];
    gallery?: Image[];
    sections?: AccommodationSection[];
}

export interface BlogPost {
    _id: string;
    title: string;
    slug: { current: string };
    category?: string;
    publishedAt: string;
    featuredImage?: Image;
    excerpt?: string;
    author?: string;
    content: string;
    readTime?: string;
}
