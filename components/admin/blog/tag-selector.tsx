"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Plus, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Tag {
    id: string
    name: string
    slug: string
}

interface TagSelectorProps {
    postId?: string
    selectedTags: string[]
    onTagsChange: (tagIds: string[]) => void
}

export default function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
    const supabase = createClient()
    const [tags, setTags] = useState<Tag[]>([])
    const [loading, setLoading] = useState(true)
    const [newTagName, setNewTagName] = useState("")
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        fetchTags()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchTags = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from("blog_tags")
            .select("*")
            .order("name")

        if (error) {
            console.error("Error fetching tags:", error)
        } else {
            setTags(data || [])
        }
        setLoading(false)
    }

    const createTag = async () => {
        if (!newTagName.trim()) return

        setCreating(true)
        const slug = newTagName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "")

        const { data, error } = await supabase
            .from("blog_tags")
            .insert({ name: newTagName.trim(), slug })
            .select()
            .single()

        if (error) {
            toast.error("Failed to create tag")
        } else if (data) {
            setTags([...tags, data])
            onTagsChange([...selectedTags, data.id])
            setNewTagName("")
            toast.success("Tag created")
        }
        setCreating(false)
    }

    const toggleTag = (tagId: string) => {
        if (selectedTags.includes(tagId)) {
            onTagsChange(selectedTags.filter((id) => id !== tagId))
        } else {
            onTagsChange([...selectedTags, tagId])
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-3">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id)
                    return (
                        <Badge
                            key={tag.id}
                            variant={isSelected ? "default" : "outline"}
                            className="cursor-pointer transition-colors"
                            onClick={() => toggleTag(tag.id)}
                        >
                            {tag.name}
                            {isSelected && <X className="ml-1 h-3 w-3" />}
                        </Badge>
                    )
                })}
            </div>

            <div className="flex gap-2">
                <Input
                    placeholder="New tag name..."
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            createTag()
                        }
                    }}
                    className="flex-1"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={createTag}
                    disabled={!newTagName.trim() || creating}
                >
                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                </Button>
            </div>
        </div>
    )
}
