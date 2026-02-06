# UI Audit Report: Shop Page (`/shop`)

**Date:** 2025-12-09
**Target:** Shop Page
**Status:** ⚠️ Action Required

## 1. Executive Summary

The Shop Page is functional but disconnected from the main site's visual identity. It drastically differs from the Homepage in terms of layout, branding, and consistency. Notably, the global footer is missing, and the header style is inconsistent.

## 2. Critical Findings

### 🔴 Issue 1: Missing Global Footer

**Observation:** The `/shop` page ends at the "Trust Strip" and does not display the standard `SiteFooter` found on the homepage.
**Impact:** Disconnected user journey, missing navigation to critical pages (About, Contact), and loss of trust.
**Recommendation:** Import and add `<SiteFooter />` to `ShopPageClient`.

### 🟡 Issue 2: Visual Disconnect & "Boring" UI

**Observation:** The page lacks the "premium" feel of the homepage.

- **Background:** Uses a plain white/grey background. lacks the "Plus Grid" pattern or gradients.
- **Header:** Uses a distinct `ShopHeader` which may not match the global navigation standards.
  **Recommendation:**
- Add the branding "Plus Grid" pattern to the page header background.
- Ensure buttons use the new Electric Blue (`#2558fa`).

### 🟡 Issue 3: Inconsistent Components

**Observation:** The icons and buttons in the filter panel feel utilitarian.
**Recommendation:** Refine `ShopControls` and `ShopFiltersPanel` to use softer borders, consistent shadow-sm effects, and high-quality Lucide icons (as requested).

## 3. Action Plan

1.  **Structural Fix:** Add `<SiteFooter />` to `components/shop/shop-page-client.tsx`.
2.  **Visual Overhaul:**
    - Add the **Brand Pattern** background to the top section.
    - Update the page title ("Browse Korean Vehicles...") to use the clearer typography and spacing defined in the Style Guide.
    - Refine the `ShopHeader` to match global nav or replace it if redundant.
3.  **Component Polish:**
    - Update `ListingCardWithDealer` to match the improved `CarListingCard` style if different.
    - Ensure "Load More" and Filter buttons use the correct brand variants.

## 4. Technical Details to Preserve

- **Filters:** Extensive client/server filtering logic exists (Price, Year, Port). **Do not break this.**
- **SEO:** Structured data (`breadcrumbSchema`, `collectionSchema`) is correctly implemented. **Maintain this.**
