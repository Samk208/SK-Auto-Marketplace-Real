"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { TimelineStep } from "@/types/import-export"
import { CheckCircle, Circle, Clock, AlertCircle } from "lucide-react"

interface TimelineViewProps {
  timeline: TimelineStep[]
}

export function TimelineView({ timeline }: TimelineViewProps) {
  const getStepIcon = (status: TimelineStep["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case "in_progress":
        return <Clock className="h-6 w-6 text-yellow-600 animate-pulse" />
      case "issue":
        return <AlertCircle className="h-6 w-6 text-red-600" />
      default:
        return <Circle className="h-6 w-6 text-muted-foreground" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Timeline</CardTitle>
        <CardDescription>Track the progress of your vehicle export journey</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3 top-8 bottom-8 w-0.5 bg-border" />

          {/* Timeline steps */}
          <div className="space-y-8">
            {timeline.map((step, index) => (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Icon */}
                <div className="relative z-10 bg-background">{getStepIcon(step.status)}</div>

                {/* Content */}
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{step.step}</h4>
                    <Badge
                      variant="secondary"
                      className={
                        step.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : step.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : step.status === "issue"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                      }
                    >
                      {step.status === "completed"
                        ? "Completed"
                        : step.status === "in_progress"
                          ? "In Progress"
                          : step.status === "issue"
                            ? "Issue"
                            : "Pending"}
                    </Badge>
                  </div>
                  {step.date && <p className="text-sm text-muted-foreground">{step.date.toLocaleDateString()}</p>}
                  {step.notes && (
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <p className="text-sm">{step.notes}</p>
                    </div>
                  )}
                  {step.status === "issue" && (
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Report Issue
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
