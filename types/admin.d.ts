import type { CarListing, Dealer } from "../types"

export interface AdminUser {
  id: string
  name: string
  email: string
  role: "Super Admin" | "Admin" | "Moderator" | "Finance"
  status: "Active" | "Inactive" | "Suspended"
  avatar?: string
  lastLogin?: Date
  createdAt: Date
}

export interface ListingAdmin extends CarListing {
  status: "active" | "pending" | "archived" | "rejected"
  dealerName: string
  createdAt: Date
  updatedAt: Date
  views: number
  inquiries: number
}

export interface DealerAdmin extends Dealer {
  country: string
  verified: boolean
  suspended: boolean
  totalListings: number
  activeListings: number
  totalSales: number
  joinedDate: Date
  lastActive: Date
  email: string
  phone: string
}

export interface PaymentAdmin {
  id: string
  listingId: string
  listingTitle: string
  dealerId: string
  dealerName: string
  buyerCountry: string
  buyerEmail: string
  amount: number
  currency: string
  status: "Completed" | "Pending" | "Failed" | "Refunded"
  paymentMethod: string
  transactionDate: Date
  reservationFee?: number
}

export interface AuditLog {
  id: string
  timestamp: Date
  adminUser: string
  adminId: string
  action:
    | "Login"
    | "Logout"
    | "Approve Listing"
    | "Reject Listing"
    | "Verify Dealer"
    | "Suspend Dealer"
    | "Process Payment"
    | "Update Settings"
    | "Create User"
    | "Delete User"
  target: "listing" | "dealer" | "payment" | "user" | "system"
  targetId?: string
  details: string
  ipAddress?: string
  userAgent?: string
}

export interface AdminStats {
  totalListings: number
  activeListings: number
  pendingListings: number
  totalDealers: number
  verifiedDealers: number
  totalPayments: number
  totalRevenue: number
  monthlyRevenue: number
}
