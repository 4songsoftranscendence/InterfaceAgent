// ============================================
// DESIGN SCOUT — UI/UX Analyzer v3
// ============================================
// Sends screenshots to a vision-capable LLM via OpenRouter
// and returns structured UI/UX analysis with psychology-informed scoring.
// Each score includes a justification explaining WHY that number was given.

import { chatCompletion, base64ImageBlock } from "../lib/llm";
import type { CrawlResult, UIAnalysis, JustifiedScore } from "../types/index";
import {
  SYSTEM_PROMPT,
  ANALYZE_SCREENSHOT_PROMPT,
  CATEGORY_OVERLAYS,
} from "../prompts/index";

/** Parse a score value that may be { score, justification } or a bare number */
function parseJustifiedScore(val: unknown): JustifiedScore {
  if (val && typeof val === "object" && "score" in val) {
    const obj = val as Record<string, unknown>;
    return {
      score: Number(obj.score) || 0,
      justification: String(obj.justification || ""),
    };
  }
  if (typeof val === "number") {
    return { score: val, justification: "" };
  }
  return { score: 0, justification: "" };
}

const EMPTY_SCORE: JustifiedScore = { score: 0, justification: "" };

export async function analyzeSite(
  crawlResult: CrawlResult,
  category?: string,
  apiKey?: string
): Promise<UIAnalysis> {
  console.log(`🧠 Analyzing: ${crawlResult.url}`);

  const imageBlocks = crawlResult.screenshots
    .filter((s) => s.base64)
    .slice(0, 5)
    .map((screenshot) => base64ImageBlock(screenshot.base64, "image/png"));

  if (imageBlocks.length === 0) {
    throw new Error(`No screenshots available for ${crawlResult.url}`);
  }

  let analysisPrompt = ANALYZE_SCREENSHOT_PROMPT;
  if (category && CATEGORY_OVERLAYS[category]) {
    analysisPrompt += "\n\n" + CATEGORY_OVERLAYS[category];
  }

  const contextInfo = `
Website: ${crawlResult.url}
Title: ${crawlResult.pageTitle}
${crawlResult.metaDescription ? `Description: ${crawlResult.metaDescription}` : ""}
Detected Fonts: ${crawlResult.fonts.join(", ") || "N/A"}
Detected Tech: ${crawlResult.techStack?.join(", ") || "N/A"}
Screenshots: ${crawlResult.screenshots.map((s) => `${s.section} (${s.viewport})`).join(", ")}
`;

  try {
    const raw = await chatCompletion({
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            ...imageBlocks,
            { type: "text", text: `${contextInfo}\n\n${analysisPrompt}` },
          ],
        },
      ],
      jsonMode: true,
      apiKey,
    });

    const analysis = parseAnalysisResponse(raw, crawlResult.url);

    // Compute overall score: weighted average of core (60%) + principle (40%) scores
    if (analysis.overallScore === 0) {
      const coreAvg = Object.values(analysis.scores).reduce((a, b) => a + b.score, 0) / 10;
      const principleAvg = Object.values(analysis.principleScores).reduce((a, b) => a + b.score, 0) / 8;
      analysis.overallScore = Math.round((coreAvg * 0.6 + principleAvg * 0.4) * 10) / 10;
    }

    console.log(`   ✅ Analysis complete: ${analysis.overallScore}/10 overall`);
    console.log(`      Core: vis=${analysis.scores.visualHierarchy.score} col=${analysis.scores.colorUsage.score} typ=${analysis.scores.typography.score} cta=${analysis.scores.ctaClarity.score}`);
    console.log(`      Psych: cog=${analysis.principleScores.cognitiveLoad.score} trust=${analysis.principleScores.trustSignals.score} afford=${analysis.principleScores.affordanceClarity.score} conv=${analysis.principleScores.conversionPsychology.score}`);

    if (analysis.antiPatterns.length > 0) {
      console.log(`      ⚠️  ${analysis.antiPatterns.length} anti-pattern(s) detected`);
    }

    return analysis;
  } catch (error) {
    console.error(`   ❌ Analysis failed for ${crawlResult.url}:`, error);
    throw error;
  }
}

function parseAnalysisResponse(raw: string, url: string): UIAnalysis {
  let jsonStr = raw;

  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1];

  const firstBrace = jsonStr.indexOf("{");
  const lastBrace = jsonStr.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
  }

  const empty: UIAnalysis = {
    url,
    overallScore: 0,
    scores: {
      visualHierarchy: EMPTY_SCORE, colorUsage: EMPTY_SCORE, typography: EMPTY_SCORE, spacing: EMPTY_SCORE,
      ctaClarity: EMPTY_SCORE, navigation: EMPTY_SCORE, mobileReadiness: EMPTY_SCORE,
      consistency: EMPTY_SCORE, accessibility: EMPTY_SCORE, engagement: EMPTY_SCORE,
    },
    principleScores: {
      cognitiveLoad: EMPTY_SCORE, trustSignals: EMPTY_SCORE, affordanceClarity: EMPTY_SCORE,
      feedbackCompleteness: EMPTY_SCORE, conventionAdherence: EMPTY_SCORE, gestaltCompliance: EMPTY_SCORE,
      copyQuality: EMPTY_SCORE, conversionPsychology: EMPTY_SCORE,
    },
    strengths: [],
    weaknesses: [],
    patterns: [],
    antiPatterns: [],
    designTokens: {
      primaryColors: [], accentColors: [], neutralColors: [],
      fontFamilies: [], headingStyle: "", bodyStyle: "",
      buttonStyle: "", spacingSystem: "", borderRadius: "", shadowStyle: "",
    },
    principleNotes: {
      normanDoors: [], hicksViolations: [], fittsIssues: [], trunkTest: [],
      vonRestorff: "", serialPosition: "", peakEnd: "", hookModel: "",
    },
    rawAnalysis: raw,
  };

  try {
    const p = JSON.parse(jsonStr);

    return {
      url,
      overallScore: p.overallScore || 0,
      scores: {
        visualHierarchy: parseJustifiedScore(p.scores?.visualHierarchy),
        colorUsage: parseJustifiedScore(p.scores?.colorUsage),
        typography: parseJustifiedScore(p.scores?.typography),
        spacing: parseJustifiedScore(p.scores?.spacing),
        ctaClarity: parseJustifiedScore(p.scores?.ctaClarity),
        navigation: parseJustifiedScore(p.scores?.navigation),
        mobileReadiness: parseJustifiedScore(p.scores?.mobileReadiness),
        consistency: parseJustifiedScore(p.scores?.consistency),
        accessibility: parseJustifiedScore(p.scores?.accessibility),
        engagement: parseJustifiedScore(p.scores?.engagement),
      },
      principleScores: {
        cognitiveLoad: parseJustifiedScore(p.principleScores?.cognitiveLoad),
        trustSignals: parseJustifiedScore(p.principleScores?.trustSignals),
        affordanceClarity: parseJustifiedScore(p.principleScores?.affordanceClarity),
        feedbackCompleteness: parseJustifiedScore(p.principleScores?.feedbackCompleteness),
        conventionAdherence: parseJustifiedScore(p.principleScores?.conventionAdherence),
        gestaltCompliance: parseJustifiedScore(p.principleScores?.gestaltCompliance),
        copyQuality: parseJustifiedScore(p.principleScores?.copyQuality),
        conversionPsychology: parseJustifiedScore(p.principleScores?.conversionPsychology),
      },
      strengths: p.strengths || [],
      weaknesses: p.weaknesses || [],
      patterns: (p.patterns || []).map((pat: any) => ({
        name: pat.name || "",
        description: pat.description || "",
        location: pat.location || "",
        effectiveness: pat.effectiveness || "medium",
        principle: pat.principle || "",
      })),
      antiPatterns: (p.antiPatterns || []).map((ap: any) => ({
        name: ap.name || "",
        description: ap.description || "",
        severity: ap.severity || "moderate",
        category: ap.category || "ux-violation",
        recommendation: ap.recommendation || "",
      })),
      designTokens: {
        primaryColors: p.designTokens?.primaryColors || [],
        accentColors: p.designTokens?.accentColors || [],
        neutralColors: p.designTokens?.neutralColors || [],
        fontFamilies: p.designTokens?.fontFamilies || [],
        headingStyle: p.designTokens?.headingStyle || "",
        bodyStyle: p.designTokens?.bodyStyle || "",
        buttonStyle: p.designTokens?.buttonStyle || "",
        spacingSystem: p.designTokens?.spacingSystem || "",
        borderRadius: p.designTokens?.borderRadius || "",
        shadowStyle: p.designTokens?.shadowStyle || "",
      },
      principleNotes: {
        normanDoors: p.principleNotes?.normanDoors || [],
        hicksViolations: p.principleNotes?.hicksViolations || [],
        fittsIssues: p.principleNotes?.fittsIssues || [],
        trunkTest: p.principleNotes?.trunkTest || [],
        vonRestorff: p.principleNotes?.vonRestorff || "",
        serialPosition: p.principleNotes?.serialPosition || "",
        peakEnd: p.principleNotes?.peakEnd || "",
        hookModel: p.principleNotes?.hookModel || "",
      },
      rawAnalysis: raw,
    };
  } catch (parseError) {
    console.warn("   ⚠️  Could not parse JSON from LLM response, using raw text");
    return { ...empty, rawAnalysis: raw };
  }
}

// Batch analyze multiple crawl results
export async function analyzeMultiple(
  crawlResults: CrawlResult[],
  category?: string
): Promise<UIAnalysis[]> {
  const analyses: UIAnalysis[] = [];
  for (const result of crawlResults) {
    try {
      const analysis = await analyzeSite(result, category);
      analyses.push(analysis);
      await new Promise((r) => setTimeout(r, 1000));
    } catch (error) {
      console.error(`Skipping analysis for ${result.url}`);
    }
  }
  return analyses;
}
