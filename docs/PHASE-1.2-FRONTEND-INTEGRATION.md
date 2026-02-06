# Phase 1.2 - Frontend Integration (Read-Only)

**Completed:** November 25, 2025  
**Status:** ✅ Complete

---

## Overview

This phase wired the frontend Shop and Listing Detail pages to use the backend API endpoints created in Phase 1.1, with graceful fallback to mock data if the API fails.

---

## What Was Implemented

### 1. API Client Layer

**File:** `lib/api/listings.ts`

Created a centralized API client for fetching listings:

```typescript
// Fetch multiple listings with filters
fetchListings(filters: ListingFilters): Promise<PaginatedListings>

// Fetch single listing by ID
fetchListingById(id: string): Promise<CarListing | null>
```

**Features:**

- Server-side fetch with 60-second cache (`next: { revalidate: 60 }`)
- Automatic fallback to mock data on API failure
- Type-safe response handling
- Works in both server and client contexts

---

### 2. Shop Page Refactor

**Files Changed:**

- `app/shop/page.tsx` - Converted to async Server Component
- `components/shop/shop-page-client.tsx` - New client component for interactivity

**Architecture:**

```
app/shop/page.tsx (Server Component)
    ↓ fetches data
    ↓ passes to
components/shop/shop-page-client.tsx (Client Component)
    ↓ handles
    - Search/filter UI
    - Sorting
    - Pagination
    - URL query param sync
```

**Supported Query Parameters:**
| Parameter | Example | Description |
|-----------|---------|-------------|
| `brand` | `?brand=Hyundai` | Filter by car brand |
| `bodyType` | `?bodyType=suv` | Filter by body type |
| `destinationPort` | `?destinationPort=lagos` | Filter by destination port |
| `page` | `?page=2` | Pagination |
| `pageSize` | `?pageSize=20` | Items per page |

**Example URLs:**

```
/shop
/shop?brand=Hyundai
/shop?brand=Kia&bodyType=suv
/shop?destinationPort=lagos&brand=Hyundai
```

---

### 3. Listing Detail Page

**Files Created:**

- `app/listings/[id]/page.tsx` - Server Component with SEO
- `app/listings/[id]/not-found.tsx` - 404 page
- `components/listings/listing-detail-client.tsx` - Detail page UI

**Features:**

- Dynamic SEO metadata generation
- Schema.org structured data for vehicles
- Image gallery with navigation
- Seller information card
- Specifications table
- Features list
- Destination ports display
- AI components integration (condition report, export estimator, trust score)
- Mobile-responsive design with sticky action buttons

**SEO Implementation:**

```typescript
// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const listing = await fetchListingById(id)
  return {
    title: `${listing.title} | SK AutoSphere`,
    description: `${listing.year} ${listing.make} ${listing.model}...`,
    openGraph: { ... },
    twitter: { ... },
  }
}

// Schema.org Vehicle structured data
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Vehicle",
  name: listing.title,
  brand: { "@type": "Brand", name: listing.make },
  // ...
}
```

---

### 4. Fallback Strategy

Both pages implement graceful degradation:

```typescript
try {
  // Attempt API fetch
  const response = await fetch(`/api/listings`);
  return response.json();
} catch (error) {
  console.error("API failed, using mock data:", error);
  // Return mock data instead
  return getMockListings(filters);
}
```

**Mock Data Source:** `lib/mock-shop-data.ts` (8 Korean vehicle listings)

---

## File Structure

```
lib/
├── api/
│   └── listings.ts              ← NEW: API client with fallback
├── mock-shop-data.ts            ← Existing mock data (fallback source)

app/
├── shop/
│   └── page.tsx                 ← MODIFIED: Now async server component
├── listings/
│   └── [id]/
│       ├── page.tsx             ← NEW: Detail page server component
│       └── not-found.tsx        ← NEW: 404 page

components/
├── shop/
│   └── shop-page-client.tsx     ← NEW: Shop page client component
├── listings/
│   └── listing-detail-client.tsx ← NEW: Detail page client component
```

---

## Testing

### Manual Testing

1. **Shop Page - API Data:**

   ```
   http://localhost:3000/shop
   ```

   Should display listings from API (or mock fallback)

2. **Shop Page - Filtered:**

   ```
   http://localhost:3000/shop?brand=Hyundai
   http://localhost:3000/shop?bodyType=suv
   ```

3. **Detail Page - Mock ID:**

   ```
   http://localhost:3000/listings/1
   ```

   Uses mock data (ID "1" exists in mock-shop-data.ts)

4. **Detail Page - Database ID:**

   ```
   http://localhost:3000/listings/c1111111-1111-1111-1111-111111111111
   ```

   Uses API data (requires database to be seeded)

5. **Detail Page - Not Found:**
   ```
   http://localhost:3000/listings/nonexistent-id
   ```
   Should show 404 page

### API Testing

```bash
# List all listings
curl http://localhost:3000/api/listings

# Filter by brand
curl "http://localhost:3000/api/listings?brand=Hyundai"

# Get single listing
curl http://localhost:3000/api/listings/c1111111-1111-1111-1111-111111111111
```

---

## Known Limitations

1. **Client-side filtering:** Advanced filters (price range, year range, transmission, fuel type) are applied client-side after initial API fetch. This works well for small datasets but may need server-side implementation for large catalogs.

2. **WhatsApp contact:** The "Contact Seller" button is not yet wired to WhatsApp. Requires adding `whatsapp` field to Dealer type and database.

3. **Favorites:** Toggle favorite is logged to console only. Requires user authentication (Phase 1.4) to persist.

4. **Similar cars:** The detail page doesn't yet fetch similar cars from API. Currently shows nothing (removed hardcoded data).

---

## Dependencies

No new dependencies added. Uses existing:

- Next.js 15 App Router
- TypeScript
- Existing UI components (shadcn/ui)
- Existing mock data structures

---

## Next Steps (TODO for Future Work)

See the TODO list below for Phase 1.3 and beyond.

---

# TODO List for Future LLM Sessions

## Phase 1.3 - Enhanced Frontend Features

### High Priority

- [ ] **Server-side filtering:** Move price/year/transmission filters to API query params for better performance with large datasets
- [ ] **Similar cars API:** Create endpoint and integrate into detail page
- [ ] **Image optimization:** Replace `<img>` tags with Next.js `<Image>` component for better performance
- [ ] **Loading states:** Add Suspense boundaries and loading.tsx files for better UX

### Medium Priority

- [ ] **WhatsApp integration:**
  - Add `phone` and `whatsapp` fields to Dealer type in `types.ts`
  - Update database schema and seed data
  - Wire "Contact Seller" button to open WhatsApp
- [ ] **Share functionality:** Implement share button with Web Share API fallback
- [ ] **Breadcrumbs component:** Create reusable breadcrumb component for SEO
- [ ] **URL state sync:** Sync all filter states to URL for shareable filtered views

### Low Priority

- [ ] **Infinite scroll:** Replace "Load More" with infinite scroll option
- [ ] **View count display:** Show real view counts from API
- [ ] **Recently viewed:** Track and display recently viewed listings (localStorage)

---

## Phase 1.4 - Authentication

- [ ] **Supabase Auth integration:** Set up authentication with Supabase
- [ ] **User registration/login:** Create auth pages and flows
- [ ] **Protected routes:** Middleware for dealer/admin routes
- [ ] **Favorites persistence:** Save favorites to database per user
- [ ] **Session management:** Handle auth state across the app

---

## Phase 1.5 - Write Operations

- [ ] **Create listing API:** `POST /api/listings`
- [ ] **Update listing API:** `PATCH /api/listings/[id]`
- [ ] **Delete listing API:** `DELETE /api/listings/[id]`
- [ ] **Dealer dashboard:** CRUD interface for dealers to manage listings
- [ ] **Image upload:** Integrate with Supabase Storage for listing images
- [ ] **Form validation:** Zod schemas for listing creation/updates

---

## Phase 1.6 - Search & Discovery

- [ ] **Full-text search:** Implement search across title, description, features
- [ ] **Saved searches:** Allow users to save and get alerts for searches
- [ ] **Search suggestions:** Autocomplete for makes, models, locations
- [ ] **Advanced filters UI:** Collapsible filter sections, clear all button

---

## Future Phases

### Payments (Stripe)

- [ ] Reservation payment flow
- [ ] Payment status tracking
- [ ] Refund handling

### AI Features

- [ ] AI condition report from images
- [ ] Price recommendation engine
- [ ] Fraud detection scoring

### Export/Shipping

- [ ] Shipping cost calculator
- [ ] Port selection and tracking
- [ ] Document checklist generator

---

## Code Quality TODOs

- [ ] **Remove backup files:** Delete `car-detail-page.tsx` from root (now in components)
- [ ] **Type improvements:** Add stricter types for API responses
- [ ] **Error boundaries:** Add error.tsx files for graceful error handling
- [ ] **Unit tests:** Add tests for API client functions
- [ ] **E2E tests:** Playwright tests for critical user flows

---

## Database TODOs

- [ ] **Run seed script:** Execute `docs/database-setup.sql` in Supabase if not done
- [ ] **Add indexes:** Create indexes for common query patterns (brand, body_type, status)
- [ ] **RLS policies:** Enable Row Level Security when auth is implemented

---

## Environment Variables Required

```env
# Already configured
NEXT_PUBLIC_SUPABASE_URL=https://ocunqereputrqcblpzvu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Optional - for absolute URL generation
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Quick Reference

### Key Files to Know

| Purpose       | File Path                                                        |
| ------------- | ---------------------------------------------------------------- |
| API client    | `lib/api/listings.ts`                                            |
| Shop page     | `app/shop/page.tsx`                                              |
| Shop client   | `components/shop/shop-page-client.tsx`                           |
| Detail page   | `app/listings/[id]/page.tsx`                                     |
| Detail client | `components/listings/listing-detail-client.tsx`                  |
| Mock data     | `lib/mock-shop-data.ts`                                          |
| Types         | `types.ts` and `types/database.ts`                               |
| API routes    | `app/api/listings/route.ts` and `app/api/listings/[id]/route.ts` |
| DB schema     | `docs/database-setup.sql`                                        |

### Commands

```bash
# Development
npm run dev

# Build
npm run build

# Test API
curl http://localhost:3000/api/listings
```

---

**End of Phase 1.2 Handover**
