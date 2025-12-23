-- ============================================================================
-- SK AutoSphere - Database Setup Script
-- Migration: 001_initial_schema
-- Date: 2025-11-30
-- Status: ✅ APPLIED
-- ============================================================================
--
-- This is the ORIGINAL schema that was applied to create tables, indexes,
-- functions, triggers, and sample data.
--
-- ⚠️ DO NOT RUN AGAIN - Already applied to database
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
    ) ON CONFLICT (email) DO NOTHING;

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
        'Premium Korean vehicle exports to Africa. Specializing in Hyundai, Kia, and Genesis.',
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
        'Your trusted partner for Korean commercial vehicles and buses.',
        'https://api.dicebear.com/7.x/initials/svg?seed=SA',
        4.7,
        156,
        true,
        'Busan, South Korea',
        12,
        380
    ) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- END OF MIGRATION 001
-- ============================================================================