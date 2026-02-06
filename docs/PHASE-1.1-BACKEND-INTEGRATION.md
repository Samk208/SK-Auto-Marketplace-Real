# Phase 1.1 - Backend Integration Handover

**Date**: November 25, 2025
**Status**: ✅ Complete
**Developer**: Backend Integration Team
**Next Phase**: Phase 1.2 - Frontend Integration & Database Setup

---

## Executive Summary

Phase 1.1 implements the foundational backend infrastructure for SK AutoSphere, including:

- ✅ Server-side Supabase client setup
- ✅ Database type definitions
- ✅ Data access layer (repository pattern)
- ✅ Two read-only API endpoints for car listings
- ✅ Consistent error handling and response format

**No frontend changes were made** - the application continues to work with mock data.

---

## What Was Implemented

### 1. Server-Side Supabase Client

**File**: `lib/supabase-server.ts`

**Purpose**: Secure server-side database client for API routes and Server Components

**Key Features**:

- Uses `SUPABASE_SERVICE_ROLE_KEY` (admin privileges, bypasses RLS)
- Typed with database schema for full TypeScript support
- Server-only module (never import in client components)
- Singleton instance for performance

**Usage Example**:

```typescript
import { supabaseServer } from "@/lib/supabase-server";

const { data, error } = await supabaseServer.from("car_listings").select("*");
```

**⚠️ Security Note**: This client bypasses Row Level Security. Use only in API routes and server components.

---

### 2. Database Type Definitions

**File**: `types/database.ts`

**Purpose**: TypeScript types matching the PostgreSQL schema

**Tables Defined**:

- `car_listings` - Vehicle inventory with images (JSONB), specifications (JSONB)
- `dealers` - Dealer/seller information
- `users` - User accounts (buyers, dealers, admins)

**Type Categories**:

- `Row` - Reading from database
- `Insert` - Creating new records
- `Update` - Updating existing records

**Note**: These types were manually created based on `HANDOVER-TO-BACKEND.md`. In production, generate automatically:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
```

---

### 3. Data Access Layer (Repository)

**File**: `lib/repositories/listings.ts`

**Purpose**: Abstraction layer between database and API routes

**Functions**:

#### `getActiveListings(filters)`

Fetch paginated listings with optional filters

**Parameters**:

```typescript
{
  brand?: string              // e.g., "Toyota"
  bodyType?: string          // e.g., "sedan", "suv"
  destinationPort?: string   // e.g., "lagos", "mombasa"
  status?: string            // "active" | "pending" | "sold" | "rejected"
  page?: number              // Default: 1
  pageSize?: number          // Default: 20, Max: 100
}
```

**Returns**:

```typescript
{
  items: CarListing[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
```

**Features**:

- Joins with `dealers` table for seller information
- Orders by `created_at DESC` (newest first)
- Maps snake_case DB fields to camelCase frontend types

---

#### `getListingById(id)`

Fetch a single listing by ID

**Parameters**: `id: string` (UUID)

**Returns**: `CarListing | null`

**Features**:

- Joins with `dealers` table
- Returns `null` if not found (caller handles 404)

---

#### `incrementListingViews(id)`

Track listing view count (analytics)

**Parameters**: `id: string`

**Returns**: `void` (fire-and-forget)

**Note**: Non-blocking, doesn't throw errors to avoid slowing down listing fetches

---

#### `mapDbListingToCarListing()`

Internal mapping function

**Purpose**: Convert database rows (snake_case) to frontend CarListing type (camelCase)

**Handles**:

- JSONB parsing for images and specifications
- Field renaming (`brand` → `make`)
- Nested dealer/seller object creation
- Default values for optional fields

---

### 4. API Route: GET /api/listings

**File**: `app/api/listings/route.ts`

**Purpose**: List active car listings with filters and pagination

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `brand` | string | No | - | Filter by brand (e.g., "Toyota") |
| `bodyType` | string | No | - | Filter by body type (sedan, suv, etc.) |
| `destinationPort` | string | No | - | Filter by port (lagos, mombasa, etc.) |
| `status` | string | No | "active" | Listing status |
| `page` | number | No | 1 | Page number (1-indexed) |
| `pageSize` | number | No | 20 | Items per page (max: 100) |

**Response Format**:

**Success (200)**:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "2020 Toyota Land Cruiser",
        "year": 2020,
        "make": "Toyota",
        "model": "Land Cruiser",
        "price": 45000,
        "currency": "USD",
        "location": "Dubai",
        "images": ["url1.jpg", "url2.jpg"],
        "transmission": "Automatic",
        "fuelType": "Diesel",
        "mileage": 50000,
        "mileageUnit": "km",
        "bodyType": "suv",
        "verified": true,
        "destinationPorts": ["lagos"],
        "dealerId": "uuid",
        "seller": {
          "name": "SK Auto Imports",
          "rating": 4.8,
          "totalReviews": 120
        },
        "sellerRating": 4.8,
        "sellerTotalReviews": 120,
        "isReserved": false,
        "isFavorite": false
      }
    ],
    "total": 156,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8
  },
  "error": null
}
```

**Error (400/500)**:

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Page must be greater than 0",
    "code": "INVALID_PAGE"
  }
}
```

**Error Codes**:

- `INVALID_PAGE` - Page number < 1
- `INVALID_PAGE_SIZE` - Page size < 1
- `INVALID_STATUS` - Status not in allowed list
- `INTERNAL_ERROR` - Server/database error

**Example Requests**:

```bash
# All active listings
GET http://localhost:3000/api/listings

# Filter by brand
GET http://localhost:3000/api/listings?brand=Toyota

# Multiple filters + pagination
GET http://localhost:3000/api/listings?brand=Toyota&bodyType=suv&page=2&pageSize=10

# Sold vehicles
GET http://localhost:3000/api/listings?status=sold
```

---

### 5. API Route: GET /api/listings/[id]

**File**: `app/api/listings/[id]/route.ts`

**Purpose**: Get a single listing by ID

**URL Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | UUID | Yes | Listing ID |

**Response Format**:

**Success (200)**:

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "2020 Toyota Land Cruiser"
    // ... full CarListing object
  },
  "error": null
}
```

**Not Found (404)**:

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Listing not found",
    "code": "NOT_FOUND"
  }
}
```

**Bad Request (400)**:

```json
{
  "success": false,
  "data": null,
  "error": {
    "message": "Invalid listing ID format",
    "code": "INVALID_ID"
  }
}
```

**Error Codes**:

- `INVALID_ID` - ID is not a valid UUID
- `NOT_FOUND` - Listing doesn't exist
- `INTERNAL_ERROR` - Server/database error

**Features**:

- UUID validation (rejects malformed IDs early)
- Increments view count asynchronously (non-blocking)
- Joins with dealers table

**Example Requests**:

```bash
GET http://localhost:3000/api/listings/550e8400-e29b-41d4-a716-446655440000
```

---

## File Structure Added

```
SK Now 3/
├── lib/
│   ├── supabase-server.ts          # NEW - Server Supabase client
│   └── repositories/
│       └── listings.ts              # NEW - Listings data access layer
├── types/
│   └── database.ts                  # NEW - Database type definitions
└── app/
    └── api/
        └── listings/
            ├── route.ts             # NEW - GET /api/listings
            └── [id]/
                └── route.ts         # NEW - GET /api/listings/[id]
```

---

## Dependencies Installed

**Package**: `@supabase/supabase-js` (latest)

**Installation command used**:

```bash
npm install @supabase/supabase-js --legacy-peer-deps
```

**Note**: `--legacy-peer-deps` was required due to React 19 compatibility issues with some existing packages (not related to Supabase).

---

## Environment Variables Used

The following environment variables from `.env.local` are now actively used:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://ocunqereputrqcblpzvu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ Important**:

- `NEXT_PUBLIC_SUPABASE_URL` - Safe to expose (public)
- `SUPABASE_SERVICE_ROLE_KEY` - **NEVER** expose to client (server-only)

---

## What You Need to Do Next

### 1. Database Setup in Supabase

**Action Required**: Create the database tables in your Supabase project

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard
2. Select your project: `ocunqereputrqcblpzvu`
3. Navigate to **SQL Editor**
4. Run the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'dealer', 'admin')),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Dealers table
CREATE TABLE dealers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INT DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  location TEXT,
  joined_date TIMESTAMP DEFAULT NOW(),
  active_listings INT DEFAULT 0,
  sold_vehicles INT DEFAULT 0
);

-- Car listings table
CREATE TABLE car_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  mileage INT,
  body_type TEXT,
  transmission TEXT,
  fuel_type TEXT,
  condition TEXT,
  location TEXT,
  destination_port TEXT,
  images JSONB,
  specifications JSONB,
  status TEXT CHECK (status IN ('pending', 'active', 'sold', 'rejected')) DEFAULT 'active',
  featured BOOLEAN DEFAULT false,
  views INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_listings_dealer ON car_listings(dealer_id);
CREATE INDEX idx_listings_status ON car_listings(status);
CREATE INDEX idx_listings_brand ON car_listings(brand);
CREATE INDEX idx_listings_body_type ON car_listings(body_type);
CREATE INDEX idx_listings_destination_port ON car_listings(destination_port);
CREATE INDEX idx_listings_created_at ON car_listings(created_at DESC);

-- Function to increment view count (for incrementListingViews)
CREATE OR REPLACE FUNCTION increment_listing_views(listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE car_listings
  SET views = views + 1
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql;
```

#### Option B: Using Migration Files

Create a migration file in your Supabase CLI setup (if using):

```bash
supabase migration new create_initial_tables
```

Then copy the SQL above into the migration file.

---

### 2. Insert Sample Data

**Action Required**: Add test data to verify the API endpoints work

**Option 1: Using Supabase Dashboard**

1. Go to **Table Editor** in Supabase Dashboard
2. Insert data manually through the UI

**Option 2: SQL Insert Script**

```sql
-- Insert a test user
INSERT INTO users (id, email, password_hash, full_name, role, verified)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'dealer@test.com', 'hash', 'Test Dealer', 'dealer', true);

-- Insert a test dealer
INSERT INTO dealers (id, user_id, business_name, description, rating, review_count, verified, location)
VALUES
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'SK Auto Imports', 'Premium vehicle dealer', 4.8, 120, true, 'Dubai, UAE');

-- Insert test car listings
INSERT INTO car_listings (
  id, dealer_id, title, brand, model, year, price, currency,
  mileage, body_type, transmission, fuel_type, condition,
  location, destination_port, images, specifications, status
)
VALUES
  (
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    '2020 Toyota Land Cruiser V8',
    'Toyota',
    'Land Cruiser',
    2020,
    45000.00,
    'USD',
    50000,
    'suv',
    'Automatic',
    'Diesel',
    'Excellent',
    'Dubai, UAE',
    'lagos',
    '["https://example.com/image1.jpg", "https://example.com/image2.jpg"]'::jsonb,
    '{"trim": "GXR", "features": ["4WD", "Sunroof", "Leather"], "description": "Excellent condition, single owner"}'::jsonb,
    'active'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '22222222-2222-2222-2222-222222222222',
    '2019 Honda Civic EX',
    'Honda',
    'Civic',
    2019,
    18500.00,
    'USD',
    35000,
    'sedan',
    'Automatic',
    'Petrol',
    'Good',
    'Dubai, UAE',
    'mombasa',
    '["https://example.com/civic1.jpg"]'::jsonb,
    '{"trim": "EX", "features": ["Backup Camera", "Bluetooth"]}'::jsonb,
    'active'
  );
```

---

### 3. Test the API Endpoints

**Action Required**: Verify the endpoints are working

#### Start Development Server

```bash
cd "C:\Users\Lenovo\Desktop\SK Now 3"
npm run dev
```

#### Test with Browser

Open these URLs in your browser:

```
http://localhost:3000/api/listings
http://localhost:3000/api/listings?brand=Toyota
http://localhost:3000/api/listings/33333333-3333-3333-3333-333333333333
```

#### Test with cURL

```bash
# List all active listings
curl http://localhost:3000/api/listings

# Filter by brand
curl "http://localhost:3000/api/listings?brand=Toyota"

# Get specific listing
curl http://localhost:3000/api/listings/33333333-3333-3333-3333-333333333333
```

#### Test with Postman/Insomnia

1. Create a new request
2. Method: `GET`
3. URL: `http://localhost:3000/api/listings`
4. Send and verify response format

**Expected Response**:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 2,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1
  },
  "error": null
}
```

---

### 4. (Optional) Migrate Mock Data to Database

**Action**: Convert existing mock data from `data.ts` to database records

Create a migration script: `scripts/migrate-mock-data.ts`

```typescript
import { supabaseServer } from "@/lib/supabase-server";
import { mockListings } from "@/data";
import { dealers } from "@/lib/dealers";

async function migrateMockData() {
  // 1. Insert dealers
  for (const dealer of dealers) {
    // First create user
    const { data: userData } = await supabaseServer
      .from("users")
      .insert({
        email: dealer.email,
        password_hash: "temp_hash",
        full_name: dealer.name,
        phone: dealer.phone,
        whatsapp: dealer.whatsapp,
        role: "dealer",
        verified: dealer.verified,
      })
      .select()
      .single();

    // Then create dealer profile
    if (userData) {
      await supabaseServer.from("dealers").insert({
        user_id: userData.id,
        business_name: dealer.name,
        description: dealer.description,
        rating: dealer.rating,
        review_count: dealer.reviewCount,
        verified: dealer.verified,
        location: dealer.location,
      });
    }
  }

  // 2. Insert listings
  // ... similar process for car_listings

  console.log("Migration complete!");
}

migrateMockData();
```

Run with:

```bash
npx tsx scripts/migrate-mock-data.ts
```

---

### 5. Update TypeScript Configuration (If Needed)

**Check**: Ensure path aliases are configured

In `tsconfig.json`, verify:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

---

## Future Phase Recommendations

### Phase 1.2: Frontend Integration

- Update `app/shop/page.tsx` to fetch from `/api/listings` instead of mock data
- Add loading states and error handling
- Implement SWR or React Query for caching
- Add search/filter UI that calls the API with query params

### Phase 1.3: Write Operations

- `POST /api/listings` - Create new listing (dealers only)
- `PATCH /api/listings/[id]` - Update listing (dealers only)
- `DELETE /api/listings/[id]` - Delete listing (dealers only)

### Phase 1.4: Authentication

- Implement Supabase Auth integration
- Add authentication middleware
- Protect dealer-only endpoints
- Set up Row Level Security (RLS) policies

### Phase 1.5: Advanced Filters

- Search by title/description (full-text search)
- Price range filter
- Year range filter
- Mileage range filter
- Multiple destination ports

---

## Technical Notes & Decisions

### Why Repository Pattern?

- **Separation of Concerns**: Database logic separate from API routes
- **Reusability**: Same functions can be used in API routes, Server Actions, or Server Components
- **Testing**: Easier to mock database calls
- **Refactoring**: Can switch database providers without changing API routes

### Why `as any` Type Assertions?

Supabase's generated types can be overly strict with the query builder. Using `as any` for column names is a pragmatic solution that:

- Allows the code to compile
- Doesn't compromise runtime safety (Supabase validates column names)
- Can be removed once types are auto-generated with `supabase gen types`

### Why Server-Only Client?

- **Security**: Service role key has admin privileges, must never reach the client
- **Performance**: No need for session management or token refresh in API routes
- **Simplicity**: For Phase 1.1, we don't need user-specific RLS yet

### Response Format Convention

All APIs follow the pattern:

```typescript
{
  success: boolean
  data: T | null
  error: { message: string, code?: string } | null
}
```

This makes error handling consistent on the frontend:

```typescript
const response = await fetch("/api/listings");
const json = await response.json();

if (json.success) {
  // Use json.data
} else {
  // Handle json.error
}
```

---

## Troubleshooting

### Issue: "Missing env.SUPABASE_SERVICE_ROLE_KEY"

**Solution**: Check `.env.local` exists and contains the service role key

### Issue: "Table doesn't exist" errors

**Solution**: Run the SQL schema creation script in Supabase dashboard

### Issue: TypeScript errors in repository

**Solution**: The `as any` assertions are intentional. If you want strict types:

```bash
npx supabase gen types typescript --project-id ocunqereputrqcblpzvu > types/database.ts
```

### Issue: CORS errors when testing from frontend

**Solution**: None needed - Next.js API routes are on the same origin

### Issue: Empty results from API

**Solution**:

1. Check database has data: `SELECT COUNT(*) FROM car_listings WHERE status = 'active'`
2. Check filters aren't too restrictive
3. Check dealer records exist (listings join with dealers)

---

## Summary

✅ **Completed**:

- Server-side Supabase infrastructure
- Database types for TypeScript
- Data access layer (repository)
- 2 read-only API endpoints
- Consistent error handling
- Documentation

🔄 **Pending** (Your Action):

1. Create database tables in Supabase
2. Insert sample data
3. Test API endpoints
4. Verify responses match expected format

📋 **Next Phase**:

- Frontend integration (connect shop page to real API)
- Authentication setup
- Write operations (POST/PATCH/DELETE)

---

## Questions or Issues?

If you encounter problems:

1. Check the Supabase Dashboard logs
2. Check Next.js console output (`npm run dev`)
3. Verify environment variables are set
4. Ensure database schema matches `types/database.ts`

**Contact**: Backend Integration Team
**Documentation**: See `HANDOVER-TO-BACKEND.md` for full architecture details

---

**End of Phase 1.1 Handover** ✅
