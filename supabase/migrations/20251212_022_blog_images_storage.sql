-- ============================================================================
-- SK AutoSphere - Blog Images Storage Bucket
-- Migration: 022_blog_images_storage
-- Date: 2025-12-12
-- Description: Creates storage bucket for blog post images and cover images
-- ============================================================================

-- 1. Create Storage Bucket for Blog Images
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true, -- Public bucket so images can be accessed directly
  10485760, -- 10MB limit per file
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies
-- ----------------------------------------------------------------------------

-- Allow public to read/view images
CREATE POLICY "Public can view blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-images' AND
    auth.role() = 'authenticated'
  );

-- Allow admins to delete images
CREATE POLICY "Admins can delete blog images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'blog-images' AND
    (
      auth.uid() IN (SELECT id FROM users WHERE role = 'admin') OR
      (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
    )
  );

-- Allow admins to update images
CREATE POLICY "Admins can update blog images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'blog-images' AND
    (
      auth.uid() IN (SELECT id FROM users WHERE role = 'admin') OR
      (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
    )
  );
