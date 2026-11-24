-- 0006_grants.sql
-- GRANTs decide whether a role may touch a table at all; RLS (0004) decides which rows.

-- Content tables: public read, staff write (rows still filtered by RLS)
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'destination_categories','destination_posts','themed_packages','packages',
    'tours','blog_posts','accommodations','hot_deals','popup_offers',
    'team_members','hero_slides','partners','gallery_images','fleet_vehicles'
  ]
  LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END $$;

-- Redirects: public read, staff write (delete is admin-only via RLS)
GRANT SELECT ON public.redirects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.redirects TO authenticated;
GRANT ALL ON public.redirects TO service_role;

-- Profiles: nothing for anon. Signed-in users can read and delete (RLS decides who),
-- and update only the three columns granted in 0004. No client-side INSERT.
GRANT SELECT, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
