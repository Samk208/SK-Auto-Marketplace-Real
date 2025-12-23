import { createSupabaseServerActionClient } from '@/lib/auth/supabase-auth-server';
import type { Database } from '@/types/database';

export type EscrowAccount = Database['public']['Tables']['payment_escrow']['Row'];

/**
 * Creates a new escrow account for a vehicle purchase.
 */
export async function createEscrow(
    listingId: string,
    buyerId: string,
    dealerId: string,
    amount: number,
    currency: string = 'USD'
) {
    const supabase = await createSupabaseServerActionClient();

    const { data, error } = await supabase
        .from('payment_escrow')
        .insert({
            listing_id: listingId,
            buyer_id: buyerId,
            dealer_id: dealerId,
            amount,
            currency,
            status: 'pending'
        })
        .select()
        .single();

    if (error) throw error;
    return data;
}

/**
 * Updates the escrow status (e.g., after Stripe funding).
 */
export async function updateEscrowStatus(
    escrowId: string,
    status: Database['public']['Tables']['payment_escrow']['Row']['status'],
    paymentIntentId?: string
) {
    const supabase = await createSupabaseServerActionClient();

    // 1. Update Escrow
    const { data: escrow, error } = await supabase
        .from('payment_escrow')
        .update({
            status,
            stripe_payment_intent_id: paymentIntentId,
            updated_at: new Date().toISOString()
        })
        .eq('id', escrowId)
        .select()
        .single();

    if (error) throw error;

    // 2. Log Transaction
    if (status === 'funded') {
        await supabase.from('escrow_transactions').insert({
            escrow_id: escrowId,
            type: 'deposit',
            amount: escrow.amount,
            description: `Payment received via Stripe (${paymentIntentId})`
        });

        // 3. Update Tracking to 'Payment Completed'
        await updateTrackingStage(escrowId, 'payment', 'completed', 'Payment confirmed received');
        await supabase.from('order_tracking_events').insert({
            escrow_id: escrowId,
            event_type: 'payment_received',
            event_title: 'Payment Confirmed',
            event_description: 'Funds secured in escrow account.'
        });
    }

    return escrow;
}

/**
 * Updates a specific tracking stage.
 */
export async function updateTrackingStage(
    escrowId: string,
    stageType: Database['public']['Tables']['order_tracking_stages']['Row']['stage_type'],
    status: Database['public']['Tables']['order_tracking_stages']['Row']['status'],
    notes?: string,
    location?: string,
    eta?: string
) {
    const supabase = await createSupabaseServerActionClient();

    const { error } = await supabase
        .from('order_tracking_stages')
        .update({
            status,
            notes,
            location_name: location,
            eta,
            completed_at: status === 'completed' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
        })
        .eq('escrow_id', escrowId)
        .eq('stage_type', stageType);

    if (error) throw error;
}
