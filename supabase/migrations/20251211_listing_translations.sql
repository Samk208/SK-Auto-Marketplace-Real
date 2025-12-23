-- Create listing_translations table
CREATE TABLE IF NOT EXISTS public.listing_translations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.car_listings(id) ON DELETE CASCADE NOT NULL,
    field_name TEXT NOT NULL, -- e.g. 'title', 'description'
    source_language TEXT NOT NULL DEFAULT 'en',
    target_language TEXT NOT NULL, -- e.g. 'fr', 'sw'
    translated_text TEXT NOT NULL,
    view_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(listing_id, field_name, target_language)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_listing_translations_lookup 
ON public.listing_translations(listing_id, field_name, target_language);

-- Enable RLS
ALTER TABLE public.listing_translations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Enable read access for all users"
ON public.listing_translations FOR SELECT
USING (true);

CREATE POLICY "Enable insert for authenticated users" 
ON public.listing_translations FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable update for service role only" 
ON public.listing_translations FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Trigger for updated_at
-- Assuming 'moddatetime' extension is already enabled, otherwise:
-- CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_listing_translations') THEN
        CREATE TRIGGER handle_updated_at_listing_translations
        BEFORE UPDATE ON public.listing_translations
        FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);
    END IF;
END
$$;
