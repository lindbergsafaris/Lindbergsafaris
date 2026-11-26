-- ============================================================================
-- Migration: 0004_rls_policies.sql
-- Description: Enable Row Level Security (RLS) on all 16 tables and apply
--              strict access policies for public, editor, and admin roles.
-- ============================================================================

-- ============================================================================
-- 1. Enable RLS on All Tables
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE destination_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE themed_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hot_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE popup_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_vehicles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. Policies for `profiles`
--    - Users can read their own row; only admins can read all rows
--    - No client-side inserts (service role only)
--    - Users can update their own row (name, avatar), but NO user can change their own role
--    - Only admins can change roles or update other profiles
--    - Only admins can delete profiles
-- ============================================================================

-- SELECT: Users read own row; Admins read all rows. Anon has no access.
CREATE POLICY "profiles_select" 
ON profiles FOR SELECT 
TO authenticated 
USING (id = auth.uid() OR private.is_cms_admin());

-- UPDATE:
-- If updating own profile: role must match existing role in database (no self-role-change).
-- If updating another user's profile: caller must be an admin.
CREATE POLICY "profiles_update" 
ON profiles FOR UPDATE 
TO authenticated 
USING (id = auth.uid() OR private.is_cms_admin())
WITH CHECK (
    (id = auth.uid() AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()))
    OR
    (id <> auth.uid() AND private.is_cms_admin())
);

-- DELETE: Only Admins can delete profiles (and admins cannot delete their own profile)
CREATE POLICY "profiles_delete" 
ON profiles FOR DELETE 
TO authenticated 
USING (private.is_cms_admin() AND id <> auth.uid());

-- NOTE: No INSERT policy is created for profiles. Client-side inserts are denied by default.
-- Profiles are created exclusively by the admin-invite server route using the service role.

-- ============================================================================
-- 3. Policies for `redirects`
--    - Public (anon + authenticated) can read all active redirects
--    - CMS staff (editor + admin) can create, update, and delete redirects
-- ============================================================================
CREATE POLICY "redirects_select_public" 
ON redirects FOR SELECT 
TO anon, authenticated 
USING (true);

CREATE POLICY "redirects_insert_staff" ON redirects FOR INSERT TO authenticated WITH CHECK (private.is_cms_user());
CREATE POLICY "redirects_update_staff" ON redirects FOR UPDATE TO authenticated USING (private.is_cms_user()) WITH CHECK (private.is_cms_user());
CREATE POLICY "redirects_delete_admin" ON redirects FOR DELETE TO authenticated USING (private.is_cms_admin());

-- ============================================================================
-- 4. Policies for Content Tables (14 tables)
--    - Public (anon + authenticated): Read published rows only (published_at <= now())
--    - CMS Staff (editor + admin): Read all rows (draft, published, archived)
--    - CMS Staff (editor + admin): Insert and Update rows
--    - CMS Admin Only: Delete rows (editors cannot delete content)
-- ============================================================================

-- Helper macro applied systematically to each content table:

-- ----------------------------------------------------------------------------
-- 4.1 Destination Categories
-- ----------------------------------------------------------------------------
CREATE POLICY "destination_categories_select_public" 
ON destination_categories FOR SELECT 
TO anon, authenticated 
USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "destination_categories_select_staff" 
ON destination_categories FOR SELECT 
TO authenticated 
USING (private.is_cms_user());

CREATE POLICY "destination_categories_insert_staff" 
ON destination_categories FOR INSERT 
TO authenticated 
WITH CHECK (private.is_cms_user());

CREATE POLICY "destination_categories_update_staff" 
ON destination_categories FOR UPDATE 
TO authenticated 
USING (private.is_cms_user())
WITH CHECK (private.is_cms_user());

CREATE POLICY "destination_categories_delete_admin" 
ON destination_categories FOR DELETE 
TO authenticated 
USING (private.is_cms_admin());

-- ----------------------------------------------------------------------------
-- 4.2 Destination Posts
-- ----------------------------------------------------------------------------
CREATE POLICY "destination_posts_select_public" 
ON destination_posts FOR SELECT 
TO anon, authenticated 
USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "destination_posts_select_staff" 
ON destination_posts FOR SELECT 
TO authenticated 
USING (private.is_cms_user());

CREATE POLICY "destination_posts_insert_staff" 
ON destination_posts FOR INSERT 
TO authenticated 
WITH CHECK (private.is_cms_user());

CREATE POLICY "destination_posts_update_staff" 
ON destination_posts FOR UPDATE 
TO authenticated 
USING (private.is_cms_user())
WITH CHECK (private.is_cms_user());

CREATE POLICY "destination_posts_delete_admin" 
ON destination_posts FOR DELETE 
TO authenticated 
USING (private.is_cms_admin());

-- ----------------------------------------------------------------------------
-- 4.3 Themed Packages
-- ----------------------------------------------------------------------------
CREATE POLICY "themed_packages_select_public" 
ON themed_packages FOR SELECT 
TO anon, authenticated 
USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "themed_packages_select_staff" 
ON themed_packages FOR SELECT 
TO authenticated 
USING (private.is_cms_user());

CREATE POLICY "themed_packages_insert_staff" 
ON themed_packages FOR INSERT 
TO authenticated 
WITH CHECK (private.is_cms_user());

CREATE POLICY "themed_packages_update_staff" 
ON themed_packages FOR UPDATE 
TO authenticated 
USING (private.is_cms_user())
WITH CHECK (private.is_cms_user());

CREATE POLICY "themed_packages_delete_admin" 
ON themed_packages FOR DELETE 
TO authenticated 
USING (private.is_cms_admin());

-- ----------------------------------------------------------------------------
-- 4.4 Packages
-- ----------------------------------------------------------------------------
CREATE POLICY "packages_select_public" 
ON packages FOR SELECT 
TO anon, authenticated 
USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "packages_select_staff" 
ON packages FOR SELECT 
TO authenticated 
USING (private.is_cms_user());

CREATE POLICY "packages_insert_staff" 
ON packages FOR INSERT 
TO authenticated 
WITH CHECK (private.is_cms_user());

CREATE POLICY "packages_update_staff" 
ON packages FOR UPDATE 
TO authenticated 
USING (private.is_cms_user())
WITH CHECK (private.is_cms_user());

CREATE POLICY "packages_delete_admin" 
ON packages FOR DELETE 
TO authenticated 
USING (private.is_cms_admin());

-- ----------------------------------------------------------------------------
-- 4.5 Tours
-- ----------------------------------------------------------------------------
CREATE POLICY "tours_select_public" 
ON tours FOR SELECT 
TO anon, authenticated 
USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "tours_select_staff" 
ON tours FOR SELECT 
TO authenticated 
USING (private.is_cms_user());

CREATE POLICY "tours_insert_staff" 
ON tours FOR INSERT 
TO authenticated 
WITH CHECK (private.is_cms_user());

CREATE POLICY "tours_update_staff" 
ON tours FOR UPDATE 
TO authenticated 
USING (private.is_cms_user())
WITH CHECK (private.is_cms_user());

CREATE POLICY "tours_delete_admin" 
ON tours FOR DELETE 
TO authenticated 
USING (private.is_cms_admin());

-- ----------------------------------------------------------------------------
-- 4.6 Blog Posts
-- ----------------------------------------------------------------------------
CREATE POLICY "blog_posts_select_public" 
ON blog_posts FOR SELECT 
TO anon, authenticated 
USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "blog_posts_select_staff" 
ON blog_posts FOR SELECT 
TO authenticated 
USING (private.is_cms_user());

CREATE POLICY "blog_posts_insert_staff" 
ON blog_posts FOR INSERT 
TO authenticated 
WITH CHECK (private.is_cms_user());

CREATE POLICY "blog_posts_update_staff" 
ON blog_posts FOR UPDATE 
TO authenticated 
USING (private.is_cms_user())
WITH CHECK (private.is_cms_user());

CREATE POLICY "blog_posts_delete_admin" 
ON blog_posts FOR DELETE 
TO authenticated 
USING (private.is_cms_admin());

-- ----------------------------------------------------------------------------
-- 4.7 Accommodations
-- ----------------------------------------------------------------------------
CREATE POLICY "accommodations_select_public" 
ON accommodations FOR SELECT 
TO anon, authenticated 
USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "accommodations_select_staff" 
ON accommodations FOR SELECT 
TO authenticated 
USING (private.is_cms_user());

CREATE POLICY "accommodations_insert_staff" 
ON accommodations FOR INSERT 
TO authenticated 
WITH CHECK (private.is_cms_user());

CREATE POLICY "accommodations_update_staff" 
ON accommodations FOR UPDATE 
TO authenticated 
USING (private.is_cms_user())
WITH CHECK (private.is_cms_user());

CREATE POLICY "accommodations_delete_admin" 
ON accommodations FOR DELETE 
TO authenticated 
USING (private.is_cms_admin());

-- ----------------------------------------------------------------------------
-- 4.8 Hot Deals
-- ----------------------------------------------------------------------------
CREATE POLICY "hot_deals_select_public" 
ON hot_deals FOR SELECT 
TO anon, authenticated 
USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "hot_deals_select_staff" 
ON hot_deals FOR SELECT 
TO authenticated 
USING (private.is_cms_user());

CREATE POLICY "hot_deals_insert_staff" 
ON hot_deals FOR INSERT 
TO authenticated 
WITH CHECK (private.is_cms_user());

CREATE POLICY "hot_deals_update_staff" 
ON hot_deals FOR UPDATE 
TO authenticated 
USING (private.is_cms_user())
WITH CHECK (private.is_cms_user());

CREATE POLICY "hot_deals_delete_admin" 
ON hot_deals FOR DELETE 
TO authenticated 
USING (private.is_cms_admin());

-- ----------------------------------------------------------------------------
-- 4.9 Popup Offers
-- ----------------------------------------------------------------------------
CREATE POLICY "popup_offers_select_public" 
ON popup_offers FOR SELECT 
TO anon, authenticated 
USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "popup_offers_select_staff" 
ON popup_offers FOR SELECT 
TO authenticated 
USING (private.is_cms_user());

CREATE POLICY "popup_offers_insert_staff" 
ON popup_offers FOR INSERT 
TO authenticated 
WITH CHECK (private.is_cms_user());

CREATE POLICY "popup_offers_update_staff" 
ON popup_offers FOR UPDATE 
TO authenticated 
USING (private.is_cms_user())
WITH CHECK (private.is_cms_user());

CREATE POLICY "popup_offers_delete_admin" 
ON popup_offers FOR DELETE 
TO authenticated 
USING (private.is_cms_admin());

-- ----------------------------------------------------------------------------
-- 4.10 Team Members
-- ----------------------------------------------------------------------------
CREATE POLICY "team_members_select_public" 
ON team_members FOR SELECT 
TO anon, authenticated 
USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "team_members_select_staff" 
ON team_members FOR SELECT 
TO authenticated 
USING (private.is_cms_user());

CREATE POLICY "team_members_insert_staff" 
ON team_members FOR INSERT 
TO authenticated 
WITH CHECK (private.is_cms_user());

CREATE POLICY "team_members_update_staff" 
ON team_members FOR UPDATE 
TO authenticated 
USING (private.is_cms_user())
WITH CHECK (private.is_cms_user());

CREATE POLICY "team_members_delete_admin" 
ON team_members FOR DELETE 
TO authenticated 
USING (private.is_cms_admin());

-- ----------------------------------------------------------------------------
-- 4.11 Hero Slides
-- ----------------------------------------------------------------------------
CREATE POLICY "hero_slides_select_public" 
ON hero_slides FOR SELECT 
TO anon, authenticated 
USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "hero_slides_select_staff" 
ON hero_slides FOR SELECT 
TO authenticated 
USING (private.is_cms_user());

CREATE POLICY "hero_slides_insert_staff" 
ON hero_slides FOR INSERT 
TO authenticated 
WITH CHECK (private.is_cms_user());

CREATE POLICY "hero_slides_update_staff" 
ON hero_slides FOR UPDATE 
TO authenticated 
USING (private.is_cms_user())
WITH CHECK (private.is_cms_user());

CREATE POLICY "hero_slides_delete_admin" 
ON hero_slides FOR DELETE 
TO authenticated 
USING (private.is_cms_admin());

-- ----------------------------------------------------------------------------
-- 4.12 Partners
-- ----------------------------------------------------------------------------
CREATE POLICY "partners_select_public" 
ON partners FOR SELECT 
TO anon, authenticated 
USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "partners_select_staff" 
ON partners FOR SELECT 
TO authenticated 
USING (private.is_cms_user());

CREATE POLICY "partners_insert_staff" 
ON partners FOR INSERT 
TO authenticated 
WITH CHECK (private.is_cms_user());

CREATE POLICY "partners_update_staff" 
ON partners FOR UPDATE 
TO authenticated 
USING (private.is_cms_user())
WITH CHECK (private.is_cms_user());

CREATE POLICY "partners_delete_admin" 
ON partners FOR DELETE 
TO authenticated 
USING (private.is_cms_admin());

-- ----------------------------------------------------------------------------
-- 4.13 Gallery Images
-- ----------------------------------------------------------------------------
CREATE POLICY "gallery_images_select_public" 
ON gallery_images FOR SELECT 
TO anon, authenticated 
USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "gallery_images_select_staff" 
ON gallery_images FOR SELECT 
TO authenticated 
USING (private.is_cms_user());

CREATE POLICY "gallery_images_insert_staff" 
ON gallery_images FOR INSERT 
TO authenticated 
WITH CHECK (private.is_cms_user());

CREATE POLICY "gallery_images_update_staff" 
ON gallery_images FOR UPDATE 
TO authenticated 
USING (private.is_cms_user())
WITH CHECK (private.is_cms_user());

CREATE POLICY "gallery_images_delete_admin" 
ON gallery_images FOR DELETE 
TO authenticated 
USING (private.is_cms_admin());

-- ----------------------------------------------------------------------------
-- 4.14 Fleet Vehicles
-- ----------------------------------------------------------------------------
CREATE POLICY "fleet_vehicles_select_public" 
ON fleet_vehicles FOR SELECT 
TO anon, authenticated 
USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));

CREATE POLICY "fleet_vehicles_select_staff" 
ON fleet_vehicles FOR SELECT 
TO authenticated 
USING (private.is_cms_user());

CREATE POLICY "fleet_vehicles_insert_staff" 
ON fleet_vehicles FOR INSERT 
TO authenticated 
WITH CHECK (private.is_cms_user());

CREATE POLICY "fleet_vehicles_update_staff" 
ON fleet_vehicles FOR UPDATE 
TO authenticated 
USING (private.is_cms_user())
WITH CHECK (private.is_cms_user());

CREATE POLICY "fleet_vehicles_delete_admin" 
ON fleet_vehicles FOR DELETE 
TO authenticated 
USING (private.is_cms_admin());

-- ============================================================================
-- 5. Table Grants & Privilege Hardening
-- ============================================================================
REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE UPDATE ON TABLE public.profiles FROM authenticated;
GRANT UPDATE (full_name, avatar_url, role) ON TABLE public.profiles TO authenticated;

