import { getCurrentUser } from "@/lib/auth/supabase-auth-server"
import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
]

type DocumentType = "arc_front" | "arc_back" | "passport"

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  )
}

function getExt(fileName: string) {
  const idx = fileName.lastIndexOf(".")
  if (idx === -1) return "bin"
  return fileName.slice(idx + 1).toLowerCase()
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("document") as File | null
    const documentTypeRaw = formData.get("documentType")

    if (!file) {
      return NextResponse.json({ error: "No document provided" }, { status: 400 })
    }

    const documentType = String(documentTypeRaw || "") as DocumentType
    if (!documentType || !["arc_front", "arc_back", "passport"].includes(documentType)) {
      return NextResponse.json({ error: "Invalid documentType" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}` },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large (max ${MAX_FILE_SIZE} bytes)` },
        { status: 400 }
      )
    }

    const supabase = getSupabaseAdmin()

    // Use a dedicated bucket for KYC docs to avoid mixing with listing media.
    // If the bucket doesn't exist, we return a clear error.
    const bucket = "kyc-documents"

    const timestamp = Date.now()
    const ext = getExt(file.name)
    const safeFileName = `${documentType}-${timestamp}.${ext}`
    const path = `${user.id}/${safeFileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      )
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return NextResponse.json({
      success: true,
      bucket,
      path,
      url: publicUrlData?.publicUrl,
    })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 500 }
    )
  }
}
