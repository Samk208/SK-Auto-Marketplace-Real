-- Performance Optimizations Migration
-- Applied: December 8, 2025

-- ============================================
-- 1. Add missing indexes on foreign keys
-- ============================================
CREATE INDEX IF NOT EXISTS idx_escrow_transactions_created_by ON public.escrow_transactions (created_by);

CREATE INDEX IF NOT EXISTS idx_escrow_transactions_escrow_id ON public.escrow_transactions (escrow_id);

CREATE INDEX IF NOT EXISTS idx_order_tracking_events_escrow_id ON public.order_tracking_events (escrow_id);

-- ============================================
-- 2. Fix RLS policies to use (select auth.uid()) for better performance
-- This prevents re-evaluation for each row
-- ============================================

-- Fix car_listings policies
DROP POLICY IF EXISTS "Dealers can insert own listings" ON public.car_listings;

CREATE POLICY "Dealers can insert own listings" ON public.car_listings FOR INSERT
WITH
    CHECK (
        dealer_id IN (
            SELECT d.id
            FROM public.dealers d
            WHERE
                d.user_id = (
                    SELECT auth.uid ()
                )
        )
    );

DROP POLICY IF EXISTS "Dealers can view own listings" ON public.car_listings;

CREATE POLICY "Dealers can view own listings" ON public.car_listings FOR
SELECT USING (
        dealer_id IN (
            SELECT d.id
            FROM public.dealers d
            WHERE
                d.user_id = (
                    SELECT auth.uid ()
                )
        )
    );

DROP POLICY IF EXISTS "Dealers can update own listings" ON public.car_listings;

CREATE POLICY "Dealers can update own listings" ON public.car_listings
FOR UPDATE
    USING (
        dealer_id IN (
            SELECT d.id
            FROM public.dealers d
            WHERE
                d.user_id = (
                    SELECT auth.uid ()
                )
        )
    );

DROP POLICY IF EXISTS "Dealers can delete own listings" ON public.car_listings;

CREATE POLICY "Dealers can delete own listings" ON public.car_listings FOR DELETE USING (
    dealer_id IN (
        SELECT d.id
        FROM public.dealers d
        WHERE
            d.user_id = (
                SELECT auth.uid ()
            )
    )
);

-- Fix dealers policies
DROP POLICY IF EXISTS "Users can create own dealer profile" ON public.dealers;

CREATE POLICY "Users can create own dealer profile" ON public.dealers FOR INSERT
WITH
    CHECK (
        user_id = (
            SELECT auth.uid ()
        )
    );

DROP POLICY IF EXISTS "Users can update own dealer profile" ON public.dealers;

CREATE POLICY "Users can update own dealer profile" ON public.dealers
FOR UPDATE
    USING (
        user_id = (
            SELECT auth.uid ()
        )
    );

-- Fix audit_logs policies
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;

CREATE POLICY "Admins can view all audit logs" ON public.audit_logs FOR
SELECT USING (
        (
            (
                SELECT auth.jwt ()
            ) -> 'app_metadata' ->> 'role'
        ) = 'admin'
        OR (
            (
                SELECT auth.jwt ()
            ) ->> 'email'
        ) LIKE '%@skautosphere.com'
    );

DROP POLICY IF EXISTS "Service role can insert audit logs" ON public.audit_logs;

CREATE POLICY "Service role can insert audit logs" ON public.audit_logs FOR INSERT
WITH
    CHECK (
        (
            (
                SELECT auth.jwt ()
            ) -> 'app_metadata' ->> 'role'
        ) = 'service_role'
        OR (
            (
                SELECT auth.jwt ()
            ) ->> 'email'
        ) LIKE '%@skautosphere.com'
        OR (
            SELECT auth.uid ()
        ) IS NOT NULL
    );

-- Fix notifications policies
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR
SELECT USING (
        user_id = (
            SELECT auth.uid ()
        )
    );

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

CREATE POLICY "Users can update own notifications" ON public.notifications
FOR UPDATE
    USING (
        user_id = (
            SELECT auth.uid ()
        )
    );

-- Fix payment_escrow policies
DROP POLICY IF EXISTS "Users can view their own escrows" ON public.payment_escrow;

CREATE POLICY "Users can view their own escrows" ON public.payment_escrow FOR
SELECT USING (
        buyer_id = (
            SELECT auth.uid ()
        )::text::uuid
        OR dealer_id IN (
            SELECT d.id
            FROM public.dealers d
            WHERE
                d.user_id = (
                    SELECT auth.uid ()
                )
        )
    );

-- Fix order_tracking_stages policies
DROP POLICY IF EXISTS "Users can view their tracking stages" ON public.order_tracking_stages;

CREATE POLICY "Users can view their tracking stages" ON public.order_tracking_stages FOR
SELECT USING (
        escrow_id IN (
            SELECT pe.id
            FROM public.payment_escrow pe
            WHERE
                pe.buyer_id = (
                    SELECT auth.uid ()
                )::text::uuid
                OR pe.dealer_id IN (
                    SELECT d.id
                    FROM public.dealers d
                    WHERE
                        d.user_id = (
                            SELECT auth.uid ()
                        )
                )
        )
    );

-- Fix order_tracking_events policies
DROP POLICY IF EXISTS "Users can view their tracking events" ON public.order_tracking_events;

CREATE POLICY "Users can view their tracking events" ON public.order_tracking_events FOR
SELECT USING (
        escrow_id IN (
            SELECT pe.id
            FROM public.payment_escrow pe
            WHERE
                pe.buyer_id = (
                    SELECT auth.uid ()
                )::text::uuid
                OR pe.dealer_id IN (
                    SELECT d.id
                    FROM public.dealers d
                    WHERE
                        d.user_id = (
                            SELECT auth.uid ()
                        )
                )
        )
    );

-- Fix ai_condition_reports policies
DROP POLICY IF EXISTS "Dealers can view reports for own listings" ON public.ai_condition_reports;

CREATE POLICY "Dealers can view reports for own listings" ON public.ai_condition_reports FOR
SELECT USING (
        listing_id IN (
            SELECT cl.id
            FROM public.car_listings cl
            WHERE
                cl.dealer_id IN (
                    SELECT d.id
                    FROM public.dealers d
                    WHERE
                        d.user_id = (
                            SELECT auth.uid ()
                        )
                )
        )
    );