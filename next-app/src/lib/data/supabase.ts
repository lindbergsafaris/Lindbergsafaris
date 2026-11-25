import { unstable_cache } from 'next/cache';
import { createSupabasePublicClient } from '../supabase/public';
import { isUUID, slugify } from '../slugUtils';
import { tiptapJsonToHtml } from '../tiptap-html';
import { normalizeImage, normalizeImageList } from './images';
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

const DEFAULT_REVALIDATE = 60;

// ---------------------------------------------------------------------------
// Row -> Domain Mappers (exact parity with Sanity shapes)
// ---------------------------------------------------------------------------

function rowId(row: { id: string; legacy_sanity_id?: string | null }): string {
  return row.legacy_sanity_id || row.id;
}

function mapTour(row: any): Tour {
  return {
    _id: rowId(row),
    title: row.title || '',
    slug: { current: row.slug || (row.title ? slugify(row.title) : '') },
    price: Number(row.price ?? 0),
    location: row.location || '',
    description: row.description || '',
    duration: row.duration || '',
    groupSize: row.group_size || undefined,
    difficulty: row.difficulty || undefined,
    rating: row.rating != null ? Number(row.rating) : undefined,
    reviews: row.reviews != null ? Number(row.reviews) : 0,
    images: normalizeImageList(row.images, row.title || 'Lindberg Safaris'),
    highlights: Array.isArray(row.highlights) ? row.highlights : undefined,
    itinerary: Array.isArray(row.itinerary) ? row.itinerary : undefined,
    included: Array.isArray(row.included) ? row.included : undefined,
    excluded: Array.isArray(row.excluded) ? row.excluded : undefined,
    featured: Boolean(row.featured),
  };
}

function mapBlogPost(row: any, includeContent: boolean): BlogPost {
  return {
    _id: rowId(row),
    title: row.title || '',
    slug: { current: row.slug || (row.title ? slugify(row.title) : '') },
    category: row.category || undefined,
    publishedAt: row.published_at || row.created_at || '',
    featuredImage: normalizeImage(row.featured_image, row.title) || undefined,
    excerpt: row.excerpt || undefined,
    author: row.author || 'Lindberg Safaris',
    readTime: row.read_time || undefined,
    content: includeContent ? tiptapJsonToHtml(row.content) : undefined,
  };
}

function mapAccommodation(row: any, includeAmenities: boolean): Accommodation {
  return {
    _id: rowId(row),
    name: row.name || '',
    type: row.type || undefined,
    location: row.location || undefined,
    description: row.description || undefined,
    pricePerNight: row.price_per_night != null ? Number(row.price_per_night) : undefined,
    image: normalizeImage(row.image, row.name) || undefined,
    rating: row.rating != null ? Number(row.rating) : undefined,
    amenities: includeAmenities && Array.isArray(row.amenities)
      ? row.amenities.map((a: any) => ({
          name: a?.name || '',
          image: normalizeImage(a?.image, a?.name || row.name) || undefined,
        }))
      : undefined,
  };
}

function mapThemedPackage(row: any, includeContent: boolean): ThemedPackage {
  return {
    title: row.title || '',
    slug: { current: row.slug || (row.title ? slugify(row.title) : '') },
    category: row.category || '',
    heroImage: normalizeImage(row.hero_image, row.title) || undefined,
    description: row.description || undefined,
    content: includeContent ? tiptapJsonToHtml(row.content) : undefined,
  };
}

function mapDestinationCategory(row: any): DestinationCategory {
  return {
    _id: rowId(row),
    name: row.name || '',
    slug: row.slug || (row.name ? slugify(row.name) : ''),
    description: row.description || undefined,
    isFeatured: Boolean(row.is_featured),
    image: normalizeImage(row.image, row.name) || undefined,
  };
}

function mapDestinationPost(row: any, includeContent: boolean): DestinationPost {
  return {
    _id: rowId(row),
    title: row.title || '',
    slug: row.slug || (row.title ? slugify(row.title) : ''),
    excerpt: row.excerpt || undefined,
    image: normalizeImage(row.image, row.title) || undefined,
    tourCount: row.tour_count != null ? Number(row.tour_count) : 0,
    content: includeContent ? tiptapJsonToHtml(row.content) : undefined,
  };
}

// ---------------------------------------------------------------------------
// Tours
// ---------------------------------------------------------------------------

export const getTours = unstable_cache(
  async (): Promise<Tour[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('tours')
      .select(
        'id, legacy_sanity_id, title, slug, duration, group_size, price, featured, rating, reviews, images, location, description'
      )
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[supabase:getTours]', error.message);
      return [];
    }
    return (data || []).map(mapTour);
  },
  ['supabase', 'getTours'],
  { tags: ['tour'], revalidate: DEFAULT_REVALIDATE }
);

export async function getTourById(id: string): Promise<Tour | null> {
  return unstable_cache(
    async (): Promise<Tour | null> => {
      const supabase = createSupabasePublicClient();
      const base = supabase.from('tours').select('*').eq('status', 'published');
      const { data, error } = await (
        isUUID(id)
          ? base.or(`id.eq.${id},legacy_sanity_id.eq.${id}`)
          : base.eq('legacy_sanity_id', id)
      ).maybeSingle();

      if (error) {
        console.error('[supabase:getTourById]', error.message);
        return null;
      }
      return data ? mapTour(data) : null;
    },
    ['supabase', 'getTourById', id],
    { tags: ['tour'], revalidate: DEFAULT_REVALIDATE }
  )();
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  return unstable_cache(
    async (): Promise<Tour | null> => {
      const supabase = createSupabasePublicClient();
      let decoded = slug;
      try {
        decoded = decodeURIComponent(slug);
      } catch {
        decoded = slug;
      }
      const candidates = Array.from(new Set([slug, decoded, slugify(decoded)].filter(Boolean)));

      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('status', 'published')
        .in('slug', candidates)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[supabase:getTourBySlug]', error.message);
        return null;
      }
      if (data) return mapTour(data);

      // Fallback: match slugified title or slug
      const { data: all } = await supabase
        .from('tours')
        .select('*')
        .eq('status', 'published');
      const target = slugify(decoded);
      const match = (all || []).find(
        (t: any) => slugify(t.slug || '') === target || slugify(t.title || '') === target
      );
      return match ? mapTour(match) : null;
    },
    ['supabase', 'getTourBySlug', slug],
    { tags: ['tour'], revalidate: DEFAULT_REVALIDATE }
  )();
}

export const getAllTourSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('tours')
      .select('slug, title')
      .eq('status', 'published');
    if (error) {
      console.error('[supabase:getAllTourSlugs]', error.message);
      return [];
    }
    return (data || [])
      .map((t: any) => t.slug || (t.title ? slugify(t.title) : ''))
      .filter(Boolean);
  },
  ['supabase', 'getAllTourSlugs'],
  { tags: ['tour'], revalidate: DEFAULT_REVALIDATE }
);

// ---------------------------------------------------------------------------
// Blog Posts
// ---------------------------------------------------------------------------

export const getBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select(
        'id, legacy_sanity_id, title, slug, excerpt, published_at, created_at, author, category, read_time, featured_image'
      )
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false });

    if (error) {
      console.error('[supabase:getBlogPosts]', error.message);
      return [];
    }
    return (data || []).map((row) => mapBlogPost(row, false));
  },
  ['supabase', 'getBlogPosts'],
  { tags: ['blogPost'], revalidate: DEFAULT_REVALIDATE }
);

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  return unstable_cache(
    async (): Promise<BlogPost | null> => {
      const supabase = createSupabasePublicClient();
      const base = supabase.from('blog_posts').select('*').eq('status', 'published');
      const { data, error } = await (
        isUUID(id)
          ? base.or(`id.eq.${id},legacy_sanity_id.eq.${id}`)
          : base.eq('legacy_sanity_id', id)
      ).maybeSingle();

      if (error) {
        console.error('[supabase:getBlogPostById]', error.message);
        return null;
      }
      return data ? mapBlogPost(data, true) : null;
    },
    ['supabase', 'getBlogPostById', id],
    { tags: ['blogPost'], revalidate: DEFAULT_REVALIDATE }
  )();
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return unstable_cache(
    async (): Promise<BlogPost | null> => {
      const supabase = createSupabasePublicClient();
      let decoded = slug;
      try {
        decoded = decodeURIComponent(slug);
      } catch {
        decoded = slug;
      }
      const candidates = Array.from(new Set([slug, decoded, slugify(decoded)].filter(Boolean)));

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .in('slug', candidates)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[supabase:getBlogPostBySlug]', error.message);
        return null;
      }
      if (data) return mapBlogPost(data, true);

      const { data: all } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published');
      const target = slugify(decoded);
      const match = (all || []).find(
        (b: any) => slugify(b.slug || '') === target || slugify(b.title || '') === target
      );
      return match ? mapBlogPost(match, true) : null;
    },
    ['supabase', 'getBlogPostBySlug', slug],
    { tags: ['blogPost'], revalidate: DEFAULT_REVALIDATE }
  )();
}

export const getAllBlogSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, title')
      .eq('status', 'published');
    if (error) {
      console.error('[supabase:getAllBlogSlugs]', error.message);
      return [];
    }
    return (data || [])
      .map((b: any) => b.slug || (b.title ? slugify(b.title) : ''))
      .filter(Boolean);
  },
  ['supabase', 'getAllBlogSlugs'],
  { tags: ['blogPost'], revalidate: DEFAULT_REVALIDATE }
);

// ---------------------------------------------------------------------------
// Accommodations
// ---------------------------------------------------------------------------

export const getAccommodations = unstable_cache(
  async (): Promise<Accommodation[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('accommodations')
      .select('id, legacy_sanity_id, name, slug, type, location, rating, image, description')
      .eq('status', 'published')
      .order('name', { ascending: true });

    if (error) {
      console.error('[supabase:getAccommodations]', error.message);
      return [];
    }
    return (data || []).map((row) => mapAccommodation(row, false));
  },
  ['supabase', 'getAccommodations'],
  { tags: ['accommodation'], revalidate: DEFAULT_REVALIDATE }
);

export async function getAccommodationsByType(type: string): Promise<Accommodation[]> {
  return unstable_cache(
    async (): Promise<Accommodation[]> => {
      const supabase = createSupabasePublicClient();
      const { data, error } = await supabase
        .from('accommodations')
        .select('id, legacy_sanity_id, name, slug, type, location, rating, image, description')
        .eq('status', 'published')
        .eq('type', type)
        .order('name', { ascending: true });

      if (error) {
        console.error('[supabase:getAccommodationsByType]', error.message);
        return [];
      }
      return (data || []).map((row) => mapAccommodation(row, false));
    },
    ['supabase', 'getAccommodationsByType', type],
    { tags: ['accommodation'], revalidate: DEFAULT_REVALIDATE }
  )();
}

export async function getAccommodationById(id: string): Promise<Accommodation | null> {
  return unstable_cache(
    async (): Promise<Accommodation | null> => {
      const supabase = createSupabasePublicClient();
      const base = supabase
        .from('accommodations')
        .select('id, legacy_sanity_id, name, slug, type, location, rating, image, description, amenities')
        .eq('status', 'published');
      const { data, error } = await (
        isUUID(id)
          ? base.or(`id.eq.${id},legacy_sanity_id.eq.${id}`)
          : base.eq('legacy_sanity_id', id)
      ).maybeSingle();

      if (error) {
        console.error('[supabase:getAccommodationById]', error.message);
        return null;
      }
      return data ? mapAccommodation(data, true) : null;
    },
    ['supabase', 'getAccommodationById', id],
    { tags: ['accommodation'], revalidate: DEFAULT_REVALIDATE }
  )();
}

export async function getAccommodationBySlug(slug: string): Promise<Accommodation | null> {
  return unstable_cache(
    async (): Promise<Accommodation | null> => {
      const supabase = createSupabasePublicClient();
      let decoded = slug;
      try {
        decoded = decodeURIComponent(slug);
      } catch {
        decoded = slug;
      }
      const candidates = Array.from(new Set([slug, decoded, slugify(decoded)].filter(Boolean)));

      const { data, error } = await supabase
        .from('accommodations')
        .select('id, legacy_sanity_id, name, slug, type, location, rating, image, description, amenities')
        .eq('status', 'published')
        .in('slug', candidates)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[supabase:getAccommodationBySlug]', error.message);
        return null;
      }
      if (data) return mapAccommodation(data, true);

      const { data: all } = await supabase
        .from('accommodations')
        .select('id, legacy_sanity_id, name, slug, type, location, rating, image, description, amenities')
        .eq('status', 'published');
      const target = slugify(decoded);
      const match = (all || []).find(
        (a: any) => slugify(a.name || '') === target || slugify(a.slug || '') === target
      );
      return match ? mapAccommodation(match, true) : null;
    },
    ['supabase', 'getAccommodationBySlug', slug],
    { tags: ['accommodation'], revalidate: DEFAULT_REVALIDATE }
  )();
}

export const getAllAccommodationSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('accommodations')
      .select('slug, name')
      .eq('status', 'published');
    if (error) {
      console.error('[supabase:getAllAccommodationSlugs]', error.message);
      return [];
    }
    return (data || [])
      .map((a: any) => a.slug || (a.name ? slugify(a.name) : ''))
      .filter(Boolean);
  },
  ['supabase', 'getAllAccommodationSlugs'],
  { tags: ['accommodation'], revalidate: DEFAULT_REVALIDATE }
);

// ---------------------------------------------------------------------------
// Hot Deals
// ---------------------------------------------------------------------------

const getCachedHotDeals = unstable_cache(
  async (): Promise<HotDeal[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('hot_deals')
      .select('id, legacy_sanity_id, title, whatsapp_number, whatsapp_message, deal_expiry, tag, image')
      .eq('status', 'published')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[supabase:getHotDeals]', error.message);
      return [];
    }

    return (data || []).map((deal: any) => ({
      _id: rowId(deal),
      title: deal.title || '',
      whatsappNumber: deal.whatsapp_number || '',
      whatsappMessage: deal.whatsapp_message || undefined,
      dealExpiry: deal.deal_expiry || '',
      tag: deal.tag || undefined,
      image: normalizeImage(deal.image, deal.title) || {
        url: 'https://res.cloudinary.com/dbqdpitah/image/upload/v1774850774/carousel_nprg6k.jpg',
        alt: deal.title || 'Lindberg Safaris',
      },
    }));
  },
  ['supabase', 'getHotDeals'],
  { tags: ['hotDeal'], revalidate: DEFAULT_REVALIDATE }
);

export async function getHotDeals(): Promise<HotDeal[]> {
  const deals = await getCachedHotDeals();
  const now = new Date();
  return deals.filter((deal) => {
    if (!deal.dealExpiry) return true;
    return new Date(deal.dealExpiry) > now;
  });
}

// ---------------------------------------------------------------------------
// Popup Offer
// ---------------------------------------------------------------------------

const getCachedPopupOffers = unstable_cache(
  async (): Promise<PopupOffer[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('popup_offers')
      .select('id, legacy_sanity_id, title, description, image, cta_text, cta_link, is_active, start_date, end_date')
      .eq('status', 'published')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[supabase:getPopupOffer]', error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      _id: rowId(row),
      title: row.title || '',
      description: row.description || undefined,
      image: normalizeImage(row.image, row.title) || undefined,
      ctaText: row.cta_text || undefined,
      ctaLink: row.cta_link || undefined,
      isActive: Boolean(row.is_active),
      startDate: row.start_date || undefined,
      endDate: row.end_date || undefined,
    }));
  },
  ['supabase', 'getPopupOffer'],
  { tags: ['popupOffer'], revalidate: DEFAULT_REVALIDATE }
);

export async function getPopupOffer(): Promise<PopupOffer | null> {
  const offers = await getCachedPopupOffers();
  const now = new Date();
  const active = offers.find((o) => {
    if (o.startDate && new Date(o.startDate) > now) return false;
    if (o.endDate && new Date(o.endDate) < now) return false;
    return true;
  });
  return active ?? null;
}

// ---------------------------------------------------------------------------
// Packages & Themed Packages
// ---------------------------------------------------------------------------

export const getPackages = unstable_cache(
  async (): Promise<Package[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('packages')
      .select('id, legacy_sanity_id, title, category, duration, price, image, description')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[supabase:getPackages]', error.message);
      return [];
    }
    return (data || []).map((p: any) => ({
      _id: rowId(p),
      title: p.title || '',
      category: p.category || '',
      duration: p.duration || undefined,
      price: p.price != null ? Number(p.price) : undefined,
      image: normalizeImage(p.image, p.title) || undefined,
      description: p.description || undefined,
    }));
  },
  ['supabase', 'getPackages'],
  { tags: ['package'], revalidate: DEFAULT_REVALIDATE }
);

export async function getPackagesByCategory(category: string): Promise<Package[]> {
  return unstable_cache(
    async (): Promise<Package[]> => {
      const supabase = createSupabasePublicClient();
      const { data, error } = await supabase
        .from('packages')
        .select('id, legacy_sanity_id, title, category, duration, price, image, description')
        .eq('status', 'published')
        .eq('category', category)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[supabase:getPackagesByCategory]', error.message);
        return [];
      }
      return (data || []).map((p: any) => ({
        _id: rowId(p),
        title: p.title || '',
        category: p.category || '',
        duration: p.duration || undefined,
        price: p.price != null ? Number(p.price) : undefined,
        image: normalizeImage(p.image, p.title) || undefined,
        description: p.description || undefined,
      }));
    },
    ['supabase', 'getPackagesByCategory', category],
    { tags: ['package'], revalidate: DEFAULT_REVALIDATE }
  )();
}

export async function getThemedPackageByCategory(
  category: string
): Promise<ThemedPackage | null> {
  return unstable_cache(
    async (): Promise<ThemedPackage | null> => {
      const supabase = createSupabasePublicClient();
      const { data, error } = await supabase
        .from('themed_packages')
        .select('id, legacy_sanity_id, title, slug, category, hero_image, description, content')
        .eq('status', 'published')
        .eq('category', category)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[supabase:getThemedPackageByCategory]', error.message);
        return null;
      }
      return data ? mapThemedPackage(data, true) : null;
    },
    ['supabase', 'getThemedPackageByCategory', category],
    { tags: ['themedPackage'], revalidate: DEFAULT_REVALIDATE }
  )();
}

export const getAllThemedPackages = unstable_cache(
  async (): Promise<ThemedPackage[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('themed_packages')
      .select('id, legacy_sanity_id, title, slug, category, hero_image, description')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[supabase:getAllThemedPackages]', error.message);
      return [];
    }
    return (data || []).map((row) => mapThemedPackage(row, false));
  },
  ['supabase', 'getAllThemedPackages'],
  { tags: ['themedPackage'], revalidate: DEFAULT_REVALIDATE }
);

// ---------------------------------------------------------------------------
// Team Members
// ---------------------------------------------------------------------------

export const getTeamMembers = unstable_cache(
  async (): Promise<TeamMember[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('team_members')
      .select('id, legacy_sanity_id, name, role, image, display_order')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[supabase:getTeamMembers]', error.message);
      return [];
    }
    return (data || []).map((m: any) => ({
      _id: rowId(m),
      name: m.name || '',
      role: m.role || '',
      order: m.display_order ?? 0,
      image: normalizeImage(m.image, m.name) || {
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        alt: m.name || 'Team Member',
      },
    }));
  },
  ['supabase', 'getTeamMembers'],
  { tags: ['teamMember'], revalidate: DEFAULT_REVALIDATE }
);

// ---------------------------------------------------------------------------
// Hero Slides
// ---------------------------------------------------------------------------

export const getHeroSlides = unstable_cache(
  async (): Promise<HeroSlide[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('hero_slides')
      .select(
        'id, legacy_sanity_id, title, subtitle, image, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, display_order'
      )
      .eq('status', 'published')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[supabase:getHeroSlides]', error.message);
      return [];
    }
    return (data || []).map((s: any) => ({
      _id: rowId(s),
      title: s.title || '',
      subtitle: s.subtitle || '',
      image: normalizeImage(s.image, s.title)?.url || '',
      primaryButtonText: s.primary_button_text || undefined,
      primaryButtonLink: s.primary_button_link || undefined,
      secondaryButtonText: s.secondary_button_text || undefined,
      secondaryButtonLink: s.secondary_button_link || undefined,
      order: s.display_order ?? 0,
    }));
  },
  ['supabase', 'getHeroSlides'],
  { tags: ['heroSlide'], revalidate: DEFAULT_REVALIDATE }
);

// ---------------------------------------------------------------------------
// Partners
// ---------------------------------------------------------------------------

export const getPartners = unstable_cache(
  async (): Promise<Partner[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('partners')
      .select('id, legacy_sanity_id, name, logo, website, display_order')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[supabase:getPartners]', error.message);
      return [];
    }
    return (data || []).map((p: any) => ({
      _id: rowId(p),
      name: p.name || '',
      logo: normalizeImage(p.logo, p.name)?.url || '',
      website: p.website || undefined,
      order: p.display_order ?? 0,
    }));
  },
  ['supabase', 'getPartners'],
  { tags: ['partner'], revalidate: DEFAULT_REVALIDATE }
);

// ---------------------------------------------------------------------------
// Gallery Images
// ---------------------------------------------------------------------------

export const getGalleryImages = unstable_cache(
  async (): Promise<GalleryImage[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('gallery_images')
      .select('id, legacy_sanity_id, title, location, category, image, display_order')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[supabase:getGalleryImages]', error.message);
      return [];
    }
    return (data || []).map((img: any) => ({
      _id: rowId(img),
      title: img.title || '',
      location: img.location || '',
      category: (img.category || 'wildlife') as GalleryImage['category'],
      imageUrl: normalizeImage(img.image, img.title)?.url || '',
      order: img.display_order ?? 0,
    }));
  },
  ['supabase', 'getGalleryImages'],
  { tags: ['galleryImage'], revalidate: DEFAULT_REVALIDATE }
);

// ---------------------------------------------------------------------------
// Fleet Vehicles
// ---------------------------------------------------------------------------

export const getFleetVehicles = unstable_cache(
  async (): Promise<FleetVehicle[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('fleet_vehicles')
      .select('id, legacy_sanity_id, name, image, display_order')
      .eq('status', 'published')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[supabase:getFleetVehicles]', error.message);
      return [];
    }
    return (data || []).map((v: any) => ({
      _id: rowId(v),
      name: v.name || '',
      imageUrl: normalizeImage(v.image, v.name)?.url || '',
      order: v.display_order ?? 0,
    }));
  },
  ['supabase', 'getFleetVehicles'],
  { tags: ['fleetVehicle'], revalidate: DEFAULT_REVALIDATE }
);

// ---------------------------------------------------------------------------
// Destination Categories (Regions)
// ---------------------------------------------------------------------------

export const getDestinationCategories = unstable_cache(
  async (): Promise<DestinationCategory[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('destination_categories')
      .select('id, legacy_sanity_id, name, slug, description, is_featured, image')
      .eq('status', 'published')
      .order('is_featured', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      console.error('[supabase:getDestinationCategories]', error.message);
      return [];
    }
    const mapped = (data || []).map(mapDestinationCategory);
    return mapped.sort((a, b) => {
      const aFeat = a.isFeatured ? 1 : 0;
      const bFeat = b.isFeatured ? 1 : 0;
      if (bFeat !== aFeat) return bFeat - aFeat;
      return (a.name || '').localeCompare(b.name || '');
    });
  },
  ['supabase', 'getDestinationCategories'],
  { tags: ['destinationCategory'], revalidate: DEFAULT_REVALIDATE }
);

export async function getDestinationCategoryBySlug(
  slug: string
): Promise<DestinationCategory | null> {
  return unstable_cache(
    async (): Promise<DestinationCategory | null> => {
      const supabase = createSupabasePublicClient();
      const { data, error } = await supabase
        .from('destination_categories')
        .select('id, legacy_sanity_id, name, slug, description, is_featured, image')
        .eq('status', 'published')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('[supabase:getDestinationCategoryBySlug]', error.message);
        return null;
      }
      return data ? mapDestinationCategory(data) : null;
    },
    ['supabase', 'getDestinationCategoryBySlug', slug],
    { tags: ['destinationCategory'], revalidate: DEFAULT_REVALIDATE }
  )();
}

// ---------------------------------------------------------------------------
// Destination Posts
// ---------------------------------------------------------------------------

export async function getDestinationPostsByCategory(
  categorySlug: string
): Promise<DestinationPost[]> {
  return unstable_cache(
    async (): Promise<DestinationPost[]> => {
      const supabase = createSupabasePublicClient();
      const { data: cat, error: catError } = await supabase
        .from('destination_categories')
        .select('id')
        .eq('status', 'published')
        .eq('slug', categorySlug)
        .maybeSingle();

      if (catError || !cat) {
        if (catError) console.error('[supabase:getDestinationPostsByCategory]', catError.message);
        return [];
      }

      const { data, error } = await supabase
        .from('destination_posts')
        .select('id, legacy_sanity_id, title, slug, excerpt, image, tour_count')
        .eq('status', 'published')
        .eq('category_id', cat.id)
        .order('title', { ascending: true });

      if (error) {
        console.error('[supabase:getDestinationPostsByCategory]', error.message);
        return [];
      }
      return (data || []).map((row) => mapDestinationPost(row, false));
    },
    ['supabase', 'getDestinationPostsByCategory', categorySlug],
    { tags: ['destinationPost', 'destinationCategory'], revalidate: DEFAULT_REVALIDATE }
  )();
}

export async function getDestinationPostBySlug(
  slug: string
): Promise<DestinationPost | null> {
  return unstable_cache(
    async (): Promise<DestinationPost | null> => {
      const supabase = createSupabasePublicClient();
      let decoded = slug;
      try {
        decoded = decodeURIComponent(slug);
      } catch {
        decoded = slug;
      }
      const altSlug =
        decoded === 'ambosseli-national-park'
          ? 'amboseli-national-park'
          : decoded === 'amboseli-national-park'
          ? 'ambosseli-national-park'
          : decoded;
      const candidates = Array.from(
        new Set([slug, decoded, slugify(decoded), altSlug].filter(Boolean))
      );

      const { data, error } = await supabase
        .from('destination_posts')
        .select('id, legacy_sanity_id, title, slug, excerpt, image, tour_count, content')
        .eq('status', 'published')
        .in('slug', candidates)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[supabase:getDestinationPostBySlug]', error.message);
        return null;
      }
      if (data) return mapDestinationPost(data, true);

      const { data: all } = await supabase
        .from('destination_posts')
        .select('id, legacy_sanity_id, title, slug, excerpt, image, tour_count, content')
        .eq('status', 'published');
      const target = slugify(decoded);
      const match = (all || []).find((p: any) => {
        const pSlug = p.slug || '';
        return (
          pSlug === slug ||
          slugify(pSlug) === target ||
          (target === 'amboseli-national-park' && pSlug === 'ambosseli-national-park')
        );
      });
      return match ? mapDestinationPost(match, true) : null;
    },
    ['supabase', 'getDestinationPostBySlug', slug],
    { tags: ['destinationPost'], revalidate: DEFAULT_REVALIDATE }
  )();
}

export const getAllDestinationSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const supabase = createSupabasePublicClient();
    const { data, error } = await supabase
      .from('destination_posts')
      .select('slug, title')
      .eq('status', 'published');

    if (error) {
      console.error('[supabase:getAllDestinationSlugs]', error.message);
      return [];
    }
    return (data || [])
      .map((d: any) => {
        const raw = d.slug || (d.title ? slugify(d.title) : '');
        return raw === 'ambosseli-national-park' ? 'amboseli-national-park' : raw;
      })
      .filter(Boolean);
  },
  ['supabase', 'getAllDestinationSlugs'],
  { tags: ['destinationPost'], revalidate: DEFAULT_REVALIDATE }
);

// ---------------------------------------------------------------------------
// Redirects lookup
// ---------------------------------------------------------------------------

export async function getRedirectForPath(
  oldPath: string
): Promise<{ new_path: string; status_code: number } | null> {
  return unstable_cache(
    async (): Promise<{ new_path: string; status_code: number } | null> => {
      const supabase = createSupabasePublicClient();
      let decoded = oldPath;
      try {
        decoded = decodeURIComponent(oldPath);
      } catch {
        decoded = oldPath;
      }
      const candidates = Array.from(new Set([oldPath, decoded].filter(Boolean)));
      const { data, error } = await supabase
        .from('redirects')
        .select('new_path, status_code')
        .in('old_path', candidates)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('[supabase:getRedirectForPath]', error.message);
        return null;
      }
      return data ? { new_path: data.new_path, status_code: data.status_code } : null;
    },
    ['supabase', 'getRedirectForPath', oldPath],
    { tags: ['redirects'], revalidate: DEFAULT_REVALIDATE }
  )();
}
