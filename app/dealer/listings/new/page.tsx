import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/supabase-auth-server";
import { getDealerByUserId } from "@/lib/repositories/dealers";
import { ListingForm } from "@/components/dealer/listing-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function NewListingPage() {
  const user = await getCurrentUser();

  // Check if user is logged in
  if (!user) {
    redirect("/auth/login?redirect=/dealer/listings/new");
  }

  // Check if user is a dealer
  const dealer = await getDealerByUserId(user.id);
  if (!dealer) {
    return (
      <div className="container max-w-2xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Dealer Account Required</CardTitle>
            <CardDescription>
              You need to be a registered dealer to create listings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              If you believe this is an error, please contact support.
            </p>
            <Link href="/dealer/dashboard">
              <Button variant="outline">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link
          href="/dealer/listings"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
        </Link>
        <h1 className="text-3xl font-bold">Create New Listing</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details below to create a new vehicle listing.
        </p>
      </div>

      <ListingForm mode="create" />
    </div>
  );
}
