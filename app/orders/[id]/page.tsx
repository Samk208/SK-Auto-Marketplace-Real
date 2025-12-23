import { OrderTrackingTimeline } from '@/components/tracking/order-tracking-timeline';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/auth/supabase-auth-server';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

export default async function OrderPage({ params }: { params: { id: string } }) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/auth/login');

    // Fetch Escrow/Order + Listing Details
    const { data: escrow, error } = await supabase
        .from('payment_escrow')
        .select(`
      *,
      car_listings (
        id,
        title,
        primary_image_url
      ),
      dealers (
        business_name
      )
    `)
        .eq('id', params.id)
        .single();

    if (error || !escrow) {
        console.error('Order fetch error:', error);
        return notFound();
    }

    // Security Check (RLS handles filter, but explicit check good for Redirect)
    // RLS should return null if not authorized, but since using .single(), it might throw error.
    // We rely on RLS. If escrow is present, user is authorized.

    const listing = escrow.car_listings as any;
    const dealer = escrow.dealers as any;

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="mb-6">
                <Link href="/buyer/dashboard">
                    <Button variant="ghost" className="pl-0 gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold mt-2">Order Tracking</h1>
                <p className="text-slate-500">Order #{escrow.id.slice(0, 8)}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main: Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipment Status</CardTitle>
                            <CardDescription>Real-time updates on your vehicle's journey</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrderTrackingTimeline escrowId={escrow.id} />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Details */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Vehicle Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {listing.primary_image_url && (
                                <img
                                    src={listing.primary_image_url}
                                    alt={listing.title}
                                    className="w-full h-48 object-cover rounded-md"
                                />
                            )}
                            <h3 className="font-semibold text-lg">{listing.title}</h3>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-slate-600">Dealer</span>
                                <span className="font-medium">{dealer.business_name}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-slate-600">Amount</span>
                                <span className="font-medium">
                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: escrow.currency }).format(escrow.amount)}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-slate-600">Payment Status</span>
                                <Badge variant={escrow.status === 'funded' ? 'default' : 'secondary'}>
                                    {escrow.status.toUpperCase()}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Support</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-4">
                                Need help with your order? Contact our support team or the dealer directly.
                            </p>
                            <Button variant="outline" className="w-full">Contact Support</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
