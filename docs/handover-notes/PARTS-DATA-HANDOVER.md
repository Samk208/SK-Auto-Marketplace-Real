# Parts Data Integration Handover Note

## 1. Overview

The Parts Shop (`/shop/parts`) has been successfully integrated with real data from Supabase. The system now fetches 923 parts sourced from scraped data (Autowini, Capom, etc.) and displays them using a standardized frontend interface.

## 2. Data Source & Structure

- **Table**: `public.parts`
- **Total Records**: 923 parts
- **Key Columns**:
  - `id`: UUID (Primary Key)
  - `name`: Part Name (e.g., "OIL FILTER")
  - `part_number`: Manufacturer Part Number
  - `category`: Unnormalized category string from source (e.g., "Engine", "Electrical & Lamp Parts")
  - `brand`: "OEM", "Aftermarket", or specific brand names.
  - `compatibility`: Comma-separated string of vehicle models.
  - `image`: URL or local path string.
  - `price_krw`: Price in KRW.
  - `is_new`: Boolean flag for condition.

**Frontend Mapping Logic (`PartsShopClient`):**
The frontend dynamically maps database fields to the `Part` interface.

- **Category Normalization**: We map variations like "Electrical & Lamp Parts" -> "Electrical & Lighting" on the fly.
- **Segment Logic**: We determine if a part is "New", "Used", or "Machine" based on the `is_new` flag and machine-specific categories.

## 3. Image Handling & Requirements (CRITICAL)

Currently, the system uses a **mix of hotlinked URLs and local placeholders**.

- **Current State**:
  - Many images are **hotlinked** directly from source sites (`image.autowini.com`, `imagebox.autowini.com`, `capom.co.kr`).
  - Missing images or local paths fallback to `/placeholder.jpg`.
- **Known Issue**: We frequently encounter `Invalid src prop` errors in Next.js because external domains must be explicitly whitelisted in `next.config.mjs`.
- **Whitelisted Domains**:
  - `image.autowini.com`
  - `imagebox.autowini.com`
  - `capom.co.kr`

**Recommended Action:**
Do **NOT** rely on hotlinking for production. It is fragile and can be blocked by the source.

1. **Download Images**: Create a script to download all images from the URLs in the `parts` table.
2. **Upload to Supabase**: Upload these images to a `parts-images` bucket in Supabase Storage.
3. **Update Database**: Update the `portions.image` column with the new Supabase Public URLs.

## 4. Troubleshooting Common Errors

### Error: `Invalid src prop ... hostname "..." is not configured`

**Cause**: The application is trying to load an image from a domain not listed in `next.config.mjs`.
**Fix**:

1. Open `next.config.mjs`.
2. Add the hostname (e.g., `new-source.com`) to the `images.remotePatterns` array.
3. **Restart the dev server** (`Ctrl+C` then `pnpm dev`).

### Error: `Parsing of .../generate-dotpkg.js ... failed at 'import(...)'`

**Cause**: This is a known warning with `contentlayer` on Windows/Node environments or when caching gets corrupted. It often appears as a warning but can sometimes look like a crash.
**Fix**:

1. Stop the server.
2. Delete the `.contentlayer` folder.
3. Delete the `.next` folder.
4. Run `pnpm dev` again to regenerate the content cache.

### Error: "Values ... are missing" in Supabase

**Cause**: Some parts might have incomplete data (missing price or image).
**Fix**: The frontend handles nulls gracefully (e.g., price shows "TBD", images show placeholder), but for data quality, you should run a cleanup SQL query to identify and populate missing fields.

## 5. Next Steps

1.  **Migrate Images**: Execute the download/upload strategy mentioned in Section 3.
2.  **Search Indexing**: Implement PostgreSQL Full Text Search (FTS) on `parts.name` and `parts.part_number` for better search performance as the catalog grows.
3.  **SEO**: Generate dynamic sitemaps for `/shop/parts/[id]` pages.
