/**
 * Semantic Search API Endpoint
 * Powers the Matchmaker agent with pgvector similarity search
 */

import {
  embedAllListings,
  semanticSearch,
} from "@/lib/agents/matchmaker/semantic-search";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters, matchThreshold, maxResults } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "Query string is required" },
        { status: 400 },
      );
    }

    const results = await semanticSearch(query, {
      matchThreshold: matchThreshold || 0.7,
      maxResults: maxResults || 10,
      filters: filters || {},
    });

    return NextResponse.json({
      success: true,
      query,
      results,
      count: results.length,
    });
  } catch (error) {
    console.error("[Semantic Search API] Error:", error);
    return NextResponse.json(
      {
        error: "Failed to perform semantic search",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * Batch embed all listings (admin endpoint)
 */
export async function PUT(_request: NextRequest) {
  try {
    // TODO: Add admin auth check here
    const result = await embedAllListings();

    return NextResponse.json({
      message: "Batch embedding complete",
      success: result.success > 0,
      embedded: result.success,
      failed: result.failed,
    });
  } catch (error) {
    console.error("[Semantic Search API] Batch embed error:", error);
    return NextResponse.json(
      {
        error: "Failed to batch embed listings",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
