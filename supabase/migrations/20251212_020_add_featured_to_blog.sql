ALTER TABLE blog_posts ADD COLUMN is_featured boolean DEFAULT false;
CREATE INDEX idx_blog_posts_featured ON blog_posts(is_featured);
