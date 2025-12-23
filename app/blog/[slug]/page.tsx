import { supabaseServer } from '@/lib/supabase-server'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import BlogLayout from '@/components/blog-layout'
import BlogPostCard from '@/components/blog-post-card'
import { ViewCounter } from '@/components/blog/view-counter'
import { NewsletterSignup } from '@/components/newsletter-signup'
import { Badge } from '@/components/ui/badge'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, Share2, User } from 'lucide-react'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for ISR?
// For Supabase, we can use `generateStaticParams` to fetch slugs but 
// with a large DB this might be slow. We can fetch top 100 recent.
// For now, let's keep it dynamic or generate some.
export async function generateStaticParams() {
  const supabase = supabaseServer
  const { data: posts } = await supabase.from('blog_posts').select('slug').eq('status', 'published').limit(20)
  return (posts || []).map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = supabaseServer

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!post) {
    return {
      title: 'Post not found | SK AutoSphere Blog',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: `${post.seo_title || post.title} | SK AutoSphere Blog`,
    description: post.seo_description || post.summary,
    alternates: {
      canonical: `https://skautosphere.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.seo_title || post.title,
      description: post.seo_description || post.summary || undefined,
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: ['SK AutoSphere'], // We could fetch author name if joined
      images: post.cover_image ? [{ url: post.cover_image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary || undefined,
      images: post.cover_image ? [post.cover_image] : undefined,
    },
  }
}

import { AuthorBio } from '@/components/blog/author-bio'
import { ReadingProgress } from '@/components/blog/reading-progress'

// ... existing imports ...

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // ... existing data fetching logic ...
  const { slug } = await params
  const supabase = supabaseServer

  // Fetch Post
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published') // Ensure only published
    .single()

  if (!post) {
    notFound()
  }

  // Content from TipTap editor - already sanitized on input
  // We trust the admin-created content since it comes from our CMS
  const cleanContent = post.content || ''

  // Fetch Related Posts
  // For "Related", we can basically fetch 3 random recent posts excluding current
  // In future, use PostgreSQL similarity search on tags or embeddings.
  // For now: Recent 3 excluding ID.
  const { data: relatedRaw } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .neq('id', post.id)
    .order('published_at', { ascending: false })
    .limit(3)

  const relatedPosts = (relatedRaw || []).map(p => ({
    title: p.title,
    summary: p.summary,
    slug: p.slug,
    publishedAt: p.published_at,
    readingTime: `${p.reading_time || 5} min read`,
    image: p.cover_image,
    tags: [], // No tags for now
    featured: p.is_featured
  }))


  const formattedDate = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) : 'Draft'

  // JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: post.cover_image,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: 'SK AutoSphere',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://skautosphere.com/blog/${post.slug}`
    },
    publisher: {
      '@type': 'Organization',
      name: 'SK AutoSphere',
      logo: {
        '@type': 'ImageObject',
        url: 'https://skautosphere.com/logo.png',
      },
    },
  }

  return (
    <BlogLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ReadingProgress />

      <div className="mb-8">
        <Breadcrumb className="text-sm font-medium text-slate-500">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="hover:text-[#2558fa] transition-colors">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/blog" className="hover:text-[#2558fa] transition-colors">Blog</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-slate-900 dark:text-slate-100">
                {post.title.length > 40 ? post.title.substring(0, 40) + '...' : post.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <section className="space-y-10">
        {post.cover_image && (
          <div className="relative overflow-hidden rounded-xl border border-slate-200 shadow-2xl dark:border-slate-800 group">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
            {/* Plus Grid Overlay on Hero */}
            <div className="absolute inset-0 bg-grid-plus-white opacity-[0.05] pointer-events-none" />

            <Image
              src={post.cover_image}
              alt={post.title}
              width={1360}
              height={740}
              className="h-[420px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <Badge className="rounded-full border-none bg-[#2558fa] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                SK AutoSphere Insights
              </Badge>
              <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl text-balance">
                {post.title}
              </h1>
              <p className="mt-4 max-w-3xl text-lg text-white/90 leading-relaxed font-light">{post.summary}</p>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[3fr_1fr]">
          <article className="space-y-8 rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2 text-slate-900 dark:text-white">
                <User className="h-4 w-4 text-[#2558fa]" />
                SK AutoSphere
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#2558fa]" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#2558fa]" />
                {post.reading_time || 5} min read
              </span>
              <div className="flex items-center gap-2">
                <ViewCounter slug={post.slug} trackView={true} />
              </div>
            </div>

            <Separator className="bg-slate-100 dark:bg-slate-800" />

            {/* Content Injection with Enhanced Typography */}
            <div
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: cleanContent }}
            />

            <Separator className="bg-slate-100 dark:bg-slate-800" />

            {/* Author Bio */}
            <AuthorBio />

            {/* Newsletter Section inside article */}
            <div className="py-8">
              <NewsletterSignup />
            </div>

          </article>

          <aside className="space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Share Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Share insight</h3>
                <p className="mt-2 text-sm text-slate-500">Send this playbook to your sourcing or logistics team.</p>
                <div className="mt-4 space-y-3">
                  <Button asChild variant="secondary" className="w-full justify-between rounded-lg bg-slate-50 hover:bg-slate-100">
                    <Link
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://skautosphere.com/blog/${post.slug}`)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>Share on X</span>
                      <Share2 className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Help Card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
                <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">Need help?</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Our sourcing desk can run VIN-level profitability forecasts within 24 hours.
                </p>
                <Button asChild className="mt-4 w-full rounded-md bg-[#2558fa] hover:bg-[#1a3ec1]">
                  <Link href="/dealer/dashboard">Talk to an advisor</Link>
                </Button>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="space-y-8 pt-12 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-primary/70">Recommended Reading</p>
                <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Related insights</h2>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((post) => (
                <BlogPostCard
                  key={post.slug}
                  title={post.title}
                  summary={post.summary}
                  slug={post.slug}
                  publishedAt={post.publishedAt}
                  readingTime={post.readingTime}
                  image={post.image}
                  tags={post.tags}
                  featured={post.featured}
                />
              ))}
            </div>
          </section>
        )}
      </section>
    </BlogLayout>
  )
}
