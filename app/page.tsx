import { UserMenu } from "@/components/auth/user-menu"
import { HomePageClient } from "@/components/home/home-page-client"

export default function Home() {
  return <HomePageClient userMenu={<UserMenu />} />
}
