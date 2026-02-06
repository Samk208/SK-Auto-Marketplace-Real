# AI Features Documentation - SK AutoSphere

This document describes all AI-driven features implemented in SK AutoSphere, how they work with mock data, and how they would integrate with real AI models in production.

---

## Overview

SK AutoSphere is designed as an **AI-first** used Korean vehicle marketplace connecting Korean dealers with African buyers. All AI features currently use sophisticated mock data to demonstrate functionality, with clear pathways for production AI integration.

---

## 1. Smart Listing Generator (Dealers)

**Location:** Dealer Dashboard → AI Tools Section  
**Component:** `components/ai/smart-listing-generator.tsx`  
**Mock Data:** `lib/mock-ai-data.ts` - `generateSmartListing()`

### What It Does

Automatically generates optimized listing content from minimal dealer input.

### Mock Implementation

- **Input:** Make, Model, Year, Mileage, Destination Port
- **Output:**
  - AI-optimized title (3 variations, randomly selected)
  - SEO-friendly description (3 templates based on vehicle details)
  - Market-based price suggestion (calculated from base prices + depreciation factors)
  - Recommended tags (export-ready, port-specific, condition badges)
  - Image enhancement suggestions (brightness, color, composition)
  - Confidence score (85-95% range)

### Production Integration

\`\`\`typescript
// Replace mock function with real AI call
const result = await generateText({
model: "openai/gpt-4.1",
prompt: `Generate a compelling vehicle listing for:
Make: ${make}, Model: ${model}, Year: ${year}
Mileage: ${mileage}km, Port: ${port}

    Include: optimized title, SEO description, suggested price range,
    relevant tags, and image enhancement recommendations.`,

temperature: 0.7
})
\`\`\`

---

## 2. Buyer Match Engine

**Location:** `/find-vehicle` page  
**Component:** `components/ai/buyer-match-engine.tsx`  
**Mock Data:** `lib/mock-ai-data.ts` - `findVehicleMatches()`

### What It Does

Matches buyers with perfect vehicles based on needs, budget, and destination.

### Mock Implementation

- **Input:** Budget, Destination Country, Vehicle Type, Max Year
- **Output:**
  - Ranked vehicle matches (by AI score 85-92%)
  - Match reasons (4 specific explanations per vehicle)
  - Export route optimization (Korea port → African port)
  - Estimated landed cost (vehicle + shipping + duties estimate)
  - Transit time estimates

### Mock Matching Logic

\`\`\`typescript
// Current: Rule-based matching

- Budget compatibility
- Destination port availability
- Vehicle type matching
- Year criteria
- Dealer reliability scoring

// Production: Vector similarity search
const matches = await vectorSearch({
query: userRequirements,
embeddings: vehicleListings,
filters: { budget, destination, type },
k: 10
})
\`\`\`

### Production Integration

Use semantic search with vehicle embeddings and user preference vectors to find truly optimal matches based on historical successful transactions.

---

## 3. Visual Vehicle Inspection AI

**Location:** Car Detail Page  
**Component:** `components/ai/condition-report.tsx`  
**Mock Data:** `lib/mock-ai-data.ts` - `generateConditionReport()`

### What It Does

Analyzes vehicle images to detect condition issues and verify claims.

### Mock Implementation

**Competitive Advantage:** Unlike Autowini which relies on manual inspection reports, SK AutoSphere's AI detects issues instantly from photos, offering a "smart" first pass even before physical inspection.

- **Input:** Array of vehicle images (URLs)
- **Output:**
  - 2-5 condition flags per vehicle
  - Severity levels: info, warning, critical
  - Categories: Exterior, Interior, Tires, Engine, Paint, Mileage
  - Confidence scores (78-95%)
  - Visual indicators with icons

### Mock Analysis

Randomly selects from 7 pre-defined condition flags, sorts by severity, and displays with confidence scores.

### Production Integration

\`\`\`typescript
// Computer vision model (e.g., fal.ai, Replicate)
const analysis = await fal.subscribe("fal-ai/vehicle-inspection", {
input: {
image_urls: vehicleImages,
check_for: ["scratches", "dents", "tire_condition", "rust", "interior_wear"]
}
})

// Returns structured condition report with bounding boxes
\`\`\`

Real models would detect:

- Paint damage with location heatmaps
- Tire tread depth measurement
- Interior wear patterns
- Odometer fraud detection
- Frame damage indicators

---

## 4. Conversational Assistant / SK Auto Copilot

**Location:** Floating button (bottom-right, all pages)  
**Component:** `components/sk-auto-copilot.tsx`  
**Mock Data:** `lib/mock-ai-data.ts` - `getCopilotAIResponse()`

### What It Does

24/7 AI assistant for listing help, pricing, export estimates, and translations.

### Mock Implementation

- **Chat Interface:** Full conversational UI with message history
- **Quick Actions:** Pre-defined common questions
- **Response Logic:** Keyword-based pattern matching
  - "list my car" → listing creation guidance
  - "export cost" → shipping estimate process
  - "translate" → translation service info
  - "price" → pricing recommendation flow

### Mock Responses

\`\`\`typescript
// Current: Rule-based keyword detection
if (message.includes("export cost")) {
return "To estimate costs, I need: vehicle type, departure port..."
}

// Production: Full LLM conversation
const stream = await streamText({
model: "openai/gpt-4.1",
messages: conversationHistory,
system: `You are SK Auto Copilot, an expert assistant for the 
           Korean→African vehicle export marketplace. Help users with:
           - Listing creation, - Pricing strategy, - Export logistics,
           - Documentation, - Translation services`,
tools: {
createListing: tool({...}),
estimateShipping: tool({...}),
translateText: tool({...})
}
})
\`\`\`

### Production Tools

Real assistant would have tools to:

- Create draft listings directly
- Calculate real-time shipping quotes via APIs
- Translate using Google Translate API
- Search vehicle inventory
- Generate price recommendations

---

## 5. Market Insights Dashboard (Dealers)

**Location:** Dealer Dashboard → AI Insights section  
**Component:** `components/ai/market-insights-dashboard.tsx`  
**Mock Data:** `lib/mock-ai-data.ts` - `generateMarketInsights()`

### What It Does

Provides data-driven recommendations for inventory and pricing optimization.

### Mock Implementation

Returns 5 actionable insights:

1. **High Demand Alert:** "SUVs to Nigeria +45% inquiries"
2. **Route Optimization:** "Busan→Lagos cheapest this quarter"
3. **Pricing Opportunities:** "10 vehicles under-priced by 12-18%"
4. **Seasonal Trends:** "Pickup trucks +60% demand in Q1"
5. **Competitive Analysis:** "Your pricing 8% below market average"

### Mock Insight Structure

\`\`\`typescript
{
title: string,
description: string,
actionable: boolean,
data?: {
trend?: string,
route?: string,
vehicles?: Array<{price, suggestedPrice}>
}
}
\`\`\`

### Production Integration

\`\`\`typescript
// Real-time analytics from database
const insights = await analyzeMarketTrends({
dealerId: dealer.id,
timeframe: "last_30_days",
metrics: ["demand_by_type", "pricing_gaps", "route_costs", "seasonal_patterns"]
})

// ML model predictions
const predictions = await predictDemand({
vehicleTypes: dealer.inventory,
targetMarkets: dealer.destinations,
historicalData: transactionHistory
})
\`\`\`

Real insights would come from:

- Transaction data analysis
- Search query trends
- Competitor pricing monitoring
- Shipping cost fluctuations
- Currency exchange impacts
- Regional demand patterns

---

## 6. Multilingual Listing Translator

**Location:** Dealer Dashboard → AI Tools  
**Component:** `components/ai/listing-translator.tsx`  
**Mock Data:** `lib/mock-ai-data.ts` - `translateListing()`

### What It Does

Translates vehicle listings to reach buyers across French, Swahili, Arabic, and Portuguese-speaking African markets.

### Mock Implementation

- **Supported Languages:** Français, Kiswahili, العربية, Português
- **Translation Method:** Simple keyword replacement
  - "Excellent Condition" → "Excellent État" (French)
  - "Low Mileage" → "Maili Chache" (Swahili)

### Mock Limitations

Only translates pre-defined automotive phrases, not full text.

### Production Integration

\`\`\`typescript
// Real translation API
const translation = await translateText({
text: listingContent,
from: "en",
to: targetLanguage,
glossary: automotiveTerms, // Technical terms dictionary
preserveFormatting: true
})

// Or use AI SDK with GPT-4
const { text } = await generateText({
model: "openai/gpt-4.1",
prompt: `Translate this vehicle listing to ${targetLanguage}.
           Preserve all technical specifications and numbers.
           Use automotive industry terminology: ${listingContent}`
})
\`\`\`

Real implementation would:

- Translate full listings (title + description)
- Preserve technical specifications
- Use automotive glossaries
- Maintain formatting and structure
- Support batch translation

---

## Data Flow Architecture

### Mock Data (Current)

\`\`\`
User Input → Mock Function → Calculated/Random Result → UI Display
\`\`\`

All mock functions in `lib/mock-ai-data.ts` use:

- Deterministic calculations (price = base + factors)
- Random selection from predefined templates
- Rule-based logic (if/else conditions)

### Production Data (Future)

\`\`\`
User Input → API Route → AI Model → Structured Response → UI Display
\`\`\`

Example production flow:
\`\`\`typescript
// app/api/ai/smart-listing/route.ts
export async function POST(req: Request) {
const { make, model, year, mileage, port } = await req.json()

const { text } = await generateText({
model: "openai/gpt-4.1",
prompt: buildListingPrompt(make, model, year, mileage, port),
temperature: 0.7
})

return Response.json({ result: parseListing(text) })
}
\`\`\`

---

## Testing AI Features

### Smart Listing Generator

1. Go to Dealer Dashboard
2. Fill in: Hyundai, Sonata, 2022, 50000km, Tema
3. Click "Generate Smart Listing"
4. Observe: Title, description, price ($28,000 range), tags, enhancements

### Buyer Match Engine

1. Navigate to `/find-vehicle`
2. Enter: Budget $15,000, Ghana, Bus, Year 2015
3. Click "Find My Perfect Vehicle"
4. See: 3 matched buses with 85-92% scores, export routes, landed costs

### AI Condition Report

1. Open any car detail page
2. Scroll to "AI Condition Report" section
3. Wait 2 seconds for analysis simulation
4. See: 3-5 condition flags with severity and confidence

### SK Auto Copilot

1. Click bot icon (bottom-right)
2. Ask: "Help me list my car"
3. Receive: Step-by-step listing guidance
4. Try quick questions for instant responses

### Market Insights

1. Open Dealer Dashboard
2. Scroll to "AI Market Insights" card
3. View: 5 insights with actionable recommendations
4. Click "Take Action" on pricing opportunities

### Listing Translator

1. Dealer Dashboard → AI Tools
2. Enter listing text
3. Select "Français"
4. Click "Translate Listing"
5. See: Mock French translation (keywords only)

---

## Future Enhancements

### Phase 2 (Real AI Integration)

- [ ] Integrate OpenAI GPT-4 for text generation
- [ ] Add computer vision models for vehicle inspection
- [ ] Implement vector database for semantic search
- [ ] Connect translation APIs (DeepL or Google Cloud)

### Phase 3 (Advanced AI)

- [ ] Predictive pricing with market data
- [ ] Fraud detection algorithms
- [ ] Demand forecasting models
- [ ] Personalized recommendations
- [ ] Automated quality scoring

### Phase 4 (Full Automation)

- [ ] AI-powered negotiations
- [ ] Auto-generate inspection reports
- [ ] Smart contract integration
- [ ] Real-time price adjustments

---

## Cost Estimates (Production)

### Per Feature (Monthly, 1000 dealers, 10k buyers)

| Feature                 | Model                 | Est. Cost           |
| ----------------------- | --------------------- | ------------------- |
| Smart Listing Generator | GPT-4                 | $200-400            |
| Buyer Match Engine      | Vector Search + GPT-4 | $300-500            |
| Visual Inspection       | Computer Vision API   | $500-800            |
| Copilot Chat            | GPT-4 Streaming       | $1000-1500          |
| Market Insights         | GPT-4 + Analytics     | $200-300            |
| Translation             | DeepL API             | $100-200            |
| **Total**               |                       | **$2,300-3,700/mo** |

Costs scale with usage. Caching and optimization can reduce by 30-50%.

---

## Mock Data Files

All AI mock functions located in:

- `lib/mock-ai-data.ts` - Main AI response generators
- `lib/mock-assistant-answers.ts` - Copilot responses
- `lib/mock-shop-data.ts` - Vehicle listings with AI scores

---

## Summary

SK AutoSphere's AI features provide a complete AI-first marketplace experience with:
✅ Smart content generation for dealers  
✅ Intelligent vehicle matching for buyers  
✅ Automated visual inspections  
✅ 24/7 conversational assistance  
✅ Data-driven market insights  
✅ Multilingual support

All features are production-ready UI with clear integration paths for real AI models.
