-- ============================================================================
-- MIGRATION: Add exec helper function
-- Purpose: Allow running arbitrary SQL for infrastructure checks and tests
-- ============================================================================

CREATE OR REPLACE FUNCTION public.exec(sql text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
  RETURN 'Success';
END;
$$;

GRANT EXECUTE ON FUNCTION public.exec (text) TO service_role;

GRANT EXECUTE ON FUNCTION public.exec (text) TO postgres;

COMMENT ON FUNCTION public.exec (text) IS 'Utility function to execute arbitrary SQL - Restricted to service_role and postgres';