/**
 * Membership Checkout API
 * 
 * References:
 * - Stripe Checkout Sessions: https://stripe.com/docs/api/checkout/sessions
 * - Cal.com Payment: https://github.com/calcom/cal.com/tree/main/packages/app-store/stripepayment
 */

import { getCurrentUser } from '@/lib/auth/supabase-auth-server';
import { supabaseServer } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tierName, billingCycle } = body;

    if (!tierName || !billingCycle) {
      return NextResponse.json(
        { error: 'Missing required fields: tierName, billingCycle' },
        { status: 400 }
      );
    }

    // Get tier details from database
    const { data: tier, error: tierError } = await supabaseServer
      .from('membership_tiers')
      .select('*')
      .eq('name', tierName)
      .single();

    if (tierError || !tier) {
      return NextResponse.json(
        { error: 'Membership tier not found' },
        { status: 404 }
      );
    }

    // Calculate price
    const price = billingCycle === 'yearly' ? tier.price_yearly : tier.price_monthly;
    
    if (price === 0) {
      // Free tier - just create/update membership
      await supabaseServer.from('user_memberships').upsert({
        user_id: user.id,
        tier_id: tier.id,
        tier: tier.name,
        tier_level: tier.tier_level,
        billing_cycle: 'free',
        status: 'active',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      return NextResponse.json({ 
        success: true, 
        message: 'Free membership activated',
        redirect: '/membership?success=true' 
      });
    }

    // Check if user already has a Stripe customer ID
    const { data: existingMembership } = await supabaseServer
      .from('user_memberships')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    let customerId = existingMembership?.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      });
      customerId = customer.id;
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tier.display_name} Membership`,
              description: `SK AutoSphere ${tier.display_name} membership - ${billingCycle} billing`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
            recurring: {
              interval: billingCycle === 'yearly' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/membership?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/membership?cancelled=true`,
      metadata: {
        user_id: user.id,
        tier_id: tier.id,
        tier_name: tier.name,
        billing_cycle: billingCycle,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          tier_name: tier.name,
        },
      },
    });

    // Update user membership with Stripe customer ID
    await supabaseServer.from('user_memberships').upsert({
      user_id: user.id,
      stripe_customer_id: customerId,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Membership checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
