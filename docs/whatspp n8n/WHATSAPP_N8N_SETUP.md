# WhatsApp + n8n (Workflow 4827) + Supabase Setup

This document is the **canonical** reference for the Negotiator WhatsApp agent using:

- **Meta WhatsApp Cloud API** (WhatsApp Business)
- **n8n** (orchestration; importing workflow `4827`)
- **Supabase Postgres** (sessions + message memory + idempotency)

It also documents the historical conflict (Next.js webhook vs n8n) and how we avoid duplicates.

---

## 1) Canonical Architecture (Approach B)

### **Inbound path (single source of truth)**

- **Meta WhatsApp Cloud API -> n8n workflow 4827 webhook -> Supabase -> AI -> WhatsApp reply**

### **Key rule**

- Meta should deliver **message webhooks to exactly ONE endpoint**: **n8n**.

### **What exists but must NOT be used for Meta**

- A Next.js webhook route exists in the repo:
  - `app/api/webhooks/whatsapp/route.ts`
- It can also ingest and reply, but under Approach B it must **not** be registered in Meta.

---

## 2) What Was the Conflict & Why It Matters

### **Conflict**

There were two possible WhatsApp ingestion systems:

- **(A) Next.js-first** webhook + reply sender
- **(B) n8n-first** workflow (4827) + reply sender

If Meta is configured to hit both, you get:

- Duplicate inbound handling (same message processed twice)
- Duplicate outbound replies (user receives 2 replies)
- Split memory (conversation history diverges)
- Hard-to-debug behavior

### **Resolution**

We chose **Approach B (n8n-first)**. Therefore:

- **Meta -> n8n only**
- Next.js webhook remains in codebase but is **not connected to Meta**

---

## 3) Supabase Database: What’s Already Applied

### **Tables**

- `whatsapp_sessions`
  - 1 row per WhatsApp user (keyed by phone/wa_id)
- `whatsapp_messages`
  - Append-only log of messages (user + assistant)

### **Idempotency / De-dup support**

Meta can resend the same message. To avoid double-processing, we added:

- `whatsapp_messages.provider_message_id` (stores Meta `wamid...`)
- Unique index on `provider_message_id` (when not null)

This is the foundation for robust duplicate prevention.

### **RLS note**

`whatsapp_sessions` / `whatsapp_messages` have RLS enabled with admin read policies based on:

- `(auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'`

For n8n writes, use **Supabase service role key**.

---

## 4) Required Meta WhatsApp Cloud API Values

Even if your app has only `WHATSAPP_API_TOKEN`, the end-to-end system needs:

- **Access Token** (`WHATSAPP_API_TOKEN`)
- **Phone Number ID** (`WHATSAPP_PHONE_ID`)
- **Verify Token** (`WHATSAPP_VERIFY_TOKEN`) — a string you choose

### Where to get them

- Meta Developers Dashboard -> WhatsApp -> API Setup
  - Phone Number ID is displayed
- Verify Token
  - You choose a string and set it in both Meta and n8n

---

## 5) Meta Webhook Setup (Critical)

In Meta Developers Dashboard:

- **Callback URL**: use the **n8n production webhook URL** from workflow 4827’s WhatsApp trigger
- **Verify Token**: must match exactly what you set in n8n
- **Subscribed fields**: at minimum `messages`

### Conflict avoidance

- Do **not** set Meta callback URL to Next.js `/api/webhooks/whatsapp`

---

## 6) n8n Setup Checklist (Workflow 4827 + Supabase memory)

### 6.1 Credentials in n8n

Create credentials:

- **Meta WhatsApp Cloud API**
  - Access token
  - Phone Number ID
- **Supabase**
  - URL
  - **Service Role Key** (recommended for zero RLS errors)
- **LLM**
  - Workflow 4827 uses OpenAI by default
  - Can be swapped to Gemini later

### 6.2 Canonical per-user keys (multi-user support)

From webhook payload:

- **user_key** = `contacts[0].wa_id || messages[0].from`
- **message_id** = `messages[0].id` (Meta `wamid...`)

Use these consistently:

- Session identity: `whatsapp_sessions.phone_number = user_key`
- Dedupe identity: `whatsapp_messages.provider_message_id = message_id`

### 6.3 Recommended safe flow order (robust + no duplicates)

1. **Session upsert** (Supabase)
   - Upsert into `whatsapp_sessions` using `phone_number = user_key`
   - Read back `session_id`

2. **Idempotency gate** (Supabase)
   - Insert inbound message row into `whatsapp_messages` with:
     - `session_id`
     - `role = 'user'`
     - `provider_message_id = message_id`
     - `content` / `metadata`
   - If insert fails due to unique constraint -> **STOP** workflow

3. **Load memory** (Supabase)
   - Select last N (20-30) messages for `session_id`
   - Sort chronologically
   - Convert into AI history format

4. **4827 router** (text/audio/image/pdf)
   - Normalize all inputs into one final user prompt

5. **AI Agent**
   - Provide:
     - normalized prompt
     - history loaded from Supabase

6. **Send WhatsApp reply**
   - Ensure only one sending node executes

7. **Persist assistant reply** (Supabase)
   - Insert `role='assistant'`, `content=assistant_reply`, plus metadata

---

## 7) Messaging Use-Cases (Text / Voice / Image / PDF)

### Rule: Every use-case shares the same dedupe + session + memory

- **Text**
  - store inbound
  - use memory
  - respond
  - store assistant

- **Voice**
  - store inbound (content may be null or '[voice]')
  - download media from Graph
  - transcribe
  - respond + store assistant

- **Image**
  - store inbound ('[image]')
  - download media
  - vision analyze
  - respond + store assistant

- **PDF**
  - store inbound ('[pdf]')
  - download media
  - parse text
  - optionally store embeddings for RAG
  - respond + store assistant

---

## 8) “No Duplicates” Checklist (Operational)

- Meta webhook configured to **n8n only**
- n8n workflow has an **idempotency gate** using `provider_message_id = wamid`
- Unique index exists in Supabase (already applied)
- Exactly one WhatsApp sender node in the workflow

---

## 9) Remaining TODOs to go Live

### **Meta**

- Set **Webhook URL** to n8n production URL
- Set **Verify Token**
- Confirm **Phone Number ID** is available

### **n8n**

- Import workflow 4827
- Configure credentials:
  - WhatsApp token + phone ID
  - Supabase (service role)
  - OpenAI/Gemini
- Add/confirm:
  - session upsert
  - idempotency gate (insert with provider_message_id)
  - memory load from Supabase
  - assistant message persist

### **Testing**

- Send a WhatsApp message to your business number
- Confirm:
  - only one reply is received
  - a `whatsapp_sessions` row exists for that user
  - `whatsapp_messages` has:
    - a user row with `provider_message_id` set
    - an assistant row

---

## 10) Future Recommendation: KakaoTalk (Defer for Now)

KakaoTalk can be added later as an additional channel feeding the same n8n+Supabase “brain”.

Recommended phased approach:

- **Phase 1**: Use a Korean business messaging provider for AlimTalk/FriendTalk for outbound notifications.
- **Phase 2**: Add KakaoTalk Channel + chatbot integration for 2-way conversational AI.

When adding KakaoTalk, reuse the same storage pattern:

- `whatsapp_sessions` can be generalized (or create `chat_sessions`/`chat_messages`)
- store:
  - `channel` (whatsapp/kakao)
  - `provider_message_id` for dedupe
  - `user_key` for per-user isolation

---

## 11) Appendix: Repo Files of Interest

- **Next.js (legacy/non-canonical in Approach B)**
  - `app/api/webhooks/whatsapp/route.ts`

- **Supabase migrations**
  - `supabase/migrations/20251214_023_whatsapp_agent_tables.sql`
  - `supabase/migrations/20251223_025_whatsapp_message_idempotency.sql`
