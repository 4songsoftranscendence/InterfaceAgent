// ============================================
// DESIGN SCOUT — LLM Client (OpenRouter)
// ============================================
// Centralized client for all AI model calls.
// Uses the OpenAI SDK pointed at OpenRouter, so any
// vision-capable model can be used by changing SCOUT_MODEL.

import OpenAI from "openai";
import type {
  ChatCompletionMessageParam,
  ChatCompletionContentPartImage,
} from "openai/resources/chat/completions";

// ---- Configuration ----

const DEFAULT_MODEL = "google/gemini-2.0-flash-001";
const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";
const DEFAULT_MAX_TOKENS = 8192;

export interface LLMConfig {
  model: string;
  baseUrl: string;
  apiKey: string;
  maxTokens: number;
}

function getConfig(): LLMConfig {
  return {
    apiKey: process.env.OPENROUTER_API_KEY || "",
    model: process.env.SCOUT_MODEL || DEFAULT_MODEL,
    baseUrl: process.env.OPENROUTER_BASE_URL || DEFAULT_BASE_URL,
    maxTokens: Number(process.env.SCOUT_MAX_TOKENS) || DEFAULT_MAX_TOKENS,
  };
}

// ---- Client management ----

let client: OpenAI | null = null;
const clientCache = new Map<string, OpenAI>();

function createClient(apiKey: string, baseUrl: string): OpenAI {
  return new OpenAI({
    apiKey,
    baseURL: baseUrl,
    defaultHeaders: {
      "HTTP-Referer": "https://github.com/4songsoftranscendence/InterfaceAgent",
      "X-Title": "Design Scout",
    },
  });
}

function getClient(): OpenAI {
  if (!client) {
    const config = getConfig();
    if (!config.apiKey) {
      throw new Error(
        "No API key available. Set OPENROUTER_API_KEY in .env or provide a key in the UI."
      );
    }
    client = createClient(config.apiKey, config.baseUrl);
  }
  return client;
}

function getClientForKey(apiKey: string): OpenAI {
  const cached = clientCache.get(apiKey);
  if (cached) return cached;

  const config = getConfig();
  const newClient = createClient(apiKey, config.baseUrl);
  clientCache.set(apiKey, newClient);

  // Limit cache size
  if (clientCache.size > 20) {
    const oldest = clientCache.keys().next().value;
    if (oldest) clientCache.delete(oldest);
  }
  return newClient;
}

/** Reset the client singleton (useful for testing or config changes). */
export function resetClient(): void {
  client = null;
  clientCache.clear();
}

// ---- Image helper ----

/** Convert a base64-encoded image to the OpenAI vision format. */
export function base64ImageBlock(
  base64: string,
  mediaType: string = "image/png"
): ChatCompletionContentPartImage {
  return {
    type: "image_url",
    image_url: {
      url: `data:${mediaType};base64,${base64}`,
    },
  };
}

// ---- Core completion function ----

export interface CompletionOptions {
  system: string;
  messages: ChatCompletionMessageParam[];
  jsonMode?: boolean;
  maxTokens?: number;
  model?: string;
  apiKey?: string;
}

/**
 * Send a chat completion request to OpenRouter.
 *
 * When `jsonMode` is true, the function:
 * 1. Appends a JSON instruction to the system prompt
 * 2. Sets `response_format: { type: "json_object" }`
 * 3. If the model rejects response_format, retries without it
 *
 * When `apiKey` is provided, it overrides the env var key.
 *
 * Returns the raw text content of the response.
 */
export async function chatCompletion(
  options: CompletionOptions
): Promise<string> {
  const config = getConfig();
  const effectiveKey = options.apiKey || config.apiKey;
  if (!effectiveKey) {
    throw new Error(
      "No API key provided. Set OPENROUTER_API_KEY in .env or provide a key in the UI settings."
    );
  }
  const openai = options.apiKey ? getClientForKey(options.apiKey) : getClient();

  const model = options.model || config.model;
  const maxTokens = options.maxTokens || config.maxTokens;

  let systemContent = options.system;
  if (options.jsonMode) {
    systemContent +=
      "\n\nCRITICAL: You MUST respond with valid JSON only. " +
      "No markdown code fences. No preamble text. No explanation outside the JSON structure. " +
      "Begin your response with an opening brace `{` and end with a closing brace `}`.";
  }

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: systemContent },
    ...options.messages,
  ];

  try {
    const response = await openai.chat.completions.create({
      model,
      max_tokens: maxTokens,
      messages,
      ...(options.jsonMode
        ? { response_format: { type: "json_object" as const } }
        : {}),
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in LLM response");
    }
    return content;
  } catch (error: any) {
    // If the error is about response_format not being supported,
    // retry without it — the system prompt instruction is the fallback.
    const isFormatError =
      options.jsonMode &&
      (error?.message?.toLowerCase()?.includes("response_format") ||
        error?.message?.toLowerCase()?.includes("json_object"));

    if (isFormatError) {
      console.warn(
        `   ⚠️  Model ${model} may not support response_format. Retrying without it.`
      );
      const response = await openai.chat.completions.create({
        model,
        max_tokens: maxTokens,
        messages,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error("No content in LLM response (retry without json mode)");
      }
      return content;
    }

    throw error;
  }
}
