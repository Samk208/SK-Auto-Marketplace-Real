"use client"

import ImageUpload from "@/components/admin/blog/image-upload"
import SeoPanel from "@/components/admin/blog/seo-panel"
import TagSelector from "@/components/admin/blog/tag-selector"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, CheckCircle2, Clock, Loader2, Save } from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

// Dynamic import for the editor to avoid SSR issues
const RichEditor = dynamic(() => import("@/components/admin/blog/rich-editor"), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md" />,
})

interface PostFormProps {
    initialData?: any
    isEditing?: boolean
}

export default function PostForm({ initialData, isEditing = false }: PostFormProps) {
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [isDirty, setIsDirty] = useState(false)

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        summary: initialData?.summary || "",
        content: initialData?.content || "",
        cover_image: initialData?.cover_image || "",
        status: initialData?.status || "draft",
        is_featured: initialData?.is_featured || false,
        seo_title: initialData?.seo_title || "",
        seo_description: initialData?.seo_description || "",
        focus_keyword: initialData?.focus_keyword || "",
    })
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    // Load existing tags for the post when editing
    useEffect(() => {
        if (isEditing && initialData?.id) {
            loadPostTags()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isEditing, initialData?.id])

    const loadPostTags = async () => {
        const { data } = await supabase
            .from("blog_post_tags")
            .select("tag_id")
            .eq("post_id", initialData.id)

        if (data) {
            setSelectedTags(data.map(t => t.tag_id))
        }
    }

    // Auto-generate slug from title if slug is untouched
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setFormData((prev) => {
            const slugified = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
            return {
                ...prev,
                title: newTitle,
                slug: !isEditing && (prev.slug === "" || prev.slug === slugified.substring(0, slugified.length - 1))
                    ? slugified
                    : prev.slug === "" ? slugified : prev.slug
            }
        })
        setIsDirty(true)
    }

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        setIsDirty(true)
    }

    const generateReadingTime = (content: string) => {
        const text = content.replace(/<[^>]*>/g, "")
        const wordCount = text.split(/\s+/).length
        return Math.ceil(wordCount / 200)
    }

    const savePost = useCallback(async (isAutoSave = false) => {
        if (!isAutoSave) setLoading(true)
        else setSaving(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            const postData = {
                ...formData,
                reading_time: generateReadingTime(formData.content),
                updated_at: new Date().toISOString(),
                author_id: user.id
            }

            // If publishing for the first time
            if (postData.status === 'published' && (!initialData?.published_at)) {
                // @ts-ignore
                postData.published_at = new Date().toISOString()
            }

            let error
            let postId = initialData?.id

            if (isEditing && postId) {
                const { error: updateError } = await supabase
                    .from("blog_posts")
                    .update(postData)
                    .eq("id", postId)
                error = updateError
            } else {
                // For new posts, we need to handle the ID for auto-save continuity
                // Ideally, we create the post immediately as 'draft' on first auto-save
                // But for now, let's just create it if it's a manual save or if we want to enable auto-creation
                // If it's a new post and autosave triggers, we should create it
                if (isAutoSave && !postId) {
                     // Can't easily auto-save a completely new unsaved post without redirecting to edit mode
                     // So we skip auto-save for purely new posts until manually saved once
                     return 
                }

                const { data: newPost, error: insertError } = await supabase
                    .from("blog_posts")
                    .insert([postData])
                    .select()
                    .single()
                
                if (newPost) {
                    postId = newPost.id
                    // If this was a manual save, we might want to redirect to edit mode or just stay
                    if (!isEditing) {
                        // We are now editing this new post
                        // But handling the redirect/state change here might be complex without a full refactor
                        // For this implementation, we will stick to standard behavior
                    }
                }
                error = insertError
            }

            if (error) throw error

            // Handle tags if we have a postId
            if (postId && selectedTags.length > 0) {
                // Delete existing tags first (for editing)
                if (isEditing) {
                    await supabase
                        .from("blog_post_tags")
                        .delete()
                        .eq("post_id", postId)
                }

                // Insert new tags
                const tagInserts = selectedTags.map(tagId => ({
                    post_id: postId,
                    tag_id: tagId
                }))
                await supabase.from("blog_post_tags").insert(tagInserts)
            }

            setLastSaved(new Date())
            setIsDirty(false)
            
            if (!isAutoSave) {
                toast.success(isEditing ? "Post updated successfully" : "Post created successfully")
                router.push("/admin/blog")
                router.refresh()
            }
        } catch (err: any) {
            console.error(err)
            if (!isAutoSave) toast.error(err.message || "Something went wrong")
        } finally {
            setLoading(false)
            setSaving(false)
        }
    }, [formData, initialData, isEditing, selectedTags, supabase, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await savePost(false)
    }

    // Auto-save effect
    useEffect(() => {
        if (!isDirty || !isEditing) return

        const timer = setTimeout(() => {
            savePost(true)
        }, 30000) // Auto-save every 30 seconds if dirty

        return () => clearTimeout(timer)
    }, [isDirty, isEditing, savePost])

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between sticky top-0 z-20 bg-background/95 backdrop-blur py-4 border-b">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog">
                        <Button variant="outline" size="icon" type="button">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{isEditing ? "Edit Post" : "New Post"}</h1>
                        {isEditing && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                {saving ? (
                                    <>
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : lastSaved ? (
                                    <>
                                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                                        <span>Saved {lastSaved.toLocaleTimeString()}</span>
                                    </>
                                ) : (
                                    <>
                                        <Clock className="h-3 w-3" />
                                        <span>{isDirty ? "Unsaved changes" : "All changes saved"}</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="featured"
                            checked={formData.is_featured}
                            onCheckedChange={(checked) => handleChange("is_featured", checked)}
                        />
                        <Label htmlFor="featured">Featured</Label>
                    </div>

                    <Select
                        value={formData.status}
                        onValueChange={(val) => handleChange("status", val)}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button type="submit" disabled={loading || saving}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        {isEditing ? "Update" : "Save"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Post Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter a catchy title..."
                                    value={formData.title}
                                    onChange={handleTitleChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    placeholder="url-friendly-slug"
                                    value={formData.slug}
                                    onChange={(e) => handleChange("slug", e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Summary / Excerpt</Label>
                                <Textarea
                                    placeholder="Brief description for SEO and cards..."
                                    className="h-20"
                                    value={formData.summary}
                                    onChange={(e) => handleChange("summary", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Body Content</Label>
                                <div className="min-h-[400px]">
                                    <RichEditor
                                        content={formData.content}
                                        onChange={(content) => handleChange("content", content)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <TagSelector
                                selectedTags={selectedTags}
                                onTagsChange={(tags) => {
                                    setSelectedTags(tags)
                                    setIsDirty(true)
                                }}
                            />

                            <ImageUpload
                                value={formData.cover_image}
                                onChange={(url) => handleChange("cover_image", url)}
                                label="Cover Image"
                            />
                        </CardContent>
                    </Card>

                    <SeoPanel
                        title={formData.title}
                        slug={formData.slug}
                        summary={formData.summary}
                        content={formData.content}
                        seoTitle={formData.seo_title}
                        seoDescription={formData.seo_description}
                        focusKeyword={formData.focus_keyword}
                        onUpdate={handleChange}
                    />
                </div>
            </div>
        </form>
    )
}
