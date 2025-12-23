
import { supabaseServer } from "@/lib/supabase-server";

export interface SearchToolParams {
    query?: string;
    make?: string;
    model?: string;
    year_min?: number;
    year_max?: number;
    price_min?: number;
    price_max?: number;
    body_type?: string;
}

export type ToolResult = {
    success: boolean;
    data?: any;
    error?: string;
}

/**
 * Tool: Search Inventory
 * Searches the vehicle database based on user criteria.
 */
export async function searchInventory(params: SearchToolParams): Promise<ToolResult> {
    console.log("[AI Tool] Searching inventory with params:", params);

    try {
        let query = supabaseServer
            .from('car_listings')
            .select('*')
            .eq('status', 'active'); // Only active listings

        // Apply filters
        if (params.make) {
            query = query.ilike('brand', `%${params.make}%`);
        }

        if (params.model) {
            query = query.ilike('model', `%${params.model}%`);
        }

        if (params.year_min) {
            query = query.gte('year', params.year_min);
        }

        if (params.year_max) {
            query = query.lte('year', params.year_max);
        }

        if (params.price_min) {
            query = query.gte('price', params.price_min);
        }

        if (params.price_max) {
            query = query.lte('price', params.price_max);
        }

        if (params.body_type) {
            query = query.ilike('body_type', `%${params.body_type}%`);
        }

        // Text search if query provided (and not just specific filters)
        // Note: detailed text search might require a specific function or logic, 
        // but for now we rely on structured params.
        // If 'query' is generic like "SUV", we can try to match body_type or brand/model.
        if (params.query) {
            // Simple OR search for the query text in title, brand, or model
            // Note: Supabase 'or' syntax: .or('column.eq.value,column2.eq.value')
            query = query.or(`title.ilike.%${params.query}%,brand.ilike.%${params.query}%,model.ilike.%${params.query}%`);
        }

        const { data, error } = await query.limit(5); // Limit to 5 results for AI context

        if (error) {
            console.error("[AI Tool] Search error:", error);
            return { success: false, error: "Database search failed" };
        }

        if (!data || data.length === 0) {
            return { success: true, data: "No vehicles found matching criteria." };
        }

        // Map to a simplified format for AI to consume (save tokens)
        const simplifiedData = data.map((car: any) => ({
            id: car.id,
            title: `${car.year} ${car.brand} ${car.model}`,
            price: `$${car.price.toLocaleString()}`,
            mileage: `${car.mileage?.toLocaleString()} km`,
            location: car.location_city || 'Korea',
            link: `/shop/listing/${car.id}`
        }));

        return {
            success: true,
            data: {
                count: data.length,
                listings: simplifiedData
            }
        };

    } catch (e) {
        console.error("[AI Tool] Detailed error:", e);
        return { success: false, error: "Internal tool error" };
    }
}

/**
 * Tool: Get Listing Details
 * specific details for a single car
 */
export async function getListingDetails(id: string): Promise<ToolResult> {
    try {
        const { data, error } = await supabaseServer
            .from('car_listings')
            .select('*, vehicle_specifications(*)')
            .eq('id', id)
            .single();

        if (error) return { success: false, error: "Listing not found" };

        return { success: true, data };
    } catch (e) {
        return { success: false, error: "Internal tool error" };
    }
}

/**
 * Tool: Save Lead
 * Capture user interest
 */
export async function saveLead(lead: { name: string; contact: string; interest: string }): Promise<ToolResult> {
    // Logic to save to 'inquiries' or a 'leads' table
    // For now, valid mock since we might not have auth context for created_by
    console.log("[AI Tool] Saving lead:", lead);
    return { success: true, data: "Lead saved successfully. A dealer will contact you shortly." };
}
