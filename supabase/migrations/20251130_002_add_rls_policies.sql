-- ============================================
-- SK AutoSphere - Row Level Security Migration
-- Migration: 002_add_rls_policies
-- Date: 2025-11-30
-- Status: ✅ APPLIED
-- ============================================
--
-- This migration adds Row Level Security (RLS) to protect data access.
-- It creates policies that ensure:
-- - Dealers can only access their own listings
-- - Public can view active listings
-- - Admins have full access
--
-- SAFE TO RUN MULTIPLE TIMES (Idempotent)
-- ============================================

-- ============================================
-- 1. Create RPC function for incrementing listing views
-- ============================================
-- Using CREATE OR REPLACE so it's safe to run multiple times
CREATE OR REPLACE FUNCTION increment_listing_views(listing_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE car_listings
  SET views = views + 1
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 2. Enable Row Level Security (RLS)
-- ============================================
-- These commands are safe to run multiple times
ALTER TABLE car_listings ENABLE ROW LEVEL SECURITY;

ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. Drop existing policies (if any) to avoid conflicts
-- ============================================
-- This ensures clean state before creating new policies
DROP POLICY IF EXISTS "Anyone can view active listings" ON car_listings;

DROP POLICY IF EXISTS "Dealers can view own listings" ON car_listings;

DROP POLICY IF EXISTS "Dealers can insert own listings" ON car_listings;

DROP POLICY IF EXISTS "Dealers can update own listings" ON car_listings;

DROP POLICY IF EXISTS "Dealers can delete own listings" ON car_listings;

DROP POLICY IF EXISTS "Admins can manage all listings" ON car_listings;

DROP POLICY IF EXISTS "Anyone can view dealers" ON dealers;

DROP POLICY IF EXISTS "Users can create own dealer profile" ON dealers;

DROP POLICY IF EXISTS "Users can update own dealer profile" ON dealers;

DROP POLICY IF EXISTS "Admins can manage all dealers" ON dealers;

-- ============================================
-- 4. RLS Policies for car_listings
-- ============================================

-- Public can view active listings
CREATE POLICY "Anyone can view active listings" ON car_listings FOR
SELECT USING (status = 'active');

-- Dealers can view their own listings (any status)
CREATE POLICY "Dealers can view own listings" ON car_listings FOR
SELECT USING (
        dealer_id IN (
            SELECT id
            FROM dealers
            WHERE
                user_id = auth.uid ()
        )
    );

-- Dealers can insert their own listings
CREATE POLICY "Dealers can insert own listings" ON car_listings FOR
INSERT
WITH
    CHECK (
        dealer_id IN (
            SELECT id
            FROM dealers
            WHERE
                user_id = auth.uid ()
        )
    );

-- Dealers can update their own listings
CREATE POLICY "Dealers can update own listings" ON car_listings FOR
UPDATE USING (
    dealer_id IN (
        SELECT id
        FROM dealers
        WHERE
            user_id = auth.uid ()
    )
);

-- Dealers can delete their own listings
CREATE POLICY "Dealers can delete own listings" ON car_listings FOR DELETE USING (
    dealer_id IN (
        SELECT id
        FROM dealers
        WHERE
            user_id = auth.uid ()
    )
);

-- Admins can do everything (check via user metadata OR email domain)
CREATE POLICY "Admins can manage all listings"
ON car_listings FOR ALL
USING (
  (auth.jwt() ->> 'email')::text LIKE '%@skautosphere.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- ============================================
-- 5. RLS Policies for dealers
-- ============================================

-- Anyone can view dealer info (public directory)
CREATE POLICY "Anyone can view dealers" ON dealers FOR
SELECT USING (true);

-- Users can insert their own dealer profile
CREATE POLICY "Users can create own dealer profile" ON dealers FOR
INSERT
WITH
    CHECK (user_id = auth.uid ());

-- Users can update their own dealer profile
CREATE POLICY "Users can update own dealer profile" ON dealers FOR
UPDATE USING (user_id = auth.uid ());

-- Admins can manage all dealers
CREATE POLICY "Admins can manage all dealers"
ON dealers FOR ALL
USING (
  (auth.jwt() ->> 'email')::text LIKE '%@skautosphere.com'
  OR (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- ============================================
-- 6. Add triggers for updated_at timestamps
-- ============================================
-- Using CREATE OR REPLACE so it's safe to run multiple times
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists, then create it
DROP TRIGGER IF EXISTS update_car_listings_updated_at ON car_listings;

CREATE TRIGGER update_car_listings_updated_at
    BEFORE UPDATE ON car_listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. Create function to get or create dealer ID
-- ============================================
-- Using CREATE OR REPLACE so it's safe to run multiple times
CREATE OR REPLACE FUNCTION get_or_create_dealer_id()
RETURNS UUID AS $$
DECLARE
  dealer_record RECORD;
  new_dealer_id UUID;
BEGIN
  -- Try to find existing dealer
  SELECT id INTO dealer_record
  FROM dealers
  WHERE user_id = auth.uid();
  
  IF FOUND THEN
    RETURN dealer_record.id;
  ELSE
    -- Create new dealer profile
    INSERT INTO dealers (
      user_id,
      business_name,
      verified,
      rating,
      review_count,
      active_listings,
      sold_vehicles
    ) VALUES (
      auth.uid(),
      'New Dealer', -- Default name, user should update
      false,
      0,
      0,
      0,
      0
    )
    RETURNING id INTO new_dealer_id;
    
    RETURN new_dealer_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. Verification Queries (Optional - uncomment to check)
-- ============================================
-- Uncomment these to verify the migration worked:

-- Check if RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables
-- WHERE schemaname = 'public' AND tablename IN ('car_listings', 'dealers');

-- List all policies
-- SELECT tablename, policyname FROM pg_policies
-- WHERE schemaname = 'public' AND tablename IN ('car_listings', 'dealers');

-- List all functions
-- SELECT routine_name FROM information_schema.routines
-- WHERE routine_schema = 'public'
-- AND routine_name IN ('increment_listing_views', 'get_or_create_dealer_id', 'update_updated_at_column');

-- ============================================
-- END OF MIGRATION
-- ============================================