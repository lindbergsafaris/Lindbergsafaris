-- ============================================================================
-- Migration: 0002_tables.sql
-- Description: Create all 16 core relational tables for Lindberg Safaris CMS,
--              including constraints, types, foreign keys, and metadata.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Profiles (CMS Administrative Users)
-- Role has no default. Profiles created exclusively via admin invite server route.
-- ----------------------------------------------------------------------------
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 2. Redirects (Legacy UUIDs, Old Slugs, Dirty Path Preservation)
-- ----------------------------------------------------------------------------
CREATE TABLE redirects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    old_path TEXT NOT NULL UNIQUE,
    new_path TEXT NOT NULL,
    status_code INTEGER NOT NULL DEFAULT 301 CHECK (status_code IN (301, 302, 307, 308)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. Destination Categories (Geographic Regions: Europe, Kenya, Africa, etc.)
-- ----------------------------------------------------------------------------
CREATE TABLE destination_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    description TEXT,
    image JSONB CHECK (image IS NULL OR (jsonb_typeof(image) = 'object' AND image ? 'url' AND image->>'url' IS NOT NULL AND length(trim(image->>'url')) > 0)),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    legacy_sanity_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 4. Destination Posts (Specific Parks & Locations: Maasai Mara, France, etc.)
-- ----------------------------------------------------------------------------
CREATE TABLE destination_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES destination_categories(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    excerpt TEXT,
    image JSONB CHECK (image IS NULL OR (jsonb_typeof(image) = 'object' AND image ? 'url' AND image->>'url' IS NOT NULL AND length(trim(image->>'url')) > 0)),
    tour_count INTEGER NOT NULL DEFAULT 0 CHECK (tour_count >= 0),
    content JSONB NOT NULL DEFAULT '{"type":"doc","content":[]}'::jsonb,
    seo_title TEXT,
    seo_description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    legacy_sanity_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 5. Themed Packages (Thematic Landing Pages: Wildlife, Climbing, Cruise, etc.)
-- ----------------------------------------------------------------------------
CREATE TABLE themed_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    category TEXT NOT NULL UNIQUE CHECK (category IN ('wildlife', 'climbing', 'cruise', 'adventure', 'pilgrimages', 'corporate')),
    hero_image JSONB NOT NULL CHECK (jsonb_typeof(hero_image) = 'object' AND hero_image ? 'url' AND hero_image->>'url' IS NOT NULL AND length(trim(hero_image->>'url')) > 0),
    description TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{"type":"doc","content":[]}'::jsonb,
    seo_title TEXT,
    seo_description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    legacy_sanity_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 6. Packages (Individual Tour Packages Belonging to a Themed Category)
-- ----------------------------------------------------------------------------
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    themed_package_id UUID REFERENCES themed_packages(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    category TEXT NOT NULL CHECK (category IN ('wildlife', 'climbing', 'cruise', 'adventure', 'pilgrimages', 'corporate')),
    duration TEXT,
    price NUMERIC(12, 2) CHECK (price >= 0),
    currency TEXT NOT NULL DEFAULT 'KES' CHECK (currency IN ('KES','USD','EUR')),
    image JSONB CHECK (image IS NULL OR (jsonb_typeof(image) = 'object' AND image ? 'url' AND image->>'url' IS NOT NULL AND length(trim(image->>'url')) > 0)),
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    seo_title TEXT,
    seo_description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    legacy_sanity_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 7. Tours (Guided Safari & Vacation Itineraries)
-- ----------------------------------------------------------------------------
CREATE TABLE tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    duration TEXT NOT NULL,
    group_size TEXT,
    difficulty TEXT CHECK (difficulty IN ('easy', 'moderate', 'challenging')),
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    currency TEXT NOT NULL DEFAULT 'KES' CHECK (currency IN ('KES','USD','EUR')),
    rating NUMERIC(2, 1) CHECK (rating >= 0 AND rating <= 5),
    reviews INTEGER NOT NULL DEFAULT 0 CHECK (reviews >= 0),
    images JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(images) = 'array'),
    highlights TEXT[] NOT NULL DEFAULT '{}',
    itinerary JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(itinerary) = 'array'),
    included TEXT[] NOT NULL DEFAULT '{}',
    excluded TEXT[] NOT NULL DEFAULT '{}',
    featured BOOLEAN NOT NULL DEFAULT false,
    seo_title TEXT,
    seo_description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    legacy_sanity_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 8. Blog Posts (Editorial Articles & Travel Tips)
-- ----------------------------------------------------------------------------
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    excerpt TEXT NOT NULL,
    content JSONB NOT NULL DEFAULT '{"type":"doc","content":[]}'::jsonb,
    featured_image JSONB CHECK (featured_image IS NULL OR (jsonb_typeof(featured_image) = 'object' AND featured_image ? 'url' AND featured_image->>'url' IS NOT NULL AND length(trim(featured_image->>'url')) > 0)),
    author TEXT NOT NULL DEFAULT 'Lindberg Safaris',
    category TEXT NOT NULL,
    read_time TEXT,
    seo_title TEXT,
    seo_description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    legacy_sanity_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 9. Accommodations (Lodges, Luxury Camps, Hotels)
-- ----------------------------------------------------------------------------
CREATE TABLE accommodations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    type TEXT NOT NULL CHECK (type IN ('lodges', 'holiday-homes', 'town-hotels', 'luxury-camps', 'resort-hotels', 'bush-camps')),
    location TEXT,
    description TEXT,
    image JSONB CHECK (image IS NULL OR (jsonb_typeof(image) = 'object' AND image ? 'url' AND image->>'url' IS NOT NULL AND length(trim(image->>'url')) > 0)),
    rating NUMERIC(2, 1) CHECK (rating >= 1 AND rating <= 5),
    amenities JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(amenities) = 'array'),
    sections JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(sections) = 'array'),
    seo_title TEXT,
    seo_description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    legacy_sanity_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 10. Hot Deals (Time-Sensitive WhatsApp Promotions)
-- ----------------------------------------------------------------------------
CREATE TABLE hot_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    image JSONB NOT NULL CHECK (jsonb_typeof(image) = 'object' AND image ? 'url' AND image->>'url' IS NOT NULL AND length(trim(image->>'url')) > 0),
    whatsapp_number TEXT NOT NULL DEFAULT '+254743377948',
    whatsapp_message TEXT,
    deal_expiry TIMESTAMPTZ NOT NULL,
    tag TEXT NOT NULL DEFAULT 'ON SALE',
    is_active BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    legacy_sanity_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 11. Popup Offers (Promotional Modal Overlays)
-- ----------------------------------------------------------------------------
CREATE TABLE popup_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image JSONB CHECK (image IS NULL OR (jsonb_typeof(image) = 'object' AND image ? 'url' AND image->>'url' IS NOT NULL AND length(trim(image->>'url')) > 0)),
    cta_text TEXT NOT NULL DEFAULT 'Claim Offer',
    cta_link TEXT NOT NULL DEFAULT '/contact',
    is_active BOOLEAN NOT NULL DEFAULT true,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    legacy_sanity_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 12. Team Members (Company Staff Profiles)
-- ----------------------------------------------------------------------------
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    image JSONB CHECK (image IS NULL OR (jsonb_typeof(image) = 'object' AND image ? 'url' AND image->>'url' IS NOT NULL AND length(trim(image->>'url')) > 0)),
    display_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    legacy_sanity_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 13. Hero Slides (Homepage Carousel Slides)
-- ----------------------------------------------------------------------------
CREATE TABLE hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    image JSONB NOT NULL CHECK (jsonb_typeof(image) = 'object' AND image ? 'url' AND image->>'url' IS NOT NULL AND length(trim(image->>'url')) > 0),
    primary_button_text TEXT,
    primary_button_link TEXT,
    secondary_button_text TEXT,
    secondary_button_link TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    legacy_sanity_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 14. Partners (Affiliates, Accreditations & Certifications)
-- ----------------------------------------------------------------------------
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo JSONB NOT NULL CHECK (jsonb_typeof(logo) = 'object' AND logo ? 'url' AND logo->>'url' IS NOT NULL AND length(trim(logo->>'url')) > 0),
    website TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    legacy_sanity_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 15. Gallery Images (Photo Gallery Grid)
-- ----------------------------------------------------------------------------
CREATE TABLE gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    location TEXT,
    category TEXT NOT NULL CHECK (category IN ('wildlife', 'scenery', 'tours', 'accommodations', 'adventures')),
    image JSONB NOT NULL CHECK (jsonb_typeof(image) = 'object' AND image ? 'url' AND image->>'url' IS NOT NULL AND length(trim(image->>'url')) > 0),
    display_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    legacy_sanity_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 16. Fleet Vehicles (Safari Cruisers, Vans & Luxury Vehicles)
-- ----------------------------------------------------------------------------
CREATE TABLE fleet_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    image JSONB NOT NULL CHECK (jsonb_typeof(image) = 'object' AND image ? 'url' AND image->>'url' IS NOT NULL AND length(trim(image->>'url')) > 0),
    display_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    legacy_sanity_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
