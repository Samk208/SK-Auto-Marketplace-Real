-- Create tables for The Negotiator (WhatsApp Agent)

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Whatsapp Sessions
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    phone_number TEXT NOT NULL UNIQUE,
    customer_name TEXT,
    last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    lead_score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (
        status IN (
            'active',
            'archived',
            'human_escalated'
        )
    ),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Whatsapp Messages
CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    session_id UUID NOT NULL REFERENCES whatsapp_sessions (id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (
        role IN (
            'user',
            'assistant',
            'system',
            'function'
        )
    ),
    content TEXT, -- Can be null if it's a function call with no text
    metadata JSONB DEFAULT '{}'::jsonb, -- Store cost, tool_calls, reaction_id etc
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_phone ON whatsapp_sessions (phone_number);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_session_id ON whatsapp_messages (session_id);

CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created_at ON whatsapp_messages (created_at);

-- RLS Policies
ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;

ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all whatsapp sessions
CREATE POLICY "Admins can view all whatsapp sessions" ON whatsapp_sessions FOR
SELECT USING (
        (
            auth.jwt () -> 'app_metadata' ->> 'role'
        ) = 'admin'
    );

CREATE POLICY "Admins can view all whatsapp messages" ON whatsapp_messages FOR
SELECT USING (
        (
            auth.jwt () -> 'app_metadata' ->> 'role'
        ) = 'admin'
    );

-- Trigger to update updated_at on sessions
CREATE OR REPLACE FUNCTION update_whatsapp_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_whatsapp_session_timestamp
    BEFORE UPDATE ON whatsapp_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_whatsapp_session_updated_at();