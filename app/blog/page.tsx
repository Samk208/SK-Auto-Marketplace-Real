import { supabaseServer } from '@/lib/supabase-server'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

import BlogPostCard from '@/components/blog-post-card'
import { BlogSearch } from '@/components/blog-search'
import { BlogCopilot } from '@/components/blog/blog-copilot'
import { NewsletterSignup } from '@/components/newsletter-signup'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

// ISR: Revalidate every hour
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog | SK AutoSphere Blog',
  description: 'Korean car buying guides, market insights, and success stories from SK AutoSphere.',
  openGraph: {
    title: 'SK AutoSphere Blog',
    description: 'Import-ready intelligence for African buyers sourcing Korean vehicles.',
    url: 'https://skautosphere.com/blog',
  },
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const query = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q.toLowerCase() : ''
  const tagFilter = typeof resolvedSearchParams.tag === 'string' ? resolvedSearchParams.tag.toLowerCase() : ''

  const supabase = supabaseServer

  // Fetch all tags for filter UI
  const { data: tagsData } = await supabase
    .from('blog_tags')
    .select('name, slug')
    .order('name')

  const allTags = (tagsData || []).map(t => t.name)

  // Fetch posts with their tags using a join
  let queryBuilder = supabase
    .from('blog_posts')
    .select(`
      *,
      blog_post_tags (
        blog_tags (
          name,
          slug
        )
      )
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  // Basic search filtering
  if (query) {
    queryBuilder = queryBuilder.or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
  }

  const { data: rawPosts, error } = await queryBuilder

  if (error) {
    console.error("Error fetching blog posts:", error)
  }


  // Process posts and extract tags
  const allPosts = (rawPosts || []).map(post => {
    const postTags = (post.blog_post_tags || [])
      .map((pt: any) => pt.blog_tags?.name)
      .filter(Boolean) as string[]
    return { ...post, tags: postTags }
  })

  // Filter by tag if specified
  const filteredPosts = tagFilter
    ? allPosts.filter(post =>
      post.tags.some((t: string) => t.toLowerCase().replace(/\s+/g, '') === tagFilter)
    )
    : allPosts

  const sortedPosts = filteredPosts

  const isFiltering = query || tagFilter

  // Layout Logic
  // Find featured post (is_featured = true)
  const heroPostRaw = !isFiltering ? (allPosts.find((post) => post.is_featured) ?? allPosts[0]) : null

  // Exclude hero from the list if we have one
  const postsExcludingHero = isFiltering
    ? sortedPosts
    : sortedPosts.filter(p => !heroPostRaw || p.id !== heroPostRaw.id)

  // Split logic for non-filtered view
  const latestInsights = !isFiltering ? postsExcludingHero.slice(0, 3) : []
  const gridPosts = !isFiltering ? postsExcludingHero.slice(3) : postsExcludingHero

  // Helper to map DB post to Card props
  const mapPostToCard = (post: typeof allPosts[number]) => ({
    title: post.title,
    summary: post.summary,
    slug: post.slug,
    publishedAt: post.published_at,
    readingTime: `${post.reading_time || 5} min read`,
    image: post.cover_image,
    tags: post.tags || [],
    featured: post.is_featured
  })

  const heroPost = heroPostRaw ? mapPostToCard(heroPostRaw) : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'SK AutoSphere Blog',
    description: 'Korean car buying guides, market insights, and success stories from SK AutoSphere.',
    url: 'https://skautosphere.com/blog',
    blogPost: sortedPosts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      datePublished: post.published_at,
      dateModified: post.updated_at,
      description: post.summary,
      url: `https://skautosphere.com/blog/${post.slug}`,
    })),
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* AI Copilot Widget */}
      <BlogCopilot />

      <div className="absolute inset-0 -z-10 opacity-40 blur-3xl" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/10" />
      </div>
      {/* Plus Grid Pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05] bg-grid-plus-black dark:bg-grid-plus-white pointer-events-none" />

      <div className="container space-y-16 py-16 lg:py-24">
        {/* Header Section */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Badge className="rounded-full border-none bg-[#2558fa]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#2558fa]">
              SK AutoSphere Insights
            </Badge>
            <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              Import smarter. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2558fa] to-[#60a5fa]">Drive better.</span>
            </h1>
            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              A modern field guide for sourcing Korean vehicles, de-risking logistics, and scaling dealership operations.
            </p>

            {/* Search Component */}
            <div className="max-w-xl">
              <Suspense fallback={<div className="h-12 rounded-xl bg-slate-100 animate-pulse" />}>
                <BlogSearch tags={allTags} />
              </Suspense>
            </div>
          </div>

          {/* Hero Post - Only show if not filtering */}
          {!isFiltering && heroPost && (
            <Link
              href={`/blog/${heroPost.slug}`}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-950 text-white shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-2 dark:border-slate-800 block aspect-[4/3] lg:aspect-auto lg:h-full"
              aria-label={`Open featured post ${heroPost.title}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
              {heroPost.image ? (
                <Image
                  src={heroPost.image}
                  alt={heroPost.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  priority
                />
              ) : null}
              <div className="relative flex h-full flex-col justify-end space-y-4 p-8">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                  <Sparkles className="h-4 w-4" />
                  Featured field report
                </div>
                <h2 className="text-3xl font-semibold leading-tight">{heroPost.title}</h2>
                <p className="text-base text-slate-200 line-clamp-2">{heroPost.summary}</p>
              </div>
            </Link>
          )}
        </div>

        {/* Results Section */}
        {isFiltering ? (
          <section className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-primary/70">Search Results</p>
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">
                  Found {sortedPosts.length} matches
                </h2>
              </div>
            </div>

            {sortedPosts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {gridPosts.map((post) => {
                  const props = mapPostToCard(post)
                  return (
                    <BlogPostCard
                      key={props.slug}
                      {...props}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg text-slate-500">No matching posts found. Try adjusting your search.</p>
                <Button variant="link" className="mt-2 text-primary" onClick={() => window.history.back()}>
                  Clear Filters
                </Button>
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="space-y-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-primary/70">Latest analysis</p>
                  <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Fresh off the trading floor</h2>
                </div>
                <Link
                  href="/shop"
                  className="text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-8"
                >
                  Browse inventory intelligence
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {latestInsights.map((post) => {
                  const props = mapPostToCard(post)
                  return (
                    <BlogPostCard
                      key={props.slug}
                      {...props}
                    />
                  )
                })}
              </div>
            </section>

            {gridPosts.length > 0 && (
              <section className="space-y-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-primary/70">Knowledge base</p>
                    <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Deep dives & playbooks</h2>
                  </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {gridPosts.map((post) => {
                    const props = mapPostToCard(post)
                    return (
                      <BlogPostCard
                        key={props.slug}
                        {...props}
                      />
                    )
                  })}
                </div>
              </section>
            )}
          </>
        )}

        {/* Newsletter Section */}
        <NewsletterSignup />
      </div>
    </div>
  )
}
