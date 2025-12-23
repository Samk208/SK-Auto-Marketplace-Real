"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { mockAdminAuditLogs } from "@/mock/adminData"
import type { AuditLog } from "@/types/admin"
import { FileText, User, Car, DollarSign, SettingsIcon } from "lucide-react"

export default function AdminAuditLogsPage() {
  const [logs] = useState<AuditLog[]>(mockAdminAuditLogs)
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [targetFilter, setTargetFilter] = useState<string>("all")

  const filteredLogs = logs.filter((log) => {
    const matchesAction = actionFilter === "all" || log.action === actionFilter
    const matchesTarget = targetFilter === "all" || log.target === targetFilter
    return matchesAction && matchesTarget
  })

  const getTargetIcon = (target: string) => {
    switch (target) {
      case "listing":
        return <Car className="h-4 w-4" />
      case "dealer":
        return <User className="h-4 w-4" />
      case "payment":
        return <DollarSign className="h-4 w-4" />
      case "user":
        return <User className="h-4 w-4" />
      case "system":
        return <SettingsIcon className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Track all administrative actions and system events</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Action Type</Label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="Login">Login</SelectItem>
                  <SelectItem value="Logout">Logout</SelectItem>
                  <SelectItem value="Approve Listing">Approve Listing</SelectItem>
                  <SelectItem value="Reject Listing">Reject Listing</SelectItem>
                  <SelectItem value="Verify Dealer">Verify Dealer</SelectItem>
                  <SelectItem value="Suspend Dealer">Suspend Dealer</SelectItem>
                  <SelectItem value="Process Payment">Process Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target</Label>
              <Select value={targetFilter} onValueChange={setTargetFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Targets</SelectItem>
                  <SelectItem value="listing">Listing</SelectItem>
                  <SelectItem value="dealer">Dealer</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail ({filteredLogs.length})</CardTitle>
          <CardDescription>Chronological record of all administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium">Admin User</th>
                  <th className="text-left py-3 px-4 font-medium">Action</th>
                  <th className="text-left py-3 px-4 font-medium">Target</th>
                  <th className="text-left py-3 px-4 font-medium">Details</th>
                  <th className="text-left py-3 px-4 font-medium">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="py-3 px-4">
                      <p className="text-sm">{log.timestamp.toLocaleDateString()}</p>
                      <p className="text-xs text-slate-600">{log.timestamp.toLocaleTimeString()}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-sm">{log.adminUser}</p>
                      <p className="text-xs text-slate-600 font-mono">ID: {log.adminId}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{log.action}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getTargetIcon(log.target)}
                        <div>
                          <p className="text-sm capitalize">{log.target}</p>
                          {log.targetId && <p className="text-xs text-slate-600 font-mono">#{log.targetId}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm max-w-md">{log.details}</td>
                    <td className="py-3 px-4">
                      <p className="text-sm font-mono">{log.ipAddress || "N/A"}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
