# [DEPRECATED] WhatsApp + n8n + Chatwoot Workflow Plan

> **⚠️ NOTE:** This plan has been finalized and superseded by the implementation details in **[WHATSAPP_N8N_CHATWOOT_PATTERN2_HANDOVER.md](./WHATSAPP_N8N_CHATWOOT_PATTERN2_HANDOVER.md)**. Please refer to that file for the canonical source of truth.

## Goal

Implement **Pattern 2**: use **Chatwoot only on escalation** while keeping the canonical WhatsApp pipeline:

- **Meta WhatsApp Cloud API -> n8n workflow 4827 webhook -> Supabase (sessions/messages) -> AI -> WhatsApp reply**
- **Chatwoot** is added as the **support-ops layer** (inbox, assignments, notes) only when a conversation is escalated.

This plan prioritizes:

- **No duplicate replies** (idempotency + single sender)
- **Clean human handoff** (session mode gate)
- **Cost control** (AI handles most messages, humans handle escalations)

---

## Non-Goals (This Weekend)

- Agents replying from Chatwoot and auto-sending to WhatsApp (Chatwoot->WhatsApp bridge)
- Full omnichannel ingestion (email/web/social)
- Full RAG/embeddings-based knowledge base

---

## Canonical Rules (Invariants)

- **Meta webhook must target exactly ONE endpoint: n8n**.
- **Exactly one system sends WhatsApp replies** (n8n WhatsApp sender node).
- **Idempotency gate** blocks re-processing by `provider_message_id` (Meta `wamid...`).
- **Human takeover mode** must stop AI replies immediately.

---

## Data Model (Supabase)

### Existing tables

- `whatsapp_sessions`
- `whatsapp_messages`

### Required additions (recommended)

Add these columns to `whatsapp_sessions`:

- `mode` TEXT NOT NULL DEFAULT 'bot' CHECK (mode IN ('bot','human'))
- `escalated_at` TIMESTAMPTZ NULL
- `escalation_reason` TEXT NULL
- `chatwoot_conversation_id` TEXT NULL
- `chatwoot_contact_id` TEXT NULL

Notes:

- Keep existing `status` for lifecycle (`active/archived`) and keep the historical `human_escalated` value if present.
- `mode` is the authoritative routing flag.

### Existing idempotency

`whatsapp_messages.provider_message_id` has a unique index (already in migrations). Keep using it.

---

## Secrets / Environment Variables

### Meta WhatsApp Cloud API

- `WHATSAPP_API_TOKEN`
- `WHATSAPP_PHONE_ID`
- `WHATSAPP_VERIFY_TOKEN`

### Supabase (n8n)

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Chatwoot

- `CHATWOOT_BASE_URL` (e.g. https://support.yourdomain.com)
- `CHATWOOT_API_ACCESS_TOKEN` (account-level API token)
- `CHATWOOT_ACCOUNT_ID`
- `CHATWOOT_INBOX_ID` (optional for Pattern 2; required if creating conversations)

### AI

- `GEMINI_API_KEY` (preferred)
- `OPENAI_API_KEY` (optional fallback)

---

## n8n Workflow (4827) Node Order (Pattern 2)

### 0) Webhook Trigger

- Receives Meta inbound message payload.
- Extract:
  - `user_key` = `contacts[0].wa_id || messages[0].from`
  - `provider_message_id` = `messages[0].id` (Meta `wamid...`)
  - `message_text` (or media placeholders)
  - media metadata (audio/image/pdf)

### 1) Session Upsert (Supabase)

- Upsert `whatsapp_sessions` by `phone_number=user_key`.
- Read back `session_id`, `mode`, and any needed metadata.

### 2) Mode Gate (Supabase)

If `session.mode === 'human'`:

- Do NOT call AI.
- Do NOT send automated reply.
- Log inbound message:
  - Insert into `whatsapp_messages` (role='user', provider_message_id, content/metadata)
  - Optionally add the message to Chatwoot conversation if `chatwoot_conversation_id` exists.
- STOP.

### 3) Idempotency Gate (Supabase)

- Insert inbound message row into `whatsapp_messages`:
  - `session_id`
  - `role='user'`
  - `provider_message_id=wamid`
  - `content` / `metadata`
- If insert fails due to unique constraint -> STOP.

### 4) Load Memory (Supabase)

- Select last N messages (20-30) for `session_id`.
- Sort by `created_at`.
- Convert into the AI history format.

### 5) Escalation Decision

Deterministic first-pass rules (fast, cheap):

- Explicit human request keywords (human/agent/person/manager)
- Payment/refund/fraud/dispute keywords
- Complaint/anger keywords
- "stuck" loop heuristics (e.g., too many turns without resolution)

If `needsHuman === true`:

- Update session:
  - `mode='human'`
  - `escalated_at=now()`
  - `escalation_reason=<string>`
- Create Chatwoot conversation (if not already linked):
  - Create contact (or find existing)
  - Create conversation with first message content
  - Store returned `chatwoot_conversation_id` / `chatwoot_contact_id` into Supabase
- Send acknowledgement to customer via WhatsApp:
  - "Thank you. A team member will contact you shortly."
- Notify team (Slack/email) with Chatwoot link.
- STOP.

### 6) AI Response (Normal Mode)

If `needsHuman === false`:

- Call AI (recommended: call Next.js endpoint):
  - `POST /api/ai/chat` with `{ message, history, context }`
- Send WhatsApp reply.
- Persist assistant reply:
  - Insert into `whatsapp_messages` with role='assistant' and metadata including model/provider and cost if available.

---

## Chatwoot Usage (Pattern 2)

### What Chatwoot is used for

- Human support inbox for escalations
- Internal notes + tagging + assignments
- Reporting/visibility for escalated conversations

### What Chatwoot is NOT used for (in Pattern 2)

- Sending replies back to WhatsApp automatically

---

## Operational Playbook

### Enter human mode

- Triggered by escalation rules.
- Store:
  - `mode='human'`
  - `chatwoot_conversation_id`

### Exit human mode

- Manual process (initially):
  - Update `whatsapp_sessions.mode` back to `'bot'`.
- Optional message to user:
  - "Thanks—you're back with the automated assistant. Type 'human' anytime."

---

## Testing Checklist (Must Pass)

### Idempotency

- Send the same Meta payload twice (or simulate retries).
- Expect: only one DB insert, only one outbound reply.

### Mode gate

- Force session `mode='human'`.
- Send inbound message.
- Expect: no AI call, no auto reply.

### Escalation path

- Send: "I want a human".
- Expect:
  - session flips to `mode='human'`
  - Chatwoot conversation created
  - acknowledgement sent

### Normal AI path

- Send: simple FAQ question.
- Expect:
  - AI called
  - WhatsApp reply sent
  - assistant message persisted

---

## Implementation Steps (Repo + n8n)

1. Add Supabase migration for the new session fields (mode/escalation/chatwoot ids)
2. Configure Chatwoot deployment (Coolify)
3. Add Chatwoot API credentials to n8n
4. Update n8n workflow 4827:
   - insert the **mode gate** before AI
   - implement escalation decision and Chatwoot conversation creation
5. Run tests above

---

## Notes / Future Enhancements

- Pattern 1 upgrade: mirror all messages into Chatwoot for full visibility.
- Chatwoot->WhatsApp bridge: enable agent replies inside Chatwoot.
- Add knowledge base + citations; add summarization to control token costs.
