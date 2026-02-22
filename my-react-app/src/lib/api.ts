import { client } from './sanity';

/**
 * API Client for Lindberg Safaris (Direct Sanity)
 */

// Tours API
export const toursAPI = {
    getAll: async () => {
        const query = `*[_type == "tour"] | order(_createdAt desc) {
            _id,
            title,
            slug,
            duration,
            groupSize,
            price,
            featured,
            rating,
            reviews,
            "images": images[]{
                url,
                alt
            }
        }`;
        const data = await client.fetch(query);
        return { data }; // Keeping { data } structure to minimize component changes
    },

    getById: async (id: string) => {
        const query = `*[_type == "tour" && _id == $id][0] {
            ...,
            "images": images[]{
                url,
                alt
            },
            "destination": destination->{
                _id,
                name,
                slug
            }
        }`;
        const data = await client.fetch(query, { id });
        return { data };
    },
};


// Blog API
export const blogAPI = {
    getAll: async () => {
        const query = `*[_type == "blogPost"] | order(publishedAt desc) {
            _id,
            title,
            slug,
            excerpt,
            publishedAt,
            author,
            category,
            readTime,
            "featuredImage": featuredImage{
                url,
                alt
            }
        }`;
        const data = await client.fetch(query);
        return { data };
    },

    getById: async (id: string) => {
        const query = `*[_type == "blogPost" && _id == $id][0] {
            ...,
            "featuredImage": featuredImage{
                url,
                alt
            }
        }`;
        const data = await client.fetch(query, { id });
        return { data };
    },
};



// Accommodations API
export const accommodationsAPI = {
    getAll: async () => {
        const query = `*[_type == "accommodation"] | order(name asc) {
            _id,
            name,
            type,
            location,
            pricePerNight,
            rating,
            "image": image{
                url,
                alt
            },
            description
        }`;
        const data = await client.fetch(query);
        return { data };
    },
    getByType: async (type: string) => {
        const query = `*[_type == "accommodation" && type == $type] | order(name asc) {
            _id,
            name,
            type,
            location,
            pricePerNight,
            rating,
            "image": image{
                url,
                alt
            },
            description
        }`;
        const data = await client.fetch(query, { type });
        return { data };
    },
    getById: async (id: string) => {
        const query = `*[_type == "accommodation" && _id == $id][0] {
            _id,
            name,
            type,
            location,
            pricePerNight,
            rating,
            "image": image{
                url,
                alt
            },
            description,
            amenities,
            "gallery": gallery[]{
                url,
                alt
            }
        }`;
        const data = await client.fetch(query, { id });
        return { data };
    },
};

export const hotDealsAPI = {
    getAll: async () => {
        const query = `*[_type == "hotDeal" && isActive == true] | order(_createdAt desc) {
            _id,
            title,
            whatsappNumber,
            whatsappMessage,
            dealExpiry,
            tag,
            "image": image{
                url,
                alt
            }
        }`;
        const data = await client.fetch(query);
        return { data };
    },
};

// Pop-up Offer API
export const popupAPI = {
    getAll: async () => {
        const query = `*[_type == "popupOffer" && isActive == true] | order(_createdAt desc)[0] {
            _id,
            title,
            description,
            "image": image {
                asset->,
                url,
                alt
            },
            ctaText,
            ctaLink,
            isActive
        }`;
        return await client.fetch(query);
    }
};



// Packages API
export const packagesAPI = {
    getAll: async () => {
        const query = `*[_type == "package"] | order(_createdAt desc) {
            _id,
            title,
            category,
            duration,
            price,
            "image": image{
                url,
                alt
            },
            description
        }`;
        const data = await client.fetch(query);
        return { data };
    },
    getByCategory: async (category: string) => {
        const query = `*[_type == "package" && category == $category] | order(_createdAt desc) {
            _id,
            title,
            category,
            duration,
            price,
            "image": image{
                url,
                alt
            },
            description
        }`;
        const data = await client.fetch(query, { category });
        return { data };
    },
};

// Services API
export const servicesAPI = {
    getAll: async () => {
        const query = `*[_type == "service"] | order(_createdAt desc) {
            _id,
            title,
            description,
            icon,
            features
        }`;
        const data = await client.fetch(query);
        return { data };
    },
};

// Themed Packages API
export const themedPackageAPI = {
    getByCategory: async (category: string) => {
        const query = `*[_type == "themedPackage" && category == $category][0] {
            title,
            category,
            "heroImage": heroImage{
                url,
                alt
            },
            description,
            content
        }`;
        const data = await client.fetch(query, { category });
        return { data };
    },
    getAll: async () => {
        const query = `*[_type == "themedPackage"] | order(_createdAt desc) {
            title,
            slug,
            category,
            "heroImage": heroImage{
                url,
                alt
            },
            description
        }`;
        const data = await client.fetch(query);
        return { data };
    }
};

// Team Members API
export const teamMemberAPI = {
    getAll: async () => {
        const query = `*[_type == "teamMember"] | order(order asc, _createdAt desc) {
            _id,
            name,
            role,
            "image": {
                "url": coalesce(image.url, image.asset->url),
                "alt": image.alt
            },
            order
        }`;
        const data = await client.fetch(query);
        return { data };
    }
};

// Health check (Stub for compatibility)
export const healthCheck = async () => {
    return { success: true, message: 'Frontend-only mode' };
};

// Destination Categories API (Regions)
export const destinationCategoryAPI = {
    getAll: async () => {
        const query = `*[_type == "destinationCategory"] | order(isFeatured desc, name asc) {
            _id,
            name,
            "slug": slug.current,
            description,
            isFeatured,
            "image": {
                "url": coalesce(imageUrl, image.asset->url)
            }
        }`;
        const data = await client.fetch(query);
        // Sort featured categories to the top (frontend sort for reliable null handling)
        const sorted = (data || []).sort((a: any, b: any) => {
            const aFeat = a.isFeatured ? 1 : 0;
            const bFeat = b.isFeatured ? 1 : 0;
            if (bFeat !== aFeat) return bFeat - aFeat;
            return (a.name || '').localeCompare(b.name || '');
        });
        return { data: sorted };
    },
    getBySlug: async (slug: string) => {
        const query = `*[_type == "destinationCategory" && slug.current == $slug][0] {
            _id,
            name,
            "slug": slug.current,
            description,
            "image": {
                "url": coalesce(imageUrl, image.asset->url)
            }
        }`;
        const data = await client.fetch(query, { slug });
        return { data };
    }
};

// Destination Posts API (Blogs/Destinations)
export const destinationPostAPI = {
    getByCategory: async (categorySlug: string) => {
        const query = `*[_type == "destinationPost" && category->slug.current == $categorySlug] | order(title asc) {
            _id,
            title,
            "slug": slug.current,
            excerpt,
            "image": {
                "url": coalesce(imageUrl, image.asset->url)
            },
            tourCount
        }`;
        const data = await client.fetch(query, { categorySlug });
        return { data };
    },
    getBySlug: async (slug: string) => {
        const query = `*[_type == "destinationPost" && slug.current == $slug][0] {
            _id,
            title,
            "slug": slug.current,
            excerpt,
            "image": {
                "url": coalesce(imageUrl, image.asset->url)
            },
            tourCount,
            content
        }`;
        const data = await client.fetch(query, { slug });
        return { data };
    }
};

export default {
    tours: toursAPI,
    blog: blogAPI,
    accommodations: accommodationsAPI,
    hotDeals: hotDealsAPI,
    popup: popupAPI,
    packages: packagesAPI,
    services: servicesAPI,
    themedPackages: themedPackageAPI,
    teamMember: teamMemberAPI,
    destinationCategory: destinationCategoryAPI,
    destinationPost: destinationPostAPI,
    healthCheck,
};

