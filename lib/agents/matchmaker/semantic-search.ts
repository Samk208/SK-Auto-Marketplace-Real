/**
 * Matchmaker Agent - Semantic Search Service
 *
 * Uses pgvector embeddings for "find me a reliable SUV for Lagos" style queries
 * Integrates with Google Gemini for embedding generation
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;
const geminiKey =
  process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase credentials for Matchmaker");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const genAI = geminiKey ? new GoogleGenerativeAI(geminiKey) : null;

// ============================================================================
// TYPES
// ============================================================================

export interface SemanticSearchResult {
  listing_id: string;
  similarity: number;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  images: string[] | null;
  matchReason?: string;
}

export interface SearchOptions {
  matchThreshold?: number; // Minimum similarity score (0-1)
  maxResults?: number;
  filters?: {
    minYear?: number;
    maxYear?: number;
    minPrice?: number;
    maxPrice?: number;
    brands?: string[];
    bodyTypes?: string[];
  };
}

// ============================================================================
// EMBEDDING GENERATION
// ============================================================================

/**
 * Generate embedding for a text query using Gemini
 */
async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!genAI) {
    console.warn(
      "[Matchmaker] Gemini not configured, falling back to keyword search",
    );
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error("[Matchmaker] Embedding generation error:", error);
    return null;
  }
}

/**
 * Generate and store embedding for a listing
 */
export async function embedListing(
  listingId: string,
  title: string,
  brand: string,
  model: string,
  year: number,
  description?: string,
): Promise<boolean> {
  // Create rich text representation
  const richText = `${year} ${brand} ${model} - ${title}. ${description || ""}`;

  const embedding = await generateEmbedding(richText);
  if (!embedding) return false;

  try {
    // Check if embedding already exists
    const { data: existing } = await supabase
      .from("car_listing_embeddings")
      .select("id")
      .eq("listing_id", listingId)
      .single();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from("car_listing_embeddings")
        .update({
          embedding: JSON.stringify(embedding),
          content_hash: hashContent(richText),
          updated_at: new Date().toISOString(),
        })
        .eq("listing_id", listingId);

      if (error) throw error;
    } else {
      // Insert new
      const { error } = await supabase.from("car_listing_embeddings").insert({
        listing_id: listingId,
        embedding: JSON.stringify(embedding),
        content_hash: hashContent(richText),
      });

      if (error) throw error;
    }

    return true;
  } catch (error) {
    console.error("[Matchmaker] Failed to store embedding:", error);
    return false;
  }
}

/**
 * Batch embed all listings that don't have embeddings
 */
export async function embedAllListings(): Promise<{
  success: number;
  failed: number;
}> {
  let success = 0;
  let failed = 0;

  try {
    // Get all active listings without embeddings
    const { data: listings, error } = await supabase
      .from("car_listings")
      .select("id, title, brand, model, year, description")
      .eq("status", "active")
      .not(
        "id",
        "in",
        supabase.from("car_listing_embeddings").select("listing_id"),
      );

    if (error) throw error;
    if (!listings || listings.length === 0) {
      console.log("[Matchmaker] All listings already embedded");
      return { success: 0, failed: 0 };
    }

    console.log(`[Matchmaker] Embedding ${listings.length} listings...`);

    // Process in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < listings.length; i += batchSize) {
      const batch = listings.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (listing) => {
          const result = await embedListing(
            listing.id,
            listing.title,
            listing.brand,
            listing.model,
            listing.year,
            listing.description,
          );

          if (result) success++;
          else failed++;
        }),
      );

      // Rate limiting delay
      if (i + batchSize < listings.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(
      `[Matchmaker] Embedding complete: ${success} success, ${failed} failed`,
    );
    return { success, failed };
  } catch (error) {
    console.error("[Matchmaker] Batch embedding error:", error);
    return { success, failed };
  }
}

// ============================================================================
// SEMANTIC SEARCH
// ============================================================================

/**
 * Search listings using semantic similarity
 */
export async function semanticSearch(
  query: string,
  options: SearchOptions = {},
): Promise<SemanticSearchResult[]> {
  const { matchThreshold = 0.7, maxResults = 10, filters = {} } = options;

  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query);
  if (!queryEmbedding) {
    console.warn("[Matchmaker] Falling back to keyword search");
    return keywordSearchFallback(query, maxResults);
  }

  try {
    // Call the semantic search function
    const { data, error } = await supabase.rpc("search_listings_semantic", {
      query_embedding: JSON.stringify(queryEmbedding),
      match_threshold: matchThreshold,
      match_count: maxResults * 2, // Get more for filtering
    });

    if (error) throw error;

    let results = data as SemanticSearchResult[];

    // Apply filters
    if (filters.minYear)
      results = results.filter((r) => r.year >= filters.minYear!);
    if (filters.maxYear)
      results = results.filter((r) => r.year <= filters.maxYear!);
    if (filters.minPrice)
      results = results.filter((r) => r.price >= filters.minPrice!);
    if (filters.maxPrice)
      results = results.filter((r) => r.price <= filters.maxPrice!);
    if (filters.brands?.length) {
      results = results.filter((r) =>
        filters.brands!.some((b) =>
          r.brand.toLowerCase().includes(b.toLowerCase()),
        ),
      );
    }

    // Generate match reasons using Gemini
    results = await enrichWithMatchReasons(query, results.slice(0, maxResults));

    return results;
  } catch (error) {
    console.error("[Matchmaker] Semantic search error:", error);
    return keywordSearchFallback(query, maxResults);
  }
}

/**
 * Enrich results with AI-generated match reasons
 */
async function enrichWithMatchReasons(
  query: string,
  results: SemanticSearchResult[],
): Promise<SemanticSearchResult[]> {
  if (!genAI || results.length === 0) return results;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `User query: "${query}"

Matching vehicles:
${results.map((r, i) => `${i + 1}. ${r.year} ${r.brand} ${r.model} - $${r.price.toLocaleString()}`).join("\n")}

For each vehicle, write a 1-sentence reason why it matches the query. Focus on key features mentioned in the query (reliability, family use, price, destination, etc).

Respond as JSON array: [{"index": 1, "reason": "..."}, ...]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      const reasons = JSON.parse(jsonMatch[0]);
      reasons.forEach((r: { index: number; reason: string }) => {
        if (results[r.index - 1]) {
          results[r.index - 1].matchReason = r.reason;
        }
      });
    }
  } catch (error) {
    console.error("[Matchmaker] Failed to generate match reasons:", error);
  }

  return results;
}

/**
 * Fallback keyword search when embeddings fail
 */
async function keywordSearchFallback(
  query: string,
  maxResults: number,
): Promise<SemanticSearchResult[]> {
  try {
    const { data, error } = await supabase
      .from("car_listings")
      .select("id, title, brand, model, year, price, images")
      .eq("status", "active")
      .or(
        `title.ilike.%${query}%,brand.ilike.%${query}%,model.ilike.%${query}%`,
      )
      .limit(maxResults);

    if (error) throw error;

    return (data || []).map((item) => ({
      listing_id: item.id,
      similarity: 0.5, // Arbitrary score for keyword matches
      title: item.title,
      brand: item.brand,
      model: item.model,
      year: item.year,
      price: item.price,
      images: item.images,
    }));
  } catch (error) {
    console.error("[Matchmaker] Keyword search fallback error:", error);
    return [];
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

function hashContent(content: string): string {
  // Simple hash function for content comparison
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}
