// ============================================
// DESIGN SCOUT — Public API
// ============================================
// Import these from Next.js API routes, scripts, or any consumer.
// The CLI (cli.ts) is the only CLI-specific entry point.

// Modules
export { crawlSite, crawlMultiple } from "./modules/crawler.js";
export { analyzeSite, analyzeMultiple } from "./modules/analyzer.js";
export { generateBrief } from "./modules/brief-generator.js";
export {
  saveAnalysis,
  saveBrief,
  getByCategory,
  getBriefs,
} from "./modules/storage.js";

// Prompts and categories
export { CATEGORY_OVERLAYS, SECTION_PROMPTS } from "./prompts/index.js";

// Types
export type {
  ScoutConfig,
  CrawlResult,
  Screenshot,
  UIAnalysis,
  DesignPattern,
  AntiPattern,
  DesignBrief,
  LibraryEntry,
} from "./types/index.js";

// LLM utilities (for advanced use — custom model selection, etc.)
export { chatCompletion, resetClient, base64ImageBlock } from "./lib/llm.js";
export type { LLMConfig, CompletionOptions } from "./lib/llm.js";
