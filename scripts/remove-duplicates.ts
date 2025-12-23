/**
 * Remove duplicate parts from Supabase
 * Strategy: Keep the first occurrence (by created_at), delete duplicates
 * Run with: npx tsx scripts/remove-duplicates.ts
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface Part {
  id: string
  name: string
  part_number: string
  created_at: string
}

async function removeDuplicates() {
  console.log('Fetching all parts from Supabase...')
  
  const { data: parts, error } = await supabase
    .from('parts')
    .select('id, name, part_number, created_at')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching parts:', error)
    process.exit(1)
  }

  if (!parts || parts.length === 0) {
    console.log('No parts found')
    process.exit(0)
  }

  console.log(`Found ${parts.length} total parts`)

  // Find duplicates by part_number (excluding N/A and empty)
  const byPartNumber: Record<string, Part[]> = {}
  parts.forEach((p: Part) => {
    if (p.part_number && p.part_number !== 'N/A' && p.part_number.trim() !== '') {
      const key = p.part_number.trim().toLowerCase()
      if (!byPartNumber[key]) byPartNumber[key] = []
      byPartNumber[key].push(p)
    }
  })

  // Find duplicates by name
  const byName: Record<string, Part[]> = {}
  parts.forEach((p: Part) => {
    if (p.name && p.name.trim() !== '') {
      const key = p.name.trim().toLowerCase()
      if (!byName[key]) byName[key] = []
      byName[key].push(p)
    }
  })

  // Collect IDs to delete (keep first, delete rest)
  const idsToDelete = new Set<string>()

  // From part number duplicates
  Object.values(byPartNumber).forEach(group => {
    if (group.length > 1) {
      // Keep first (oldest by created_at), mark rest for deletion
      group.slice(1).forEach(p => idsToDelete.add(p.id))
    }
  })

  // From name duplicates (only if not already marked)
  Object.values(byName).forEach(group => {
    if (group.length > 1) {
      group.slice(1).forEach(p => {
        if (!idsToDelete.has(p.id)) {
          idsToDelete.add(p.id)
        }
      })
    }
  })

  console.log(`\nFound ${idsToDelete.size} duplicate parts to remove`)

  if (idsToDelete.size === 0) {
    console.log('No duplicates to remove!')
    return
  }

  // Convert to array
  const deleteIds = Array.from(idsToDelete)
  
  console.log('\nSample IDs to delete:', deleteIds.slice(0, 10).join(', '))
  console.log('\nDeleting duplicates...')

  // Delete in batches of 50
  let deleted = 0
  const batchSize = 50

  for (let i = 0; i < deleteIds.length; i += batchSize) {
    const batch = deleteIds.slice(i, i + batchSize)
    
    const { error: deleteError } = await supabase
      .from('parts')
      .delete()
      .in('id', batch)

    if (deleteError) {
      console.error(`Error deleting batch ${i / batchSize + 1}:`, deleteError)
    } else {
      deleted += batch.length
      console.log(`Deleted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} parts (total: ${deleted})`)
    }
  }

  console.log(`\n✅ Removed ${deleted} duplicate parts`)
  console.log(`Remaining parts: ${parts.length - deleted}`)
}

removeDuplicates().catch(console.error)
