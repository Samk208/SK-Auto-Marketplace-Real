/**
 * Membership Pricing Page
 * 
 * References:
 * - GitHub Sponsors UI: https://github.com/sponsors
 * - Stripe Pricing Table: https://stripe.com/docs/payments/checkout/pricing-table
 * - Tailwind UI Pricing: https://tailwindui.com/components/marketing/sections/pricing
 */

import { MembershipPricing } from '@/components/membership/membership-pricing';
import { createSupabaseServerClient as createClient } from '@/lib/auth/supabase-auth-server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Membership Plans | SK AutoSphere',
  description: 'Choose the perfect membership plan for your vehicle import needs. Get discounts, early access, and premium support.',
};

async function getMembershipTiers() {
  const supabase = await createClient();

  const { data: tiers, error } = await supabase
    .from('membership_tiers')
    .select('*')
    .eq('is_active', true)
    .order('tier_level', { ascending: true });

  if (error) {
    console.error('Error fetching membership tiers:', error);
    return [];
  }

  return tiers;
}

async function getCurrentMembership() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from('user_memberships')
    .select('*, membership_tiers(*)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single();

  return membership;
}

export default async function MembershipPage() {
  const [tiers, currentMembership] = await Promise.all([
    getMembershipTiers(),
    getCurrentMembership(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Choose Your Membership
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Unlock exclusive benefits, discounts, and priority access to the best Korean vehicles.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <MembershipPricing
        tiers={tiers}
        currentTier={currentMembership?.tier || 'BRONZE'}
      />

      {/* FAQ Section */}
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <FAQItem
            question="Can I upgrade my membership anytime?"
            answer="Yes! You can upgrade your membership at any time. The price difference will be prorated for the remaining period."
          />
          <FAQItem
            question="Do I get automatic upgrades based on purchases?"
            answer="Yes! When your total purchases reach $10,000, you're automatically upgraded to Silver. $25,000 unlocks Gold, and $100,000 unlocks Platinum."
          />
          <FAQItem
            question="What happens if I cancel my membership?"
            answer="You'll continue to have access until the end of your billing period. After that, you'll be downgraded to the Bronze (free) tier."
          />
          <FAQItem
            question="Are there any hidden fees?"
            answer="No hidden fees. The price you see is the price you pay. All benefits are included in your membership."
          />
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-6">
      <h3 className="font-semibold text-slate-900 dark:text-white">{question}</h3>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{answer}</p>
    </div>
  );
}
