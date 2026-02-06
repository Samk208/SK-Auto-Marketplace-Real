# SK AutoSphere: n8n & The Negotiator Setup Checklist

**Status:** Pending Execution  
**Target Date:** ASAP (When n8n instance is ready)  
**Agent:** "The Negotiator" (WhatsApp Sales Bot)

---

## 🛑 Phase 1: Database & Backend (Do this first)

The agent needs a "brain" (Database) before it can start talking.

- [ ] **1. Apply Database Migrations**
  - **Action:** Open your terminal in VS Code (root of `SK Now 3`).
  - **Command:**
    ```bash
    npx supabase db push
    ```
  - **Verify:** Check your local Supabase dashboard or table editor. You should see two new tables:
    - `whatsapp_sessions` (Stores customer details)
    - `whatsapp_messages` (Stores chat history)
  - **Source File:** `supabase/migrations/20251214_023_whatsapp_agent_tables.sql`

- [ ] **2. Get Your Credentials Ready**  
       You will need these keys to enter into n8n:
  - **Supabase URL:** `NEXT_PUBLIC_SUPABASE_URL` (from your `.env.local`)
  - **Supabase Service Key:** `SUPABASE_SERVICE_ROLE_KEY` (Warning: Don't use the anon key, n8n needs full access)
  - **OpenAI API Key:** For the LLM generation (or Google Gemini API Key if adapting immediately).
  - **Meta Business (WhatsApp) Token:** From [developers.facebook.com](https://developers.facebook.com).

---

## ⚙️ Phase 2: n8n Configuration

- [ ] **3. Import the Workflow Template**
  - **Action:** Open your n8n instance.
  - **Menu:** Click "Workflows" > "Add Workflow" > "Import from URL".
  - **URL:** `https://n8n.io/workflows/4827`
  - **Reference:** "AI-Powered WhatsApp Chatbot for Text, Voice, Images & PDFs with RAG".

- [ ] **4. Configure Specific Nodes**
  - **WhatsApp Trigger Node:**
    - Add your `Meta App Secret` and `Access Token`.
    - Set the verify token (and update it in your Meta App Dashboard).
  - **Supabase Node (Replace MongoDB):**
    - The template uses MongoDB. **Delete** those nodes.
    - Add a **Supabase** node.
    - Action: `Execute Query`.
    - Query (for Context): `SELECT * FROM whatsapp_messages WHERE session_id = '...' ORDER BY created_at DESC LIMIT 5`
  - **AI Agent Node:**
    - Connect your LLM Credential.

---

## 🤖 Phase 3: "Agentic" Intelligence (The Secret Sauce)

Once the basic plumbing is working, you need to make it smart.

- [ ] **5. Copy the Implementation Plan**
  - **Reference:** Open `docs/SK Agents/implementation_plans/agent_negotiator_implementation.md`
  - **Action:** Read the "System Prompt Template" section. You will copy-paste this prompt into the n8n AI Agent node "System Message" field.

---

## ✅ Ready?

Once you have checked off items 1-3, come back to the AI assistant and type:

> _"I have set up n8n and the database. Now help me configure the System Prompt and Reflection Logic."_
