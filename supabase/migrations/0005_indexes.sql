-- ============================================================================
-- Migration: 0005_indexes.sql
-- Description: Create performance indexes across all 16 tables covering slugs,
--              status filtering, foreign keys, sorting orders, and legacy IDs.
-- ============================================================================

-- 1. Profiles & Redirects Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_redirects_old_path ON redirects(old_path);

-- 2. Destination Categories Indexes
CREATE INDEX IF NOT EXISTS idx_dest_categories_slug ON destination_categories(slug);
CREATE INDEX IF NOT EXISTS idx_dest_categories_status_pub ON destination_categories(status, published_at);
CREATE INDEX IF NOT EXISTS idx_dest_categories_featured ON destination_categories(is_featured) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_dest_categories_legacy_sanity_id ON destination_categories(legacy_sanity_id);

-- 3. Destination Posts Indexes
CREATE INDEX IF NOT EXISTS idx_dest_posts_slug ON destination_posts(slug);
CREATE INDEX IF NOT EXISTS idx_dest_posts_category ON destination_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_dest_posts_status_pub ON destination_posts(status, published_at);
CREATE INDEX IF NOT EXISTS idx_dest_posts_legacy_sanity_id ON destination_posts(legacy_sanity_id);

-- 4. Themed Packages Indexes
CREATE INDEX IF NOT EXISTS idx_themed_packages_slug ON themed_packages(slug);
CREATE INDEX IF NOT EXISTS idx_themed_packages_category ON themed_packages(category);
CREATE INDEX IF NOT EXISTS idx_themed_packages_status_pub ON themed_packages(status, published_at);
CREATE INDEX IF NOT EXISTS idx_themed_packages_legacy_sanity_id ON themed_packages(legacy_sanity_id);

-- 5. Packages Indexes
CREATE INDEX IF NOT EXISTS idx_packages_slug ON packages(slug);
CREATE INDEX IF NOT EXISTS idx_packages_category ON packages(category);
CREATE INDEX IF NOT EXISTS idx_packages_themed_package ON packages(themed_package_id);
CREATE INDEX IF NOT EXISTS idx_packages_status_pub ON packages(status, published_at);
CREATE INDEX IF NOT EXISTS idx_packages_order ON packages(display_order);
CREATE INDEX IF NOT EXISTS idx_packages_legacy_sanity_id ON packages(legacy_sanity_id);

-- 6. Tours Indexes
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_status_pub ON tours(status, published_at);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(featured) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_tours_legacy_sanity_id ON tours(legacy_sanity_id);

-- 7. Blog Posts Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_pub ON blog_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_legacy_sanity_id ON blog_posts(legacy_sanity_id);

-- 8. Accommodations Indexes
CREATE INDEX IF NOT EXISTS idx_accommodations_slug ON accommodations(slug);
CREATE INDEX IF NOT EXISTS idx_accommodations_type ON accommodations(type);
CREATE INDEX IF NOT EXISTS idx_accommodations_status_pub ON accommodations(status, published_at);
CREATE INDEX IF NOT EXISTS idx_accommodations_legacy_sanity_id ON accommodations(legacy_sanity_id);

-- 9. Hot Deals Indexes
CREATE INDEX IF NOT EXISTS idx_hot_deals_status_expiry ON hot_deals(status, is_active, deal_expiry);
CREATE INDEX IF NOT EXISTS idx_hot_deals_legacy_sanity_id ON hot_deals(legacy_sanity_id);

-- 10. Popup Offers Indexes
CREATE INDEX IF NOT EXISTS idx_popup_offers_status_dates ON popup_offers(status, is_active, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_popup_offers_legacy_sanity_id ON popup_offers(legacy_sanity_id);

-- 11. Team Members Indexes
CREATE INDEX IF NOT EXISTS idx_team_members_order ON team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_legacy_sanity_id ON team_members(legacy_sanity_id);

-- 12. Hero Slides Indexes
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides(display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_hero_slides_legacy_sanity_id ON hero_slides(legacy_sanity_id);

-- 13. Partners Indexes
CREATE INDEX IF NOT EXISTS idx_partners_order ON partners(display_order);
CREATE INDEX IF NOT EXISTS idx_partners_legacy_sanity_id ON partners(legacy_sanity_id);

-- 14. Gallery Images Indexes
CREATE INDEX IF NOT EXISTS idx_gallery_images_category_order ON gallery_images(category, display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_legacy_sanity_id ON gallery_images(legacy_sanity_id);

-- 15. Fleet Vehicles Indexes
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_order ON fleet_vehicles(display_order);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_legacy_sanity_id ON fleet_vehicles(legacy_sanity_id);
