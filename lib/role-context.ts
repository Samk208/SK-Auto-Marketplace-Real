// Role management for buyer vs seller journeys (UI-only state management)

export type UserRole = "buyer" | "seller" | null

export interface RoleConfig {
  role: UserRole
  label: string
  icon: string
  description: string
}

export const ROLE_CONFIGS: Record<"buyer" | "seller", RoleConfig> = {
  buyer: {
    role: "buyer",
    label: "Buyer",
    icon: "🛒",
    description: "Browse and purchase vehicles",
  },
  seller: {
    role: "seller",
    label: "Seller",
    icon: "💼",
    description: "List and sell your vehicles",
  },
}

// Available features based on role
export const ROLE_FEATURES = {
  buyer: [
    "marketplace",
    "car-detail",
    "messages",
    "payment",
    "account",
    "notifications",
  ],
  seller: [
    "dashboard",
    "analytics",
    "bulk",
    "messages",
    "account",
    "notifications",
  ],
}
