-- Add idempotency support for WhatsApp messages (Meta message id / wamid)

ALTER TABLE whatsapp_messages
ADD COLUMN IF NOT EXISTS provider_message_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_whatsapp_messages_provider_message_id_unique ON whatsapp_messages (provider_message_id)
WHERE
    provider_message_id IS NOT NULL;