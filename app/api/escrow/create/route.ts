import { getCurrentUser } from '@/lib/auth/supabase-auth-server';
import { createEscrow } from '@/lib/escrow';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { listingId, dealerId, amount, currency } = body;

        if (!listingId || !dealerId || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Create or fetch existing Escrow in DB
        // Ideally we check if there's already a pending escrow for this user/listing to avoid duplicates
        // For now, we create new one as per existing logic, but in reality we might want to fetch.
        const escrow = await createEscrow(listingId, user.id, dealerId, amount, currency);

        // 2. Create Stripe PaymentIntent
        // We metadata the escrowId so the webhook can link them later
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects cents/smallest unit
            currency: currency.toLowerCase(),
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                escrowId: escrow.id,
                listingId: listingId,
                buyerId: user.id,
                dealerId: dealerId
            },
            receipt_email: user.email // if available
        });

        // 3. Update escrow with PI ID (optional but good for tracking)
        // We can't easily update it here without a new function or direct DB call, 
        // but the Webhook will handle the status update. 
        // We could store the PI ID in metadata if we wanted.

        return NextResponse.json({
            success: true,
            escrowId: escrow.id,
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        console.error('Create escrow/payment intent error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
