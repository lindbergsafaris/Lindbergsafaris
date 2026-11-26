ALTER TABLE public.destination_categories
  ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0;

UPDATE public.destination_categories SET display_order = CASE slug
  WHEN 'kenya' THEN 1
  WHEN 'africa' THEN 2
  WHEN 'asia' THEN 3
  WHEN 'europe' THEN 4
  WHEN 'latin-america' THEN 5
  WHEN 'middle-east' THEN 6
  WHEN 'oceania' THEN 7
  WHEN 'usa-canada' THEN 8
  ELSE display_order END;

CREATE INDEX IF NOT EXISTS idx_destination_categories_display_order
  ON public.destination_categories (display_order, name);
