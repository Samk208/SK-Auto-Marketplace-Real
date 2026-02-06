# Project Overview: SK AutoSphere

## Business Model

**Korea → Africa Automotive Bridge**

- **Sellers**: 200+ Korean used car dealers
- **Buyers**: 8,500+ qualified African buyers
- **Markets**: Ghana, Nigeria, Kenya, Tanzania, South Africa
- **Unique Value**: Cross-border automotive marketplace with trust layer

## Key Features (MVP - Phase 1)

1. **Multi-Vendor System**
   - Dealer registration with KYB verification
   - Individual dealer dashboards
   - Commission tracking (10% platform fee)

2. **Vehicle Listings**
   - Enhanced schema (VIN, specs, condition, history)
   - Multiple images per listing
   - Advanced search/filtering
   - Analytics (views, inquiries)

3. **Admin Dashboard**
   - Dealer approval workflow
   - Listing moderation (approve/reject)
   - Platform statistics
   - Audit logging

4. **Buyer Experience**
   - Browse vehicles by make/model/price/year
   - Submit inquiries to dealers
   - Track inquiry status
   - Multi-currency support (KRW/USD)

5. **Security & Compliance**
   - Supabase Auth with RLS
   - Role-based access (admin/dealer/buyer)
   - Audit trail for all actions
   - GDPR-compliant data handling

## Tech Stack

### Frontend

```typescript
{
  framework: "Next.js 14 (App Router)",
  language: "TypeScript (strict mode)",
  styling: "Tailwind CSS",
  components: "React Server Components + Client Components",
  forms: "React Hook Form",
  validation: "Zod",
  ui: "shadcn/ui (optional)",
}
```

### Backend

```typescript
{
  framework: "Next.js 14 API Routes",
  database: "PostgreSQL (Supabase)",
  orm: "Supabase Client (no separate ORM)",
  auth: "Supabase Auth (SSR)",
  storage: "Supabase Storage",
  realtime: "Supabase Realtime",
}
```

### Infrastructure

```typescript
{
  hosting: "Vercel (recommended for Next.js)",
  database: "Supabase (managed PostgreSQL)",
  cdn: "Vercel Edge Network",
  monitoring: "Vercel Analytics + Supabase Logs",
  email: "Resend (already integrated)",
}
```
