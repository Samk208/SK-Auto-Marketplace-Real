/**
 * Export Parts Data from Supabase to CSV
 * Run with: npx tsx scripts/export-parts-to-csv.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Actual schema from Supabase parts table
interface Part {
  id: string
  name: string
  part_number: string
  category: string
  subcategory: string | null
  brand: string
  manufacturer: string | null
  condition: string
  compatibility: string | null
  price_krw: number
  price_usd: number
  stock_status: string
  shipping_time: string | null
  image: string  // Single image URL
  is_new: boolean
  created_at: string
  updated_at: string
}

function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return 'invalid-url'
  }
}

// Determine segment based on ID prefix or other indicators
function getSegment(part: Part): 'new' | 'used' | 'machine' {
  const id = part.id.toLowerCase()
  if (id.startsWith('n')) return 'new'
  if (id.startsWith('u')) return 'used'
  if (id.startsWith('m') || id.startsWith('w')) return 'machine'
  // Fallback based on is_new flag
  return part.is_new ? 'new' : 'used'
}

async function exportParts() {
  console.log('Fetching parts from Supabase...')
  
  const { data: parts, error } = await supabase
    .from('parts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching parts:', error)
    process.exit(1)
  }

  if (!parts || parts.length === 0) {
    console.log('No parts found in database')
    process.exit(0)
  }

  console.log(`Found ${parts.length} parts total`)

  // Group by segment (derived from ID prefix)
  const newParts = parts.filter(p => getSegment(p) === 'new')
  const usedParts = parts.filter(p => getSegment(p) === 'used')
  const machineParts = parts.filter(p => getSegment(p) === 'machine')

  console.log(`- New parts: ${newParts.length}`)
  console.log(`- Used parts: ${usedParts.length}`)
  console.log(`- Machine/Wholesale parts: ${machineParts.length}`)

  const outputDir = path.join(process.cwd(), 'docs', 'auto part workflow', 'Clean Data for import')
  
  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // CSV Headers
  const headers = [
    'ID',
    'Name',
    'Part Number',
    'Brand',
    'Manufacturer',
    'Category',
    'Subcategory',
    'Segment',
    'Condition',
    'Compatibility',
    'Price KRW',
    'Price USD',
    'Stock Status',
    'Shipping Time',
    'Image URL',
    'Image Source Domain',
    'Is New',
    'Created At'
  ].join(',')

  function partsToCSV(partsList: Part[]): string {
    const rows = partsList.map(part => {
      const imageDomain = part.image ? extractDomain(part.image) : ''
      
      return [
        escapeCSV(part.id),
        escapeCSV(part.name),
        escapeCSV(part.part_number),
        escapeCSV(part.brand),
        escapeCSV(part.manufacturer),
        escapeCSV(part.category),
        escapeCSV(part.subcategory),
        escapeCSV(getSegment(part)),
        escapeCSV(part.condition),
        escapeCSV(part.compatibility),
        escapeCSV(part.price_krw),
        escapeCSV(part.price_usd),
        escapeCSV(part.stock_status),
        escapeCSV(part.shipping_time),
        escapeCSV(part.image),
        escapeCSV(imageDomain),
        escapeCSV(part.is_new),
        escapeCSV(part.created_at)
      ].join(',')
    })

    return [headers, ...rows].join('\n')
  }

  // Export all parts
  const allPartsCSV = partsToCSV(parts as Part[])
  fs.writeFileSync(path.join(outputDir, 'SUPABASE_ALL_PARTS.csv'), allPartsCSV)
  console.log(`\nExported: SUPABASE_ALL_PARTS.csv (${parts.length} parts)`)

  // Export by segment
  if (newParts.length > 0) {
    fs.writeFileSync(path.join(outputDir, 'SUPABASE_NEW_PARTS.csv'), partsToCSV(newParts as Part[]))
    console.log(`Exported: SUPABASE_NEW_PARTS.csv (${newParts.length} parts)`)
  }

  if (usedParts.length > 0) {
    fs.writeFileSync(path.join(outputDir, 'SUPABASE_USED_PARTS.csv'), partsToCSV(usedParts as Part[]))
    console.log(`Exported: SUPABASE_USED_PARTS.csv (${usedParts.length} parts)`)
  }

  if (machineParts.length > 0) {
    fs.writeFileSync(path.join(outputDir, 'SUPABASE_MACHINE_PARTS.csv'), partsToCSV(machineParts as Part[]))
    console.log(`Exported: SUPABASE_MACHINE_PARTS.csv (${machineParts.length} parts)`)
  }

  // Summary of image sources
  const imageDomains: Record<string, number> = {}
  parts.forEach((part: Part) => {
    if (part.image) {
      const domain = extractDomain(part.image)
      imageDomains[domain] = (imageDomains[domain] || 0) + 1
    }
  })

  console.log('\n--- Image Source Domains ---')
  Object.entries(imageDomains)
    .sort((a, b) => b[1] - a[1])
    .forEach(([domain, count]) => {
      console.log(`  ${domain}: ${count} images`)
    })

  // Save summary
  const summary = {
    exportDate: new Date().toISOString(),
    totalParts: parts.length,
    bySegment: {
      new: newParts.length,
      used: usedParts.length,
      machine: machineParts.length
    },
    imageSources: imageDomains
  }

  fs.writeFileSync(
    path.join(outputDir, 'SUPABASE_EXPORT_SUMMARY.json'),
    JSON.stringify(summary, null, 2)
  )
  console.log('\nExported: SUPABASE_EXPORT_SUMMARY.json')

  console.log('\n✅ Export complete!')
  console.log(`Files saved to: ${outputDir}`)
}

exportParts().catch(console.error)
