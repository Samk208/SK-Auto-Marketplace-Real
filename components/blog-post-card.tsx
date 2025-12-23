import { MoveRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { ViewCounter } from '@/components/blog/view-counter'
import { Badge } from '@/components/ui/badge'

interface BlogPostCardProps {
  title: string
  summary: string | null
  slug: string
  publishedAt: string | null
  readingTime: string
  image?: string | null
  tags?: string[]
  featured?: boolean
}

export default function BlogPostCard({
  title,
  summary,
  slug,
  publishedAt,
  readingTime,
  image,
  tags,
  featured,
}: BlogPostCardProps) {
  const formattedDate = publishedAt 
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Draft'

  return (
    <Link
      href={`/blog/${slug}`}
      className="group block h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
      aria-label={`Read blog post ${title}`}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="relative h-56 w-full overflow-hidden">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40" />
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              priority={featured}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-100 text-slate-300">
              <span className="text-4xl font-bold tracking-tighter opacity-20">SK</span>
            </div>
          )}
          {featured && (
            <Badge className="absolute left-4 top-4 z-20 border-none bg-[#2558fa] text-white shadow-md">
              Featured
            </Badge>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-4 px-6 py-6">
          <div className="flex flex-wrap items-center justify-between text-xs font-medium uppercase tracking-wider text-primary">
            <div className="flex items-center gap-2">
              <span>{formattedDate}</span>
              <span className="text-slate-300">•</span>
              <span>{readingTime}</span>
            </div>
            {/* View Counter */}
            <ViewCounter slug={slug} />
          </div>

          <div>
            <h3 className="text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#2558fa] dark:text-white">
              {title}
            </h3>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {summary}
            </p>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50">
            {tags && tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200">
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && <span className="text-xs text-slate-400">+{tags.length - 3}</span>}
              </div>
            ) : (
              <div className="flex items-center text-sm font-semibold text-[#2558fa]">
                Read article <MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
