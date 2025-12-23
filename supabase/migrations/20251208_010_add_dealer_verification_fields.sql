-- Add verification fields to dealers table
ALTER TABLE dealers 
ADD COLUMN IF NOT EXISTS business_license_url TEXT,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- Sync existing verified dealers
UPDATE dealers SET verification_status = 'verified' WHERE verified = true;

-- Create function to sync verified boolean
CREATE OR REPLACE FUNCTION sync_dealer_verified_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.verification_status = 'verified' THEN
    NEW.verified = true;
  ELSE
    NEW.verified = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_sync_dealer_verified ON dealers;
CREATE TRIGGER trigger_sync_dealer_verified
  BEFORE INSERT OR UPDATE OF verification_status ON dealers
  FOR EACH ROW
  EXECUTE FUNCTION sync_dealer_verified_status();
