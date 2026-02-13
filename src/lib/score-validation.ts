// ============================================
// Score Validation + Self-Critique Re-prompt
// ============================================
// Validates LLM-generated scores and justifications.
// Triggers re-prompting when too many scores fail quality checks.

import type { JustifiedScore, UIAnalysis } from "../types/index";

const VAGUE_WORDS = [
  "good", "nice", "bad", "decent", "okay", "fine",
  "great", "poor", "solid", "adequate",
];
const VAGUE_REGEX = new RegExp(`\\b(${VAGUE_WORDS.join("|")})\\b`, "i");

export interface ScoreValidationFailure {
  dimension: string;
  score: number;
  justification: string;
  reasons: string[];
}

export interface ValidationResult {
  passed: boolean;
  failures: ScoreValidationFailure[];
  failureRate: number;
}

/**
 * Validate a single JustifiedScore.
 * Returns an array of reason strings (empty if valid).
 */
export function validateScore(dimension: string, js: JustifiedScore): string[] {
  const reasons: string[] = [];

  if (js.score < 1 || js.score > 10) {
    reasons.push(`Score ${js.score} is out of range [1-10]`);
  }

  if (!js.justification || js.justification.trim().length === 0) {
    reasons.push("Justification is empty");
  } else if (js.justification.trim().length < 20) {
    reasons.push(
      `Justification too short (${js.justification.trim().length} chars, minimum 20)`
    );
  }

  if (js.justification && VAGUE_REGEX.test(js.justification)) {
    const match = js.justification.match(VAGUE_REGEX);
    reasons.push(`Justification contains vague word: "${match?.[1]}"`);
  }

  return reasons;
}

/**
 * Validate all 18 scores in a UIAnalysis.
 * Returns structured result with pass/fail and per-dimension failures.
 * Passes if <=30% of scores fail validation.
 */
export function validateAnalysisScores(analysis: UIAnalysis): ValidationResult {
  const failures: ScoreValidationFailure[] = [];

  for (const [dim, js] of Object.entries(analysis.scores)) {
    const reasons = validateScore(dim, js);
    if (reasons.length > 0) {
      failures.push({
        dimension: dim,
        score: js.score,
        justification: js.justification,
        reasons,
      });
    }
  }

  for (const [dim, js] of Object.entries(analysis.principleScores)) {
    const reasons = validateScore(dim, js);
    if (reasons.length > 0) {
      failures.push({
        dimension: dim,
        score: js.score,
        justification: js.justification,
        reasons,
      });
    }
  }

  const totalDimensions = 18;
  const failureRate = failures.length / totalDimensions;

  return {
    passed: failureRate <= 0.3,
    failures,
    failureRate,
  };
}

/**
 * Build a re-prompt message asking the LLM to re-score failed dimensions.
 */
export function buildReScorePrompt(
  failures: ScoreValidationFailure[]
): string {
  const failureList = failures
    .map(
      (f) => `- ${f.dimension} (score: ${f.score}): ${f.reasons.join("; ")}`
    )
    .join("\n");

  return `The following scores failed validation. Each score must be 1-10, and each justification must be at least 20 characters with specific observations (no vague words like "good", "nice", "decent").

Failed scores:
${failureList}

Re-score ONLY these dimensions. Return a JSON object with the same structure as the original response, but you only need to include the re-scored dimensions under "scores" and/or "principleScores". Keep all other fields from your original response.`;
}

/**
 * Tracks re-prompt budget across a pipeline run.
 * Enforces per-site and per-pipeline limits.
 */
export class RePromptBudget {
  private siteReprompts = new Map<string, number>();
  private totalReprompts = 0;
  private readonly maxPerSite: number;
  private readonly maxPerPipeline: number;

  constructor(maxPerSite = 1, maxPerPipeline = 3) {
    this.maxPerSite = maxPerSite;
    this.maxPerPipeline = maxPerPipeline;
  }

  canReprompt(siteUrl: string): boolean {
    const siteCount = this.siteReprompts.get(siteUrl) ?? 0;
    return (
      siteCount < this.maxPerSite && this.totalReprompts < this.maxPerPipeline
    );
  }

  recordReprompt(siteUrl: string): void {
    this.siteReprompts.set(
      siteUrl,
      (this.siteReprompts.get(siteUrl) ?? 0) + 1
    );
    this.totalReprompts++;
  }

  get stats() {
    return {
      totalReprompts: this.totalReprompts,
      sitesReprompted: this.siteReprompts.size,
    };
  }
}
