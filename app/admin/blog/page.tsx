import BlogAdminHeader from "@/components/admin/blog/blog-admin-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { supabaseServer } from "@/lib/supabase-server"
import { format } from "date-fns"
import { Edit, Eye, FileText } from "lucide-react"
import Link from "next/link"

export const metadata = {
    title: 'Blog Management',
}

export default async function BlogAdminPage() {
    const supabase = supabaseServer

    const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, status, published_at, views, author_id, created_at')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching posts:", error)
    }

    return (
        <div className="space-y-6">
            <BlogAdminHeader />

            <div className="rounded-md border bg-white dark:bg-slate-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Published</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts && posts.length > 0 ? (
                            posts.map((post) => (
                                <TableRow key={post.id}>
                                    <TableCell className="font-medium">
                                        <Link href={`/admin/blog/${post.id}`} className="hover:underline">
                                            {post.title}
                                        </Link>
                                        <div className="text-xs text-muted-foreground mt-1">/{post.slug}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                            {post.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/blog/${post.slug}`} target="_blank">
                                                <Button variant="ghost" size="icon" title="View Live">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/blog/${post.id}`}>
                                                <Button variant="ghost" size="icon" title="Edit">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                                        <FileText className="h-8 w-8 mb-2 opacity-50" />
                                        <p>No posts found. Create your first blog post!</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
