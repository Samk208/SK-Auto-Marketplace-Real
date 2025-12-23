import PostForm from "@/components/admin/blog/post-form"
import { supabaseServer } from "@/lib/supabase-server"
import { notFound } from "next/navigation"

interface EditPostPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { id } = await params
    const supabase = supabaseServer

    const { data: post } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()

    if (!post) {
        notFound()
    }

    return (
        <div className="container mx-auto py-6">
            <PostForm initialData={post} isEditing />
        </div>
    )
}
