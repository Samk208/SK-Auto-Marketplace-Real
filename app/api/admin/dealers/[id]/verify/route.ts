import { requireAdmin } from "@/lib/auth/admin-auth";
import { createSupabaseServerActionClient } from "@/lib/auth/supabase-auth-server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const dealerId = params.id;
    const body = await request.json();
    const { action, notes } = body; // action: 'approve' | 'reject'

    // 1. Check admin authorization
    const authResult = await requireAdmin();
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const supabase = await createSupabaseServerActionClient();

    // 2. Perform Update
    let updateData: any = {
      verification_status: action === "approve" ? "verified" : "rejected",
      verification_notes: notes || null,
    };

    // Sync verified (though trigger handles it, explicit is fine too, but let's rely on trigger for consistency)
    // Actually, let's let the trigger do the verified boolean sync.

    const { data, error } = await supabase
      .from("dealers")
      .update(updateData)
      .eq("id", dealerId)
      .select()
      .single();

    if (error) {
      console.error("Dealer update error:", error);
      return NextResponse.json(
        { error: "Failed to update dealer" },
        { status: 500 },
      );
    }

    // 3. Log Audit
    await supabase.rpc("log_audit", {
      p_action: action === "approve" ? "dealer_verified" : "dealer_rejected",
      p_entity_type: "dealer",
      p_entity_id: dealerId,
      p_resource_type: "dealer",
      p_resource_id: dealerId,
      p_details: { notes },
    });

    // 4. Send Email (TODO: Implement sendDealerVerificationEmail)

    return NextResponse.json({ success: true, dealer: data });
  } catch (error) {
    console.error("Verify dealer error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
