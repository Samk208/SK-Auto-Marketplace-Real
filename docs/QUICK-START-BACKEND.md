# Quick Start - Backend Setup

**Get your SK AutoSphere backend running in 5 minutes** ⚡

---

## Step 1: Database Setup (2 minutes)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select project: `ocunqereputrqcblpzvu`

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New query"

3. **Run Database Setup Script**
   - Open file: `docs/database-setup.sql`
   - Copy entire contents
   - Paste into SQL Editor
   - Click "Run" (or press Ctrl+Enter)
   - Wait for "Database setup complete!" message

   **Expected Output**:

   ```
   SK AutoSphere Database Setup Complete!
   Users: 2 (expected: 2)
   Dealers: 2 (expected: 2)
   Listings: 10 (expected: 10 Korean vehicles)
   Korean Brands: Hyundai, Kia, Genesis, SsangYong
   ```

✅ **Database is ready!**

---

## Step 2: Start Development Server (1 minute)

```bash
cd "C:\Users\Lenovo\Desktop\SK Now 3"
npm run dev
```

Wait for:

```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

---

## Step 3: Test the API (2 minutes)

### Browser Test

Open in your browser:

```
http://localhost:3000/api/listings
```

**Expected**: JSON response with 10 Korean car listings

### Quick Verification

```bash
# Test 1: Get all listings
curl http://localhost:3000/api/listings

# Test 2: Filter by brand (Korean brands)
curl "http://localhost:3000/api/listings?brand=Hyundai"
curl "http://localhost:3000/api/listings?brand=Kia"

# Test 3: Get single listing
curl http://localhost:3000/api/listings/c1111111-1111-1111-1111-111111111111
```

**All working?** ✅ You're done!

---

## What You Just Built

✅ **Server-side Supabase client** - Secure database access
✅ **Database schema** - Users, Dealers, Car Listings tables
✅ **Data access layer** - Repository pattern for clean code
✅ **2 REST API endpoints** - List & get car listings
✅ **10 Korean vehicles** - Hyundai, Kia, Genesis, SsangYong

---

## File Structure

```
SK Now 3/
├── lib/
│   ├── supabase-server.ts          ← Server Supabase client
│   └── repositories/
│       └── listings.ts              ← Data access functions
├── types/
│   └── database.ts                  ← Database TypeScript types
├── app/api/
│   └── listings/
│       ├── route.ts                 ← GET /api/listings
│       └── [id]/route.ts            ← GET /api/listings/:id
└── docs/
    ├── PHASE-1.1-BACKEND-INTEGRATION.md  ← Full documentation
    ├── database-setup.sql                ← Database script
    ├── API-TESTING-GUIDE.md              ← Testing guide
    └── QUICK-START-BACKEND.md            ← This file
```

---

## API Endpoints

### GET /api/listings

List all car listings with filters

**Example URLs**:

```
/api/listings
/api/listings?brand=Hyundai
/api/listings?bodyType=suv
/api/listings?destinationPort=lagos
/api/listings?page=1&pageSize=10
```

### GET /api/listings/:id

Get single listing by ID

**Example URL**:

```
/api/listings/c1111111-1111-1111-1111-111111111111
```

---

## Sample Listing IDs (Korean Vehicles)

Copy these for testing:

```
c1111111-1111-1111-1111-111111111111  → 2019 Hyundai Sonata Smart
c2222222-2222-2222-2222-222222222222  → 2020 Kia Sportage Diesel
c3333333-3333-3333-3333-333333333333  → 2018 Hyundai County Bus
c4444444-4444-4444-4444-444444444444  → 2017 Kia Bongo III Truck
c5555555-5555-5555-5555-555555555555  → 2021 Genesis G80 Luxury
c6666666-6666-6666-6666-666666666666  → 2022 Hyundai Tucson Hybrid
c7777777-7777-7777-7777-777777777777  → 2020 Kia Carnival VIP
c8888888-8888-8888-8888-888888888888  → 2019 SsangYong Rexton 4WD
c9999999-9999-9999-9999-999999999999  → 2020 Hyundai Porter II
ca000000-0000-0000-0000-000000000000  → 2021 Kia K5 GT-Line
```

**Dealers:**

```
d1111111-1111-1111-1111-111111111111  → SK Korea Motors (Incheon)
d2222222-2222-2222-2222-222222222222  → Seoul Auto Export (Busan)
```

---

## Troubleshooting

### Problem: "Missing env.SUPABASE_SERVICE_ROLE_KEY"

**Solution**: Check `.env.local` file exists and contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ocunqereputrqcblpzvu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Problem: Empty results from API

**Check database has data**:

1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select `car_listings` table
4. Should see 10 rows

**Solution**: Re-run `database-setup.sql`

---

### Problem: "Table doesn't exist" error

**Solution**: You didn't run the database setup script. Go to Step 1.

---

### Problem: TypeScript errors when starting dev server

**Don't worry!** These are pre-existing errors in the codebase. The API endpoints will still work perfectly.

To ignore and run anyway:

```bash
npm run dev
```

---

## Next Steps

### Option 1: Test More (Recommended)

Read: `docs/API-TESTING-GUIDE.md`

Test all scenarios:

- Filtering
- Pagination
- Error handling
- Edge cases

### Option 2: Integrate Frontend

Update shop page to use real API:

```typescript
// app/shop/page.tsx
const response = await fetch("/api/listings?brand=Hyundai");
const { data } = await response.json();
```

### Option 3: Add More Features

- POST /api/listings (create listing)
- PATCH /api/listings/:id (update listing)
- DELETE /api/listings/:id (delete listing)

---

## Documentation Files

📚 **Full documentation available**:

| File                               | Purpose                      |
| ---------------------------------- | ---------------------------- |
| `PHASE-1.1-BACKEND-INTEGRATION.md` | Complete technical handover  |
| `database-setup.sql`               | Database creation script     |
| `API-TESTING-GUIDE.md`             | Testing scenarios & examples |
| `QUICK-START-BACKEND.md`           | This guide                   |
| `HANDOVER-TO-BACKEND.md`           | Original architecture doc    |

---

## Need Help?

1. Check the error message
2. Read `PHASE-1.1-BACKEND-INTEGRATION.md` troubleshooting section
3. Verify environment variables in `.env.local`
4. Check Supabase Dashboard logs
5. Ensure database tables exist

---

## Success Checklist

- [ ] Database tables created in Supabase
- [ ] Sample data inserted (10 Korean listings, 2 dealers, 2 users)
- [ ] Dev server running (`npm run dev`)
- [ ] `/api/listings` returns JSON with listings
- [ ] Can filter by brand: `/api/listings?brand=Hyundai`
- [ ] Can get single listing by ID
- [ ] All tests in API-TESTING-GUIDE.md pass

**All checked?** 🎉 **Phase 1.1 is complete!**

---

**Time to celebrate!** ✨ Your backend is live and ready for frontend integration.
