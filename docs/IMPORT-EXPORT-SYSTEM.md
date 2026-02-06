# Import & Export Management System

## Overview

The Import & Export Management System is a dealer and admin tool for managing the export workflow of vehicles from Korea to African ports. This document outlines the system architecture, features, and implementation details.

## System Architecture

### Pages & Routes

#### Dealer Routes

- `/dealer/imports` - Main dealer import dashboard
- `/dealer/imports/[id]` - Individual vehicle import details with document upload and tracking
- `/dealer/imports/[id]/tracking` - Dedicated tracking page with timeline view

#### Admin Routes

- `/admin/exports` - Admin export dashboard with tabs for different statuses
- `/admin/exports/[id]` - Individual export record management
- `/admin/settings/ports` - Port and logistics partner management

### Data Models

#### ImportVehicle

- Core entity representing a vehicle in the export workflow
- Includes: listing details, dealer info, export/destination ports, shipping details
- Status tracking: "Ready for Export", "In Transit", "Delivered", "Issue"
- ETD (Estimated Time of Departure) and ETA (Estimated Time of Arrival)
- Document collection and timeline steps

#### ExportDocument

- Represents uploaded documents for export compliance
- Types: invoice, bill_of_lading, certificate, customs, photo, other
- Status: pending, uploaded, verified

#### Port

- Destination port configuration
- Freight fees and allowed vehicle types
- Active/inactive status management

#### LogisticsPartner

- Shipping companies and freight forwarders
- Service offerings and contact information

## Features

### 1. Dealer Import Dashboard (`/dealer/imports`)

**Purpose:** Central hub for dealers to manage vehicles prepared for export

**Features:**

- Real-time statistics cards (Ready for Export, In Transit, Delivered, Issues)
- Advanced filtering by status, port, and destination country
- Table view with key export information:
  - Listing ID, vehicle details, dealer name
  - Export port and destination
  - ETD/ETA dates
  - Document upload status
  - Quick action buttons

**Actions:**

- Update status
- Upload documents
- View tracking timeline
- Prepare new export

**SEO Considerations:**

- `<meta name="robots" content="noindex,nofollow" />` - Internal tool, not for search engines
- Clean breadcrumb navigation: Home → Dealer Dashboard → Imports
- Semantic HTML structure for accessibility

### 2. Vehicle Import Details (`/dealer/imports/[id]`)

**Purpose:** Detailed view of a specific vehicle's export journey

**Features:**

- Export summary card with port and shipping information
- Container number and Bill of Lading tracking
- Timeline view component showing 5 export stages
- Document uploader with multi-file support
- Issue reporting capability

**Timeline Steps:**

1. Vehicle Confirmed for Export
2. Port Loading
3. Transit Underway
4. Arrival at Destination Port
5. Buyer Collection

**SEO Considerations:**

- Dynamic title: "Import Details - [Vehicle Title] | SK AutoSphere"
- Breadcrumb: Home → Dealer Dashboard → Imports → Vehicle [ID]
- noindex/nofollow meta tag

### 3. Admin Export Dashboard (`/admin/exports`)

**Purpose:** Centralized monitoring of all marketplace exports

**Features:**

- Tab-based filtering:
  - All exports
  - Pending Export
  - In Transit
  - Delivered
  - Issues (highlighted in red)
- Search functionality across vehicle, dealer, and destination
- Comprehensive table with:
  - Vehicle ID, title, year, make
  - Dealer name
  - Export and destination ports
  - ETD/ETA dates
  - Shipping company
  - Status badges with color coding
- Export report generation

**Status Color Codes:**

- Ready for Export: Blue (`bg-blue-100 text-blue-800`)
- In Transit: Yellow (`bg-yellow-100 text-yellow-800`)
- Delivered: Green (`bg-green-100 text-green-800`)
- Issue: Red (`bg-red-100 text-red-800`)

**SEO Considerations:**

- Title: "Export Management - Admin Dashboard | SK AutoSphere"
- Breadcrumb: Home → Admin Dashboard → Exports
- noindex/nofollow for admin pages

### 4. Ports & Logistics Settings (`/admin/settings/ports`)

**Purpose:** Configure destination ports and logistics partners

**Features:**

#### Port Management

- Add/edit destination ports
- Configure:
  - Port name, country, and code
  - Default freight fees (USD)
  - Allowed vehicle types
  - Active/inactive status toggle
- Visual table with all port information

#### Logistics Partner Management

- Add/edit shipping companies and freight forwarders
- Types: shipping, customs, freight_forwarder
- Contact information and service offerings
- Active/inactive status management

**Dialog Forms:**

- Add New Port dialog
- Add Logistics Partner dialog
- Inline editing capability

**SEO Considerations:**

- Title: "Ports & Logistics Settings - Admin | SK AutoSphere"
- Breadcrumb: Home → Admin Dashboard → Settings → Ports & Logistics
- noindex/nofollow meta tag

### 5. Document Upload & Management

**Component:** `DocumentUploader.tsx`

**Features:**

- Multi-file upload interface
- Document preview with thumbnails
- Status tracking:
  - Pending: Yellow badge with clock icon
  - Uploaded: Blue badge with clock icon
  - Verified: Green badge with checkmark icon
- Document types:
  - Invoice, Bill of Lading, Certificate
  - Customs documents, Photos, Other
- Delete/remove capability
- Empty state with upload prompt

**Mock Upload Flow:**

1. User clicks "Upload Document"
2. 2-second simulated upload
3. Document appears in grid with "uploaded" status
4. Toast notification confirms success

### 6. Timeline View Component

**Component:** `TimelineView.tsx`

**Features:**

- Visual progress indicator with connecting line
- 5 standardized export steps
- Status icons:
  - Completed: Green checkmark
  - In Progress: Yellow clock (animated pulse)
  - Issue: Red alert icon
  - Pending: Gray circle
- Date display for completed steps
- Notes/comments for issue steps
- "Report Issue" button for problem steps

**Responsive Design:**

- Mobile-first approach
- Horizontal scrolling on small screens
- Icon + text layout adapts to screen size

## Mock Data

### Sample Vehicles (`mockImportVehicles`)

- 4 vehicles in different export stages
- Realistic Korean vehicle models (Hyundai, Kia, Genesis)
- Various African destination ports
- Complete document sets and timelines

### Ports (`mockPorts`)

- 6 major African ports:
  - Lagos (Nigeria), Tema (Ghana), Mombasa (Kenya)
  - Dar es Salaam (Tanzania), Durban (South Africa), Maputo (Mozambique)
- Freight fees ranging $1200-$1800 USD
- Port codes (e.g., NGLOS, GHTEM, KEMBA)

### Logistics Partners (`mockLogisticsPartners`)

- 4 partners: shipping lines, customs brokers, freight forwarders
- Realistic company names and services
- Contact information

## SEO Best Practices

### 1. Meta Tags

All admin and dealer pages include:
\`\`\`html

<meta name="robots" content="noindex,nofollow" />
\`\`\`
This prevents search engines from indexing internal management tools.

### 2. Breadcrumb Navigation

Every page has semantic breadcrumb structure:
\`\`\`
Home → Dealer Dashboard → Imports → Vehicle 12345
\`\`\`
Benefits:

- Improved user navigation
- Clear information hierarchy
- SEO signal for site structure (though noindexed)

### 3. Clean URL Structure

- `/dealer/imports` - List view
- `/dealer/imports/[id]` - Detail view
- `/admin/exports` - Admin list
- `/admin/settings/ports` - Settings

Semantic, RESTful URL patterns that are:

- Easy to understand
- Predictable
- Bookmarkable

### 4. Proper HTML Semantics

- `<h1>` for page titles
- `<table>` with `<thead>`, `<tbody>` for data
- `<nav>` for breadcrumbs
- ARIA labels where appropriate

### 5. Mobile Optimization

- Responsive tables with horizontal scrolling
- Touch-friendly button sizes (min 44x44px)
- Mobile-first CSS with Tailwind breakpoints
- Skeleton loaders for perceived performance

## Export Terminology

- **ETD (Estimated Time of Departure):** Scheduled departure from Korean port
- **ETA (Estimated Time of Arrival):** Estimated arrival at African port
- **Bill of Lading:** Legal document between shipper and carrier
- **Container Number:** Unique identifier for shipping container
- **Export Port:** Korean port (Busan, Incheon)
- **Destination Port:** African port (Lagos, Tema, Mombasa, etc.)
- **Freight Fee:** Cost to ship vehicle from origin to destination

## Future Backend Integration

When integrating with Supabase:

### Database Tables

#### `import_vehicles`

\`\`\`sql
CREATE TABLE import_vehicles (
id UUID PRIMARY KEY,
listing_id TEXT REFERENCES listings(id),
dealer_id TEXT REFERENCES dealers(id),
export_port TEXT,
destination_country TEXT,
destination_port TEXT,
status TEXT CHECK (status IN ('Ready for Export', 'In Transit', 'Delivered', 'Issue')),
etd DATE,
eta DATE,
actual_departure_date DATE,
actual_arrival_date DATE,
shipping_company TEXT,
container_number TEXT,
bill_of_lading TEXT,
docs_uploaded BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### `export_documents`

\`\`\`sql
CREATE TABLE export_documents (
id UUID PRIMARY KEY,
vehicle_id UUID REFERENCES import_vehicles(id),
name TEXT,
type TEXT CHECK (type IN ('invoice', 'bill_of_lading', 'certificate', 'customs', 'photo', 'other')),
url TEXT,
uploaded_at TIMESTAMP DEFAULT NOW(),
uploaded_by TEXT REFERENCES users(id),
status TEXT CHECK (status IN ('pending', 'uploaded', 'verified')),
created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### `timeline_steps`

\`\`\`sql
CREATE TABLE timeline_steps (
id UUID PRIMARY KEY,
vehicle_id UUID REFERENCES import_vehicles(id),
step TEXT,
status TEXT CHECK (status IN ('completed', 'in_progress', 'pending', 'issue')),
date TIMESTAMP,
notes TEXT,
created_at TIMESTAMP DEFAULT NOW(),
updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### `ports`

\`\`\`sql
CREATE TABLE ports (
id UUID PRIMARY KEY,
name TEXT,
country TEXT,
code TEXT UNIQUE,
default_freight_fee DECIMAL,
currency TEXT DEFAULT 'USD',
allowed_vehicle_types JSONB,
active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### `logistics_partners`

\`\`\`sql
CREATE TABLE logistics_partners (
id UUID PRIMARY KEY,
name TEXT,
type TEXT CHECK (type IN ('shipping', 'customs', 'freight_forwarder')),
contact TEXT,
email TEXT,
phone TEXT,
services_offered JSONB,
notes TEXT,
active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### API Routes (Next.js)

#### `/api/dealer/imports`

- GET: Fetch dealer's import vehicles
- POST: Create new import record

#### `/api/dealer/imports/[id]`

- GET: Fetch specific import details
- PATCH: Update import status
- DELETE: Remove import record

#### `/api/dealer/imports/[id]/documents`

- GET: Fetch documents for vehicle
- POST: Upload new document
- DELETE: Remove document

#### `/api/dealer/imports/[id]/timeline`

- GET: Fetch timeline steps
- PATCH: Update step status

#### `/api/admin/exports`

- GET: Fetch all exports (with filters)
- PATCH: Bulk update operations

#### `/api/admin/ports`

- GET: Fetch all ports
- POST: Create new port
- PATCH: Update port
- DELETE: Remove port

#### `/api/admin/logistics-partners`

- GET: Fetch all partners
- POST: Create new partner
- PATCH: Update partner
- DELETE: Remove partner

### Row Level Security (RLS) Policies

#### Dealers can only see their own vehicles:

\`\`\`sql
CREATE POLICY dealer_own_vehicles ON import_vehicles
FOR SELECT USING (auth.uid() = dealer_id);
\`\`\`

#### Admins can see all:

\`\`\`sql
CREATE POLICY admin_all_vehicles ON import_vehicles
FOR ALL USING (
EXISTS (
SELECT 1 FROM admin_users
WHERE id = auth.uid()
)
);
\`\`\`

## Status Update Flow (Mock Implementation)

### Current Mock Behavior

1. User clicks "Update Status" button
2. Toast notification appears immediately
3. No actual state change (would require backend)

### Future Real Implementation

1. User clicks "Update Status"
2. Modal/dialog opens with status options
3. User selects new status and adds notes
4. API call to `/api/dealer/imports/[id]`
5. Database update with optimistic UI
6. Toast notification on success
7. Timeline automatically updates
8. Email/SMS notification to buyer (optional)

## Testing Checklist

- [ ] Dealer can view all import vehicles
- [ ] Filters work correctly (status, port, country)
- [ ] Vehicle detail page loads with correct data
- [ ] Document upload simulation works
- [ ] Timeline displays correct status icons
- [ ] Admin can view all exports across dealers
- [ ] Tab filtering works in admin dashboard
- [ ] Search functionality filters correctly
- [ ] Port management CRUD operations
- [ ] Logistics partner management works
- [ ] All breadcrumbs navigate correctly
- [ ] Mobile responsive design works
- [ ] Skeleton loaders appear during data fetch
- [ ] Toast notifications appear on actions
- [ ] noindex/nofollow meta tags present

## Performance Considerations

- Pagination for large datasets (100+ vehicles)
- Virtual scrolling for long tables
- Image optimization for document thumbnails
- Lazy loading for timeline component
- Debounced search input
- Skeleton loaders for perceived performance

## Accessibility

- ARIA labels for icon buttons
- Keyboard navigation support
- Screen reader friendly tables
- Focus indicators on interactive elements
- Color contrast ratios meet WCAG AA standards
- Status not conveyed by color alone (icons + text)

---

**Implementation Status:** ✅ Complete (Frontend Only with Mock Data)

**Next Steps for Production:**

1. Set up Supabase database tables
2. Implement API routes
3. Add RLS policies
4. Integrate file upload (Vercel Blob or Supabase Storage)
5. Add real-time subscriptions for status updates
6. Implement email/SMS notifications
7. Add analytics tracking
