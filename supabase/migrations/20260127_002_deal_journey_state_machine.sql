-- ============================================================================
-- MIGRATION: Deal Journey State Machine
-- Purpose: Track car sales pipeline from inquiry to delivery
-- Adapted from: Kmed patient_journey_state pattern
-- Date: 2026-01-27
-- ============================================================================

-- Step 1: Drop existing table and type to ensure clean slate
DROP TABLE IF EXISTS deal_journey_events CASCADE;

DROP TABLE IF EXISTS deal_journey_state CASCADE;

DROP TYPE IF EXISTS deal_journey_state_enum CASCADE;

-- Step 2: Create journey state enum (renamed to avoid table name conflict)
CREATE TYPE deal_journey_state_enum AS ENUM (
    'INQUIRY',          -- Initial contact/interest
    'QUALIFICATION',    -- Verifying buyer capability
    'NEGOTIATION',      -- Price/terms discussion
    'INSPECTION',       -- Vehicle inspection requested
    'QUOTE',            -- Formal quote provided
    'DEPOSIT',          -- Deposit received
    'DOCUMENTATION',    -- Export docs in progress
    'PAYMENT',          -- Full payment processing
    'SHIPPING',         -- Vehicle in transit
    'DELIVERED',        -- Successfully delivered
    'CANCELLED',        -- Deal cancelled
    'LOST'              -- Lost to competitor
);

-- Step 3: Create deal journey state table
CREATE TABLE IF NOT EXISTS deal_journey_state (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

-- Identity
customer_phone TEXT NOT NULL,
customer_name TEXT,
customer_email TEXT,

-- State tracking
state deal_journey_state_enum NOT NULL DEFAULT 'INQUIRY',
previous_state deal_journey_state_enum,
state_entered_at TIMESTAMP
WITH
    TIME ZONE DEFAULT NOW(),

-- Related entities
listing_id UUID REFERENCES car_listings (id) ON DELETE SET NULL,
assigned_agent_id UUID, -- Future: References users(id) for sales agents
assigned_agent_name TEXT,

-- Session/thread tracking
thread_id TEXT NOT NULL, -- For conversation continuity
whatsapp_session_id UUID REFERENCES whatsapp_sessions (id) ON DELETE SET NULL,

-- Metadata
metadata JSONB DEFAULT '{}', -- Store deal details, price negotiations, etc.
    tags TEXT[] DEFAULT '{}', -- For filtering: ['hot-lead', 'nigeria', 'suv']

-- Timestamps
created_at TIMESTAMP
WITH
    TIME ZONE DEFAULT NOW(),
    last_updated_at TIMESTAMP
WITH
    TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP
WITH
    TIME ZONE, -- When deal reached terminal state

-- Constraints
UNIQUE(customer_phone, listing_id) -- One journey per customer per listing
);

-- Step 4: Create journey events log (audit trail)
CREATE TABLE IF NOT EXISTS deal_journey_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID NOT NULL REFERENCES deal_journey_state(id) ON DELETE CASCADE,

-- Event details
event_type TEXT NOT NULL, -- 'state_change', 'agent_assigned', 'note_added', 'document_uploaded'
from_state deal_journey_state_enum,
to_state deal_journey_state_enum,

-- Who/what triggered this
triggered_by TEXT NOT NULL, -- 'system', 'agent', 'customer', 'coordinator'
agent_id UUID, -- Who performed the action
agent_name TEXT,

-- Event data


event_data JSONB DEFAULT '{}',
    notes TEXT,
    error_message TEXT, -- If event was an error
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Create state transition validation function
CREATE OR REPLACE FUNCTION validate_deal_state_transition(
    p_current_state deal_journey_state_enum,
    p_new_state deal_journey_state_enum
) RETURNS BOOLEAN AS $$
BEGIN
    -- Define allowed transitions (FSM rules)
    RETURN CASE
        -- From INQUIRY
        WHEN p_current_state = 'INQUIRY' THEN 
            p_new_state IN ('QUALIFICATION', 'CANCELLED')
        
        -- From QUALIFICATION
        WHEN p_current_state = 'QUALIFICATION' THEN 
            p_new_state IN ('NEGOTIATION', 'LOST', 'CANCELLED')
        
        -- From NEGOTIATION
        WHEN p_current_state = 'NEGOTIATION' THEN 
            p_new_state IN ('INSPECTION', 'QUOTE', 'LOST', 'CANCELLED')
        
        -- From INSPECTION
        WHEN p_current_state = 'INSPECTION' THEN 
            p_new_state IN ('QUOTE', 'NEGOTIATION', 'LOST', 'CANCELLED')
        
        -- From QUOTE
        WHEN p_current_state = 'QUOTE' THEN 
            p_new_state IN ('DEPOSIT', 'NEGOTIATION', 'LOST', 'CANCELLED')
        
        -- From DEPOSIT
        WHEN p_current_state = 'DEPOSIT' THEN 
            p_new_state IN ('DOCUMENTATION', 'CANCELLED')
        
        -- From DOCUMENTATION
        WHEN p_current_state = 'DOCUMENTATION' THEN 
            p_new_state IN ('PAYMENT', 'CANCELLED')
        
        -- From PAYMENT
        WHEN p_current_state = 'PAYMENT' THEN 
            p_new_state IN ('SHIPPING', 'CANCELLED')
        
        -- From SHIPPING
        WHEN p_current_state = 'SHIPPING' THEN 
            p_new_state IN ('DELIVERED')
        
        -- Terminal states
        WHEN p_current_state IN ('DELIVERED', 'CANCELLED', 'LOST') THEN 
            FALSE
        
        ELSE FALSE
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 6: Trigger to log state changes
CREATE OR REPLACE FUNCTION log_deal_state_change() RETURNS TRIGGER AS $$
BEGIN
    -- Only log if state actually changed
    IF NEW.state != OLD.state THEN
        INSERT INTO deal_journey_events (
            journey_id,
            event_type,
            from_state,
            to_state,
            triggered_by,
            event_data
        ) VALUES (
            NEW.id,
            'state_change',
            OLD.state,
            NEW.state,
            COALESCE(current_setting('app.triggered_by', true), 'system'),
            jsonb_build_object(
                'timestamp', NOW(),
                'previous_state_duration', EXTRACT(EPOCH FROM (NOW() - NEW.state_entered_at))
            )
        );
        
        -- Update state_entered_at
        NEW.state_entered_at := NOW();
        NEW.previous_state := OLD.state;
    END IF;
    
    -- Always update last_updated_at
    NEW.last_updated_at := NOW();
    
    -- Set closed_at for terminal states
    IF NEW.state IN ('DELIVERED', 'CANCELLED', 'LOST') AND OLD.closed_at IS NULL THEN
        NEW.closed_at := NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deal_state_change_logger
    BEFORE UPDATE ON deal_journey_state
    FOR EACH ROW
    WHEN (OLD.* IS DISTINCT FROM NEW.*)
    EXECUTE FUNCTION log_deal_state_change();

-- Step 7: Create indexes
CREATE INDEX IF NOT EXISTS deal_journey_state_customer_phone_idx ON deal_journey_state (customer_phone);

CREATE INDEX IF NOT EXISTS deal_journey_state_state_idx ON deal_journey_state (state);

CREATE INDEX IF NOT EXISTS deal_journey_state_listing_idx ON deal_journey_state (listing_id);

CREATE INDEX IF NOT EXISTS deal_journey_state_created_idx ON deal_journey_state (created_at DESC);

CREATE INDEX IF NOT EXISTS deal_journey_events_journey_idx ON deal_journey_events (journey_id, created_at DESC);

CREATE INDEX IF NOT EXISTS deal_journey_events_type_idx ON deal_journey_events (event_type);

-- Step 8: RLS Policies
ALTER TABLE deal_journey_state ENABLE ROW LEVEL SECURITY;

ALTER TABLE deal_journey_events ENABLE ROW LEVEL SECURITY;

-- Service role has full access
CREATE POLICY "Service role full access to journey state" ON deal_journey_state FOR ALL USING (true);

CREATE POLICY "Service role full access to journey events" ON deal_journey_events FOR ALL USING (true);

-- Admins can view all journeys
CREATE POLICY "Admins can view all journeys" ON deal_journey_state FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM users
            WHERE
                users.id = auth.uid ()
                AND users.role = 'admin'
        )
    );

-- Step 9: Helper function to get journey timeline
CREATE OR REPLACE FUNCTION get_deal_timeline(p_journey_id UUID)
RETURNS TABLE (
    event_time TIMESTAMP WITH TIME ZONE,
    event_type TEXT,
    from_state TEXT,
    to_state TEXT,
    triggered_by TEXT,
    agent_name TEXT,
    notes TEXT,
    event_data JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.created_at,
        e.event_type,
        e.from_state::TEXT,
        e.to_state::TEXT,
        e.triggered_by,
        e.agent_name,
        e.notes,
        e.event_data
    FROM deal_journey_events e
    WHERE e.journey_id = p_journey_id
    ORDER BY e.created_at ASC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON
TABLE deal_journey_state IS 'Finite State Machine for tracking deal pipeline - Powers agent orchestration';

COMMENT ON
TABLE deal_journey_events IS 'Audit log for all deal state transitions and events';

COMMENT ON FUNCTION validate_deal_state_transition IS 'FSM validation - ensures only valid state transitions';