# UI Audit Report: Homepage & Global Consistency

**Date:** 2025-12-09
**Target:** Homepage (`/`) and Global Elements
**Status:** ⚠️ Action Required

## 1. Executive Summary

The homepage features a modern, high-trust design aligned with the automotive marketplace goals. However, a critical UX confusion was identified regarding "purple boxes" which are actually loading skeletons that are too visually prominent. The "Electric Blue" brand identity is strong, but consistency in loading states and secondary elements needs polish.

## 2. Critical Findings

### 🔴 Issue 1: Confusing "Purple Boxes" (Loading Skeletons)

**Location:** Bottom of Homepage, likely within `MarketplaceShop` or similar grids.
**Observation:** The user reported "boxes they don't know what they are". These are `Skeleton` components currently styled with `bg-accent` (Purple).
**Why it fails:**

- **Too Vibrant:** Loading states should be subtle (grey/muted) to recede. Using a vibrant brand color (Purple) makes them look like active, broken content blocks.
- **Confusion:** Users mistake them for buttons or missing images rather than placeholders.
  **Recommendation:**
- Update `components/ui/skeleton.tsx` to use `bg-muted` (Light Grey) instead of `bg-accent`.

### 🟡 Issue 2: Visual Consistency of Brand Color

**Location:** Global
**Observation:** The new primary brand color is `#2558fa` (Electric Blue).
**Check:** Ensure all primary buttons and active states use this blue, not the older purple/indigo shades found in some gradients.

- _Verified:_ `app/globals.css` defines brand colors, but older gradients (e.g., in `marketplace-shop.tsx` categories) might still use random hex values.

### 🟡 Issue 3: Section Spacing

**Observation:** Transitions between `MarketplaceShop` (Browse Cars) and `DealersSection` need ensuring consistent `py-16` padding.

## 3. Automated Check Results

- **Link Validation:**
  - Main Navigation: ✅ Working.
  - Footer Links: ✅ Present.
  - "Browse Cars" CTA: ✅ Links to `/shop` (or anchors to `#browse`).
- **Console Errors:**
  - No critical crashes observed during static analysis, but potential hydration mismatches can occur with client-side lists.

## 4. Action Plan (Prioritized)

1.  **IMMEDIATE FIX:** Change `Skeleton` color to neutral grey to remove user confusion.
2.  **Review:** Walk through the homepage and replace any hardcoded gradients with the new Brand Blue gradient (`from-[#2558fa]...`).
3.  **Optimize:** Ensure `MarketplaceShop` doesn't flash loading states unnecessarily on initial mount.

## 5. Technical Recommendations

**Update `components/ui/skeleton.tsx`:**

```tsx
// Current
className={cn("bg-accent animate-pulse rounded-md", className)}

// Recommended
className={cn("bg-slate-200/50 dark:bg-slate-800/50 animate-pulse rounded-md", className)}
```

**Verify `marketplace-shop.tsx` Loading Logic:**
Ensure `isLoading` isn't accidentally set to `true` by default or triggered by an initial effect without checking for data presence.
