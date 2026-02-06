import { getCurrentUser } from "@/lib/auth/supabase-auth-server";
import { getAuditLogs } from "@/lib/repositories/audit-logs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    // Basic admin check (could be more robust)
    if (!user || user.app_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action") || undefined;
    const resourceType = searchParams.get("resourceType") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "50", 10);

    const { logs, total } = await getAuditLogs({
      action,
      resourceType,
      page,
      pageSize,
    });

    return NextResponse.json({ logs, total });
  } catch (error) {
    console.error("[API Audit Logs] Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
