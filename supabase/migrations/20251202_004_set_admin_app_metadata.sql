-- ============================================================================
-- SK AutoSphere - Set Admin Roles in app_metadata
-- Migration: 004_set_admin_app_metadata
-- Date: 2025-12-02
-- Description: Sets up admin role management via app_metadata
-- ============================================================================
--
-- IMPORTANT: app_metadata must be set via Supabase Auth Admin API, not SQL
-- This migration creates a helper function and documents the process
--
-- To set admin roles, use the Supabase Dashboard or Auth Admin API:
-- 
-- Via Dashboard:
-- 1. Go to Authentication > Users
-- 2. Select user
-- 3. Edit Raw App Meta Data: {"role": "admin"}
--
-- Via API (server-side only):
-- supabase.auth.admin.updateUserById(userId, { app_metadata: { role: 'admin' } })
--
-- ============================================================================

-- ============================================================================
-- 1. Create helper function to check admin status
-- ============================================================================

-- This function can be used in RLS policies and application code
-- It checks app_metadata.role from the JWT token
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS boolean AS $$
BEGIN
  RETURN (
    (auth.jwt() -> 'app_metadata' ->> 'role')::text = 'admin'
    OR
    (auth.jwt() ->> 'email')::text LIKE '%@skautosphere.com'
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- 2. Add comment for documentation
-- ============================================================================

COMMENT ON FUNCTION is_admin_user() IS 
  'Checks if current user is admin via app_metadata.role or email domain. ' ||
  'app_metadata must be set via Auth Admin API (server-side only).';

-- ============================================================================
-- 3. Verification Query (Optional - uncomment to check)
-- ============================================================================

-- Note: Cannot directly query app_metadata from auth.users via SQL
-- Use Supabase Dashboard or Auth Admin API to verify admin users

-- ============================================================================
-- END OF MIGRATION 004
-- ============================================================================
