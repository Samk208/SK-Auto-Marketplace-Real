"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockImportVehicles } from "@/mock/importExportData"
import type { ImportVehicle, ExportStatus } from "@/types/import-export"
import { Ship, MapPin, Search, Download } from "lucide-react"
import Link from "next/link"

export default function AdminExportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filterByTab = (vehicles: ImportVehicle[]) => {
    switch (activeTab) {
      case "pending":
        return vehicles.filter((v) => v.status === "Ready for Export")
      case "transit":
        return vehicles.filter((v) => v.status === "In Transit")
      case "delivered":
        return vehicles.filter((v) => v.status === "Delivered")
      case "issues":
        return vehicles.filter((v) => v.status === "Issue")
      default:
        return vehicles
    }
  }

  const filteredVehicles = filterByTab(mockImportVehicles).filter(
    (vehicle) =>
      vehicle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.dealerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.destinationCountry.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusBadge = (status: ExportStatus) => {
    const variants = {
      "Ready for Export": "bg-blue-100 text-blue-800 hover:bg-blue-100",
      "In Transit": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      Delivered: "bg-green-100 text-green-800 hover:bg-green-100",
      Issue: "bg-red-100 text-red-800 hover:bg-red-100",
    }
    return (
      <Badge variant="secondary" className={variants[status]}>
        {status}
      </Badge>
    )
  }

  const stats = {
    all: mockImportVehicles.length,
    pending: mockImportVehicles.filter((v) => v.status === "Ready for Export").length,
    transit: mockImportVehicles.filter((v) => v.status === "In Transit").length,
    delivered: mockImportVehicles.filter((v) => v.status === "Delivered").length,
    issues: mockImportVehicles.filter((v) => v.status === "Issue").length,
  }

  return (
    <>
      <head>
        <title>Export Management - Admin Dashboard | SK AutoSphere</title>
        <meta name="robots" content="noindex,nofollow" />
      </head>

      <div className="p-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">→</span>
          <Link href="/admin/dashboard" className="hover:text-foreground">
            Admin Dashboard
          </Link>
          <span className="mx-2">→</span>
          <span className="text-foreground">Exports</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Export Management</h1>
            <p className="text-muted-foreground">Monitor all vehicle exports across the marketplace</p>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by vehicle, dealer, or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              All
              <Badge variant="secondary" className="ml-2">
                {stats.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending Export
              <Badge variant="secondary" className="ml-2">
                {stats.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="transit">
              In Transit
              <Badge variant="secondary" className="ml-2">
                {stats.transit}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="delivered">
              Delivered
              <Badge variant="secondary" className="ml-2">
                {stats.delivered}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="issues">
              Issues
              <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800">
                {stats.issues}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Vehicles ({filteredVehicles.length})</CardTitle>
                <CardDescription>View and manage all export operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Vehicle ID</th>
                        <th className="text-left py-3 px-4 font-medium">Title</th>
                        <th className="text-left py-3 px-4 font-medium">Dealer</th>
                        <th className="text-left py-3 px-4 font-medium">Port</th>
                        <th className="text-left py-3 px-4 font-medium">Destination</th>
                        <th className="text-left py-3 px-4 font-medium">ETD</th>
                        <th className="text-left py-3 px-4 font-medium">ETA</th>
                        <th className="text-left py-3 px-4 font-medium">Shipping</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVehicles.map((vehicle) => (
                        <tr key={vehicle.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-mono text-sm">{vehicle.id}</td>
                          <td className="py-3 px-4">
                            <div className="font-medium">{vehicle.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {vehicle.year} {vehicle.make}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{vehicle.dealerName}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2 text-sm">
                              <Ship className="h-4 w-4 text-muted-foreground" />
                              {vehicle.exportPort}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="text-sm font-medium">{vehicle.destinationPort}</div>
                                <div className="text-xs text-muted-foreground">{vehicle.destinationCountry}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">{vehicle.etd || "-"}</td>
                          <td className="py-3 px-4 text-sm">{vehicle.eta || "-"}</td>
                          <td className="py-3 px-4 text-sm">{vehicle.shippingCompany || "-"}</td>
                          <td className="py-3 px-4">{getStatusBadge(vehicle.status)}</td>
                          <td className="py-3 px-4">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/exports/${vehicle.id}`}>View</Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
