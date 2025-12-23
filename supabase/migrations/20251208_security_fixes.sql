-- Security Fixes Migration
-- Applied: December 8, 2025
-- Fixes: RLS vulnerabilities, function search paths

-- ============================================
-- 1. Enable RLS on escrow_transactions
-- ============================================
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;

-- Create proper RLS policies for escrow_transactions
CREATE POLICY "Users can view their own escrow transactions" ON public.escrow_transactions FOR
SELECT USING (
        created_by = auth.uid ()
        OR EXISTS (
            SELECT 1
            FROM public.payment_escrow pe
            WHERE
                pe.id = escrow_id
                AND (
                    pe.buyer_id = auth.uid ()::text::uuid
                    OR pe.dealer_id IN (
                        SELECT d.id
                        FROM public.dealers d
                        WHERE
                            d.user_id = auth.uid ()
                    )
                )
        )
    );

CREATE POLICY "Only system can insert escrow transactions" ON public.escrow_transactions FOR INSERT
WITH
    CHECK (created_by = auth.uid ());

-- ============================================
-- 2. Fix payment_escrow RLS policy (remove user_metadata reference)
-- ============================================
DROP POLICY IF EXISTS "Admins can view all escrows" ON public.payment_escrow;

CREATE POLICY "Admins can view all escrows" ON public.payment_escrow FOR
SELECT USING (
        (
            auth.jwt () -> 'app_metadata' ->> 'role'
        ) = 'admin'
        OR (auth.jwt () ->> 'email') LIKE '%@skautosphere.com'
    );

-- ============================================
-- 3. Fix order_tracking_stages RLS policy (remove user_metadata reference)
-- ============================================
DROP POLICY IF EXISTS "Admins view all tracking" ON public.order_tracking_stages;

CREATE POLICY "Admins view all tracking" ON public.order_tracking_stages FOR
SELECT USING (
        (
            auth.jwt () -> 'app_metadata' ->> 'role'
        ) = 'admin'
        OR (auth.jwt () ->> 'email') LIKE '%@skautosphere.com'
    );

-- ============================================
-- 4. Fix function search paths
-- ============================================
ALTER FUNCTION public.sync_dealer_verified_status() SET search_path = '';

ALTER FUNCTION public.initialize_order_tracking(uuid) SET search_path = '';

ALTER FUNCTION public.initialize_order_tracking() SET search_path = '';

ALTER FUNCTION public.generate_car_listing_search_vector(text, text, text, text, text, text, text) SET search_path = '';

ALTER FUNCTION public.generate_car_listing_search_vector(text, text, text, text, text, text) SET search_path = '';

ALTER FUNCTION public.car_listings_search_vector_update() SET search_path = '';

-- ============================================
-- MANUAL ACTION REQUIRED:
-- Enable "Leaked Password Protection" in Supabase Dashboard
-- Go to: Authentication > Providers > Email > Enable "Leaked password protection"
-- https://supabase.com/docs/guides/auth/password-security
-- ============================================