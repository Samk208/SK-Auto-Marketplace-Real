/**
 * Transaction Refund API - Admin Only
 * 
 * POST /api/transactions/[id]/refund
 * - Initiate Stripe refund
 * - Update transaction status to 'refunded'
 * - Update listing status back to 'active'
 * - Send refund confirmation emails
 * - Create audit log
 */

import { createSupabaseServerActionClient, getCurrentUser, isAdmin } from '@/lib/auth/supabase-auth-server';
import { getDealerEmail, sendDealerRefundNotificationEmail, sendRefundConfirmationEmail } from '@/lib/email/send';
import { AUDIT_ACTIONS, createAuditLog, RESOURCE_TYPES } from '@/lib/repositories/audit-logs';
import { stripe } from '@/lib/stripe/server';
import { supabaseServer } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerActionClient();
    const { id } = await params;
    
    // 1. Check authentication and admin authorization
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userIsAdmin = await isAdmin();
    
    if (!userIsAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { reason, amount } = body;

    if (!reason || typeof reason !== 'string') {
      return NextResponse.json(
        { error: 'Refund reason is required' },
        { status: 400 }
      );
    }

    // 3. Fetch transaction details
    const { data: transaction, error: txError } = await supabaseServer
      .from('transactions')
      .select(`
        *,
        car_listings (
          id,
          title,
          status
        ),
        dealers (
          id,
          business_name,
          user_id
        )
      `)
      .eq('id', id)
      .single();

    if (txError || !transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // 4. Validate transaction can be refunded
    const txData = transaction as any;
    
    if (txData.status === 'refunded') {
      return NextResponse.json(
        { error: 'Transaction already refunded' },
        { status: 400 }
      );
    }

    if (txData.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Only succeeded transactions can be refunded' },
        { status: 400 }
      );
    }

    if (!txData.stripe_payment_intent_id) {
      return NextResponse.json(
        { error: 'No Stripe payment intent found for this transaction' },
        { status: 400 }
      );
    }

    // 5. Process Stripe refund
    let stripeRefund;
    try {
      const refundParams: any = {
        payment_intent: txData.stripe_payment_intent_id,
        reason: 'requested_by_customer', // Stripe enum value
        metadata: {
          admin_user_id: user.id,
          admin_email: user.email || '',
          refund_reason: reason,
          transaction_id: id
        }
      };

      // Partial refund if amount specified
      if (amount && typeof amount === 'number' && amount > 0) {
        const refundAmountCents = Math.round(amount * 100);
        const maxRefundAmount = Math.round((txData.amount || 0) * 100);
        
        if (refundAmountCents > maxRefundAmount) {
          return NextResponse.json(
            { error: 'Refund amount exceeds transaction amount' },
            { status: 400 }
          );
        }
        
        refundParams.amount = refundAmountCents;
      }

      stripeRefund = await stripe.refunds.create(refundParams);

      console.log('[Refund] Stripe refund created:', stripeRefund.id);

    } catch (stripeError: any) {
      console.error('[Refund] Stripe error:', stripeError);
      return NextResponse.json(
        { error: `Stripe refund failed: ${stripeError.message}` },
        { status: 500 }
      );
    }

    // 6. Update transaction status
    const { error: updateError } = await (supabaseServer
      .from('transactions') as any)
      .update({
        status: 'refunded',
        metadata: {
          ...(txData.metadata || {}),
          refund_id: stripeRefund.id,
          refund_amount: stripeRefund.amount / 100,
          refund_reason: reason,
          refunded_by: user.id,
          refunded_at: new Date().toISOString()
        }
      })
      .eq('id', id);

    if (updateError) {
      console.error('[Refund] Failed to update transaction:', updateError);
      // Stripe refund succeeded but DB update failed - log for manual resolution
      return NextResponse.json(
        { 
          error: 'Refund processed in Stripe but failed to update database',
          stripe_refund_id: stripeRefund.id
        },
        { status: 500 }
      );
    }

    console.log('[Refund] Transaction updated to refunded');

    // 7. Update listing status back to 'active' (make it available again)
    if (txData.listing_id) {
      const { error: listingError } = await (supabaseServer
        .from('car_listings') as any)
        .update({ status: 'active' })
        .eq('id', txData.listing_id);

      if (listingError) {
        console.error('[Refund] Failed to update listing status:', listingError);
      } else {
        console.log('[Refund] Listing restored to active:', txData.listing_id);
      }
    }

    // 8. Create audit log
    await createAuditLog({
      action: AUDIT_ACTIONS.TRANSACTION_REFUNDED,
      resourceType: RESOURCE_TYPES.TRANSACTION,
      resourceId: id,
      details: {
        refund_id: stripeRefund.id,
        refund_amount: stripeRefund.amount / 100,
        refund_reason: reason,
        original_amount: txData.amount,
        listing_id: txData.listing_id,
        admin_user_id: user.id
      }
    });

    // 9. Send refund confirmation emails
    
    // Email to buyer
    try {
      await sendRefundConfirmationEmail(
        txData.buyer_email,
        txData.buyer_name || 'Valued Customer',
        id,
        txData.car_listings?.title || 'Vehicle Purchase',
        stripeRefund.amount / 100,
        txData.amount,
        txData.currency || 'USD',
        reason
      );
      console.log('[Refund] Refund confirmation email sent to buyer');
    } catch (emailError) {
      console.error('[Refund] Failed to send buyer email:', emailError);
      // Don't fail the request if email fails
    }

    // Email to dealer (notification)
    try {
      if (txData.dealers?.user_id) {
        const dealerEmail = await getDealerEmail(txData.dealers.user_id);
        if (dealerEmail) {
          await sendDealerRefundNotificationEmail(
            dealerEmail,
            txData.dealers.business_name || 'Dealer',
            id,
            txData.car_listings?.title || 'Vehicle Listing',
            txData.listing_id,
            stripeRefund.amount / 100,
            txData.amount,
            txData.currency || 'USD',
            txData.buyer_email,
            reason
          );
          console.log('[Refund] Refund notification email sent to dealer');
        }
      }
    } catch (emailError) {
      console.error('[Refund] Failed to send dealer email:', emailError);
      // Don't fail the request if email fails
    }

    // 10. Return success response
    return NextResponse.json({
      success: true,
      refund: {
        id: stripeRefund.id,
        amount: stripeRefund.amount / 100,
        currency: stripeRefund.currency,
        status: stripeRefund.status,
        reason: reason
      },
      transaction: {
        id: id,
        status: 'refunded',
        listing_id: txData.listing_id
      },
      message: 'Refund processed successfully'
    });

  } catch (error) {
    console.error('[Refund] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
