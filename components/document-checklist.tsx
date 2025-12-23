import { CheckCircle2, Circle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Document {
  name: string
  required: boolean
  verified?: boolean
}

interface DocumentChecklistProps {
  documents: Document[]
}

export function DocumentChecklist({ documents }: DocumentChecklistProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Required Documents</CardTitle>
        <CardDescription>Ensure all documents are ready for the transaction</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div key={index} className="flex items-center gap-3">
              {doc.verified ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {doc.name}
                  {doc.required && <span className="text-red-500 ml-1">*</span>}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">* Required documents must be provided</p>
      </CardContent>
    </Card>
  )
}
