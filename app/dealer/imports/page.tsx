"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockImportVehicles } from "@/mock/importExportData"
import type { ImportVehicle, ExportStatus } from "@/types/import-export"
import { Package, Upload, MapPin, Ship, FileText, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function DealerImportsPage() {
  const [vehicles, setVehicles] = useState<ImportVehicle[]>(mockImportVehicles)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [portFilter, setPortFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const { toast } = useToast()

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter
    const matchesPort = portFilter === "all" || vehicle.exportPort === portFilter
    const matchesCountry = countryFilter === "all" || vehicle.destinationCountry === countryFilter
    return matchesStatus && matchesPort && matchesCountry
  })

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

  const handleUpdateStatus = (id: string) => {
    toast({
      title: "Status Updated",
      description: "Vehicle export status has been updated successfully.",
    })
  }

  const uniquePorts = Array.from(new Set(vehicles.map((v) => v.exportPort)))
  const uniqueCountries = Array.from(new Set(vehicles.map((v) => v.destinationCountry)))

  return (
    <>
      <head>
        <title>Import Management - Dealer Dashboard | SK AutoSphere</title>
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
          <span className="text-foreground">Imports</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Import Management</h1>
            <p className="text-muted-foreground">Track your vehicles ready for export and in transit</p>
          </div>
          <Button>
            <Package className="h-4 w-4 mr-2" />
            Prepare New Export
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready for Export</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles.filter((v) => v.status === "Ready for Export").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Transit</CardTitle>
              <Ship className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles.filter((v) => v.status === "In Transit").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles.filter((v) => v.status === "Delivered").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicles.filter((v) => v.status === "Issue").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Ready for Export">Ready for Export</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Issue">Issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Export Port</Label>
                <Select value={portFilter} onValueChange={setPortFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ports</SelectItem>
                    {uniquePorts.map((port) => (
                      <SelectItem key={port} value={port}>
                        {port}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Destination Country</Label>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {uniqueCountries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Export Vehicles ({filteredVehicles.length})</CardTitle>
            <CardDescription>Manage your vehicles prepared for export</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Listing ID</th>
                    <th className="text-left py-3 px-4 font-medium">Vehicle</th>
                    <th className="text-left py-3 px-4 font-medium">Export Port</th>
                    <th className="text-left py-3 px-4 font-medium">Destination</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">ETD / ETA</th>
                    <th className="text-left py-3 px-4 font-medium">Docs</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm font-mono">{vehicle.listingId}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{vehicle.title}</div>
                        <div className="text-sm text-muted-foreground">{vehicle.dealerName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Ship className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{vehicle.exportPort}</span>
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
                      <td className="py-3 px-4">{getStatusBadge(vehicle.status)}</td>
                      <td className="py-3 px-4">
                        {vehicle.etd && (
                          <div className="text-sm">
                            <div>
                              <span className="text-muted-foreground">ETD:</span> {vehicle.etd}
                            </div>
                            {vehicle.eta && (
                              <div>
                                <span className="text-muted-foreground">ETA:</span> {vehicle.eta}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {vehicle.docsUploaded ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                            <FileText className="h-3 w-3 mr-1" />
                            {vehicle.documents.length}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(vehicle.id)}>
                            Update
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dealer/imports/${vehicle.id}`}>
                              <Upload className="h-4 w-4 mr-1" />
                              Docs
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dealer/imports/${vehicle.id}/tracking`}>Track</Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
