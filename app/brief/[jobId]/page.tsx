"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface ScoreHighlight {
  dimension: string;
  score: number;
  justification: string;
}

interface AnalyzedSite {
  url: string;
  overallScore?: number;
  score?: number; // backward compat
  keyTakeaway: string;
  strengths?: string[];
  weaknesses?: string[];
  scoreHighlights?: ScoreHighlight[];
  comparisonNotes?: string;
}

interface Brief {
  id: string;
  category: string;
  goal: string;
  executiveSummary: string;
  targetAudience: string;
  recommendedApproach: {
    layout: string;
    colorStrategy: string;
    typographyStrategy: string;
    ctaStrategy: string;
    contentStructure: string;
    interactionPatterns: string;
  };
  psychologyStrategy: {
    hookModel: string;
    trustBuilding: string;
    frictionReduction: string;
    conversionTactics: string;
    emotionalDesign: string;
  };
  designSystem: {
    suggestedPalette: string[];
    suggestedFonts: string[];
    spacingNotes: string;
    componentList: string[];
  };
  buildPrompts: Record<string, string>;
  analyzedSites: AnalyzedSite[];
}

const DIMENSION_LABELS: Record<string, string> = {
  visualHierarchy: "Visual Hierarchy",
  colorUsage: "Color Usage",
  typography: "Typography",
  spacing: "Spacing",
  ctaClarity: "CTA Clarity",
  navigation: "Navigation",
  mobileReadiness: "Mobile",
  consistency: "Consistency",
  accessibility: "Accessibility",
  engagement: "Engagement",
  cognitiveLoad: "Cognitive Load",
  trustSignals: "Trust Signals",
  affordanceClarity: "Affordances",
  feedbackCompleteness: "Feedback",
  conventionAdherence: "Conventions",
  gestaltCompliance: "Gestalt",
  copyQuality: "Copy Quality",
  conversionPsychology: "Conversion",
};

function CopyBlock({ title, content, highlight }: { title: string; content: string; highlight?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!content) return null;

  return (
    <div className={`rounded-lg border ${highlight ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-white"}`}>
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <span className={`text-sm font-semibold ${highlight ? "text-blue-700" : "text-gray-700"}`}>{title}</span>
        <button
          onClick={copy}
          className="rounded px-3 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="max-h-64 overflow-auto whitespace-pre-wrap p-4 text-xs leading-relaxed text-gray-700">
        {content}
      </pre>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section id={title.toLowerCase().replace(/\s+/g, "-")} className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {children}
    </section>
  );
}

function formatText(text: string): string {
  const trimmed = text.trim();
  if ((trimmed.startsWith("{") && trimmed.endsWith("}")) || (trimmed.startsWith("[") && trimmed.endsWith("]"))) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === "object" && !Array.isArray(parsed)) {
        return Object.entries(parsed)
          .map(([k, v]) => `${k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase()).trim()}: ${typeof v === "string" ? v : JSON.stringify(v)}`)
          .join("\n\n");
      }
      if (Array.isArray(parsed)) {
        return parsed.map((item) => typeof item === "string" ? item : JSON.stringify(item)).join("\n");
      }
    } catch {
      // Not valid JSON, render as-is
    }
  }
  return text;
}

function TextCard({ label, text }: { label: string; text: string }) {
  if (!text) return null;
  const displayText = typeof text === "string" ? formatText(text) : String(text);
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</div>
      <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{displayText}</div>
    </div>
  );
}

function scoreColor(score: number): string {
  if (score >= 8) return "text-green-700 bg-green-50";
  if (score >= 6) return "text-blue-700 bg-blue-50";
  if (score >= 4) return "text-yellow-700 bg-yellow-50";
  return "text-red-700 bg-red-50";
}

function SiteCard({ site }: { site: AnalyzedSite }) {
  const siteScore = site.overallScore || site.score || 0;
  const hasDetails = (site.strengths && site.strengths.length > 0) || (site.scoreHighlights && site.scoreHighlights.length > 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 space-y-3">
      {/* Header: URL + Score */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium truncate max-w-[70%]">{site.url}</div>
        <div className={`rounded-full px-3 py-1 text-lg font-bold ${scoreColor(siteScore)}`}>
          {siteScore}/10
        </div>
      </div>

      {/* Key Takeaway */}
      {site.keyTakeaway && (
        <div className="text-sm text-gray-600">{site.keyTakeaway}</div>
      )}

      {/* Comparison Notes */}
      {site.comparisonNotes && (
        <div className="text-xs text-blue-600 italic border-l-2 border-blue-200 pl-3">{site.comparisonNotes}</div>
      )}

      {hasDetails && (
        <>
          {/* Strengths and Weaknesses */}
          {((site.strengths && site.strengths.length > 0) || (site.weaknesses && site.weaknesses.length > 0)) && (
            <div className="grid grid-cols-2 gap-3">
              {site.strengths && site.strengths.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-green-700 mb-1">Strengths</div>
                  {site.strengths.map((s, i) => (
                    <div key={i} className="text-xs text-gray-600 mb-0.5">+ {s}</div>
                  ))}
                </div>
              )}
              {site.weaknesses && site.weaknesses.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-red-700 mb-1">Weaknesses</div>
                  {site.weaknesses.map((w, i) => (
                    <div key={i} className="text-xs text-gray-600 mb-0.5">- {w}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Score Highlights with Justifications */}
          {site.scoreHighlights && site.scoreHighlights.length > 0 && (
            <div className="space-y-1.5 border-t border-gray-100 pt-3">
              <div className="text-xs font-semibold text-gray-500">Score Highlights</div>
              {site.scoreHighlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className={`font-mono font-bold shrink-0 w-5 text-right ${h.score >= 7 ? "text-green-600" : h.score >= 5 ? "text-gray-600" : "text-red-600"}`}>
                    {h.score}
                  </span>
                  <span className="text-gray-400 shrink-0">
                    {DIMENSION_LABELS[h.dimension] || h.dimension}
                  </span>
                  {h.justification && (
                    <span className="text-gray-600">{h.justification}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function BriefPage() {
  const params = useParams();
  const jobId = params.jobId as string;
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/scout/${jobId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else if (data.result) {
          setBrief(data.result);
        } else if (data.status !== "complete") {
          setError(`Job is still ${data.status}. Please wait for it to finish.`);
        } else {
          setError("No brief data found.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load brief.");
        setLoading(false);
      });
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-20">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        <span className="text-gray-500">Loading brief...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20">
        <p className="text-red-600">{error}</p>
        <a href="/" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
          Back to Scout
        </a>
      </div>
    );
  }

  if (!brief) return null;

  const promptLabels: Record<string, string> = {
    heroSection: "Hero Section",
    navigation: "Navigation",
    socialProof: "Social Proof",
    features: "Features",
    pricing: "Pricing",
    testimonials: "Testimonials",
    howItWorks: "How It Works",
    faq: "FAQ",
    cta: "CTA Section",
    footer: "Footer",
    overall: "Full Page (Mega-Prompt)",
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <a href="/" className="text-sm text-blue-600 hover:underline">
          &larr; New Scout
        </a>
        <h1 className="mt-3 text-2xl font-bold">Design Brief</h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {brief.category}
          </span>
          <span className="text-sm text-gray-500">{brief.goal}</span>
        </div>
      </div>

      {/* Summary */}
      <Section title="Summary">
        <TextCard label="Executive Summary" text={brief.executiveSummary} />
        <TextCard label="Target Audience" text={brief.targetAudience} />
      </Section>

      {/* Baseline Comparison — Analyzed Sites (moved up to establish context) */}
      {brief.analyzedSites?.length > 0 && (
        <Section title="Baseline Comparison">
          <p className="text-sm text-gray-500">
            These {brief.analyzedSites.length} sites were analyzed as reference benchmarks for your design brief.
          </p>
          <div className="space-y-3">
            {brief.analyzedSites.map((site) => (
              <SiteCard key={site.url} site={site} />
            ))}
          </div>
        </Section>
      )}

      {/* Psychology */}
      <Section title="Psychology Strategy">
        <div className="grid gap-4 md:grid-cols-2">
          <TextCard label="Hook Model" text={brief.psychologyStrategy?.hookModel} />
          <TextCard label="Trust Building" text={brief.psychologyStrategy?.trustBuilding} />
          <TextCard label="Friction Reduction" text={brief.psychologyStrategy?.frictionReduction} />
          <TextCard label="Conversion Tactics" text={brief.psychologyStrategy?.conversionTactics} />
          <TextCard label="Emotional Design" text={brief.psychologyStrategy?.emotionalDesign} />
        </div>
      </Section>

      {/* Design Direction */}
      <Section title="Design Direction">
        <div className="grid gap-4 md:grid-cols-2">
          <TextCard label="Layout" text={brief.recommendedApproach?.layout} />
          <TextCard label="Color Strategy" text={brief.recommendedApproach?.colorStrategy} />
          <TextCard label="Typography" text={brief.recommendedApproach?.typographyStrategy} />
          <TextCard label="CTA Strategy" text={brief.recommendedApproach?.ctaStrategy} />
          <TextCard label="Content Structure" text={brief.recommendedApproach?.contentStructure} />
          <TextCard label="Interactions" text={brief.recommendedApproach?.interactionPatterns} />
        </div>
      </Section>

      {/* Design System */}
      <Section title="Design System">
        {brief.designSystem?.suggestedPalette?.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Palette</div>
            <div className="flex flex-wrap gap-2">
              {brief.designSystem.suggestedPalette.map((color, i) => {
                const hex = color.match(/#[0-9a-fA-F]{3,8}/)?.[0];
                return (
                  <div key={i} className="flex items-center gap-2 rounded border border-gray-200 px-3 py-1.5">
                    {hex && (
                      <div
                        className="h-4 w-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: hex }}
                      />
                    )}
                    <span className="text-xs text-gray-600">{color}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {brief.designSystem?.suggestedFonts?.length > 0 && (
          <TextCard label="Fonts" text={brief.designSystem.suggestedFonts.join("\n")} />
        )}
        <TextCard label="Spacing" text={brief.designSystem?.spacingNotes} />
        {brief.designSystem?.componentList?.length > 0 && (
          <TextCard label="Components Needed" text={brief.designSystem.componentList.join("\n")} />
        )}
      </Section>

      {/* Build Prompts */}
      <Section title="Build Prompts">
        <p className="text-sm text-gray-500">
          Copy-paste these into Cursor, Claude Code, or any AI coding tool.
        </p>
        <div className="space-y-4">
          {/* Mega-prompt first */}
          {brief.buildPrompts?.overall && (
            <CopyBlock title="Full Page (Mega-Prompt)" content={brief.buildPrompts.overall} highlight />
          )}
          {Object.entries(brief.buildPrompts || {})
            .filter(([key, val]) => key !== "overall" && val)
            .map(([key, content]) => (
              <CopyBlock key={key} title={promptLabels[key] || key} content={content} />
            ))}
        </div>
      </Section>
    </div>
  );
}
