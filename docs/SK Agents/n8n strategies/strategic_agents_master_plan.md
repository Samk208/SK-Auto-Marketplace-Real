# SK AUTOSPHERE: Strategic AI Agents Master Plan

**Date:** December 14, 2025  
**Project:** SK AutoSphere (Korean Used Car Export Platform)  
**Target Market:** Africa (Nigeria, Ghana, Kenya, etc.) via Korea.

---

## 🏗️ Core Tech Stack & Architecture

SK AutoSphere is built on a modern, scalable stack designed for performance and reliability in low-bandwidth markets.

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS.
- **Backend / Database**: Supabase (PostgreSQL, Auth, Realtime, Edge Functions).
- **AI Engine**: Google Gemini 1.5 Pro & Flash (via `lib/gemini.ts` and n8n).
- **Automation/Orchestration**: **n8n** (Self-hosted or Cloud) for complex agent workflows.
- **Vector Search**: Supabase `pgvector` for semantic understanding.

### implementation Strategy: "The n8n Backend"

Instead of writing complex, hard-to-maintain code for every agent step, we will use **n8n workflows** as the "brain" for our agents.

1.  **Frontend (Next.js)** captures user input (text, voice, image).
2.  **Webhook** sends data to n8n.
3.  **n8n** executes logic (AI chain, API calls, Database lookups).
4.  **Response** is pushed back to Supabase/Frontend or sent via WhatsApp.

---

## 🚀 AGENTS TO BUILD (The "Missing Link" Collection)

Based on a codebase audit, these are the high-impact agents that are currently **missing** or need significant **smart upgrades**.

### 1. ❤️ Agent: "The Matchmaker" (Smart Search 2.0)

_Currently: Basic keyword search (SQL `ilike`)._

**Role:** The Ultimate Vehicle Concierge.  
**Why Build?** African buyers often describe _needs_ rather than _specs_ (e.g., "I need a strong car for bad village roads in Lagos" vs "2015 SUV 4WD"). Basic SQL search fails here.

**Key Features:**

- **Semantic Understanding:** Maps "reliable" to specific models (Toyota/Kia) and "bad roads" to high ground clearance.
- **Cross-Lingual Search:** Search in French/Swahili -> Find Korean Listings.
- **Proactive Recommendation:** "Since you like the Santa Fe, check out this Sorento - it's $500 cheaper with better specs."

**Implementation Plan:**

- Enable `pgvector` on Supabase.
- Create an n8n workflow to generate embeddings for all inventory items using Gemini.
- Frontend chat interface sends query -> n8n vectors query -> Supabase returns Semantic Matches.

---

### 2. 🤝 Agent: "The Negotiator" (WhatsApp Sales Bot)

_Currently: Missing._

**Role:** 24/7 Sales Representative & Culture Bridge.  
**Why Build?** The African market lives on WhatsApp. Timezone differences (Korea is +7-9hrs) mean you lose leads while you sleep.

**Key Features:**

- **Lead Qualification:** "Are you a dealer or personal buyer? What is your budget?"
- **Inventory Lookup:** Responds to "Do you have any Sonatas?" with real-time links from our DB.
- **Lite Negotiation:** Has a logical "floor price." Can offer small discounts (e.g., "$50 off shipping") but escalates big asks to a human.
- **Multi-Modal:** Can receive images ("Do you have this car?") and send voice notes.

**Implementation Plan:**

- **Twilio API** for WhatsApp Business.
- **n8n Webhook** serves as the message handler.
- **Supabase Memory:** Stores conversation context (`chat_history` table) so it remembers who the user is.

---

### 3. 🚢 Agent: "Captain Cargo" (The Logistics tracker)

_Currently: Basic Cost Calculator exists. Real-time tracking missing._

**Role:** Proactive Logistics Manager.  
**Why Build?** "Where is my car?" is the #1 support ticket in export. Shipping delays are common (weather, transshipment). Silent delays kill trust.

**Key Features:**

- **Active Vessel Watch:** Polls Shipping APIs (e.g., MarineTraffic/Sinokor) for the actual location of the container vessel.
- **Proactive Alerts:** "Your ship has docked in Singapore for transshipment. New ETA Lagos: Nov 14." (Sent via WhatsApp/Email).
- **Document Chaser:** "Your Bill of Lading Draft is ready. Please approve it by Friday to avoid penalties."

**Implementation Plan:**

- **Scheduled n8n Workflow:** Runs every 6 hours.
- Checks active shipments in Supabase.
- Queries External Logistics API.
- Updates `shipment_status` in DB and triggers notification if changed.

---

### 4. 📸 Agent: "Snappy" (Parts Specialist)

_Currently: Missing._

**Role:** Visual Parts Identifier.  
**Why Build?** The "Long Tail" of parts sales is huge. Mechanics often have the broken part in hand but don't know the obscure OEM part number.

**Key Features:**

- **Snap-to-Search:** User uploads photo of broken part (e.g., headlight, alternator).
- **Visual Match:** Agemt identifies "2012-2015 Hyundai Sonata Left Headlight Assembly".
- **Inventory Check:** Instantly checks stock and pricing.
- **Compatibility Verification:** Uses VIN to confirm 100% fit.

**Implementation Plan:**

- **Gemini 1.5 Flash (Vision)**: Low latency, high accuracy visual analysis.
- **Parts Database Vectorization**: Index parts images for visual similarity search.

---

## 🧠 EXISTING AGENTS (Do Not Duplicate)

These capabilities are **already implemented** in your `lib/gemini.ts` and Next.js app. We will simply **expose** them better.

- **The Advisor (Pricing Intelligence):** `getPricingRecommendation` exists. It already analyzes pricing based on year/mileage/market.
- **The Truth Scanner (Condition Report):** `analyzeVehicleCondition` exists. It already scans 4 images for scratches/dents using Vision AI.

## 🏁 Recommendation: Where to Start?

**Start with #2: The Negotiator (WhatsApp).**

- **Impact:** Immediate revenue (captures leads while you sleep).
- **Complexity:** Medium (Standard Chatbot pattern).
- **Market Fit:** Perfect for Africa's mobile-first/WhatsApp-first culture.
