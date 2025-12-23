-- Add search_vector column to car_listings
ALTER TABLE car_listings ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create function to generate search vector
CREATE OR REPLACE FUNCTION generate_car_listing_search_vector(
    title text,
    brand text,
    model text,
    description text,
    vin text,
    color text
) RETURNS tsvector AS $$
BEGIN
    RETURN (
        setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(brand, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(model, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(vin, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(color, '')), 'C') ||
        setweight(to_tsvector('english', coalesce(description, '')), 'D')
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create trigger function to update vector on insert/update
CREATE OR REPLACE FUNCTION car_listings_search_vector_update() RETURNS trigger AS $$
BEGIN
    NEW.search_vector := generate_car_listing_search_vector(
        NEW.title,
        NEW.brand,
        NEW.model,
        (NEW.specifications->>'description'),
        NEW.vin,
        NEW.exterior_color
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS tsvectorupdate ON car_listings;
CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON car_listings
    FOR EACH ROW EXECUTE FUNCTION car_listings_search_vector_update();

-- Create GIN index for fast search
CREATE INDEX IF NOT EXISTS car_listings_search_vector_idx ON car_listings USING GIN (search_vector);

-- Update existing rows
UPDATE car_listings SET id = id; -- Triggers the update for all rows
