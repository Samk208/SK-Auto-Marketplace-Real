-- ============================================================================
-- SK AutoSphere - Database Setup Script
-- Phase 1.1 - Initial Schema
-- ============================================================================
--
-- Run this script in your Supabase SQL Editor:
-- 1. Go to https://supabase.com/dashboard
-- 2. Select project: ocunqereputrqcblpzvu
-- 3. Navigate to SQL Editor
-- 4. Paste and run this entire script
--
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    whatsapp TEXT,
    role TEXT NOT NULL CHECK (
        role IN ('buyer', 'dealer', 'admin')
    ),
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Dealers table
CREATE TABLE IF NOT EXISTS dealers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    rating DECIMAL(2, 1) DEFAULT 0 CHECK (
        rating >= 0
        AND rating <= 5
    ),
    review_count INT DEFAULT 0 CHECK (review_count >= 0),
    verified BOOLEAN DEFAULT false,
    location TEXT,
    joined_date TIMESTAMP DEFAULT NOW(),
    active_listings INT DEFAULT 0 CHECK (active_listings >= 0),
    sold_vehicles INT DEFAULT 0 CHECK (sold_vehicles >= 0)
);

-- Car listings table
CREATE TABLE IF NOT EXISTS car_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    dealer_id UUID REFERENCES dealers (id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INT NOT NULL CHECK (
        year >= 1900
        AND year <= 2100
    ),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    currency TEXT DEFAULT 'USD',
    mileage INT CHECK (mileage >= 0),
    body_type TEXT,
    transmission TEXT,
    fuel_type TEXT,
    condition TEXT,
    location TEXT,
    destination_port TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    specifications JSONB DEFAULT '{}'::jsonb,
    status TEXT CHECK (
        status IN (
            'pending',
            'active',
            'sold',
            'rejected'
        )
    ) DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    views INT DEFAULT 0 CHECK (views >= 0),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

CREATE INDEX IF NOT EXISTS idx_dealers_user_id ON dealers (user_id);

CREATE INDEX IF NOT EXISTS idx_dealers_verified ON dealers (verified);

CREATE INDEX IF NOT EXISTS idx_listings_dealer ON car_listings (dealer_id);

CREATE INDEX IF NOT EXISTS idx_listings_status ON car_listings (status);

CREATE INDEX IF NOT EXISTS idx_listings_brand ON car_listings (brand);

CREATE INDEX IF NOT EXISTS idx_listings_body_type ON car_listings (body_type);

CREATE INDEX IF NOT EXISTS idx_listings_destination_port ON car_listings (destination_port);

CREATE INDEX IF NOT EXISTS idx_listings_created_at ON car_listings (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_listings_featured ON car_listings (featured)
WHERE
    featured = true;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_listing_views(listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE car_listings
  SET views = views + 1
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger for users updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for car_listings updated_at
DROP TRIGGER IF EXISTS update_car_listings_updated_at ON car_listings;

CREATE TRIGGER update_car_listings_updated_at
  BEFORE UPDATE ON car_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA (for testing)
-- ============================================================================

-- Insert test users (Korean dealers)
INSERT INTO
    users (
        id,
        email,
        password_hash,
        full_name,
        phone,
        whatsapp,
        role,
        verified
    )
VALUES (
        '11111111-1111-1111-1111-111111111111',
        'dealer1@skautosphere.com',
        '$2a$10$sample_hash_for_testing',
        'Kim Sung-Ho',
        '+821012345678',
        '+821012345678',
        'dealer',
        true
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'dealer2@skautosphere.com',
        '$2a$10$sample_hash_for_testing',
        'Park Ji-Yeon',
        '+821098765432',
        '+821098765432',
        'dealer',
        true
    )
ON CONFLICT (email) DO NOTHING;

-- Insert test dealers (Korean auto exporters)
INSERT INTO
    dealers (
        id,
        user_id,
        business_name,
        description,
        logo_url,
        rating,
        review_count,
        verified,
        location,
        active_listings,
        sold_vehicles
    )
VALUES (
        'd1111111-1111-1111-1111-111111111111',
        '11111111-1111-1111-1111-111111111111',
        'SK Korea Motors',
        'Premium Korean vehicle exports to Africa. Specializing in Hyundai, Kia, and Genesis. Direct from Korean auctions with full inspection reports.',
        'https://api.dicebear.com/7.x/initials/svg?seed=SK',
        4.9,
        234,
        true,
        'Incheon, South Korea',
        15,
        520
    ),
    (
        'd2222222-2222-2222-2222-222222222222',
        '22222222-2222-2222-2222-222222222222',
        'Seoul Auto Export',
        'Your trusted partner for Korean commercial vehicles and buses. Serving West and East Africa since 2015.',
        'https://api.dicebear.com/7.x/initials/svg?seed=SA',
        4.7,
        156,
        true,
        'Busan, South Korea',
        12,
        380
    )
ON CONFLICT (id) DO NOTHING;

-- Insert Korean car listings
-- Dealer IDs match: d1111111-... (SK Korea Motors) and d2222222-... (Seoul Auto Export)
INSERT INTO
    car_listings (
        id,
        dealer_id,
        title,
        brand,
        model,
        year,
        price,
        currency,
        mileage,
        body_type,
        transmission,
        fuel_type,
        condition,
        location,
        destination_port,
        images,
        specifications,
        status,
        featured
    )
VALUES
    -- Hyundai Sonata (SK Korea Motors)
    (
        'c1111111-1111-1111-1111-111111111111',
        'd1111111-1111-1111-1111-111111111111',
        '2019 Hyundai Sonata Smart – Export Ready',
        'Hyundai',
        'Sonata',
        2019,
        14500.00,
        'USD',
        62000,
        'sedan',
        'Automatic',
        'Petrol',
        'Very Good',
        'Incheon, South Korea',
        'lagos',
        '[
      "https://images.unsplash.com/photo-1629897048514-3dd7414fe72a",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6"
    ]'::jsonb,
        '{
      "trim": "Smart",
      "drive": "FWD",
      "features": ["Backup Camera", "Bluetooth", "Keyless Start", "Apple CarPlay"],
      "description": "Direct from Korean owner, no accident, full service history. Popular choice for African markets."
    }'::jsonb,
        'active',
        true
    ),
    -- Kia Sportage (SK Korea Motors)
    (
        'c2222222-2222-2222-2222-222222222222',
        'd1111111-1111-1111-1111-111111111111',
        '2020 Kia Sportage 2.0 Diesel – Africa Spec',
        'Kia',
        'Sportage',
        2020,
        18500.00,
        'USD',
        48000,
        'suv',
        'Automatic',
        'Diesel',
        'Excellent',
        'Seoul, South Korea',
        'tema',
        '[
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24",
      "https://images.unsplash.com/photo-1511391037251-0e1bbfd62138"
    ]'::jsonb,
        '{
      "trim": "GT-Line",
      "drive": "AWD",
      "features": ["AWD", "Parking Sensors", "Apple CarPlay", "Heated Seats"],
      "description": "Ideal for African roads, excellent ground clearance, no rust. Diesel engine perfect for long distances."
    }'::jsonb,
        'active',
        true
    ),
    -- Hyundai County Bus (Seoul Auto Export)
    (
        'c3333333-3333-3333-3333-333333333333',
        'd2222222-2222-2222-2222-222222222222',
        '2018 Hyundai County Mini-Bus 25-Seater',
        'Hyundai',
        'County',
        2018,
        29500.00,
        'USD',
        92000,
        'bus',
        'Manual',
        'Diesel',
        'Good',
        'Busan, South Korea',
        'conakry',
        '[
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e"
    ]'::jsonb,
        '{
      "seats": 25,
      "usage": "Passenger / Staff Bus",
      "features": ["Air Conditioning", "High Roof", "Luggage Compartment"],
      "description": "Perfect for mining sites, schools, and staff transport contracts. Well-maintained Korean bus."
    }'::jsonb,
        'active',
        true
    ),
    -- Kia Bongo Truck (Seoul Auto Export)
    (
        'c4444444-4444-4444-4444-444444444444',
        'd2222222-2222-2222-2222-222222222222',
        '2017 Kia Bongo III 1-Ton Truck',
        'Kia',
        'Bongo III',
        2017,
        12500.00,
        'USD',
        118000,
        'truck',
        'Manual',
        'Diesel',
        'Good',
        'Ulsan, South Korea',
        'mombasa',
        '[
      "https://images.unsplash.com/photo-1542362567-b07e54358753",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64"
    ]'::jsonb,
        '{
      "payload": "1 ton",
      "usage": "Light cargo / project logistics",
      "features": ["Single Cabin", "Power Steering", "Air Conditioning"],
      "description": "Reliable workhorse, perfect for local delivery and construction support. Very popular in Africa."
    }'::jsonb,
        'active',
        false
    ),
    -- Genesis G80 (SK Korea Motors)
    (
        'c5555555-5555-5555-5555-555555555555',
        'd1111111-1111-1111-1111-111111111111',
        '2021 Genesis G80 Luxury Package',
        'Genesis',
        'G80',
        2021,
        36500.00,
        'USD',
        31000,
        'sedan',
        'Automatic',
        'Petrol',
        'Excellent',
        'Seongnam, South Korea',
        'lagos',
        '[
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb",
      "https://images.unsplash.com/photo-1542365876-8a4e1f62ca87"
    ]'::jsonb,
        '{
      "trim": "Luxury",
      "drive": "RWD",
      "features": ["Leather Seats", "360 Camera", "Adaptive Cruise", "Premium Audio"],
      "description": "Executive sedan, ideal for high-end clients and corporate fleets. Korean luxury at its finest."
    }'::jsonb,
        'active',
        true
    ),
    -- Hyundai Tucson (SK Korea Motors)
    (
        'c6666666-6666-6666-6666-666666666666',
        'd1111111-1111-1111-1111-111111111111',
        '2022 Hyundai Tucson Hybrid SEL',
        'Hyundai',
        'Tucson',
        2022,
        28500.00,
        'USD',
        22000,
        'suv',
        'Automatic',
        'Hybrid',
        'Excellent',
        'Incheon, South Korea',
        'durban',
        '[
      "https://images.unsplash.com/photo-1619682817481-e994891cd1f5",
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6"
    ]'::jsonb,
        '{
      "trim": "SEL",
      "drive": "AWD",
      "features": ["Hybrid Engine", "Panoramic Sunroof", "Wireless Charging", "Lane Keep Assist"],
      "description": "Fuel-efficient hybrid SUV, perfect for eco-conscious buyers. Low running costs."
    }'::jsonb,
        'active',
        true
    ),
    -- Kia Carnival (Seoul Auto Export)
    (
        'c7777777-7777-7777-7777-777777777777',
        'd2222222-2222-2222-2222-222222222222',
        '2020 Kia Carnival 11-Seater VIP',
        'Kia',
        'Carnival',
        2020,
        32000.00,
        'USD',
        45000,
        'van',
        'Automatic',
        'Diesel',
        'Excellent',
        'Busan, South Korea',
        'lagos',
        '[
      "https://images.unsplash.com/photo-1559416523-140ddc3d238c",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2"
    ]'::jsonb,
        '{
      "seats": 11,
      "trim": "VIP",
      "features": ["VIP Seating", "Dual Sunroof", "Rear Entertainment", "Power Sliding Doors"],
      "description": "Premium family MPV, ideal for VIP transport, hotels, and large families."
    }'::jsonb,
        'active',
        true
    ),
    -- SsangYong Rexton (Seoul Auto Export)
    (
        'c8888888-8888-8888-8888-888888888888',
        'd2222222-2222-2222-2222-222222222222',
        '2019 SsangYong Rexton 4WD Premium',
        'SsangYong',
        'Rexton',
        2019,
        24500.00,
        'USD',
        55000,
        'suv',
        'Automatic',
        'Diesel',
        'Very Good',
        'Seoul, South Korea',
        'mombasa',
        '[
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6",
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24"
    ]'::jsonb,
        '{
      "trim": "Premium",
      "drive": "4WD",
      "features": ["4WD", "7 Seats", "Towing Package", "Leather Interior"],
      "description": "Rugged Korean SUV, excellent for off-road and towing. Mercedes-derived engine."
    }'::jsonb,
        'active',
        false
    ),
    -- Hyundai Porter Truck (Seoul Auto Export)
    (
        'c9999999-9999-9999-9999-999999999999',
        'd2222222-2222-2222-2222-222222222222',
        '2020 Hyundai Porter II Super Cab',
        'Hyundai',
        'Porter II',
        2020,
        15500.00,
        'USD',
        68000,
        'truck',
        'Manual',
        'Diesel',
        'Very Good',
        'Ulsan, South Korea',
        'tema',
        '[
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
      "https://images.unsplash.com/photo-1542362567-b07e54358753"
    ]'::jsonb,
        '{
      "payload": "1.2 ton",
      "cabin": "Super Cab",
      "features": ["Extended Cab", "Air Conditioning", "Power Windows"],
      "description": "Best-selling Korean light truck. Perfect for small businesses and deliveries."
    }'::jsonb,
        'active',
        false
    ),
    -- Kia K5 (SK Korea Motors)
    (
        'ca000000-0000-0000-0000-000000000000',
        'd1111111-1111-1111-1111-111111111111',
        '2021 Kia K5 GT-Line Turbo',
        'Kia',
        'K5',
        2021,
        22500.00,
        'USD',
        38000,
        'sedan',
        'Automatic',
        'Petrol',
        'Excellent',
        'Seoul, South Korea',
        'lagos',
        '[
      "https://images.unsplash.com/photo-1629897048514-3dd7414fe72a",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8"
    ]'::jsonb,
        '{
      "trim": "GT-Line",
      "engine": "1.6T",
      "features": ["Turbo Engine", "Sport Mode", "Bose Audio", "Wireless CarPlay"],
      "description": "Sporty mid-size sedan with turbocharged performance. Head-turner design."
    }'::jsonb,
        'active',
        true
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check row counts
DO $$
DECLARE
  user_count INT;
  dealer_count INT;
  listing_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count FROM users;
  SELECT COUNT(*) INTO dealer_count FROM dealers;
  SELECT COUNT(*) INTO listing_count FROM car_listings;

  RAISE NOTICE '===========================================';
  RAISE NOTICE 'SK AutoSphere Database Setup Complete!';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Users: % (expected: 2)', user_count;
  RAISE NOTICE 'Dealers: % (expected: 2)', dealer_count;
  RAISE NOTICE 'Listings: % (expected: 10 Korean vehicles)', listing_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Korean Brands: Hyundai, Kia, Genesis, SsangYong';
  RAISE NOTICE 'Dealers: SK Korea Motors, Seoul Auto Export';
  RAISE NOTICE '===========================================';
END $$;

-- ============================================================================
-- OPTIONAL: Row Level Security (RLS) Setup
-- (Disabled for Phase 1.1, enable in later phase)
-- ============================================================================

-- Uncomment these when implementing authentication in Phase 1.4

-- Enable RLS
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE car_listings ENABLE ROW LEVEL SECURITY;

-- Public can view active listings
-- CREATE POLICY "Public can view active listings" ON car_listings
--   FOR SELECT USING (status = 'active');

-- Dealers can view their own listings
-- CREATE POLICY "Dealers can view own listings" ON car_listings
--   FOR SELECT USING (dealer_id IN (
--     SELECT id FROM dealers WHERE user_id = auth.uid()
--   ));

-- Dealers can insert their own listings
-- CREATE POLICY "Dealers can insert listings" ON car_listings
--   FOR INSERT WITH CHECK (dealer_id IN (
--     SELECT id FROM dealers WHERE user_id = auth.uid()
--   ));

-- Dealers can update their own listings
-- CREATE POLICY "Dealers can update own listings" ON car_listings
--   FOR UPDATE USING (dealer_id IN (
--     SELECT id FROM dealers WHERE user_id = auth.uid()
--   ));

-- ============================================================================
-- END OF SETUP SCRIPT
-- ============================================================================

-- ✅ Your database is now ready for Phase 1.1 API testing!
--
-- Next steps:
-- 1. Run your Next.js dev server: npm run dev
-- 2. Test the API: http://localhost:3000/api/listings
-- 3. See PHASE-1.1-BACKEND-INTEGRATION.md for full documentation