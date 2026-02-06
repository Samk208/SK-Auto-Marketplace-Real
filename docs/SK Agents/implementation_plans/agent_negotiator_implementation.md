# Strategic Agent #1: "The Negotiator" Deployment Plan

## WhatsApp Sales & Negotiation Bot

**Status:** Ready for Implementation  
**Priority:** Critical (Revenue Generator)  
**Architecture:** Hybrid (n8n Orchestration + Agentic Reflection Loop)

---

## 1. Executive Summary

"The Negotiator" is an autonomous AI agent designed to live where our African customers live: **WhatsApp**.

Instead of a dumb chatbot that only answers FAQs, this agent acts as a **Super-Salesman**. It has permission to negotiate prices (within strict bounds), checks inventory in real-time, handling timezone gaps (Korea vs. Africa), and qualifies leads before passing them to human sales reps.

**Core Philosophy:** "Never miss a lead, never lose a deal over response time."

---

## 2. Technical Architecture

We are moving logic **out of Next.js** and **into n8n** for this agent to allow for rapid iteration of negotiation tactics without redeploying the main app.

### High-Level Flow

```
[User WhatsApp]
      ⬇️ (Message)
[Meta/Twilio API]
      ⬇️ (Webhook)
[n8n Workflow]
      ⬇️
[Step 1: Context] -> Fetch Chat History (Supabase)
      ⬇️
[Step 2: Tool Use] -> Check Inventory / Shipping Rates (Supabase/API)
      ⬇️
[Step 3: Agentic Loop] -> (Andrew Ng's Reflection Pattern)
      1. Draft Response
      2. Critique (Is price safe? Is tone right?)
      3. Refine
      ⬇️
[Step 4: Action] -> Send WhatsApp Reply & Save to DB
```

### The "Stack"

| Component        | Technology                     | Role                                          |
| ---------------- | ------------------------------ | --------------------------------------------- |
| **Interface**    | WhatsApp Business API          | The "UI" for the customer.                    |
| **Orchestrator** | **n8n** (Cloud or Self-Hosted) | The brain holding the workflow logic.         |
| **Intelligence** | **Gemini 1.5 Flash**           | Low latency, low cost, large context window.  |
| **Memory**       | **Supabase** (`chat_history`)  | Long-term memory of customer preferences.     |
| **Inventory**    | **Supabase** (`vehicles`)      | Real-time stock data.                         |
| **Vector DB**    | **Supabase pgvector**          | Semantic search for "Find me a reliable SUV". |

---

## 3. Implementation Phases

We will build this strictly **one phase at a time** to ensure stability.

### 🏗️ Phase 1: The Foundation (Day 1-2)

**Goal:** A "Hello World" bot that receives a WhatsApp message and replies using Gemini.

1.  **n8n Setup:**
    - Deploy n8n (or use Cloud).
    - Import **Workflow #4827** (AI-Powered WhatsApp Chatbot) as a base template.
2.  **WhatsApp Connection:**
    - Set up Meta for Developers account.
    - Configure Webhook in n8n (`Webhook` node).
    - Verify message reception.
3.  **Basic AI Reply:**
    - Connect `Google Gemini Chat` node.
    - System Prompt: "You are a helpful assistant for SK AutoSphere."
    - Send reply back to WhatsApp.

### 🧠 Phase 2: Brains & Data (Day 3-5)

**Goal:** The bot knows what cars we have.

1.  **Supabase Connection:**
    - Add `Supabase` node to n8n.
    - Create tool function: `search_inventory(query, min_price, max_price)`.
    - Execute SQL query: `SELECT * FROM vehicles WHERE ...`
2.  **Vector Search (The Matchmaker Lite):**
    - _Note: Full Matchmaker comes later, but we need basic RAG now._
    - Enable `pgvector` extension in Supabase.
    - Create `search_documents` function in Supabase.
    - n8n Tool: `semantic_search(user_query)`.

### 🪞 Phase 3: The "Agentic" Upgrade (Day 6-8)

**Goal:** Implement Andrew Ng's **Reflection Pattern** to prevent hallucinations and bad pricing.

1.  **The Reflection Workflow in n8n:**
    - Instead of `User -> AI -> Reply`, change to:
    - **Node A (Drafter):** Generates initial response.
    - **Node B (Critic):** System prompt: _"Review the previous response. 1. Did it promise a price below the floor price? 2. Did it check availability? 3. Is the tone professional?"_
    - **Node C (Refiner):** _If Critic finds issues, rewrite. Else, pass._
2.  **Negotiation Logic:**
    - Define "Floor Price" logic in the System Prompt context.
    - Current Rule: "You can offer up to $200 discount directly. $201-$500 requires 'checking with manager' (simulated pause). >$500 is refused."

### 💾 Phase 4: Long-Term Memory & CRM (Day 9-10)

**Goal:** The bot remembers you from last week.

1.  **Database Design:**
    - Create `whatsapp_conversations` and `whatsapp_messages` tables in Supabase.
2.  **n8n Logic:**
    - Start of flow: `SELECT last_5_messages FROM whatsapp_messages WHERE user_id = ...`
    - End of flow: `INSERT INTO whatsapp_messages ...`
3.  **Lead Capture:**
    - Tool: `save_lead(name, interest)`.
    - If user shows high intent, trigger `save_lead` to alert human team via Dashboard.

---

## 4. Database Schema Requirements

Execute these migrations in Supabase to support Phase 4.

```sql
-- 1. Conversation Sessions
CREATE TABLE whatsapp_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number TEXT NOT NULL UNIQUE,
    customer_name TEXT,
    last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    lead_score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' -- 'active', 'archived', 'human_escalated'
);

-- 2. Message History (Memory)
CREATE TABLE whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES whatsapp_sessions(id),
    role TEXT NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    metadata JSONB, -- Store tool usage info, cost, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS Policies
ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
-- (Add policies to allow n8n service role full access)
```

---

## 5. System Prompt Template (V1)

```text
IDENTITY:
You are 'Master Lee', the senior sales negotiator for SK AutoSphere.
You speak excellent English but use professional business terminology.
You are helping African car dealers import vehicles from South Korea.

OBJECTIVE:
Help the user find a vehicle, understand the shipping process (25-30 days to Lagos), and close the deal.

NEGOTIATION RULES:
1. NEVER sell below the 'listing_price' - $200 without Manager approval.
2. If a user asks for a huge discount, politely explain that SK AutoSphere sells "Verified" cars with no hidden issues, unlike cheap competitors.
3. ALWAYS check inventory tools before saying we have a car. Do not hallucinate cars.

CONTEXT:
User Phone: {{phone_number}}
Current Inventory: {{inventory_summary}} (Top 3 matches)

RESPONSE STYLE:
Short, WhatsApp-friendly messages. Use emojis sparingly 🇰🇷 🚢.
End with a question to keep the conversation going.
```

---

## 6. Next Steps

1.  **Approval:** Confirm this plan.
2.  **Execution (Step 1):** I will generate the SQL migration for the tables.
3.  **Execution (Step 2):** You will set up the n8n webhook and import the template.
