import { Button } from "@/components/ui/button"
import { ArrowLeft, Car, Search } from "lucide-react"
import Link from "next/link"

export default function ListingNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <Car className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Listing Not Found</h1>
          <p className="text-muted-foreground max-w-md">
            The vehicle listing you're looking for doesn't exist or may have been removed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/shop">
              <Search className="h-4 w-4 mr-2" />
              Browse All Vehicles
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
