'use server'

import { Part, PartSegment } from '@/lib/parts'
import { getSupabaseServerClient } from '@/lib/supabase-server'

const MACHINE_CATEGORIES = ["Hydraulic System", "Undercarriage", "Bearings & Seals", "Attachments", "Heavy Engine Parts"]

function mapDbPartToPart(dbPart: any): Part {
    // Normalize Category
    let category = dbPart.category || 'Uncategorized'
    if (category === 'Electrical & Lamp Parts') category = 'Electrical & Lighting'
    if (category === 'Engine') category = 'Engine & Drivetrain'

    // Determine segment
    let segment: PartSegment = 'used'
    if (MACHINE_CATEGORIES.includes(category) || MACHINE_CATEGORIES.includes(dbPart.category)) {
        segment = 'machine'
    } else if (dbPart.is_new) {
        segment = 'new'
    }

    // Determine compatibleVehicles
    const compatibleVehicles = dbPart.compatibility
        ? dbPart.compatibility.split(',').map((s: string) => s.trim())
        : []

    // Determine images
    const rawImage = dbPart.image || ""
    const imageUrl = rawImage.startsWith('http') ? rawImage : '/placeholder.jpg'
    const images = [imageUrl]

    return {
        id: dbPart.id,
        name: dbPart.name,
        partNumber: dbPart.part_number || 'N/A',
        brand: dbPart.brand || 'Unknown',
        category: category,
        subcategory: dbPart.subcategory || category || 'General',
        segment: segment,
        description: dbPart.description || "",
        priceKRW: dbPart.price_krw || 0,
        priceUSD: dbPart.price_usd || 0,
        compatibleVehicles: compatibleVehicles,
        condition: dbPart.condition || "Used",
        stockStatus: dbPart.stock_status || "In Stock",
        images: images,
        rating: 0,
        reviewCount: 0,
        location: ""
    }
}

export async function getParts(): Promise<Part[]> {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
        .from('parts')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching parts:', error)
        return []
    }

    return (data || []).map(mapDbPartToPart)
}

export async function searchParts(query: string): Promise<Part[]> {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
        .from('parts')
        .select('*')
        .or(`name.ilike.%${query}%,part_number.ilike.%${query}%`)

    if (error) {
        console.error('Error searching parts:', error)
        return []
    }

    return (data || []).map(mapDbPartToPart)
}

export async function getPart(id: string): Promise<Part | null> {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
        .from('parts')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        // console.error('Error fetching part:', error)
        return null
    }

    return data ? mapDbPartToPart(data) : null
}
