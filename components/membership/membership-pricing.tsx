/**
 * Membership Pricing Component
 * 
 * References:
 * - GitHub Sponsors: https://github.com/sponsors
 * - Stripe Pricing Table: https://stripe.com/docs/payments/checkout/pricing-table
 * - Cal.com Pricing: https://github.com/calcom/cal.com/blob/main/apps/web/pages/pricing.tsx
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Check, Crown, Sparkles, Star, Zap } from 'lucide-react';
import Image from 'next/image';
import { useState, useTransition } from 'react';

interface MembershipTier {
  id: string;
  name: string;
  display_name: string;
  tier_level: number;
  price_monthly: number;
  price_yearly: number;
  benefits: string[] | null;
  features: unknown;
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
}

interface MembershipPricingProps {
  tiers: MembershipTier[];
  currentTier: string;
}

const TIER_ICONS: Record<string, React.ReactNode> = {
  BRONZE: <Star className="h-6 w-6" />,
  SILVER: <Zap className="h-6 w-6" />,
  GOLD: <Sparkles className="h-6 w-6" />,
  PLATINUM: <Crown className="h-6 w-6" />,
};

const TIER_COLORS: Record<string, string> = {
  BRONZE: 'from-amber-600 to-amber-800',
  SILVER: 'from-slate-400 to-slate-600',
  GOLD: 'from-yellow-400 to-amber-500',
  PLATINUM: 'from-purple-500 to-indigo-600',
};

export function MembershipPricing({ tiers, currentTier }: MembershipPricingProps) {
  const [isYearly, setIsYearly] = useState(true);
  const [isPending, startTransition] = useTransition();
  // Checkout redirects via window.location

  const handleSubscribe = async (tier: MembershipTier) => {
    if (tier.name === 'BRONZE') {
      // Bronze is free, no checkout needed
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/membership/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tierId: tier.id,
            tierName: tier.name,
            billingCycle: isYearly ? 'yearly' : 'monthly',
            priceId: isYearly ? tier.stripe_price_id_yearly : tier.stripe_price_id_monthly,
          }),
        });

        const data = await response.json();
        
        if (data.url) {
          window.location.href = data.url;
        } else if (data.error) {
          console.error('Checkout error:', data.error);
          // Could show toast notification here
        }
      } catch (error) {
        console.error('Failed to start checkout:', error);
      }
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span className={cn(
          "text-sm font-medium",
          !isYearly ? "text-slate-900 dark:text-white" : "text-slate-500"
        )}>
          Monthly
        </span>
        <Switch
          checked={isYearly}
          onCheckedChange={setIsYearly}
          aria-label="Toggle yearly billing"
        />
        <span className={cn(
          "text-sm font-medium",
          isYearly ? "text-slate-900 dark:text-white" : "text-slate-500"
        )}>
          Yearly
          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Save 17%
          </Badge>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {tiers.map((tier) => {
          const isCurrentTier = tier.name === currentTier;
          const isPopular = tier.name === 'GOLD';
          const price = isYearly ? tier.price_yearly : tier.price_monthly;
          const monthlyEquivalent = isYearly ? (tier.price_yearly / 12).toFixed(2) : tier.price_monthly;

          return (
            <Card 
              key={tier.id}
              className={cn(
                "relative flex flex-col",
                isPopular && "border-2 border-yellow-500 shadow-lg shadow-yellow-500/20",
                isCurrentTier && "ring-2 ring-blue-500"
              )}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-yellow-500 text-white">Most Popular</Badge>
                </div>
              )}
              
              {isCurrentTier && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Current Plan
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-2">
                <div className={cn(
                  "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-white",
                  TIER_COLORS[tier.name]
                )}>
                  {TIER_ICONS[tier.name]}
                </div>
                <CardTitle className="text-xl">{tier.display_name}</CardTitle>
                <CardDescription>
                  {tier.name === 'BRONZE' && 'Get started for free'}
                  {tier.name === 'SILVER' && 'For regular buyers'}
                  {tier.name === 'GOLD' && 'For serious importers'}
                  {tier.name === 'PLATINUM' && 'For businesses'}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">
                      ${price === 0 ? '0' : monthlyEquivalent}
                    </span>
                    <span className="text-slate-500">/mo</span>
                  </div>
                  {isYearly && price > 0 && (
                    <p className="text-sm text-slate-500 mt-1">
                      ${tier.price_yearly} billed yearly
                    </p>
                  )}
                </div>

                {/* Benefits */}
                <ul className="space-y-3">
                  {(tier.benefits as string[]).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={cn(
                    "w-full",
                    tier.name === 'GOLD' && "bg-yellow-500 hover:bg-yellow-600",
                    tier.name === 'PLATINUM' && "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                  )}
                  variant={tier.name === 'BRONZE' ? 'outline' : 'default'}
                  disabled={isCurrentTier || isPending}
                  onClick={() => handleSubscribe(tier)}
                >
                  {isCurrentTier ? 'Current Plan' : 
                   tier.name === 'BRONZE' ? 'Free Forever' : 
                   isPending ? 'Loading...' : 'Get Started'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Trust Badges */}
      <div className="mt-12 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Secure payment powered by Stripe. Cancel anytime.
        </p>
        <div className="mt-4 flex items-center justify-center gap-6">
          <Image src="/stripe-badge.svg" alt="Powered by Stripe" width={120} height={32} className="opacity-50" />
        </div>
      </div>
    </div>
  );
}
