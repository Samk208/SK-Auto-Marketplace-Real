'use client'

import { Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ViewCounter({ slug, trackView = false }: { slug: string; trackView?: boolean }) {
    const [views, setViews] = useState<number | null>(null)

    useEffect(() => {
        const fetchViews = async () => {
            try {
                // Track view if requested (usually only on detail page)
                if (trackView) {
                    await fetch(`/api/blog/views/${slug}`, { method: 'POST' })
                }

                // Get updated count
                const res = await fetch(`/api/blog/views/${slug}`)
                const data = await res.json()
                setViews(data.views)
            } catch (error) {
                console.error('Failed to sync views', error)
            }
        }

        fetchViews()
    }, [slug, trackView])

    if (views === null) return null // or skeleton

    return (
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Eye className="h-3.5 w-3.5" />
            {views.toLocaleString()}
        </span>
    )
}
