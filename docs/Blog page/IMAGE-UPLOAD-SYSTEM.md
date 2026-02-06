# Blog Image Upload System

## Overview

A complete image upload system integrated with Supabase Storage for the SK AutoSphere blog CMS. Allows admins to upload images for blog post covers and inline content.

## Features

✅ **Cover Image Upload** - Upload cover images when creating/editing posts
✅ **Inline Image Upload** - Add images directly into blog content via rich editor
✅ **Dual Input Methods** - Upload files OR paste external URLs
✅ **File Validation** - Type and size checking (JPG, PNG, GIF, WebP, max 10MB)
✅ **Supabase Storage** - Secure cloud storage with public access
✅ **Image Preview** - Live preview of uploaded images
✅ **Progress Indicators** - Loading states during upload
✅ **Error Handling** - User-friendly error messages

---

## Architecture

### Storage Bucket: `blog-images`

**Location:** Supabase Storage
**Visibility:** Public (images accessible via direct URL)
**File Size Limit:** 10MB per file
**Allowed Types:** image/jpeg, image/jpg, image/png, image/gif, image/webp

**Folder Structure:**

```
blog-images/
├── covers/          # Cover images for blog posts
│   └── {timestamp}-{random}.{ext}
└── content/         # Inline images from rich editor
    └── {timestamp}-{random}.{ext}
```

---

## Components

### 1. ImageUpload Component

**Location:** `components/admin/blog/image-upload.tsx`

**Purpose:** Standalone component for uploading cover images in the post form.

**Features:**

- Tabbed interface (Upload / URL)
- Drag-and-drop area
- Image preview with remove button
- File validation
- Upload progress indicator

**Usage:**

```tsx
import ImageUpload from "@/components/admin/blog/image-upload";

<ImageUpload
  value={coverImageUrl}
  onChange={(url) => setCoverImageUrl(url)}
  label="Cover Image"
/>;
```

### 2. Enhanced Rich Editor

**Location:** `components/admin/blog/rich-editor.tsx`

**Features:**

- Image button in toolbar
- Upload dialog with tabs
- Direct insertion into content
- Same validation as cover upload

**Usage:**

```tsx
import RichEditor from "@/components/admin/blog/rich-editor";

<RichEditor content={content} onChange={(html) => setContent(html)} />;
```

---

## Database Migration

**File:** `supabase/migrations/20251212_022_blog_images_storage.sql`

### Storage Bucket Creation

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
```

### Storage Policies

**Public Read Access:**

```sql
CREATE POLICY "Public can view blog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');
```

**Authenticated Upload:**

```sql
CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-images' AND
    auth.role() = 'authenticated'
  );
```

**Admin Delete/Update:**

```sql
CREATE POLICY "Admins can delete blog images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'blog-images' AND
    (auth.uid() IN (SELECT id FROM users WHERE role = 'admin') OR
     (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'))
  );
```

---

## Setup Instructions

### 1. Run Migration

```bash
# Apply the storage bucket migration
supabase migration up

# Or if using Supabase CLI locally:
supabase db push
```

### 2. Verify Bucket Creation

Go to Supabase Dashboard → Storage → Check for `blog-images` bucket

### 3. Test Upload

1. Navigate to `/admin/blog/new`
2. Scroll to "Cover Image" section
3. Click "Upload" tab
4. Select an image file
5. Verify image appears in preview
6. Click "Save" to create post
7. Check blog post page to see image

---

## Usage Guide for Admins

### Uploading Cover Images

1. **Go to:** `/admin/blog/new` or `/admin/blog/[id]`
2. **Find:** "Cover Image" section in the right sidebar
3. **Choose Method:**
   - **Upload Tab:** Click "Select Image" → Choose file → Auto-upload
   - **URL Tab:** Paste external image URL → Click "Apply"
4. **Preview:** Image displays below upload area
5. **Remove:** Click X button on preview to remove

### Adding Inline Images

1. **In Rich Editor:** Position cursor where you want image
2. **Click:** Image button (📷) in toolbar
3. **Choose Method:**
   - **Upload:** Select local file → Instant upload & insertion
   - **URL:** Paste external URL → Click "Insert Image"
4. **Image Inserted:** Appears inline with border styling

---

## File Validation

### Accepted Formats

- JPEG/JPG
- PNG
- GIF
- WebP

### Size Limits

- Maximum: 10MB per file
- Recommended: Under 2MB for optimal loading

### Validation Errors

| Error               | Cause                 | Solution                     |
| ------------------- | --------------------- | ---------------------------- |
| "Invalid file type" | Unsupported format    | Use JPG, PNG, GIF, or WebP   |
| "File too large"    | File > 10MB           | Compress image before upload |
| "Upload failed"     | Network/Storage issue | Check connection & retry     |

---

## Technical Details

### Upload Flow

1. **File Selection** → User selects file via input
2. **Validation** → Check type & size
3. **Filename Generation** → `{timestamp}-{random}.{ext}`
4. **Upload to Supabase** → Store in appropriate folder
5. **Get Public URL** → Retrieve accessible URL
6. **Update State** → Pass URL to parent component
7. **Display Preview** → Show uploaded image

### URL Generation

```typescript
const fileExt = file.name.split(".").pop();
const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
const filePath = `covers/${fileName}`; // or `content/${fileName}`

const { data } = await supabase.storage
  .from("blog-images")
  .upload(filePath, file);

const {
  data: { publicUrl },
} = supabase.storage.from("blog-images").getPublicUrl(data.path);
```

### Public URL Format

```
https://{project}.supabase.co/storage/v1/object/public/blog-images/{folder}/{filename}
```

---

## Security

### Access Control

- ✅ **Public Read:** Anyone can view uploaded images
- ✅ **Authenticated Upload:** Only logged-in users can upload
- ✅ **Admin Delete:** Only admins can delete images
- ✅ **RLS Enabled:** Row-level security on storage bucket

### Best Practices

1. **Validate Client-Side:** Check file type/size before upload
2. **Secure Storage:** Use Supabase RLS policies
3. **Unique Filenames:** Prevent collisions with timestamp+random
4. **Cache Control:** Set `cacheControl: '3600'` for CDN caching
5. **Error Handling:** Graceful degradation on upload failures

---

## Maintenance

### Checking Storage Usage

```sql
-- View all uploaded images
SELECT name, created_at, metadata->>'size' as size_bytes
FROM storage.objects
WHERE bucket_id = 'blog-images'
ORDER BY created_at DESC;
```

### Cleaning Unused Images

```sql
-- Find images not referenced in any blog post
SELECT o.name
FROM storage.objects o
WHERE o.bucket_id = 'blog-images'
AND o.name NOT IN (
  SELECT REGEXP_REPLACE(cover_image, '.*/', '')
  FROM blog_posts
  WHERE cover_image IS NOT NULL
);
```

### Storage Limits

- Supabase Free Tier: 1GB storage
- Pro Tier: 100GB storage
- Monitor usage in Supabase Dashboard → Storage

---

## Troubleshooting

### Image Upload Fails

**Check:**

1. Supabase connection (env variables set?)
2. Storage bucket exists (`blog-images`)
3. RLS policies applied correctly
4. User is authenticated
5. File meets validation criteria

### Images Don't Display

**Check:**

1. Bucket is public
2. RLS policy allows SELECT
3. URL is correct format
4. Image file still exists in storage
5. Browser console for CORS errors

### Permission Denied

**Check:**

1. User has valid auth token
2. User role is set correctly
3. RLS policies match user role
4. Storage policies applied to correct bucket

---

## Future Enhancements

### Potential Improvements

- [ ] **Image Optimization:** Compress images on upload
- [ ] **Multiple Formats:** Auto-generate WebP versions
- [ ] **Thumbnail Generation:** Create preview sizes
- [ ] **Drag-and-Drop:** Direct file drop into editor
- [ ] **Image Gallery:** Browse previously uploaded images
- [ ] **Alt Text Editor:** Add accessibility descriptions
- [ ] **Image Cropping:** Built-in crop tool
- [ ] **CDN Integration:** Serve via custom CDN

---

## Related Files

```
supabase/migrations/20251212_022_blog_images_storage.sql
components/admin/blog/image-upload.tsx
components/admin/blog/rich-editor.tsx
components/admin/blog/post-form.tsx
app/admin/blog/new/page.tsx
app/admin/blog/[id]/page.tsx
```

---

## Support

For issues or questions:

1. Check Supabase Dashboard → Storage → `blog-images`
2. Review browser console for errors
3. Check Supabase logs for upload failures
4. Verify RLS policies in SQL Editor

---

**Last Updated:** 2025-12-12
**Version:** 1.0.0
**Status:** ✅ Production Ready
