# Agent Strategy Alignment: KmedTour → SK AutoSphere

**Date:** January 27, 2026
**Objective:** Adapt "Deep Tech" agent patterns from KmedTour (Medical OS) to SK AutoSphere (Trade OS).

## 🔄 Strategic Transfer Map

We can accelerate SK AutoSphere's "Deep Tech" status by adopting these architectural patterns:

| KmedTour Agent (Source)             | Technology               | SK AutoSphere Adaptation (Target)      | Why transfer?                                                                                                              |
| :---------------------------------- | :----------------------- | :------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **1. Customer Support (LangGraph)** | LangGraph + Safety Layer | **The Negotiator** (WhatsApp Sales)    | We need stateful, multi-turn negotiation logic with "Financial Safety" rails (don't sell below floor price).               |
| **2. Research Agent (CrewAI)**      | CrewAI + Market Check    | **The Advisor** (Market Intelligence)  | Replace "Clinic Accreditation" checks with "Vehicle History/Price" checks. Autonomous research is a key Deep Tech trait.   |
| **3. Patient Intake Graph**         | State Machine            | **The Export Manager** (Captain Cargo) | The "Intake -> Triage -> Quote" flow maps perfectly to "Purchase -> Logistics -> Export" documentation flow.               |
| **4. Voice Agent**                  | Deepgram/Daily.co        | **The Bidding Proxy** (Future)         | While not immediate, real-time voice can communicate with Auctioneers or non-tech savvy dealers in classic phone channels. |

## 📂 File Request List (To Copy)

To implement this strategy, please copy the following files from the **KmedTour** project to a new `reference/kmedtour/` folder in SK AutoSphere (or just share them so I can adapt them):

### 1. For "The Negotiator" (Chat/Sales)

- `agents/app/core/graph.py` (To see how LangGraph is structured)
- `agents/src/medical_safety.py` (To adapt "Medical Safety" → "Financial/Negotiation Safety")

### 2. For "The Advisor" (Research/Pricing)

- `agents/src/research_agent.py` (To see the CrewAI implementation for autonomous research)

### 3. For "Deep Tech" Orchestration

- `agents/src/core/state_machine.py` (To track the lifecycle of a car/deal like you track patients)
- `patient_intake_graph.py` (To model the "Export Workflow" pipeline)

### 4. Voice (Optional but good for Deep Tech)

- `agents/src/voice/core_logic.py` (If we want to claim "Voice-Native" interfaces for African dealers)

## 🚀 Implementation Plan

1.  **Analyze**: Once copied, I will analyze `graph.py` to design the **Negotiator's Brain**.
2.  **Adapt**: I will rewrite `medical_safety.py` into `financial_safety.py` (preventing the AI from offering 50% discounts).
3.  **Deploy**: We will use these Python patterns (deployed via Supabase Edge Functions or a small Python container) to power the agents in `AI_AGENT_INVENTORY.md`.
