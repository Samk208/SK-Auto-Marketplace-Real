import { UserMenu } from "@/components/auth/user-menu";
import { HomePageClient } from "@/components/home/home-page-client";
import { getActiveListings } from "@/lib/repositories/listings";

export default async function Home() {
  // Fetch initial listings for the home page (limit to 8)
  const { items: initialListings } = await getActiveListings({
    pageSize: 8,
    status: "active",
  });

  return (
    <HomePageClient userMenu={<UserMenu />} initialListings={initialListings} />
  );
}
