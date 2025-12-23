/**
 * Blog Import API - Bulk Import Posts
 * 
 * POST /api/blog/import
 * - Accepts Word (.docx), Markdown (.md), and HTML files
 * - Converts to HTML/Markdown and stores in blog_posts
 * - Admin-only endpoint
 */

import { isAdmin } from '@/lib/auth/supabase-auth-server'
import { supabaseServer } from '@/lib/supabase-server'
import mammoth from 'mammoth'
import { NextRequest, NextResponse } from 'next/server'

interface ImportedPost {
  id: string
  title: string
  slug: string
}

export async function POST(request: NextRequest) {
  try {
    // 1. Check admin auth
    const userIsAdmin = await isAdmin()
    if (!userIsAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = supabaseServer

    // 2. Parse form data
    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const source = (formData.get('source') as string) || 'unknown'

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    const importedPosts: ImportedPost[] = []
    const errors: string[] = []

    // 3. Process each file
    for (const file of files) {
      try {
        let content = ''
        let title = file.name.replace(/\.(docx|md|html)$/i, '')

        // Parse based on file type
        if (file.name.toLowerCase().endsWith('.docx')) {
          const arrayBuffer = await file.arrayBuffer()
          const result = await mammoth.convertToHtml({ 
            buffer: Buffer.from(arrayBuffer) 
          })
          content = result.value
        } else if (file.name.toLowerCase().endsWith('.md')) {
          // For markdown, convert to HTML for consistency with TipTap editor
          const text = await file.text()
          content = markdownToHtml(text)
        } else if (file.name.toLowerCase().endsWith('.html')) {
          content = await file.text()
        } else {
          errors.push(`Unsupported file type: ${file.name}`)
          continue
        }

        // Extract title from content if present (h1 tag)
        const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/i)
        if (h1Match) {
          title = h1Match[1].replace(/<[^>]+>/g, '').trim()
          content = content.replace(h1Match[0], '')
        }

        // Generate slug
        const slug = generateSlug(title)

        // Calculate reading time
        const plainText = content.replace(/<[^>]+>/g, '').trim()
        const wordCount = plainText.split(/\s+/).length
        const readingTime = Math.ceil(wordCount / 200)

        // Extract summary (first paragraph or first 200 chars)
        const summaryMatch = content.match(/<p[^>]*>(.*?)<\/p>/i)
        const summary = summaryMatch 
          ? summaryMatch[1].replace(/<[^>]+>/g, '').substring(0, 200)
          : plainText.substring(0, 200)

        // Check if slug already exists
        const { data: existing } = await supabase
          .from('blog_posts')
          .select('slug')
          .eq('slug', slug)
          .single()

        const finalSlug = existing ? `${slug}-${Date.now()}` : slug

        // Insert post
        const { data: post, error: insertError } = await supabase
          .from('blog_posts')
          .insert({
            title,
            slug: finalSlug,
            summary,
            content,
            reading_time: readingTime,
            status: 'draft',
          })
          .select()
          .single()

        if (insertError) {
          errors.push(`Failed to import ${file.name}: ${insertError.message}`)
        } else {
          importedPosts.push(post)
        }
      } catch (fileError: any) {
        errors.push(`Error processing ${file.name}: ${fileError.message}`)
      }
    }

    // 4. Log import to blog_imports table
    if (importedPosts.length > 0) {
      await supabase.from('blog_imports').insert({
        source,
        file_name: files.map(f => f.name).join(', '),
        posts_imported: importedPosts.length,
        metadata: { 
          file_count: files.length,
          errors: errors.length > 0 ? errors : undefined
        }
      })
    }

    return NextResponse.json({
      success: true,
      imported: importedPosts.length,
      posts: importedPosts,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error: any) {
    console.error('Blog import error:', error)
    return NextResponse.json(
      { error: 'Import failed', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100)
}

/**
 * Basic markdown to HTML conversion
 * For production, consider using remark/rehype
 */
function markdownToHtml(markdown: string): string {
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" />')
    // Line breaks / paragraphs
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br />')

  // Wrap in paragraph tags
  html = `<p>${html}</p>`
  
  return html
}
