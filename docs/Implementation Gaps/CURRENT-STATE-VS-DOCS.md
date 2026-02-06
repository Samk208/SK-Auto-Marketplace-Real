# Current State vs Docs (Canonical Index)

**Purpose:** This file is the canonical index for identifying which documents are **current**, which are **historical/outdated**, and where to verify truth in code and Supabase.

---

## Source of Truth (in priority order)

- **[Code + API routes]**
  - `app/api/**` is the authoritative record of which workflows are implemented.
  - Key examples:
    - Admin stats: `app/api/admin/stats/route.ts`
    - Admin approve/reject: `app/api/admin/listings/[id]/approve/route.ts`, `.../reject/route.ts`
    - Transactions: `app/api/transactions/route.ts`
    - Stripe: `app/api/stripe/*` (payment intents, status, webhooks)

- **[Supabase schema + migrations]**
  - Authoritative DB state is what is **applied** in Supabase.
  - Local migration files live in `supabase/migrations/**`.

- **[Docs that match current implementation]**
  - `docs/Implementation Gaps/GAP-ANALYSIS.md` (this folder) is the canonical gap tracker.

---

## Canonical “Current State” Docs (use these)

- `docs/Implementation Gaps/GAP-ANALYSIS.md`
  - Updated to reflect current Supabase reality (parts table exists; transactions/Stripe exist; admin is mixed).

- `docs/ADMIN-PANEL.md`
  - Updated to reflect that admin is **not** frontend-only: real auth + real APIs exist, but some pages are still mock-driven.

- `docs/STRIPE-INTEGRATION.md`
  - Use as reference for keys, Stripe CLI testing, and file locations.

- `docs/TRANSACTION-API-IMPLEMENTATION.md` and `docs/TRANSACTION-API-QUICK-REFERENCE.md`
  - Use as reference for `transactions` access patterns.

---

## Known-Outdated / Conflicting Docs (treat as historical)

These documents contain claims that conflict with the current codebase (e.g. “frontend-only”, “no backend dependencies”, “mock-only checkout”). Keep them for history, but **do not treat them as current state**:

- `docs/FINAL-IMPLEMENTATION-VERIFICATION.md`
  - Claims “frontend-only with mock data” and “no backend dependencies”, which conflicts with real Supabase + Stripe APIs.

- `docs/CODEBASE-VERIFICATION.md`
  - Also describes admin as mock-only; conflicts with current `app/api/admin/*` and Supabase-backed auth.

- `docs/IMPLEMENTATION-SUMMARY.md`
  - States AI features are mock and describes mock-first architecture; partially conflicts with now-real integrations.

- `docs/CRITICAL-PATH-TO-LAUNCH.md`
  - Still valuable as a checklist mindset, but references creating tables that now already exist (e.g., parts inventory).

---

## “Planned vs Implemented” Summary (as of now)

- **Implemented (real)**
  - Vehicle listings + dealer CRUD (Supabase)
  - Parts inventory data (`parts` table)
  - Stripe payment intent + webhook handling + `transactions`
  - Admin stats and listing approve/reject APIs
  - Blog tables (`blog_posts`, etc.)

- **Partially implemented / mixed**
  - Admin UI: some screens wired, some still mock (`/admin/payments`, `/admin/audit-logs`, `/admin/exports`, `/admin/settings/users`)
  - Buyer “orders/history”: `app/orders/` exists; verify end-to-end UX + data completeness
  - AI: provider + endpoints exist; some UI components may still be mock-driven

- **Likely not end-to-end yet**
  - Shipments/exports workflow (UI exists but still mock-driven)

---

## Maintenance Rules

- If you add a new workflow (API route, DB table, agent/workflow), update:
  - `docs/Implementation Gaps/GAP-ANALYSIS.md`
  - This file: `docs/Implementation Gaps/CURRENT-STATE-VS-DOCS.md`

- If two docs conflict, the correct answer is whichever matches:
  - Current code in `app/api/**` and
  - Current Supabase applied migrations.
