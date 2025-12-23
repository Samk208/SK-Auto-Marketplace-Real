-- ============================================================================
-- Migration: 018_market_insights
-- Description: Adds shipping_rates table and market trends RPC function
-- ============================================================================

-- 1. Create Shipping Rates Table available for public read (for calculator)
CREATE TABLE IF NOT EXISTS shipping_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_country TEXT NOT NULL UNIQUE,
    port_name TEXT NOT NULL,
    base_rate_sedan DECIMAL(10, 2) NOT NULL,
    base_rate_suv DECIMAL(10, 2) NOT NULL,
    transit_time_days INT NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read of shipping rates" ON shipping_rates
    FOR SELECT USING (true);

-- Seed Data
INSERT INTO shipping_rates (destination_country, port_name, base_rate_sedan, base_rate_suv, transit_time_days)
VALUES 
('Ghana', 'Tema', 1200, 1500, 35),
('Nigeria', 'Lagos (Apapa)', 1300, 1600, 40),
('Kenya', 'Mombasa', 1400, 1700, 30),
('Guinea', 'Conakry', 1350, 1650, 45),
('Tanzania', 'Dar es Salaam', 1450, 1750, 32)
ON CONFLICT (destination_country) DO UPDATE 
SET base_rate_sedan = EXCLUDED.base_rate_sedan,
    base_rate_suv = EXCLUDED.base_rate_suv,
    updated_at = NOW();

-- 2. Create get_market_trends RPC function
CREATE OR REPLACE FUNCTION get_market_trends()
RETURNS JSONB AS $$
DECLARE
  top_models JSONB;
  shipping_routes JSONB;
BEGIN
  -- 1. Get Top 5 Models by View Count (Demand)
  -- If no views, fallback to count
  SELECT jsonb_agg(t) INTO top_models
  FROM (
    SELECT 
        model, 
        brand, 
        COUNT(*) as listing_count, 
        COALESCE(SUM(views), 0) as total_views, 
        ROUND(AVG(price)) as avg_price
    FROM car_listings
    WHERE status = 'active'
    GROUP BY model, brand
    ORDER BY total_views DESC, listing_count DESC
    LIMIT 5
  ) t;

  -- 2. Get Shipping Route Data
  SELECT jsonb_agg(s) INTO shipping_routes
  FROM (
    SELECT destination_country, port_name, base_rate_suv, transit_time_days
    FROM shipping_rates
    ORDER BY base_rate_suv ASC
    LIMIT 5
  ) s;

  -- 3. Return combined result
  RETURN jsonb_build_object(
    'top_models', COALESCE(top_models, '[]'::jsonb),
    'shipping_routes', COALESCE(shipping_routes, '[]'::jsonb),
    'generated_at', NOW()
  );
END;
$$ LANGUAGE plpgsql;
