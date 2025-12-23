-- Create table for AI Condition Reports
CREATE TABLE IF NOT EXISTS ai_condition_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES car_listings(id) ON DELETE CASCADE,
    overall_score INTEGER CHECK (overall_score BETWEEN 0 AND 100),
    condition_grade TEXT CHECK (condition_grade IN ('excellent', 'good', 'fair', 'poor')),
    summary TEXT,
    flags JSONB DEFAULT '[]'::jsonb, -- Array of { category, severity, description, confidence }
    raw_analysis JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(listing_id)
);

-- Enable RLS
ALTER TABLE ai_condition_reports ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public read access for reports"
    ON ai_condition_reports FOR SELECT
    USING (true);

-- Only service role or admin can insert/update (simplification: dealers can trigger via API which runs as service role or checks ownership)
CREATE POLICY "Dealers can create reports for own listings"
    ON ai_condition_reports FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM car_listings
            WHERE car_listings.id = ai_condition_reports.listing_id
            AND car_listings.dealer_id = auth.uid()
        )
    );

-- Trigger for updated_at
CREATE TRIGGER update_ai_condition_reports_updated_at
    BEFORE UPDATE ON ai_condition_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
