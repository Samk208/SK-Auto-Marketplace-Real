
-- Create leads table for AI Agent capture
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    contact_info TEXT,
    interest TEXT,
    source TEXT DEFAULT 'ai_agent',
    status TEXT DEFAULT 'new', -- new, contacted, closed
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anon to insert (for public website leads/AI agent)
CREATE POLICY "Anon can insert leads"
    ON leads FOR INSERT
    WITH CHECK (true);

-- Allow admins to view all leads
CREATE POLICY "Admins can view all leads"
    ON leads FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM dealers
            WHERE dealers.id = auth.uid()
            AND dealers.role = 'admin'
        )
    );

-- Trigger for updated_at
CREATE TRIGGER update_leads_timestamp
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_whatsapp_session_updated_at();
