# Blog Typography & White Space Guidelines for Next.js

_Transform Your Blog from Wall of Text to Engaging Content_

## 🚨 CURRENT ISSUES IN YOUR SCREENSHOT

Looking at your blog post "Why Korean Cars Are Perfect for African Roads":

**Problems Identified:**

- ❌ No visual hierarchy (everything looks same size)
- ❌ Minimal white space between sections
- ❌ "Step 1/2/3" are same size as body text
- ❌ Bold terms (Road conditions, Fuel availability) should be subheadings
- ❌ Dense paragraphs with no breathing room
- ❌ Hard to scan - readers will bounce

**What It Should Be:**

- ✅ Clear H1 → H2 → H3 hierarchy
- ✅ Generous white space (margins, padding)
- ✅ Scannable structure with visual breaks
- ✅ SEO-optimized heading structure
- ✅ Comfortable reading experience

---

## 📏 THE GOLDEN RULES

### Rule 1: Heading Hierarchy (SEO Critical)

```
H1 (ONE per page) - Page Title
├── H2 - Main Sections
│   ├── H3 - Subsections
│   │   └── H4 - Minor Points
│   └── H3 - Another Subsection
└── H2 - Next Main Section
```

**Your Post Structure SHOULD BE:**

```html
<h1>Why Korean Cars Are Perfect for African Roads</h1>
<p>Introduction paragraph...</p>

<h2>Step 1: Choose the Right Vehicle</h2>
<p>When selecting a Korean car...</p>

<h3>Road Conditions</h3>
<p>SUVs and crossovers handle...</p>

<h3>Fuel Availability</h3>
<p>Diesel vehicles may be...</p>

<h3>Parts Availability</h3>
<p>Popular models have...</p>

<h3>Climate Considerations</h3>
<p>Air conditioning and...</p>

<h2>Step 2: Verify the Vehicle</h2>
<p>Always request a comprehensive...</p>

<h2>Step 3: Understand Import Regulations</h2>
<p>Each African country...</p>

<h3>Nigeria</h3>
<p>Right-hand drive vehicles...</p>

<h3>Kenya</h3>
<p>Maximum 8 years old...</p>

<h3>Ghana</h3>
<p>Duty rates vary...</p>
```

### Rule 2: White Space Standards

**Between Elements (Margin):**

```css
H1 title:        mb-8  (32px bottom margin)
H2 sections:     mt-12 mb-6  (48px top, 24px bottom)
H3 subsections:  mt-8 mb-4   (32px top, 16px bottom)
H4 minor:        mt-6 mb-3   (24px top, 12px bottom)
Paragraphs:      mb-4        (16px bottom)
List items:      mb-2        (8px between items)
```

**Section Padding:**

```css
Article container: py-12 px-6  (48px vertical, 24px horizontal)
Section dividers:  py-8        (32px vertical spacing)
```

### Rule 3: Typography Sizing (SK AutoSphere Aligned)

```css
H1: text-3xl md:text-4xl (30px → 36px on desktop)
H2: text-2xl md:text-3xl (24px → 30px on desktop)
H3: text-xl md:text-2xl  (20px → 24px on desktop)
H4: text-lg             (18px)
Body: text-base         (16px)
Small: text-sm          (14px)

Font weight:
H1: font-bold
H2, H3: font-semibold
H4: font-medium
Body: font-normal
```

---

## 🎨 IMPLEMENTATION FOR YOUR POST

### Complete Next.js Implementation

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      {/* H1 - Page Title */}
      <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
        Why Korean Cars Are Perfect for African Roads
      </h1>

      {/* Meta info */}
      <div className="flex items-center gap-4 text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200">
        <span>5 min read</span>
        <span>•</span>
        <span>Dec 14, 2024</span>
      </div>

      {/* Introduction - LOTS of space after */}
      <div className="prose prose-lg max-w-none mb-12">
        <p className="text-lg text-slate-700 leading-relaxed">
          Korean vehicles have become increasingly popular across Africa due to
          their reliability, fuel efficiency, and excellent value for money.
          Brands like Hyundai, Kia, and Genesis offer a wide range of vehicles
          suited for diverse African road conditions.
        </p>
      </div>

      {/* H2 - Main Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-slate-900 mb-6 pb-3 border-b-2 border-[#2558fa]">
          Step 1: Choose the Right Vehicle
        </h2>

        <p className="text-slate-700 leading-relaxed mb-8">
          When selecting a Korean car for import, consider these factors:
        </p>

        {/* H3 - Subsections with generous spacing */}
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#2558fa] rounded-full"></span>
              Road Conditions
            </h3>
            <p className="text-slate-700 leading-relaxed pl-4">
              SUVs and crossovers handle unpaved roads better, making them ideal
              for rural areas and regions with challenging terrain.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#2558fa] rounded-full"></span>
              Fuel Availability
            </h3>
            <p className="text-slate-700 leading-relaxed pl-4">
              Diesel vehicles may be preferable in some regions due to fuel
              availability and cost considerations.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#2558fa] rounded-full"></span>
              Parts Availability
            </h3>
            <p className="text-slate-700 leading-relaxed pl-4">
              Popular models have better parts networks, ensuring easier
              maintenance and repairs across Africa.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#2558fa] rounded-full"></span>
              Climate Considerations
            </h3>
            <p className="text-slate-700 leading-relaxed pl-4">
              Air conditioning and cooling systems are essential for African
              climates, especially in tropical and desert regions.
            </p>
          </div>
        </div>
      </section>

      {/* H2 - Next Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-slate-900 mb-6 pb-3 border-b-2 border-[#2558fa]">
          Step 2: Verify the Vehicle
        </h2>

        <p className="text-slate-700 leading-relaxed mb-6">
          Always request a comprehensive inspection report before purchasing. SK
          AutoSphere provides AI-powered vehicle inspections that detect hidden
          damage, verify mileage, and assess overall condition.
        </p>

        {/* Callout Box */}
        <div className="bg-blue-50 border-l-4 border-[#2558fa] rounded-r-xl p-6 my-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-[#2558fa] rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Pro Tip</h4>
              <p className="text-sm text-slate-700">
                SK AutoSphere's verification system checks 200+ data points to
                ensure you're getting exactly what you pay for.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* H2 - Final Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-slate-900 mb-6 pb-3 border-b-2 border-[#2558fa]">
          Step 3: Understand Import Regulations
        </h2>

        <p className="text-slate-700 leading-relaxed mb-8">
          Each African country has specific import regulations:
        </p>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              🇳🇬 Nigeria
            </h3>
            <p className="text-slate-700">
              Right-hand drive vehicles prohibited, age restrictions apply
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              🇰🇪 Kenya
            </h3>
            <p className="text-slate-700">
              Maximum 8 years old for imported vehicles
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              🇬🇭 Ghana
            </h3>
            <p className="text-slate-700">
              Duty rates vary by engine size and vehicle age
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section - Extra space */}
      <section className="mt-16 pt-12 border-t border-slate-200">
        <div className="bg-gradient-to-br from-[#2558fa]/10 via-[#4f7aff]/10 to-[#7c9dff]/10 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Ready to Import Your Korean Car?
          </h2>
          <p className="text-slate-700 mb-6 max-w-2xl mx-auto">
            Connect with verified Korean dealers on SK AutoSphere and get
            started today.
          </p>
          <button className="bg-[#2558fa] hover:bg-[#1a3ec1] text-white px-8 py-3 rounded-md font-medium transition-colors">
            Browse Vehicles
          </button>
        </div>
      </section>
    </article>
  );
}
```

---

## 📐 WHITE SPACE VISUALIZATION

### Before (Your Current Layout)

```
Title
Paragraph
Step 1: Choose the Right Vehicle
Paragraph
Road conditions - Paragraph
Fuel availability - Paragraph
Parts availability - Paragraph
Climate considerations - Paragraph
Step 2: Verify the Vehicle
Paragraph
Step 3: Understand Import Regulations
Paragraph
Nigeria - Paragraph
Kenya - Paragraph
Ghana - Paragraph
```

**Issues:** Everything cramped, no breathing room, hard to scan

### After (Recommended Layout)

```
┌─────────────────────────────────────────┐
│  Title (H1)                             │ ← 32px space
│                                         │
│  Meta info                              │ ← 32px space
│                                         │
│  Introduction paragraph                 │ ← 48px space
│                                         │
├─────────────────────────────────────────┤
│  Step 1: Choose the Right Vehicle (H2)  │ ← 24px space
│  Introduction paragraph                 │ ← 32px space
│                                         │
│  Road Conditions (H3)                   │ ← 12px space
│  Paragraph                              │ ← 32px space
│                                         │
│  Fuel Availability (H3)                 │ ← 12px space
│  Paragraph                              │ ← 32px space
│                                         │
│  Parts Availability (H3)                │ ← 12px space
│  Paragraph                              │ ← 32px space
│                                         │
│  Climate Considerations (H3)            │ ← 12px space
│  Paragraph                              │ ← 64px space
│                                         │
├─────────────────────────────────────────┤
│  Step 2: Verify the Vehicle (H2)        │ ← 24px space
│  Paragraph                              │ ← 24px space
│                                         │
│  [Pro Tip Callout Box]                  │ ← 64px space
│                                         │
├─────────────────────────────────────────┤
│  Step 3: Import Regulations (H2)        │ ← 24px space
│  Introduction paragraph                 │ ← 32px space
│                                         │
│  [Nigeria Card]                         │ ← 24px space
│  [Kenya Card]                           │ ← 24px space
│  [Ghana Card]                           │ ← 64px space
│                                         │
├─────────────────────────────────────────┤
│  [CTA Section]                          │
└─────────────────────────────────────────┘
```

---

## 🎨 TAILWIND PROSE CONFIGURATION

### Custom Prose Styles

```tsx
// tailwind.config.ts
export default {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            // Base
            maxWidth: "720px",
            color: "#334155", // slate-700

            // Headings
            h1: {
              color: "#0f172a", // slate-900
              fontWeight: "700",
              fontSize: "2.25rem", // 36px
              lineHeight: "1.1",
              marginTop: "0",
              marginBottom: "2rem", // 32px
            },
            h2: {
              color: "#0f172a",
              fontWeight: "600",
              fontSize: "1.875rem", // 30px
              lineHeight: "1.2",
              marginTop: "3rem", // 48px
              marginBottom: "1.5rem", // 24px
              paddingBottom: "0.75rem",
              borderBottom: "2px solid #2558fa",
            },
            h3: {
              color: "#0f172a",
              fontWeight: "600",
              fontSize: "1.5rem", // 24px
              lineHeight: "1.3",
              marginTop: "2rem", // 32px
              marginBottom: "1rem", // 16px
            },
            h4: {
              color: "#0f172a",
              fontWeight: "500",
              fontSize: "1.25rem", // 20px
              marginTop: "1.5rem",
              marginBottom: "0.75rem",
            },

            // Paragraphs
            p: {
              marginTop: "0",
              marginBottom: "1rem", // 16px
              lineHeight: "1.75",
              fontSize: "1rem", // 16px
            },

            // Lists
            "ul, ol": {
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
              paddingLeft: "1.5rem",
            },
            li: {
              marginTop: "0.5rem",
              marginBottom: "0.5rem",
            },

            // Links
            a: {
              color: "#2558fa",
              textDecoration: "none",
              fontWeight: "500",
              "&:hover": {
                textDecoration: "underline",
              },
            },

            // Blockquotes
            blockquote: {
              fontStyle: "italic",
              color: "#475569", // slate-600
              borderLeftWidth: "4px",
              borderLeftColor: "#2558fa",
              paddingLeft: "1.5rem",
              marginTop: "2rem",
              marginBottom: "2rem",
              backgroundColor: "#eff6ff", // blue-50
              paddingTop: "1rem",
              paddingBottom: "1rem",
              borderRadius: "0 0.5rem 0.5rem 0",
            },

            // Code
            code: {
              color: "#0f172a",
              backgroundColor: "#f1f5f9", // slate-100
              paddingLeft: "0.5rem",
              paddingRight: "0.5rem",
              paddingTop: "0.25rem",
              paddingBottom: "0.25rem",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: "500",
            },

            // Images
            img: {
              marginTop: "2rem",
              marginBottom: "2rem",
              borderRadius: "0.75rem",
            },

            // Strong
            strong: {
              color: "#0f172a",
              fontWeight: "600",
            },
          },
        },
      },
    },
  },
};
```

### Usage in Component

```tsx
<article className="prose prose-lg max-w-none">
  {/* Your markdown/HTML content */}
</article>
```

---

## 📊 SEO HEADING BEST PRACTICES

### 1. One H1 Per Page

```tsx
// ✅ CORRECT
<h1>Why Korean Cars Are Perfect for African Roads</h1>

// ❌ WRONG - Multiple H1s
<h1>Main Title</h1>
<h1>Another Title</h1>
```

### 2. Don't Skip Levels

```tsx
// ✅ CORRECT
<h1>Main Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>

// ❌ WRONG - Skipped H2
<h1>Main Title</h1>
  <h3>Subsection</h3>
```

### 3. Include Keywords

```tsx
// ✅ GOOD - Keywords in headings
<h2>How to Import Korean Cars to Africa</h2>
<h3>Korean Car Import Regulations</h3>

// ❌ POOR - Generic headings
<h2>How It Works</h2>
<h3>The Rules</h3>
```

### 4. Keep Headings Descriptive

```tsx
// ✅ GOOD - Tells what section contains
<h2>Step 1: Choose the Right Vehicle Type</h2>
<h3>Best Korean SUVs for African Roads</h3>

// ❌ POOR - Too vague
<h2>Step 1</h2>
<h3>Vehicles</h3>
```

---

## 🎯 READABILITY METRICS

### Target Metrics for Blog Posts

```
Line Length:        60-80 characters (720px max-width)
Line Height:        1.6-1.8 (body text)
Paragraph Length:   3-5 sentences
H2 Spacing:         48px top, 24px bottom
H3 Spacing:         32px top, 16px bottom
Body Spacing:       16px between paragraphs
Section Spacing:    64px between major sections
```

### Implementation

```tsx
<article className="max-w-3xl mx-auto">
  {/* max-w-3xl = 768px = ~75 chars per line at 16px */}

  <p className="leading-relaxed">{/* leading-relaxed = 1.625 line-height */}</p>
</article>
```

---

## 🚀 QUICK FIXES FOR YOUR POST

### Immediate Changes (Copy-Paste)

```tsx
// Replace your current component with this structure:

export default function BlogPost() {
  return (
    <article className="max-w-3xl mx-auto px-6 py-12">
      {/* Title */}
      <h1 className="text-4xl font-bold text-slate-900 mb-8">
        Why Korean Cars Are Perfect for African Roads
      </h1>

      {/* Intro */}
      <p className="text-lg text-slate-700 leading-relaxed mb-12">
        Korean vehicles have become increasingly popular...
      </p>

      {/* Section 1 */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-slate-900 mb-6 pb-3 border-b-2 border-[#2558fa]">
          Step 1: Choose the Right Vehicle
        </h2>
        <p className="mb-8">When selecting a Korean car...</p>

        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Road Conditions
            </h3>
            <p className="text-slate-700 leading-relaxed">
              SUVs and crossovers handle unpaved roads better...
            </p>
          </div>

          {/* Repeat for other H3s */}
        </div>
      </section>

      {/* Section 2 */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-slate-900 mb-6 pb-3 border-b-2 border-[#2558fa]">
          Step 2: Verify the Vehicle
        </h2>
        <p className="text-slate-700 leading-relaxed mb-6">
          Always request a comprehensive inspection...
        </p>
      </section>

      {/* Section 3 */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-slate-900 mb-6 pb-3 border-b-2 border-[#2558fa]">
          Step 3: Understand Import Regulations
        </h2>
        <p className="mb-8">Each African country has specific...</p>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold mb-3">Nigeria</h3>
            <p>Right-hand drive vehicles prohibited...</p>
          </div>
          {/* Repeat for Kenya, Ghana */}
        </div>
      </section>
    </article>
  );
}
```

---

## 📚 REFERENCE RESOURCES

### Industry Standards

- **Nielsen Norman Group**: 60-75 characters per line optimal
- **Baymard Institute**: 1.5-1.8 line-height for readability
- **Google SEO**: Proper heading hierarchy critical for rankings

### Tools to Check Your Blog

- **Hemingway Editor**: Readability score
- **Lighthouse (Chrome DevTools)**: SEO audit
- **WAVE**: Accessibility checker
- **Screaming Frog**: Heading structure analysis

### Recommended Reading

- "The Elements of Typographic Style" - Robert Bringhurst
- "Butterick's Practical Typography" - Matthew Butterick
- MDN Web Docs: Heading Elements
- Google Search Central: SEO Starter Guide

---

## ✅ CHECKLIST FOR YOUR BLOG

Before publishing, verify:

**Heading Structure:**

- [ ] One H1 per page (post title)
- [ ] H2s for main sections (Step 1, Step 2, Step 3)
- [ ] H3s for subsections (Road Conditions, etc.)
- [ ] No skipped heading levels
- [ ] Keywords in at least 50% of headings

**White Space:**

- [ ] 48px space before H2 sections
- [ ] 32px space before H3 subsections
- [ ] 16px space between paragraphs
- [ ] 64px space between major sections
- [ ] Content max-width: 720-768px

**Typography:**

- [ ] Line height 1.6-1.8 for body text
- [ ] Font size: 16px minimum for body
- [ ] Clear visual hierarchy
- [ ] Consistent font weights

**SEO:**

- [ ] Focus keyword in H1
- [ ] Related keywords in H2s
- [ ] Descriptive heading text
- [ ] Alt text for images
- [ ] Meta description set

---

## 🎨 VISUAL DESIGN ENHANCEMENTS

### Add Visual Breaks

```tsx
{
  /* Divider between sections */
}
<div className="my-16 border-t border-slate-200"></div>;

{
  /* Gradient divider */
}
<div className="my-16 h-px bg-gradient-to-r from-transparent via-[#2558fa] to-transparent"></div>;

{
  /* Decorative icon before H2 */
}
<h2 className="flex items-center gap-3">
  <span className="w-8 h-8 bg-[#2558fa] rounded-lg flex items-center justify-center">
    <CheckIcon className="w-5 h-5 text-white" />
  </span>
  Step 1: Choose the Right Vehicle
</h2>;

{
  /* Side accent */
}
<h3 className="flex items-center gap-2">
  <span className="w-1.5 h-6 bg-[#2558fa] rounded-full"></span>
  Road Conditions
</h3>;
```

### Add Rhythm with Cards

```tsx
{
  /* Country regulations as cards instead of plain text */
}
<div className="grid gap-6 md:grid-cols-2">
  <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-center gap-3 mb-4">
      <span className="text-3xl">🇳🇬</span>
      <h3 className="text-lg font-semibold">Nigeria</h3>
    </div>
    <ul className="space-y-2 text-sm text-slate-700">
      <li className="flex items-start gap-2">
        <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
        <span>Right-hand drive prohibited</span>
      </li>
      <li className="flex items-start gap-2">
        <CheckIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
        <span>Age restrictions apply</span>
      </li>
    </ul>
  </div>
  {/* Repeat for other countries */}
</div>;
```

---

This guide will transform your blog from a wall of text into a professional, scannable, SEO-optimized article! Apply these principles and your readers (and Google) will thank you. 📈
