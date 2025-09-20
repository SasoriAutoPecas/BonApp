ALTER TABLE public.restaurants
ADD COLUMN phone_number TEXT,
ADD COLUMN website TEXT,
ADD COLUMN operating_hours TEXT,
ADD COLUMN has_wheelchair_access BOOLEAN DEFAULT false,
ADD COLUMN accessibility_details TEXT;