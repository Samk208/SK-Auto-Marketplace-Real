# BLOG FORMATTING QUICK REFERENCE CARD

_Print this and keep it next to your desk!_

```
┌─────────────────────────────────────────────────────────────────┐
│                  SK AUTOSPHERE BLOG CHEAT SHEET                 │
└─────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════╗
║                    HEADING HIERARCHY                          ║
╚═══════════════════════════════════════════════════════════════╝

H1  →  text-4xl font-bold mb-8
       ✓ ONE per page (post title)
       ✓ 48-60 characters max
       ✓ Include primary keyword

H2  →  text-3xl font-semibold mt-12 mb-6 pb-3 border-b-2
       ✓ Main sections (Step 1, Step 2, etc.)
       ✓ 48px space BEFORE
       ✓ Include related keywords
       ✓ Add visual accent (border/badge)

H3  →  text-xl font-semibold mt-8 mb-3
       ✓ Subsections within H2s
       ✓ 32px space BEFORE
       ✓ Can use bullets/icons

H4  →  text-lg font-medium mt-6 mb-3
       ✓ Minor points (use sparingly)
       ✓ 24px space BEFORE

BODY → text-base leading-relaxed mb-4
       ✓ 16px font size
       ✓ 1.6-1.8 line height
       ✓ 16px space AFTER

╔═══════════════════════════════════════════════════════════════╗
║                      WHITE SPACE RULES                        ║
╚═══════════════════════════════════════════════════════════════╝

After H1:        mb-8  (32px)
Before H2:       mt-12 (48px) ← BIG SPACE!
After H2:        mb-6  (24px)
Before H3:       mt-8  (32px)
After H3:        mb-3  (12px)
Between paras:   mb-4  (16px)
Between sections: mb-16 (64px) ← HUGE SPACE!

Max content width: max-w-3xl (720px)

╔═══════════════════════════════════════════════════════════════╗
║                      COLOR PALETTE                            ║
╚═══════════════════════════════════════════════════════════════╝

Primary:      #2558fa  (Electric Blue)
Hover:        #1a3ec1  (Darker Blue)
Background:   #f8fafc  (Slate-50)
Text:         #0f172a  (Slate-900)
Secondary:    #64748b  (Slate-500)
Border:       #e2e8f0  (Slate-200)

╔═══════════════════════════════════════════════════════════════╗
║                     QUICK CODE SNIPPETS                       ║
╚═══════════════════════════════════════════════════════════════╝

ARTICLE CONTAINER:
<article className="max-w-3xl mx-auto px-6 py-12">

SECTION:
<section className="mb-16">
  <h2 className="text-3xl font-semibold mb-6 pb-3 border-b-2 border-[#2558fa]">

SUBSECTIONS GROUP:
<div className="space-y-8">
  <div>
    <h3 className="text-xl font-semibold mb-3">
    <p className="text-slate-700 leading-relaxed">
  </div>
</div>

CALLOUT BOX:
<div className="bg-blue-50 border-l-4 border-[#2558fa] rounded-r-xl p-6">

CARD:
<div className="bg-white rounded-xl border border-slate-200 p-6">

CTA BUTTON:
<button className="bg-[#2558fa] hover:bg-[#1a3ec1] text-white px-8 py-3 rounded-md">

╔═══════════════════════════════════════════════════════════════╗
║                      SEO CHECKLIST                            ║
╚═══════════════════════════════════════════════════════════════╝

□ One H1 per page
□ H2s for main sections (3-5 per post)
□ H3s for subsections
□ No skipped heading levels (H1→H2→H3, never H1→H3)
□ Keywords in 50%+ of headings
□ Meta title 50-60 characters
□ Meta description 120-160 characters
□ Alt text on all images
□ Internal links (3-5 per post)
□ 800+ words for SEO
□ Paragraphs 3-5 sentences max

╔═══════════════════════════════════════════════════════════════╗
║                    READABILITY RULES                          ║
╚═══════════════════════════════════════════════════════════════╝

✓ 60-75 characters per line
✓ 8th-10th grade reading level
✓ Line height 1.6-1.8
✓ Avoid walls of text (break every 3-4 sentences)
✓ Use visual breaks (headings, images, callouts)
✓ Add white space between sections
✓ Short paragraphs (3-5 sentences)
✓ Active voice 80%+

╔═══════════════════════════════════════════════════════════════╗
║                    COMMON MISTAKES                            ║
╚═══════════════════════════════════════════════════════════════╝

❌ Everything same size → ✅ Clear hierarchy
❌ No space between sections → ✅ 48px+ space
❌ Bold text instead of headings → ✅ Use H2/H3
❌ Long paragraphs → ✅ Break every 3-4 sentences
❌ Generic headings → ✅ Descriptive with keywords
❌ No visual breaks → ✅ Images, callouts, cards
❌ Wall of text → ✅ Scannable with bullets/cards

╔═══════════════════════════════════════════════════════════════╗
║                      VISUAL ACCENTS                           ║
╚═══════════════════════════════════════════════════════════════╝

H2 Accent:
<h2 className="border-b-2 border-[#2558fa] pb-3">

H3 Bullet:
<h3 className="flex items-center gap-2">
  <span className="w-2 h-2 bg-[#2558fa] rounded-full"></span>

Numbered Badge:
<span className="w-10 h-10 bg-[#2558fa] text-white rounded-lg flex items-center justify-center font-bold">
  1
</span>

Section Divider:
<div className="my-12 border-t border-slate-200"></div>

╔═══════════════════════════════════════════════════════════════╗
║                    CONTENT STRUCTURE                          ║
╚═══════════════════════════════════════════════════════════════╝

1. HOOK (H1 + intro) → 32px space
2. MAIN SECTIONS (H2) → 3-5 sections, 48px before each
3. SUBSECTIONS (H3) → Under each H2, 32px before each
4. CALLOUTS → Important tips/warnings
5. CTA → End with clear action

EXAMPLE STRUCTURE:
┌─────────────────────────┐
│ Title (H1)              │ ← 32px
│ Intro paragraph         │ ← 48px
├─────────────────────────┤
│ Section 1 (H2)          │ ← 24px
│   Subsection A (H3)     │ ← 12px
│   Content               │ ← 32px
│   Subsection B (H3)     │ ← 12px
│   Content               │ ← 64px
├─────────────────────────┤
│ Section 2 (H2)          │ ← 24px
│   Content + Callout     │ ← 64px
├─────────────────────────┤
│ CTA Section             │
└─────────────────────────┘

╔═══════════════════════════════════════════════════════════════╗
║                      REMEMBER THIS!                           ║
╚═══════════════════════════════════════════════════════════════╝

🎯 MORE SPACE = BETTER READABILITY
📊 CLEAR HIERARCHY = BETTER SEO
✍️  SHORT PARAGRAPHS = BETTER ENGAGEMENT
🎨 VISUAL BREAKS = LONGER TIME ON PAGE

GOLDEN RULE: If it looks cramped, add more space!

───────────────────────────────────────────────────────────────

BEFORE YOU PUBLISH, ASK:
1. Can I scan the whole post in 10 seconds?
2. Are my main sections obvious at a glance?
3. Is there enough white space?
4. Did I use H2/H3 properly (not just bold)?
5. Are my headings descriptive with keywords?

───────────────────────────────────────────────────────────────
```

## PRINT VERSION (Simplified)

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  BLOG FORMATTING - ESSENTIAL RULES                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

HEADINGS:
  H1: text-4xl mb-8 (ONE per page)
  H2: text-3xl mt-12 mb-6 (Main sections)
  H3: text-xl mt-8 mb-3 (Subsections)

SPACING:
  After H1:      32px (mb-8)
  Before H2:     48px (mt-12)  ← CRITICAL!
  Before H3:     32px (mt-8)
  Between ¶:     16px (mb-4)
  Between §:     64px (mb-16) ← CRITICAL!

COLORS:
  Primary:    #2558fa
  Hover:      #1a3ec1
  Background: #f8fafc
  Border:     #e2e8f0

STRUCTURE:
  <article className="max-w-3xl mx-auto px-6 py-12">
    <h1>Title</h1>
    <p>Intro</p>

    <section className="mb-16">
      <h2 className="text-3xl mb-6 pb-3 border-b-2 border-[#2558fa]">
      <div className="space-y-8">
        <div>
          <h3 className="text-xl mb-3">
          <p className="leading-relaxed">
        </div>
      </div>
    </section>
  </article>

SEO MUST-HAVES:
  ✓ One H1 (title)
  ✓ 3-5 H2s (sections)
  ✓ Keywords in headings
  ✓ No skipped levels
  ✓ 800+ words
  ✓ 3-5 internal links

COMMON FIXES:
  "Step 1" → Make it H2 (text-3xl)
  "Road conditions" → Make it H3 (text-xl)
  Bold paragraph → Make it heading
  Cramped text → Add mb-8/mb-12/mb-16

QUICK TEST:
  Can you scan the post in 10 seconds? → YES = Good!
  Are sections clearly separated? → YES = Good!
  Can you tell what each section is about? → YES = Good!

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  IF IT LOOKS CRAMPED, ADD MORE SPACE! (Double the margin) ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

---

## 📋 DESK REFERENCE (Sticky Note Size)

```
┌──────────────────────────┐
│  BLOG QUICK CHECK        │
├──────────────────────────┤
│ H1: text-4xl mb-8        │
│ H2: text-3xl mt-12 mb-6  │
│ H3: text-xl mt-8 mb-3    │
│                          │
│ Space before H2: 48px!   │
│ Space before H3: 32px!   │
│ Between sections: 64px!  │
│                          │
│ Max width: 720px         │
│ Line height: 1.6-1.8     │
│                          │
│ Colors:                  │
│ • Primary: #2558fa       │
│ • Border: #e2e8f0        │
└──────────────────────────┘
```

---

Save this reference and keep it visible while editing blogs. These rules will transform your content from amateur to professional! 🎯
