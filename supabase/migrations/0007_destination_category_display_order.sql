ALTER TABLE public.destination_categories
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;

UPDATE public.destination_categories SET display_order = CASE slug
  WHEN 'africa' THEN 1
  WHEN 'europe' THEN 2
  WHEN 'latin-america' THEN 3
  WHEN 'middle-east' THEN 4
  WHEN 'oceania' THEN 5
  WHEN 'usa-canada' THEN 6
  WHEN 'kenya' THEN 7
  WHEN 'asia' THEN 8
  ELSE display_order END;

CREATE INDEX IF NOT EXISTS idx_destination_categories_display_order
  ON public.destination_categories (display_order, name);
