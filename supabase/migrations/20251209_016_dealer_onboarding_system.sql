-- ============================================================================
-- SK AutoSphere - Dealer Onboarding & Dashboard System
-- Migration: 016_dealer_onboarding_system
-- Date: 2025-12-09
-- Description: Complete dealer onboarding, verification, and dashboard system
-- ============================================================================

-- ============================================================================
-- DEALER APPLICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS dealer_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id TEXT UNIQUE NOT NULL, -- Format: DS-YYYYMMDD-XXX
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Step 1: Dealer Type
    dealer_type TEXT NOT NULL CHECK (dealer_type IN ('licensed_dealership', 'export_company', 'individual_seller')),
    
    -- Step 2: Business Information
    business_name TEXT NOT NULL,
    business_registration_number TEXT NOT NULL,
    business_type TEXT,
    year_established INT CHECK (year_established >= 1900 AND year_established <= EXTRACT(YEAR FROM NOW())),
    vehicles_in_stock TEXT, -- Range like "50-100"
    business_address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    
    -- Contact Information
    primary_contact_name TEXT NOT NULL,
    position_title TEXT,
    business_phone TEXT NOT NULL,
    mobile_phone TEXT,
    has_whatsapp BOOLEAN DEFAULT false,
    business_email TEXT NOT NULL,
    
    -- Step 3: Documents (stored in Supabase Storage)
    business_license_url TEXT,
    owner_id_url TEXT,
    bank_statement_url TEXT,
    lot_photos_urls JSONB DEFAULT '[]'::jsonb,
    documents_verified BOOLEAN DEFAULT false,
    
    -- Step 4: Bank Account
    bank_name TEXT,
    account_holder_name TEXT,
    account_number TEXT,
    swift_code TEXT,
    branch_name TEXT,
    bank_verified BOOLEAN DEFAULT false,
    verification_code TEXT, -- For ₩100 transfer verification
    
    -- Step 5: Deposit & Agreement
    deposit_paid BOOLEAN DEFAULT false,
    deposit_amount DECIMAL(10, 2) DEFAULT 500000.00,
    deposit_payment_method TEXT CHECK (deposit_payment_method IN ('bank_transfer', 'credit_card')),
    deposit_transaction_id TEXT,
    terms_accepted BOOLEAN DEFAULT false,
    privacy_accepted BOOLEAN DEFAULT false,
    info_accuracy_confirmed BOOLEAN DEFAULT false,
    
    -- Application Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'documents_review', 'bank_verification', 'deposit_pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    admin_notes TEXT,
    
    -- Timestamps
    submitted_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- DEALER DOCUMENTS TABLE (For tracking individual document uploads)
-- ============================================================================
CREATE TABLE IF NOT EXISTS dealer_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES dealer_applications(id) ON DELETE CASCADE,
    dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
    
    document_type TEXT NOT NULL CHECK (document_type IN (
        'business_license',
        'owner_id',
        'bank_statement',
        'lot_photo',
        'vehicle_registration',
        'insurance_certificate',
        'other'
    )),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INT, -- in bytes
    mime_type TEXT,
    
    -- AI Verification
    ai_verified BOOLEAN DEFAULT false,
    ai_confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
    ai_verification_notes TEXT,
    
    -- Manual Verification
    manually_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP,
    verification_notes TEXT,
    
    uploaded_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- DEALER BANK ACCOUNTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS dealer_bank_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE NOT NULL,
    
    bank_name TEXT NOT NULL,
    account_holder_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    swift_code TEXT,
    branch_name TEXT,
    
    -- Verification
    verified BOOLEAN DEFAULT false,
    verification_code TEXT,
    verification_sent_at TIMESTAMP,
    verified_at TIMESTAMP,
    
    -- Status
    is_primary BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- DEALER EARNINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS dealer_earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE NOT NULL,
    order_id UUID REFERENCES payment_escrow(id) ON DELETE SET NULL,
    
    -- Transaction Details
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('sale', 'commission', 'withdrawal', 'refund', 'deposit', 'fee')),
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'KRW',
    
    -- Sale Details (if applicable)
    vehicle_price DECIMAL(10, 2),
    commission_rate DECIMAL(5, 2), -- e.g., 10.00 for 10%
    commission_amount DECIMAL(10, 2),
    net_amount DECIMAL(10, 2), -- Amount dealer receives
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    
    -- Payment Details
    payment_method TEXT,
    transaction_reference TEXT,
    processed_at TIMESTAMP,
    
    description TEXT,
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- DEALER WITHDRAWALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS dealer_withdrawals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE NOT NULL,
    bank_account_id UUID REFERENCES dealer_bank_accounts(id) ON DELETE SET NULL,
    
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    currency TEXT DEFAULT 'KRW',
    
    -- Status
    status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'processing', 'completed', 'failed', 'cancelled')),
    
    -- Processing
    requested_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- Transaction Details
    transaction_reference TEXT,
    processing_fee DECIMAL(10, 2) DEFAULT 0,
    net_amount DECIMAL(10, 2),
    
    -- Admin
    processed_by UUID REFERENCES users(id),
    admin_notes TEXT,
    failure_reason TEXT,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- DEALER ANALYTICS TABLE (Daily aggregated stats)
-- ============================================================================
CREATE TABLE IF NOT EXISTS dealer_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    
    -- Listing Metrics
    total_listings INT DEFAULT 0,
    active_listings INT DEFAULT 0,
    sold_listings INT DEFAULT 0,
    
    -- Engagement Metrics
    total_views INT DEFAULT 0,
    total_inquiries INT DEFAULT 0,
    total_favorites INT DEFAULT 0,
    
    -- Sales Metrics
    total_sales INT DEFAULT 0,
    gross_revenue DECIMAL(12, 2) DEFAULT 0,
    commission_paid DECIMAL(12, 2) DEFAULT 0,
    net_revenue DECIMAL(12, 2) DEFAULT 0,
    
    -- Performance Metrics
    avg_days_to_sell DECIMAL(5, 2),
    conversion_rate DECIMAL(5, 2), -- inquiries to sales
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(dealer_id, date)
);

-- ============================================================================
-- VEHICLE LISTING PHOTOS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS listing_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES car_listings(id) ON DELETE CASCADE NOT NULL,
    
    photo_url TEXT NOT NULL,
    photo_type TEXT CHECK (photo_type IN (
        'front', 'rear', 'left_side', 'right_side',
        'interior_dashboard', 'interior_seats', 'engine_bay', 'trunk',
        'other'
    )),
    display_order INT DEFAULT 0,
    
    -- AI Quality Check
    quality_score DECIMAL(3, 2), -- 0.00 to 1.00
    is_blurry BOOLEAN DEFAULT false,
    has_good_lighting BOOLEAN DEFAULT true,
    
    uploaded_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- AI DAMAGE REPORTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS ai_damage_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES car_listings(id) ON DELETE CASCADE NOT NULL,
    
    -- Overall Assessment
    overall_condition TEXT CHECK (overall_condition IN ('excellent', 'good', 'fair', 'poor')),
    confidence_score DECIMAL(3, 2), -- 0.00 to 1.00
    
    -- Detected Issues
    issues_detected JSONB DEFAULT '[]'::jsonb, -- Array of {type, severity, location, repair_cost, photo_id}
    
    -- Summary
    has_major_damage BOOLEAN DEFAULT false,
    total_estimated_repair_cost DECIMAL(10, 2) DEFAULT 0,
    
    -- Blockchain/Verification
    blockchain_hash TEXT, -- For authenticity
    
    -- Status
    dealer_accepted BOOLEAN DEFAULT true,
    dealer_override BOOLEAN DEFAULT false,
    override_reason TEXT,
    requires_manual_review BOOLEAN DEFAULT false,
    manually_reviewed BOOLEAN DEFAULT false,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    
    scanned_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Dealer Applications
CREATE INDEX IF NOT EXISTS idx_dealer_applications_user_id ON dealer_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_dealer_applications_status ON dealer_applications(status);
CREATE INDEX IF NOT EXISTS idx_dealer_applications_application_id ON dealer_applications(application_id);

-- Dealer Documents
CREATE INDEX IF NOT EXISTS idx_dealer_documents_application_id ON dealer_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_dealer_documents_dealer_id ON dealer_documents(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_documents_type ON dealer_documents(document_type);

-- Dealer Bank Accounts
CREATE INDEX IF NOT EXISTS idx_dealer_bank_accounts_dealer_id ON dealer_bank_accounts(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_bank_accounts_verified ON dealer_bank_accounts(verified);

-- Dealer Earnings
CREATE INDEX IF NOT EXISTS idx_dealer_earnings_dealer_id ON dealer_earnings(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_earnings_status ON dealer_earnings(status);
CREATE INDEX IF NOT EXISTS idx_dealer_earnings_created_at ON dealer_earnings(created_at DESC);

-- Dealer Withdrawals
CREATE INDEX IF NOT EXISTS idx_dealer_withdrawals_dealer_id ON dealer_withdrawals(dealer_id);
CREATE INDEX IF NOT EXISTS idx_dealer_withdrawals_status ON dealer_withdrawals(status);

-- Dealer Analytics
CREATE INDEX IF NOT EXISTS idx_dealer_analytics_dealer_date ON dealer_analytics(dealer_id, date DESC);

-- Listing Photos
CREATE INDEX IF NOT EXISTS idx_listing_photos_listing_id ON listing_photos(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_photos_order ON listing_photos(listing_id, display_order);

-- AI Damage Reports
CREATE INDEX IF NOT EXISTS idx_ai_damage_reports_listing_id ON ai_damage_reports(listing_id);
CREATE INDEX IF NOT EXISTS idx_ai_damage_reports_major_damage ON ai_damage_reports(has_major_damage) WHERE has_major_damage = true;

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Generate Application ID
CREATE OR REPLACE FUNCTION generate_application_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    counter INT;
BEGIN
    -- Get count of applications today
    SELECT COUNT(*) + 1 INTO counter
    FROM dealer_applications
    WHERE DATE(created_at) = CURRENT_DATE;
    
    -- Format: DS-YYYYMMDD-XXX
    new_id := 'DS-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 3, '0');
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate application ID on insert
CREATE OR REPLACE FUNCTION set_application_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.application_id IS NULL THEN
        NEW.application_id := generate_application_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_application_id ON dealer_applications;
CREATE TRIGGER trigger_set_application_id
    BEFORE INSERT ON dealer_applications
    FOR EACH ROW
    EXECUTE FUNCTION set_application_id();

-- Calculate dealer balance
CREATE OR REPLACE FUNCTION get_dealer_balance(p_dealer_id UUID)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
    balance DECIMAL(10, 2);
BEGIN
    SELECT COALESCE(SUM(
        CASE 
            WHEN transaction_type IN ('sale', 'refund', 'deposit') THEN net_amount
            WHEN transaction_type IN ('commission', 'withdrawal', 'fee') THEN -amount
            ELSE 0
        END
    ), 0) INTO balance
    FROM dealer_earnings
    WHERE dealer_id = p_dealer_id
    AND status = 'completed';
    
    RETURN balance;
END;
$$ LANGUAGE plpgsql;

-- Update dealer stats when listing status changes
CREATE OR REPLACE FUNCTION update_dealer_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update active_listings count
    UPDATE dealers
    SET active_listings = (
        SELECT COUNT(*)
        FROM car_listings
        WHERE dealer_id = NEW.dealer_id
        AND status = 'active'
    )
    WHERE id = NEW.dealer_id;
    
    -- Update sold_vehicles count if status changed to sold
    IF NEW.status = 'sold' AND (OLD IS NULL OR OLD.status != 'sold') THEN
        UPDATE dealers
        SET sold_vehicles = sold_vehicles + 1
        WHERE id = NEW.dealer_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_dealer_stats ON car_listings;
CREATE TRIGGER trigger_update_dealer_stats
    AFTER INSERT OR UPDATE OF status ON car_listings
    FOR EACH ROW
    EXECUTE FUNCTION update_dealer_stats();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
DROP TRIGGER IF EXISTS trigger_dealer_applications_updated_at ON dealer_applications;
CREATE TRIGGER trigger_dealer_applications_updated_at
    BEFORE UPDATE ON dealer_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_dealer_bank_accounts_updated_at ON dealer_bank_accounts;
CREATE TRIGGER trigger_dealer_bank_accounts_updated_at
    BEFORE UPDATE ON dealer_bank_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS
ALTER TABLE dealer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_damage_reports ENABLE ROW LEVEL SECURITY;

-- Dealer Applications Policies
CREATE POLICY "Users can view their own applications"
    ON dealer_applications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications"
    ON dealer_applications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending applications"
    ON dealer_applications FOR UPDATE
    USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all applications"
    ON dealer_applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_app_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can update all applications"
    ON dealer_applications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_app_meta_data->>'role' = 'admin'
        )
    );

-- Dealer Documents Policies
CREATE POLICY "Dealers can view their own documents"
    ON dealer_documents FOR SELECT
    USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Dealers can upload their own documents"
    ON dealer_documents FOR INSERT
    WITH CHECK (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- Dealer Bank Accounts Policies
CREATE POLICY "Dealers can view their own bank accounts"
    ON dealer_bank_accounts FOR SELECT
    USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Dealers can manage their own bank accounts"
    ON dealer_bank_accounts FOR ALL
    USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- Dealer Earnings Policies
CREATE POLICY "Dealers can view their own earnings"
    ON dealer_earnings FOR SELECT
    USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- Dealer Withdrawals Policies
CREATE POLICY "Dealers can view their own withdrawals"
    ON dealer_withdrawals FOR SELECT
    USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Dealers can request withdrawals"
    ON dealer_withdrawals FOR INSERT
    WITH CHECK (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- Dealer Analytics Policies
CREATE POLICY "Dealers can view their own analytics"
    ON dealer_analytics FOR SELECT
    USING (
        dealer_id IN (
            SELECT id FROM dealers WHERE user_id = auth.uid()
        )
    );

-- Listing Photos Policies
CREATE POLICY "Anyone can view listing photos"
    ON listing_photos FOR SELECT
    USING (true);

CREATE POLICY "Dealers can manage their listing photos"
    ON listing_photos FOR ALL
    USING (
        listing_id IN (
            SELECT id FROM car_listings
            WHERE dealer_id IN (
                SELECT id FROM dealers WHERE user_id = auth.uid()
            )
        )
    );

-- AI Damage Reports Policies
CREATE POLICY "Anyone can view damage reports for active listings"
    ON ai_damage_reports FOR SELECT
    USING (
        listing_id IN (
            SELECT id FROM car_listings WHERE status = 'active'
        )
    );

CREATE POLICY "Dealers can view their own damage reports"
    ON ai_damage_reports FOR SELECT
    USING (
        listing_id IN (
            SELECT id FROM car_listings
            WHERE dealer_id IN (
                SELECT id FROM dealers WHERE user_id = auth.uid()
            )
        )
    );

-- ============================================================================
-- INITIAL DATA / SAMPLE DATA
-- ============================================================================

-- Add sample dealer application (for testing)
INSERT INTO dealer_applications (
    user_id,
    dealer_type,
    business_name,
    business_registration_number,
    year_established,
    vehicles_in_stock,
    business_address,
    city,
    postal_code,
    primary_contact_name,
    position_title,
    business_phone,
    mobile_phone,
    has_whatsapp,
    business_email,
    status
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'licensed_dealership',
    'Seoul Motors Co., Ltd.',
    '123-45-67890',
    2015,
    '50-100',
    '123 Gangnam-daero, Gangnam-gu',
    'Seoul',
    '06241',
    'Kim Min-soo',
    'Sales Manager',
    '+82-10-1234-5678',
    '+82-10-1234-5678',
    true,
    'contact@seulmotors.com',
    'approved'
) ON CONFLICT DO NOTHING;

-- ============================================================================
-- END OF MIGRATION 016
-- ============================================================================
