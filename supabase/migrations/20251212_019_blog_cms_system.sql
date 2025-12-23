-- ============================================================================
-- SK AutoSphere - Blog CMS System Schema
-- Migration: 019_blog_cms_system
-- Date: 2025-12-12
-- Description: Implements the full database schema for the robust blogging system
--              referenced in 'Blog enhancement.md'. Includes posts, tags, and import tracking.
-- ============================================================================

-- 1. Blog Posts Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL, -- Content stored as Markdown or HTML
  cover_image TEXT,
  -- References 'users' table instead of 'profiles' to match existing schema
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  seo_title TEXT,
  seo_description TEXT,
  reading_time INTEGER, -- Auto-calculated in minutes
  CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9-]+$')
);

-- 2. Blog Tags (Many-to-Many)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- 3. Import History (Track bulk imports)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_imports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT, -- 'word', 'notion', 'medium', etc.
  file_name TEXT,
  posts_imported INTEGER,
  imported_by UUID REFERENCES users(id) ON DELETE SET NULL,
  imported_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

-- 4. Enable Row Level Security (RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_imports ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- ----------------------------------------------------------------------------

-- Blog Posts Policies
CREATE POLICY "Anyone can view published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can manage posts"
  ON blog_posts FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin') OR
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  );

-- Blog Tags Policies
CREATE POLICY "Public can view tags"
  ON blog_tags FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage tags"
  ON blog_tags FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin') OR
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  );

-- Blog Post Tags Policies
CREATE POLICY "Public can view post tags"
  ON blog_post_tags FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage post tags"
  ON blog_post_tags FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin') OR
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  );

-- Import History Policies
CREATE POLICY "Admins can manage imports"
  ON blog_imports FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM users WHERE role = 'admin') OR
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  );

-- 6. Indexes for Performance
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON blog_tags(slug);
