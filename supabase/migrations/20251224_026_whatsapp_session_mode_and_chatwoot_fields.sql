-- Add Pattern 2 (Chatwoot-on-escalation) routing fields to whatsapp_sessions

ALTER TABLE whatsapp_sessions
ADD COLUMN IF NOT EXISTS mode TEXT NOT NULL DEFAULT 'bot';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'whatsapp_sessions_mode_check'
  ) THEN
    ALTER TABLE whatsapp_sessions
    ADD CONSTRAINT whatsapp_sessions_mode_check
    CHECK (mode IN ('bot', 'human'));
  END IF;
END
$$;

ALTER TABLE whatsapp_sessions
ADD COLUMN IF NOT EXISTS escalated_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE whatsapp_sessions
ADD COLUMN IF NOT EXISTS escalation_reason TEXT;

ALTER TABLE whatsapp_sessions
ADD COLUMN IF NOT EXISTS chatwoot_conversation_id TEXT;

ALTER TABLE whatsapp_sessions
ADD COLUMN IF NOT EXISTS chatwoot_contact_id TEXT;

CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_mode ON whatsapp_sessions (mode);

CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_chatwoot_conversation_id ON whatsapp_sessions (chatwoot_conversation_id);