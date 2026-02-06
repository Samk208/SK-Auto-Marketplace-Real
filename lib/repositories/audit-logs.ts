/**
 * Audit Log Helper Functions
 *
 * Provides utilities for creating audit logs in API routes
 * Uses the Supabase log_audit() function
 */

import { supabaseServer } from "@/lib/supabase-server";

export interface AuditLogParams {
  action: string;
  resourceType?: string | null;
  resourceId?: string | null;
  details?: Record<string, any>;
  ipAddress?: string | null;
}

/**
 * Create an audit log entry
 *
 * @param params - Audit log parameters
 * @returns Promise that resolves when log is created
 *
 * @example
 * await createAuditLog({
 *   action: 'transaction_refunded',
 *   resourceType: 'transaction',
 *   resourceId: transactionId,
 *   details: {
 *     refund_amount: 500,
 *     reason: 'Customer request'
 *   }
 * });
 */
export async function createAuditLog(params: AuditLogParams): Promise<void> {
  const {
    action,
    resourceType = null,
    resourceId = null,
    details = {},
    ipAddress = null,
  } = params;

  try {
    const { error } = await (supabaseServer.rpc as any)("log_audit", {
      p_action: action,
      p_resource_type: resourceType,
      p_resource_id: resourceId,
      p_details: details,
      p_ip_address: ipAddress,
    });

    if (error) {
      console.error("[AuditLog] Failed to create audit log:", error);
      // Don't throw - audit log failures shouldn't break the main operation
    } else {
      console.log("[AuditLog] Created:", action, resourceType, resourceId);
    }
  } catch (err) {
    console.error("[AuditLog] Unexpected error:", err);
    // Don't throw - audit log failures shouldn't break the main operation
  }
}

/**
 * Get audit logs with optional filtering
 *
 * @param filters - Filter options
 * @returns Paginated audit logs
 */
export async function getAuditLogs(
  filters: {
    action?: string;
    resourceType?: string;
    page?: number;
    pageSize?: number;
  } = {},
): Promise<{ logs: any[]; total: number }> {
  const { action, resourceType, page = 1, pageSize = 50 } = filters;

  try {
    let query = supabaseServer
      .from("audit_logs")
      .select("*", { count: "exact" });

    if (action && action !== "all") {
      query = query.eq("action", action);
    }

    if (resourceType && resourceType !== "all") {
      query = query.eq("resource_type", resourceType);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      logs: data || [],
      total: count || 0,
    };
  } catch (error) {
    console.error("[AuditLog] Failed to fetch logs:", error);
    return { logs: [], total: 0 };
  }
}

/**
 * Create multiple audit log entries in sequence
 *
 * @param logs - Array of audit log parameters
 * @returns Promise that resolves when all logs are created
 */
export async function createAuditLogs(logs: AuditLogParams[]): Promise<void> {
  for (const log of logs) {
    await createAuditLog(log);
  }
}

/**
 * Common audit log actions for reference
 */
export const AUDIT_ACTIONS = {
  // Transaction actions
  TRANSACTION_CREATED: "transaction_created",
  TRANSACTION_SUCCEEDED: "payment_succeeded",
  TRANSACTION_FAILED: "payment_failed",
  TRANSACTION_REFUNDED: "transaction_refunded",
  TRANSACTION_CANCELED: "payment_canceled",

  // Listing actions
  LISTING_CREATED: "listing_created",
  LISTING_UPDATED: "listing_updated",
  LISTING_APPROVED: "listing_approved",
  LISTING_REJECTED: "listing_rejected",
  LISTING_DELETED: "listing_deleted",
  LISTING_SOLD: "listing_sold",

  // Dealer actions
  DEALER_CREATED: "dealer_created",
  DEALER_VERIFIED: "dealer_verified",
  DEALER_SUSPENDED: "dealer_suspended",
  DEALER_UPDATED: "dealer_updated",

  // Admin actions
  ADMIN_LOGIN: "admin_login",
  ADMIN_LOGOUT: "admin_logout",
  ADMIN_SETTINGS_CHANGED: "admin_settings_changed",

  // User actions
  USER_REGISTERED: "user_registered",
  USER_LOGIN: "user_login",
  USER_LOGOUT: "user_logout",
  USER_UPDATED: "user_updated",
} as const;

/**
 * Common resource types for reference
 */
export const RESOURCE_TYPES = {
  TRANSACTION: "transaction",
  LISTING: "listing",
  DEALER: "dealer",
  USER: "user",
  ADMIN: "admin",
  SYSTEM: "system",
} as const;
