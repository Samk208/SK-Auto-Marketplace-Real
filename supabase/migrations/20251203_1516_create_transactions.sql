-- =====================================================
-- TRANSACTIONS TABLE MIGRATION
-- Created: 2025-12-03
-- Description: Transaction records for vehicle purchases
-- =====================================================

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES public.car_listings(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    dealer_id UUID REFERENCES public.dealers(id) ON DELETE SET NULL,

-- Payment information
amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
currency TEXT NOT NULL DEFAULT 'USD',
stripe_payment_intent_id TEXT UNIQUE NOT NULL,
stripe_payment_method TEXT,

-- Transaction status
status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN (
        'pending',
        'processing',
        'succeeded',
        'failed',
        'refunded'
    )
),

-- Buyer information
buyer_email TEXT NOT NULL,
buyer_name TEXT,
buyer_phone TEXT,
buyer_country TEXT,
shipping_address JSONB,

-- Additional data
metadata JSONB DEFAULT '{}'::jsonb,

-- Timestamps
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

-- Index for buyer queries
CREATE INDEX idx_transactions_buyer ON public.transactions (buyer_id)
WHERE
    buyer_id IS NOT NULL;

-- Index for dealer queries
CREATE INDEX idx_transactions_dealer ON public.transactions (dealer_id)
WHERE
    dealer_id IS NOT NULL;

-- Index for listing queries
CREATE INDEX idx_transactions_listing ON public.transactions (listing_id);

-- Index for Stripe payment intent lookups
CREATE INDEX idx_transactions_stripe ON public.transactions (stripe_payment_intent_id);

-- Index for status filtering
CREATE INDEX idx_transactions_status ON public.transactions (status);

-- Index for time-based queries (most recent first)
CREATE INDEX idx_transactions_created ON public.transactions (created_at DESC);

-- Composite index for dealer revenue queries
CREATE INDEX idx_transactions_dealer_status ON public.transactions (
    dealer_id,
    status,
    created_at DESC
)
WHERE
    dealer_id IS NOT NULL;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_transactions_timestamp
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_transactions_updated_at();

-- Auto-set completed_at when status changes to succeeded
CREATE OR REPLACE FUNCTION public.set_transaction_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'succeeded' AND OLD.status != 'succeeded' AND NEW.completed_at IS NULL THEN
        NEW.completed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_transaction_completed
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.set_transaction_completed_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Buyers can view their own transactions
CREATE POLICY "Buyers can view their own transactions" ON public.transactions FOR
SELECT TO authenticated USING (
        buyer_id = auth.uid ()
        OR buyer_email = (
            SELECT email
            FROM public.users
            WHERE
                id = auth.uid ()
        )
    );

-- Policy: Dealers can view transactions for their listings
CREATE POLICY "Dealers can view their transactions" ON public.transactions FOR
SELECT TO authenticated USING (
        dealer_id IN (
            SELECT id
            FROM public.dealers
            WHERE
                user_id = auth.uid ()
        )
    );

-- Policy: Admins can view all transactions
CREATE POLICY "Admins can view all transactions" ON public.transactions FOR
SELECT TO authenticated USING (
        (
            auth.jwt () -> 'app_metadata' ->> 'role'
        ) = 'admin'
    );

-- Policy: System/Service role can insert transactions (for Stripe webhooks)
CREATE POLICY "System can insert transactions" ON public.transactions FOR
INSERT
    TO authenticated,
    anon
WITH
    CHECK (true);

-- Policy: System can update transactions (for payment status updates)
CREATE POLICY "System can update transactions" ON public.transactions FOR
UPDATE TO authenticated,
anon USING (true)
WITH
    CHECK (true);

-- Policy: Admins can update transactions
CREATE POLICY "Admins can update transactions" ON public.transactions FOR
UPDATE TO authenticated USING (
    (
        auth.jwt () -> 'app_metadata' ->> 'role'
    ) = 'admin'
)
WITH
    CHECK (
        (
            auth.jwt () -> 'app_metadata' ->> 'role'
        ) = 'admin'
    );

-- Policy: Admins can delete transactions
CREATE POLICY "Admins can delete transactions" ON public.transactions FOR DELETE TO authenticated USING (
    (
        auth.jwt () -> 'app_metadata' ->> 'role'
    ) = 'admin'
);

-- =====================================================
-- DEALER TRANSACTION STATISTICS FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_dealer_transaction_stats(p_dealer_id UUID)
RETURNS TABLE (
    total_revenue DECIMAL(10,2),
    total_transactions BIGINT,
    pending_count BIGINT,
    processing_count BIGINT,
    succeeded_count BIGINT,
    failed_count BIGINT,
    refunded_count BIGINT,
    total_refunded_amount DECIMAL(10,2),
    avg_transaction_value DECIMAL(10,2),
    last_transaction_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(CASE WHEN t.status = 'succeeded' THEN t.amount ELSE 0 END), 0)::DECIMAL(10,2) AS total_revenue,
        COUNT(*)::BIGINT AS total_transactions,
        COUNT(*) FILTER (WHERE t.status = 'pending')::BIGINT AS pending_count,
        COUNT(*) FILTER (WHERE t.status = 'processing')::BIGINT AS processing_count,
        COUNT(*) FILTER (WHERE t.status = 'succeeded')::BIGINT AS succeeded_count,
        COUNT(*) FILTER (WHERE t.status = 'failed')::BIGINT AS failed_count,
        COUNT(*) FILTER (WHERE t.status = 'refunded')::BIGINT AS refunded_count,
        COALESCE(SUM(CASE WHEN t.status = 'refunded' THEN t.amount ELSE 0 END), 0)::DECIMAL(10,2) AS total_refunded_amount,
        COALESCE(AVG(CASE WHEN t.status = 'succeeded' THEN t.amount ELSE NULL END), 0)::DECIMAL(10,2) AS avg_transaction_value,
        MAX(t.created_at) AS last_transaction_date
    FROM public.transactions t
    WHERE t.dealer_id = p_dealer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT
EXECUTE ON FUNCTION public.get_dealer_transaction_stats (UUID) TO authenticated;

-- =====================================================
-- ADDITIONAL HELPER FUNCTIONS
-- =====================================================

-- Function to get recent transactions for a dealer
CREATE OR REPLACE FUNCTION public.get_dealer_recent_transactions(
    p_dealer_id UUID,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    listing_id UUID,
    amount DECIMAL(10,2),
    currency TEXT,
    status TEXT,
    buyer_email TEXT,
    buyer_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.listing_id,
        t.amount,
        t.currency,
        t.status,
        t.buyer_email,
        t.buyer_name,
        t.created_at,
        t.completed_at
    FROM public.transactions t
    WHERE t.dealer_id = p_dealer_id
    ORDER BY t.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT
EXECUTE ON FUNCTION public.get_dealer_recent_transactions (UUID, INTEGER) TO authenticated;

-- Function to get monthly revenue for a dealer
CREATE OR REPLACE FUNCTION public.get_dealer_monthly_revenue(
    p_dealer_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_DATE - INTERVAL '12 months'),
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    month DATE,
    revenue DECIMAL(10,2),
    transaction_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE_TRUNC('month', t.created_at)::DATE AS month,
        COALESCE(SUM(t.amount), 0)::DECIMAL(10,2) AS revenue,
        COUNT(*)::BIGINT AS transaction_count
    FROM public.transactions t
    WHERE 
        t.dealer_id = p_dealer_id
        AND t.status = 'succeeded'
        AND t.created_at >= p_start_date
        AND t.created_at <= p_end_date
    GROUP BY DATE_TRUNC('month', t.created_at)
    ORDER BY month DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT
EXECUTE ON FUNCTION public.get_dealer_monthly_revenue (
    UUID,
    TIMESTAMP
    WITH
        TIME ZONE,
        TIMESTAMP
    WITH
        TIME ZONE
) TO authenticated;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON
TABLE public.transactions IS 'Transaction records for vehicle purchases through the platform';

COMMENT ON COLUMN public.transactions.stripe_payment_intent_id IS 'Stripe Payment Intent ID for tracking payments';

COMMENT ON COLUMN public.transactions.metadata IS 'Additional transaction metadata (fees, notes, etc.)';

COMMENT ON COLUMN public.transactions.shipping_address IS 'Structured shipping address in JSON format';

COMMENT ON FUNCTION public.get_dealer_transaction_stats (UUID) IS 'Returns comprehensive transaction statistics for a dealer';

COMMENT ON FUNCTION public.get_dealer_recent_transactions (UUID, INTEGER) IS 'Returns recent transactions for a dealer with optional limit';

COMMENT ON FUNCTION public.get_dealer_monthly_revenue (
    UUID,
    TIMESTAMP
    WITH
        TIME ZONE,
        TIMESTAMP
    WITH
        TIME ZONE
) IS 'Returns monthly revenue breakdown for a dealer within a date range';