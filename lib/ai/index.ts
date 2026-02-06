/**
 * SK AutoSphere AI Module
 *
 * Unified AI capabilities supporting both Gemini and OpenAI.
 * Import from '@/lib/ai' for the unified provider.
 */

// Unified provider (recommended)
export {
  chat,
  analyzeVehicleCondition,
  getActiveProvider,
  isAIAvailable,
  getAIStatus,
  getProviderDisplayName,
  type AIProvider,
  type AIConfig,
} from "./provider";

// Individual providers (for direct access)
export {
  chatWithGemini,
  generateSmartListingWithAI,
  getPricingRecommendation,
  estimateExportCosts,
  translateListingWithAI,
  isGeminiConfigured,
} from "@/lib/gemini";

export {
  chatWithOpenAI,
  analyzeVehicleWithOpenAI,
  generateSmartListingWithOpenAI,
  translateWithOpenAI,
  isOpenAIConfigured,
  getAvailableModels,
} from "./openai";
