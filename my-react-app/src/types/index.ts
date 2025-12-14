export interface Image {
    url: string;
    publicId?: string;
}

export interface Tour {
    _id: string;
    title: string;
    slug?: string;
    images: Image[];
    duration: string;
    groupSize?: string;
    price: number | string;
    rating?: number;
    reviews?: number;
    featured?: boolean;
    description?: string;
    location?: string;
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
