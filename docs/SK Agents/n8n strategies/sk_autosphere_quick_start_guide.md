# 🎯 SK AutoSphere: Quick Start Workflow Links

**Date:** December 14, 2025  
**Action Required:** Import these workflows into your n8n instance TODAY

---

## 🔥 PRIORITY 1: The Negotiator (WhatsApp Sales Bot)

### Top 3 Workflows to Import:

#### #1 - AI-Powered WhatsApp Chatbot (RAG + Multi-Modal) ⭐⭐⭐⭐⭐

**Direct Link:** https://n8n.io/workflows/4827-ai-powered-whatsapp-chatbot-for-text-voice-images-and-pdf-with-rag/

**What It Does:**

- Handles text, voice notes, images, and PDFs
- RAG with MongoDB Vector Store (you'll swap for Supabase)
- Conversation memory
- Perfect for African market (handles voice notes!)

**Import Command:**

```bash
# In n8n UI:
# 1. Click Workflows → Import from URL
# 2. Paste: https://n8n.io/workflows/4827
# 3. Or download JSON and import
```

**Prerequisites:**

- [ ] WhatsApp Business API credentials (Meta)
- [ ] OpenAI API key
- [ ] MongoDB account (temp - will migrate to Supabase)

---

#### #2 - Building Your First WhatsApp Chatbot ⭐⭐⭐⭐

**Direct Link:** https://n8n.io/workflows/2465-building-your-first-whatsapp-chatbot/

**What It Does:**

- Simpler starter template
- Good for learning the basics
- In-memory vector store (easier setup)

**Why Use This:**

- If #1 feels overwhelming, start here
- Takes 30 mins to set up vs 2 hours
- Can upgrade to full RAG later

---

#### #3 - AI Customer Support Assistant (WhatsApp Ready) ⭐⭐⭐⭐

**Direct Link:** https://n8n.io/workflows/3859-ai-customer-support-assistant-whatsapp-ready-works-for-any-business/

**What It Does:**

- Auto-crawls your website for FAQs
- 24/7 customer support
- Free 24-hour messaging window
- Template messages for >24hrs

**Perfect For:**

- Handling common questions automatically
- Reducing support ticket volume

---

## 🔍 PRIORITY 2: The Matchmaker (Semantic Search)

### Top 2 Workflows to Import:

#### #1 - AI-Powered Tech Radar Advisor (SQL + RAG + Routing) ⭐⭐⭐⭐⭐

**Direct Link:** https://n8n.io/workflows/3151-build-an-ai-powered-tech-radar-advisor-with-sql-db-rag-and-routing-agents/

**What It Does:**

- Router agent (decides: SQL or RAG?)
- SQL agent for exact queries ("2015 SUVs under $8K")
- RAG agent for semantic ("reliable car for bad roads")
- Perfect hybrid approach!

**Adaptation:**

```javascript
// Replace "Tech Radar" with "Vehicle Inventory"
// SQL Agent → Query Supabase vehicles table
// RAG Agent → Search vectorized vehicle descriptions
// Router → Determines which agent to use
```

---

#### #2 - Create Company Policy Chatbot with RAG & Pinecone ⭐⭐⭐⭐

**Direct Link:** https://n8n.io/workflows/7563-create-a-company-policy-chatbot-with-rag-pinecone-vector-database-and-openai/

**What It Does:**

- Two workflows:
  1. Data Loading (Google Drive → Vector DB)
  2. Data Retrieval (Chat Interface)
- Auto-updates when new docs added

**Your Use Case:**

```
Google Drive: Vehicle spec sheets (PDFs)
  ↓
Auto-vectorize & index
  ↓
Semantic search for inventory
```

---

## 📸 PRIORITY 3: Snappy (Parts Visual Identifier)

### Best Workflow to Import:

#### Image Validation Using AI Vision ⭐⭐⭐⭐

**Direct Link:** https://n8n.io/workflows/2420-automate-image-validation-tasks-using-ai-vision/

**What It Does:**

- Uses Gemini Vision API
- Structured output (JSON)
- Image preprocessing (resize, optimize)

**Adaptation:**

```javascript
// Original: Validate passport photos
// Your Use: Identify auto parts

Replace System Prompt:
"Analyze this passport photo..."
→
"Identify this auto part: type, make, model, year, condition"
```

**Output Example:**

```json
{
  "part_type": "Headlight Assembly",
  "make": "Hyundai",
  "model": "Sonata",
  "year_range": "2011-2014",
  "side": "Left",
  "confidence": 0.87
}
```

---

## 🚢 PRIORITY 4: Captain Cargo (Logistics Tracker)

### Build from Scratch Using These Nodes:

**No ready-made template exists**, but here's your blueprint:

#### Required n8n Nodes:

1. **Schedule Trigger** (runs every 6 hours)
2. **Supabase** (query active shipments)
3. **HTTP Request** (call shipping APIs)
4. **If/Switch** (detect status changes)
5. **WhatsApp** (send notifications)

#### Sample APIs to Integrate:

- **MarineTraffic API:** https://www.marinetraffic.com/en/ais-api-services/
- **Korea Customs UNI-PASS:** https://unipass.customs.go.kr/
- **Port APIs:** Singapore, Lagos, Mombasa

**Tutorial Reference:**

- Search Zie619 repo for: "scheduled automation" + "API integration"
- Keywords: `cron`, `webhook`, `notification`

---

## 🎨 BONUS: Dashboards & Interfaces

### WhatsApp Dashboard ⭐⭐⭐⭐⭐

**Source:** https://github.com/Zie619/whatsapp-mcp-n8n

**What It Includes:**

- React dashboard for WhatsApp conversations
- Real-time message viewing
- Message history
- Contact management

**Perfect For:**

- Monitoring agent conversations
- Manual intervention when needed
- Training team members

---

## 🛠️ Import Instructions

### Method 1: Direct Import from n8n.io

```
1. Open n8n
2. Click "Workflows" in sidebar
3. Click "Import from URL"
4. Paste workflow link (e.g., https://n8n.io/workflows/4827)
5. Click "Import"
```

### Method 2: Download JSON & Import

```
1. Visit workflow page
2. Click "Download JSON"
3. In n8n: Workflows → Import from File
4. Select downloaded JSON
5. Configure credentials
```

### Method 3: Use Zie619 Repository

```bash
# Clone entire repository
git clone https://github.com/Zie619/n8n-workflows.git
cd n8n-workflows/workflows

# Browse by category
ls WhatsApp/  # WhatsApp workflows
ls AI/        # AI-related workflows
ls Database/  # Database workflows

# Import specific workflow
# Copy JSON file content → n8n Import from File
```

---

## 📋 Setup Checklist

### This Week:

- [ ] Import WhatsApp workflow #4827
- [ ] Sign up for WhatsApp Business API
- [ ] Get OpenAI API key
- [ ] Configure n8n credentials
- [ ] Test with dummy phone number

### Next Week:

- [ ] Load 20 test vehicles into Supabase
- [ ] Configure vector embeddings
- [ ] Write system prompt for Negotiator
- [ ] Run 5 test conversations
- [ ] Iterate and improve

### Week 3:

- [ ] Import Matchmaker workflow #3151
- [ ] Integrate with Negotiator
- [ ] Test hybrid search
- [ ] Deploy to production

---

## 🔑 Required Accounts & API Keys

### Must Have (Week 1):

1. **WhatsApp Business API**
   - Sign up: https://business.whatsapp.com/
   - Cost: Free for first 1,000 messages/month
2. **OpenAI API**
   - Sign up: https://platform.openai.com/
   - Cost: ~$0.15 per 1M tokens (very cheap)

3. **n8n Account**
   - Cloud: https://n8n.io (€20/month)
   - OR Self-host: Free (Docker)

### Nice to Have (Week 2-3):

4. **MongoDB Atlas** (temp for testing)
   - Free tier: 512MB
   - Will migrate to Supabase later

5. **Twilio** (alternative WhatsApp provider)
   - If Meta Business API is difficult

---

## 💡 Pro Tips for Success

### 1. Start with Simplest Workflow First

```
Week 1: Import #2465 (Simple WhatsApp bot)
Week 2: Upgrade to #4827 (Full RAG bot)
Week 3: Add custom logic
```

### 2. Use Zie619's Search Interface

- Go to: https://zie619.github.io/n8n-workflows/
- Search keywords:
  - "WhatsApp AI"
  - "Vector database"
  - "Image recognition"
  - "Scheduled automation"

### 3. Version Control Your Workflows

```bash
# Export workflow JSON from n8n
# Commit to GitHub for backup
git add workflows/negotiator-v1.json
git commit -m "Add Negotiator workflow v1"
```

### 4. Test Locally Before Production

```bash
# Use n8n webhook testing
# Set up local tunnel with ngrok
ngrok http 5678  # n8n default port

# Use ngrok URL for WhatsApp webhook
# Test before connecting real customers
```

---

## 🎯 Success Metrics (30 Days)

### Week 1 Goals:

- [ ] WhatsApp bot responds to 100% of messages
- [ ] <5 second response time
- [ ] 0 crashes

### Week 2 Goals:

- [ ] 50% of queries answered without human help
- [ ] 10 successful test conversations
- [ ] Customer satisfaction >4/5

### Week 4 Goals:

- [ ] 80% automation rate
- [ ] 100+ conversations handled
- [ ] $0 in downtime costs

---

## 🆘 Troubleshooting Resources

### If You Get Stuck:

1. **n8n Community Forum**
   - https://community.n8n.io/
   - Search existing threads
   - Ask questions

2. **Zie619's Issues**
   - https://github.com/Zie619/n8n-workflows/issues
   - Check for similar problems

3. **Your Past Conversations**
   - You've built complex n8n workflows before!
   - Reference your Korean auto parts scraper
   - Similar architecture applies here

4. **Claude (Me!)**
   - Share error logs
   - Show workflow screenshots
   - I can help debug

---

## 📞 Emergency Contact Template

**If you're stuck for >2 hours on setup:**

```
Subject: SK AutoSphere n8n Setup Issue - [Agent Name]

Environment:
- n8n version: [Cloud/Self-hosted]
- Workflow ID: #[4827/2465/etc]
- Error: [paste error log]

What I tried:
1. [step 1]
2. [step 2]

Screenshots: [attach]

Expected: [what should happen]
Actual: [what's happening]
```

**Where to send:**

- n8n Community: https://community.n8n.io/
- Or paste in our next conversation!

---

**Ready to get started? Import workflow #4827 right now! 🚀**

Time to first response: **30 minutes**  
Time to first successful conversation: **2 hours**  
Time to production deployment: **1 week**

Let's build this! 💪
