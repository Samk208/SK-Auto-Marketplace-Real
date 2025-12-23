"use server"

import { createSupabaseServerActionClient, createSupabaseServerClient } from "@/lib/auth/supabase-auth-server"
import { revalidatePath } from "next/cache"

export async function toggleFavoriteAction(listingId: string) {
    const supabase = await createSupabaseServerActionClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Unauthorized")
    }

    // Check if already favorite
    const { data: existing } = await supabase
        .from("saved_vehicles")
        .select("id")
        .eq("user_id", user.id)
        .eq("listing_id", listingId)
        .single()

    if (existing) {
        // Remove
        await supabase
            .from("saved_vehicles")
            .delete()
            .eq("id", existing.id)
    } else {
        // Add
        await supabase
            .from("saved_vehicles")
            .insert({
                user_id: user.id,
                listing_id: listingId
            })
    }

    revalidatePath("/shop")
    revalidatePath("/buyer/dashboard")
}

export async function getSavedVehiclesAction() {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data } = await supabase
        .from("saved_vehicles")
        .select(`
        *,
        listing:car_listings (
          id,
          title,
          brand,
          model,
          year,
          price,
          currency,
          mileage,
          mileage_unit,
          transmission,
          fuel_type,
          primary_image_url,
          dealer_id
        )
      `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

    // Transform to match CarListing type partially if needed, or just return as is
    return data || []
}
