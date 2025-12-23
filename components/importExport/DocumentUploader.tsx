"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ExportDocument } from "@/types/import-export"
import { Upload, FileText, ImageIcon, File, CheckCircle, Clock, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DocumentUploaderProps {
  vehicleId: string
  documents: ExportDocument[]
}

export function DocumentUploader({ vehicleId, documents: initialDocuments }: DocumentUploaderProps) {
  const [documents, setDocuments] = useState<ExportDocument[]>(initialDocuments)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = () => {
    setUploading(true)
    // Mock upload
    setTimeout(() => {
      const newDoc: ExportDocument = {
        id: `doc-${Date.now()}`,
        name: "New Document.pdf",
        type: "other",
        url: "/docs/new-doc.pdf",
        uploadedAt: new Date(),
        uploadedBy: "dealer-1",
        status: "uploaded",
      }
      setDocuments([...documents, newDoc])
      setUploading(false)
      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded successfully.",
      })
    }, 2000)
  }

  const getDocIcon = (type: ExportDocument["type"]) => {
    switch (type) {
      case "photo":
        return <ImageIcon className="h-5 w-5" />
      case "certificate":
      case "bill_of_lading":
      case "customs":
        return <FileText className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: ExportDocument["status"]) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case "uploaded":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="h-3 w-3 mr-1" />
            Uploaded
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Export Documentation</CardTitle>
            <CardDescription>Upload and manage export documents for this vehicle</CardDescription>
          </div>
          <Button onClick={handleFileUpload} disabled={uploading}>
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Documents Uploaded</h3>
            <p className="text-muted-foreground mb-4">Upload export documents to get started</p>
            <Button onClick={handleFileUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload First Document
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded">{getDocIcon(doc.type)}</div>
                    <div>
                      <div className="font-medium text-sm">{doc.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{doc.type.replace("_", " ")}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  {getStatusBadge(doc.status)}
                  <Button variant="outline" size="sm" asChild>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">Uploaded {doc.uploadedAt.toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
