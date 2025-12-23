import { requireAdmin } from '@/lib/auth/admin-auth';
import { createSupabaseServerActionClient } from '@/lib/auth/supabase-auth-server';
import { getDealerEmail, sendListingRejectedEmail } from '@/lib/email/send';
import type { Database } from '@/types/database';
import { NextResponse } from 'next/server';
import { z } from 'zod';

type CarListing = Database['public']['Tables']['car_listings']['Row'];
type Dealer = Database['public']['Tables']['dealers']['Row'];

interface ListingWithDealer extends CarListing {
  dealers: Pick<Dealer, 'user_id' | 'business_name'>;
}

const rejectSchema = z.object({
  rejection_reason: z.string().min(10, 'Reason must be at least 10 characters')
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;
    const body = await request.json();

    // 1. Validate request body
    const validation = rejectSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { rejection_reason } = validation.data;

    // 2. Check admin authorization using helper
    const authResult = await requireAdmin();
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }
    const { user } = authResult;

    const supabase = await createSupabaseServerActionClient();

    // 3. Get the listing
    const { data: listing, error: fetchError } = await supabase
      .from('car_listings')
      .select('*, dealers!inner(user_id, business_name)')
      .eq('id', listingId)
      .single();

    if (fetchError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Type assertion for joined data
    const listingData = listing as unknown as ListingWithDealer;

    // 4. Update listing status and add rejection metadata (with concurrency protection)
    // Only reject pending listings to prevent rejecting already-active/sold listings
    const { data: updatedListing, error: updateError } = await supabase
      .from('car_listings')
      // @ts-ignore - Supabase client type inference issue
      .update({
        status: 'rejected' as const,
        specifications: {
          ...(listingData.specifications as any || {}),
          rejection_reason,
          rejected_at: new Date().toISOString(),
          rejected_by: user.id
        },
        updated_at: new Date().toISOString()
      } as Database['public']['Tables']['car_listings']['Update'])
      .eq('id', listingId)
      .eq('status', 'pending') // Concurrency protection: only reject pending listings
      .select()
      .single();

    if (updateError || !updatedListing) {
      return NextResponse.json(
        { error: 'Listing not found or already processed' },
        { status: 400 }
      );
    }

    // 5. Log the action (with error handling)
    // @ts-ignore - Supabase client type inference issue
    const { error: auditError } = await supabase.rpc('log_audit', {
      p_action: 'listing_rejected',
      p_resource_type: 'listing',
      p_resource_id: listingId,
      p_details: {
        listing_title: listingData.title,
        dealer_id: listingData.dealer_id,
        rejection_reason
      } as Database['public']['Tables']['car_listings']['Row']['specifications']
    });

    if (auditError) {
      console.error('Audit logging failed:', auditError);
      // Fail the request - audit trail is critical for compliance
      return NextResponse.json(
        { error: 'Failed to log audit trail' },
        { status: 500 }
      );
    }

    // 6. Send email notification
    try {
      const dealerEmail = await getDealerEmail(listingData.dealers.user_id);
      if (dealerEmail) {
        await sendListingRejectedEmail(
          { id: listingData.id, title: listingData.title, dealer_id: listingData.dealer_id },
          { business_name: listingData.dealers.business_name, user_id: listingData.dealers.user_id },
          rejection_reason,
          dealerEmail
        );
      } else {
        console.warn(`Could not retrieve email for dealer ${listingData.dealers.user_id}`);
      }
    } catch (emailError) {
      // Log but don't fail the request if email fails (non-critical)
      console.error('Failed to send rejection email:', emailError);
    }

    return NextResponse.json({
      success: true,
      listing: updatedListing,
      message: 'Listing rejected'
    });

  } catch (error) {
    console.error('Reject listing error:', error);
    return NextResponse.json(
      { error: 'Failed to reject listing' },
      { status: 500 }
    );
  }
}
