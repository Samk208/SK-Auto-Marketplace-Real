"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Car,
  DollarSign,
  FileText,
  Loader2,
  SettingsIcon,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [targetFilter, setTargetFilter] = useState<string>("all");

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (actionFilter !== "all") params.append("action", actionFilter);
        if (targetFilter !== "all") params.append("resourceType", targetFilter);

        const response = await fetch(
          `/api/admin/audit-logs?${params.toString()}`,
        );
        const data = await response.json();

        if (data.logs) {
          setLogs(data.logs);
          setTotal(data.total);
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [actionFilter, targetFilter]);

  const getTargetIcon = (target: string) => {
    switch (target) {
      case "listing":
        return <Car className="h-4 w-4" />;
      case "dealer":
        return <User className="h-4 w-4" />;
      case "payment":
        return <DollarSign className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      case "system":
        return <SettingsIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Track all administrative actions and system events
        </p>
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
                  <SelectItem value="Approve Listing">
                    Approve Listing
                  </SelectItem>
                  <SelectItem value="Reject Listing">Reject Listing</SelectItem>
                  <SelectItem value="Verify Dealer">Verify Dealer</SelectItem>
                  <SelectItem value="Suspend Dealer">Suspend Dealer</SelectItem>
                  <SelectItem value="Process Payment">
                    Process Payment
                  </SelectItem>
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
          <CardTitle>Audit Trail ({total})</CardTitle>
          <CardDescription>
            Chronological record of all administrative actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                No audit logs found matching your criteria.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">
                      Timestamp
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Action</th>
                    <th className="text-left py-3 px-4 font-medium">Target</th>
                    <th className="text-left py-3 px-4 font-medium">Details</th>
                    <th className="text-left py-3 px-4 font-medium">
                      IP Address
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <td className="py-3 px-4">
                        <p className="text-sm">
                          {new Date(log.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-600">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{log.action}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getTargetIcon(log.resource_type)}
                          <div>
                            <p className="text-sm capitalize">
                              {log.resource_type}
                            </p>
                            {log.resource_id && (
                              <p className="text-xs text-slate-600 font-mono">
                                #{log.resource_id}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm max-w-md">
                        {typeof log.details === "string"
                          ? log.details
                          : JSON.stringify(log.details)}
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-mono">
                          {log.ip_address || "N/A"}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
