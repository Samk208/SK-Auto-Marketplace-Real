-- Fix function search paths to prevent search_path manipulation attacks
-- See: https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable

-- 1. update_transactions_updated_at
CREATE OR REPLACE FUNCTION public.update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

-- 2. set_transaction_completed_at
CREATE OR REPLACE FUNCTION public.set_transaction_completed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'succeeded' AND OLD.status != 'succeeded' AND NEW.completed_at IS NULL THEN
        NEW.completed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

-- 3. get_dealer_transaction_stats
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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- 4. get_dealer_recent_transactions
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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- 5. get_dealer_monthly_revenue
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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;
