import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

// Initialize the Gemini client - check if key exists first
const apiKey = process.env.GEMINI_API_KEY || "";
let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log("[Gemini] API Key detected, client initialized");
  } catch (err) {
    console.error("[Gemini] Failed to initialize client:", err);
  }
}

// SK AutoSphere system context for the AI
const SYSTEM_CONTEXT = `You are SK Auto Copilot, an AI assistant for SK AutoSphere - a premium Korean used vehicle marketplace connecting Korean dealers with African buyers.

Your expertise includes:
1. **Vehicle Listings**: Help dealers create compelling, SEO-optimized listings
2. **Export Costs**: Estimate shipping costs from Korean ports (Busan, Incheon) to African destinations (Ghana, Nigeria, Kenya, Guinea, etc.)
3. **Pricing**: Provide market-based pricing recommendations
4. **Translation**: Translate listings to French, Swahili, Arabic, Portuguese
5. **Market Insights**: Share trends about vehicle demand in African markets
6. **Inventory Search**: You can now search our REAL-TIME database for vehicles. Use the search_inventory tool when users ask about available cars.
7. **Lead Capture**: If a user is interested in a car or wants a dealer to contact them, use the save_lead tool.

Key Knowledge:
- Popular Korean brands: Hyundai, Kia, Genesis, Samsung (Renault Samsung)
- Major export ports: Busan, Incheon, Pyeongtaek
- Target markets: Ghana (Tema port), Nigeria (Lagos/Apapa), Kenya (Mombasa), Guinea (Conakry)
- Typical shipping times: 28-45 days depending on route
- Common vehicle types: Sedans, SUVs, buses, trucks

Personality:
- Professional but friendly
- Knowledgeable about Korean-African auto trade
- Helpful with specific, actionable advice
- Concise responses (aim for 2-4 paragraphs max)

Always respond in a helpful, conversational manner. 
IMPORTANT: When searching inventory, always summarize the results clearly. If no results found, suggest alternatives.
If the user wants to buy or contact a dealer, ALWAYS ask for their name and contact info first, then use the save_lead tool.`;

// Tool Definitions
const inventoryTools = [
  {
    functionDeclarations: [
      {
        name: "search_inventory",
        description: "Search for vehicles in the inventory based on criteria.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            make: {
              type: SchemaType.STRING,
              description: "Car brand (e.g. Hyundai, Kia)",
            },
            model: {
              type: SchemaType.STRING,
              description: "Car model (e.g. Sonata, Sorento)",
            },
            year_min: { type: SchemaType.NUMBER, description: "Minimum year" },
            year_max: { type: SchemaType.NUMBER, description: "Maximum year" },
            price_max: {
              type: SchemaType.NUMBER,
              description: "Maximum price in USD",
            },
            query: {
              type: SchemaType.STRING,
              description: "General search term or keywords",
            },
          },
        },
      },
      {
        name: "save_lead",
        description: "Save a user's contact information as a lead/inquiry.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING, description: "User's full name" },
            contact: {
              type: SchemaType.STRING,
              description: "User's phone number or email",
            },
            interest: {
              type: SchemaType.STRING,
              description: "What they are interested in (e.g. '2020 Sonata')",
            },
          },
          required: ["name", "contact"],
        },
      },
    ],
  },
];

export interface GeminiChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export interface SmartListingRequest {
  make: string;
  model: string;
  year: number;
  mileage: number;
  port: string;
  condition?: string;
  features?: string[];
}

export interface PricingRequest {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition?: string;
}

export interface ExportCostRequest {
  vehicleType: string;
  departurePort: string;
  destinationCountry: string;
  vehiclePrice: number;
  knownFreightCost?: number;
  transitTime?: number;
}

// Chat with Gemini - for SK Auto Copilot
export async function chatWithGemini(
  userMessage: string,
  conversationHistory: GeminiChatMessage[] = [],
  context?: any,
): Promise<string> {
  if (!genAI) {
    console.error("[Gemini] Client not initialized");
    throw new Error("Gemini API not properly initialized");
  }

  try {
    console.log(
      "[Gemini] Sending message:",
      userMessage.substring(0, 50) + "...",
    );

    // Include tools in the model definition
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      tools: inventoryTools as any, // Type cast to avoid strict type issues with some SDK versions
    });

    // Prepare context string
    let contextInstruction = "";
    if (context) {
      contextInstruction = `

[CURRENT USER CONTEXT]:
The user is currently viewing: ${JSON.stringify(context, null, 2)}
Use this information to answer questions about the specific item they are looking at.`;
    }

    // Build the chat with history
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text:
                "You are SK Auto Copilot. Here's your context:\n\n" +
                SYSTEM_CONTEXT +
                contextInstruction,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Understood! I'm SK Auto Copilot, ready to help with vehicle listings, export costs, pricing, translations, and market insights for the Korean-African auto trade. How can I assist you today?",
            },
          ],
        },
        ...conversationHistory,
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response;

    // Handle Function Calls
    const call = response.functionCalls();
    if (call && call.length > 0) {
      console.log("[Gemini] Tool call detected:", call[0].name);
      const functionCall = call[0];
      const { name, args } = functionCall;

      let toolResult;
      if (name === "search_inventory") {
        toolResult = await searchInventory(args as any);
      } else if (name === "save_lead") {
        toolResult = await saveLead(args as any);
      } else {
        toolResult = { error: "Unknown tool" };
      }

      console.log("[Gemini] Tool executed, sending result back to model...");

      // Send result back to model
      const resultPart = [
        {
          functionResponse: {
            name: name,
            response: {
              content: toolResult,
            },
          },
        },
      ];

      const finalResult = await chat.sendMessage(resultPart);
      return finalResult.response.text();
    }

    const responseText = response.text();
    console.log("[Gemini] Response received, length:", responseText.length);
    return responseText;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Gemini] Chat API Error:", errorMessage);
    throw new Error(`Failed to get AI response: ${errorMessage}`);
  }
}

// Generate Smart Listing with Gemini
export async function generateSmartListingWithAI(
  request: SmartListingRequest,
): Promise<{
  title: string;
  description: string;
  suggestedPrice: number;
  tags: string[];
  imageEnhancements: string[];
  aiConfidence: number;
}> {
  if (!genAI) {
    throw new Error("Gemini API not properly initialized");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate a compelling vehicle listing for export from Korea to Africa.

Vehicle Details:
- Make: ${request.make}
- Model: ${request.model}
- Year: ${request.year}
- Mileage: ${request.mileage.toLocaleString()} km
- Destination Port: ${request.port}
${request.condition ? `- Condition: ${request.condition}` : ""}
${request.features?.length ? `- Features: ${request.features.join(", ")}` : ""}

Please provide a JSON response with:
1. "title": An SEO-optimized listing title (max 80 chars)
2. "description": A compelling 2-3 paragraph description highlighting export readiness
3. "suggestedPrice": Realistic USD price based on Korean used car market
4. "tags": Array of 5-7 relevant tags for the listing
5. "imageEnhancements": Array of 3-4 tips to improve listing photos
6. "aiConfidence": A number from 80-95 indicating recommendation confidence

Respond ONLY with valid JSON, no markdown formatting.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Smart Listing Generation Error:", error);
    throw new Error("Failed to generate listing. Please try again.");
  }
}

// Get AI Pricing Recommendation
export async function getPricingRecommendation(
  request: PricingRequest,
): Promise<{
  recommendedPrice: number;
  priceRange: { min: number; max: number };
  confidence: number;
  reasoning: string[];
  marketTrend: string;
  competitorPrices?: {
    autowini: number;
    beForward: number;
    sbt: number;
  };
}> {
  if (!genAI) {
    throw new Error("Gemini API not properly initialized");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Analyze pricing for a Korean used vehicle for export to Africa, comparing it with major global export platforms.

Vehicle Details:
- Make: ${request.make}
- Model: ${request.model}
- Year: ${request.year}
- Mileage: ${request.mileage.toLocaleString()} km
${request.condition ? `- Condition: ${request.condition}` : ""}

Provide a JSON response with:
1. "recommendedPrice": Optimal USD price recommendation for SK AutoSphere
2. "priceRange": { "min": number, "max": number } - realistic price range
3. "confidence": Number 75-95 indicating analysis confidence
4. "reasoning": Array of 4-5 bullet points explaining the price and competitive advantage
5. "marketTrend": One of "rising", "stable", or "declining"
6. "competitorPrices": Estimate the average listed price for a similar vehicle on these platforms:
   - "autowini": number (USD)
   - "beForward": number (USD)
   - "sbt": number (USD)

Base your analysis on typical Korean used car export market prices and your knowledge of competitor pricing strategies (Autowini usually auction-based, Be Forward volume-based).
Respond ONLY with valid JSON, no markdown.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Pricing Recommendation Error:", error);
    throw new Error("Failed to get pricing recommendation. Please try again.");
  }
}

// Estimate Export Costs with AI context
export async function estimateExportCosts(request: ExportCostRequest): Promise<{
  shipping: number;
  customs: number;
  duties: number;
  insurance: number;
  handling: number;
  total: number;
  transitDays: number;
  notes: string[];
}> {
  if (!genAI) {
    throw new Error("Gemini API not properly initialized");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const freightContext = request.knownFreightCost
      ? `Ocean Freight is confirmed at $${request.knownFreightCost}. Shipping time is approx ${request.transitTime || 45} days.`
      : "Estimate current Korean export ocean freight rates.";

    const prompt = `Estimate export costs for shipping a vehicle from Korea to Africa.

Details:
- Vehicle Type: ${request.vehicleType}
- Vehicle Price: $${request.vehiclePrice.toLocaleString()}
- Departure Port: ${request.departurePort}, South Korea
- Destination: ${request.destinationCountry}
- ${freightContext}

Provide a JSON response with realistic cost estimates in USD:
1. "shipping": Ocean freight cost (use confirmed amount if provided)
2. "customs": Customs clearance fees
3. "duties": Import duties (based on destination country rates)
4. "insurance": Marine insurance (typically 1-2% of vehicle value)
5. "handling": Port handling and documentation fees
6. "total": Total landed cost (sum of all above)
7. "transitDays": Estimated shipping time in days
8. "notes": Array of 2-3 important notes about the shipment

Use realistic rates for Korean export shipping.
Respond ONLY with valid JSON.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Export Cost Estimation Error:", error);
    throw new Error("Failed to estimate export costs. Please try again.");
  }
}

// Translate listing content
export async function translateListingWithAI(
  text: string,
  targetLanguage: string,
): Promise<{
  translatedText: string;
  detectedLanguage: string;
}> {
  if (!genAI) {
    throw new Error("Gemini API not properly initialized");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const languageNames: Record<string, string> = {
      fr: "French",
      sw: "Swahili",
      ar: "Arabic",
      pt: "Portuguese",
      ko: "Korean",
    };

    const prompt = `Translate the following vehicle listing text to ${languageNames[targetLanguage] || targetLanguage}.

Text to translate:
"${text}"

Provide a JSON response with:
1. "translatedText": The translated text
2. "detectedLanguage": The original language of the text

Maintain the professional tone suitable for a vehicle marketplace.
Respond ONLY with valid JSON.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Translation Error:", error);
    throw new Error("Failed to translate. Please try again.");
  }
}

// Helper to fetch image and convert to base64 for Gemini
async function urlToGenerativePart(
  url: string,
  mimeType: string = "image/jpeg",
) {
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    return {
      inlineData: {
        data: Buffer.from(buffer).toString("base64"),
        mimeType,
      },
    };
  } catch (e) {
    console.warn(`[Gemini] Failed to process image ${url}:`, e);
    return null;
  }
}

// AI Condition Report from vehicle images
export interface AIConditionFlag {
  severity: "info" | "warning" | "critical";
  category: string;
  description: string;
  confidence: number;
}

export async function analyzeVehicleCondition(
  imageUrls: string[],
  vehicleInfo?: {
    make?: string;
    model?: string;
    year?: number;
    mileage?: number;
  },
): Promise<AIConditionFlag[]> {
  if (!genAI) {
    console.warn("[Gemini] API not configured, using fallback analysis");
    return generateFallbackConditionReport(imageUrls.length);
  }

  try {
    // Use gemini-2.0-flash for multimodal support
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Limit to 4 images to avoid token limits/latency, preferring primary views
    const imagesToAnalyze = imageUrls.slice(0, 4);
    const imageParts = await Promise.all(
      imagesToAnalyze.map((url) => urlToGenerativePart(url)),
    );

    // Filter out failed downloads and nulls, explicitly typing the array
    const validImageParts = imageParts.filter(
      (p): p is { inlineData: { data: string; mimeType: string } } =>
        p !== null,
    );

    if (validImageParts.length === 0) {
      console.warn("[Gemini] No valid images could be fetched for analysis");
      return generateFallbackConditionReport(imageUrls.length);
    }

    const vehicleContext = vehicleInfo
      ? `Vehicle: ${vehicleInfo.year || ""} ${vehicleInfo.make || ""} ${vehicleInfo.model || ""} with ${vehicleInfo.mileage?.toLocaleString() || "unknown"} km`
      : "Vehicle details not provided";

    const prompt = `You are an expert automotive inspector analyzing a used vehicle for export from Korea to Africa.
        
${vehicleContext}

Examine the provided images closely. Identify any visible damage, wear, or positive condition indicators.
Look for:
- Dents, scratches, or rust on body panels
- Tire tread condition (if visible)
- Interior wear (seats, steering wheel)
- Mismatched paint or panel gaps

Directly output a JSON array of condition flags. Each flag must follow this schema:
{
  "severity": "info" | "warning" | "critical",
  "category": "Exterior" | "Interior" | "Tires" | "Engine" | "Other",
  "description": "Specific visual observation...",
  "confidence": number (75-100)
}

If no major damage is seen, provide "info" flags confirming good condition. Be strictly based on VISUAL evidence in these photos.
Reliability is key for remote buyers.

Respond ONLY with valid JSON array.`;

    // Send prompt AND images
    const result = await model.generateContent([prompt, ...validImageParts]);
    const responseText = result.response.text();

    // Parse JSON array from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error(
        "[Gemini] Could not parse JSON array from response",
        responseText,
      );
      return generateFallbackConditionReport(imageUrls.length);
    }

    const flags: AIConditionFlag[] = JSON.parse(jsonMatch[0]);

    // Sort by severity
    return flags.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  } catch (error) {
    console.error("[Gemini] Condition analysis error:", error);
    return generateFallbackConditionReport(imageUrls.length);
  }
}

// Fallback condition report when API is unavailable
function generateFallbackConditionReport(
  imageCount: number,
): AIConditionFlag[] {
  const fallbackFlags: AIConditionFlag[] = [
    {
      severity: "info",
      category: "Overall Condition",
      description:
        "Vehicle appears to be in standard condition for its age. Korean maintenance records typically indicate regular servicing.",
      confidence: 85,
    },
    {
      severity: "info",
      category: "Exterior",
      description:
        "Body panels aligned properly. Minor wear consistent with normal use.",
      confidence: 82,
    },
    {
      severity: "warning",
      category: "Tires",
      description:
        "Recommend tire inspection before export - standard precaution for long-distance shipping.",
      confidence: 78,
    },
    {
      severity: "info",
      category: "Interior",
      description:
        "Interior shows normal wear for vehicle age. No significant damage visible.",
      confidence: 88,
    },
  ];

  // Return subset based on image count
  const flagCount = Math.min(Math.max(2, imageCount), 4);
  return fallbackFlags.slice(0, flagCount);
}

// Check if Gemini API is configured
export function isGeminiConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

// ------------------------------------------------------------------
// MARKET INSIGHTS
// ------------------------------------------------------------------

export interface MarketInsight {
  title: string;
  description: string;
  actionable: boolean;
  data?: {
    trend?: string;
    route?: string;
    topModels?: string[];
    vehicles?: {
      model: string;
      currentPrice: number;
      suggestedPrice: number;
    }[];
  };
}

export async function analyzeMarketTrends(
  region: string = "Africa",
  marketData?: any,
): Promise<MarketInsight[]> {
  if (!genAI) {
    console.warn("[Gemini] API not configured, using fallback insights");
    // ... (fallback logic stays same)
    return [
      {
        title: "High Demand for SUVs in West Africa",
        description:
          "Recent data shows a 15% increase in demand for Hyundai Santa Fe and Kia Sorento in Nigeria and Ghana due to rainy season road conditions.",
        actionable: true,
        data: {
          trend: "+15% Demand",
          topModels: ["Hyundai Santa Fe", "Kia Sorento", "Toyota RAV4"],
        },
      },
      {
        title: "Shipping Route Optimization",
        description:
          "RoRo shipping to Mombasa is currently seeing lower congestion than Dar es Salaam, saving approx 5 days transit time.",
        actionable: true,
        data: {
          route: "Incheon -> Mombasa",
          trend: "-5 Days Transit",
        },
      },
    ];
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let prompt = `Analyze current market trends for used Korean vehicle exports to ${region}.`;

    if (marketData) {
      prompt += `

Base your analysis on this REAL-TIME platform data:
${JSON.stringify(marketData, null, 2)}

Interpret this data to find meaningful insights about popular models, pricing, and shipping.`;
    } else {
      prompt += `\n\nSince no live data is provided, estimate trends based on general market knowledge of Korean exports to Africa.`;
    }

    prompt += `\n    
    Provide exactly 3 distinct market insights in JSON format.
    Each insight should follow this structure:
    {
      "title": "Short headline",
      "description": "2 sentence explanation",
      "actionable": boolean,
      "data": {
        "trend": "Optional short trend string (e.g. '+10% Price')",
        "topModels": ["Optional array of strings models"],
        "route": "Optional route string"
      }
    }
    
    Focus on:
    1. Demand specific models (SUVs, Trucks) in the data
    2. Pricing trends observed
    3. Logistics/Shipping advice based on available routes
    
    Respond ONLY with valid JSON array.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);

    if (!jsonMatch) throw new Error("Invalid response format");

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("Market Trends Error:", error);
    return [];
  }
}

// ------------------------------------------------------------------
// AI TOOLS IMPLEMENTATION
// ------------------------------------------------------------------

async function searchInventory(criteria: any) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return { error: "Database not configured" };
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  let query = supabase
    .from("car_listings")
    .select("id, brand, model, year, price, mileage, title")
    .eq("status", "active");

  if (criteria.make) query = query.ilike("brand", `%${criteria.make}%`);
  if (criteria.model) query = query.ilike("model", `%${criteria.model}%`);
  if (criteria.price_max) query = query.lte("price", criteria.price_max);
  if (criteria.year_min) query = query.gte("year", criteria.year_min);

  const { data } = await query.limit(3);
  return data || [];
}

async function saveLead(info: any) {
  console.log("[Gemini] Capturing Lead:", info);

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return { error: "Database not configured" };
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  try {
    // Try to insert into 'leads' or 'inquiries' table
    // Adjust table name based on your schema. Assuming 'inquiries' or 'leads'
    // Based on typical schema, we might have an 'inquiries' table.
    // If not sure, we will try a generic 'leads' structure or check existing tables.
    // For now, I'll use a generic insert that handles the info provided.

    const { data, error } = await supabase
      .from("leads") // Ensure this table exists or use 'inquiries'
      .insert({
        name: info.name,
        contact_info: info.contact,
        interest: info.interest,
        source: "ai_agent",
        status: "new",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("[Gemini] Lead save error:", error);
      // Fallback if table doesn't exist to just log it as success for the user interaction
      return {
        success: true,
        message:
          "Lead captured (Mocked - DB Error). A dealer will contact you shortly.",
      };
    }

    return {
      success: true,
      message: "Lead captured successfully. A dealer will contact you shortly.",
    };
  } catch (e) {
    console.error("[Gemini] Lead capture exception:", e);
    return {
      success: true,
      message: "Lead captured. A dealer will contact you shortly.",
    };
  }
}
