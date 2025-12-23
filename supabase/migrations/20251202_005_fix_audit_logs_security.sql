-- ============================================================================
-- SK AutoSphere - Fix Audit Logs Security
-- Migration: 005_fix_audit_logs_security
-- Date: 2025-12-02
-- Description: Hardens audit_logs RLS policies and function security
-- ============================================================================
--
-- This migration fixes critical security vulnerabilities:
-- 1. RLS SELECT policy now uses app_metadata (server-only) instead of user_metadata
-- 2. RLS INSERT policy restricted to service role only
-- 3. log_audit() function adds SET search_path for security
--
-- SAFE TO RUN MULTIPLE TIMES (Idempotent)
-- ============================================================================

-- ============================================================================
-- 1. Drop existing vulnerable policies
-- ============================================================================

DROP POLICY IF EXISTS "Admins can view all audit logs" ON audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON audit_logs;

-- ============================================================================
-- 2. Create secure SELECT policy (app_metadata only)
-- ============================================================================

-- Policy: Only admins (via app_metadata) can read audit logs
-- app_metadata is server-only and cannot be spoofed by clients
CREATE POLICY "Admins can view all audit logs"
ON audit_logs
FOR SELECT
USING (
  -- Check if user is admin via app_metadata (server-managed, secure)
  (auth.jwt() -> 'app_metadata' ->> 'role')::text = 'admin'
);

-- ============================================================================
-- 3. Create secure INSERT policy (service role only)
-- ============================================================================

-- Policy: Only service role can insert audit logs
-- This prevents any authenticated user from polluting audit logs
CREATE POLICY "Service role can insert audit logs"
ON audit_logs
FOR INSERT
TO authenticated
WITH CHECK (
  -- Only service role can insert (backend operations only)
  (auth.jwt() -> 'claims' ->> 'role')::text = 'service_role'
);

-- ============================================================================
-- 4. Fix log_audit() function security
-- ============================================================================

-- Recreate function with SET search_path to prevent search path attacks
CREATE OR REPLACE FUNCTION log_audit(
    p_action TEXT,
    p_resource_type TEXT DEFAULT NULL,
    p_resource_id UUID DEFAULT NULL,
    p_details JSONB DEFAULT '{}'::jsonb,
    p_ip_address TEXT DEFAULT NULL
) RETURNS void AS $$
BEGIN
    INSERT INTO audit_logs (
        user_id, 
        action, 
        resource_type, 
        resource_id, 
        details,
        ip_address
    )
    VALUES (
        auth.uid(), 
        p_action, 
        p_resource_type, 
        p_resource_id, 
        p_details,
        p_ip_address
    );
END;
$$ LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp;

-- ============================================================================
-- 5. Add comment for documentation
-- ============================================================================

COMMENT ON POLICY "Admins can view all audit logs" ON audit_logs IS 
  'Only users with app_metadata.role = admin can read audit logs. ' ||
  'app_metadata is server-managed and cannot be spoofed.';

COMMENT ON POLICY "Service role can insert audit logs" ON audit_logs IS 
  'Only service role (backend) can insert audit logs. ' ||
  'Prevents client-side pollution of audit trail.';

-- ============================================================================
-- 6. Verification Queries (Optional - uncomment to check)
-- ============================================================================

-- Check policies
-- SELECT policyname, cmd, qual, with_check 
-- FROM pg_policies 
-- WHERE schemaname = 'public' AND tablename = 'audit_logs';

-- Verify function security
-- SELECT routine_name, security_type, routine_definition 
-- FROM information_schema.routines 
-- WHERE routine_schema = 'public' AND routine_name = 'log_audit';

-- ============================================================================
-- END OF MIGRATION 005
-- ============================================================================














