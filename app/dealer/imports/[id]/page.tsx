"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DocumentUploader } from "@/components/importExport/DocumentUploader"
import { TimelineView } from "@/components/importExport/TimelineView"
import { mockImportVehicles } from "@/mock/importExportData"
import { ArrowLeft, Ship, MapPin, Calendar, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ImportDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const vehicle = mockImportVehicles.find((v) => v.id === params.id)

  if (!vehicle) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Vehicle Not Found</h3>
            <p className="text-muted-foreground mb-4">The import record you're looking for doesn't exist.</p>
            <Button asChild>
              <Link href="/dealer/imports">Back to Imports</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <head>
        <title>Import Details - {vehicle.title} | SK AutoSphere</title>
        <meta name="robots" content="noindex,nofollow" />
      </head>

      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">→</span>
          <Link href="/dealer/dashboard" className="hover:text-foreground">
            Dealer Dashboard
          </Link>
          <span className="mx-2">→</span>
          <Link href="/dealer/imports" className="hover:text-foreground">
            Imports
          </Link>
          <span className="mx-2">→</span>
          <span className="text-foreground">Vehicle {vehicle.id}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{vehicle.title}</h1>
            <p className="text-muted-foreground">Import & Export Details</p>
          </div>
        </div>

        {/* Vehicle Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Export Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Export Port</div>
                <div className="flex items-center gap-2">
                  <Ship className="h-4 w-4" />
                  <span className="font-medium">{vehicle.exportPort}</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Destination</div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{vehicle.destinationPort}</div>
                    <div className="text-sm text-muted-foreground">{vehicle.destinationCountry}</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">ETD / ETA</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <div>
                    {vehicle.etd && <div className="text-sm">ETD: {vehicle.etd}</div>}
                    {vehicle.eta && <div className="text-sm">ETA: {vehicle.eta}</div>}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Status</div>
                <Badge
                  variant="secondary"
                  className={
                    vehicle.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : vehicle.status === "In Transit"
                        ? "bg-yellow-100 text-yellow-800"
                        : vehicle.status === "Issue"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                  }
                >
                  {vehicle.status}
                </Badge>
              </div>
            </div>

            {vehicle.shippingCompany && (
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Shipping Company:</span>
                    <span className="ml-2 font-medium">{vehicle.shippingCompany}</span>
                  </div>
                  {vehicle.containerNumber && (
                    <div>
                      <span className="text-muted-foreground">Container:</span>
                      <span className="ml-2 font-mono font-medium">{vehicle.containerNumber}</span>
                    </div>
                  )}
                  {vehicle.billOfLading && (
                    <div>
                      <span className="text-muted-foreground">Bill of Lading:</span>
                      <span className="ml-2 font-mono font-medium">{vehicle.billOfLading}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <TimelineView timeline={vehicle.timeline} />

        {/* Document Management */}
        <DocumentUploader vehicleId={vehicle.id} documents={vehicle.documents} />
      </div>
    </>
  )
}
