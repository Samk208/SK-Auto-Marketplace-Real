import { requireAdmin } from "@/lib/auth/admin-auth";
import { createSupabaseServerActionClient } from "@/lib/auth/supabase-auth-server";
import { getDealerEmail, sendListingApprovedEmail } from "@/lib/email/send";
import type { Database } from "@/types/database";
import { NextResponse } from "next/server";

type CarListing = Database["public"]["Tables"]["car_listings"]["Row"];
type Dealer = Database["public"]["Tables"]["dealers"]["Row"];

interface ListingWithDealer extends CarListing {
  dealers: Pick<Dealer, "user_id" | "business_name">;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const listingId = params.id;

    // 1. Check admin authorization using helper
    const authResult = await requireAdmin();
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const supabase = await createSupabaseServerActionClient();

    // 2. Get the listing to verify it exists and is pending
    const { data: listing, error: fetchError } = await supabase
      .from("car_listings")
      .select("*, dealers!inner(user_id, business_name)")
      .eq("id", listingId)
      .single();

    if (fetchError || !listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Type assertion for joined data
    const listingData = listing as unknown as ListingWithDealer;

    if (listingData.status !== "pending") {
      return NextResponse.json(
        { error: "Only pending listings can be approved" },
        { status: 400 },
      );
    }

    // 3. Update listing status to active (with concurrency protection)
    const { data: updatedListing, error: updateError } = await supabase
      .from("car_listings")
      // @ts-ignore - Supabase client type inference issue
      .update({
        status: "active" as const,
        updated_at: new Date().toISOString(),
      } as Database["public"]["Tables"]["car_listings"]["Update"])
      .eq("id", listingId)
      .eq("status", "pending") // Concurrency protection: only update if still pending
      .select()
      .single();

    if (updateError || !updatedListing) {
      return NextResponse.json(
        { error: "Listing not found or already processed" },
        { status: 400 },
      );
    }

    // 4. Log the action (with error handling)
    // @ts-ignore - Supabase client type inference issue
    const { error: auditError } = await supabase.rpc("log_audit", {
      p_action: "listing_approved",
      p_resource_type: "listing",
      p_resource_id: listingId,
      p_details: {
        listing_title: listingData.title,
        dealer_id: listingData.dealer_id,
      } as Database["public"]["Tables"]["car_listings"]["Row"]["specifications"],
    });

    if (auditError) {
      console.error("Audit logging failed:", auditError);
      // Fail the request - audit trail is critical for compliance
      return NextResponse.json(
        { error: "Failed to log audit trail" },
        { status: 500 },
      );
    }

    // 5. Send email notification
    try {
      const dealerEmail = await getDealerEmail(listingData.dealers.user_id);
      if (dealerEmail) {
        await sendListingApprovedEmail(
          {
            id: listingData.id,
            title: listingData.title,
            dealer_id: listingData.dealer_id,
          },
          {
            business_name: listingData.dealers.business_name,
            user_id: listingData.dealers.user_id,
          },
          dealerEmail,
        );
      } else {
        console.warn(
          `Could not retrieve email for dealer ${listingData.dealers.user_id}`,
        );
      }
    } catch (emailError) {
      // Log but don't fail the request if email fails (non-critical)
      console.error("Failed to send approval email:", emailError);
    }

    return NextResponse.json({
      success: true,
      listing: updatedListing,
      message: "Listing approved successfully",
    });
  } catch (error) {
    console.error("Approve listing error:", error);
    return NextResponse.json(
      { error: "Failed to approve listing" },
      { status: 500 },
    );
  }
}
