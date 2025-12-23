-- Create blog_views table if it doesn't exist
CREATE TABLE IF NOT EXISTS blog_views (
    slug TEXT PRIMARY KEY,
    count INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blog_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public can view blog counts" ON blog_views;

-- Allow public read access
CREATE POLICY "Public can view blog counts" ON blog_views FOR
SELECT TO public USING (true);

-- Create RPC function to increment views
CREATE OR REPLACE FUNCTION increment_blog_view(view_slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO blog_views (slug, count, updated_at)
  VALUES (view_slug, 1, NOW())
  ON CONFLICT (slug)
  DO UPDATE SET 
    count = blog_views.count + 1,
    updated_at = NOW();
END;
$$;

-- Create newsletter_subscribers table if it doesn't exist
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    email TEXT UNIQUE NOT NULL,
    source TEXT,
    status TEXT DEFAULT 'active',
    subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admins can view subscribers" ON newsletter_subscribers;

DROP POLICY IF EXISTS "Public can subscribe" ON newsletter_subscribers;

-- Only admins can view subscribers
CREATE POLICY "Admins can view subscribers" ON newsletter_subscribers FOR
SELECT TO authenticated USING (
        auth.uid () IN (
            SELECT id
            FROM users
            WHERE
                role = 'admin'
        )
        OR (
            auth.jwt () -> 'app_metadata' ->> 'role' = 'admin'
        )
    );

-- Public can subscribe (INSERT only)
CREATE POLICY "Public can subscribe" ON newsletter_subscribers FOR INSERT TO public
WITH
    CHECK (true);