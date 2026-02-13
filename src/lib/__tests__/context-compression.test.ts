import { describe, it, expect } from "vitest";
import {
  compressForBrief,
  formatCompressedAnalysis,
  classifyScores,
} from "../context-compression";
import type { UIAnalysis, JustifiedScore } from "../../types/index";

function makeScore(score: number, justification = "test"): JustifiedScore {
  return { score, justification };
}

function makeAnalysis(
  url: string,
  scoreOverrides?: Partial<Record<string, number>>
): UIAnalysis {
  const base = 5;
  const s = (dim: string) => makeScore(scoreOverrides?.[dim] ?? base, `Justification for ${dim}`);
  return {
    url,
    overallScore: base,
    scores: {
      visualHierarchy: s("visualHierarchy"),
      colorUsage: s("colorUsage"),
      typography: s("typography"),
      spacing: s("spacing"),
      ctaClarity: s("ctaClarity"),
      navigation: s("navigation"),
      mobileReadiness: s("mobileReadiness"),
      consistency: s("consistency"),
      accessibility: s("accessibility"),
      engagement: s("engagement"),
    },
    principleScores: {
      cognitiveLoad: s("cognitiveLoad"),
      trustSignals: s("trustSignals"),
      affordanceClarity: s("affordanceClarity"),
      feedbackCompleteness: s("feedbackCompleteness"),
      conventionAdherence: s("conventionAdherence"),
      gestaltCompliance: s("gestaltCompliance"),
      copyQuality: s("copyQuality"),
      conversionPsychology: s("conversionPsychology"),
    },
    strengths: ["Strong hero section", "Clean typography"],
    weaknesses: ["Poor mobile experience"],
    patterns: [
      { name: "Card Grid", description: "Uses card layout", location: "features", effectiveness: "high" as const, principle: "Gestalt" },
    ],
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
    rawAnalysis: "",
  };
}

describe("classifyScores", () => {
  it("classifies extreme scores as outliers", () => {
    const dimensions = [
      { dimension: "a", score: 2, justification: "low" },
      { dimension: "b", score: 5, justification: "mid" },
      { dimension: "c", score: 5, justification: "mid" },
      { dimension: "d", score: 5, justification: "mid" },
      { dimension: "e", score: 5, justification: "mid" },
      { dimension: "f", score: 5, justification: "mid" },
      { dimension: "g", score: 5, justification: "mid" },
      { dimension: "h", score: 9, justification: "high" },
    ];
    const { outliers } = classifyScores(dimensions);
    const outlierDims = outliers.map((o) => o.dimension);
    expect(outlierDims).toContain("a");
    expect(outlierDims).toContain("h");
  });

  it("classifies top 3 and bottom 3 as outliers", () => {
    const dimensions = Array.from({ length: 10 }, (_, i) => ({
      dimension: `dim${i}`,
      score: i + 1,
      justification: `j${i}`,
    }));
    const { outliers } = classifyScores(dimensions);
    // Top 3: dim9(10), dim8(9), dim7(8)
    // Bottom 3: dim0(1), dim1(2), dim2(3)
    expect(outliers.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps mid-range scores without justifications in compressed output", () => {
    const dimensions = Array.from({ length: 10 }, (_, i) => ({
      dimension: `dim${i}`,
      score: 5 + (i % 2),
      justification: `justification for dim${i}`,
    }));
    const { midRange } = classifyScores(dimensions);
    expect(midRange.length).toBeGreaterThan(0);
  });
});

describe("compressForBrief", () => {
  it("handles empty analyses array", () => {
    const result = compressForBrief([]);
    expect(result.sites).toEqual([]);
    expect(result.globalPatternTable).toEqual([]);
    expect(result.estimatedTokens).toBe(0);
  });

  it("handles single-site input", () => {
    const analysis = makeAnalysis("https://example.com");
    const result = compressForBrief([analysis]);
    expect(result.sites).toHaveLength(1);
    expect(result.sites[0].url).toBe("https://example.com");
  });

  it("deduplicates patterns across sites", () => {
    const a1 = makeAnalysis("https://a.com");
    const a2 = makeAnalysis("https://b.com");
    // Both have "Card Grid" pattern
    const result = compressForBrief([a1, a2]);
    const cardGrid = result.globalPatternTable.find(
      (p) => p.name === "card grid"
    );
    expect(cardGrid).toBeDefined();
    expect(cardGrid!.count).toBe(2);
  });

  it("limits strengths and weaknesses to 3", () => {
    const analysis = makeAnalysis("https://example.com");
    analysis.strengths = ["a", "b", "c", "d", "e"];
    analysis.weaknesses = ["x", "y", "z", "w"];
    const result = compressForBrief([analysis]);
    expect(result.sites[0].strengths).toHaveLength(3);
    expect(result.sites[0].weaknesses).toHaveLength(3);
  });

  it("handles all scores identical (no SD-based outliers)", () => {
    const analysis = makeAnalysis("https://example.com");
    // All scores are already 5, so no SD outliers — but top/bottom 3 still selected
    const result = compressForBrief([analysis]);
    expect(result.sites[0].outlierScores.length).toBeGreaterThanOrEqual(3);
  });

  it("estimates tokens as positive number", () => {
    const analysis = makeAnalysis("https://example.com");
    const result = compressForBrief([analysis]);
    expect(result.estimatedTokens).toBeGreaterThan(0);
  });
});

describe("formatCompressedAnalysis", () => {
  it("includes outlier justifications in output", () => {
    const analysis = makeAnalysis("https://example.com", {
      visualHierarchy: 9,
      colorUsage: 2,
    });
    const result = compressForBrief([analysis]);
    const formatted = formatCompressedAnalysis(result);
    expect(formatted).toContain("NOTABLE SCORES");
    expect(formatted).toContain("example.com");
  });

  it("includes MID-RANGE section for non-outlier scores", () => {
    const analysis = makeAnalysis("https://example.com");
    const result = compressForBrief([analysis]);
    const formatted = formatCompressedAnalysis(result);
    expect(formatted).toContain("MID-RANGE:");
  });

  it("trims mid-range when over token budget", () => {
    const analysis = makeAnalysis("https://example.com");
    const result = compressForBrief([analysis]);
    const formatted = formatCompressedAnalysis(result, 1); // very small budget
    expect(formatted).not.toContain("MID-RANGE:");
  });

  it("includes global pattern table", () => {
    const analysis = makeAnalysis("https://example.com");
    const result = compressForBrief([analysis]);
    const formatted = formatCompressedAnalysis(result);
    expect(formatted).toContain("CROSS-SITE PATTERNS:");
    expect(formatted).toContain("card grid");
  });
});
