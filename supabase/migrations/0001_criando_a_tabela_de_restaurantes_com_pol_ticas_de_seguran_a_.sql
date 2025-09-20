-- Create restaurants table
CREATE TABLE public.restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (REQUIRED for security)
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Create policies
-- 1. Allow public read access for everyone
CREATE POLICY "restaurants_public_read_policy" ON public.restaurants
FOR SELECT USING (true);

-- 2. Allow authenticated users to insert restaurants
CREATE POLICY "restaurants_insert_policy" ON public.restaurants
FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

-- 3. Allow owners to update their own restaurants
CREATE POLICY "restaurants_update_policy" ON public.restaurants
FOR UPDATE TO authenticated USING (auth.uid() = owner_id);

-- 4. Allow owners to delete their own restaurants
CREATE POLICY "restaurants_delete_policy" ON public.restaurants
FOR DELETE TO authenticated USING (auth.uid() = owner_id);