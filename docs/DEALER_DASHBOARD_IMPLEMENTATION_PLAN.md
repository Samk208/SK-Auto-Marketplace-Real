# SK AUTOSPHERE DEALER DASHBOARD & ONBOARDING IMPLEMENTATION PLAN

**Created:** December 9, 2025  
**Status:** In Progress  
**Based On:** SK AUTOSPHERE DEALER DASHBOARD & ONBOA.ini

---

## OVERVIEW

This document outlines the implementation plan for the complete dealer dashboard and onboarding system for SK AutoSphere, following the wireframes and specifications provided.

---

## PHASE 1: DEALER ONBOARDING FLOW ✅ (Priority: HIGH)

### 1.1 Dealer Recruitment Landing Page

**Route:** `/dealers/become-dealer`

- [ ] Hero section with value proposition
- [ ] Benefits cards (6 cards: Fee, Safety, Markets, Logistics, AI Tools, WhatsApp)
- [ ] Trust signals (earnings statistics)
- [ ] CTA buttons

### 1.2 Registration Flow (6 Steps)

**Route:** `/dealers/register`

#### Step 1: Dealer Type Selection

- [ ] Radio card selection (Licensed Dealership, Export Company, Individual Seller)
- [ ] Visual feedback on selection
- [ ] Validation and continue button

#### Step 2: Business Information

- [ ] Form with all business details
- [ ] Real-time validation
- [ ] Auto-save every 30 seconds
- [ ] WhatsApp number verification checkbox

#### Step 3: Document Upload

- [ ] File upload with drag & drop
- [ ] Mobile camera integration
- [ ] Progress indicators
- [ ] Document type validation
- [ ] AI document authenticity scan

#### Step 4: Bank Account Details

- [ ] Bank selection dropdown
- [ ] Account verification process
- [ ] SWIFT code field
- [ ] Verification code system (₩100 transfer)

#### Step 5: Deposit & Agreement

- [ ] Security deposit information (₩500,000)
- [ ] Payment method selection
- [ ] Terms & conditions scrollable view
- [ ] Required checkboxes
- [ ] Bank details copy functionality

#### Step 6: Verification Pending

- [ ] Success confirmation screen
- [ ] Application ID display
- [ ] Timeline visualization
- [ ] Resource links (handbook, tutorials, community)
- [ ] Email notification trigger

---

## PHASE 2: DEALER DASHBOARD (Priority: HIGH)

### 2.1 Main Dashboard

**Route:** `/dealer/dashboard`

#### Components:

- [ ] Top navigation with notifications
- [ ] Welcome message with dealer name
- [ ] 4 stat cards (Revenue, Active Listings, Pending Orders, Total Sales)
- [ ] Quick actions buttons
- [ ] Urgent tasks section
- [ ] Recent orders list
- [ ] Performance chart (30 days)
- [ ] Top selling models

#### Features:

- [ ] Real-time data updates
- [ ] Loading states with skeletons
- [ ] Responsive grid layout
- [ ] Interactive charts

---

## PHASE 3: VEHICLE LISTING MANAGEMENT (Priority: HIGH)

### 3.1 Inventory List View

**Route:** `/dealer/inventory`

- [ ] Filters (Status, Make, Year, Price Range)
- [ ] Search functionality (VIN, model, listing ID)
- [ ] Grid/List view toggle
- [ ] Status indicators (Active, Pending, Sold, Paused, Rejected)
- [ ] Bulk actions (Edit, Delete)
- [ ] Pagination

### 3.2 Add New Vehicle (4-Step Wizard)

**Route:** `/dealer/inventory/add`

#### Step 1: Basic Information

- [ ] VIN scanner (camera integration)
- [ ] Auto-fill from VIN
- [ ] Make, Model, Year dropdowns
- [ ] Mileage, condition, color inputs
- [ ] Ownership & history fields
- [ ] Accident disclosure
- [ ] Service history

#### Step 2: Photos & Media

- [ ] Required angles checklist (8 photos minimum)
- [ ] Drag & drop upload
- [ ] Mobile camera access
- [ ] Photo reordering
- [ ] Video walkthrough upload
- [ ] AI quality check
- [ ] Auto-compression & watermarking

#### Step 3: AI Damage Scan

- [ ] Automatic AI scanning
- [ ] Progress indicator
- [ ] Results display with confidence score
- [ ] Issue detection with severity levels
- [ ] Repair cost estimates
- [ ] Interactive photo annotations
- [ ] Override option with manual review

#### Step 4: Pricing & Publish

- [ ] Market-based price suggestions
- [ ] Price comparison widget
- [ ] Days-to-sell prediction
- [ ] Minimum acceptable offer
- [ ] Warranty options
- [ ] Add-ons checklist
- [ ] Listing preview
- [ ] Confirmation checkboxes
- [ ] Save as draft / Publish options

---

## PHASE 4: ORDER MANAGEMENT (Priority: MEDIUM)

### 4.1 Orders Dashboard

**Route:** `/dealer/orders`

- [ ] Status tabs (Pending, Processing, Shipped, Done)
- [ ] Filters (Date, Country, Price Range)
- [ ] Order cards with vehicle info
- [ ] Buyer information
- [ ] Payment status
- [ ] Next steps timeline
- [ ] Action buttons (Call, WhatsApp, Mark as Delivered)

### 4.2 Order Detail View

**Route:** `/dealer/orders/[id]`

- [ ] Complete order information
- [ ] Vehicle details with photo
- [ ] Buyer contact information
- [ ] Payment breakdown
- [ ] Delivery instructions
- [ ] Inspection yard details
- [ ] Timeline visualization
- [ ] Action buttons
- [ ] Messages & notes section

### 4.3 Delivery Confirmation

- [ ] Modal with delivery checklist
- [ ] Date/time pickers
- [ ] Items delivered checklist
- [ ] Additional notes field

---

## PHASE 5: PAYMENTS & EARNINGS (Priority: MEDIUM)

### 5.1 Earnings Dashboard

**Route:** `/dealer/earnings`

- [ ] 4 stat cards (This Month, Pending, Available, Lifetime)
- [ ] Monthly earnings chart (12 months)
- [ ] Recent transactions table
- [ ] Commission breakdown
- [ ] Volume discount progress
- [ ] Withdrawal section
- [ ] Bank account display
- [ ] Withdrawal request form

### 5.2 Withdrawal Process

- [ ] Amount input with max button
- [ ] Confirmation modal
- [ ] Processing status
- [ ] Receipt email trigger

---

## PHASE 6: ANALYTICS & REPORTS (Priority: LOW)

### 6.1 Performance Analytics

**Route:** `/dealer/analytics`

- [ ] 4 performance cards (Views, Inquiries, Conversions, Avg Days to Sell)
- [ ] Multi-line chart (Views, Inquiries, Sales)
- [ ] Top performing listings table
- [ ] Traffic sources pie chart
- [ ] Buyer demographics
- [ ] Country breakdown
- [ ] Location heatmap
- [ ] Pricing analysis
- [ ] Recommendations widget

---

## PHASE 7: SETTINGS & PROFILE (Priority: LOW)

### 7.1 Dealer Profile Settings

**Route:** `/dealer/settings`

#### Tabs:

- [ ] Profile (Logo, Business Info, Contact, Hours, Location)
- [ ] Notifications (Email & WhatsApp preferences)
- [ ] Payment (Bank account management)
- [ ] Security (Password, 2FA)
- [ ] Help (Support resources)

---

## PHASE 8: MOBILE DEALER APP (Priority: LOW)

### 8.1 Mobile Optimizations

- [ ] Responsive dashboard layout
- [ ] Touch-friendly navigation
- [ ] Quick photo upload
- [ ] VIN scanner (mobile camera)
- [ ] WhatsApp integration
- [ ] Push notifications
- [ ] Offline mode for inventory viewing
- [ ] One-tap order responses

---

## TECHNICAL REQUIREMENTS

### Database Schema (Supabase)

- [ ] `dealer_profiles` table
- [ ] `dealer_applications` table
- [ ] `dealer_documents` table
- [ ] `dealer_bank_accounts` table
- [ ] `vehicle_listings` table
- [ ] `listing_photos` table
- [ ] `ai_damage_reports` table
- [ ] `dealer_orders` table
- [ ] `dealer_earnings` table
- [ ] `dealer_withdrawals` table
- [ ] `dealer_analytics` table

### API Routes

- [ ] `/api/dealer/register` - Registration flow
- [ ] `/api/dealer/upload-document` - Document upload
- [ ] `/api/dealer/verify-bank` - Bank verification
- [ ] `/api/dealer/listings` - CRUD operations
- [ ] `/api/dealer/upload-photos` - Photo upload
- [ ] `/api/dealer/ai-scan` - AI damage detection
- [ ] `/api/dealer/orders` - Order management
- [ ] `/api/dealer/earnings` - Earnings & withdrawals
- [ ] `/api/dealer/analytics` - Analytics data

### AI Integration

- [ ] VIN scanner (OCR)
- [ ] Document authenticity verification
- [ ] Damage detection AI
- [ ] Photo quality assessment
- [ ] Pricing intelligence
- [ ] Market analysis

### Third-Party Services

- [ ] Supabase Storage (documents, photos)
- [ ] WhatsApp Business API
- [ ] Email service (SendGrid/Resend)
- [ ] Payment gateway (Stripe for deposits)
- [ ] Maps API (Google Maps for locations)
- [ ] Charts library (Recharts/Chart.js)

---

## DESIGN SYSTEM COMPLIANCE

All components must follow the SK AutoSphere Style Guide:

- **Primary Color:** `#2558fa` (Electric Blue)
- **Font:** Geist Sans
- **Plus Grid Pattern:** Hero sections and accented backgrounds
- **Spacing:** 4px base unit
- **Border Radius:** `rounded-xl` for cards, `rounded-md` for buttons
- **Shadows:** `shadow-sm` for lists, `shadow-lg` for floating elements

---

## IMPLEMENTATION ORDER

### Sprint 1 (Week 1): Foundation

1. Database schema setup
2. Dealer registration flow (Steps 1-3)
3. Basic dashboard layout

### Sprint 2 (Week 2): Core Features

1. Complete registration flow (Steps 4-6)
2. Vehicle listing management (Steps 1-2)
3. Inventory list view

### Sprint 3 (Week 3): Advanced Features

1. AI damage detection integration
2. Pricing & publish flow
3. Order management dashboard

### Sprint 4 (Week 4): Polish & Mobile

1. Earnings & analytics
2. Settings & profile
3. Mobile optimizations
4. Testing & bug fixes

---

## SUCCESS METRICS

- [ ] Dealer onboarding completion rate > 80%
- [ ] Average registration time < 15 minutes
- [ ] Listing creation time < 10 minutes
- [ ] Dashboard load time < 2 seconds
- [ ] Mobile responsiveness score > 95
- [ ] Accessibility score (WCAG AA) > 90

---

## NEXT STEPS

1. Review and approve implementation plan
2. Set up database schema in Supabase
3. Create API routes structure
4. Begin Phase 1: Dealer Onboarding Flow
5. Implement components following style guide
6. Test each phase before moving to next

---

**Document Version:** 1.0  
**Last Updated:** December 9, 2025
