"use client"

import ImportModal from "@/components/admin/blog/import-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function BlogAdminHeader() {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
                <p className="text-muted-foreground mt-1">Manage your blog content and publications.</p>
            </div>
            <div className="flex items-center gap-2">
                <ImportModal />
                <Link href="/admin/blog/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Post
                    </Button>
                </Link>
            </div>
        </div>
    )
}
