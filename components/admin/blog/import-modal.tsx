"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FileUp, Loader2, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface ImportResult {
    success: boolean
    imported: number
    posts?: Array<{ id: string; title: string; slug: string }>
    errors?: string[]
}

export default function ImportModal() {
    const [open, setOpen] = useState(false)
    const [files, setFiles] = useState<FileList | null>(null)
    const [source, setSource] = useState("word")
    const [importing, setImporting] = useState(false)
    const router = useRouter()

    const handleImport = async () => {
        if (!files || files.length === 0) {
            toast.error("Please select files to import")
            return
        }

        setImporting(true)

        try {
            const formData = new FormData()
            formData.append("source", source)

            Array.from(files).forEach((file) => {
                formData.append("files", file)
            })

            const res = await fetch("/api/blog/import", {
                method: "POST",
                body: formData,
            })

            const data: ImportResult = await res.json()

            if (!res.ok) {
                throw new Error(data.errors?.[0] || "Import failed")
            }

            if (data.errors && data.errors.length > 0) {
                toast.warning(`Imported ${data.imported} posts with ${data.errors.length} errors`)
            } else {
                toast.success(`Successfully imported ${data.imported} post(s)!`)
            }

            setOpen(false)
            setFiles(null)
            router.refresh()
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Import failed"
            toast.error(message)
        } finally {
            setImporting(false)
        }
    }

    const acceptedTypes = {
        word: ".docx",
        markdown: ".md",
        notion: ".html",
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Posts
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Bulk Import Posts</DialogTitle>
                    <DialogDescription>
                        Import blog posts from Word documents, Markdown files, or Notion exports.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="source">Source Format</Label>
                        <Select value={source} onValueChange={setSource}>
                            <SelectTrigger id="source">
                                <SelectValue placeholder="Select source" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="word">Word Documents (.docx)</SelectItem>
                                <SelectItem value="markdown">Markdown (.md)</SelectItem>
                                <SelectItem value="notion">Notion Export (.html)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="files">Files</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="files"
                                type="file"
                                multiple
                                accept={acceptedTypes[source as keyof typeof acceptedTypes] || ".docx,.md,.html"}
                                onChange={(e) => setFiles(e.target.files)}
                                className="flex-1"
                            />
                        </div>
                        {files && files.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                                {files.length} file(s) selected
                            </p>
                        )}
                    </div>

                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-900">
                        <FileUp className="mx-auto h-8 w-8 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">
                            Posts will be imported as drafts. You can review and publish them from the blog management page.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={importing}>
                        Cancel
                    </Button>
                    <Button onClick={handleImport} disabled={!files || files.length === 0 || importing}>
                        {importing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Importing...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Import {files?.length || 0} Post(s)
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
