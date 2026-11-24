-- reset.sql
-- Deletes only rows inserted by the migration script.
-- Never deletes rows without legacy_sanity_id.
-- Never touches profiles.
-- Run this to reset the DB to pre-migration state so you can re-run the migration.

BEGIN;

-- Content tables (reverse FK order)
DELETE FROM public.redirects
  WHERE note LIKE '%UUID redirect%'
     OR note LIKE '%Old slug%'
     OR note LIKE '%ambosseli%'
     OR note LIKE '%Percent-encoded%'
     OR note LIKE '%Themed package%'
     OR note LIKE '%Old blog%'
     OR note LIKE '%canonical%';

DELETE FROM public.partners         WHERE legacy_sanity_id IS NOT NULL OR name IN (
  'Legend Tours','Emirates','Magical Kenya','Kenya Tourism Board',
  'Costa','Kenya Tourism Federation','Ministry of Tourism & Wildlife'
);

DELETE FROM public.hero_slides      WHERE legacy_sanity_id IS NOT NULL OR display_order IN (1,2,3,4,5,6);

DELETE FROM public.fleet_vehicles   WHERE legacy_sanity_id IS NOT NULL;
DELETE FROM public.gallery_images   WHERE legacy_sanity_id IS NOT NULL;
DELETE FROM public.team_members     WHERE legacy_sanity_id IS NOT NULL;
DELETE FROM public.popup_offers     WHERE legacy_sanity_id IS NOT NULL;
DELETE FROM public.hot_deals        WHERE legacy_sanity_id IS NOT NULL;
DELETE FROM public.accommodations   WHERE legacy_sanity_id IS NOT NULL;
DELETE FROM public.blog_posts       WHERE legacy_sanity_id IS NOT NULL;
DELETE FROM public.tours            WHERE legacy_sanity_id IS NOT NULL;
DELETE FROM public.packages         WHERE legacy_sanity_id IS NOT NULL;
DELETE FROM public.themed_packages  WHERE legacy_sanity_id IS NOT NULL;
DELETE FROM public.destination_posts WHERE legacy_sanity_id IS NOT NULL;
DELETE FROM public.destination_categories WHERE legacy_sanity_id IS NOT NULL;

COMMIT;
