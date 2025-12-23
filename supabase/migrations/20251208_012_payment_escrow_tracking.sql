-- ============================================================================
-- Payment Escrow & Order Tracking Migration
-- ============================================================================

-- 1. Payment Escrow Table
CREATE TABLE IF NOT EXISTS payment_escrow (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES car_listings(id) NOT NULL,
    buyer_id UUID REFERENCES users(id) NOT NULL,
    dealer_id UUID REFERENCES dealers(id) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT CHECK (status IN ('pending', 'funded', 'released', 'refunded', 'disputed')) DEFAULT 'pending',
    stripe_payment_intent_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    released_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_escrow_listing ON payment_escrow(listing_id);
CREATE INDEX idx_escrow_buyer ON payment_escrow(buyer_id);
CREATE INDEX idx_escrow_dealer ON payment_escrow(dealer_id);

-- 2. Escrow Transactions History
CREATE TABLE IF NOT EXISTS escrow_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    escrow_id UUID REFERENCES payment_escrow(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('deposit', 'release', 'refund', 'fee')) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES users(id)
);

-- 3. Order Tracking Stages
-- Pre-defined stages for every order: 'payment', 'documentation', 'shipping', 'customs', 'delivery'
CREATE TABLE IF NOT EXISTS order_tracking_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    escrow_id UUID REFERENCES payment_escrow(id) ON DELETE CASCADE,
    stage_type TEXT CHECK (stage_type IN ('payment', 'documentation', 'shipping', 'customs', 'delivery')) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')) DEFAULT 'pending',
    completed_at TIMESTAMP WITH TIME ZONE,
    location_name TEXT,
    eta TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(escrow_id, stage_type)
);

-- 4. Order Tracking Events (Timeline)
CREATE TABLE IF NOT EXISTS order_tracking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    escrow_id UUID REFERENCES payment_escrow(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- e.g., 'payment_received', 'shipped', 'arrived_at_port'
    event_title TEXT NOT NULL,
    event_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. RLS Policies

-- Payment Escrow
ALTER TABLE payment_escrow ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own escrows" ON payment_escrow
FOR SELECT USING (
    auth.uid() = buyer_id OR 
    auth.uid() IN (SELECT user_id FROM dealers WHERE id = dealer_id)
);

CREATE POLICY "Admins can view all escrows" ON payment_escrow
FOR SELECT USING (
    (auth.jwt() ->> 'email')::text LIKE '%@skautosphere.com' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- Tracking
ALTER TABLE order_tracking_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tracking_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants view tracking" ON order_tracking_stages
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM payment_escrow 
        WHERE id = order_tracking_stages.escrow_id 
        AND (buyer_id = auth.uid() OR dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid()))
    )
);

CREATE POLICY "Admins view all tracking" ON order_tracking_stages
FOR SELECT USING (
    (auth.jwt() ->> 'email')::text LIKE '%@skautosphere.com' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
);

-- Same for events
CREATE POLICY "Participants view events" ON order_tracking_events
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM payment_escrow 
        WHERE id = order_tracking_events.escrow_id 
        AND (buyer_id = auth.uid() OR dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid()))
    )
);

-- 6. Trigger to auto-create stages
CREATE OR REPLACE FUNCTION initialize_order_tracking()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO order_tracking_stages (escrow_id, stage_type, status, notes)
    VALUES
    (NEW.id, 'payment', 'pending', 'Waiting for payment verification'),
    (NEW.id, 'documentation', 'pending', 'Vehicle export documents preparation'),
    (NEW.id, 'shipping', 'pending', 'Vessel booking and loading'),
    (NEW.id, 'customs', 'pending', 'Export customs clearance'),
    (NEW.id, 'delivery', 'pending', 'Final delivery to destination port');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_init_tracking
AFTER INSERT ON payment_escrow
FOR EACH ROW
EXECUTE FUNCTION initialize_order_tracking();
