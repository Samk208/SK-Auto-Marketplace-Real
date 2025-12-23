"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { mockPorts, mockLogisticsPartners } from "@/mock/importExportData"
import type { Port, LogisticsPartner } from "@/types/import-export"
import { MapPin, DollarSign, Edit, Plus, Ship } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function AdminPortsSettingsPage() {
  const [ports, setPorts] = useState<Port[]>(mockPorts)
  const [partners, setPartners] = useState<LogisticsPartner[]>(mockLogisticsPartners)
  const { toast } = useToast()

  const togglePortStatus = (id: string) => {
    setPorts(ports.map((p) => (p.id === id ? { ...p, active: !p.active } : p)))
    toast({
      title: "Port Status Updated",
      description: "The port status has been changed successfully.",
    })
  }

  const togglePartnerStatus = (id: string) => {
    setPartners(partners.map((p) => (p.id === id ? { ...p, active: !p.active } : p)))
    toast({
      title: "Partner Status Updated",
      description: "The logistics partner status has been changed successfully.",
    })
  }

  return (
    <>
      <head>
        <title>Ports & Logistics Settings - Admin | SK AutoSphere</title>
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
          <Link href="/admin/settings" className="hover:text-foreground">
            Settings
          </Link>
          <span className="mx-2">→</span>
          <span className="text-foreground">Ports & Logistics</span>
        </nav>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Ports & Logistics Settings</h1>
          <p className="text-muted-foreground">Manage destination ports and logistics partners</p>
        </div>

        {/* Ports Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Destination Ports</CardTitle>
                <CardDescription>Manage African ports for vehicle exports</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Port
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Port</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Port Name</Label>
                      <Input placeholder="e.g., Lagos Port" />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input placeholder="e.g., Nigeria" />
                    </div>
                    <div className="space-y-2">
                      <Label>Port Code</Label>
                      <Input placeholder="e.g., NGLOS" />
                    </div>
                    <div className="space-y-2">
                      <Label>Default Freight Fee (USD)</Label>
                      <Input type="number" placeholder="1200" />
                    </div>
                    <Button className="w-full">Save Port</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Port Name</th>
                    <th className="text-left py-3 px-4 font-medium">Country</th>
                    <th className="text-left py-3 px-4 font-medium">Code</th>
                    <th className="text-left py-3 px-4 font-medium">Default Freight</th>
                    <th className="text-left py-3 px-4 font-medium">Vehicle Types</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ports.map((port) => (
                    <tr key={port.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{port.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{port.country}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{port.code}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {port.defaultFreightFee} {port.currency}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {port.allowedVehicleTypes.slice(0, 2).map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                          {port.allowedVehicleTypes.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{port.allowedVehicleTypes.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Switch checked={port.active} onCheckedChange={() => togglePortStatus(port.id)} />
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Logistics Partners Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Logistics Partners</CardTitle>
                <CardDescription>Manage shipping companies and freight forwarders</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Partner
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Logistics Partner</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input placeholder="e.g., Maersk Shipping" />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Person</Label>
                      <Input placeholder="Full name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" placeholder="contact@company.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input type="tel" placeholder="+1-234-567-8900" />
                    </div>
                    <Button className="w-full">Save Partner</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Company</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Contact</th>
                    <th className="text-left py-3 px-4 font-medium">Services</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => (
                    <tr key={partner.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Ship className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{partner.name}</div>
                            <div className="text-sm text-muted-foreground">{partner.contact}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="capitalize">
                          {partner.type.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div>{partner.email}</div>
                          <div className="text-muted-foreground">{partner.phone}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {partner.servicesOffered.slice(0, 2).map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {partner.servicesOffered.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{partner.servicesOffered.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Switch checked={partner.active} onCheckedChange={() => togglePartnerStatus(partner.id)} />
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
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
