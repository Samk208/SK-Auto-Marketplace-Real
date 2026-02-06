# SK AutoSphere: n8n Workflow Adaptation Guide

**Date:** December 14, 2025  
**Project:** SK AutoSphere (Korean Used Car Export Platform)  
**Source Repository:** [Zie619/n8n-workflows](https://github.com/Zie619/n8n-workflows) (4,343+ workflows)  
**Interactive Search:** [zie619.github.io/n8n-workflows](https://zie619.github.io/n8n-workflows/)

---

## 🎯 Executive Summary

Your n8n-workflows repository contains **4,343 production-ready workflows** across 365+ integrations. Below is a strategic mapping of workflows you can directly adapt for each SK AutoSphere AI agent, along with implementation guidance.

---

## 📱 AGENT #1: "The Negotiator" (WhatsApp Sales Bot)

**Priority:** ⭐⭐⭐⭐⭐ (HIGHEST - Start Here!)

> **ℹ️ IMPLEMENTATION NOTICE:**
> We have adopted "Pattern 2" (n8n + Chatwoot + Supabase) for this agent.
> Please refer to **[`docs/whatspp n8n/WHATSAPP_N8N_CHATWOOT_PATTERN2_HANDOVER.md`](../../whatspp%20n8n/WHATSAPP_N8N_CHATWOOT_PATTERN2_HANDOVER.md)** for the definitive architecture, escalation logic, and database schema, which overrides the generic template advice below.

### Available n8n Workflows to Adapt:

#### 🏆 Primary Template (Best Match):

**"AI-Powered WhatsApp Chatbot for Text, Voice, Images & PDFs with RAG"**

- **Source:** n8n.io/workflows/4827
- **Why Perfect:** Multi-modal (text/voice/images), includes RAG for product knowledge, has memory
- **Key Features:**
  - WhatsApp Business API integration (Meta)
  - OpenAI GPT-4o-mini for conversations
  - MongoDB Vector Store for product documentation
  - Conversation memory across multiple turns
  - Audio transcription (Whisper API)
  - Image analysis
  - PDF document parsing

**What You Get:**

```
Workflow Components:
├── WhatsApp Trigger (listens for incoming messages)
├── Input Type Router (text/audio/image/PDF)
├── AI Agent with Knowledge Base (RAG)
├── MongoDB Vector Search (product catalog)
├── Memory Buffer (conversation context)
└── WhatsApp Response Sender
```

**Adaptation for SK AutoSphere:**

1. **Replace MongoDB Vector Store** with Supabase pgvector (your existing stack)
2. **Knowledge Base Content:**
   - Your inventory (cars available)
   - Common questions about shipping, payment, inspection
   - Pricing logic and negotiation rules
3. **System Prompt Template:**

```markdown
You are a professional car export sales agent for SK AutoSphere,
specializing in Korean used cars to African markets.

PRICING AUTHORITY:

- Can offer discounts up to $200 without escalation
- For discounts $200-$500: Acknowledge interest, flag for human review
- Never commit to discounts over $500

TONE: Professional but warm. Remember the customer's timezone
(Nigeria = UTC+1, Kenya = UTC+3, Ghana = UTC+0)

KNOWLEDGE BASE: Use the vector store to find:

- Available inventory matching customer criteria
- Shipping costs to their country
- Document requirements for their region
```

#### 🥈 Alternative Templates:

1. **"Complete Business WhatsApp AI RAG Chatbot using OpenAI"**
   - n8n.io/workflows/2845
   - Uses Qdrant vector DB
   - Good for high-scale operations

2. **"Building Your First WhatsApp Chatbot"**
   - n8n.io/workflows/2465
   - Simpler, good for learning
   - In-memory vector store (upgrade to Qdrant/Supabase later)

3. **"AI Customer Support Assistant · WhatsApp Ready"**
   - n8n.io/workflows/3859
   - Auto-crawls website for knowledge
   - Perfect for FAQ automation

### Implementation Roadmap:

**Week 1: Setup & Testing**

```bash
Day 1-2: WhatsApp Business API setup (Meta Developer Account)
Day 3-4: Import workflow, configure credentials
Day 5-7: Load inventory into Supabase pgvector
```

**Week 2: Customization**

```bash
Day 8-10: Write system prompts & negotiation logic
Day 11-12: Test with real leads (10 conversations)
Day 13-14: Refine based on feedback
```

**Week 3: Production**

```bash
Day 15-16: Deploy to n8n Cloud or self-hosted server
Day 17-18: Monitor & optimize
Day 19-21: Train team on escalation handling
```

**Estimated Cost:**

- WhatsApp Business API: Free for first 1,000 messages/month
- OpenAI API (GPT-4o-mini): ~$0.15 per 1M input tokens
- n8n Cloud: $20/month (or self-host for free)
- **Total Monthly:** ~$20-40 for low volume

---

## 🔍 AGENT #2: "The Matchmaker" (Smart Search 2.0)

**Priority:** ⭐⭐⭐⭐ (HIGH)

### Available n8n Workflows to Adapt:

#### 🏆 Primary Template:

**"AI-Powered Tech Radar Advisor with SQL DB, RAG, and Routing Agents"**

- **Source:** n8n.io/workflows/3151
- **Why Perfect:** Combines SQL (structured data) + RAG (semantic search) + Routing
- **Key Architecture:**

  ```
  User Query → AI Router → [SQL Agent OR RAG Agent] → Response

  SQL Agent: "Show me all 2015 SUVs under $8,000"
  RAG Agent: "I need a reliable car for bad roads in Lagos"
  ```

**Adaptation Strategy:**

1. **SQL Agent (Exact Match)**
   - Query your Supabase `vehicles` table
   - Filters: year, price, model, fuel_type, transmission
2. **RAG Agent (Semantic Understanding)**
   - Vectorize vehicle descriptions with attributes:
     ```javascript
     "2015 Toyota Land Cruiser Prado:
     Exceptional reliability, high ground clearance (220mm),
     proven durability in harsh African conditions,
     low maintenance costs, diesel fuel efficiency"
     ```
   - When user says "bad roads" → semantic match finds "high ground clearance"
   - When user says "reliable" → matches Toyota/Kia brands

3. **Router Logic:**
   ```python
   if query_has_specific_numbers():  # "under $5000", "2015-2018"
       → SQL Agent
   elif query_has_semantic_intent():  # "family car", "fuel efficient"
       → RAG Agent
   else:
       → Use BOTH, merge results
   ```

#### 🥈 Supporting Templates:

1. **"Convert Tour PDFs to Vector Database"**
   - n8n.io/workflows/5085
   - Shows how to vectorize unstructured data
   - Adapt for vehicle spec sheets

2. **"Create a Company Policy Chatbot with RAG"**
   - n8n.io/workflows/7563
   - Google Drive trigger → auto-update knowledge base
   - Perfect for auto-indexing new inventory

### Hybrid Search Enhancement:

**Reference:** "This Hybrid RAG Trick Makes Your AI Agents More Reliable"

- Source: theaiautomators.com/hybrid-rag-trick

**Implementation in Supabase:**

```sql
-- Create hybrid search function
CREATE FUNCTION hybrid_search(
    query_text TEXT,
    query_embedding VECTOR(1536),
    match_count INT DEFAULT 10
)
RETURNS TABLE(...) AS $$
BEGIN
    -- Combine vector similarity + keyword matching
    -- Using Reciprocal Rank Fusion (RRF)
END;
$$;
```

**n8n Workflow:**

```
User Query
  ↓
Generate Embedding (OpenAI)
  ↓
Supabase Edge Function (hybrid_search)
  ↓
Return Top 10 Results
  ↓
AI Agent formats & personalizes response
```

---

## 📸 AGENT #3: "Snappy" (Parts Visual Identifier)

**Priority:** ⭐⭐⭐ (MEDIUM)

### Available n8n Workflows to Adapt:

#### 🏆 Primary Template:

**"Automate Image Validation Tasks using AI Vision"**

- **Source:** n8n.io/workflows/2420
- **Why Perfect:** Shows Gemini Vision API integration for image analysis
- **Key Components:**
  - Google Drive image fetcher
  - Edit Image node (resize for speed)
  - Gemini Vision with structured output parser
  - JSON response formatting

**Adaptation for Parts Identification:**

**Original Use Case (Passport Validation):**

```javascript
Prompt: "Analyze this portrait. Does it meet UK passport photo criteria?
- White background?
- Face centered?
- Neutral expression?"

Output: { "is_valid": boolean, "issues": [...] }
```

**Your Use Case (Auto Parts ID):**

```javascript
Prompt: "Analyze this auto part image. Identify:
1. Part Type: (headlight/taillight/mirror/bumper/etc.)
2. Vehicle Make/Model: Best guess based on design
3. Year Range: Approximate compatibility
4. Condition: (new/used/damaged)
5. OEM vs Aftermarket: Visual indicators
6. Part Number: If visible in image"

Output: {
  "part_type": "Headlight Assembly",
  "make": "Hyundai",
  "model": "Sonata",
  "year_range": "2011-2014",
  "side": "Left (Driver)",
  "condition": "Used - Good",
  "oem_indicators": true,
  "confidence": 0.87,
  "part_number_visible": "92101-3Q000"
}
```

**Enhanced Workflow:**

```
WhatsApp Image Upload
  ↓
Download Image from WhatsApp URL
  ↓
Resize (max 1024px) for speed
  ↓
Gemini 1.5 Flash Vision (low latency!)
  ↓
Structured JSON Parser
  ↓
Vector Search in Parts Database (top 5 matches)
  ↓
Check Inventory (Supabase)
  ↓
Format WhatsApp Response with:
  - Part ID
  - Compatibility confirmation
  - Price & availability
  - Purchase link
```

**Example Response:**

```
✅ Part Identified!

📦 2011-2014 Hyundai Sonata Left Headlight
🏷️ OEM Part #92101-3Q000

💰 KRW 89,000 ($68 USD)
✅ In Stock - Ships in 2-3 days

Need this for a different Sonata year?
Let me know your VIN for 100% compatibility.

[Add to Cart] [Check Compatibility]
```

#### 🥈 Alternative Approach:

**"Mastering AI Image Automation with n8n"**

- Tutorial covering 5 image workflows
- Includes reverse image search techniques
- Could use for "find similar parts" feature

---

## 🚢 AGENT #4: "Captain Cargo" (Logistics Tracker)

**Priority:** ⭐⭐⭐ (MEDIUM)

### Available n8n Workflows to Adapt:

Unfortunately, your repository doesn't have ready-made shipping tracker templates, but we can build one using:

#### 🔧 Build from Scratch Using:

1. **Scheduled Trigger Node** (Check every 6 hours)
2. **Supabase Query** (Get active shipments)
3. **HTTP Request Nodes:**
   - MarineTraffic API
   - Sinokor API (if available)
   - Korea Customs API (for export clearance status)
4. **Compare & Update Logic**
5. **Notification Nodes:**
   - WhatsApp (primary for African customers)
   - Email (backup)
   - SMS (critical alerts)

**Workflow Architecture:**

```
Scheduled Trigger (Every 6 hours)
  ↓
Supabase: SELECT * FROM shipments
  WHERE status IN ('in_transit', 'port_arrival', 'customs')
  ↓
FOR EACH Shipment:
  ├─ Check Vessel Position (MarineTraffic API)
  ├─ Check Port Arrival (Sinokor/HMM API)
  ├─ Check Customs Status (Korea Customs)
  └─ Compare with last_known_status
      ↓
  IF status_changed:
    ├─ Update Supabase
    ├─ Send WhatsApp notification to buyer
    ├─ Log event
    └─ If critical_delay → Alert Sales Team
```

**Sample Notification Templates:**

**Port Arrival:**

```
🚢 SHIPMENT UPDATE

Your shipment (#SK-2024-1234) has arrived at
📍 Singapore Port for transshipment

Current Status: On Schedule ✅
Next Stop: Lagos (Apapa Port)
ETA: Dec 25, 2025

Documents Required Before Arrival:
⚠️ Form M (expires Dec 20)
⚠️ Import License

Need help? Reply to this message.
```

**Critical Delay:**

```
⚠️ SHIPMENT DELAY ALERT

Your container (#TEMU1234567) experienced a
3-day delay due to weather conditions.

New ETA Lagos: Jan 2 → Jan 5
Cause: Typhoon in South China Sea

What This Means:
- No additional fees
- Storage costs covered (if under 7 days)
- Priority unloading upon arrival

Track Live: [link]
Questions: Reply or call +82-10-XXXX
```

#### 📊 Data Sources to Integrate:

1. **MarineTraffic API** (Vessel Tracking)
   - Cost: $50-200/month depending on API calls
   - Real-time vessel positions
2. **Korea Customs UNI-PASS API** (Free!)
   - Export clearance status
   - Bill of Lading verification
3. **Port Authority APIs:**
   - Singapore Port Authority
   - Lagos (PTML/Apapa)
   - Mombasa Port (Kenya)

---

## 🔄 Cross-Agent Integration Opportunities

### 1. **The Negotiator ↔ The Matchmaker**

```
Customer: "Do you have Toyota Land Cruisers?"
  ↓
Negotiator calls Matchmaker Agent (sub-workflow)
  ↓
Matchmaker returns: 3 Land Cruisers (2015-2018, $12K-$18K)
  ↓
Negotiator formats WhatsApp response with images & specs
```

**n8n Implementation:**

- Use `Execute Workflow` node
- Matchmaker as reusable sub-workflow
- Pass parameters: {query: "Land Cruiser", max_results: 3}

### 2. **The Negotiator ↔ Captain Cargo**

```
Customer: "Where is my car?"
  ↓
Negotiator extracts order_id from conversation memory
  ↓
Calls Captain Cargo sub-workflow
  ↓
Returns live tracking link + current status
```

### 3. **Snappy ↔ Inventory Management**

```
WhatsApp: [Image of broken headlight]
  ↓
Snappy identifies: "2013 Kia Sportage Left Headlight"
  ↓
Auto-check inventory (Supabase)
  ↓
If IN STOCK: Offer immediate purchase
If OUT OF STOCK: Add to "sourcing queue" + notify when available
```

---

## 🛠️ Technical Implementation Guide

### Stack Alignment (Your Existing + n8n)

```yaml
Frontend: Next.js 14 (App Router)
Backend:
  - Supabase (PostgreSQL, Auth, Realtime)
  - n8n (Agent orchestration, workflows)
AI:
  - Google Gemini 1.5 Pro/Flash (already in your stack!)
  - OpenAI (for embeddings if needed)
Vector DB: Supabase pgvector (already enabled!)
Messaging: WhatsApp Business API (Twilio or Meta direct)
Hosting:
  - Next.js: Vercel
  - n8n: Cloud ($20/mo) or Self-hosted (Docker)
```

### Turning n8n Workflows into SaaS (Your Video Reference)

Based on the Chase AI video transcript you provided, here's how to **wrap your n8n agents in a web UI**:

#### Step 1: Create PRD/Claude.md

```markdown
# SK AutoSphere AI Agents SaaS

## Core Features:

1. User Authentication (Supabase Auth)
2. Dashboard:
   - View active WhatsApp conversations
   - Monitor shipment statuses
   - Search vehicle inventory
   - Upload images for parts ID

## Tech Stack:

- Frontend: Next.js 14 + Tailwind
- Backend: Supabase + n8n webhooks
- AI: Gemini + n8n workflows

## User Flows:

Admin Dashboard → View agent conversations
Customer Portal → Track shipments, chat history
Internal Tools → Manage inventory, pricing
```

#### Step 2: Use Claude Code to Build

```bash
# Create new folder
mkdir sk-autosphere-dashboard
cd sk-autosphere-dashboard

# Start Claude Code with PRD
claude-code --file claude.md
```

**Prompt Template:**

```
I have n8n workflows running as AI agents (WhatsApp chatbot,
inventory search, parts identifier, shipment tracker).

Build me a Next.js 14 admin dashboard where I can:
1. Monitor all WhatsApp conversations in real-time
2. View agent performance (response times, success rates)
3. Manually intervene in conversations if needed
4. See shipment tracking status
5. Manage vehicle inventory

Use Supabase for:
- Auth (admin vs customer roles)
- Realtime subscriptions for live updates
- Database for conversations, shipments

Connect to n8n via webhooks for triggering workflows.
```

#### Step 3: Deploy

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial SK AutoSphere dashboard"
git remote add origin https://github.com/yourusername/sk-autosphere-dashboard
git push -u origin main

# Deploy to Vercel
# Connect GitHub repo → Auto-deploy on push
# Add Supabase env vars in Vercel dashboard
```

**Environment Variables:**

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
N8N_WEBHOOK_URL=
GEMINI_API_KEY=
```

---

## 📈 Recommended Implementation Sequence

### Phase 1: Foundation (Weeks 1-2)

1. ✅ Set up n8n (Cloud or self-hosted)
2. ✅ Import "The Negotiator" WhatsApp workflow
3. ✅ Configure WhatsApp Business API
4. ✅ Load initial inventory into Supabase pgvector
5. ✅ Test with 10 real conversations

**Success Metric:** 80% of basic queries handled without human intervention

### Phase 2: Expansion (Weeks 3-4)

1. ✅ Implement "The Matchmaker" (semantic search)
2. ✅ Integrate with Negotiator (sub-workflow)
3. ✅ Add "Snappy" (parts identifier)
4. ✅ Build simple admin dashboard (Claude Code)

**Success Metric:** 50% reduction in manual search time

### Phase 3: Optimization (Weeks 5-6)

1. ✅ Add "Captain Cargo" (logistics tracking)
2. ✅ Implement proactive notifications
3. ✅ Connect all agents in cohesive system
4. ✅ Launch customer self-service portal

**Success Metric:** 90% customer satisfaction on tracking transparency

---

## 💰 Cost Analysis

### Monthly Operating Costs:

| Service               | Plan                       | Cost                   |
| --------------------- | -------------------------- | ---------------------- |
| n8n Cloud             | Starter (5,000 executions) | $20                    |
| WhatsApp Business API | First 1,000 messages FREE  | $0.005-0.009/msg after |
| Gemini 1.5 Flash      | 1M tokens/day free         | ~$10-30                |
| OpenAI Embeddings     | text-embedding-3-small     | ~$5-15                 |
| Supabase              | Pro (10GB)                 | $25                    |
| Vercel                | Pro (optional)             | $20                    |
| **TOTAL**             |                            | **$80-110/month**      |

**Alternative (Self-Hosted):**

- n8n: $0 (Docker on VPS)
- VPS (4GB RAM): $10-20/month
- **Total: $45-75/month**

---

## 🎯 Quick Start Checklist

### This Weekend (4 hours)

- [ ] Clone Zie619/n8n-workflows repo
- [ ] Browse zie619.github.io/n8n-workflows
- [ ] Search for "WhatsApp RAG" workflows
- [ ] Import workflow #4827 into n8n
- [ ] Sign up for WhatsApp Business API

### Next Week (10 hours)

- [ ] Configure WhatsApp trigger
- [ ] Load 20 test vehicles into Supabase
- [ ] Write first system prompt
- [ ] Test 5 conversations
- [ ] Iterate based on results

### Week 2 (15 hours)

- [ ] Refine negotiation logic
- [ ] Add price floor/ceiling rules
- [ ] Implement escalation to human
- [ ] Train team on using dashboard
- [ ] Go live with 1-2 pilot customers

---

## 📚 Resources & Documentation

### Official n8n Docs:

- **RAG Implementation:** https://docs.n8n.io/advanced-ai/rag-in-n8n/
- **Vector Stores:** https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.vectorstore/
- **AI Agents:** https://docs.n8n.io/advanced-ai/ai-agent/

### Zie619 Repository:

- **Main Repo:** https://github.com/Zie619/n8n-workflows
- **Search Interface:** https://zie619.github.io/n8n-workflows/
- **Stats:** 4,343 workflows, 365 integrations, 29,445 nodes

### Your Automation Stack:

- **WhatsApp-MCP-n8n:** https://github.com/Zie619/whatsapp-mcp-n8n
  - Perfect for advanced WhatsApp integration
  - Includes dashboard UI

### Tutorials:

- **Building WhatsApp AI Agents:** https://www.bitcot.com/building-custom-whatsapp-ai-agents-using-n8n-and-openai/
- **n8n + Qdrant (Vector DB):** https://qdrant.tech/documentation/qdrant-n8n/
- **Hybrid RAG Setup:** https://www.theaiautomators.com/hybrid-rag-trick-for-more-ai-agents-reliability/

---

## 🚀 Next Steps

1. **TODAY:** Browse zie619.github.io/n8n-workflows and identify 2-3 workflows most relevant to your needs
2. **THIS WEEK:** Import WhatsApp chatbot workflow and configure with test phone number
3. **NEXT WEEK:** Load sample inventory and test The Negotiator
4. **MONTH 1:** Full deployment of The Negotiator + Matchmaker
5. **MONTH 2:** Add Snappy (parts) + Captain Cargo (tracking)
6. **MONTH 3:** Build customer-facing SaaS dashboard (Claude Code)

---

## 💡 Pro Tips

1. **Start Small:** Don't try to build all 4 agents at once. Master The Negotiator first.
2. **Use Sub-Workflows:** Make agents modular - each agent as a reusable workflow
3. **Version Control:** Export n8n workflows to JSON, commit to GitHub
4. **Monitor Performance:** Use n8n execution logs + Supabase analytics
5. **Iterate Fast:** Ship MVP in 2 weeks, then improve based on real usage

---

**Ready to transform your business with AI agents?** Start with The Negotiator this week! 🚀
