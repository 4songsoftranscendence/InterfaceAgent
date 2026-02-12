// ============================================
// DESIGN SCOUT — Design Brief Generator v3
// ============================================
// Takes multiple site analyses and generates a psychology-informed
// design brief with actionable build prompts via OpenRouter.
// Analyzed sites serve as a baseline comparison framework.

import { chatCompletion } from "../lib/llm";
import { randomUUID } from "crypto";
import type { UIAnalysis, DesignBrief, JustifiedScore } from "../types/index";
import { SYSTEM_PROMPT, GENERATE_BRIEF_PROMPT } from "../prompts/index";

export async function generateBrief(
  analyses: UIAnalysis[],
  category: string,
  goal: string,
  apiKey?: string
): Promise<DesignBrief> {
  console.log(`📝 Generating psychology-informed design brief...`);

  const prompt = GENERATE_BRIEF_PROMPT
    .replace("{category}", category)
    .replace("{goal}", goal)
    .replace(/\{siteCount\}/g, String(analyses.length));

  // Build comprehensive analysis summary with justifications
  const analysisSummary = analyses
    .map((a) => {
      const formatScore = (label: string, js: JustifiedScore) =>
        `  ${label}: ${js.score}/10${js.justification ? ` — ${js.justification}` : ""}`;

      return `
--- ${a.url} (Score: ${a.overallScore}/10) ---
CORE SCORES:
${formatScore("visualHierarchy", a.scores.visualHierarchy)}
${formatScore("colorUsage", a.scores.colorUsage)}
${formatScore("typography", a.scores.typography)}
${formatScore("spacing", a.scores.spacing)}
${formatScore("ctaClarity", a.scores.ctaClarity)}
${formatScore("navigation", a.scores.navigation)}
${formatScore("mobileReadiness", a.scores.mobileReadiness)}
${formatScore("consistency", a.scores.consistency)}
${formatScore("accessibility", a.scores.accessibility)}
${formatScore("engagement", a.scores.engagement)}
PSYCHOLOGY SCORES:
${formatScore("cognitiveLoad", a.principleScores.cognitiveLoad)}
${formatScore("trustSignals", a.principleScores.trustSignals)}
${formatScore("affordanceClarity", a.principleScores.affordanceClarity)}
${formatScore("feedbackCompleteness", a.principleScores.feedbackCompleteness)}
${formatScore("conventionAdherence", a.principleScores.conventionAdherence)}
${formatScore("gestaltCompliance", a.principleScores.gestaltCompliance)}
${formatScore("copyQuality", a.principleScores.copyQuality)}
${formatScore("conversionPsychology", a.principleScores.conversionPsychology)}
Strengths: ${a.strengths.join("; ")}
Weaknesses: ${a.weaknesses.join("; ")}
Anti-Patterns: ${a.antiPatterns.map((ap) => `${ap.name} (${ap.severity})`).join(", ") || "None detected"}
Principle Notes: Von Restorff: ${a.principleNotes.vonRestorff} | Peak-End: ${a.principleNotes.peakEnd} | Hook Model: ${a.principleNotes.hookModel}
Colors: ${a.designTokens.primaryColors.join(", ")} | Accent: ${a.designTokens.accentColors.join(", ")} | Neutrals: ${a.designTokens.neutralColors.join(", ")}
Fonts: ${a.designTokens.fontFamilies.join(", ")}
Button Style: ${a.designTokens.buttonStyle}
Spacing: ${a.designTokens.spacingSystem}
`;
    })
    .join("\n");

  const coreAvgs = aggregateScores(analyses, "scores");
  const principleAvgs = aggregateScores(analyses, "principleScores");
  const scoresSummary = [
    ...Object.entries(coreAvgs).map(([k, v]) => `${k}: ${v.toFixed(1)}`),
    "---",
    ...Object.entries(principleAvgs).map(([k, v]) => `${k}: ${v.toFixed(1)}`),
  ].join(", ");

  // Collect best patterns and worst anti-patterns across all sites
  const bestPatterns = analyses
    .flatMap((a) => a.patterns)
    .filter((p) => p.effectiveness === "high")
    .map((p) => `• ${p.name}: ${p.description}${p.principle ? ` (${p.principle})` : ""}`)
    .join("\n");

  const worstAntiPatterns = analyses
    .flatMap((a) => a.antiPatterns)
    .filter((ap) => ap.severity === "critical" || ap.severity === "moderate")
    .map((ap) => `• ${ap.name}: ${ap.description} → ${ap.recommendation}`)
    .join("\n");

  try {
    const raw = await chatCompletion({
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `${prompt}

## Analysis Data — Use These Sites as Your Baseline Comparison Framework

### Aggregate Scores Across ${analyses.length} Sites
${scoresSummary}

### Individual Site Analyses (with score justifications)
${analysisSummary}

### Best Patterns Found (high effectiveness)
${bestPatterns || "No high-effectiveness patterns identified"}

### Anti-Patterns to Avoid
${worstAntiPatterns || "No critical anti-patterns detected"}

### Key Principle Observations
${analyses.map((a) => `${a.url}: Norman Doors: ${a.principleNotes.normanDoors.join(", ") || "none"} | Hick's violations: ${a.principleNotes.hicksViolations.join(", ") || "none"} | Fitts issues: ${a.principleNotes.fittsIssues.join(", ") || "none"}`).join("\n")}

Reference these analyzed sites as benchmarks throughout the brief. For each recommendation, cite at least one site as a positive or negative example.

Now generate the design brief as JSON.`,
        },
      ],
      jsonMode: true,
      maxTokens: 12288,
      apiKey,
    });

    const brief = parseBriefResponse(raw, category, goal, analyses);
    console.log(`   ✅ Design brief generated!`);
    return brief;
  } catch (error) {
    console.error(`   ❌ Brief generation failed:`, error);
    throw error;
  }
}

/** Coerce a value to a string — handles objects the LLM may return as nested JSON */
function asStr(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    if (Array.isArray(val)) return val.map(asStr).join("\n");
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return String(val);
    }
  }
  return String(val);
}

/** Coerce a value to a string array */
function asStrArr(val: unknown): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((v) => asStr(v));
  if (typeof val === "string") return [val];
  return [];
}

/** Build default analyzedSites from raw analysis data */
function buildDefaultAnalyzedSites(analyses: UIAnalysis[]) {
  return analyses.map((a) => {
    // Pick the 5 most notable scores (furthest from the mean of 5)
    const allScores = [
      ...Object.entries(a.scores).map(([dim, js]) => ({ dimension: dim, score: js.score, justification: js.justification })),
      ...Object.entries(a.principleScores).map(([dim, js]) => ({ dimension: dim, score: js.score, justification: js.justification })),
    ];
    const highlights = allScores
      .sort((x, y) => Math.abs(y.score - 5) - Math.abs(x.score - 5))
      .slice(0, 5);

    return {
      url: a.url,
      overallScore: a.overallScore,
      keyTakeaway: a.strengths[0] || "Analysis completed",
      strengths: a.strengths.slice(0, 3),
      weaknesses: a.weaknesses.slice(0, 3),
      scoreHighlights: highlights,
      comparisonNotes: "",
    };
  });
}

function parseBriefResponse(
  raw: string,
  category: string,
  goal: string,
  analyses: UIAnalysis[]
): DesignBrief {
  let jsonStr = raw;
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) jsonStr = jsonMatch[1];

  const firstBrace = jsonStr.indexOf("{");
  const lastBrace = jsonStr.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1) {
    jsonStr = jsonStr.slice(firstBrace, lastBrace + 1);
  }

  const emptyBrief: DesignBrief = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    category,
    goal,
    executiveSummary: "",
    targetAudience: "",
    recommendedApproach: {
      layout: "", colorStrategy: "", typographyStrategy: "",
      ctaStrategy: "", contentStructure: "", interactionPatterns: "",
    },
    psychologyStrategy: {
      hookModel: "", trustBuilding: "", frictionReduction: "",
      conversionTactics: "", emotionalDesign: "",
    },
    designSystem: {
      suggestedPalette: [], suggestedFonts: [],
      spacingNotes: "", componentList: [],
    },
    buildPrompts: {
      heroSection: "", navigation: "", socialProof: "",
      features: "", pricing: "", testimonials: "",
      howItWorks: "", faq: "", cta: "", footer: "", overall: "",
    },
    analyzedSites: buildDefaultAnalyzedSites(analyses),
  };

  try {
    const p = JSON.parse(jsonStr);

    // Parse analyzedSites from LLM response, falling back to analysis data
    const parsedSites = (p.analyzedSites || []).map((site: any, i: number) => ({
      url: site.url || analyses[i]?.url || "",
      overallScore: site.overallScore || site.score || analyses[i]?.overallScore || 0,
      keyTakeaway: asStr(site.keyTakeaway),
      strengths: asStrArr(site.strengths || analyses[i]?.strengths || []).slice(0, 3),
      weaknesses: asStrArr(site.weaknesses || analyses[i]?.weaknesses || []).slice(0, 3),
      scoreHighlights: (site.scoreHighlights || []).map((h: any) => ({
        dimension: h.dimension || "",
        score: Number(h.score) || 0,
        justification: asStr(h.justification),
      })),
      comparisonNotes: asStr(site.comparisonNotes),
    }));

    return {
      ...emptyBrief,
      executiveSummary: asStr(p.executiveSummary),
      targetAudience: asStr(p.targetAudience),
      recommendedApproach: {
        layout: asStr(p.recommendedApproach?.layout),
        colorStrategy: asStr(p.recommendedApproach?.colorStrategy),
        typographyStrategy: asStr(p.recommendedApproach?.typographyStrategy),
        ctaStrategy: asStr(p.recommendedApproach?.ctaStrategy),
        contentStructure: asStr(p.recommendedApproach?.contentStructure),
        interactionPatterns: asStr(p.recommendedApproach?.interactionPatterns),
      },
      psychologyStrategy: {
        hookModel: asStr(p.psychologyStrategy?.hookModel),
        trustBuilding: asStr(p.psychologyStrategy?.trustBuilding),
        frictionReduction: asStr(p.psychologyStrategy?.frictionReduction),
        conversionTactics: asStr(p.psychologyStrategy?.conversionTactics),
        emotionalDesign: asStr(p.psychologyStrategy?.emotionalDesign),
      },
      designSystem: {
        suggestedPalette: asStrArr(p.designSystem?.suggestedPalette),
        suggestedFonts: asStrArr(p.designSystem?.suggestedFonts),
        spacingNotes: asStr(p.designSystem?.spacingNotes),
        componentList: asStrArr(p.designSystem?.componentList),
      },
      buildPrompts: {
        heroSection: asStr(p.buildPrompts?.heroSection),
        navigation: asStr(p.buildPrompts?.navigation),
        socialProof: asStr(p.buildPrompts?.socialProof),
        features: asStr(p.buildPrompts?.features),
        pricing: asStr(p.buildPrompts?.pricing),
        testimonials: asStr(p.buildPrompts?.testimonials),
        howItWorks: asStr(p.buildPrompts?.howItWorks),
        faq: asStr(p.buildPrompts?.faq),
        cta: asStr(p.buildPrompts?.cta),
        footer: asStr(p.buildPrompts?.footer),
        overall: asStr(p.buildPrompts?.overall),
      },
      analyzedSites: parsedSites.length > 0 ? parsedSites : emptyBrief.analyzedSites,
    };
  } catch {
    console.warn("   ⚠️  Could not parse brief JSON, attempting field extraction from raw text");

    const brief = { ...emptyBrief };
    try {
      const cleaned = jsonStr
        .replace(/[\x00-\x1F\x7F]/g, " ")
        .replace(/,\s*}/g, "}")
        .replace(/,\s*]/g, "]");
      const p = JSON.parse(cleaned);
      brief.executiveSummary = asStr(p.executiveSummary);
      brief.targetAudience = asStr(p.targetAudience);
      if (p.buildPrompts) {
        brief.buildPrompts.overall = asStr(p.buildPrompts.overall);
      }
    } catch {
      brief.executiveSummary = "Brief generation completed but the response could not be fully parsed. The raw output is available below in the build prompts section.";
      brief.buildPrompts.overall = raw;
    }
    return brief;
  }
}

function aggregateScores(
  analyses: UIAnalysis[],
  scoreKey: "scores" | "principleScores"
): Record<string, number> {
  if (analyses.length === 0) return {};

  const first = analyses[0][scoreKey];
  const keys = Object.keys(first) as string[];
  const result: Record<string, number> = {};

  for (const key of keys) {
    const values = analyses
      .map((a) => (a[scoreKey] as Record<string, JustifiedScore>)[key].score)
      .filter((v) => v > 0);
    result[key] = values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;
  }
  return result;
}
