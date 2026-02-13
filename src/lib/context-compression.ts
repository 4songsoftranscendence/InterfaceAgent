// ============================================
// Context Compression for Brief Generation
// ============================================
// Compresses analysis data before sending to the brief-generation LLM.
// Keeps outlier scores with full justifications, abbreviates mid-range.
// Deduplicates patterns into a frequency table.

import type { UIAnalysis, JustifiedScore } from "../types/index";

interface ScoredDimension {
  dimension: string;
  score: number;
  justification: string;
}

export interface CompressedSiteAnalysis {
  url: string;
  overallScore: number;
  outlierScores: ScoredDimension[];
  midRangeScores: { dimension: string; score: number }[];
  strengths: string[];
  weaknesses: string[];
}

export interface CompressionResult {
  sites: CompressedSiteAnalysis[];
  globalPatternTable: { name: string; count: number; sites: string[] }[];
  estimatedTokens: number;
}

function meanAndStd(values: number[]): { mean: number; std: number } {
  if (values.length === 0) return { mean: 0, std: 0 };
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance =
    values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  return { mean, std: Math.sqrt(variance) };
}

function flattenScores(analysis: UIAnalysis): ScoredDimension[] {
  const result: ScoredDimension[] = [];
  for (const [dim, js] of Object.entries(analysis.scores)) {
    result.push({
      dimension: dim,
      score: js.score,
      justification: js.justification,
    });
  }
  for (const [dim, js] of Object.entries(analysis.principleScores)) {
    result.push({
      dimension: dim,
      score: js.score,
      justification: js.justification,
    });
  }
  return result;
}

/**
 * Classify scores into outliers (notable) and mid-range.
 * Outliers: >1.5 SD from mean OR in top/bottom 3 by score.
 */
export function classifyScores(
  dimensions: ScoredDimension[]
): { outliers: ScoredDimension[]; midRange: ScoredDimension[] } {
  const scores = dimensions.map((d) => d.score);
  const { mean, std } = meanAndStd(scores);

  const outlierSet = new Set<string>();

  // Top 3 and bottom 3 are always outliers
  const byScore = [...dimensions].sort((a, b) => b.score - a.score);
  byScore.slice(0, 3).forEach((d) => outlierSet.add(d.dimension));
  byScore.slice(-3).forEach((d) => outlierSet.add(d.dimension));

  // Also include >1.5 SD from mean
  if (std > 0) {
    for (const d of dimensions) {
      if (Math.abs(d.score - mean) > 1.5 * std) {
        outlierSet.add(d.dimension);
      }
    }
  }

  const outliers = dimensions.filter((d) => outlierSet.has(d.dimension));
  const midRange = dimensions.filter((d) => !outlierSet.has(d.dimension));

  return { outliers, midRange };
}

/**
 * Compress multiple analyses for the brief generation prompt.
 */
export function compressForBrief(analyses: UIAnalysis[]): CompressionResult {
  if (analyses.length === 0) {
    return { sites: [], globalPatternTable: [], estimatedTokens: 0 };
  }

  // Build global pattern frequency
  const patternMap = new Map<
    string,
    { count: number; sites: string[] }
  >();
  for (const analysis of analyses) {
    for (const pattern of analysis.patterns) {
      const key = pattern.name.toLowerCase();
      const entry = patternMap.get(key) || { count: 0, sites: [] };
      entry.count++;
      entry.sites.push(new URL(analysis.url).hostname);
      patternMap.set(key, entry);
    }
  }

  const globalPatternTable = Array.from(patternMap.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      sites: data.sites,
    }))
    .sort((a, b) => b.count - a.count);

  // Compress each site
  const sites: CompressedSiteAnalysis[] = analyses.map((analysis) => {
    const allDimensions = flattenScores(analysis);
    const { outliers, midRange } = classifyScores(allDimensions);

    return {
      url: analysis.url,
      overallScore: analysis.overallScore,
      outlierScores: outliers,
      midRangeScores: midRange.map((d) => ({
        dimension: d.dimension,
        score: d.score,
      })),
      strengths: analysis.strengths.slice(0, 3),
      weaknesses: analysis.weaknesses.slice(0, 3),
    };
  });

  // Estimate tokens (~4 chars per token)
  const serialized = JSON.stringify({ sites, globalPatternTable });
  const estimatedTokens = Math.ceil(serialized.length / 4);

  return { sites, globalPatternTable, estimatedTokens };
}

/**
 * Format compressed analysis data as a string for the LLM prompt.
 */
export function formatCompressedAnalysis(
  result: CompressionResult,
  tokenBudget?: number
): string {
  const parts: string[] = [];

  for (const site of result.sites) {
    const siteLines: string[] = [];
    siteLines.push(
      `--- ${site.url} (Score: ${site.overallScore}/10) ---`
    );

    siteLines.push("NOTABLE SCORES (outliers):");
    for (const s of site.outlierScores) {
      siteLines.push(`  ${s.dimension}: ${s.score}/10 — ${s.justification}`);
    }

    if (site.midRangeScores.length > 0) {
      const midLine = site.midRangeScores
        .map((s) => `${s.dimension}:${s.score}`)
        .join(", ");
      siteLines.push(`MID-RANGE: ${midLine}`);
    }

    siteLines.push(`Strengths: ${site.strengths.join("; ")}`);
    siteLines.push(`Weaknesses: ${site.weaknesses.join("; ")}`);

    parts.push(siteLines.join("\n"));
  }

  if (result.globalPatternTable.length > 0) {
    parts.push("CROSS-SITE PATTERNS:");
    for (const p of result.globalPatternTable.slice(0, 10)) {
      parts.push(
        `  ${p.name}: found in ${p.count} site(s) (${p.sites.join(", ")})`
      );
    }
  }

  let output = parts.join("\n\n");

  // If over token budget, progressively trim
  if (tokenBudget && Math.ceil(output.length / 4) > tokenBudget) {
    output = output.replace(/MID-RANGE:.*\n/g, "");
  }

  return output;
}
