"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
  analyzedSites: { url: string; score: number; keyTakeaway: string }[];
}

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

function TextCard({ label, text }: { label: string; text: string }) {
  if (!text) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</div>
      <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{text}</div>
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

      {/* Analyzed Sites */}
      {brief.analyzedSites?.length > 0 && (
        <Section title="Analyzed Sites">
          <div className="space-y-2">
            {brief.analyzedSites.map((site) => (
              <div
                key={site.url}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
              >
                <div>
                  <div className="text-sm font-medium">{site.url}</div>
                  <div className="text-xs text-gray-500">{site.keyTakeaway}</div>
                </div>
                <div className="text-lg font-bold text-gray-700">{site.score}/10</div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
