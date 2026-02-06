# AI Agent Inventory & Strategic Alignment

**Date:** January 27, 2026
**Purpose:** consolidate all AI capabilities to prevent duplication and align with "Deep Tech" goals.

## 🤖 The "Agent Swarm" (Deep Tech Core)

_Mapping the "Deep Tech" Strategy to current Code/Plans._

| Strategic Agent          | Role                         | Status                     | Current Code Impact                              | Gap / Action                                                                                                                            |
| :----------------------- | :--------------------------- | :------------------------- | :----------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **1. The Matchmaker**    | Smart Search & RAG           | 🟡 **Planned**             | `docs/strategic-overview-core-ai-track.md`       | **Missing**. Needs `pgvector` on Supabase + n8n embedding workflow.                                                                     |
| **2. The Negotiator**    | WhatsApp Sales & Support     | 🟡 **Planned** (n8n)       | `docs/SK Agents/n8n strategies/`                 | **Overlap Risk**: "Jinnie" (`app/jinnie`) is the web version. **Decision**: Keep Jinnie for Web, build Negotiator for WhatsApp via n8n. |
| **3. The Advisor**       | Pricing Intelligence         | 🟢 **Implemented**         | `app/api/ai/pricing/route.ts`                    | **Refine**. Currently a basic API. Needs to become proactive (scheduled jobs) for "Deep Tech" status.                                   |
| **4. The Truth Scanner** | Vision AI / Defect Detection | 🟢 **Implemented** (Basic) | `app/api/ai/condition-report/route.ts`           | **Upgrade**. Currently standard Vision. Needs custom "Defect/Rust" model training (Prompt Engineering) to meet "Deep Tech" claims.      |
| **5. Captain Cargo**     | Logistics Tracker            | 🔴 **Missing**             | `directives/implement_agent_captain_cargo.md`    | **Build**. Needs integration with MarineTraffic API via n8n.                                                                            |
| **6. Parts Specialist**  | "Snap-to-Part" Identifier    | 🔴 **Missing**             | `directives/implement_agent_parts_specialist.md` | **Build**. Needs Vision AI specializing in auto parts catalogs.                                                                         |
| **7. Auction Agent**     | RL Bidding (The "Super Gap") | 🔴 **Missing**             | _Theoretical Only_                               | **Critical Gap**. No code exists. Needs a Python/Edge function for Reinforcement Learning.                                              |

## 🧩 Current Technical Implementations

_What actually exists in `app/api/ai/_`\*

1.  **`POST /api/ai/chat` ("Jinnie")**
    - **Logic**: `lib/gemini.ts` → `chatWithGemini`
    - **State**: Functional. Connects to Gemini.
    - **Use Case**: Web-based conversational search.

2.  **`POST /api/ai/pricing` ("Advisor Lite")**
    - **Logic**: `lib/gemini.ts` → `getPricingRecommendation`
    - **State**: Functional. Returns price ranges/confidence.
    - **Use Case**: "Sell Your Car" form.

3.  **`POST /api/ai/condition-report` ("Truth Scanner Lite")**
    - **Logic**: `lib/gemini.ts` → `analyzeVehicleCondition`
    - **State**: Functional. Analyzes images.
    - **Use Case**: Upload photos during listing creation.

4.  **`POST /api/ai/generate-listing`**
    - **Logic**: Generates title/description from meta-data.
    - **State**: Helper tool for Admin/Dealers.

## ⚠️ Duplication & Collision Risks

1.  **Jinnie vs. Negotiator**:
    - _Risk_: Developing two separate "brains" for customer service.
    - _Solution_: Use **n8n** as the central brain. Make `api/ai/chat` (Web) and WhatsApp (Mobile) both call the _same_ n8n webhook to share context/memory.

2.  **Advisor vs. Auction Agent**:
    - _Risk_: "Advisor" predicts market price; "Auction Agent" bids based on price.
    - _Solution_: "Advisor" should be the _Data Source_ for the "Auction Agent".

## 🛠 Recommended Next Steps

1.  **Migrate Logic to n8n**: Move the complex prompting from `lib/gemini.ts` to n8n workflows regarding "Negotiator" and "Matchmaker" to easier manage changes.
2.  **Build "Captain Cargo"**: This is a low-hanging fruit for "Deep Tech" (Logistics Tech) that users feel immediately.
3.  **RL Prototype**: Create a simple Python script or Edge Function that simulates the "Auction Agent" logic to claim the "Reinforcement Learning" pillar.
