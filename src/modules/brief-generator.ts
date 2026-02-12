// ============================================
// DESIGN SCOUT — Design Brief Generator v2
// ============================================
// Takes multiple site analyses and generates a psychology-informed
// design brief with actionable build prompts via OpenRouter.

import { chatCompletion } from "../lib/llm";
import { randomUUID } from "crypto";
import type { UIAnalysis, DesignBrief } from "../types/index";
import { SYSTEM_PROMPT, GENERATE_BRIEF_PROMPT } from "../prompts/index";

export async function generateBrief(
  analyses: UIAnalysis[],
  category: string,
  goal: string
): Promise<DesignBrief> {
  console.log(`📝 Generating psychology-informed design brief...`);

  const prompt = GENERATE_BRIEF_PROMPT
    .replace("{category}", category)
    .replace("{goal}", goal)
    .replace("{siteCount}", String(analyses.length));

  // Build comprehensive analysis summary including new dimensions
  const analysisSummary = analyses
    .map((a) => `
--- ${a.url} (Score: ${a.overallScore}/10) ---
CORE SCORES: visual=${a.scores.visualHierarchy} color=${a.scores.colorUsage} type=${a.scores.typography} space=${a.scores.spacing} cta=${a.scores.ctaClarity} nav=${a.scores.navigation} mobile=${a.scores.mobileReadiness} access=${a.scores.accessibility}
PSYCHOLOGY SCORES: cogLoad=${a.principleScores.cognitiveLoad} trust=${a.principleScores.trustSignals} affordance=${a.principleScores.affordanceClarity} feedback=${a.principleScores.feedbackCompleteness} convention=${a.principleScores.conventionAdherence} gestalt=${a.principleScores.gestaltCompliance} copy=${a.principleScores.copyQuality} conversion=${a.principleScores.conversionPsychology}
Strengths: ${a.strengths.join("; ")}
Weaknesses: ${a.weaknesses.join("; ")}
Anti-Patterns: ${a.antiPatterns.map((ap) => `${ap.name} (${ap.severity})`).join(", ") || "None detected"}
Principle Notes: Von Restorff: ${a.principleNotes.vonRestorff} | Peak-End: ${a.principleNotes.peakEnd} | Hook Model: ${a.principleNotes.hookModel}
Colors: ${a.designTokens.primaryColors.join(", ")} | Accent: ${a.designTokens.accentColors.join(", ")} | Neutrals: ${a.designTokens.neutralColors.join(", ")}
Fonts: ${a.designTokens.fontFamilies.join(", ")}
Button Style: ${a.designTokens.buttonStyle}
Spacing: ${a.designTokens.spacingSystem}
`)
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

## Analysis Data

### Aggregate Scores Across ${analyses.length} Sites
${scoresSummary}

### Individual Site Analyses
${analysisSummary}

### Best Patterns Found (high effectiveness)
${bestPatterns || "No high-effectiveness patterns identified"}

### Anti-Patterns to Avoid
${worstAntiPatterns || "No critical anti-patterns detected"}

### Key Principle Observations
${analyses.map((a) => `${a.url}: Norman Doors: ${a.principleNotes.normanDoors.join(", ") || "none"} | Hick's violations: ${a.principleNotes.hicksViolations.join(", ") || "none"} | Fitts issues: ${a.principleNotes.fittsIssues.join(", ") || "none"}`).join("\n")}

Now generate the design brief as JSON.`,
        },
      ],
      jsonMode: true,
    });

    const brief = parseBriefResponse(raw, category, goal, analyses);
    console.log(`   ✅ Design brief generated!`);
    return brief;
  } catch (error) {
    console.error(`   ❌ Brief generation failed:`, error);
    throw error;
  }
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
    analyzedSites: analyses.map((a) => ({
      url: a.url,
      score: a.overallScore,
      keyTakeaway: a.strengths[0] || "Analysis completed",
    })),
  };

  try {
    const p = JSON.parse(jsonStr);

    return {
      ...emptyBrief,
      executiveSummary: p.executiveSummary || "",
      targetAudience: p.targetAudience || "",
      recommendedApproach: {
        layout: p.recommendedApproach?.layout || "",
        colorStrategy: p.recommendedApproach?.colorStrategy || "",
        typographyStrategy: p.recommendedApproach?.typographyStrategy || "",
        ctaStrategy: p.recommendedApproach?.ctaStrategy || "",
        contentStructure: p.recommendedApproach?.contentStructure || "",
        interactionPatterns: p.recommendedApproach?.interactionPatterns || "",
      },
      psychologyStrategy: {
        hookModel: p.psychologyStrategy?.hookModel || "",
        trustBuilding: p.psychologyStrategy?.trustBuilding || "",
        frictionReduction: p.psychologyStrategy?.frictionReduction || "",
        conversionTactics: p.psychologyStrategy?.conversionTactics || "",
        emotionalDesign: p.psychologyStrategy?.emotionalDesign || "",
      },
      designSystem: {
        suggestedPalette: p.designSystem?.suggestedPalette || [],
        suggestedFonts: p.designSystem?.suggestedFonts || [],
        spacingNotes: p.designSystem?.spacingNotes || "",
        componentList: p.designSystem?.componentList || [],
      },
      buildPrompts: {
        heroSection: p.buildPrompts?.heroSection || "",
        navigation: p.buildPrompts?.navigation || "",
        socialProof: p.buildPrompts?.socialProof || "",
        features: p.buildPrompts?.features || "",
        pricing: p.buildPrompts?.pricing || "",
        testimonials: p.buildPrompts?.testimonials || "",
        howItWorks: p.buildPrompts?.howItWorks || "",
        faq: p.buildPrompts?.faq || "",
        cta: p.buildPrompts?.cta || "",
        footer: p.buildPrompts?.footer || "",
        overall: p.buildPrompts?.overall || "",
      },
    };
  } catch {
    console.warn("   ⚠️  Could not parse brief JSON, wrapping raw response");
    return { ...emptyBrief, executiveSummary: raw.slice(0, 500), buildPrompts: { ...emptyBrief.buildPrompts, overall: raw } };
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
      .map((a) => (a[scoreKey] as Record<string, number>)[key])
      .filter((v) => v > 0);
    result[key] = values.length > 0
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;
  }
  return result;
}
