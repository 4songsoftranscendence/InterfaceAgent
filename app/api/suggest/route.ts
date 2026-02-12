import { NextResponse } from "next/server";
import { chatCompletion } from "@/src/lib/llm";

const SUGGEST_SYSTEM_PROMPT = `You are a design research assistant. Given a user's natural language request about building or analyzing websites, extract structured information.

Return valid JSON only:
{
  "urls": ["https://..."],
  "category": "saas-landing" | "healthcare" | "ecommerce" | "portfolio" | "startup" | "agency",
  "goal": "A clear, specific description of what the user wants to build"
}

Rules:
- URLs must be real, well-known websites relevant to the request
- Pick the single best-matching category from the 6 options above
- The goal should expand on the user's request with specificity
- If the user mentions specific sites, include those URLs
- If the user doesn't mention specific sites, suggest 2-3 well-known examples in the relevant category
- Return 1-5 URLs total`;

export async function POST(request: Request) {
  const userApiKey = request.headers.get("X-OpenRouter-Key") || undefined;
  const body = await request.json();
  const { prompt } = body;

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }

  try {
    const raw = await chatCompletion({
      system: SUGGEST_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt.trim() }],
      jsonMode: true,
      maxTokens: 1024,
      apiKey: userApiKey,
    });

    const parsed = JSON.parse(raw);

    const urls = (parsed.urls || [])
      .filter((u: string) => {
        try {
          new URL(u);
          return true;
        } catch {
          return false;
        }
      })
      .slice(0, 5);

    const validCategories = [
      "saas-landing",
      "healthcare",
      "ecommerce",
      "portfolio",
      "startup",
      "agency",
    ];
    const category = validCategories.includes(parsed.category)
      ? parsed.category
      : "saas-landing";
    const goal = parsed.goal || prompt.trim();

    return NextResponse.json({ urls, category, goal });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
