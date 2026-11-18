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
  whatsappNumber: string;
  whatsappMessage?: string;
  dealExpiry: string;
}

export interface Partner {
  _id?: string;
  name: string;
  logo: string | Image;
  website?: string;
  order?: number;
}

export interface Region {
  id: string;
  title: string;
  description: string;
  image: string | Image;
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

export interface PlaceToVisit {
  title: string;
  description: string;
  image: string;
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
  content?: any;
}

export interface Amenity {
  name: string;
  image?: Image;
}

export interface Accommodation {
  _id: string;
  name: string;
  type?: string;
  location?: string;
  description?: string;
  pricePerNight?: number;
  image?: Image;
  rating?: number;
  amenities?: Amenity[];
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
  content: any;
  readTime?: string;
}

export interface HeroSlide {
  _id: string;
  image: string | Image;
  title: string;
  subtitle: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  order?: number;
}

export interface GalleryImage {
  _id: string;
  title: string;
  location: string;
  category: 'wildlife' | 'tours' | 'scenery';
  imageUrl: string;
  order?: number;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: Image;
  order?: number;
}

export interface FleetVehicle {
  _id: string;
  name: string;
  imageUrl: string | Image;
  order?: number;
}

export interface DestinationCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isFeatured?: boolean;
  image?: Image;
}

export interface DestinationPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: Image;
  tourCount?: number;
  content?: any;
}

export interface ThemedPackage {
  title: string;
  slug?: { current: string };
  category: string;
  heroImage?: Image;
  description?: string;
  content?: any;
}

export interface Package {
  _id: string;
  title: string;
  category: string;
  duration?: string;
  price?: number;
  image?: Image;
  description?: string;
}
