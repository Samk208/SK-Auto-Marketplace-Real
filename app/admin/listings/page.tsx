/**
 * Admin Listings Management Page
 * Allows admins to view all listings and approve/reject pending ones
 */

import { requireAdmin } from '@/lib/auth/admin-auth';
import { createSupabaseServerClient } from '@/lib/auth/supabase-auth-server';
import { redirect } from 'next/navigation';
import { AdminListingsClient } from './admin-listings-client';

export const dynamic = 'force-dynamic';

export default async function AdminListingsPage() {
  const authResult = await requireAdmin();
  if (authResult.error) {
    redirect(authResult.status === 401 ? '/admin/login' : '/');
  }

  const supabase = await createSupabaseServerClient();

  // Fetch all listings with dealer info
  const { data: listings, error: listingsError } = await supabase
    .from('car_listings')
    .select(`
      *,
      dealers (
        id,
        business_name,
        verified
      )
    `)
    .order('created_at', { ascending: false });

  if (listingsError) {
    console.error('Failed to fetch listings:', listingsError);
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Listings Management</h1>
        <p className="text-muted-foreground mt-2">
          Review and manage all vehicle listings on the platform
        </p>
      </div>

      <AdminListingsClient initialListings={listings || []} />
    </div>
  );
}
