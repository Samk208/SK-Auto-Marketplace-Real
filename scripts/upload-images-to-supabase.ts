/**
 * Upload local part images to Supabase Storage
 * Run with: npx tsx scripts/upload-images-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const BUCKET_NAME = 'parts-images'
const IMAGE_DIR = 'docs/auto part workflow/Clean Data for import/images'

interface UploadResult {
  partId: string
  status: 'uploaded' | 'failed' | 'missing'
  oldUrl?: string
  newUrl?: string
  error?: string
}

async function ensureBucketExists() {
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some(b => b.name === BUCKET_NAME)
  
  if (!exists) {
    console.log(`Creating bucket: ${BUCKET_NAME}`)
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 5242880 // 5MB
    })
    if (error) {
      console.error('Error creating bucket:', error)
      process.exit(1)
    }
  }
  console.log(`Bucket ready: ${BUCKET_NAME}`)
}

function getLocalImagePath(partId: string): string | null {
  const segments = ['new', 'used', 'machine']
  const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
  
  for (const seg of segments) {
    for (const ext of extensions) {
      const filePath = path.join(IMAGE_DIR, seg, `${partId}.${ext}`)
      if (fs.existsSync(filePath)) {
        return filePath
      }
    }
    // Also check nested folders (machine/machine, etc.)
    for (const ext of extensions) {
      const filePath = path.join(IMAGE_DIR, seg, seg, `${partId}.${ext}`)
      if (fs.existsSync(filePath)) {
        return filePath
      }
    }
  }
  return null
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  }
  return mimeTypes[ext] || 'image/jpeg'
}

async function uploadImage(partId: string, localPath: string): Promise<string> {
  const fileBuffer = fs.readFileSync(localPath)
  const ext = path.extname(localPath)
  const storagePath = `parts/${partId}${ext}`
  
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: getMimeType(localPath),
      upsert: true
    })

  if (error) {
    throw new Error(error.message)
  }

  // Get public URL
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath)

  return data.publicUrl
}

async function main() {
  console.log('=== Upload Images to Supabase Storage ===\n')

  // Ensure bucket exists
  await ensureBucketExists()

  // Get all parts from database
  console.log('\nFetching parts from database...')
  const { data: parts, error } = await supabase
    .from('parts')
    .select('id, name, image')
    .order('id')

  if (error) {
    console.error('Error fetching parts:', error)
    process.exit(1)
  }

  console.log(`Found ${parts.length} parts\n`)

  const results: UploadResult[] = []
  let uploaded = 0
  let missing = 0
  let failed = 0

  // Process each part
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const localPath = getLocalImagePath(part.id)

    if (!localPath) {
      results.push({
        partId: part.id,
        status: 'missing',
        oldUrl: part.image
      })
      missing++
      continue
    }

    try {
      const newUrl = await uploadImage(part.id, localPath)
      
      // Update database with new URL
      const { error: updateError } = await supabase
        .from('parts')
        .update({ image: newUrl })
        .eq('id', part.id)

      if (updateError) {
        throw new Error(`DB update failed: ${updateError.message}`)
      }

      results.push({
        partId: part.id,
        status: 'uploaded',
        oldUrl: part.image,
        newUrl: newUrl
      })
      uploaded++

      if (uploaded % 50 === 0) {
        console.log(`Progress: ${uploaded} uploaded, ${missing} missing, ${failed} failed`)
      }
    } catch (err) {
      results.push({
        partId: part.id,
        status: 'failed',
        oldUrl: part.image,
        error: err instanceof Error ? err.message : String(err)
      })
      failed++
    }
  }

  // Summary
  console.log('\n=== UPLOAD COMPLETE ===')
  console.log(`Total parts: ${parts.length}`)
  console.log(`Uploaded: ${uploaded}`)
  console.log(`Missing local image: ${missing}`)
  console.log(`Failed: ${failed}`)

  // Save report
  const reportDir = 'docs/auto part workflow/Clean Data for import'
  
  const missingParts = results.filter(r => r.status === 'missing')
  const failedParts = results.filter(r => r.status === 'failed')

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: parts.length,
      uploaded,
      missing,
      failed
    },
    missingImages: missingParts.map(r => ({
      id: r.partId,
      currentImageUrl: r.oldUrl
    })),
    failedUploads: failedParts.map(r => ({
      id: r.partId,
      error: r.error
    }))
  }

  fs.writeFileSync(
    path.join(reportDir, 'IMAGE_UPLOAD_REPORT.json'),
    JSON.stringify(report, null, 2)
  )

  // Also save missing parts as CSV for easy review
  if (missingParts.length > 0) {
    const missingCsv = 'Part ID,Current Image URL\n' + 
      missingParts.map(r => `${r.partId},"${r.oldUrl || ''}"`).join('\n')
    fs.writeFileSync(path.join(reportDir, 'MISSING_IMAGES.csv'), missingCsv)
  }

  console.log('\nReports saved:')
  console.log('- IMAGE_UPLOAD_REPORT.json')
  if (missingParts.length > 0) {
    console.log('- MISSING_IMAGES.csv')
  }
}

main().catch(console.error)
