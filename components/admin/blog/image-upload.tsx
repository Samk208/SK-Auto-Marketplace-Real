"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { Image as ImageIcon, Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"
import { toast } from "sonner"

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    label?: string
}

export default function ImageUpload({ value, onChange, label = "Cover Image" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [urlInput, setUrlInput] = useState(value)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
        if (!validTypes.includes(file.type)) {
            toast.error('Invalid file type. Please upload an image (JPG, PNG, GIF, or WebP)')
            return
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File too large. Maximum size is 10MB')
            return
        }

        setUploading(true)

        try {
            // Generate unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const filePath = `covers/${fileName}`

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) {
                throw uploadError
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('blog-images')
                .getPublicUrl(data.path)

            onChange(publicUrl)
            setUrlInput(publicUrl)
            toast.success('Image uploaded successfully!')
        } catch (error: any) {
            console.error('Upload error:', error)
            toast.error(error.message || 'Failed to upload image')
        } finally {
            setUploading(false)
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleUrlSubmit = () => {
        if (urlInput && urlInput.startsWith('http')) {
            onChange(urlInput)
            toast.success('Image URL updated!')
        } else {
            toast.error('Please enter a valid URL starting with http:// or https://')
        }
    }

    const handleRemove = () => {
        onChange('')
        setUrlInput('')
        toast.success('Image removed')
    }

    return (
        <div className="space-y-4">
            <Label>{label}</Label>

            {value && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                    <Image
                        src={value}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={handleRemove}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                    </TabsTrigger>
                    <TabsTrigger value="url">
                        <ImageIcon className="mr-2 h-4 w-4" />
                        URL
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
                        <Upload className="h-10 w-10 text-slate-400 mb-4" />
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
                            JPG, PNG, GIF or WebP (Max 10MB)
                        </p>
                        <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            className="hidden"
                            id="file-upload"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Select Image
                                </>
                            )}
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="url" className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="image-url">Image URL</Label>
                        <div className="flex gap-2">
                            <Input
                                id="image-url"
                                type="url"
                                placeholder="https://example.com/image.jpg"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                            />
                            <Button
                                type="button"
                                onClick={handleUrlSubmit}
                                disabled={!urlInput}
                            >
                                Apply
                            </Button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                            Or paste an image URL from anywhere on the web
                        </p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
