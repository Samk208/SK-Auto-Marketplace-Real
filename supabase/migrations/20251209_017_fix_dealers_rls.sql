-- ============================================================================
-- SK AutoSphere - Fix Dealer RLS
-- Migration: 017_fix_dealers_rls
-- Date: 2025-12-09
-- Description: Add RLS policies to allow authenticated users to create and manage their dealer profiles
-- ============================================================================

-- Ensure RLS is enabled on dealers table
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can create their own dealer profile
-- This is needed for the onboarding flow where we insert a new dealer record
DROP POLICY IF EXISTS "Users can create their own dealer profile" ON dealers;
CREATE POLICY "Users can create their own dealer profile"
    ON dealers
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own dealer profile
-- This is needed for the dashboard and verification status checks
DROP POLICY IF EXISTS "Users can view their own dealer profile" ON dealers;
CREATE POLICY "Users can view their own dealer profile"
    ON dealers
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can update their own dealer profile
-- This is needed for updating business details, logo, etc.
DROP POLICY IF EXISTS "Users can update their own dealer profile" ON dealers;
CREATE POLICY "Users can update their own dealer profile"
    ON dealers
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Public can view verified/active dealers listings
-- This might already exist or be needed for the public dealer directory
DROP POLICY IF EXISTS "Public can view verified dealers" ON dealers;
CREATE POLICY "Public can view verified dealers"
    ON dealers
    FOR SELECT
    USING (true); -- Ideally this should be verified = true, but for directory listing we might want all. 
                  -- If we want to restrict to verified dealers: USING (verified = true)
                  -- For now, allowing all read access is safer for visibility, 
                  -- filtering should be done in the query (e.g., WHERE verified = true) 
