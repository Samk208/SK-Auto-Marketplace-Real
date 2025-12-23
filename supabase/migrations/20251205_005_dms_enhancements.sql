-- ============================================
-- ENHANCED VEHICLE SCHEMA (Inspired by DMS)
-- For SK AutoSphere - Supabase Backend
-- ============================================

-- 1. IMPROVE car_listings table with DMS patterns
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS vin VARCHAR(17) UNIQUE;
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS condition VARCHAR(20) CHECK (condition IN ('excellent', 'good', 'fair', 'poor'));
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS previous_owners INTEGER DEFAULT 0;
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS transmission VARCHAR(20) CHECK (transmission IN ('automatic', 'manual', 'cvt', 'dual-clutch'));
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS fuel_type VARCHAR(20) CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid', 'lpg'));
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS exterior_color VARCHAR(50);
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS interior_color VARCHAR(50);
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS engine_size DECIMAL(3,1); -- e.g., 2.0, 3.5
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS horsepower INTEGER;
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS seating_capacity INTEGER DEFAULT 5;
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS service_history JSONB DEFAULT '[]'::jsonb;
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS inspection_report_url TEXT;
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS available_for_viewing BOOLEAN DEFAULT true;
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS location_city VARCHAR(100);
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS location_country VARCHAR(2) DEFAULT 'KR';

-- 2. CREATE vehicle_specifications table (DMS pattern)
CREATE TABLE IF NOT EXISTS vehicle_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES car_listings(id) ON DELETE CASCADE,
  length_mm INTEGER,
  width_mm INTEGER,
  height_mm INTEGER,
  wheelbase_mm INTEGER,
  weight_kg INTEGER,
  fuel_tank_capacity DECIMAL(5,1),
  trunk_capacity_liters INTEGER,
  acceleration_0_100 DECIMAL(3,1), -- seconds
  top_speed_kmh INTEGER,
  fuel_efficiency_city DECIMAL(4,1), -- km/L
  fuel_efficiency_highway DECIMAL(4,1),
  co2_emissions INTEGER, -- g/km
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_listing_spec UNIQUE(listing_id)
);

-- 3. CREATE sales_transactions table (DMS pattern)
CREATE TABLE IF NOT EXISTS sales_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES car_listings(id),
  dealer_id UUID NOT NULL REFERENCES dealers(id),
  buyer_email VARCHAR(255) NOT NULL,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_phone VARCHAR(50),
  buyer_country VARCHAR(2) NOT NULL, -- African buyer countries
  sale_price DECIMAL(12,2) NOT NULL,
  dealer_commission DECIMAL(12,2) NOT NULL,
  platform_fee DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method VARCHAR(50),
  shipping_address JSONB,
  shipping_cost DECIMAL(10,2),
  shipping_status VARCHAR(20) CHECK (shipping_status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  documents JSONB DEFAULT '[]'::jsonb, -- KYC, contracts, etc.
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE vehicle_inquiries table (DMS pattern)
CREATE TABLE IF NOT EXISTS vehicle_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES car_listings(id),
  dealer_id UUID NOT NULL REFERENCES dealers(id),
  buyer_email VARCHAR(255) NOT NULL,
  buyer_name VARCHAR(255) NOT NULL,
  buyer_phone VARCHAR(50),
  buyer_country VARCHAR(2),
  message TEXT NOT NULL,
  inquiry_type VARCHAR(50) CHECK (inquiry_type IN ('general', 'price_negotiation', 'inspection', 'shipping', 'financing')),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'responded', 'closed')),
  dealer_response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE vehicle_views table (analytics)
CREATE TABLE IF NOT EXISTS vehicle_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES car_listings(id),
  viewer_country VARCHAR(2),
  viewer_ip VARCHAR(45),
  user_agent TEXT,
  referrer TEXT,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. INDEXES for performance (DMS pattern)
CREATE INDEX IF NOT EXISTS idx_listings_vin ON car_listings(vin);
CREATE INDEX IF NOT EXISTS idx_listings_make_model ON car_listings(make, model);
CREATE INDEX IF NOT EXISTS idx_listings_price ON car_listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_year ON car_listings(year);
CREATE INDEX IF NOT EXISTS idx_listings_dealer ON car_listings(dealer_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON car_listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_location ON car_listings(location_city, location_country);
CREATE INDEX IF NOT EXISTS idx_transactions_dealer ON sales_transactions(dealer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON sales_transactions(payment_status);
CREATE INDEX IF NOT EXISTS idx_inquiries_dealer ON vehicle_inquiries(dealer_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON vehicle_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_views_listing ON vehicle_views(listing_id);

-- 7. RLS POLICIES for new tables

-- vehicle_specifications
ALTER TABLE vehicle_specifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view specifications"
ON vehicle_specifications FOR SELECT
USING (true);

CREATE POLICY "Dealers can manage own vehicle specs"
ON vehicle_specifications FOR ALL
TO authenticated
USING (
  listing_id IN (
    SELECT id FROM car_listings
    WHERE dealer_id IN (
      SELECT id FROM dealers WHERE user_id = auth.uid()
    )
  )
);

-- sales_transactions
ALTER TABLE sales_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dealers can view own transactions"
ON sales_transactions FOR SELECT
TO authenticated
USING (
  dealer_id IN (
    SELECT id FROM dealers WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all transactions"
ON sales_transactions FOR SELECT
TO authenticated
USING (
  (auth.jwt() -> 'app_metadata' ->> 'role')::text = 'admin'
);

-- vehicle_inquiries
ALTER TABLE vehicle_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit inquiries"
ON vehicle_inquiries FOR INSERT
WITH CHECK (true);

CREATE POLICY "Dealers can view own inquiries"
ON vehicle_inquiries FOR SELECT
TO authenticated
USING (
  dealer_id IN (
    SELECT id FROM dealers WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Dealers can respond to inquiries"
ON vehicle_inquiries FOR UPDATE
TO authenticated
USING (
  dealer_id IN (
    SELECT id FROM dealers WHERE user_id = auth.uid()
  )
);

-- vehicle_views (analytics only)
ALTER TABLE vehicle_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "System can insert views"
ON vehicle_views FOR INSERT
WITH CHECK (true);

CREATE POLICY "Dealers can view own listing analytics"
ON vehicle_views FOR SELECT
TO authenticated
USING (
  listing_id IN (
    SELECT id FROM car_listings
    WHERE dealer_id IN (
      SELECT id FROM dealers WHERE user_id = auth.uid()
    )
  )
);

-- 8. FUNCTIONS for search (DMS pattern)

-- Advanced vehicle search
CREATE OR REPLACE FUNCTION search_vehicles(
  p_make VARCHAR DEFAULT NULL,
  p_model VARCHAR DEFAULT NULL,
  p_min_year INTEGER DEFAULT NULL,
  p_max_year INTEGER DEFAULT NULL,
  p_min_price DECIMAL DEFAULT NULL,
  p_max_price DECIMAL DEFAULT NULL,
  p_condition VARCHAR DEFAULT NULL,
  p_fuel_type VARCHAR DEFAULT NULL,
  p_transmission VARCHAR DEFAULT NULL,
  p_location_country VARCHAR DEFAULT NULL,
  p_dealer_id UUID DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  make VARCHAR,
  model VARCHAR,
  year INTEGER,
  price DECIMAL,
  mileage INTEGER,
  condition VARCHAR,
  fuel_type VARCHAR,
  transmission VARCHAR,
  images JSONB,
  dealer_name VARCHAR,
  location_city VARCHAR,
  total_views BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cl.id,
    cl.make,
    cl.model,
    cl.year,
    cl.price,
    cl.mileage,
    cl.condition,
    cl.fuel_type,
    cl.transmission,
    cl.images,
    d.company_name as dealer_name,
    cl.location_city,
    COUNT(vv.id) as total_views
  FROM car_listings cl
  LEFT JOIN dealers d ON cl.dealer_id = d.id
  LEFT JOIN vehicle_views vv ON cl.id = vv.listing_id
  WHERE cl.status = 'active'
    AND (p_make IS NULL OR cl.make ILIKE '%' || p_make || '%')
    AND (p_model IS NULL OR cl.model ILIKE '%' || p_model || '%')
    AND (p_min_year IS NULL OR cl.year >= p_min_year)
    AND (p_max_year IS NULL OR cl.year <= p_max_year)
    AND (p_min_price IS NULL OR cl.price >= p_min_price)
    AND (p_max_price IS NULL OR cl.price <= p_max_price)
    AND (p_condition IS NULL OR cl.condition = p_condition)
    AND (p_fuel_type IS NULL OR cl.fuel_type = p_fuel_type)
    AND (p_transmission IS NULL OR cl.transmission = p_transmission)
    AND (p_location_country IS NULL OR cl.location_country = p_location_country)
    AND (p_dealer_id IS NULL OR cl.dealer_id = p_dealer_id)
  GROUP BY cl.id, d.company_name
  ORDER BY cl.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get dealer statistics (DMS pattern)
CREATE OR REPLACE FUNCTION get_dealer_stats(p_dealer_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_listings', COUNT(*),
    'active_listings', COUNT(*) FILTER (WHERE status = 'active'),
    'sold_listings', COUNT(*) FILTER (WHERE status = 'sold'),
    'pending_listings', COUNT(*) FILTER (WHERE status = 'pending'),
    'total_views', COALESCE(SUM((
      SELECT COUNT(*) FROM vehicle_views WHERE listing_id = cl.id
    )), 0),
    'total_inquiries', (
      SELECT COUNT(*) FROM vehicle_inquiries WHERE dealer_id = p_dealer_id
    ),
    'total_sales', (
      SELECT COUNT(*) FROM sales_transactions WHERE dealer_id = p_dealer_id AND payment_status = 'paid'
    ),
    'total_revenue', (
      SELECT COALESCE(SUM(dealer_commission), 0) FROM sales_transactions WHERE dealer_id = p_dealer_id AND payment_status = 'paid'
    )
  ) INTO v_stats
  FROM car_listings cl
  WHERE cl.dealer_id = p_dealer_id;
  
  RETURN v_stats;
END;
$$ LANGUAGE plpgsql STABLE;

-- Record vehicle view
CREATE OR REPLACE FUNCTION record_vehicle_view(
  p_listing_id UUID,
  p_viewer_country VARCHAR DEFAULT NULL,
  p_viewer_ip VARCHAR DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO vehicle_views (
    listing_id, viewer_country, viewer_ip, user_agent, referrer
  ) VALUES (
    p_listing_id, p_viewer_country, p_viewer_ip, p_user_agent, p_referrer
  );
END;
$$ LANGUAGE plpgsql;

-- 9. TRIGGERS for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vehicle_specs_updated_at
BEFORE UPDATE ON vehicle_specifications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON sales_transactions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
