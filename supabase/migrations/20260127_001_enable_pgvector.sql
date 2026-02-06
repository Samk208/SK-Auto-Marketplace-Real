-- ============================================================================
-- MIGRATION: Enable pgvector Extension + Create Agent Infrastructure
-- Purpose: Foundation for semantic search and agent orchestration
-- Date: 2026-01-27
-- ============================================================================

-- Step 1: Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Step 2: Create embeddings table for semantic search (Matchmaker Agent)
CREATE TABLE IF NOT EXISTS car_listing_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    listing_id UUID NOT NULL REFERENCES car_listings (id) ON DELETE CASCADE,
    embedding vector (1536), -- OpenAI ada-002 or Gemini embedding size
    embedding_model TEXT NOT NULL DEFAULT 'text-embedding-ada-002',
    content_hash TEXT, -- To avoid re-embedding unchanged content
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        UNIQUE (listing_id, embedding_model)
);

-- Create index for vector similarity search (cosine distance)
CREATE INDEX IF NOT EXISTS car_listing_embeddings_vector_idx ON car_listing_embeddings USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index for listing lookup
CREATE INDEX IF NOT EXISTS car_listing_embeddings_listing_idx ON car_listing_embeddings (listing_id);

-- Step 3: Function to search listings by semantic similarity
CREATE OR REPLACE FUNCTION search_listings_semantic(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 10
)
RETURNS TABLE (
    listing_id UUID,
    similarity float,
    title TEXT,
    brand TEXT,
    model TEXT,
    year INT,
    price DECIMAL,
    images JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cl.id,
        1 - (e.embedding <=> query_embedding) AS similarity,
        cl.title,
        cl.brand,
        cl.model,
        cl.year,
        cl.price,
        cl.images
    FROM car_listing_embeddings e
    JOIN car_listings cl ON cl.id = e.listing_id
    WHERE 
        cl.status = 'active'
        AND 1 - (e.embedding <=> query_embedding) > match_threshold
    ORDER BY e.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies for embeddings
ALTER TABLE car_listing_embeddings ENABLE ROW LEVEL SECURITY;

-- Allow public read for semantic search
CREATE POLICY "Public can read embeddings" ON car_listing_embeddings FOR
SELECT USING (true);

-- Allow service role to manage embeddings
CREATE POLICY "Service role can manage embeddings" ON car_listing_embeddings FOR ALL USING (true);

COMMENT ON
TABLE car_listing_embeddings IS 'Vector embeddings for semantic search - Powers The Matchmaker agent';

COMMENT ON FUNCTION search_listings_semantic IS 'Semantic similarity search using vector embeddings';