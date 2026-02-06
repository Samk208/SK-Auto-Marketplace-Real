# SK AUTOSPHERE BLOG EDITOR - COMPLETE SPECIFICATION

_Aligned with SK AutoSphere Official Style Guide - December 2025_

## 📋 Style Guide Compliance

This specification is **100% aligned** with the [SK AutoSphere Official Style Guide](./STYLE-GUIDE.md).

**Implemented from Style Guide:**

- ✅ **Color Palette:** Electric Blue (#2558fa) as primary, exact color tokens
- ✅ **Typography:** Geist Sans font family, official type scale
- ✅ **Plus Grid Pattern:** Signature background texture for hero sections
- ✅ **Brand Gradient:** from-[#2558fa] via-[#4f7aff] to-[#7c9dff]
- ✅ **Component Library:** Buttons (4 variants), Cards, Badges per `components/ui/`
- ✅ **Spacing System:** Base unit 4px, section padding py-12/py-16
- ✅ **Border Radius:** rounded-xl for cards, rounded-md for buttons
- ✅ **Shadows:** shadow-sm for lists, shadow-lg for floating elements

---

## 🎯 Project Overview

Build a production-ready blog post editor for SK AutoSphere's content platform, following the **official SK AutoSphere Style Guide** while implementing industry-leading SEO, UX, and content creation features.

**Context:** Automotive marketplace connecting Korean dealers with African buyers - content focuses on car buying guides, market insights, dealer spotlights, and industry news.

---

## 🎨 DESIGN SYSTEM (Per Official Style Guide)

### Color Palette

**Exact tokens from SK AutoSphere Style Guide:**

```css
/* Primary Brand Color - Electric Blue */
--primary: #2558fa; /* Main brand color (RGB: 37, 88, 250) */
--primary-dark: #1a3ec1; /* Hover states, active pressed states */
--primary-light: #dbeafe; /* Subtle backgrounds, active selection highlight */

/* Surface & Background */
--surface: #ffffff; /* Card backgrounds, Elevated areas */
--background: #f8fafc; /* Main app background (Slate-50) */

/* Semantic Colors (Standard) */
--success: #10b981; /* Green - Success states */
--warning: #f59e0b; /* Orange - Warnings */
--error: #ef4444; /* Red - Errors */

/* Text Colors (Tailwind Slate) */
--text-primary: #0f172a; /* Slate-900 - Main text */
--text-secondary: #64748b; /* Slate-500 - Secondary text */
--text-tertiary: #94a3b8; /* Slate-400 - Metadata/Disabled */

/* Borders (Slate-200) */
--border: #e2e8f0; /* Card borders, dividers */
```

**Tailwind Mapping:**

- Primary: `bg-[#2558fa]` or `bg-primary`
- Hover: `hover:bg-[#1a3ec1]` or `hover:bg-primary-dark`
- Backgrounds: `bg-[#f8fafc]` or `bg-slate-50`
- Borders: `border-slate-200`

### Typography (Geist Sans)

**Official Font:** `Geist Sans` - Modern, geometric, legible

```css
/* Font Stack */
font-family: "Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

/* Type Scale (Per Style Guide) */
Display (Hero):    text-6xl (60px) | font-bold | tracking-tight
Headline:          text-4xl (36px) | font-bold | tracking-tight
H1 (Post Title):   text-3xl (30px) | font-bold
H2 (Sections):     text-2xl (24px) | font-semibold
H3 (Subsections):  text-xl (20px) | font-semibold
Body:              text-base (16px) | leading-relaxed
Small:             text-sm (14px) | metadata, secondary text
```

### Spacing System

**Per Style Guide:**

- **Base Unit:** 4px (Tailwind's default)
- **Section Padding:** `py-12` or `py-16` (48px - 64px vertical)
- **Component Gap:** `gap-4` (16px) or `gap-6` (24px)
- **Container Padding:** `px-6` or `px-8`

### Border Radius

**Per Style Guide:**

- **Cards/Containers:** `rounded-xl` (12px) - Modern, friendly
- **Buttons/Inputs:** `rounded-md` (6px) - Functional, crisp
- **Badges:** `rounded-full` - Pill-shaped status indicators

### Shadows

**Per Style Guide:**

- **List Items/Cards:** `shadow-sm` - Subtle elevation
- **Floating Elements:** `shadow-lg` - Prominent elevation
- **Modals/Dialogs:** `shadow-xl` - Maximum elevation

### The Plus Grid Pattern (Signature)

**Official Brand Pattern** - Represents precision and connectivity

```html
<!-- Hero Section with Plus Grid -->
<div
  class="relative bg-gradient-to-br from-[#2558fa] via-[#4f7aff] to-[#7c9dff]"
>
  <!-- Plus Grid Overlay (Exact from Style Guide) -->
  <div
    class="absolute inset-0 opacity-10"
    style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"
  ></div>
  <!-- Content -->
</div>
```

**Usage:** Hero sections, accented container backgrounds, high-impact CTAs

### Component Styling (Per Official Style Guide)

**Buttons** (`components/ui/button.tsx`):

```jsx
// Default (Primary)
<button className="bg-[#2558fa] text-white hover:bg-[#1a3ec1] px-6 py-3 rounded-md font-medium transition-colors">
  Publish Post
</button>

// Secondary
<button className="bg-slate-100 text-slate-900 hover:bg-slate-200 px-6 py-3 rounded-md font-medium transition-colors">
  Save Draft
</button>

// Outline
<button className="border-2 border-[#2558fa] text-[#2558fa] hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition-colors">
  Preview
</button>

// Ghost
<button className="text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-md transition-colors">
  Cancel
</button>
```

**Cards** (`components/ui/card.tsx`):

```jsx
// Standard Card (List Item)
<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
  {/* Card content */}
</div>

// Elevated/Floating Card
<div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
  {/* Featured content */}
</div>
```

**Badges** (`components/ui/badge.tsx`):

```jsx
// Status Badges (Light background with colored text)
<span className="bg-primary/10 text-[#2558fa] px-3 py-1 rounded-full text-sm font-medium">
  Published
</span>

<span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
  Verified Dealer
</span>

<span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-md text-sm font-medium">
  Draft
</span>
```

**Inputs:**

```jsx
<input
  type="text"
  className="w-full px-4 py-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2558fa] focus:border-transparent"
/>
```

---

## 📝 EDITOR INTERFACE LAYOUT

### Overall Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER (Sticky)                                                │
│  [SK AutoSphere Logo]    [Auto-saved 2s ago]    [Preview] [⋮]  │
└─────────────────────────────────────────────────────────────────┘
│                                                                 │
│  ┌────────────────────────────┬──────────────────────────────┐ │
│  │                            │  SEO & SETTINGS PANEL        │ │
│  │                            │  ┌────────────────────────┐  │ │
│  │  EDITOR CANVAS             │  │ 📊 SEO Score: 85/100   │  │ │
│  │  (Max-width: 720px)        │  │ ▓▓▓▓▓▓▓▓▓░░░           │  │ │
│  │                            │  └────────────────────────┘  │ │
│  │  Post Title...             │                              │ │
│  │  ─────────────             │  Meta Title                  │ │
│  │                            │  Meta Description            │ │
│  │  Start writing or type /   │  URL Slug                    │ │
│  │  for commands...           │  Focus Keyword               │ │
│  │                            │  Featured Image              │ │
│  │                            │  ─────────────               │ │
│  │  [Content blocks]          │  Categories                  │ │
│  │                            │  Tags                        │ │
│  │  [Floating Toolbar]        │  ─────────────               │ │
│  │                            │  Readability                 │ │
│  │                            │  Analytics                   │ │
│  │                            │                              │ │
│  └────────────────────────────┴──────────────────────────────┘ │
│                                                                 │
│  FOOTER                                                         │
│  [Word Count: 1,247] [Reading Time: 5m] [Characters: 7,456]   │
└─────────────────────────────────────────────────────────────────┘
```

### Header Bar (Sticky)

```jsx
<header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4">
  <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
    {/* Left: Branding */}
    <div className="flex items-center gap-6">
      <Link href="/blog">
        <img src="/logo.svg" alt="SK AutoSphere" className="h-8" />
      </Link>
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <svg
          className="w-4 h-4 text-green-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
        </svg>
        <span>Auto-saved 2 seconds ago</span>
      </div>
    </div>

    {/* Right: Actions */}
    <div className="flex items-center gap-3">
      <button className="text-slate-600 hover:text-slate-900 px-4 py-2 rounded-md hover:bg-slate-100">
        Preview
      </button>
      <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-4 py-2 rounded-md font-medium">
        Save Draft
      </button>
      <button className="bg-[#2558fa] hover:bg-[#1a3ec1] text-white px-6 py-2 rounded-md font-medium">
        Publish
      </button>
      <button className="text-slate-400 hover:text-slate-600 p-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>
    </div>
  </div>
</header>
```

---

## ✍️ RICH TEXT EDITOR INTERFACE

### Editor Canvas (Main Writing Area)

```jsx
<div className="max-w-3xl mx-auto px-6 py-12">
  {/* Post Title */}
  <input
    type="text"
    placeholder="Post title..."
    className="w-full text-4xl font-bold text-slate-900 placeholder:text-slate-300 border-none focus:outline-none focus:ring-0 mb-4"
    maxLength="60"
  />

  {/* Title Character Counter */}
  <div className="flex items-center gap-2 mb-8 text-sm">
    <span className={`${titleLength > 60 ? "text-red-500" : "text-slate-400"}`}>
      {titleLength}/60 characters
    </span>
    {titleLength > 60 && (
      <span className="text-red-500 text-xs">⚠️ Title too long for SEO</span>
    )}
  </div>

  {/* Rich Text Editor */}
  <div className="prose prose-lg max-w-none">
    {/* TipTap/ProseMirror editor content */}
    <EditorContent editor={editor} />
  </div>

  {/* Empty State */}
  {isEmpty && (
    <div className="text-slate-400 text-lg">
      <p>
        Start writing or type{" "}
        <kbd className="px-2 py-1 bg-slate-100 rounded text-sm">/</kbd> for
        commands...
      </p>
    </div>
  )}
</div>
```

### Floating Toolbar (Text Selection)

```jsx
<div className="absolute bg-slate-900 text-white rounded-lg shadow-xl px-3 py-2 flex items-center gap-1 z-50">
  {/* Bold */}
  <button className="p-2 hover:bg-slate-700 rounded" title="Bold (⌘B)">
    <BoldIcon className="w-4 h-4" />
  </button>

  {/* Italic */}
  <button className="p-2 hover:bg-slate-700 rounded" title="Italic (⌘I)">
    <ItalicIcon className="w-4 h-4" />
  </button>

  {/* Divider */}
  <div className="w-px h-6 bg-slate-700 mx-1" />

  {/* Link */}
  <button className="p-2 hover:bg-slate-700 rounded" title="Link (⌘K)">
    <LinkIcon className="w-4 h-4" />
  </button>

  {/* Highlight */}
  <button className="p-2 hover:bg-slate-700 rounded" title="Highlight">
    <HighlightIcon className="w-4 h-4" />
  </button>

  {/* Divider */}
  <div className="w-px h-6 bg-slate-700 mx-1" />

  {/* Heading */}
  <select className="bg-transparent text-white text-sm px-2 py-1 hover:bg-slate-700 rounded border-none">
    <option>Paragraph</option>
    <option>Heading 2</option>
    <option>Heading 3</option>
    <option>Heading 4</option>
  </select>
</div>
```

### Slash Command Menu

```jsx
<div className="absolute bg-white rounded-xl shadow-lg border border-slate-200 py-2 w-80 max-h-96 overflow-y-auto">
  {/* Media Section */}
  <div className="px-3 py-2">
    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
      Media
    </div>
    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-md text-left">
      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
        <ImageIcon className="w-5 h-5 text-[#2558fa]" />
      </div>
      <div>
        <div className="font-medium text-slate-900">Image</div>
        <div className="text-xs text-slate-500">Upload or embed an image</div>
      </div>
    </button>

    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-md text-left">
      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
        <VideoIcon className="w-5 h-5 text-red-500" />
      </div>
      <div>
        <div className="font-medium text-slate-900">Video</div>
        <div className="text-xs text-slate-500">Embed YouTube, Vimeo, etc.</div>
      </div>
    </button>
  </div>

  {/* Content Section */}
  <div className="px-3 py-2 border-t border-slate-100">
    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
      Content
    </div>
    <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-md text-left">
      <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
        <QuoteIcon className="w-5 h-5 text-purple-500" />
      </div>
      <div>
        <div className="font-medium text-slate-900">Quote</div>
        <div className="text-xs text-slate-500">Add a blockquote</div>
      </div>
    </button>

    {/* More options... */}
  </div>
</div>
```

---

## 🎯 HEADING SYSTEM WITH SEO VALIDATION

### Heading Hierarchy Interface

```jsx
{
  /* H2 Example */
}
<h2 className="text-2xl font-semibold text-slate-900 mt-12 mb-4 flex items-center gap-3 group">
  <span>How to Buy a Car from Korea</span>

  {/* SEO Indicator */}
  <span className="inline-flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
    <span className="text-slate-500">H2</span>
  </span>

  {/* Anchor Link */}
  <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-[#2558fa]">
    <LinkIcon className="w-4 h-4" />
  </button>
</h2>;
```

### Heading Validation Panel

```jsx
<div className="bg-white rounded-xl border border-slate-200 p-4">
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-semibold text-slate-900">Document Outline</h3>
    <span className="text-xs text-slate-500">SEO Structure</span>
  </div>

  <div className="space-y-2">
    {/* H1 - Title */}
    <div className="flex items-start gap-2">
      <span className="flex items-center justify-center w-6 h-6 bg-green-50 text-green-700 rounded text-xs font-medium">
        H1
      </span>
      <div className="flex-1">
        <div className="text-sm font-medium text-slate-900">
          Complete Guide to Importing Korean Cars
        </div>
        <div className="flex items-center gap-2 mt-1">
          <CheckIcon className="w-3 h-3 text-green-500" />
          <span className="text-xs text-slate-500">
            Optimal length (54 chars)
          </span>
        </div>
      </div>
    </div>

    {/* H2 - Sections */}
    <div className="flex items-start gap-2 pl-4">
      <span className="flex items-center justify-center w-6 h-6 bg-blue-50 text-[#2558fa] rounded text-xs font-medium">
        H2
      </span>
      <div className="flex-1">
        <div className="text-sm text-slate-700">Why Import from Korea?</div>
        <div className="flex items-center gap-2 mt-1">
          <CheckIcon className="w-3 h-3 text-green-500" />
          <span className="text-xs text-slate-500">Contains focus keyword</span>
        </div>
      </div>
    </div>

    {/* H3 - Subsections */}
    <div className="flex items-start gap-2 pl-8">
      <span className="flex items-center justify-center w-6 h-6 bg-blue-50 text-blue-600 rounded text-xs font-medium">
        H3
      </span>
      <div className="flex-1">
        <div className="text-sm text-slate-600">Quality Standards</div>
      </div>
    </div>

    {/* Warning Example */}
    <div className="flex items-start gap-2 pl-4">
      <span className="flex items-center justify-center w-6 h-6 bg-orange-50 text-orange-600 rounded text-xs font-medium">
        H4
      </span>
      <div className="flex-1">
        <div className="text-sm text-slate-700">Detailed Specs</div>
        <div className="flex items-center gap-2 mt-1">
          <AlertIcon className="w-3 h-3 text-orange-500" />
          <span className="text-xs text-orange-600">Skipped H3 level</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## 🖼️ IMAGE MANAGEMENT SYSTEM

### Image Upload Interface

```jsx
{
  /* Drag & Drop Zone */
}
<div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-[#2558fa] hover:bg-blue-50/50 transition-colors cursor-pointer">
  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
    <ImageIcon className="w-8 h-8 text-[#2558fa]" />
  </div>
  <h3 className="text-lg font-semibold text-slate-900 mb-2">
    Drop images here or click to upload
  </h3>
  <p className="text-sm text-slate-500 mb-4">
    Supports: JPG, PNG, WebP up to 5MB
  </p>
  <div className="flex items-center justify-center gap-3">
    <button className="bg-[#2558fa] hover:bg-[#1a3ec1] text-white px-6 py-2 rounded-md text-sm font-medium">
      Browse Files
    </button>
    <button className="border-2 border-slate-200 hover:border-slate-300 text-slate-700 px-6 py-2 rounded-md text-sm font-medium">
      Search Unsplash
    </button>
  </div>
</div>;
```

### Image Editor Panel

```jsx
<div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
  {/* Image Preview */}
  <div className="relative aspect-video bg-slate-100">
    <img src={imageUrl} alt={altText} className="w-full h-full object-cover" />
    <div className="absolute top-4 right-4 flex gap-2">
      <button className="bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-md shadow-sm text-sm font-medium">
        Replace
      </button>
      <button className="bg-white hover:bg-slate-50 text-red-600 px-3 py-2 rounded-md shadow-sm text-sm font-medium">
        Remove
      </button>
    </div>
  </div>

  {/* Image Settings */}
  <div className="p-6 space-y-4">
    {/* Alt Text (Required) */}
    <div>
      <label className="block text-sm font-medium text-slate-900 mb-2">
        Alt Text <span className="text-red-500">*</span>
        <span className="text-slate-500 font-normal ml-2">(SEO Critical)</span>
      </label>
      <input
        type="text"
        placeholder="Describe the image for accessibility and SEO..."
        className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2558fa] focus:border-transparent"
        value={altText}
      />
      {!altText && (
        <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
          <AlertIcon className="w-3 h-3" />
          Alt text is required for SEO and accessibility
        </p>
      )}
    </div>

    {/* Caption (Optional) */}
    <div>
      <label className="block text-sm font-medium text-slate-900 mb-2">
        Caption <span className="text-slate-500 font-normal">(Optional)</span>
      </label>
      <input
        type="text"
        placeholder="Add a caption that appears below the image..."
        className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2558fa]"
      />
    </div>

    {/* Image Settings Grid */}
    <div className="grid grid-cols-2 gap-4">
      {/* Size */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Size
        </label>
        <select className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2558fa]">
          <option>Full Width</option>
          <option>Content Width</option>
          <option>Medium</option>
          <option>Small</option>
        </select>
      </div>

      {/* Alignment */}
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Alignment
        </label>
        <select className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2558fa]">
          <option>Center</option>
          <option>Left</option>
          <option>Right</option>
        </select>
      </div>
    </div>

    {/* Image Stats */}
    <div className="bg-slate-50 rounded-lg p-4">
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Image Stats
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-slate-500">Size:</span>
          <span className="ml-2 font-medium text-slate-900">245 KB</span>
          <span className="ml-2 text-green-600">✓ Optimized</span>
        </div>
        <div>
          <span className="text-slate-500">Dimensions:</span>
          <span className="ml-2 font-medium text-slate-900">1200×800px</span>
        </div>
        <div>
          <span className="text-slate-500">Format:</span>
          <span className="ml-2 font-medium text-slate-900">WebP</span>
        </div>
        <div>
          <span className="text-slate-500">Lazy Load:</span>
          <span className="ml-2 text-green-600">✓ Enabled</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## 🎥 VIDEO EMBEDDING INTERFACE

### Video Embed Block

```jsx
<div className="my-8 bg-white rounded-xl border border-slate-200 overflow-hidden">
  {/* Video Preview */}
  <div className="relative aspect-video bg-slate-900">
    <iframe
      src={embedUrl}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>

  {/* Video Settings Panel */}
  <div className="p-6 border-t border-slate-200 bg-slate-50">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Video URL
        </label>
        <input
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          className="w-full px-4 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2558fa]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900 mb-2">
          Platform
        </label>
        <select className="w-full px-4 py-2 border border-slate-200 rounded-md">
          <option>YouTube</option>
          <option>Vimeo</option>
          <option>Wistia</option>
        </select>
      </div>
    </div>

    {/* Video Options */}
    <div className="mt-4 flex items-center gap-6">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked
          className="w-4 h-4 text-[#2558fa] rounded border-slate-300"
        />
        <span className="text-sm text-slate-700">
          Privacy mode (no cookies)
        </span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 text-[#2558fa] rounded border-slate-300"
        />
        <span className="text-sm text-slate-700">Autoplay on scroll</span>
      </label>
    </div>
  </div>
</div>
```

---

## 💬 QUOTE BLOCKS

### Quote Variants

```jsx
{/* 1. Standard Blockquote */}
<blockquote className="my-8 pl-6 border-l-4 border-[#2558fa] bg-blue-50/50 py-4 pr-6 rounded-r-lg">
  <p className="text-lg italic text-slate-700 leading-relaxed">
    "SK AutoSphere has revolutionized how African buyers access quality Korean vehicles. The platform's transparency and dealer verification give us confidence."
  </p>
  <footer className="mt-3 text-sm text-slate-600">
    — John Doe, <cite className="font-medium not-italic">CEO, Ghana Auto Import</cite>
  </footer>
</blockquote>

{/* 2. Pull Quote (Callout) */}
<div className="my-12 bg-gradient-to-br from-[#2558fa]/10 via-[#4f7aff]/10 to-[#7c9dff]/10 rounded-xl p-8 text-center relative overflow-hidden">
  {/* Plus Grid Pattern */}
  <div className="absolute inset-0 opacity-5" style={{backgroundImage: /* Plus Grid SVG */}} />

  <p className="text-2xl font-semibold text-slate-900 leading-snug relative z-10">
    "The future of automotive trade between Korea and Africa is digital, transparent, and built on trust."
  </p>
  <p className="mt-4 text-[#2558fa] font-medium relative z-10">
    — SK AutoSphere Mission Statement
  </p>
</div>

{/* 3. Tweet Embed */}
<div className="my-8 bg-white rounded-xl border border-slate-200 p-6 max-w-xl">
  <div className="flex items-start gap-3">
    <img src={avatarUrl} alt="" className="w-12 h-12 rounded-full" />
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-slate-900">@SKAutoSphere</span>
        <span className="text-slate-500">·</span>
        <span className="text-slate-500 text-sm">Oct 15, 2024</span>
      </div>
      <p className="text-slate-900">
        Just connected our 200th Korean dealer with African buyers! 🚀 The future of cross-border auto trade is here.
      </p>
      <a href="#" className="inline-flex items-center gap-2 mt-3 text-sm text-[#2558fa] hover:underline">
        View on Twitter
        <ExternalLinkIcon className="w-4 h-4" />
      </a>
    </div>
  </div>
</div>
```

---

## 📊 SEO OPTIMIZATION PANEL

### SEO Score Dashboard

```jsx
<div className="bg-white rounded-xl border border-slate-200 p-6">
  {/* Score Header */}
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-semibold text-slate-900">SEO Score</h3>
    <div className="flex items-center gap-2">
      <span className="text-3xl font-bold text-[#2558fa]">85</span>
      <span className="text-slate-500">/100</span>
    </div>
  </div>

  {/* Progress Bar */}
  <div className="mb-6">
    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-[#2558fa] to-[#7c9dff] transition-all duration-500"
        style={{ width: "85%" }}
      />
    </div>
    <div className="flex justify-between mt-2 text-xs text-slate-500">
      <span>Poor</span>
      <span>Good</span>
      <span>Excellent</span>
    </div>
  </div>

  {/* Checks List */}
  <div className="space-y-3">
    {/* Good Items */}
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckIcon className="w-3 h-3 text-green-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-900">
          Title length optimal
        </p>
        <p className="text-xs text-slate-500">
          54 characters (recommended: 50-60)
        </p>
      </div>
    </div>

    <div className="flex items-start gap-3">
      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <CheckIcon className="w-3 h-3 text-green-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-900">
          Images have alt text
        </p>
        <p className="text-xs text-slate-500">
          All 5 images properly described
        </p>
      </div>
    </div>

    {/* Warning Items */}
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <AlertIcon className="w-3 h-3 text-orange-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-900">Content length</p>
        <p className="text-xs text-slate-500">
          450 words (recommended: 800+ for better ranking)
        </p>
        <button className="mt-1 text-xs text-[#2558fa] hover:underline">
          Get writing suggestions
        </button>
      </div>
    </div>

    {/* Critical Items */}
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <XIcon className="w-3 h-3 text-red-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-900">
          Focus keyword missing
        </p>
        <p className="text-xs text-slate-500">
          Add keyword to first paragraph for better SEO
        </p>
        <button className="mt-1 px-3 py-1 bg-[#2558fa] text-white text-xs rounded-md hover:bg-[#1a3ec1]">
          Fix Now
        </button>
      </div>
    </div>
  </div>
</div>
```

### Meta Fields Section

```jsx
<div className="space-y-6">
  {/* Meta Title */}
  <div>
    <label className="block text-sm font-semibold text-slate-900 mb-2">
      Meta Title
      <span className="text-slate-500 font-normal ml-2">
        (Search result title)
      </span>
    </label>
    <input
      type="text"
      placeholder="How to Import Korean Cars: Complete Guide 2024"
      maxLength="60"
      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2558fa] focus:border-transparent"
      value={metaTitle}
    />
    <div className="flex items-center justify-between mt-2">
      <span
        className={`text-xs ${metaTitle.length > 60 ? "text-red-500" : "text-slate-500"}`}
      >
        {metaTitle.length}/60 characters
      </span>
      {metaTitle.length >= 50 && metaTitle.length <= 60 && (
        <span className="text-xs text-green-600 flex items-center gap-1">
          <CheckIcon className="w-3 h-3" />
          Optimal length
        </span>
      )}
    </div>

    {/* Google Preview */}
    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="text-xs text-slate-500 mb-1">
        Preview in search results:
      </div>
      <div className="flex items-start gap-2">
        <img src="/favicon.ico" alt="" className="w-4 h-4 mt-1 flex-shrink-0" />
        <div>
          <div className="text-sm text-[#1a0dab] font-medium leading-tight">
            {metaTitle || "Your meta title will appear here"}
          </div>
          <div className="text-xs text-green-700 mt-0.5">
            skautosphere.com › blog › import-korean-cars
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Meta Description */}
  <div>
    <label className="block text-sm font-semibold text-slate-900 mb-2">
      Meta Description
      <span className="text-slate-500 font-normal ml-2">
        (Search result snippet)
      </span>
    </label>
    <textarea
      placeholder="Learn how to import quality Korean vehicles to Africa with our comprehensive guide. Get expert tips on dealers, shipping, and customs."
      maxLength="160"
      rows="3"
      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2558fa] resize-none"
      value={metaDescription}
    />
    <div className="flex items-center justify-between mt-2">
      <span
        className={`text-xs ${metaDescription.length > 160 ? "text-red-500" : "text-slate-500"}`}
      >
        {metaDescription.length}/160 characters
      </span>
      {metaDescription.length >= 120 && metaDescription.length <= 160 && (
        <span className="text-xs text-green-600 flex items-center gap-1">
          <CheckIcon className="w-3 h-3" />
          Optimal length
        </span>
      )}
    </div>

    {/* Google Preview */}
    <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div className="text-xs text-slate-500 mb-1">How it appears:</div>
      <p className="text-sm text-slate-700 leading-relaxed">
        {metaDescription || "Your meta description will appear here"}
      </p>
    </div>
  </div>

  {/* URL Slug */}
  <div>
    <label className="block text-sm font-semibold text-slate-900 mb-2">
      URL Slug
    </label>
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">skautosphere.com/blog/</span>
      <input
        type="text"
        placeholder="how-to-import-korean-cars"
        className="flex-1 px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2558fa]"
        value={slug}
      />
    </div>
    <div className="mt-2 space-y-1">
      {slugValid.lowercase && (
        <div className="flex items-center gap-2 text-xs text-green-600">
          <CheckIcon className="w-3 h-3" />
          <span>Lowercase only</span>
        </div>
      )}
      {slugValid.hyphens && (
        <div className="flex items-center gap-2 text-xs text-green-600">
          <CheckIcon className="w-3 h-3" />
          <span>Uses hyphens (not underscores)</span>
        </div>
      )}
      {slugValid.keyword && (
        <div className="flex items-center gap-2 text-xs text-green-600">
          <CheckIcon className="w-3 h-3" />
          <span>Contains focus keyword</span>
        </div>
      )}
    </div>
  </div>

  {/* Focus Keyword */}
  <div>
    <label className="block text-sm font-semibold text-slate-900 mb-2">
      Focus Keyword
      <span className="text-slate-500 font-normal ml-2">
        (Primary SEO target)
      </span>
    </label>
    <input
      type="text"
      placeholder="import Korean cars"
      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2558fa]"
      value={focusKeyword}
    />

    {focusKeyword && (
      <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-2">
        <div className="text-sm font-medium text-slate-900 mb-3">
          Keyword Analysis:
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">In title</span>
          <span className="text-green-600 flex items-center gap-1">
            <CheckIcon className="w-4 h-4" />
            Found
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">In first paragraph</span>
          <span className="text-green-600 flex items-center gap-1">
            <CheckIcon className="w-4 h-4" />
            Found
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">In headings</span>
          <span className="text-orange-600 flex items-center gap-1">
            <AlertIcon className="w-4 h-4" />
            Found in 1 heading (add more)
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Keyword density</span>
          <span className="text-green-600 flex items-center gap-1">
            <CheckIcon className="w-4 h-4" />
            1.2% (optimal)
          </span>
        </div>
      </div>
    )}
  </div>
</div>
```

---

## 📖 READABILITY ANALYSIS

```jsx
<div className="bg-white rounded-xl border border-slate-200 p-6">
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-semibold text-slate-900">Readability</h3>
    <div className="flex items-center gap-2">
      <span className="text-3xl font-bold text-green-600">68</span>
      <span className="text-slate-500">/100</span>
    </div>
  </div>

  {/* Reading Level */}
  <div className="mb-6 p-4 bg-green-50 rounded-lg">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
        <BookIcon className="w-5 h-5 text-green-600" />
      </div>
      <div>
        <div className="font-medium text-slate-900">Fairly Easy to Read</div>
        <div className="text-sm text-slate-600">8th grade reading level</div>
      </div>
    </div>
  </div>

  {/* Content Stats */}
  <div className="grid grid-cols-2 gap-4 mb-6">
    <div className="p-3 bg-slate-50 rounded-lg">
      <div className="text-2xl font-bold text-slate-900">1,247</div>
      <div className="text-sm text-slate-500">Words</div>
    </div>
    <div className="p-3 bg-slate-50 rounded-lg">
      <div className="text-2xl font-bold text-slate-900">5m 12s</div>
      <div className="text-sm text-slate-500">Reading Time</div>
    </div>
    <div className="p-3 bg-slate-50 rounded-lg">
      <div className="text-2xl font-bold text-slate-900">83</div>
      <div className="text-sm text-slate-500">Sentences</div>
    </div>
    <div className="p-3 bg-slate-50 rounded-lg">
      <div className="text-2xl font-bold text-slate-900">15</div>
      <div className="text-sm text-slate-500">Avg Words/Sentence</div>
    </div>
  </div>

  {/* Issues & Suggestions */}
  <div className="space-y-3">
    <div className="text-sm font-semibold text-slate-900">Suggestions:</div>

    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
      <AlertIcon className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-slate-900">
          Long sentences detected
        </p>
        <p className="text-xs text-slate-600 mt-1">
          5 sentences are over 25 words. Consider breaking them down.
        </p>
        <button className="mt-2 text-xs text-[#2558fa] hover:underline">
          Show sentences
        </button>
      </div>
    </div>

    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
      <InfoIcon className="w-5 h-5 text-[#2558fa] flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-slate-900">
          Add more transition words
        </p>
        <p className="text-xs text-slate-600 mt-1">
          Currently 18% (target: 30%+). Use words like "however", "moreover",
          "therefore".
        </p>
      </div>
    </div>
  </div>
</div>
```

---

## 🎨 SPECIALIZED CONTENT BLOCKS

### Callout/Info Boxes

```jsx
{/* Info Callout */}
<div className="my-6 flex gap-4 p-4 bg-blue-50 border-l-4 border-[#2558fa] rounded-r-xl">
  <div className="flex-shrink-0">
    <div className="w-8 h-8 bg-[#2558fa] rounded-lg flex items-center justify-center">
      <InfoIcon className="w-5 h-5 text-white" />
    </div>
  </div>
  <div>
    <h4 className="font-semibold text-slate-900 mb-1">Did you know?</h4>
    <p className="text-sm text-slate-700">
      Korea exports over 2 million vehicles annually, with Africa being one of the fastest-growing markets.
    </p>
  </div>
</div>

{/* Warning Callout */}
<div className="my-6 flex gap-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-xl">
  <div className="flex-shrink-0">
    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
      <AlertIcon className="w-5 h-5 text-white" />
    </div>
  </div>
  <div>
    <h4 className="font-semibold text-slate-900 mb-1">Important Notice</h4>
    <p className="text-sm text-slate-700">
      Always verify dealer credentials and vehicle inspection reports before making a purchase.
    </p>
  </div>
</div>

{/* Success Callout */}
<div className="my-6 flex gap-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-xl">
  <div className="flex-shrink-0">
    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
      <CheckIcon className="w-5 h-5 text-white" />
    </div>
  </div>
  <div>
    <h4 className="font-semibold text-slate-900 mb-1">Success Story</h4>
    <p className="text-sm text-slate-700">
      Our verified dealers have successfully delivered 8,500+ vehicles to African buyers with 98% satisfaction rate.
    </p>
  </div>
</div>

{/* Tip Callout - Brand Gradient */}
<div className="my-6 relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-[#2558fa]/10 via-[#4f7aff]/10 to-[#7c9dff]/10" />
  <div className="absolute inset-0 opacity-5" style={{backgroundImage: /* Plus Grid */}} />

  <div className="relative flex gap-4 p-6">
    <div className="flex-shrink-0">
      <div className="w-10 h-10 bg-gradient-to-br from-[#2558fa] to-[#7c9dff] rounded-xl flex items-center justify-center">
        <LightbulbIcon className="w-6 h-6 text-white" />
      </div>
    </div>
    <div>
      <h4 className="font-semibold text-slate-900 mb-2">Pro Tip from SK AutoSphere</h4>
      <p className="text-slate-700">
        Use our dealer verification badges to quickly identify trusted sellers. Verified dealers undergo strict quality checks and have proven track records.
      </p>
    </div>
  </div>
</div>
```

### Code Blocks (Technical Content)

```jsx
<div className="my-8 bg-slate-900 rounded-xl overflow-hidden">
  {/* Header */}
  <div className="flex items-center justify-between px-6 py-3 bg-slate-800 border-b border-slate-700">
    <div className="flex items-center gap-3">
      <select className="bg-slate-700 text-white text-sm px-3 py-1 rounded border-none">
        <option>JavaScript</option>
        <option>Python</option>
        <option>TypeScript</option>
      </select>
      <span className="text-xs text-slate-400">api-integration.js</span>
    </div>
    <button className="flex items-center gap-2 text-sm text-slate-300 hover:text-white">
      <CopyIcon className="w-4 h-4" />
      Copy
    </button>
  </div>

  {/* Code Content */}
  <div className="p-6 overflow-x-auto">
    <pre className="text-sm text-slate-100">
      <code>{`const fetchDealers = async () => {
  const response = await fetch('https://api.skautosphere.com/dealers');
  const data = await response.json();
  return data.dealers.filter(d => d.verified === true);
};`}</code>
    </pre>
  </div>
</div>
```

### Comparison Table

```jsx
<div className="my-8 overflow-x-auto">
  <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm">
    <thead>
      <tr className="bg-slate-50 border-b border-slate-200">
        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
          Feature
        </th>
        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
          Basic
        </th>
        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">
          Premium
        </th>
        <th className="px-6 py-4 text-center text-sm font-semibold text-[#2558fa]">
          <div className="flex items-center justify-center gap-2">
            <StarIcon className="w-4 h-4" />
            Enterprise
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-slate-100">
        <td className="px-6 py-4 text-sm text-slate-700">
          Dealer Network Access
        </td>
        <td className="px-6 py-4 text-center">
          <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
        </td>
        <td className="px-6 py-4 text-center">
          <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
        </td>
        <td className="px-6 py-4 text-center bg-blue-50/30">
          <CheckIcon className="w-5 h-5 text-green-500 mx-auto" />
        </td>
      </tr>
      <tr className="border-b border-slate-100">
        <td className="px-6 py-4 text-sm text-slate-700">Inspection Reports</td>
        <td className="px-6 py-4 text-center">
          <span className="text-slate-400 text-sm">Basic</span>
        </td>
        <td className="px-6 py-4 text-center">
          <span className="text-slate-700 text-sm">Detailed</span>
        </td>
        <td className="px-6 py-4 text-center bg-blue-50/30">
          <span className="text-[#2558fa] font-medium text-sm">
            Comprehensive
          </span>
        </td>
      </tr>
      {/* More rows... */}
    </tbody>
  </table>
</div>
```

---

## 📱 MOBILE OPTIMIZATION

### Responsive Editor Interface

```jsx
{
  /* Mobile: Simplified Toolbar */
}
<div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 safe-bottom z-50">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <button className="p-2 hover:bg-slate-100 rounded">
        <BoldIcon className="w-5 h-5" />
      </button>
      <button className="p-2 hover:bg-slate-100 rounded">
        <ItalicIcon className="w-5 h-5" />
      </button>
      <button className="p-2 hover:bg-slate-100 rounded">
        <LinkIcon className="w-5 h-5" />
      </button>
      <button className="p-2 hover:bg-slate-100 rounded">
        <ImageIcon className="w-5 h-5" />
      </button>
    </div>
    <button className="p-2 hover:bg-slate-100 rounded">
      <MoreIcon className="w-5 h-5" />
    </button>
  </div>
</div>;

{
  /* Desktop: Full Sidebar */
}
<aside className="hidden lg:block w-80 border-l border-slate-200 bg-white overflow-y-auto">
  {/* Full SEO panel and settings */}
</aside>;
```

---

## ⚡ PERFORMANCE OPTIMIZATIONS

### Image Optimization Pipeline

```typescript
// Automatic WebP conversion with fallback
interface ImageOptimization {
  original: string; // Original upload
  webp: string; // WebP version (85% quality)
  jpeg: string; // JPEG fallback
  thumbnail: string; // 300x300 preview
  medium: string; // 800px width
  large: string; // 1200px width
  blurhash: string; // Blur placeholder
  dominant_color: string; // For background while loading
}

// Implementation
const optimizeImage = async (file: File) => {
  return {
    webp: await convertToWebP(file, { quality: 85 }),
    jpeg: await convertToJPEG(file, { quality: 85 }),
    lazy: true,
    loading: "lazy",
    decoding: "async",
  };
};
```

### Content Delivery

```typescript
// Lazy load images below fold
<img
  src={image.webp}
  srcSet={`${image.medium} 800w, ${image.large} 1200w`}
  sizes="(max-width: 768px) 100vw, 720px"
  loading="lazy"
  decoding="async"
  className="w-full h-auto"
/>

// Prefetch critical resources
<link rel="preload" as="image" href={featuredImage} />
<link rel="preload" as="font" href="/fonts/geist-sans.woff2" crossOrigin="anonymous" />
```

---

## 🚀 PUBLISHING WORKFLOW

### Pre-Publish Checklist

```jsx
<div className="bg-white rounded-xl border border-slate-200 p-6">
  <h3 className="text-lg font-semibold text-slate-900 mb-4">
    Ready to Publish?
  </h3>

  <div className="space-y-4">
    {/* Content Checks */}
    <div>
      <div className="text-sm font-medium text-slate-700 mb-2">
        Content Quality
      </div>
      <div className="space-y-2">
        <ChecklistItem checked={true} label="Title is compelling and clear" />
        <ChecklistItem
          checked={true}
          label="Content is at least 800 words"
          meta="Current: 1,247 words"
        />
        <ChecklistItem
          checked={false}
          label="Add more internal links"
          meta="Current: 1 link (recommended: 3-5)"
          warning
        />
      </div>
    </div>

    {/* SEO Checks */}
    <div className="border-t border-slate-100 pt-4">
      <div className="text-sm font-medium text-slate-700 mb-2">
        SEO Optimization
      </div>
      <div className="space-y-2">
        <ChecklistItem checked={true} label="Meta title and description set" />
        <ChecklistItem
          checked={true}
          label="Focus keyword optimized"
          meta="Density: 1.2% (optimal)"
        />
        <ChecklistItem
          checked={false}
          label="SEO score could be higher"
          meta="Current: 75/100"
          warning
        />
      </div>
    </div>

    {/* Media Checks */}
    <div className="border-t border-slate-100 pt-4">
      <div className="text-sm font-medium text-slate-700 mb-2">
        Media & Images
      </div>
      <div className="space-y-2">
        <ChecklistItem checked={true} label="Featured image uploaded" />
        <ChecklistItem
          checked={true}
          label="All images have alt text"
          meta="5/5 images"
        />
        <ChecklistItem
          checked={false}
          label="Large image detected"
          meta="1 image over 500KB (compress recommended)"
          warning
        />
      </div>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="mt-6 flex gap-3">
    <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-md font-medium">
      Fix Issues First
    </button>
    <button className="flex-1 bg-[#2558fa] hover:bg-[#1a3ec1] text-white px-4 py-3 rounded-md font-medium">
      Publish Anyway
    </button>
  </div>
</div>
```

---

## 📊 ANALYTICS & INSIGHTS

### Post Performance Dashboard

```jsx
<div className="bg-white rounded-xl border border-slate-200 p-6">
  <h3 className="text-lg font-semibold text-slate-900 mb-6">
    Post Performance
  </h3>

  {/* Key Metrics */}
  <div className="grid grid-cols-2 gap-4 mb-6">
    <div className="p-4 bg-gradient-to-br from-[#2558fa]/10 to-[#7c9dff]/10 rounded-xl">
      <div className="text-sm text-slate-600 mb-1">Total Views</div>
      <div className="text-3xl font-bold text-slate-900">4,523</div>
      <div className="text-xs text-green-600 mt-1">+12% vs last month</div>
    </div>

    <div className="p-4 bg-slate-50 rounded-xl">
      <div className="text-sm text-slate-600 mb-1">Avg. Read Time</div>
      <div className="text-3xl font-bold text-slate-900">4m 32s</div>
      <div className="text-xs text-slate-500 mt-1">85% completion rate</div>
    </div>
  </div>

  {/* Traffic Sources */}
  <div className="mb-6">
    <div className="text-sm font-medium text-slate-900 mb-3">
      Traffic Sources
    </div>
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#2558fa]" style={{ width: "62%" }} />
        </div>
        <span className="text-sm text-slate-600 w-20 text-right">62%</span>
        <span className="text-sm text-slate-500 w-32">Organic Search</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500" style={{ width: "18%" }} />
        </div>
        <span className="text-sm text-slate-600 w-20 text-right">18%</span>
        <span className="text-sm text-slate-500 w-32">Direct</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500" style={{ width: "15%" }} />
        </div>
        <span className="text-sm text-slate-600 w-20 text-right">15%</span>
        <span className="text-sm text-slate-500 w-32">Social Media</span>
      </div>
    </div>
  </div>

  {/* Top Keywords */}
  <div>
    <div className="text-sm font-medium text-slate-900 mb-3">
      Top Ranking Keywords
    </div>
    <div className="space-y-2">
      {[
        "import korean cars",
        "buy car from korea",
        "korean vehicles africa",
      ].map((keyword, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-2 hover:bg-slate-50 rounded"
        >
          <span className="text-sm text-slate-700">{keyword}</span>
          <span className="text-xs text-slate-500">{342 - i * 50} visits</span>
        </div>
      ))}
    </div>
  </div>
</div>
```

---

## 🔧 TECHNICAL IMPLEMENTATION

### Recommended Tech Stack

```typescript
// Frontend
Framework: Next.js 14+ (App Router)
Editor: TipTap (ProseMirror)
Styling: Tailwind CSS
Forms: React Hook Form + Zod
State: Zustand or Jotai
UI Components: Radix UI + Custom

// Backend
Database: PostgreSQL (Supabase)
Storage: S3-compatible (images/media)
CDN: Cloudflare
Search: Algolia or Meilisearch

// Integrations
SEO: next-seo
Analytics: Google Analytics 4
Images: next/image + Cloudinary
Schema: JSON-LD structured data
```

### Component Structure

```typescript
/components
  /editor
    - Editor.tsx               // Main editor wrapper
    - Toolbar.tsx              // Floating toolbar
    - SlashMenu.tsx            // Command menu
    - blocks/
      - ImageBlock.tsx
      - VideoBlock.tsx
      - QuoteBlock.tsx
      - CodeBlock.tsx
      - CalloutBlock.tsx
  /seo
    - SEOPanel.tsx             // SEO sidebar
    - MetaFields.tsx           // Title, description
    - ReadabilityScore.tsx     // Content analysis
  /ui
    - button.tsx               // Following SK AutoSphere design
    - card.tsx
    - badge.tsx
    - input.tsx
```

---

## ✅ IMPLEMENTATION CHECKLIST

### Phase 1: Core Editor (Week 1-2)

- [ ] TipTap editor setup with Geist Sans
- [ ] SK AutoSphere color scheme integration
- [ ] Basic formatting (bold, italic, headings)
- [ ] Image upload with drag & drop
- [ ] Auto-save functionality
- [ ] Draft/Publish workflow

### Phase 2: SEO & Content (Week 3-4)

- [ ] SEO panel with real-time scoring
- [ ] Meta fields (title, description, slug)
- [ ] Focus keyword analysis
- [ ] Readability checker
- [ ] Heading hierarchy validation
- [ ] Featured image management

### Phase 3: Advanced Blocks (Week 5-6)

- [ ] Video embeds (YouTube, Vimeo)
- [ ] Quote blocks (3 variants)
- [ ] Code blocks with syntax highlighting
- [ ] Callout boxes (info, warning, tip, success)
- [ ] Comparison tables
- [ ] Slash command menu

### Phase 4: Polish & Optimization (Week 7-8)

- [ ] Image optimization pipeline (WebP conversion)
- [ ] Lazy loading implementation
- [ ] Plus Grid pattern backgrounds
- [ ] Mobile responsive design
- [ ] Performance optimization (<3s load time)
- [ ] Accessibility audit (WCAG AA)
- [ ] Analytics integration

---

## 🎯 SK AutoSphere CONTENT BEST PRACTICES

### Automotive Industry Focus

**Content Categories:**

1. Car Buying Guides
2. Dealer Spotlights
3. Market Insights
4. Shipping & Logistics
5. Success Stories
6. Industry News

**Tone & Voice:**

- Professional yet approachable
- Data-driven with storytelling
- Trustworthy and transparent
- Educational for African buyers
- Highlights Korean quality standards

**SEO Keywords:**

- "Korean cars for Africa"
- "Import vehicles from Korea"
- "Korean auto dealers"
- "Buy car from Korea to [Country]"
- "SK AutoSphere"

**Content Structure:**

1. Hook (problem/opportunity)
2. Context (market background)
3. Solution (how SK AutoSphere helps)
4. Evidence (data, testimonials)
5. Action (CTA to platform)

---

This comprehensive specification provides everything needed to build a world-class blog editor that aligns perfectly with SK AutoSphere's brand identity and serves the automotive marketplace content needs. The design follows the established style guide while incorporating industry-leading SEO and UX best practices.
