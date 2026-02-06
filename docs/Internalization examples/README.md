# SK AutoSphere Internationalization (i18n) System

A complete, production-ready internationalization solution that reduces translation costs by **90%** through intelligent caching.

## 🌍 Overview

This system implements a **3-tier translation strategy**:

| Tier       | Content Type                      | Technology        | Cost           |
| ---------- | --------------------------------- | ----------------- | -------------- |
| **Tier 1** | Static UI (nav, buttons, forms)   | Dictionary lookup | **$0**         |
| **Tier 2** | Popular content (cached listings) | Database cache    | **~$0.10/day** |
| **Tier 3** | New content (uncached)            | Gemini API        | **~$1-2/day**  |

**Total Cost:** ~$1-2/day (vs $10-20/day without caching)

## 📦 What's Included

```
sk-autosphere-i18n/
├── lib/
│   └── i18n/
│       ├── LanguageContext.tsx      # Context provider with translations
│       └── listing-translator.ts     # Translation service with caching
├── hooks/
│   ├── useTranslation.ts            # Hook for static translations
│   └── useListingTranslation.ts     # Hook for dynamic content
├── components/
│   ├── LanguageSwitcher.tsx         # Language selection dropdown
│   ├── SiteHeader.tsx               # Example: Translated header
│   └── ListingCard.tsx              # Example: Translated listing card
├── app/
│   └── api/
│       └── translate/
│           └── listing/
│               └── route.ts         # API endpoint for translations
└── supabase/
    └── migrations/
        └── 20241211_listing_translations.sql  # Database schema
```

## 🚀 Quick Start

See [QUICK-START.md](./QUICK-START.md) for 5-minute setup instructions.

## 🎯 Architecture

### Tier 1: Static Content (Free)

All navigation, buttons, form labels, etc. use pre-defined translations:

```typescript
// lib/i18n/LanguageContext.tsx
const translations = {
  en: { 'nav.shop': 'Shop Cars' },
  ko: { 'nav.shop': '매물 검색' },
  fr: { 'nav.shop': 'Acheter des voitures' },
  sw: { 'nav.shop': 'Nunua Magari' },
};

// Usage in component:
const { t } = useTranslation();
<Link>{t('nav.shop')}</Link>
```

**Cost:** $0 (runs in browser)
**Speed:** Instant
**Cache:** Not needed

### Tier 2: Cached Content (Almost Free)

Vehicle listings are translated once and cached in Supabase:

```typescript
// First visitor (Korean viewing English listing):
1. Check database cache -> ❌ Not found
2. Call Gemini API -> ✅ Translate
3. Save to database -> 💾 Cache for everyone
4. Return translation

// Second visitor (Korean viewing same listing):
1. Check database cache -> ✅ Found!
2. Return cached translation
3. Skip API call (save money!)
```

**Cost:** ~$0.10/day (only new content)
**Speed:** ~500ms first time, instant after
**Cache Hit Rate:** ~90% with decent traffic

### Tier 3: On-Demand Translation (Paid)

Only called when translation doesn't exist in cache:

```typescript
// lib/translation/listing-translator.ts
async translateListing(request) {
  // 1. Check cache
  const cached = await getCachedTranslation();
  if (cached) return cached.text;

  // 2. Call Gemini API (costs money)
  const translated = await geminiAPI.translate();

  // 3. Cache result
  await saveToDatabase(translated);

  return translated;
}
```

**Cost:** ~$1-2/day (Gemini Flash is cheap)
**Speed:** ~2-3 seconds
**Frequency:** Only for new/uncached content

## 🔧 Usage Examples

### Example 1: Static Content (Navbar)

```tsx
"use client";
import { useTranslation } from "@/hooks/useTranslation";

export function Navbar() {
  const { t, locale } = useTranslation();

  return (
    <nav>
      <Link href={`/${locale}/shop`}>{t("nav.shop")}</Link>
      <Link href={`/${locale}/about`}>{t("nav.about")}</Link>
      <LanguageSwitcher />
    </nav>
  );
}
```

### Example 2: Dynamic Content (Listing Card)

```tsx
"use client";
import { useListingTranslation } from "@/hooks/useListingTranslation";

export function ListingCard({ listing }) {
  const { title, description, isLoading } = useListingTranslation({
    listingId: listing.id,
    title: listing.title,
    description: listing.description,
    sourceLanguage: "en",
  });

  if (isLoading) return <Skeleton />;

  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span>${listing.price}</span>
    </div>
  );
}
```

### Example 3: Form with Validation

```tsx
"use client";
import { useTranslation } from "@/hooks/useTranslation";

export function ContactForm() {
  const { t } = useTranslation();

  return (
    <form>
      <label>{t("form.name")}</label>
      <input required />
      <span className="error">{t("validation.required")}</span>

      <label>{t("form.email")}</label>
      <input type="email" />

      <button>{t("form.submit")}</button>
    </form>
  );
}
```

## 📊 Performance Metrics

### Expected Cache Performance

With moderate traffic (1000 listings viewed/day):

```
Day 1:
- Cache hit rate: 20% (200 cached, 800 API calls)
- Cost: ~$8

Day 7:
- Cache hit rate: 70% (700 cached, 300 API calls)
- Cost: ~$3

Day 30:
- Cache hit rate: 90% (900 cached, 100 API calls)
- Cost: ~$1
```

### Monitor Cache Hit Rate

```sql
-- Run in Supabase SQL Editor
SELECT
  target_language,
  COUNT(*) as cached_translations,
  SUM(view_count) as total_cache_hits,
  AVG(view_count) as avg_reuse_per_translation
FROM listing_translations
GROUP BY target_language;
```

**Interpretation:**

- `avg_reuse_per_translation` > 10 = Excellent cache efficiency
- `avg_reuse_per_translation` 5-10 = Good cache efficiency
- `avg_reuse_per_translation` < 5 = Consider pre-caching popular listings

## 🌐 Supported Languages

| Code | Language | Native Name | Flag | Status      |
| ---- | -------- | ----------- | ---- | ----------- |
| `en` | English  | English     | 🇺🇸   | ✅ Complete |
| `ko` | Korean   | 한국어      | 🇰🇷   | ✅ Complete |
| `fr` | French   | Français    | 🇫🇷   | ✅ Complete |
| `sw` | Swahili  | Kiswahili   | 🇹🇿   | ✅ Complete |

### Adding More Languages

1. Update type definition:

```typescript
type Locale = "en" | "ko" | "fr" | "sw" | "ja"; // Add 'ja'
```

2. Add translations to dictionary:

```typescript
const translations = {
  // ... existing
  ja: {
    "nav.shop": "車を探す",
    "nav.about": "私たちについて",
    // ... more translations
  },
};
```

3. Update language switcher:

```typescript
const languages = [
  // ... existing
  { code: "ja", name: "日本語", flag: "🇯🇵" },
];
```

4. Update database constraints:

```sql
ALTER TABLE listing_translations
DROP CONSTRAINT listing_translations_source_language_check;

ALTER TABLE listing_translations
ADD CONSTRAINT listing_translations_source_language_check
CHECK (source_language IN ('en', 'ko', 'fr', 'sw', 'ja'));
```

## 🔐 Security

### Row Level Security (RLS)

The database is protected with RLS policies:

```sql
-- Anyone can read translations (they're not sensitive)
CREATE POLICY "Anyone can read translations"
ON listing_translations FOR SELECT
USING (true);

-- Only authenticated users can create/update
CREATE POLICY "Authenticated users can create translations"
ON listing_translations FOR INSERT
TO authenticated
WITH CHECK (true);
```

### API Key Security

**Never expose API keys in client-side code:**

```typescript
// ❌ BAD - Exposed in browser
const apiKey = "your_gemini_key_here";

// ✅ GOOD - Server-side only
const apiKey = process.env.GEMINI_API_KEY;
```

All translation API calls happen server-side via Next.js API routes.

## 🐛 Troubleshooting

### Problem: "useLanguage must be used within LanguageProvider"

**Cause:** Component using `useTranslation()` is outside the LanguageProvider.

**Solution:** Wrap your app in `app/layout.tsx`:

```tsx
<LanguageProvider>{children}</LanguageProvider>
```

### Problem: Translations showing as keys (e.g., "nav.shop")

**Cause:** Translation key doesn't exist in dictionary.

**Solution:** Add the key to all language objects in `lib/i18n/LanguageContext.tsx`.

### Problem: Cache not saving to database

**Cause:** Migration not run or RLS policies blocking.

**Solution:**

```bash
# Run migration
npx supabase db push

# Check RLS policies in Supabase Dashboard
# Table Editor -> listing_translations -> View Policies
```

### Problem: Gemini API errors

**Cause:** Invalid API key or rate limiting.

**Solution:**

```bash
# Check environment variable
echo $GEMINI_API_KEY

# Test API key
curl https://generativelanguage.googleapis.com/v1beta/models \
  -H "x-goog-api-key: $GEMINI_API_KEY"
```

## 📈 Optimization Tips

### 1. Pre-cache Popular Listings

```typescript
// scripts/pre-cache-translations.ts
async function preCachePopularListings() {
  const popular = await getTopListings(100);

  for (const listing of popular) {
    await listingTranslator.translateBatch(
      listing.id,
      [
        { name: "title", text: listing.title },
        { name: "description", text: listing.description },
      ],
      "en",
      "ko", // Pre-cache Korean (most common)
    );
  }
}
```

### 2. Batch Translate New Listings

```typescript
// When dealer creates listing, immediately cache common languages
await listingTranslator.translateBatch(
  listing.id,
  fields,
  "en",
  "ko", // Pre-cache most common language
);
```

### 3. Monitor API Usage

```typescript
// Track API calls vs cache hits
const stats = await listingTranslator.getStats();
console.log("Cache efficiency:", {
  totalTranslations: stats.total_translations,
  totalViews: stats.total_views,
  efficiency: (stats.total_views / stats.total_translations).toFixed(2) + "x",
});
```

## 🎯 Migration Guide

Migrating from hardcoded English? Follow these steps:

### Step 1: Identify Static Content

```bash
# Search for hardcoded text
grep -r "Shop Cars" src/
grep -r "Contact Us" src/
grep -r "About" src/
```

### Step 2: Replace with t() Function

```typescript
// Before
<Link href="/shop">Shop Cars</Link>

// After
const { t, locale } = useTranslation();
<Link href={`/${locale}/shop`}>{t('nav.shop')}</Link>
```

### Step 3: Handle Dynamic Content

```typescript
// Before
<h1>{listing.title}</h1>

// After
const { title } = useListingTranslation({
  listingId: listing.id,
  title: listing.title,
  description: listing.description,
  sourceLanguage: 'en',
});
<h1>{title}</h1>
```

## 📚 API Reference

### `useTranslation()`

```typescript
const { t, locale, setLocale } = useTranslation();

// t(key: string, params?: Record<string, string>): string
t("nav.shop"); // "Shop Cars"
t("dashboard.welcome", { name: "Sam" }); // "Welcome, Sam!"

// locale: 'en' | 'ko' | 'fr' | 'sw'
console.log(locale); // "en"

// setLocale(newLocale: Locale): void
setLocale("ko"); // Switch to Korean
```

### `useListingTranslation()`

```typescript
const { title, description, isLoading, error } = useListingTranslation({
  listingId: string,
  title: string,
  description: string,
  sourceLanguage: 'en' | 'ko' | 'fr' | 'sw',
  features?: string,
  condition?: string,
});
```

### `listingTranslator` Service

```typescript
// Translate single field
await listingTranslator.translateListing({
  listingId: "abc123",
  fieldName: "title",
  originalText: "2020 Hyundai Sonata",
  sourceLanguage: "en",
  targetLanguage: "ko",
});

// Translate multiple fields at once
await listingTranslator.translateBatch(
  "abc123",
  [
    { name: "title", text: "2020 Hyundai Sonata" },
    { name: "description", text: "Well maintained..." },
  ],
  "en",
  "ko",
);

// Get statistics
const stats = await listingTranslator.getStats();

// Clear cache for a listing
await listingTranslator.clearListingCache("abc123");
```

## 🤝 Contributing

To add new translation keys:

1. Add to all languages in `lib/i18n/LanguageContext.tsx`
2. Document usage in comments
3. Add example to this README
4. Test all 4 languages

## 📝 License

MIT License - See LICENSE file for details

## 🎉 Credits

Built for **SK AutoSphere** - Connecting Korean car dealers with African buyers.

**Technology Stack:**

- Next.js 14+ for framework
- Supabase for database caching
- Google Gemini for AI translation
- TypeScript for type safety

---

**Questions?** Check [QUICK-START.md](./QUICK-START.md) or open an issue.
