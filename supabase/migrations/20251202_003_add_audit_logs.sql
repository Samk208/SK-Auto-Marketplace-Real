-- ============================================================================
-- SK AutoSphere - Audit Logs Migration
-- Migration: 003_add_audit_logs
-- Date: 2025-12-02
-- Description: Adds audit_logs table for tracking all admin actions
-- ============================================================================
--
-- This migration creates:
-- 1. audit_logs table with comprehensive tracking fields
-- 2. Performance indexes for fast lookups
-- 3. RLS policies (admin-only read access)
-- 4. Helper function for logging actions
--
-- SAFE TO RUN MULTIPLE TIMES (Idempotent)
-- ============================================================================

-- ============================================================================
-- 1. Create audit_logs table
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. Create indexes for performance
-- ============================================================================

-- Index for user lookup (admin viewing their actions)
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs (user_id);

-- Index for time-based queries (most recent actions)
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs (created_at DESC);

-- Composite index for resource lookup (find all actions on a specific resource)
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs (resource_type, resource_id);

-- Index for action type filtering
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs (action);

-- ============================================================================
-- 3. Enable Row Level Security
-- ============================================================================

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. Drop existing policies (if any) to ensure clean state
-- ============================================================================

DROP POLICY IF EXISTS "Admins can view all audit logs" ON audit_logs;

DROP POLICY IF EXISTS "System can insert audit logs" ON audit_logs;

-- ============================================================================
-- 5. Create RLS Policies
-- ============================================================================

-- Policy: Only admins can read audit logs
-- Checks user role from auth.users metadata OR email domain
CREATE POLICY "Admins can view all audit logs"
ON audit_logs
FOR SELECT
USING (
    -- Check if user is admin via email domain
    (auth.jwt() ->> 'email')::text LIKE '%@skautosphere.com'
    OR
    -- Check if user is admin via user_metadata role
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- Policy: Authenticated users can insert audit logs
-- This allows system functions and API routes to log actions
CREATE POLICY "System can insert audit logs" ON audit_logs FOR
INSERT
    TO authenticated
WITH
    CHECK (true);

-- ============================================================================
-- 6. Create helper function for logging actions
-- ============================================================================

-- Function to log audit trail from application code
-- Usage: SELECT log_audit('listing_approved', 'listing', listing_id, '{"reason": "Good quality"}');
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. Add comment for documentation
-- ============================================================================

COMMENT ON
TABLE audit_logs IS 'Tracks all admin actions for security and compliance';

COMMENT ON COLUMN audit_logs.user_id IS 'References auth.users - null if user deleted';

COMMENT ON COLUMN audit_logs.action IS 'Action type: listing_approved, dealer_verified, etc.';

COMMENT ON COLUMN audit_logs.resource_type IS 'Type of resource affected: listing, dealer, user, etc.';

COMMENT ON COLUMN audit_logs.resource_id IS 'UUID of the affected resource';

COMMENT ON COLUMN audit_logs.details IS 'Additional context stored as JSON';

COMMENT ON COLUMN audit_logs.ip_address IS 'IP address of the user performing the action';

-- ============================================================================
-- 8. Verification Queries (Optional - uncomment to check)
-- ============================================================================

-- Check if table exists and RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables
-- WHERE schemaname = 'public' AND tablename = 'audit_logs';

-- List all policies on audit_logs
-- SELECT policyname, cmd, qual FROM pg_policies
-- WHERE schemaname = 'public' AND tablename = 'audit_logs';

-- List all indexes on audit_logs
-- SELECT indexname, indexdef FROM pg_indexes
-- WHERE schemaname = 'public' AND tablename = 'audit_logs';

-- Verify log_audit function exists
-- SELECT routine_name, routine_type FROM information_schema.routines
-- WHERE routine_schema = 'public' AND routine_name = 'log_audit';

-- ============================================================================
-- END OF MIGRATION 003
-- ============================================================================