# Best GitHub Examples & Resources for SK AutoSphere i18n

A curated collection of production-ready examples, open-source projects, and resources that directly relate to your SK AutoSphere internationalization implementation.

---

## 📑 Table of Contents

1. [Next.js Internationalization Libraries](#nextjs-i18n)
2. [AI-Powered Translation with Caching](#ai-translation)
3. [React Context Pattern for i18n](#react-context)
4. [E-commerce with Next.js + Supabase](#ecommerce-examples)
5. [Production Automotive Marketplaces](#automotive-platforms)
6. [Gemini API Context Caching](#gemini-caching)

---

## 🌐 Next.js Internationalization Libraries {#nextjs-i18n}

### 1. **next-intl** (Most Popular, 11k+ stars)

**Repository:** https://github.com/amannn/next-intl

**Why it's relevant:**

- Modern App Router support (like your SK AutoSphere)
- Type-safe translations
- Server Components compatible
- Similar hook-based API: `useTranslations()`

**Key Features:**

```typescript
// Similar to your implementation
import {useTranslations} from 'next-intl';

export default function UserProfile({user}) {
  const t = useTranslations('UserProfile');
  return (
    <section>
      <h1>{t('title', {firstName: user.firstName})}</h1>
      <p>{t('followers', {count: user.numFollowers})}</p>
    </section>
  );
}
```

**What you can learn:**

- Parameter interpolation patterns
- Pluralization handling
- Date/number formatting
- Dynamic route localization

**Docs:** https://next-intl.dev/

---

### 2. **next-i18next** (8.5k+ stars)

**Repository:** https://github.com/i18next/next-i18next

**Why it's relevant:**

- Most mature Next.js i18n solution
- Serverless deployment optimized
- Multiple namespace support

**Key Features:**

```typescript
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "footer"])),
    },
  };
}
```

**What you can learn:**

- Server-side translation loading
- Namespace organization
- Translation file structure
- Production optimization strategies

**Blog post (migration to App Router):** https://locize.com/blog/next-app-dir-i18n/

---

### 3. **next-international** (Type-safe, 2k+ stars)

**Repository:** https://github.com/QuiiBz/next-international

**Why it's relevant:**

- 100% TypeScript with type-safe keys
- Zero dependencies (like your implementation!)
- Simple Context API approach

**Key Features:**

```typescript
// Define translations with full TypeScript support
const en = {
  hello: "Hello {name}!",
  "nav.shop": "Shop Cars",
} as const;

// Autocomplete works!
const { t } = useTranslation();
t("nav.shop"); // ✅ Autocomplete + type checking
t("nav.shope"); // ❌ TypeScript error
```

**What you can learn:**

- TypeScript type-safety for translation keys
- Simple implementation patterns
- Minimal dependency approach

**Docs:** https://next-international.vercel.app/

---

## 🤖 AI-Powered Translation with Caching {#ai-translation}

### 4. **translator-ai** (Multi-provider with caching)

**Repository:** https://github.com/DatanoiseTV/translator-ai

**Why it's DIRECTLY relevant:**

- Supports Gemini + OpenAI (like your implementation)
- **Incremental caching** (exactly what you need!)
- Multi-file deduplication
- Cost-effective design

**Key Features:**

```bash
# Translate with caching
translator-ai source.json -l es -o spanish.json

# Uses cache for repeated content - HUGE cost savings
# Cache hit rate tracking built-in
```

**Architecture:**

```
Cache Check → Translation API → Save to Cache
    ↓              ↓                  ↓
  Free         Costs $$           Next time free
```

**What you can learn:**

- Cache implementation strategies
- Batch processing optimization
- Cost tracking and reporting
- Multi-provider fallback patterns

---

### 5. **audarma** (LLM Translation for React/Next.js)

**Repository:** https://github.com/audarma/audarma

**Why it's relevant:**

- **Caching layer** for dynamic content
- React hook pattern (like yours)
- Database-backed translations

**Key Features:**

```typescript
// Very similar to your useListingTranslation hook!
function ProductCard({ product }) {
  const { text: title, isTranslating } = useViewTranslation(
    'product_title',
    product.id,
    product.title
  );

  return (
    <div>
      <h3>{title}</h3>
      {isTranslating && <Spinner />}
    </div>
  );
}
```

**What you can learn:**

- ViewProvider pattern for batch loading
- Translation status management
- Cache invalidation strategies

---

### 6. **i18n-ai-translate** (CLI tool, 1k+ stars)

**Repository:** https://github.com/taahamahdi/i18n-ai-translate

**Why it's relevant:**

- Supports Gemini, ChatGPT, Claude, DeepSeek
- Batch translation of JSON files
- Variable preservation (`{{name}}`)

**Key Features:**

```bash
# Translate multiple languages at once
i18n-ai-translate translate -i i18n/en.json -o fr es de \
  -e gemini -m gemini-2.0-flash-exp

# GitHub Action integration
- uses: taahamahdi/i18n-ai-translate@master
  with:
    json-file-path: i18n/en.json
    api-key: ${{ secrets.GEMINI_API_KEY }}
```

**What you can learn:**

- Batch processing patterns
- CI/CD integration
- Variable interpolation handling
- Cost optimization through batching

---

### 7. **StremioSubMaker** (Production caching example)

**Repository:** https://github.com/xtremexq/StremioSubMaker

**Why it's relevant:**

- **Dual-layer cache** (memory + Redis/disk)
- Permanent translation database
- Production-ready rate limiting
- Gemini API integration

**Architecture:**

```
User Request
    ↓
Memory Cache? → YES → Return (instant)
    ↓ NO
Database Cache? → YES → Return (~100ms)
    ↓ NO
Gemini API → Translate → Cache → Return (~2-3s)
```

**What you can learn:**

- Multi-layer caching strategies
- Rate limiting implementation
- Cache warming techniques
- Production monitoring

---

## ⚛️ React Context Pattern for i18n {#react-context}

### 8. **react-i18n-context**

**Repository:** https://github.com/pocesar/react-i18n-context

**Why it's relevant:**

- Pure Context API implementation (like yours)
- Async translation loading
- Simple Provider pattern

**Key Features:**

```tsx
// Very similar to your LanguageProvider!
<I18nProvider defaultLanguage="en" source={loader}>
  <h1>
    <I18nInline path="world.hello" />
  </h1>
  <I18nRawConsumer>
    {(context) => (
      <button onClick={() => context.setLanguage("ko")}>한국어</button>
    )}
  </I18nRawConsumer>
</I18nProvider>
```

**What you can learn:**

- Context API best practices
- Async translation loading
- Language switching UX

---

### 9. **React Context i18n Tutorial by Seerat Awan**

**Article:** https://www.seeratawan.me/blog/react-internationalization-using-context-api/

**Why it's relevant:**

- Step-by-step Context API implementation
- No external dependencies
- Very similar to your approach

**Key Code:**

```typescript
// Almost identical to your implementation!
export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState<Language>(
    (navigator.language.slice(0, 2) as Language) || 'en'
  );

  return (
    <I18nContext.Provider value={{ language, setLanguage, i18n }}>
      {children}
    </I18nContext.Provider>
  );
};
```

**What you can learn:**

- Browser language detection
- Context structure
- Hook implementation patterns

---

### 10. **react-i18next** (Most popular, 9k+ stars)

**Repository:** https://github.com/i18next/react-i18next

**Why it's relevant:**

- Industry standard
- Production-tested at scale
- Comprehensive feature set

**Key Features:**

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('ko')}>
        한국어
      </button>
    </div>
  );
}
```

**What you can learn:**

- Advanced pluralization
- Lazy loading strategies
- SSR/SSG optimization
- Testing strategies

**Docs:** https://react.i18next.com/

---

## 🛒 E-commerce with Next.js + Supabase {#ecommerce-examples}

### 11. **HiyoRi E-commerce**

**Repository:** https://github.com/clonglam/HiyoRi-Ecommerce-Nextjs-Supabase

**Why it's HIGHLY relevant:**

- Next.js 14 + Supabase (exact same stack!)
- Row Level Security implementation
- Drizzle ORM (alternative to Prisma)
- GraphQL for complex queries

**Architecture:**

```
Next.js 14 App Router
    ↓
Supabase (PostgreSQL)
    ↓
RLS Policies (Security)
    ↓
GraphQL (Complex Queries)
```

**What you can learn:**

- Product catalog structure
- Search implementation
- Supabase RLS patterns
- Image storage strategies

---

### 12. **Supabase SaaS Template** (i18n support)

**Repository:** https://github.com/Razikus/supabase-nextjs-template

**Why it's relevant:**

- **i18n support (EN/PL/ZH)** built-in
- Production-ready authentication
- File storage patterns
- Mobile app included

**Key Features:**

- Pre-configured i18n
- Legal documents in markdown
- Theme customization
- Full TypeScript

**What you can learn:**

- Production deployment patterns
- Multi-language legal docs
- Auth + i18n integration
- Mobile/web code sharing

---

## 🚗 Production Automotive Marketplaces {#automotive-platforms}

### 13. **Top Automotive Marketplaces Analysis**

**Source:** [ResearchAndMarkets.com Report](https://www.prnewswire.com/news-releases/global-automotive-marketplaces-report-2022-identify-the-top-50-largest-automotive-marketplace-and-classified-sites-301669010.html)

**Why it's relevant:**

- Industry benchmarks for car marketplaces
- Best practices from leaders
- Market analysis for your target regions

**Key Players:**

1. **CarMax** (USA) - Largest used car retailer
   - Multi-language "sell my car" feature
   - Seamless digital/physical integration

2. **Carsales** (Australia) - Regional leader
   - Multi-country operations
   - Dealer network management

3. **Kavak** (Mexico/LatAm) - Fastest growing
   - Mobile-first approach
   - Cross-border operations (like your model!)

4. **Mobile.de** (Germany) - European leader
   - Multi-language platform
   - Extensive dealer integration

5. **Africar Group** (Africa) - 46 websites in 45 countries
   - **Most relevant to your African market!**
   - Localized approach per country
   - Multiple languages per region

**What you can learn:**

- Market-specific feature requirements
- Pricing strategies by region
- Dealer vs buyer experience optimization
- Cross-border transaction handling

---

## 🔥 Gemini API Context Caching {#gemini-caching}

### 14. **Google Cloud Gemini Context Caching Examples**

**Repository:** https://github.com/GoogleCloudPlatform/generative-ai

**Notebook:** `gemini/context-caching/intro_context_caching.ipynb`

**Why it's DIRECTLY relevant:**

- Official Gemini caching examples
- Cost optimization techniques
- TTL management

**Key Concepts:**

```python
# Cache large context (like vehicle descriptions)
cached_content = caching.CachedContent.create(
    model='gemini-2.0-flash-exp',
    system_instruction='You are a car listing translator...',
    contents=[large_car_listing_database],
    ttl=3600  # 1 hour cache
)

# Reuse cached context (saves $$)
response = generative_models.GenerativeModel.from_cached_content(
    cached_content=cached_content
).generate_content('Translate to Korean')
```

**What you can learn:**

- Context caching strategies
- Cost calculation
- TTL optimization
- When to use vs when not to

**Vercel AI Issue Discussion:** https://github.com/vercel/ai/issues/3212

---

### 15. **Prompt Engineering Guide - Gemini Caching**

**Repository:** https://github.com/dair-ai/Prompt-Engineering-Guide

**Notebook:** `notebooks/gemini-context-caching.ipynb`

**Why it's relevant:**

- Practical caching examples
- Prompt optimization
- Cost-effective patterns

**What you can learn:**

- Effective prompt design
- Cache hit rate optimization
- Batch processing strategies

---

### 16. **Production Caching Case Study**

**Article:** ["Enhancing Automated Translation: Migrating to Gemini and Prompt Caching"](https://abysim.medium.com/enhancing-automated-translation-migrating-to-gemini-and-prompt-caching-for-claude-eadfb4725eba) by Abysim

**Why it's relevant:**

- Real production implementation
- Cost comparison (DeepSeek → Gemini 2.5 Pro)
- Laravel + Gemini integration

**Key Insights:**

- Gemini 2.0 Flash for analysis
- Claude 3.7 Sonnet for final translations
- Prompt caching reduced costs by 50%
- Asynchronous batch processing

**Architecture:**

```
1. Basic Translation (Gemini Flash)
    ↓
2. Analysis (Gemini 2.5 Pro)
    ↓
3. Refinement (Claude with caching)
    ↓
4. Final Output
```

**What you can learn:**

- Multi-model pipeline design
- Cost optimization strategies
- Real-world caching metrics
- Error handling patterns

---

## 📊 Comparison Table: Which to Study First?

| Resource                    | Relevance  | Complexity | Learning Priority |
| --------------------------- | ---------- | ---------- | ----------------- |
| **translator-ai**           | ⭐⭐⭐⭐⭐ | Medium     | **Start here**    |
| **audarma**                 | ⭐⭐⭐⭐⭐ | Medium     | **Start here**    |
| **next-intl**               | ⭐⭐⭐⭐   | Low        | Study patterns    |
| **HiyoRi E-commerce**       | ⭐⭐⭐⭐⭐ | High       | Study structure   |
| **Supabase SaaS Template**  | ⭐⭐⭐⭐   | Medium     | Study i18n setup  |
| **StremioSubMaker**         | ⭐⭐⭐⭐⭐ | High       | Study caching     |
| **Gemini Caching Examples** | ⭐⭐⭐⭐⭐ | Low        | **Study first**   |
| **Production Case Study**   | ⭐⭐⭐⭐⭐ | Medium     | Read for insights |

---

## 🎯 Action Plan: What to Study When

### Week 1: Foundation (Caching & Core Patterns)

1. **Gemini Context Caching** (Official docs)
   - How caching works
   - Cost calculations
   - TTL strategies

2. **translator-ai** (GitHub)
   - Cache implementation
   - Batch processing
   - Cost tracking

3. **audarma** (GitHub)
   - React hook patterns
   - Database caching
   - Status management

### Week 2: Advanced Patterns

4. **next-intl** (GitHub + Docs)
   - Type-safe translations
   - Server Components patterns
   - Route localization

5. **StremioSubMaker** (GitHub)
   - Multi-layer caching
   - Rate limiting
   - Production monitoring

### Week 3: E-commerce Integration

6. **HiyoRi E-commerce** (GitHub)
   - Product catalog structure
   - Search implementation
   - Supabase RLS patterns

7. **Supabase SaaS Template** (GitHub)
   - i18n configuration
   - Auth integration
   - Production deployment

### Week 4: Optimization

8. **Production Case Study** (Medium article)
   - Real-world metrics
   - Cost optimization
   - Pipeline design

9. **Africar Group** (Research)
   - African market strategies
   - Multi-country operations
   - Localization approaches

---

## 💡 Key Takeaways for Your Implementation

### What You're Doing Right ✅

1. **Context API Approach**
   - Similar to `react-i18n-context` and custom implementations
   - No unnecessary dependencies
   - Simple and maintainable

2. **Caching Strategy**
   - Matches `translator-ai` and `StremioSubMaker` patterns
   - Database-backed translations
   - View count tracking

3. **Gemini Integration**
   - Using latest Flash model (cost-effective)
   - Proper prompt engineering
   - Error handling

### What You Can Add 🚀

1. **From translator-ai:**
   - Cache statistics dashboard
   - Multi-file deduplication
   - Batch processing improvements

2. **From audarma:**
   - ViewProvider for bulk loading
   - Better loading states
   - Prefetching strategies

3. **From StremioSubMaker:**
   - Memory + Database dual caching
   - Rate limiting
   - Cache warming

4. **From HiyoRi:**
   - GraphQL for complex queries
   - Better search implementation
   - Image optimization

5. **From Production Case Study:**
   - Asynchronous batch processing
   - Multi-model pipeline (Gemini → final check)
   - Cost monitoring dashboards

---

## 🔗 Quick Reference Links

### Libraries

- next-intl: https://next-intl.dev/
- next-i18next: https://github.com/i18next/next-i18next
- react-i18next: https://react.i18next.com/

### AI Translation Tools

- translator-ai: https://github.com/DatanoiseTV/translator-ai
- audarma: https://github.com/audarma/audarma
- i18n-ai-translate: https://github.com/taahamahdi/i18n-ai-translate

### E-commerce Examples

- HiyoRi: https://github.com/clonglam/HiyoRi-Ecommerce-Nextjs-Supabase
- Supabase Template: https://github.com/Razikus/supabase-nextjs-template

### Caching Resources

- Gemini Caching: https://ai.google.dev/gemini-api/docs/caching
- Google Cloud Examples: https://github.com/GoogleCloudPlatform/generative-ai
- Vercel AI Discussion: https://github.com/vercel/ai/issues/3212

### Production Case Studies

- Translation Optimization: https://abysim.medium.com/enhancing-automated-translation-migrating-to-gemini-and-prompt-caching-for-claude-eadfb4725eba
- Automotive Marketplaces: https://www.prnewswire.com/news-releases/global-automotive-marketplaces-report-2022-identify-the-top-50-largest-automotive-marketplace-and-classified-sites-301669010.html

---

## 🎓 Learning Path Summary

```
You → Gemini Caching Docs → translator-ai → audarma
                                    ↓
                            Your Implementation
                                    ↓
        StremioSubMaker ← next-intl ← HiyoRi E-commerce
                ↓
        Production Optimizations
```

**Estimated Study Time:** 20-30 hours total
**Priority:** Start with caching examples, then move to production patterns

---

**Remember:** Your implementation is already following best practices! These examples are for:

1. **Validation** - Confirming you're on the right track
2. **Optimization** - Finding advanced patterns to add
3. **Inspiration** - Seeing how others solve similar problems

Your 3-tier caching strategy is the RIGHT approach. The examples above will help you refine and optimize it! 🚀
