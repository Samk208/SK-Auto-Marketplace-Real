"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import ImageExtension from "@tiptap/extension-image"
import LinkExtension from "@tiptap/extension-link"
import { Table } from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import Youtube from "@tiptap/extension-youtube"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
    Bold,
    Heading1,
    Heading2,
    Image as ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Loader2,
    Quote,
    Redo,
    Strikethrough,
    Table as TableIcon,
    Undo,
    Upload,
    Video as VideoIcon
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { Callout } from "./extensions/callout"
import { SlashCommand, slashCommandConfig } from "./extensions/slash-command"

interface RichEditorProps {
    content: string
    onChange: (content: string) => void
    editable?: boolean
}

export default function RichEditor({ content, onChange, editable = true }: RichEditorProps) {
    const [imageDialogOpen, setImageDialogOpen] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    const editor = useEditor({
        extensions: [
            StarterKit,
            LinkExtension.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-blue-500 underline cursor-pointer",
                },
            }),
            ImageExtension.configure({
                HTMLAttributes: {
                    class: "rounded-lg border border-slate-200 shadow-sm max-w-full",
                },
            }),
            Youtube.configure({
                controls: false,
                nocookie: true,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Callout,
            SlashCommand.configure(slashCommandConfig),
        ],
        content,
        editable,
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3",
                    // Table styles
                    "[&_table]:border-collapse [&_table]:border [&_table]:border-slate-200 [&_table]:w-full [&_table]:my-4",
                    "[&_th]:border [&_th]:border-slate-200 [&_th]:p-2 [&_th]:bg-slate-50 [&_th]:font-semibold [&_th]:text-left",
                    "[&_td]:border [&_td]:border-slate-200 [&_td]:p-2",
                    !editable && "opacity-50 cursor-not-allowed"
                ),
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    useEffect(() => {
        const handleOpenImageDialog = () => setImageDialogOpen(true)
        window.addEventListener('open-image-dialog', handleOpenImageDialog)
        return () => window.removeEventListener('open-image-dialog', handleOpenImageDialog)
    }, [])

    if (!editor) {
        return null
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
            const filePath = `content/${fileName}`

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

            // Insert image into editor
            editor.chain().focus().setImage({ src: publicUrl }).run()
            setImageDialogOpen(false)
            toast.success('Image uploaded successfully!')
        } catch (error: any) {
            console.error('Upload error:', error)
            toast.error(error.message || 'Failed to upload image')
        } finally {
            setUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleImageUrlSubmit = () => {
        if (imageUrl && imageUrl.startsWith('http')) {
            editor.chain().focus().setImage({ src: imageUrl }).run()
            setImageUrl("")
            setImageDialogOpen(false)
            toast.success('Image inserted!')
        } else {
            toast.error('Please enter a valid URL starting with http:// or https://')
        }
    }

    const addImage = () => {
        setImageDialogOpen(true)
    }

    const addVideo = () => {
        const url = prompt('Enter YouTube URL')
        if (url) {
            editor.chain().focus().setYoutubeVideo({ src: url }).run()
        }
    }

    const addTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href
        const url = window.prompt("URL", previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
            return
        }

        // update
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }

    return (
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
            {editable && (
                <>
                    {/* Desktop Toolbar */}
                    <div className="hidden lg:flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 flex-wrap gap-1 items-center sticky top-0 z-10">
                        <Toggle
                            size="sm"
                            pressed={editor.isActive("bold")}
                            onPressedChange={() => editor.chain().focus().toggleBold().run()}
                            aria-label="Toggle bold"
                        >
                            <Bold className="h-4 w-4" />
                        </Toggle>
                        <Toggle
                            size="sm"
                            pressed={editor.isActive("italic")}
                            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                            aria-label="Toggle italic"
                        >
                            <Italic className="h-4 w-4" />
                        </Toggle>
                        <Toggle
                            size="sm"
                            pressed={editor.isActive("strike")}
                            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                            aria-label="Toggle strikethrough"
                        >
                            <Strikethrough className="h-4 w-4" />
                        </Toggle>

                        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                        <Toggle
                            size="sm"
                            pressed={editor.isActive("heading", { level: 1 })}
                            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            aria-label="Heading 1"
                        >
                            <Heading1 className="h-4 w-4" />
                        </Toggle>
                        <Toggle
                            size="sm"
                            pressed={editor.isActive("heading", { level: 2 })}
                            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            aria-label="Heading 2"
                        >
                            <Heading2 className="h-4 w-4" />
                        </Toggle>

                        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                        <Toggle
                            size="sm"
                            pressed={editor.isActive("bulletList")}
                            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                            aria-label="Bullet list"
                        >
                            <List className="h-4 w-4" />
                        </Toggle>
                        <Toggle
                            size="sm"
                            pressed={editor.isActive("orderedList")}
                            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                            aria-label="Ordered list"
                        >
                            <ListOrdered className="h-4 w-4" />
                        </Toggle>

                        <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-1" />

                        <Toggle
                            size="sm"
                            pressed={editor.isActive("blockquote")}
                            onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                            aria-label="Blockquote"
                        >
                            <Quote className="h-4 w-4" />
                        </Toggle>
                        <Button variant="ghost" size="sm" onClick={setLink} className={editor.isActive('link') ? 'bg-slate-200 dark:bg-slate-700' : ''}>
                            <LinkIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={addImage}>
                            <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={addVideo}>
                            <VideoIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={addTable}>
                            <TableIcon className="h-4 w-4" />
                        </Button>

                        <div className="flex-1" />

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().undo()}
                        >
                            <Undo className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().redo()}
                        >
                            <Redo className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Mobile Sticky Toolbar */}
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2 z-50 flex items-center justify-around safe-area-bottom shadow-lg">
                        <Toggle
                            size="sm"
                            pressed={editor.isActive("bold")}
                            onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        >
                            <Bold className="h-5 w-5" />
                        </Toggle>
                        <Toggle
                            size="sm"
                            pressed={editor.isActive("italic")}
                            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        >
                            <Italic className="h-5 w-5" />
                        </Toggle>
                        <Toggle
                            size="sm"
                            pressed={editor.isActive("heading", { level: 2 })}
                            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        >
                            <Heading2 className="h-5 w-5" />
                        </Toggle>
                        <Button variant="ghost" size="sm" onClick={setLink} className={editor.isActive('link') ? 'bg-slate-200 dark:bg-slate-700' : ''}>
                            <LinkIcon className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={addImage}>
                            <ImageIcon className="h-5 w-5" />
                        </Button>
                    </div>
                </>
            )}
            <EditorContent editor={editor} />

            {/* Image Upload Dialog */}
            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Insert Image</DialogTitle>
                        <DialogDescription>
                            Upload an image or paste a URL
                        </DialogDescription>
                    </DialogHeader>

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

                        <TabsContent value="upload" className="space-y-4 pt-4">
                            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
                                <Upload className="h-10 w-10 text-slate-400 mb-4" />
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                    Select an image to upload
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-500 mb-4">
                                    JPG, PNG, GIF or WebP (Max 10MB)
                                </p>
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="hidden"
                                    id="editor-image-upload"
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

                        <TabsContent value="url" className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="image-url">Image URL</Label>
                                <Input
                                    id="image-url"
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleImageUrlSubmit()
                                        }
                                    }}
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setImageDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleImageUrlSubmit}
                                    disabled={!imageUrl}
                                >
                                    Insert Image
                                </Button>
                            </DialogFooter>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        </div>
    )
}
