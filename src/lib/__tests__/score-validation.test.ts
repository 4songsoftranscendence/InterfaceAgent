import { describe, it, expect } from "vitest";
import {
  validateScore,
  validateAnalysisScores,
  buildReScorePrompt,
  RePromptBudget,
} from "../score-validation";
import type { JustifiedScore, UIAnalysis } from "../../types/index";

function makeScore(score: number, justification: string): JustifiedScore {
  return { score, justification };
}

function makeAnalysis(overrides?: Partial<UIAnalysis>): UIAnalysis {
  const validJust = "This site uses a clear 3-level type scale with distinct weights and sizes for each level";
  const defaultScore = makeScore(7, validJust);
  return {
    url: "https://example.com",
    overallScore: 7,
    scores: {
      visualHierarchy: defaultScore,
      colorUsage: defaultScore,
      typography: defaultScore,
      spacing: defaultScore,
      ctaClarity: defaultScore,
      navigation: defaultScore,
      mobileReadiness: defaultScore,
      consistency: defaultScore,
      accessibility: defaultScore,
      engagement: defaultScore,
    },
    principleScores: {
      cognitiveLoad: defaultScore,
      trustSignals: defaultScore,
      affordanceClarity: defaultScore,
      feedbackCompleteness: defaultScore,
      conventionAdherence: defaultScore,
      gestaltCompliance: defaultScore,
      copyQuality: defaultScore,
      conversionPsychology: defaultScore,
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
    rawAnalysis: "",
    ...overrides,
  };
}

describe("validateScore", () => {
  it("passes a valid score with detailed justification", () => {
    const reasons = validateScore(
      "typography",
      makeScore(8, "Uses a clear 3-level type scale with distinct weights — Gestalt similarity")
    );
    expect(reasons).toEqual([]);
  });

  it("fails score below 1", () => {
    const reasons = validateScore("nav", makeScore(0, "Some valid justification text here for testing"));
    expect(reasons).toContainEqual(expect.stringContaining("out of range"));
  });

  it("fails score above 10", () => {
    const reasons = validateScore("nav", makeScore(11, "Some valid justification text here for testing"));
    expect(reasons).toContainEqual(expect.stringContaining("out of range"));
  });

  it("fails empty justification", () => {
    const reasons = validateScore("nav", makeScore(5, ""));
    expect(reasons).toContainEqual(expect.stringContaining("empty"));
  });

  it("fails justification under 20 chars", () => {
    const reasons = validateScore("nav", makeScore(5, "Short text"));
    expect(reasons).toContainEqual(expect.stringContaining("too short"));
  });

  it("fails justification with vague word 'good'", () => {
    const reasons = validateScore(
      "nav",
      makeScore(7, "Good use of color throughout the entire page design")
    );
    expect(reasons).toContainEqual(expect.stringContaining("vague word"));
  });

  it("fails justification with vague word 'decent'", () => {
    const reasons = validateScore(
      "nav",
      makeScore(6, "Decent typography with reasonable readability throughout")
    );
    expect(reasons).toContainEqual(expect.stringContaining("vague word"));
  });

  it("passes justification containing 'good' within a longer word", () => {
    // "goodness" should not trigger, but "good" alone should. This tests word boundaries.
    const reasons = validateScore(
      "nav",
      makeScore(7, "The goodness of the typography system is evident in the hierarchy")
    );
    // "goodness" contains "good" but the regex uses word boundaries, so it should NOT match "goodness"
    // Actually \bgood\b would match "good" but not "goodness" - let's verify
    // Wait, "goodness" starts with "good" - \bgood\b won't match in "goodness" since there's no boundary after "good"
    expect(reasons).toEqual([]);
  });

  it("returns multiple reasons for multiple failures", () => {
    const reasons = validateScore("nav", makeScore(0, ""));
    expect(reasons.length).toBeGreaterThanOrEqual(2);
  });

  it("accepts score of exactly 1", () => {
    const reasons = validateScore(
      "nav",
      makeScore(1, "Completely broken navigation with no affordances visible")
    );
    expect(reasons).toEqual([]);
  });

  it("accepts score of exactly 10", () => {
    const reasons = validateScore(
      "nav",
      makeScore(10, "Flawless navigation following all conventions perfectly")
    );
    expect(reasons).toEqual([]);
  });
});

describe("validateAnalysisScores", () => {
  it("passes when all 18 scores are valid", () => {
    const analysis = makeAnalysis();
    const result = validateAnalysisScores(analysis);
    expect(result.passed).toBe(true);
    expect(result.failures).toEqual([]);
    expect(result.failureRate).toBe(0);
  });

  it("passes when <=30% of scores fail (5 of 18)", () => {
    const analysis = makeAnalysis();
    // Make 5 scores fail (5/18 = 27.7%)
    analysis.scores.visualHierarchy = makeScore(5, "Short");
    analysis.scores.colorUsage = makeScore(5, "Short");
    analysis.scores.typography = makeScore(5, "Short");
    analysis.scores.spacing = makeScore(5, "Short");
    analysis.scores.ctaClarity = makeScore(5, "Short");
    const result = validateAnalysisScores(analysis);
    expect(result.passed).toBe(true);
    expect(result.failures.length).toBe(5);
  });

  it("fails when >30% of scores fail (6 of 18)", () => {
    const analysis = makeAnalysis();
    // Make 6 scores fail (6/18 = 33.3%)
    analysis.scores.visualHierarchy = makeScore(5, "Short");
    analysis.scores.colorUsage = makeScore(5, "Short");
    analysis.scores.typography = makeScore(5, "Short");
    analysis.scores.spacing = makeScore(5, "Short");
    analysis.scores.ctaClarity = makeScore(5, "Short");
    analysis.scores.navigation = makeScore(5, "Short");
    const result = validateAnalysisScores(analysis);
    expect(result.passed).toBe(false);
    expect(result.failures.length).toBe(6);
  });

  it("returns correct failureRate", () => {
    const analysis = makeAnalysis();
    analysis.scores.visualHierarchy = makeScore(5, "Short");
    analysis.scores.colorUsage = makeScore(5, "Short");
    const result = validateAnalysisScores(analysis);
    expect(result.failureRate).toBeCloseTo(2 / 18, 5);
  });
});

describe("buildReScorePrompt", () => {
  it("includes all failure dimensions", () => {
    const prompt = buildReScorePrompt([
      { dimension: "typography", score: 5, justification: "ok", reasons: ["too short"] },
      { dimension: "navigation", score: 0, justification: "", reasons: ["empty", "out of range"] },
    ]);
    expect(prompt).toContain("typography");
    expect(prompt).toContain("navigation");
  });

  it("includes all failure reasons", () => {
    const prompt = buildReScorePrompt([
      { dimension: "typography", score: 5, justification: "ok", reasons: ["too short", "vague word"] },
    ]);
    expect(prompt).toContain("too short");
    expect(prompt).toContain("vague word");
  });
});

describe("RePromptBudget", () => {
  it("allows first reprompt for a site", () => {
    const budget = new RePromptBudget(1, 3);
    expect(budget.canReprompt("https://a.com")).toBe(true);
  });

  it("blocks second reprompt for same site (maxPerSite=1)", () => {
    const budget = new RePromptBudget(1, 3);
    budget.recordReprompt("https://a.com");
    expect(budget.canReprompt("https://a.com")).toBe(false);
  });

  it("allows reprompt for different site after one site used", () => {
    const budget = new RePromptBudget(1, 3);
    budget.recordReprompt("https://a.com");
    expect(budget.canReprompt("https://b.com")).toBe(true);
  });

  it("blocks after 3 total reprompts (maxPerPipeline=3)", () => {
    const budget = new RePromptBudget(1, 3);
    budget.recordReprompt("https://a.com");
    budget.recordReprompt("https://b.com");
    budget.recordReprompt("https://c.com");
    expect(budget.canReprompt("https://d.com")).toBe(false);
  });

  it("tracks stats correctly", () => {
    const budget = new RePromptBudget(1, 3);
    budget.recordReprompt("https://a.com");
    budget.recordReprompt("https://b.com");
    expect(budget.stats.totalReprompts).toBe(2);
    expect(budget.stats.sitesReprompted).toBe(2);
  });
});
