# Blog Editor - Developer Quick Start Guide

_SK AutoSphere Style Guide Compliant_

## 🎨 Design Tokens (Copy-Paste Ready)

### Colors

```tsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2558fa", // Electric Blue
          dark: "#1a3ec1", // Hover states
          light: "#dbeafe", // Subtle backgrounds
        },
      },
    },
  },
};
```

### Typography

```tsx
// Font: Geist Sans
import localFont from "next/font/local";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

// Apply: className={geistSans.variable}
```

### Component Quick Reference

**Buttons:**

```tsx
// Default
<Button className="bg-[#2558fa] hover:bg-[#1a3ec1]">Publish</Button>

// Secondary
<Button variant="secondary" className="bg-slate-100 hover:bg-slate-200">Save</Button>

// Outline
<Button variant="outline" className="border-2 border-[#2558fa]">Preview</Button>

// Ghost
<Button variant="ghost" className="text-slate-600">Cancel</Button>
```

**Cards:**

```tsx
<Card className="rounded-xl shadow-sm border-slate-200">
  <CardContent className="p-6">{/* Content */}</CardContent>
</Card>
```

**Plus Grid Pattern:**

```tsx
<div className="relative bg-gradient-to-br from-[#2558fa] via-[#4f7aff] to-[#7c9dff]">
  <div
    className="absolute inset-0 opacity-10"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    }}
  />
  {/* Content */}
</div>
```

---

## 📝 Editor Implementation Checklist

### Phase 1: Core Setup

```bash
# Install dependencies
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image \
            @tiptap/extension-link @tiptap/extension-placeholder \
            tailwindcss lucide-react
```

### Phase 2: Editor Component

```tsx
// components/editor/BlogEditor.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";

export function BlogEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: "<p>Start writing...</p>",
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-[#f8fafc]">
      {/* Title Input */}
      <input
        type="text"
        placeholder="Post title..."
        className="w-full text-3xl font-bold text-slate-900 border-none focus:outline-none mb-8"
      />

      {/* Editor */}
      <EditorContent editor={editor} className="prose prose-lg max-w-none" />
    </div>
  );
}
```

### Phase 3: Floating Toolbar

```tsx
// components/editor/FloatingToolbar.tsx
export function FloatingToolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className="flex items-center gap-1 bg-slate-900 text-white rounded-lg shadow-lg px-3 py-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-slate-700 ${
          editor.isActive("bold") ? "bg-slate-700" : ""
        }`}
      >
        <Bold className="w-4 h-4" />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-slate-700 ${
          editor.isActive("italic") ? "bg-slate-700" : ""
        }`}
      >
        <Italic className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-slate-700 mx-1" />

      <button
        onClick={() => {
          const url = window.prompt("URL");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className="p-2 rounded hover:bg-slate-700"
      >
        <Link2 className="w-4 h-4" />
      </button>
    </div>
  );
}
```

### Phase 4: SEO Panel

```tsx
// components/editor/SEOPanel.tsx
export function SEOPanel() {
  const [seoScore, setSeoScore] = useState(0);

  return (
    <aside className="w-80 bg-white border-l border-slate-200 p-6">
      <div className="space-y-6">
        {/* SEO Score */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900">SEO Score</h3>
            <span className="text-3xl font-bold text-[#2558fa]">
              {seoScore}
            </span>
          </div>

          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#2558fa] to-[#7c9dff]"
              style={{ width: `${seoScore}%` }}
            />
          </div>
        </div>

        {/* Meta Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Meta Title
          </label>
          <input
            type="text"
            maxLength={60}
            className="w-full px-4 py-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2558fa]"
          />
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Meta Description
          </label>
          <textarea
            maxLength={160}
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2558fa] resize-none"
          />
        </div>
      </div>
    </aside>
  );
}
```

---

## 🎨 Style Utilities

### Custom Prose Styles

```css
/* app/globals.css */
.prose {
  @apply text-slate-900;
}

.prose h2 {
  @apply text-2xl font-semibold text-slate-900 mt-12 mb-4;
}

.prose h3 {
  @apply text-xl font-semibold text-slate-900 mt-8 mb-3;
}

.prose p {
  @apply text-base leading-relaxed mb-4;
}

.prose a {
  @apply text-[#2558fa] hover:underline;
}

.prose blockquote {
  @apply border-l-4 border-[#2558fa] pl-6 italic;
}

.prose code {
  @apply bg-slate-100 px-2 py-1 rounded text-sm;
}
```

### Animation Utilities

```css
/* Auto-save indicator */
.saving-indicator {
  @apply inline-flex items-center gap-2 text-sm text-slate-500;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Success checkmark */
.success-check {
  @apply text-green-600;
  animation: checkmark 0.3s ease-in-out;
}

@keyframes checkmark {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
```

---

## 📊 State Management

### Editor State (Zustand)

```tsx
// store/editorStore.ts
import { create } from "zustand";

interface EditorStore {
  title: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  isDraft: boolean;
  lastSaved: Date | null;

  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setMetaTitle: (title: string) => void;
  setMetaDescription: (description: string) => void;
  setSlug: (slug: string) => void;
  setIsDraft: (isDraft: boolean) => void;
  updateLastSaved: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  title: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  slug: "",
  isDraft: true,
  lastSaved: null,

  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
  setMetaTitle: (metaTitle) => set({ metaTitle }),
  setMetaDescription: (metaDescription) => set({ metaDescription }),
  setSlug: (slug) => set({ slug }),
  setIsDraft: (isDraft) => set({ isDraft }),
  updateLastSaved: () => set({ lastSaved: new Date() }),
}));
```

---

## 🔧 Helper Functions

### Auto-save Hook

```tsx
// hooks/useAutoSave.ts
import { useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";

export function useAutoSave(editor) {
  const { content, setContent, updateLastSaved } = useEditorStore();

  useEffect(() => {
    if (!editor) return;

    const saveInterval = setInterval(() => {
      const html = editor.getHTML();
      if (html !== content) {
        setContent(html);
        // Save to backend/localStorage
        localStorage.setItem("draft", html);
        updateLastSaved();
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(saveInterval);
  }, [editor, content, setContent, updateLastSaved]);
}
```

### SEO Score Calculator

```tsx
// utils/seoScore.ts
export function calculateSEOScore(data: {
  title: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  focusKeyword?: string;
}): number {
  let score = 0;

  // Title length (50-60 chars)
  if (data.metaTitle.length >= 50 && data.metaTitle.length <= 60) {
    score += 15;
  } else if (data.metaTitle.length > 0) {
    score += 5;
  }

  // Meta description (120-160 chars)
  if (
    data.metaDescription.length >= 120 &&
    data.metaDescription.length <= 160
  ) {
    score += 15;
  } else if (data.metaDescription.length > 0) {
    score += 5;
  }

  // Content length (800+ words)
  const wordCount = data.content.split(/\s+/).length;
  if (wordCount >= 800) {
    score += 20;
  } else if (wordCount >= 400) {
    score += 10;
  }

  // Focus keyword in title
  if (
    data.focusKeyword &&
    data.metaTitle.toLowerCase().includes(data.focusKeyword.toLowerCase())
  ) {
    score += 15;
  }

  // Focus keyword in first paragraph
  const firstPara = data.content.split("</p>")[0];
  if (
    data.focusKeyword &&
    firstPara.toLowerCase().includes(data.focusKeyword.toLowerCase())
  ) {
    score += 15;
  }

  // Headings present
  const h2Count = (data.content.match(/<h2>/g) || []).length;
  if (h2Count >= 3) {
    score += 10;
  } else if (h2Count >= 1) {
    score += 5;
  }

  // Images with alt text
  const imageCount = (data.content.match(/<img/g) || []).length;
  const altCount = (data.content.match(/alt="/g) || []).length;
  if (imageCount > 0 && imageCount === altCount) {
    score += 10;
  }

  return Math.min(score, 100);
}
```

### Slug Generator

```tsx
// utils/slugify.ts
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+|-+$/g, ""); // Trim - from start/end
}
```

---

## 📦 File Structure

```
src/
├── app/
│   ├── blog/
│   │   └── editor/
│   │       └── page.tsx          # Main editor page
│   └── globals.css
├── components/
│   ├── editor/
│   │   ├── BlogEditor.tsx        # Main editor component
│   │   ├── FloatingToolbar.tsx   # Text formatting toolbar
│   │   ├── SlashMenu.tsx         # /command menu
│   │   ├── ImageUpload.tsx       # Image management
│   │   ├── VideoEmbed.tsx        # Video embedding
│   │   └── SEOPanel.tsx          # SEO sidebar
│   └── ui/
│       ├── button.tsx            # Per style guide
│       ├── card.tsx              # Per style guide
│       ├── badge.tsx             # Per style guide
│       └── input.tsx
├── hooks/
│   ├── useAutoSave.ts
│   ├── useEditor.ts
│   └── useSEOScore.ts
├── store/
│   └── editorStore.ts            # Zustand state
├── utils/
│   ├── seoScore.ts
│   ├── slugify.ts
│   └── imageOptimization.ts
└── lib/
    └── tiptap.ts                 # TipTap extensions config
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image \
            @tiptap/extension-link @tiptap/extension-placeholder \
            zustand lucide-react
```

### 2. Add to page

```tsx
// app/blog/editor/page.tsx
import { BlogEditor } from "@/components/editor/BlogEditor";
import { SEOPanel } from "@/components/editor/SEOPanel";

export default function EditorPage() {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <main className="flex-1">
        <BlogEditor />
      </main>
      <SEOPanel />
    </div>
  );
}
```

### 3. Run

```bash
npm run dev
```

---

## ✅ Implementation Checklist

### Week 1-2: Core Editor

- [ ] TipTap setup with Geist Sans
- [ ] Title input with character counter
- [ ] Basic formatting (bold, italic, link)
- [ ] Floating toolbar on text selection
- [ ] Auto-save every 30 seconds
- [ ] Draft/Publish status

### Week 3-4: SEO & Media

- [ ] SEO score calculator
- [ ] Meta title/description fields
- [ ] URL slug auto-generation
- [ ] Focus keyword tracking
- [ ] Image upload with drag & drop
- [ ] Alt text requirement
- [ ] Featured image selector

### Week 5-6: Advanced Features

- [ ] Video embedding (YouTube, Vimeo)
- [ ] Quote blocks (3 variants)
- [ ] Callout boxes (info, warning, tip)
- [ ] Code blocks with syntax highlighting
- [ ] Slash command menu
- [ ] Table of contents auto-generation

### Week 7-8: Polish

- [ ] Image optimization (WebP conversion)
- [ ] Lazy loading
- [ ] Mobile responsive design
- [ ] Readability score
- [ ] Performance optimization
- [ ] Accessibility audit

---

## 📚 Resources

- [TipTap Documentation](https://tiptap.dev/)
- [SK AutoSphere Style Guide](./STYLE-GUIDE.md)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://docs.pmnd.rs/zustand)

---

**Questions?** Reference the [full specification](./SK_AUTOSPHERE_BLOG_EDITOR_SPEC.md) for detailed requirements.
