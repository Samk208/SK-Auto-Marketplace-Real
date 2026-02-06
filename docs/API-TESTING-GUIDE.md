# API Testing Guide - Phase 1.1

Quick reference for testing the new backend APIs.

---

## Prerequisites

1. ✅ Database tables created (run `docs/database-setup.sql` in Supabase)
2. ✅ Sample data inserted
3. ✅ Development server running: `npm run dev`

---

## Base URL

```
Local: http://localhost:3000
```

---

## API Endpoints

### 1. GET /api/listings - List All Listings

#### Basic Request

```bash
# Browser
http://localhost:3000/api/listings

# cURL
curl http://localhost:3000/api/listings
```

#### With Filters

```bash
# Filter by brand
curl "http://localhost:3000/api/listings?brand=Toyota"

# Filter by body type
curl "http://localhost:3000/api/listings?bodyType=suv"

# Filter by destination port
curl "http://localhost:3000/api/listings?destinationPort=lagos"

# Multiple filters
curl "http://localhost:3000/api/listings?brand=Toyota&bodyType=suv&destinationPort=lagos"

# With pagination
curl "http://localhost:3000/api/listings?page=1&pageSize=10"

# Get sold listings
curl "http://localhost:3000/api/listings?status=sold"
```

#### Expected Response (Success)

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "33333333-3333-3333-3333-333333333333",
        "title": "2020 Toyota Land Cruiser V8 GXR",
        "year": 2020,
        "make": "Toyota",
        "model": "Land Cruiser",
        "trim": "GXR",
        "price": 45000,
        "currency": "USD",
        "location": "Dubai, UAE",
        "images": [
          "https://images.unsplash.com/photo-1609521263047-f8f205293f24",
          "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6"
        ],
        "transmission": "Automatic",
        "fuelType": "Diesel",
        "mileage": 52000,
        "mileageUnit": "km",
        "bodyType": "suv",
        "verified": true,
        "destinationPorts": ["lagos"],
        "features": [
          "4WD",
          "Sunroof",
          "Leather Seats",
          "Navigation",
          "Rear Camera"
        ],
        "description": "Excellent condition, single owner, full service history",
        "dealerId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
        "seller": {
          "name": "SK Auto Imports Dubai",
          "rating": 4.8,
          "totalReviews": 156
        },
        "sellerRating": 4.8,
        "sellerTotalReviews": 156,
        "isReserved": false,
        "isFavorite": false
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 20,
    "totalPages": 1
  },
  "error": null
}
```

---

### 2. GET /api/listings/[id] - Get Single Listing

#### Request

```bash
# Using sample listing ID
curl http://localhost:3000/api/listings/33333333-3333-3333-3333-333333333333

# Browser
http://localhost:3000/api/listings/33333333-3333-3333-3333-333333333333
```

#### Expected Response (Success)

```json
{
  "success": true,
  "data": {
    "id": "33333333-3333-3333-3333-333333333333",
    "title": "2020 Toyota Land Cruiser V8 GXR",
    "year": 2020,
    "make": "Toyota",
    "model": "Land Cruiser",
    "price": 45000,
    "currency": "USD",
    "location": "Dubai, UAE",
    "images": [...],
    "transmission": "Automatic",
    "fuelType": "Diesel",
    "mileage": 52000,
    "bodyType": "suv",
    "verified": true,
    "dealerId": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "seller": {
      "name": "SK Auto Imports Dubai",
      "rating": 4.8,
      "totalReviews": 156
    },
    "sellerRating": 4.8,
    "sellerTotalReviews": 156
  },
  "error": null
}
```

#### Expected Response (Not Found)

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

---

## Testing Scenarios

### ✅ Test 1: Get All Listings

**Expected**: Returns all active listings with pagination

```bash
curl http://localhost:3000/api/listings
```

**Verify**:

- `success` is `true`
- `data.items` is an array
- `data.total` matches number of active listings in DB
- Each listing has dealer information in `seller` object

---

### ✅ Test 2: Filter by Brand (Toyota)

**Expected**: Returns only Toyota vehicles

```bash
curl "http://localhost:3000/api/listings?brand=Toyota"
```

**Verify**:

- All items have `make: "Toyota"`
- `data.total` shows correct count

---

### ✅ Test 3: Filter by Body Type (SUV)

**Expected**: Returns only SUVs

```bash
curl "http://localhost:3000/api/listings?bodyType=suv"
```

**Verify**:

- All items have `bodyType: "suv"`

---

### ✅ Test 4: Filter by Destination Port (Lagos)

**Expected**: Returns only vehicles shipping to Lagos

```bash
curl "http://localhost:3000/api/listings?destinationPort=lagos"
```

**Verify**:

- All items have `"lagos"` in `destinationPorts` array

---

### ✅ Test 5: Pagination

**Expected**: Returns only 2 items per page

```bash
# Page 1
curl "http://localhost:3000/api/listings?pageSize=2&page=1"

# Page 2
curl "http://localhost:3000/api/listings?pageSize=2&page=2"
```

**Verify**:

- Page 1 has first 2 listings
- Page 2 has next 2 listings
- `data.page` matches requested page
- `data.totalPages` is correct (total / pageSize, rounded up)

---

### ✅ Test 6: Get Specific Listing

**Expected**: Returns single listing with full details

```bash
curl http://localhost:3000/api/listings/33333333-3333-3333-3333-333333333333
```

**Verify**:

- Returns full listing object
- Includes dealer information
- `success` is `true`

---

### ✅ Test 7: Invalid Listing ID

**Expected**: Returns 404 error

```bash
curl http://localhost:3000/api/listings/99999999-9999-9999-9999-999999999999
```

**Verify**:

- Status code is 404
- `success` is `false`
- `error.code` is `"NOT_FOUND"`

---

### ✅ Test 8: Malformed UUID

**Expected**: Returns 400 error

```bash
curl http://localhost:3000/api/listings/invalid-id
```

**Verify**:

- Status code is 400
- `success` is `false`
- `error.code` is `"INVALID_ID"`

---

### ✅ Test 9: Invalid Page Number

**Expected**: Returns 400 error

```bash
curl "http://localhost:3000/api/listings?page=0"
```

**Verify**:

- Status code is 400
- `success` is `false`
- `error.code` is `"INVALID_PAGE"`

---

### ✅ Test 10: Complex Filter Combination

**Expected**: Returns only Toyota SUVs shipping to Lagos

```bash
curl "http://localhost:3000/api/listings?brand=Toyota&bodyType=suv&destinationPort=lagos"
```

**Verify**:

- All items match ALL filters
- Correct count in `data.total`

---

## Postman Collection

### Import this JSON into Postman:

```json
{
  "info": {
    "name": "SK AutoSphere API - Phase 1.1",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Listings",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/api/listings",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "listings"]
        }
      }
    },
    {
      "name": "Filter by Brand (Toyota)",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/api/listings?brand=Toyota",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "listings"],
          "query": [
            {
              "key": "brand",
              "value": "Toyota"
            }
          ]
        }
      }
    },
    {
      "name": "Filter by Body Type (SUV)",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/api/listings?bodyType=suv",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "listings"],
          "query": [
            {
              "key": "bodyType",
              "value": "suv"
            }
          ]
        }
      }
    },
    {
      "name": "Get Single Listing",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/api/listings/33333333-3333-3333-3333-333333333333",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "listings", "33333333-3333-3333-3333-333333333333"]
        }
      }
    },
    {
      "name": "Pagination Example",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "http://localhost:3000/api/listings?page=1&pageSize=2",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["api", "listings"],
          "query": [
            {
              "key": "page",
              "value": "1"
            },
            {
              "key": "pageSize",
              "value": "2"
            }
          ]
        }
      }
    }
  ]
}
```

---

## Quick Verification Checklist

After running the database setup script, verify:

- [ ] Can access `/api/listings` (returns 200)
- [ ] Returns at least 5 sample listings
- [ ] Each listing has dealer information
- [ ] Filtering by brand works
- [ ] Filtering by bodyType works
- [ ] Filtering by destinationPort works
- [ ] Pagination works (page/pageSize params)
- [ ] Can get single listing by ID
- [ ] Invalid ID returns 404
- [ ] Malformed ID returns 400

---

## Troubleshooting

### Issue: Empty results array

**Check**:

```sql
-- In Supabase SQL Editor
SELECT COUNT(*) FROM car_listings WHERE status = 'active';
```

**Solution**: Run `database-setup.sql` to insert sample data

---

### Issue: "Missing env.SUPABASE_SERVICE_ROLE_KEY"

**Check**: `.env.local` file exists in project root

**Solution**: Ensure these variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ocunqereputrqcblpzvu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Issue: Listing has no dealer information

**Check**:

```sql
-- In Supabase SQL Editor
SELECT
  cl.id,
  cl.title,
  cl.dealer_id,
  d.business_name
FROM car_listings cl
LEFT JOIN dealers d ON cl.dealer_id = d.id
WHERE cl.id = '33333333-3333-3333-3333-333333333333';
```

**Solution**: Ensure dealer exists for each listing

---

### Issue: TypeScript errors when running dev server

**Solution**: This is expected - pre-existing errors in the codebase don't affect the new API endpoints. The API will still work.

---

## Next Steps

Once all tests pass:

1. ✅ Move to Phase 1.2 - Frontend Integration
2. ✅ Update shop page to use real API
3. ✅ Add loading states and error handling
4. ✅ Implement SWR for caching

---

**Happy Testing!** 🚀
