# SK AutoSphere - Complete Application Overview

> **Purpose:** Comprehensive guide for UI/UX enhancement planning  
> **Last Updated:** December 8, 2025  
> **Status:** Production-Ready (Phase 1 Complete)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Application Architecture](#application-architecture)
3. [User Roles & Journeys](#user-roles--journeys)
4. [Page-by-Page Breakdown](#page-by-page-breakdown)
5. [AI Features](#ai-features)
6. [Component Library](#component-library)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Current Design Patterns](#current-design-patterns)
10. [UI/UX Enhancement Priorities](#uiux-enhancement-priorities)

---

## Executive Summary

### What is SK AutoSphere?

**SK AutoSphere** is an AI-first Korean vehicle export marketplace connecting Korean dealers with African buyers. It's a B2B2C platform specializing in the Korea → Africa vehicle export flow.

### Tech Stack

| Layer              | Technology                             |
| ------------------ | -------------------------------------- |
| **Framework**      | Next.js 15 (App Router)                |
| **Styling**        | Tailwind CSS v4 + shadcn/ui (New York) |
| **Database**       | Supabase (PostgreSQL)                  |
| **Authentication** | Supabase Auth                          |
| **Payments**       | Stripe (Checkout + Escrow)             |
| **AI**             | Google Gemini API                      |
| **Icons**          | Lucide React                           |
| **Theme**          | next-themes (Light/Dark)               |
| **Language**       | TypeScript                             |

### Key Differentiators

1. **AI-Powered Features** - Condition reports, pricing, smart matching
2. **Export-Focused** - Built for international vehicle shipping
3. **Multi-Language** - EN, KO, FR, SW support
4. **Trust System** - Dealer verification, trust scores
5. **Escrow Payments** - Secure transaction flow

---

## Application Architecture

### Directory Structure

```
app/
├── page.tsx                    # Homepage (landing page)
├── layout.tsx                  # Root layout with providers
├── globals.css                 # Global styles & CSS variables
│
├── shop/                       # Vehicle marketplace
│   ├── page.tsx               # Main shop grid
│   ├── body-type/[type]/      # Filter by body type
│   └── port/[port]/           # Filter by destination port
│
├── listings/
│   └── [id]/                  # Individual vehicle detail page
│
├── find-vehicle/              # AI-powered vehicle finder
│
├── dealers/                   # Dealer directory
│
├── resources/                 # Knowledge hub
│   ├── buyer-guides/          # Guides for buyers
│   └── seller-guides/         # Guides for sellers
│
├── checkout/                  # Payment flow
│   ├── [listingId]/          # Checkout for specific vehicle
│   ├── success/              # Payment success
│   ├── cancel/               # Payment cancelled
│   └── error/                # Payment error
│
├── auth/                      # Authentication
│   ├── login/
│   ├── register/
│   ├── logout/
│   ├── callback/
│   └── error/
│
├── dealer/                    # Dealer portal
│   ├── dashboard/            # Dealer dashboard
│   ├── listings/             # Manage listings
│   │   ├── new/             # Create listing
│   │   └── [id]/edit/       # Edit listing
│   └── imports/              # Import management
│
├── buyer/                     # Buyer portal
│   └── dashboard/            # Buyer dashboard
│
├── admin/                     # Admin back-office
│   ├── login/                # Admin authentication
│   ├── dashboard/            # Admin overview
│   ├── listings/             # Manage all listings
│   ├── dealers/              # Manage dealers
│   ├── payments/             # Payment management
│   ├── exports/              # Export management
│   ├── audit-logs/           # System audit logs
│   └── settings/             # Platform settings
│
├── membership/               # Membership/subscription
├── notifications/            # User notifications
├── orders/                   # Order history
│
└── api/                      # API routes
    ├── ai/                   # AI endpoints
    ├── admin/                # Admin endpoints
    ├── dealer/               # Dealer endpoints
    ├── listings/             # Listing CRUD
    ├── stripe/               # Payment webhooks
    └── ...
```

---

## User Roles & Journeys

### 1. Buyer (African Importer)

**Goal:** Find and purchase Korean vehicles for import

**Journey:**

```
Homepage → Browse Cars (/shop) → Filter by port/type → View Listing →
AI Condition Report → Contact Dealer → Reserve/Pay → Track Order
```

**Key Pages:**

- `/shop` - Browse all vehicles
- `/listings/[id]` - Vehicle details
- `/find-vehicle` - AI-powered search
- `/checkout/[id]` - Payment
- `/buyer/dashboard` - Order tracking
- `/resources/buyer-guides` - Educational content

**Features Available:**

- Advanced filtering (brand, price, port, body type)
- AI condition reports
- Export cost estimator
- Dealer trust scores
- Secure escrow payments
- Multi-language support

---

### 2. Dealer (Korean Exporter)

**Goal:** List vehicles and connect with international buyers

**Journey:**

```
Login → Dealer Dashboard → Create Listing → AI Enhancement →
Manage Inquiries → Process Orders → Track Exports
```

**Key Pages:**

- `/dealer/dashboard` - Overview & analytics
- `/dealer/listings` - Manage inventory
- `/dealer/listings/new` - Create new listing
- `/dealer/imports` - Import management
- `/resources/seller-guides` - Seller education

**Features Available:**

- Smart listing generator (AI)
- Dynamic pricing recommendations
- Listing quality checker
- Buyer match engine
- Export document management
- Analytics dashboard

---

### 3. Admin (Platform Operator)

**Goal:** Manage platform, dealers, and transactions

**Journey:**

```
Admin Login → Dashboard → Review Listings → Verify Dealers →
Monitor Payments → Handle Exports → View Analytics
```

**Key Pages:**

- `/admin/login` - Secure admin authentication
- `/admin/dashboard` - Platform overview
- `/admin/listings` - All listings management
- `/admin/dealers` - Dealer verification
- `/admin/payments` - Transaction monitoring
- `/admin/exports` - Export workflow
- `/admin/audit-logs` - System activity
- `/admin/settings` - Platform configuration

**Features Available:**

- Listing approval/rejection
- Dealer verification
- Payment oversight
- Export tracking
- Audit logging
- Platform settings

---

## Page-by-Page Breakdown

### Public Pages

| Page                  | Route                        | Purpose                      | Key Components                                          |
| --------------------- | ---------------------------- | ---------------------------- | ------------------------------------------------------- |
| **Homepage**          | `/`                          | Landing page, role selection | Hero, TrustStrip, RoleSelector, MarketplaceShop preview |
| **Shop**              | `/shop`                      | Vehicle marketplace          | ShopFilters, ShopGrid, ListingCard, Pagination          |
| **Shop by Body Type** | `/shop/body-type/[type]`     | Filtered by SUV, Sedan, etc. | Same as Shop                                            |
| **Shop by Port**      | `/shop/port/[port]`          | Filtered by destination      | Same as Shop                                            |
| **Vehicle Detail**    | `/listings/[id]`             | Full vehicle info            | ImageGallery, Specs, ConditionReport, DealerInfo        |
| **AI Finder**         | `/find-vehicle`              | Natural language search      | Chat interface, AI matching                             |
| **Dealers**           | `/dealers`                   | Dealer directory             | DealerCard, TrustScore, Filters                         |
| **Resources Hub**     | `/resources`                 | Knowledge center             | Tabs, GuideCards, FAQ                                   |
| **Buyer Guides**      | `/resources/buyer-guides/*`  | Educational articles         | ArticleHero, TableOfContents                            |
| **Seller Guides**     | `/resources/seller-guides/*` | Dealer education             | ArticleHero, StepCards                                  |

### Authenticated Pages

| Page                 | Route                        | Role   | Purpose                        |
| -------------------- | ---------------------------- | ------ | ------------------------------ |
| **Login**            | `/auth/login`                | All    | User authentication            |
| **Register**         | `/auth/register`             | All    | Account creation               |
| **Buyer Dashboard**  | `/buyer/dashboard`           | Buyer  | Order tracking, saved vehicles |
| **Dealer Dashboard** | `/dealer/dashboard`          | Dealer | Analytics, listings overview   |
| **Create Listing**   | `/dealer/listings/new`       | Dealer | Add new vehicle                |
| **Edit Listing**     | `/dealer/listings/[id]/edit` | Dealer | Modify listing                 |
| **Checkout**         | `/checkout/[listingId]`      | Buyer  | Payment flow                   |
| **Orders**           | `/orders`                    | Buyer  | Order history                  |
| **Notifications**    | `/notifications`             | All    | System notifications           |

### Admin Pages (Protected)

| Page            | Route               | Purpose                 |
| --------------- | ------------------- | ----------------------- |
| **Admin Login** | `/admin/login`      | Secure authentication   |
| **Dashboard**   | `/admin/dashboard`  | Platform metrics        |
| **Listings**    | `/admin/listings`   | Approve/reject listings |
| **Dealers**     | `/admin/dealers`    | Verify dealers          |
| **Payments**    | `/admin/payments`   | Transaction management  |
| **Exports**     | `/admin/exports`    | Shipping workflow       |
| **Audit Logs**  | `/admin/audit-logs` | Activity tracking       |
| **Settings**    | `/admin/settings`   | Platform configuration  |

---

## AI Features

### 1. AI Condition Report

**Location:** `/components/ai/condition-report.tsx`  
**API:** `/api/ai/condition-report`  
**Purpose:** Analyze vehicle images to generate condition assessment

**Features:**

- Overall condition score (1-10)
- Exterior/Interior/Mechanical ratings
- Issue detection
- Confidence levels
- Recommendations

---

### 2. Smart Listing Generator

**Location:** `/components/ai/smart-listing-generator.tsx`  
**API:** `/api/ai/generate-listing`  
**Purpose:** Auto-generate listing descriptions from basic info

**Features:**

- Title generation
- Description writing
- Feature highlighting
- SEO optimization
- Multi-language output

---

### 3. Dynamic Pricing Recommendation

**Location:** `/components/ai/dynamic-pricing-recommendation.tsx`  
**API:** `/api/ai/pricing`  
**Purpose:** Suggest optimal pricing based on market data

**Features:**

- Market comparison
- Price range suggestion
- Demand indicators
- Competitive analysis

---

### 4. Export Cost Estimator

**Location:** `/components/ai/export-cost-estimator.tsx`  
**Purpose:** Calculate total landed cost for buyers

**Features:**

- Shipping cost by port
- Import duties estimation
- Insurance calculation
- Total cost breakdown

---

### 5. Buyer Match Engine

**Location:** `/components/ai/buyer-match-engine.tsx`  
**Purpose:** Match listings to potential buyers

**Features:**

- Preference matching
- Buyer scoring
- Notification triggers

---

### 6. Listing Quality Check

**Location:** `/components/ai/ListingQualityCheck.tsx`  
**Purpose:** Score listing completeness and quality

**Features:**

- Completeness score
- Image quality check
- Description analysis
- Improvement suggestions

---

### 7. Trust Score System

**Location:** `/components/ai/trust-score-badge.tsx`, `trust-score-detail.tsx`  
**Purpose:** Display dealer trustworthiness

**Features:**

- Overall trust score
- Verification status
- Review aggregation
- Transaction history

---

### 8. Listing Translator

**Location:** `/components/ai/listing-translator.tsx`  
**API:** `/api/ai/translate`  
**Purpose:** Translate listings to multiple languages

**Features:**

- EN, KO, FR, SW support
- Context-aware translation
- Automotive terminology

---

### 9. Market Insights Dashboard

**Location:** `/components/ai/market-insights-dashboard.tsx`  
**Purpose:** Analytics and trends for dealers

**Features:**

- Market trends
- Demand forecasting
- Competitive positioning

---

### 10. SK Auto Copilot

**Location:** `/components/sk-auto-copilot.tsx`  
**API:** `/api/ai/chat`  
**Purpose:** AI chat assistant for users

**Features:**

- Natural language queries
- Vehicle recommendations
- Process guidance
- FAQ answers

---

## Component Library

### UI Components (shadcn/ui)

**57 components** in `/components/ui/`:

| Category         | Components                                                         |
| ---------------- | ------------------------------------------------------------------ |
| **Layout**       | Card, Separator, Aspect Ratio, Scroll Area, Resizable              |
| **Navigation**   | Tabs, Navigation Menu, Breadcrumb, Pagination, Sidebar             |
| **Forms**        | Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Calendar |
| **Feedback**     | Alert, Toast, Sonner, Progress, Skeleton, Spinner                  |
| **Overlay**      | Dialog, Sheet, Drawer, Popover, Tooltip, Hover Card                |
| **Data Display** | Table, Badge, Avatar, Chart                                        |
| **Actions**      | Button, Button Group, Toggle, Toggle Group, Dropdown Menu          |

### Custom Components

| Component               | Location                                | Purpose                 |
| ----------------------- | --------------------------------------- | ----------------------- |
| **SKAutoCopilot**       | `/components/sk-auto-copilot.tsx`       | AI chat widget          |
| **TrustStrip**          | `/components/trust-strip.tsx`           | Trust indicators banner |
| **RoleSelector**        | `/components/role-selector.tsx`         | Buyer/Seller toggle     |
| **LanguageSelector**    | `/components/language-selector.tsx`     | i18n switcher           |
| **VerifiedDealerBadge** | `/components/verified-dealer-badge.tsx` | Dealer verification     |
| **SiteHeader**          | `/components/site-header.tsx`           | Global navigation       |
| **ConnectivityBanner**  | `/components/connectivity-banner.tsx`   | Offline indicator       |

### Shop Components

| Component                 | Purpose              |
| ------------------------- | -------------------- |
| **ShopPageClient**        | Main shop logic      |
| **ShopFilters**           | Filter sidebar       |
| **ShopGrid**              | Listing grid         |
| **ShopControls**          | Sort/view controls   |
| **ListingCardWithDealer** | Vehicle card         |
| **CategoryNav**           | Body type navigation |
| **PortPresetButtons**     | Quick port filters   |

### Checkout Components

| Component             | Purpose              |
| --------------------- | -------------------- |
| **StripePaymentForm** | Payment input        |
| **EscrowCheckout**    | Escrow flow          |
| **OrderSummary**      | Order details        |
| **PaymentResult**     | Success/error states |

---

## Database Schema

### Core Tables

```sql
-- Users (buyers, dealers, admins)
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  phone TEXT,
  whatsapp TEXT,
  role TEXT CHECK (role IN ('buyer', 'dealer', 'admin')),
  verified BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Dealers (business profiles)
dealers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  business_name TEXT,
  description TEXT,
  logo_url TEXT,
  rating DECIMAL(2,1),
  review_count INT,
  verified BOOLEAN,
  location TEXT,
  active_listings INT,
  sold_vehicles INT
)

-- Car Listings
car_listings (
  id UUID PRIMARY KEY,
  dealer_id UUID REFERENCES dealers,
  title TEXT,
  brand TEXT,
  model TEXT,
  year INT,
  price DECIMAL(10,2),
  currency TEXT,
  mileage INT,
  body_type TEXT,
  transmission TEXT,
  fuel_type TEXT,
  condition TEXT,
  location TEXT,
  destination_port TEXT,
  images JSONB,
  specifications JSONB,
  status TEXT CHECK (status IN ('pending', 'active', 'sold', 'rejected')),
  featured BOOLEAN,
  views INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Additional Tables (from migrations)

- `audit_logs` - System activity tracking
- `transactions` - Payment records
- `notifications` - User notifications
- `ai_condition_reports` - AI analysis results
- `memberships` - Subscription plans

---

## API Endpoints

### AI Endpoints (`/api/ai/`)

| Endpoint                   | Method | Purpose                    |
| -------------------------- | ------ | -------------------------- |
| `/api/ai/chat`             | POST   | Copilot conversations      |
| `/api/ai/condition-report` | POST   | Vehicle analysis           |
| `/api/ai/generate-listing` | POST   | Auto-generate content      |
| `/api/ai/pricing`          | POST   | Price recommendations      |
| `/api/ai/translate`        | POST   | Multi-language translation |
| `/api/ai/status`           | GET    | AI service health          |

### Listing Endpoints (`/api/listings/`)

| Endpoint             | Method | Purpose            |
| -------------------- | ------ | ------------------ |
| `/api/listings`      | GET    | List all vehicles  |
| `/api/listings`      | POST   | Create listing     |
| `/api/listings/[id]` | GET    | Get single listing |
| `/api/listings/[id]` | PUT    | Update listing     |
| `/api/listings/[id]` | DELETE | Delete listing     |

### Admin Endpoints (`/api/admin/`)

| Endpoint              | Method  | Purpose           |
| --------------------- | ------- | ----------------- |
| `/api/admin/stats`    | GET     | Dashboard metrics |
| `/api/admin/listings` | GET/PUT | Manage listings   |
| `/api/admin/dealers`  | GET/PUT | Manage dealers    |

### Payment Endpoints (`/api/stripe/`)

| Endpoint               | Method  | Purpose                 |
| ---------------------- | ------- | ----------------------- |
| `/api/stripe/checkout` | POST    | Create checkout session |
| `/api/stripe/webhook`  | POST    | Handle Stripe events    |
| `/api/escrow/*`        | Various | Escrow management       |

---

## Current Design Patterns

### Visual Style

| Element           | Current Implementation                |
| ----------------- | ------------------------------------- |
| **Primary Color** | Blue (`oklch(0.52 0.19 252)`)         |
| **Accent Color**  | Purple (`oklch(0.58 0.18 285)`)       |
| **Background**    | Off-white with subtle gradient        |
| **Cards**         | White with subtle borders, rounded-lg |
| **Buttons**       | Rounded-md, primary blue              |
| **Typography**    | System fonts, clear hierarchy         |

### Layout Patterns

| Pattern           | Usage                                            |
| ----------------- | ------------------------------------------------ |
| **Container**     | `container mx-auto px-4`                         |
| **Grid**          | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` |
| **Spacing**       | 4/6/8/12/16 scale                                |
| **Hero Sections** | Blue gradient with grid pattern                  |

### Interaction Patterns

| Pattern         | Implementation                         |
| --------------- | -------------------------------------- |
| **Hover**       | `hover:shadow-lg hover:-translate-y-1` |
| **Focus**       | Ring with primary color                |
| **Loading**     | Skeleton components                    |
| **Transitions** | `transition-all duration-300`          |

---

## UI/UX Enhancement Priorities

### High Priority (Immediate Impact)

| Area                  | Current State        | Recommended Enhancement        |
| --------------------- | -------------------- | ------------------------------ |
| **Homepage**          | Long, many sections  | Streamline, improve hero CTA   |
| **Shop Page**         | Functional but basic | Enhanced filters, better cards |
| **Listing Detail**    | Information-dense    | Better visual hierarchy        |
| **Mobile Navigation** | Basic hamburger      | Improved mobile UX             |
| **Loading States**    | Basic skeletons      | Branded loading experience     |

### Medium Priority (User Experience)

| Area                 | Current State  | Recommended Enhancement           |
| -------------------- | -------------- | --------------------------------- |
| **Dealer Dashboard** | Functional     | Better analytics visualization    |
| **Checkout Flow**    | Multi-step     | Progress indicator, clearer steps |
| **Search**           | Basic          | Autocomplete, suggestions         |
| **Filters**          | Sidebar        | Mobile-friendly drawer            |
| **Image Gallery**    | Basic carousel | Zoom, thumbnails, fullscreen      |

### Lower Priority (Polish)

| Area             | Current State | Recommended Enhancement  |
| ---------------- | ------------- | ------------------------ |
| **Animations**   | Minimal       | Micro-interactions       |
| **Empty States** | Basic         | Illustrated, actionable  |
| **Error Pages**  | Default       | Branded, helpful         |
| **Onboarding**   | None          | First-time user guidance |
| **Dark Mode**    | Supported     | Refinement needed        |

---

## Pages Requiring UI/UX Work

### Tier 1: Core User Journey

1. **Homepage** (`/`) - 51KB, needs streamlining
2. **Shop** (`/shop`) - Core marketplace experience
3. **Listing Detail** (`/listings/[id]`) - Conversion page
4. **Checkout** (`/checkout`) - Payment flow

### Tier 2: User Portals

5. **Dealer Dashboard** (`/dealer/dashboard`)
6. **Buyer Dashboard** (`/buyer/dashboard`)
7. **Create Listing** (`/dealer/listings/new`)

### Tier 3: Discovery & Trust

8. **Dealers Directory** (`/dealers`)
9. **Resources Hub** (`/resources`) - Recently enhanced
10. **AI Finder** (`/find-vehicle`)

### Tier 4: Admin & Settings

11. **Admin Dashboard** (`/admin/dashboard`)
12. **Admin Listings** (`/admin/listings`)
13. **Settings** (`/admin/settings`)

---

## Quick Reference: File Sizes

| Page         | Size          | Complexity                |
| ------------ | ------------- | ------------------------- |
| Homepage     | 51KB          | High (many sections)      |
| Shop         | 18KB (client) | Medium                    |
| Resources    | 20KB          | Medium (recently updated) |
| Dealers      | 8KB           | Low                       |
| Find Vehicle | 4KB           | Low                       |
| Checkout     | 4KB           | Low                       |

---

## Next Steps for UI/UX Enhancement

1. **Review this document** to understand the full scope
2. **Prioritize pages** based on user impact
3. **Create wireframes** for major changes
4. **Update STYLE-GUIDE.md** if design direction changes
5. **Implement incrementally** - one page at a time
6. **Test on mobile** - ensure responsive design
7. **Gather feedback** - iterate based on user input

---

_This document should be updated as the application evolves._
