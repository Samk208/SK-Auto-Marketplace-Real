-- Optimize admin stats page query
-- Replaces multiple client-side queries with a single server-side RPC

CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
    seven_days_ago TIMESTAMP WITH TIME ZONE;
BEGIN
    seven_days_ago := NOW() - INTERVAL '7 days';

    WITH 
    -- 1. Listing Stats
    listing_metrics AS (
        SELECT 
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'active') as active,
            COUNT(*) FILTER (WHERE status = 'pending') as pending,
            COUNT(*) FILTER (WHERE status = 'sold') as sold,
            COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
            COUNT(*) FILTER (WHERE created_at >= seven_days_ago) as new_this_week
        FROM car_listings
    ),
    
    -- 2. Dealer Stats
    dealer_metrics AS (
        SELECT 
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE verified = true) as verified,
            COUNT(*) FILTER (WHERE verified = false) as unverified,
            COUNT(*) FILTER (WHERE joined_date >= seven_days_ago) as new_this_week
        FROM dealers
    ),
    
    -- 3. Revenue Stats (from transactions)
    revenue_metrics AS (
        SELECT 
            COALESCE(SUM(amount), 0) as total,
            COALESCE(SUM(amount) FILTER (WHERE created_at >= seven_days_ago), 0) as recent
        FROM transactions
        WHERE status = 'succeeded'
    )
    
    SELECT jsonb_build_object(
        'listings', jsonb_build_object(
            'total', (SELECT total FROM listing_metrics),
            'active', (SELECT active FROM listing_metrics),
            'pending', (SELECT pending FROM listing_metrics),
            'sold', (SELECT sold FROM listing_metrics),
            'rejected', (SELECT rejected FROM listing_metrics)
        ),
        'dealers', jsonb_build_object(
            'total', (SELECT total FROM dealer_metrics),
            'verified', (SELECT verified FROM dealer_metrics),
            'unverified', (SELECT unverified FROM dealer_metrics)
        ),
        'revenue', jsonb_build_object(
            'total', (SELECT total FROM revenue_metrics),
            'currency', 'USD',
            'growth', CASE 
                WHEN (SELECT total FROM revenue_metrics) > 0 
                THEN ((SELECT recent FROM revenue_metrics) / (SELECT total FROM revenue_metrics) * 100)
                ELSE 0 
            END
        ),
        'activity', jsonb_build_object(
            'newListingsThisWeek', (SELECT new_this_week FROM listing_metrics),
            'newDealersThisWeek', (SELECT new_this_week FROM dealer_metrics)
        ),
        'lastUpdated', NOW()
    ) INTO result;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- Grant access to authenticated users
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_stats() TO authenticated;
