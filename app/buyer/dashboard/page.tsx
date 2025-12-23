import { getSavedVehiclesAction } from '@/app/actions/buyer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseServerClient } from '@/lib/auth/supabase-auth-server';
import { Heart, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function BuyerDashboardPage() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/auth/login');

    // Fetch orders (escrows)
    const { data: orders } = await supabase
        .from('payment_escrow')
        .select(`
      *,
      car_listings (
        title,
        brand,
        model,
        year,
        primary_image_url
      )
    `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

    // Fetch saved vehicles
    const savedVehicles = await getSavedVehiclesAction();

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">My Dashboard</h1>
                    <p className="text-slate-500 mt-1">Manage your orders and saved vehicles</p>
                </div>
                <Link href="/shop">
                    <Button variant="outline">Browse Cars</Button>
                </Link>
            </div>

            <Tabs defaultValue="orders" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
                    <TabsTrigger value="orders">My Orders ({orders?.length || 0})</TabsTrigger>
                    <TabsTrigger value="saved">Saved Vehicles ({savedVehicles.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="orders">
                    <div className="grid gap-6">
                        {orders && orders.length > 0 ? (
                            orders.map((order) => {
                                const listing = order.car_listings as any;
                                return (
                                    <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row">
                                            <div className="w-full md:w-48 h-32 bg-slate-100">
                                                {listing?.primary_image_url ? (
                                                    <img
                                                        src={listing.primary_image_url}
                                                        alt={listing.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                        <Package className="h-8 w-8" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                                <div>
                                                    <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">
                                                        <Link href={`/orders/${order.id}`}>
                                                            {listing?.year} {listing?.brand} {listing?.model}
                                                        </Link>
                                                    </h3>
                                                    <p className="text-sm text-slate-500">Order #{order.id.slice(0, 8)} • {new Date(order.created_at).toLocaleDateString()}</p>

                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Badge variant={order.status === 'pending' ? 'outline' : 'default'}>
                                                            {order.status.toUpperCase()}
                                                        </Badge>
                                                        <span className="text-sm font-medium">
                                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: order.currency }).format(order.amount)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Link href={`/orders/${order.id}`}>
                                                    <Button className="w-full md:w-auto">
                                                        Track Order <Truck className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })
                        ) : (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <Package className="h-12 w-12 text-slate-300 mb-4" />
                                    <h3 className="text-xl font-semibold">No orders yet</h3>
                                    <p className="text-slate-500 mb-6 max-w-sm">
                                        You haven't purchased any vehicles yet. Browse our inventory to find your dream car.
                                    </p>
                                    <Link href="/shop">
                                        <Button>Start Shopping</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="saved">
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {savedVehicles.length > 0 ? (
                            savedVehicles.map((item: any) => {
                                const listing = item.listing;
                                if (!listing) return null;
                                return (
                                    <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow group">
                                        <div className="aspect-[4/3] relative bg-slate-100">
                                            {listing.primary_image_url ? (
                                                <img
                                                    src={listing.primary_image_url}
                                                    alt={listing.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                    <Package className="h-8 w-8" />
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2">
                                                <Badge className="bg-white text-black hover:bg-white/90">Saved</Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold text-lg line-clamp-1">
                                                {listing.year} {listing.brand} {listing.model}
                                            </h3>
                                            <div className="flex items-baseline gap-2 mt-1">
                                                <span className="text-xl font-bold text-blue-600">
                                                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: listing.currency || 'USD', maximumFractionDigits: 0 }).format(listing.price)}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm text-slate-500 mt-3">
                                                <div>{listing.mileage?.toLocaleString()} {listing.mileage_unit}</div>
                                                <div className="text-right">{listing.transmission}</div>
                                                <div>{listing.fuel_type}</div>
                                            </div>
                                            <Link href={`/listings/${listing.id}`} className="block mt-4">
                                                <Button className="w-full">View Details</Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        ) : (
                            <div className="col-span-full">
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                        <Heart className="h-12 w-12 text-slate-300 mb-4" />
                                        <h3 className="text-xl font-semibold">No saved vehicles</h3>
                                        <p className="text-slate-500 mb-6 max-w-sm">
                                            Save vehicles you're interested in to track their price and availability.
                                        </p>
                                        <Link href="/shop">
                                            <Button>Browse Cars</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
