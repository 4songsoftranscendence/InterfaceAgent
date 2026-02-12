"use client";

import { useEffect, useState } from "react";

interface PromptData {
  scoring: { visual: string[]; psychology: string[] };
  corePrompts: { key: string; label: string; description: string }[];
  categoryMeta: { key: string; label: string; description: string }[];
  sectionMeta: { key: string; label: string }[];
  core: Record<string, string>;
  categories: Record<string, string>;
  sections: Record<string, string>;
}

function PromptBlock({
  title,
  description,
  content,
}: {
  title: string;
  description?: string;
  content: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="min-w-0">
          <span className="text-sm font-semibold text-gray-900">{title}</span>
          {description && (
            <span className="ml-2 text-xs text-gray-500">{description}</span>
          )}
        </div>
        <span className="ml-2 text-gray-400">{expanded ? "\u2212" : "+"}</span>
      </button>
      {expanded && (
        <div className="border-t border-gray-200">
          <div className="flex justify-end px-4 py-1">
            <button
              onClick={copy}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap px-4 pb-4 text-xs leading-relaxed text-gray-700">
            {content}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function PromptsPage() {
  const [data, setData] = useState<PromptData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/prompts")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">Prompt Library</h1>
        <p className="mt-2 text-gray-500">
          View the system prompts, scoring criteria, and category overlays that
          power Design Scout&apos;s analysis.
        </p>
      </div>

      {/* Scoring Rubric */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold">Scoring Rubric</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Visual Scores (10 dimensions)
            </h3>
            <ul className="space-y-1">
              {data.scoring.visual.map((s, i) => (
                <li key={s} className="text-sm text-gray-600">
                  <span className="text-gray-400">{i + 1}.</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-700">
              Psychology Scores (8 dimensions)
            </h3>
            <ul className="space-y-1">
              {data.scoring.psychology.map((s, i) => (
                <li key={s} className="text-sm text-gray-600">
                  <span className="text-gray-400">{i + 11}.</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Core Prompts */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold">Core Prompts</h2>
        {data.corePrompts.map((p) => (
          <PromptBlock
            key={p.key}
            title={p.label}
            description={p.description}
            content={data.core[p.key]}
          />
        ))}
      </section>

      {/* Category Overlays */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold">Category Overlays</h2>
        <p className="text-sm text-gray-500">
          Domain-specific evaluation criteria appended to the analysis prompt.
        </p>
        {data.categoryMeta.map((c) => (
          <PromptBlock
            key={c.key}
            title={c.label}
            description={c.description}
            content={data.categories[c.key]}
          />
        ))}
      </section>

      {/* Section Build Prompts */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold">Section Build Prompts</h2>
        <p className="text-sm text-gray-500">
          Copy-paste-ready prompts for building specific page sections.
        </p>
        {data.sectionMeta.map((s) => (
          <PromptBlock
            key={s.key}
            title={s.label}
            content={data.sections[s.key]}
          />
        ))}
      </section>
    </div>
  );
}
