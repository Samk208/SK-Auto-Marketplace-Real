# SK AutoSphere Admin Panel

## Overview

This admin back-office includes a mix of **real backend integration** (Supabase auth + role checks, admin APIs, audit logging, emails) and **UI pages that still use mock data**.

## Access

- **URL**: `/admin/login`
- **Admin Credentials**:
  - Email: `admin@test.com`
  - Password: `pass458`

## Features

### 1. Admin Login (`/admin/login`)

- Email/username and password fields
- Password strength indicator
- Show/hide password toggle
- Failed login tracking (locks after 5 attempts)
- Session management (via Supabase cookie-based auth)

### 2. Dashboard (`/admin/dashboard`)

- Overview statistics: total listings, pending reviews, dealers, revenue
- Recent listings table
- Recent payments table
- Quick insights cards

**Backend status:**

- `GET /api/admin/stats` exists and queries Supabase tables (`car_listings`, `dealers`, `transactions`).

### 3. Listings Management (`/admin/listings`)

- View all vehicle listings
- Filter by status (active/pending/archived/rejected)
- Filter by dealer
- Search functionality
- Actions:
  - View listing details
  - Approve pending listings
  - Reject pending listings
  - Archive active listings

**Backend status:**

- `PATCH /api/admin/listings/[id]/approve` exists (updates listing status with concurrency protection, writes audit trail, sends email).
- `PATCH /api/admin/listings/[id]/reject` exists.

### 4. Dealers Management (`/admin/dealers`)

- View all dealer accounts
- Dealer information: contact, location, ratings
- Statistics: total listings, active listings, sales
- Actions:
  - Verify unverified dealers
  - Suspend/unsuspend dealers

### 5. Payments & Reservations (`/admin/payments`)

- View all payment transactions
- Summary cards: total transactions, completed, pending
- Filter by status
- Payment details: amount, method, buyer country

**Backend status:**

- The `transactions` table and `/api/transactions` endpoint exist.
- This page is currently implemented with `mockAdminPayments` and should be wired to real `transactions` data.

### 6. Audit Logs (`/admin/audit-logs`)

- Complete audit trail of all admin actions
- Filter by action type and target
- Includes: timestamp, admin user, action, target, details, IP address

**Backend status:**

- Audit logging is performed by admin actions (via RPC such as `log_audit`).
- This page is currently implemented with `mockAdminAuditLogs` and should be wired to real audit data.

### 7. Admin Users Management (`/admin/settings/users`)

- Manage admin user accounts
- Change user roles (Super Admin, Admin, Moderator, Finance)
- Activate/deactivate users
- Role permissions overview

**Backend status:**

- This page is currently implemented with `mockAdminUsers`.
- If this is intended to manage real Supabase Auth users/roles, it will require privileged server-side APIs.

## Role-Based Access Control

### Super Admin

- Full access to all features
- Can manage other admin users
- Access: Dashboard, Listings, Dealers, Payments, Audit Logs, Settings

### Admin

- Access to most features except user management
- Access: Dashboard, Listings, Dealers, Payments, Audit Logs

### Moderator

- Content moderation focused
- Access: Dashboard, Listings, Dealers

### Finance

- Financial operations focused
- Access: Dashboard, Payments

## Security Features

1. **Login Security**
   - Password strength meter
   - Failed login tracking (5 attempts max)
   - Account lockout simulation
   - Session expiry (2 hours)

2. **SEO Protection**
   - All admin pages include `<meta name="robots" content="noindex,nofollow" />`
   - Prevents search engine indexing

3. **Session Management**
   - Supabase cookie-based sessions refreshed via middleware
   - Admin authorization via secure `app_metadata.role` (server-side)

4. **Audit Trail**
   - Audit logging is executed by admin APIs

## Technical Implementation

### Authentication

- Supabase Auth (cookie-based SSR)
- Server-side admin checks (`requireAdmin()`, `isAdmin()`)

### Mock Data

- Located in `mock/adminData.ts`
- Includes: users, listings, dealers, payments, audit logs

### Layout

- Responsive sidebar navigation
- Collapsible on mobile
- Role-based menu filtering
- Sticky top bar with user info

### State Management

- Local React state for UI interactions
- Mock API delays (500ms) for realistic UX
- Toast notifications for actions

## File Structure

\`\`\`
app/admin/
├── login/page.tsx # Login page
├── layout.tsx # Admin layout with sidebar
├── dashboard/page.tsx # Dashboard
├── listings/page.tsx # Listings management
├── dealers/page.tsx # Dealers management
├── payments/page.tsx # Payments page
├── audit-logs/page.tsx # Audit logs
└── settings/
└── users/page.tsx # Admin users management

lib/
└── admin-auth-context.tsx # Authentication context

mock/
└── adminData.ts # Mock data

types/
└── admin.d.ts # TypeScript interfaces
\`\`\`

## Usage

1. Navigate to `/admin/login`
2. Enter demo credentials
3. Explore the admin panel features
4. Use filters and actions to interact with mock data
5. Logout when done

## Notes

- Some admin pages are still UI/UX demonstration only and use mock data.
- Core admin authentication and several admin APIs are real.

## Production Considerations

To make this production-ready, you would need:

1. Real authentication API (JWT, OAuth, etc.)
2. Backend API endpoints for CRUD operations
3. Database integration
4. Proper authorization middleware
5. Secure session management
6. Rate limiting and CSRF protection
7. Real-time notifications
8. File upload handling
9. Export/import functionality
10. Advanced search and filtering

## Support

For issues or questions about the admin panel, refer to the main documentation or contact the development team.
