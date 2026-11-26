import { sanityFetch } from '../sanity';
import { slugify } from '../slugUtils';
import { normalizeImage, normalizeImageList } from './images';
import * as supabaseData from './supabase';
import type {
  Tour,
  BlogPost,
  Accommodation,
  HotDeal,
  PopupOffer,
  Package,
  ThemedPackage,
  TeamMember,
  HeroSlide,
  Partner,
  GalleryImage,
  FleetVehicle,
  DestinationCategory,
  DestinationPost,
} from '@/types';

function useSupabaseSource(): boolean {
  return process.env.CMS_SOURCE === 'supabase';
}

// ---------------------------------------------------------------------------
// Tours
// ---------------------------------------------------------------------------
export async function getTours(): Promise<Tour[]> {
  if (useSupabaseSource()) return supabaseData.getTours();
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
      "url": coalesce(url, asset->url),
      alt
    }
  }`;
  const data = await sanityFetch<Tour[]>({
    query,
    tags: ['tour'],
  });
  return (data || []).map((t) => ({
    ...t,
    images: normalizeImageList(t.images, t.title),
  }));
}

export async function getTourById(id: string): Promise<Tour | null> {
  if (useSupabaseSource()) return supabaseData.getTourById(id);
  const query = `*[_type == "tour" && _id == $id][0] {
    ...,
    "images": images[]{
      "url": coalesce(url, asset->url),
      alt
    },
    "destination": destination->{
      _id,
      name,
      slug
    }
  }`;
  const data = await sanityFetch<Tour | null>({
    query,
    params: { id },
    tags: ['tour'],
  });
  if (!data) return null;
  return {
    ...data,
    images: normalizeImageList(data.images, data.title),
  };
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  if (useSupabaseSource()) return supabaseData.getTourBySlug(slug);
  const decoded = decodeURIComponent(slug);
  const query = `*[_type == "tour" && (slug.current == $slug || slug.current == $decoded)][0] {
    ...,
    "images": images[]{
      "url": coalesce(url, asset->url),
      alt
    },
    "destination": destination->{
      _id,
      name,
      slug
    }
  }`;
  let data = await sanityFetch<Tour | null>({
    query,
    params: { slug, decoded },
    tags: ['tour'],
  });
  if (!data) {
    const allQuery = `*[_type == "tour"] {
      ...,
      "images": images[]{
        "url": coalesce(url, asset->url),
        alt
      },
      "destination": destination->{
        _id,
        name,
        slug
      }
    }`;
    const all = await sanityFetch<Tour[]>({ query: allQuery, tags: ['tour'] });
    data = (all || []).find(t => 
      slugify(t.slug?.current || '') === slugify(slug) || 
      slugify(t.title || '') === slugify(slug)
    ) || null;
  }
  if (!data) return null;
  return {
    ...data,
    images: normalizeImageList(data.images, data.title),
  };
}

export async function getAllTourSlugs(): Promise<string[]> {
  if (useSupabaseSource()) return supabaseData.getAllTourSlugs();
  const query = `*[_type == "tour"]{ "slug": slug.current, title }`;
  const data = await sanityFetch<Array<{ slug?: string; title?: string }>>({
    query,
    tags: ['tour'],
  });
  return (data || [])
    .map((t) => t.slug || (t.title ? slugify(t.title) : ''))
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Blog Posts
// ---------------------------------------------------------------------------
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (useSupabaseSource()) return supabaseData.getBlogPosts();
  const query = `*[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    author,
    category,
    readTime,
    "featuredImage": {
      "url": coalesce(featuredImage.url, featuredImage.asset->url),
      "alt": featuredImage.alt
    }
  }`;
  const data = await sanityFetch<BlogPost[]>({
    query,
    tags: ['blogPost'],
  });
  return (data || []).map((b) => ({
    ...b,
    featuredImage: normalizeImage(b.featuredImage, b.title) || undefined,
  }));
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  if (useSupabaseSource()) return supabaseData.getBlogPostById(id);
  const query = `*[_type == "blogPost" && _id == $id][0] {
    ...,
    "featuredImage": {
      "url": coalesce(featuredImage.url, featuredImage.asset->url),
      "alt": featuredImage.alt
    }
  }`;
  const data = await sanityFetch<BlogPost | null>({
    query,
    params: { id },
    tags: ['blogPost'],
  });
  if (!data) return null;
  return {
    ...data,
    featuredImage: normalizeImage(data.featuredImage, data.title) || undefined,
  };
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (useSupabaseSource()) return supabaseData.getBlogPostBySlug(slug);
  const decoded = decodeURIComponent(slug);
  const query = `*[_type == "blogPost" && (slug.current == $slug || slug.current == $decoded)][0] {
    ...,
    "featuredImage": {
      "url": coalesce(featuredImage.url, featuredImage.asset->url),
      "alt": featuredImage.alt
    }
  }`;
  let data = await sanityFetch<BlogPost | null>({
    query,
    params: { slug, decoded },
    tags: ['blogPost'],
  });
  if (!data) {
    const allQuery = `*[_type == "blogPost"] {
      ...,
      "featuredImage": {
        "url": coalesce(featuredImage.url, featuredImage.asset->url),
        "alt": featuredImage.alt
      }
    }`;
    const all = await sanityFetch<BlogPost[]>({ query: allQuery, tags: ['blogPost'] });
    data = (all || []).find(b =>
      slugify(b.slug?.current || '') === slugify(slug) ||
      slugify(b.title || '') === slugify(slug)
    ) || null;
  }
  if (!data) return null;
  return {
    ...data,
    featuredImage: normalizeImage(data.featuredImage, data.title) || undefined,
  };
}

export async function getAllBlogSlugs(): Promise<string[]> {
  if (useSupabaseSource()) return supabaseData.getAllBlogSlugs();
  const query = `*[_type == "blogPost"]{ "slug": slug.current, title }`;
  const data = await sanityFetch<Array<{ slug?: string; title?: string }>>({
    query,
    tags: ['blogPost'],
  });
  return (data || [])
    .map((b) => b.slug || (b.title ? slugify(b.title) : ''))
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Accommodations
// ---------------------------------------------------------------------------
export async function getAccommodations(): Promise<Accommodation[]> {
  if (useSupabaseSource()) return supabaseData.getAccommodations();
  const query = `*[_type == "accommodation"] | order(name asc) {
    _id,
    name,
    type,
    location,
    pricePerNight,
    rating,
    "image": {
      "url": coalesce(image.url, image.asset->url),
      "alt": image.alt
    },
    description
  }`;
  const data = await sanityFetch<Accommodation[]>({
    query,
    tags: ['accommodation'],
  });
  return (data || []).map((a) => ({
    ...a,
    image: normalizeImage(a.image, a.name) || undefined,
  }));
}

export async function getAccommodationsByType(type: string): Promise<Accommodation[]> {
  if (useSupabaseSource()) return supabaseData.getAccommodationsByType(type);
  const query = `*[_type == "accommodation" && type == $type] | order(name asc) {
    _id,
    name,
    type,
    location,
    pricePerNight,
    rating,
    "image": {
      "url": coalesce(image.url, image.asset->url),
      "alt": image.alt
    },
    description
  }`;
  const data = await sanityFetch<Accommodation[]>({
    query,
    params: { type },
    tags: ['accommodation'],
  });
  return (data || []).map((a) => ({
    ...a,
    image: normalizeImage(a.image, a.name) || undefined,
  }));
}

export async function getAccommodationById(id: string): Promise<Accommodation | null> {
  if (useSupabaseSource()) return supabaseData.getAccommodationById(id);
  const query = `*[_type == "accommodation" && _id == $id][0] {
    _id,
    name,
    type,
    location,
    rating,
    pricePerNight,
    "image": {
      "url": coalesce(image.url, image.asset->url),
      "alt": image.alt
    },
    description,
    amenities[]{
      name,
      image{
        "url": coalesce(url, asset->url),
        alt
      }
    }
  }`;
  const data = await sanityFetch<Accommodation | null>({
    query,
    params: { id },
    tags: ['accommodation'],
  });
  if (!data) return null;
  return {
    ...data,
    image: normalizeImage(data.image, data.name) || undefined,
  };
}

/**
 * Accommodation slug lookup:
 * In Sanity, accommodations do not currently have a dedicated `slug` field.
 * Slugs are dynamically derived from `slugify(name)`.
 */
export async function getAccommodationBySlug(slug: string): Promise<Accommodation | null> {
  if (useSupabaseSource()) return supabaseData.getAccommodationBySlug(slug);
  const query = `*[_type == "accommodation"] {
    _id,
    name,
    type,
    location,
    rating,
    pricePerNight,
    "image": {
      "url": coalesce(image.url, image.asset->url),
      "alt": image.alt
    },
    description,
    amenities[]{
      name,
      image{
        "url": coalesce(url, asset->url),
        alt
      }
    }
  }`;
  const all = await sanityFetch<Accommodation[]>({
    query,
    tags: ['accommodation'],
  });
  const match = (all || []).find((a) => slugify(a.name || '') === slug);
  if (!match) return null;
  return {
    ...match,
    image: normalizeImage(match.image, match.name) || undefined,
  };
}

export async function getAllAccommodationSlugs(): Promise<string[]> {
  if (useSupabaseSource()) return supabaseData.getAllAccommodationSlugs();
  const accs = await getAccommodations();
  return accs.map((a) => slugify(a.name)).filter(Boolean);
}

// ---------------------------------------------------------------------------
// Hot Deals
// ---------------------------------------------------------------------------
export async function getHotDeals(): Promise<HotDeal[]> {
  if (useSupabaseSource()) return supabaseData.getHotDeals();
  const query = `*[_type == "hotDeal" && isActive == true] | order(_createdAt desc) {
    _id,
    title,
    whatsappNumber,
    whatsappMessage,
    dealExpiry,
    tag,
    "image": {
      "url": coalesce(image.url, image.asset->url),
      "alt": image.alt
    }
  }`;
  const data = await sanityFetch<HotDeal[]>({
    query,
    tags: ['hotDeal'],
  });
  const now = new Date();
  return (data || [])
    .filter((deal) => {
      if (!deal.dealExpiry) return true;
      return new Date(deal.dealExpiry) > now;
    })
    .map((deal) => ({
      ...deal,
      image: normalizeImage(deal.image, deal.title) || {
        url: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1774850774/carousel_nprg6k.jpg',
        alt: deal.title,
      },
    }));
}

// ---------------------------------------------------------------------------
// Popup Offer
// ---------------------------------------------------------------------------
export async function getPopupOffer(): Promise<PopupOffer | null> {
  if (useSupabaseSource()) return supabaseData.getPopupOffer();
  const query = `*[_type == "popupOffer" && isActive == true] | order(_createdAt desc)[0] {
    _id,
    title,
    description,
    "image": {
      "url": coalesce(image.url, image.asset->url),
      "alt": image.alt
    },
    ctaText,
    ctaLink,
    isActive
  }`;
  const data = await sanityFetch<PopupOffer | null>({
    query,
    tags: ['popupOffer'],
  });
  if (!data) return null;
  return {
    ...data,
    image: normalizeImage(data.image, data.title) || undefined,
  };
}

// ---------------------------------------------------------------------------
// Packages & Themed Packages
// ---------------------------------------------------------------------------
export async function getPackages(): Promise<Package[]> {
  if (useSupabaseSource()) return supabaseData.getPackages();
  const query = `*[_type == "package"] | order(_createdAt desc) {
    _id,
    title,
    category,
    duration,
    price,
    "image": {
      "url": coalesce(image.url, image.asset->url),
      "alt": image.alt
    },
    description
  }`;
  const data = await sanityFetch<Package[]>({
    query,
    tags: ['package'],
  });
  return (data || []).map((p) => ({
    ...p,
    image: normalizeImage(p.image, p.title) || undefined,
  }));
}

export async function getPackagesByCategory(category: string): Promise<Package[]> {
  if (useSupabaseSource()) return supabaseData.getPackagesByCategory(category);
  const query = `*[_type == "package" && category == $category] | order(_createdAt desc) {
    _id,
    title,
    category,
    duration,
    price,
    "image": {
      "url": coalesce(image.url, image.asset->url),
      "alt": image.alt
    },
    description
  }`;
  const data = await sanityFetch<Package[]>({
    query,
    params: { category },
    tags: ['package'],
  });
  return (data || []).map((p) => ({
    ...p,
    image: normalizeImage(p.image, p.title) || undefined,
  }));
}

export async function getThemedPackageByCategory(category: string): Promise<ThemedPackage | null> {
  if (useSupabaseSource()) return supabaseData.getThemedPackageByCategory(category);
  const query = `*[_type == "themedPackage" && category == $category][0] {
    title,
    category,
    "heroImage": {
      "url": coalesce(heroImage.url, heroImage.asset->url),
      "alt": heroImage.alt
    },
    description,
    content
  }`;
  const data = await sanityFetch<ThemedPackage | null>({
    query,
    params: { category },
    tags: ['themedPackage'],
  });
  if (!data) return null;
  return {
    ...data,
    heroImage: normalizeImage(data.heroImage, data.title) || undefined,
  };
}

export async function getAllThemedPackages(): Promise<ThemedPackage[]> {
  if (useSupabaseSource()) return supabaseData.getAllThemedPackages();
  const query = `*[_type == "themedPackage"] | order(_createdAt desc) {
    title,
    slug,
    category,
    "heroImage": {
      "url": coalesce(heroImage.url, heroImage.asset->url),
      "alt": heroImage.alt
    },
    description
  }`;
  const data = await sanityFetch<ThemedPackage[]>({
    query,
    tags: ['themedPackage'],
  });
  return (data || []).map((p) => ({
    ...p,
    heroImage: normalizeImage(p.heroImage, p.title) || undefined,
  }));
}

// ---------------------------------------------------------------------------
// Team Members
// ---------------------------------------------------------------------------
export async function getTeamMembers(): Promise<TeamMember[]> {
  if (useSupabaseSource()) return supabaseData.getTeamMembers();
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
  const data = await sanityFetch<TeamMember[]>({
    query,
    tags: ['teamMember'],
  });
  return (data || []).map((m) => ({
    ...m,
    image: normalizeImage(m.image, m.name) || {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      alt: m.name,
    },
  }));
}

// ---------------------------------------------------------------------------
// Hero Slides
// ---------------------------------------------------------------------------
export async function getHeroSlides(): Promise<HeroSlide[]> {
  if (useSupabaseSource()) return supabaseData.getHeroSlides();
  const query = `*[_type == "heroSlide"] | order(order asc, _createdAt desc) {
    _id,
    title,
    subtitle,
    "image": coalesce(image.url, image.asset->url, image),
    primaryButtonText,
    primaryButtonLink,
    secondaryButtonText,
    secondaryButtonLink,
    order
  }`;
  const data = await sanityFetch<HeroSlide[]>({
    query,
    tags: ['heroSlide'],
  });
  return (data || []).map((s) => ({
    ...s,
    image: normalizeImage(s.image, s.title)?.url || (typeof s.image === 'string' ? s.image : ''),
  }));
}

// ---------------------------------------------------------------------------
// Partners
// ---------------------------------------------------------------------------
export async function getPartners(): Promise<Partner[]> {
  if (useSupabaseSource()) return supabaseData.getPartners();
  const query = `*[_type == "partner"] | order(order asc, _createdAt desc) {
    _id,
    name,
    "logo": coalesce(logo.url, logo.asset->url, logo),
    website,
    order
  }`;
  const data = await sanityFetch<Partner[]>({
    query,
    tags: ['partner'],
  });
  return (data || []).map((p) => ({
    ...p,
    logo: normalizeImage(p.logo, p.name)?.url || (typeof p.logo === 'string' ? p.logo : ''),
  }));
}

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------
export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (useSupabaseSource()) return supabaseData.getGalleryImages();
  const query = `*[_type == "galleryImage"] | order(order asc, _createdAt desc) {
    _id,
    title,
    location,
    category,
    "imageUrl": coalesce(imageUrl.url, imageUrl.asset->url, imageUrl),
    order
  }`;
  const data = await sanityFetch<GalleryImage[]>({
    query,
    tags: ['galleryImage'],
  });
  return (data || []).map((img) => ({
    ...img,
    imageUrl: normalizeImage(img.imageUrl, img.title)?.url || (typeof img.imageUrl === 'string' ? img.imageUrl : ''),
  }));
}

// ---------------------------------------------------------------------------
// Fleet Vehicles
// ---------------------------------------------------------------------------
export async function getFleetVehicles(): Promise<FleetVehicle[]> {
  if (useSupabaseSource()) return supabaseData.getFleetVehicles();
  const query = `*[_type == "fleetVehicle"] | order(order asc, _createdAt desc) {
    _id,
    name,
    "imageUrl": coalesce(imageUrl.url, imageUrl.asset->url, imageUrl),
    order
  }`;
  const data = await sanityFetch<FleetVehicle[]>({
    query,
    tags: ['fleetVehicle'],
  });
  return (data || []).map((v) => ({
    ...v,
    imageUrl: normalizeImage(v.imageUrl, v.name)?.url || (typeof v.imageUrl === 'string' ? v.imageUrl : ''),
  }));
}

// ---------------------------------------------------------------------------
// Destination Categories (Regions)
// ---------------------------------------------------------------------------
export async function getDestinationCategories(): Promise<DestinationCategory[]> {
  if (useSupabaseSource()) return supabaseData.getDestinationCategories();
  const query = `*[_type == "destinationCategory"] | order(isFeatured desc, name asc) {
    _id,
    name,
    "slug": slug.current,
    description,
    isFeatured,
    "image": {
      "url": coalesce(imageUrl, image.asset->url, image.url),
      "alt": name
    }
  }`;
  const data = await sanityFetch<DestinationCategory[]>({
    query,
    tags: ['destinationCategory'],
  });
  const sorted = (data || []).sort((a, b) => {
    const aFeat = a.isFeatured ? 1 : 0;
    const bFeat = b.isFeatured ? 1 : 0;
    if (bFeat !== aFeat) return bFeat - aFeat;
    return (a.name || '').localeCompare(b.name || '');
  });
  return sorted.map((c) => ({
    ...c,
    image: normalizeImage(c.image, c.name) || undefined,
  }));
}

export async function getDestinationCategoryBySlug(slug: string): Promise<DestinationCategory | null> {
  if (useSupabaseSource()) return supabaseData.getDestinationCategoryBySlug(slug);
  const query = `*[_type == "destinationCategory" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    description,
    "image": {
      "url": coalesce(imageUrl, image.asset->url, image.url),
      "alt": name
    }
  }`;
  const data = await sanityFetch<DestinationCategory | null>({
    query,
    params: { slug },
    tags: ['destinationCategory'],
  });
  if (!data) return null;
  return {
    ...data,
    image: normalizeImage(data.image, data.name) || undefined,
  };
}

// ---------------------------------------------------------------------------
// Destination Posts
// ---------------------------------------------------------------------------
export async function getDestinationPostsByCategory(categorySlug: string): Promise<DestinationPost[]> {
  if (useSupabaseSource()) return supabaseData.getDestinationPostsByCategory(categorySlug);
  const query = `*[_type == "destinationPost" && category->slug.current == $categorySlug] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "image": {
      "url": coalesce(imageUrl, image.asset->url, image.url),
      "alt": title
    },
    tourCount
  }`;
  const data = await sanityFetch<DestinationPost[]>({
    query,
    params: { categorySlug },
    tags: ['destinationPost'],
  });
  return (data || []).map((p) => ({
    ...p,
    image: normalizeImage(p.image, p.title) || undefined,
  }));
}

export async function getDestinationPostBySlug(slug: string): Promise<DestinationPost | null> {
  if (useSupabaseSource()) return supabaseData.getDestinationPostBySlug(slug);
  const query = `*[_type == "destinationPost" && (slug.current == $slug || slug.current == $altSlug)][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "image": {
      "url": coalesce(imageUrl, image.asset->url, image.url),
      "alt": title
    },
    tourCount,
    content
  }`;
  // Map typo variants (e.g. amboseli <-> ambosseli)
  const altSlug = slug === 'amboseli-national-park' ? 'ambosseli-national-park' : slug;
  let data = await sanityFetch<DestinationPost | null>({
    query,
    params: { slug, altSlug },
    tags: ['destinationPost'],
  });

  if (!data) {
    const allQuery = `*[_type == "destinationPost"] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      "image": {
        "url": coalesce(imageUrl, image.asset->url, image.url),
        "alt": title
      },
      tourCount,
      content
    }`;
    const all = await sanityFetch<DestinationPost[]>({ query: allQuery, tags: ['destinationPost'] });
    data = (all || []).find((p) => {
      const pSlug = p.slug || '';
      return (
        pSlug === slug ||
        slugify(pSlug) === slugify(slug) ||
        (slug === 'amboseli-national-park' && pSlug === 'ambosseli-national-park')
      );
    }) || null;
  }

  if (!data) return null;
  return {
    ...data,
    image: normalizeImage(data.image, data.title) || undefined,
  };
}

export async function getAllDestinationSlugs(): Promise<string[]> {
  if (useSupabaseSource()) return supabaseData.getAllDestinationSlugs();
  const query = `*[_type == "destinationPost"]{ "slug": slug.current, title }`;
  const data = await sanityFetch<Array<{ slug?: string; title?: string }>>({
    query,
    tags: ['destinationPost'],
  });
  return (data || [])
    .map((d) => {
      const raw = d.slug || (d.title ? slugify(d.title) : '');
      return raw === 'ambosseli-national-park' ? 'amboseli-national-park' : raw;
    })
    .filter(Boolean);
}

// ---------------------------------------------------------------------------
// Redirects (Supabase CMS redirects table)
// ---------------------------------------------------------------------------
export async function getRedirectForPath(
  oldPath: string
): Promise<{ new_path: string; status_code: number } | null> {
  if (!useSupabaseSource()) return null;
  return supabaseData.getRedirectForPath(oldPath);
}
