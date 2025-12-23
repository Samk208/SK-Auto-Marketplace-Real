-- Create private bucket for dealer documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dealer-documents', 
  'dealer-documents', 
  false, 
  5242880, -- 5MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- RLS is already enabled on storage.objects by default
-- No need to ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Dealers can upload their own documents" ON storage.objects;

DROP POLICY IF EXISTS "Dealers can view their own documents" ON storage.objects;

DROP POLICY IF EXISTS "Admins can view all dealer documents" ON storage.objects;

-- Policy: Dealers can upload their own documents
-- Enforces structure: dealer-documents/{user_id}/{filename}
CREATE POLICY "Dealers can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'dealer-documents' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

-- Policy: Dealers can view their own documents
CREATE POLICY "Dealers can view their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'dealer-documents' AND
  (auth.uid())::text = (storage.foldername(name))[1]
);

-- Policy: Admins can view all dealer documents
CREATE POLICY "Admins can view all dealer documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'dealer-documents' AND
  (
    (auth.jwt() ->> 'email')::text LIKE '%@skautosphere.com' OR
    (auth.jwt() -> 'user_metadata' ->> 'role')::text = 'admin'
  )
);