// lib/api/listings.ts

import { MOCK_SHOP_LISTINGS } from "@/lib/mock-shop-data"

export type ListingsFilters = {
  brand?: string
  bodyType?: string
  destinationPort?: string
  status?: string
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  transmission?: string
  fuelType?: string
  search?: string
  page?: number
  pageSize?: number
  sortBy?: "price" | "year" | "created_at" | "mileage"
  sortOrder?: "asc" | "desc"
}

type ListingsApiResponse = {
  success: boolean
  data: {
    items: any[]
    total: number
    page: number
    pageSize: number
    totalPages: number
  } | null
  error: { message: string; code?: string } | null
}

function getBaseUrl(): string {
  // Server-side: use environment variable or localhost
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }
  // Client-side: use relative URL
  return ""
}

function buildQueryString(filters: ListingsFilters): string {
  const params = new URLSearchParams()

  // String filters
  if (filters.brand) params.set("brand", filters.brand)
  if (filters.bodyType) params.set("bodyType", filters.bodyType)
  if (filters.destinationPort) params.set("destinationPort", filters.destinationPort)
  if (filters.status) params.set("status", filters.status)
  if (filters.transmission) params.set("transmission", filters.transmission)
  if (filters.fuelType) params.set("fuelType", filters.fuelType)
  if (filters.search) params.set("search", filters.search)

  // Numeric filters
  if (typeof filters.minPrice === "number" && filters.minPrice > 0) {
    params.set("minPrice", String(filters.minPrice))
  }
  if (typeof filters.maxPrice === "number" && filters.maxPrice < 1000000) {
    params.set("maxPrice", String(filters.maxPrice))
  }
  if (typeof filters.minYear === "number" && filters.minYear > 1900) {
    params.set("minYear", String(filters.minYear))
  }
  if (typeof filters.maxYear === "number" && filters.maxYear < 2100) {
    params.set("maxYear", String(filters.maxYear))
  }

  // Pagination
  if (typeof filters.page === "number") {
    params.set("page", String(filters.page))
  }
  if (typeof filters.pageSize === "number") {
    params.set("pageSize", String(filters.pageSize))
  }

  // Sorting
  if (filters.sortBy) params.set("sortBy", filters.sortBy)
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder)

  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

/**
 * Fetch listings from our Next.js API with a safe fallback to mock data.
 * This is designed to be used from Server Components (e.g. app/shop/page.tsx).
 */
export async function fetchListings(
  filters: ListingsFilters = {}
): Promise<{ items: any[]; total: number; page: number; pageSize: number; totalPages: number }> {
  try {
    const baseUrl = getBaseUrl()
    const query = buildQueryString(filters)

    const res = await fetch(`${baseUrl}/api/listings${query}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("fetchListings: API returned non-OK status", res.status)
      throw new Error(`API error: ${res.status}`)
    }

    const json = (await res.json()) as ListingsApiResponse

    if (!json.success || !json.data) {
      console.error("fetchListings: API responded with error payload", json.error)
      throw new Error(json.error?.message || "Unknown API error")
    }

    return {
      items: json.data.items,
      total: json.data.total,
      page: json.data.page,
      pageSize: json.data.pageSize,
      totalPages: json.data.totalPages,
    }
  } catch (err) {
    console.error("fetchListings: falling back to mock data due to error:", err)

    // Fallback: use mock listings so the UI never fully breaks
    const items = MOCK_SHOP_LISTINGS
    const pageSize = filters.pageSize || 12
    return {
      items,
      total: items.length,
      page: 1,
      pageSize,
      totalPages: Math.ceil(items.length / pageSize),
    }
  }
}

/**
 * Fetch a single listing by ID, with fallback to mock data.
 */
export async function fetchListingById(id: string): Promise<any | null> {
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/listings/${id}`, {
      cache: "no-store",
    })

    if (res.status === 404) {
      return null
    }

    if (!res.ok) {
      console.error("fetchListingById: API returned non-OK status", res.status)
      throw new Error(`API error: ${res.status}`)
    }

    const json = (await res.json()) as {
      success: boolean
      data: any | null
      error: { message: string; code?: string } | null
    }

    if (!json.success) {
      console.error("fetchListingById: API responded with error payload", json.error)
      throw new Error(json.error?.message || "Unknown API error")
    }

    return json.data
  } catch (err) {
    console.error("fetchListingById: falling back to mock data due to error:", err)

    // Fallback: try to find by ID in the mock data
    const fromMock =
      MOCK_SHOP_LISTINGS.find((l: any) => String(l.id) === String(id)) ?? null

    return fromMock
  }
}
