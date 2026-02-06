# Design: The Negotiator (WhatsApp Sales Agent)

**Source Pattern**: KmedTour `graph.py` (LangGraph) + `medical_safety.py` (Safety Layer).
**Target**: SK AutoSphere "Deep Tech" Sales Agent.

## 🧠 Brain Architecture (LangGraph)

The Negotiator uses a state machine similar to KmedTour's `StateGraph`, but with sales-specific nodes.

### State Definition

```python
class AgentState(TypedDict):
    messages: List[Any]
    intent: str  # "inventory", "negotiation", "shipping", "human"
    deal_stage: str # "lead", "qualified", "negotiating", "closed"
    listing_id: str | None
    safety_violations: List[SafetyViolation]
```

### Nodes (The Logic)

1.  **`router`**: Analyzes user input to classify intent.
    - _Input_: "Can you give me a discount on the Tucson?"
    - _Output_: `intent="negotiation"`
2.  **`inventory_agent`**: (Replaces `medical_info_agent`)
    - _Role_: Searches Supabase for cars.
    - _Logic_: RAG search over vehicle descriptions.
3.  **`negotiation_agent`**: (Replaces `faq_agent`)
    - _Role_: Discusses price/terms within bounds.
    - _Logic_: "I can offer $50 off shipping, but the car price is fixed."
4.  **`financial_safety`**: (Replaces `medical_safety`)
    - _Role_: Prevents hallucinated discounts or false condition claims.

## 🛡️ Financial Safety Layer (`financial_safety.py`)

Adapted from `MedicalSafetyLayer`. Instead of FDA rules, we use CFO rules.

### Regex Patterns

1.  **Unauthorized Discount**:
    - Pattern: `(take|accept) \$[0-9]+`, `discount of [0-9]%`
    - Rule: Block if value > `MAX_ALLOWED_DISCOUNT` (e.g., $100).
2.  **False Condition Promises**:
    - Pattern: `perfect condition`, `no scratches`, `guaranteed engine`
    - Rule: Block. Use phrases like "Report says..." instead.
3.  **Payment Scams**:
    - Pattern: `western union`, `crypto`, `personal account`
    - Rule: **CRITICAL BLOCK**. Only allow "Invoice" or "Stripe".

## 🚀 Implementation Steps

1.  **File Creation**:
    - Create `agents/negotiator/graph.py` (adapted from `Kmed agent adoption/graph.py`).
    - Create `agents/negotiator/financial_safety.py` (adapted from `Kmed agent adoption/medical_safety.py`).
2.  **Integration**:
    - Connect `inventory_agent` to `lib/repositories/listings.ts` (via API or direct DB).
3.  **Deployment**:
    - Deploy as a **Supabase Edge Function** (Python) or a small **FastAPI container** on Fly.io/Render.
