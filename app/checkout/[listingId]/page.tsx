import { EscrowCheckout } from '@/components/checkout/escrow-checkout';
import { createSupabaseServerClient } from '@/lib/auth/supabase-auth-server';
import { ShieldCheck } from 'lucide-react';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({ params }: { params: { listingId: string } }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/checkout/${params.listingId}`);
  }

  // Fetch listing details
  const { data: listing, error } = await supabase
    .from('car_listings')
    .select(`
        id,
        title,
        price,
        currency,
        dealer_id,
        primary_image_url,
        brand,
        model,
        year,
        dealers (
            business_name
        )
    `)
    .eq('id', params.listingId)
    .single();

  if (error || !listing) {
    console.error("Error fetching listing for checkout:", error);
    return notFound();
  }

  // Type assertion for dealer relationship
  const dealer = listing.dealers as any;

  return (
    <div className="container mx-auto py-12 px-4 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* Order Summary */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Order Summary</h1>
            <p className="text-slate-500">Review your vehicle purchase details.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-6 shadow-sm border space-y-4">
            {listing.primary_image_url && (
              <img
                src={listing.primary_image_url}
                alt={listing.title}
                className="w-full h-48 object-cover rounded-md"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{listing.year} {listing.brand} {listing.model}</h3>
              <p className="text-slate-500 text-sm">{listing.title}</p>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Vehicle Price</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: listing.currency }).format(listing.price)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Platform Fee (Estimated)</span>
                <span className="font-medium text-green-600">Waived</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Dealer</span>
                <span className="font-medium">{dealer?.business_name}</span>
              </div>
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-xl text-blue-600">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: listing.currency }).format(listing.price)}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-4 rounded-md flex gap-3 items-start text-sm">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <p>
              <strong>SK AutoSphere Guarantee:</strong> Funds are held in a secure escrow account and are only released to the dealer once the vehicle is shipped and verified.
            </p>
          </div>
        </div>

        {/* Payment Form */}
        <div>
          <EscrowCheckout
            listingId={listing.id}
            dealerId={listing.dealer_id}
            amount={listing.price}
            currency={listing.currency}
            listingTitle={listing.title}
          />
        </div>

      </div>
    </div>
  )
}
