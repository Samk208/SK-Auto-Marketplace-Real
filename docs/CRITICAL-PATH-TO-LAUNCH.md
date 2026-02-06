# 🚀 Critical Path to Launch: "Must Do" Checklist

**Date**: December 11, 2025
**Objective**: Roadmap for the immediate "Finishing" sprint.

These items are not optional. They are the minimum requirements to turn the current "High-Fidelity Demo" into a "Functional Application" where money can actually change hands.

---

## 📅 Day 1: Real Inventory (The Foundation)

Currently, the Parts Shop is a hallucination. We must make it persistent.

- [ ] **1. Create Database Schema**
  - Create `parts_catalog` table (id, name, part_number, price, stock, compatibility).
  - Create `parts_categories` table (engine, body, electrical).
  - Create `parts_orders` table (user_id, items, total, status, shipping_address).

- [ ] **2. Data Migration**
  - Copy the hardcoded array from `mock-data.ts`.
  - Create a SQL seed script to insert these ~200 items into Supabase.
  - Run migration and verify data exists in Supabase Dashboard.

- [ ] **3. Connect Shop Page**
  - Update `app/parts/page.tsx` to be `async`.
  - Replace `import { MOCK_PARTS }` with `await supabase.from('parts_catalog').select()`.
  - Ensure loading states and error boundaries work if DB is slow.

---

## 📅 Day 2: The Closing Loop (Orders & Checkout)

Users need to be able to complete a purchase and see it documented.

- [ ] **4. Build "My Orders" Dashboard**
  - Create `app/dashboard/orders/page.tsx`.
  - Fetch Vehicle Escrows (`escrow_transactions`).
  - Fetch Parts Orders (`parts_orders`).
  - Display them in a simple, responsive list (Status, Date, Total, Items).

- [ ] **5. Implement "Manual" Checkout**
  - In `step-payment.tsx`:
    - Add logic for "Manual Bank Transfer" and "M-Pesa Manual Paybill".
    - Input field for "Reference Number / Transaction ID".
  - In `step-review.tsx`:
    - Wiring the "Place Order" button.
    - **Critical Logic**: Insert row into `parts_orders` -> Decrement `parts_catalog` stock -> Redirect to Success.

---

## 📅 Day 3: Resilience (The African Context)

Mobile connections drop. Users switch devices. We must save their state.

- [ ] **6. Auto-Save Checkout State**
  - Create `useCheckoutStorage` hook in `checkout-page-client.tsx`.
  - Logic: `useEffect` -> Save `state` to `localStorage` on every change.
  - Logic: On Mount -> Hydrate `state` from `localStorage` if exists.
  - Add "Clear Cart" function on successful order completion.

- [ ] **7. Address Usability**
  - Add simple Google Places Autocomplete script to `step-shipping-address.tsx`.
  - Even a basic implementation reduces typing errors by 80%.

---

## 🛑 Deprioritized (Do Not Do Yet)

- ~Internationalization (i18n) Migration~: Keep the existing mock system for now.
- ~Real M-Pesa API Integration~: Too complex for V1. Use Manual Entry.
- ~Advanced AI Vision~: Nice to have, but not a blocker for selling a brake pad.

---

**Next Session Start**: Begin with Item #1 (Create Database Schema).
