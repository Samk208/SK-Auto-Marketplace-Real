/**
 * Image Upload API for Dealer Listings
 * 
 * Uploads images to Supabase Storage and returns public URLs.
 * Images are stored in the 'listings' bucket under dealer-id/listing-id/
 */

import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth/supabase-auth-server'
import { getDealerByUserId } from '@/lib/repositories/dealers'
import { createClient } from '@supabase/supabase-js'

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024
// Allowed file types
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
// Maximum images per listing
const MAX_IMAGES = 10

// Create Supabase client with service role for storage operations
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    // 1. Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be logged in to upload images' },
        { status: 401 }
      )
    }

    // 2. Get dealer profile
    const dealer = await getDealerByUserId(user.id)
    if (!dealer) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You must be a registered dealer to upload images' },
        { status: 403 }
      )
    }

    // 3. Parse form data
    const formData = await request.formData()
    const files = formData.getAll('images') as File[]
    const listingId = formData.get('listingId') as string | null

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'No images provided' },
        { status: 400 }
      )
    }

    if (files.length > MAX_IMAGES) {
      return NextResponse.json(
        { error: 'Bad Request', message: `Maximum ${MAX_IMAGES} images allowed` },
        { status: 400 }
      )
    }

    // 4. Validate files
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: 'Bad Request', message: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP` },
          { status: 400 }
        )
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'Bad Request', message: `File too large: ${file.name}. Maximum size: 5MB` },
          { status: 400 }
        )
      }
    }

    // 5. Upload to Supabase Storage
    const supabase = getSupabaseAdmin()
    const uploadedUrls: string[] = []
    const timestamp = Date.now()
    
    // Use listingId if provided, otherwise use 'temp' folder
    const folder = listingId 
      ? `${dealer.id}/${listingId}`
      : `${dealer.id}/temp-${timestamp}`

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ext = file.name.split('.').pop() || 'jpg'
      const fileName = `${timestamp}-${i}.${ext}`
      const filePath = `${folder}/${fileName}`

      // Convert File to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = new Uint8Array(arrayBuffer)

      const { error } = await supabase.storage
        .from('listings')
        .upload(filePath, buffer, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error('Storage upload error:', error)
        // Continue with other files even if one fails
        continue
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('listings')
        .getPublicUrl(filePath)

      if (publicUrlData?.publicUrl) {
        uploadedUrls.push(publicUrlData.publicUrl)
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: 'Upload Failed', message: 'Failed to upload any images. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedUrls.length} image(s) uploaded successfully`,
      urls: uploadedUrls,
      primaryUrl: uploadedUrls[0],
    })
  } catch (error) {
    console.error('Error in POST /api/dealer/upload:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to upload images' },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Remove an image from storage
 */
export async function DELETE(request: NextRequest) {
  try {
    // 1. Check authentication
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // 2. Get dealer profile
    const dealer = await getDealerByUserId(user.id)
    if (!dealer) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // 3. Get image URL to delete
    const { imageUrl } = await request.json()
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Image URL required' },
        { status: 400 }
      )
    }

    // 4. Extract file path from URL
    // URL format: https://xxx.supabase.co/storage/v1/object/public/listings/dealer-id/listing-id/filename
    const urlParts = imageUrl.split('/storage/v1/object/public/listings/')
    if (urlParts.length !== 2) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid image URL' },
        { status: 400 }
      )
    }
    const filePath = urlParts[1]

    // 5. Verify the image belongs to this dealer
    if (!filePath.startsWith(dealer.id)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'You can only delete your own images' },
        { status: 403 }
      )
    }

    // 6. Delete from storage
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.storage
      .from('listings')
      .remove([filePath])

    if (error) {
      console.error('Storage delete error:', error)
      return NextResponse.json(
        { error: 'Delete Failed', message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    })
  } catch (error) {
    console.error('Error in DELETE /api/dealer/upload:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

