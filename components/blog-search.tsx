'use client'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

interface BlogSearchProps {
    tags: string[]
}

export function BlogSearch({ tags }: BlogSearchProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const currentTag = searchParams.get('tag')
    const currentQuery = searchParams.get('q') || ''
    const [searchValue, setSearchValue] = useState(currentQuery)

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== currentQuery) {
                updateSearchParams(searchValue, currentTag)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchValue, currentTag, currentQuery])

    function updateSearchParams(query: string, tag: string | null) {
        const params = new URLSearchParams(searchParams)

        if (query) {
            params.set('q', query)
        } else {
            params.delete('q')
        }

        if (tag) {
            params.set('tag', tag)
        } else {
            params.delete('tag')
        }

        startTransition(() => {
            router.push(`/blog?${params.toString()}`, { scroll: false })
        })
    }

    const handleTagClick = (tag: string) => {
        const formattedTag = tag.replace(/\s+/g, '')
        // Toggle if already selected (checking both raw and formatted)
        if (currentTag === formattedTag || currentTag === tag) {
            updateSearchParams(searchValue, null)
        } else {
            updateSearchParams(searchValue, formattedTag)
        }
    }

    const clearFilters = () => {
        setSearchValue('')
        updateSearchParams('', null)
    }

    const hasActiveFilters = currentQuery || currentTag

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder="Search guides, insights, and playbooks..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="h-12 w-full rounded-2xl bg-white pl-10 shadow-sm dark:bg-slate-900"
                />
                {searchValue && (
                    <button
                        onClick={() => setSearchValue('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Popular topics:
                </span>
                {tags.map((tag) => {
                    const formattedTag = tag.replace(/\s+/g, '')
                    const isActive = currentTag === formattedTag || currentTag === tag

                    return (
                        <Badge
                            key={tag}
                            variant={isActive ? 'default' : 'outline'}
                            className={cn(
                                'cursor-pointer rounded-full px-3 py-1 transition-all hover:bg-primary/90 hover:text-primary-foreground',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-white text-slate-600 hover:border-primary/50 dark:bg-slate-900 dark:text-slate-300'
                            )}
                            onClick={() => handleTagClick(tag)}
                        >
                            #{formattedTag}
                        </Badge>
                    )
                })}

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="ml-2 text-xs text-muted-foreground hover:text-primary hover:underline"
                    >
                        Clear filters
                    </button>
                )}
            </div>
        </div>
    )
}
