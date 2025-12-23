ALTER TABLE blog_views ADD COLUMN updated_at timestamptz DEFAULT now();
