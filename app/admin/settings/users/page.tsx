"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockAdminUsers } from "@/mock/adminData"
import type { AdminUser } from "@/types/admin"
import { UserCog, Ban, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettingsUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers)

  const handleRoleChange = (userId: string, newRole: AdminUser["role"]) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
    toast({ title: "Role updated", description: `User role changed to ${newRole}` })
  }

  const handleStatusToggle = (userId: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u)))
    const user = users.find((u) => u.id === userId)
    toast({
      title: user?.status === "Active" ? "User deactivated" : "User activated",
      description: user?.status === "Active" ? "User cannot access admin panel" : "User can now access admin panel",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Users</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage admin users and their permissions</p>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Users ({users.length})</CardTitle>
          <CardDescription>View and manage admin user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">ID</th>
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Email</th>
                  <th className="text-left py-3 px-4 font-medium">Role</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Last Login</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="py-3 px-4 text-sm font-mono">#{user.id}</td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-sm">{user.name}</p>
                    </td>
                    <td className="py-3 px-4 text-sm">{user.email}</td>
                    <td className="py-3 px-4">
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value as AdminUser["role"])}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Super Admin">Super Admin</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Moderator">Moderator</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          user.status === "Active"
                            ? "default"
                            : user.status === "Inactive"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {user.status === "Active" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {user.lastLogin ? (
                        <>
                          <p className="text-sm">{user.lastLogin.toLocaleDateString()}</p>
                          <p className="text-xs text-slate-600">
                            {user.lastLogin.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </>
                      ) : (
                        <span className="text-sm text-slate-500">Never</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={user.status === "Active" ? "destructive" : "default"}
                          onClick={() => handleStatusToggle(user.id)}
                        >
                          {user.status === "Active" ? (
                            <>
                              <Ban className="h-4 w-4 mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Activate
                            </>
                          )}
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

      {/* Role Permissions Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Role Permissions
          </CardTitle>
          <CardDescription>Overview of what each role can access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Super Admin</h3>
              <p className="text-sm text-slate-600">
                Full access to all features including user management, listings, dealers, payments, audit logs, and
                settings.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Admin</h3>
              <p className="text-sm text-slate-600">
                Access to listings, dealers, payments, and audit logs. Cannot manage other admin users.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Moderator</h3>
              <p className="text-sm text-slate-600">
                Can manage listings and dealers. No access to payments or admin settings.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Finance</h3>
              <p className="text-sm text-slate-600">
                Access to dashboard and payments. Limited access to other features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
