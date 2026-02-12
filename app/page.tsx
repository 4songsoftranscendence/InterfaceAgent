"use client";

import { useState } from "react";
import { useApiKey } from "@/app/lib/api-key-context";
import { apiFetch } from "@/app/lib/api-fetch";

const CATEGORIES = [
  { id: "saas-landing", label: "SaaS Landing", description: "Value prop, pricing, CTAs, social proof" },
  { id: "healthcare", label: "Healthcare", description: "Trust, accessibility, calming design" },
  { id: "ecommerce", label: "E-commerce", description: "Product display, cart flow, trust signals" },
  { id: "portfolio", label: "Portfolio", description: "Work showcase, personal brand" },
  { id: "startup", label: "Startup", description: "Problem/solution, traction signals" },
  { id: "agency", label: "Agency", description: "Capability demonstration, case studies" },
];

interface ProgressData {
  status: string;
  progress: {
    currentStep: string;
    sitesTotal: number;
    sitesCrawled: number;
    sitesAnalyzed: number;
    briefGenerated: boolean;
  };
  error: string | null;
}

export default function Home() {
  const { apiKey } = useApiKey();

  // Smart prompt
  const [smartPrompt, setSmartPrompt] = useState("");
  const [suggesting, setSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState("");

  // Form
  const [urls, setUrls] = useState([""]);
  const [category, setCategory] = useState("saas-landing");
  const [goal, setGoal] = useState("");

  // Pipeline state
  const [state, setState] = useState<"idle" | "running" | "complete" | "error">("idle");
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  function addUrl() {
    if (urls.length < 5) setUrls([...urls, ""]);
  }

  function removeUrl(index: number) {
    if (urls.length > 1) setUrls(urls.filter((_, i) => i !== index));
  }

  function updateUrl(index: number, value: string) {
    const next = [...urls];
    next[index] = value;
    setUrls(next);
  }

  async function handleSmartPrompt() {
    if (!smartPrompt.trim()) return;
    setSuggesting(true);
    setSuggestError("");

    try {
      const res = await apiFetch(
        "/api/suggest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: smartPrompt.trim() }),
        },
        apiKey
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Suggestion failed");
      }

      const { urls: suggestedUrls, category: suggestedCategory, goal: suggestedGoal } = await res.json();

      if (suggestedUrls.length > 0) setUrls(suggestedUrls);
      if (suggestedCategory) setCategory(suggestedCategory);
      if (suggestedGoal) setGoal(suggestedGoal);
    } catch (err: any) {
      setSuggestError(err.message || "Failed to generate suggestions");
    } finally {
      setSuggesting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validUrls = urls.map((u) => u.trim()).filter(Boolean);
    if (validUrls.length === 0) return;

    setState("running");
    setErrorMsg("");
    setProgress(null);

    try {
      const res = await apiFetch(
        "/api/scout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: validUrls, category, goal: goal || "A modern website in this category" }),
        },
        apiKey
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to start");
      }

      const { jobId: id } = await res.json();
      setJobId(id);

      // Connect to SSE stream
      const eventSource = new EventSource(`/api/scout/${id}/stream`);
      eventSource.onmessage = (event) => {
        const data: ProgressData = JSON.parse(event.data);
        setProgress(data);

        if (data.status === "complete") {
          eventSource.close();
          setState("complete");
        } else if (data.status === "error") {
          eventSource.close();
          setState("error");
          setErrorMsg(data.error || "An error occurred");
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        fetch(`/api/scout/${id}`)
          .then((r) => r.json())
          .then((data) => {
            if (data.status === "complete") {
              setState("complete");
            } else if (data.status === "error") {
              setState("error");
              setErrorMsg(data.error || "Connection lost");
            }
          });
      };
    } catch (err: any) {
      setState("error");
      setErrorMsg(err.message || "Failed to start the pipeline");
    }
  }

  function reset() {
    setState("idle");
    setProgress(null);
    setJobId(null);
    setErrorMsg("");
  }

  // Running / progress view
  if (state === "running" || state === "complete" || state === "error") {
    const p = progress?.progress;
    const steps = [
      { label: "Crawl", done: (p?.sitesCrawled ?? 0) >= (p?.sitesTotal ?? 1) },
      { label: "Analyze", done: (p?.sitesAnalyzed ?? 0) >= (p?.sitesTotal ?? 1) },
      { label: "Brief", done: p?.briefGenerated ?? false },
    ];

    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">Design Scout</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-3">
          {steps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ${
                  step.done
                    ? "bg-green-100 text-green-700"
                    : progress?.status === ["crawling", "analyzing", "generating"][i]
                      ? "bg-blue-100 text-blue-700 animate-pulse"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {step.done ? "\u2713" : i + 1}
              </div>
              <span className={`text-sm font-medium ${step.done ? "text-green-700" : "text-gray-500"}`}>
                {step.label}
              </span>
              {i < steps.length - 1 && <div className="h-px w-8 bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* Current step */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          {state === "running" && (
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              <span className="text-gray-700">{p?.currentStep || "Starting..."}</span>
            </div>
          )}

          {state === "complete" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-green-700">
                <span className="text-xl">{"\u2713"}</span>
                <span className="font-semibold">Design brief generated!</span>
              </div>
              <a
                href={`/brief/${jobId}`}
                className="inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                View Brief
              </a>
            </div>
          )}

          {state === "error" && (
            <div className="space-y-4">
              <p className="text-red-600">{errorMsg}</p>
              <button
                onClick={reset}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Stats */}
        {p && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-2xl font-bold">{p.sitesCrawled}/{p.sitesTotal}</div>
              <div className="text-sm text-gray-500">Sites Crawled</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-2xl font-bold">{p.sitesAnalyzed}/{p.sitesTotal}</div>
              <div className="text-sm text-gray-500">Sites Analyzed</div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-2xl font-bold">{p.briefGenerated ? "1" : "0"}/1</div>
              <div className="text-sm text-gray-500">Brief</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Form view
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Design Scout</h1>
        <p className="mt-2 text-gray-500">
          Enter websites to analyze. We&apos;ll screenshot them, evaluate their UI/UX, and generate a design brief with build prompts.
        </p>
      </div>

      {/* Smart Prompt */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
        <label className="mb-2 block text-sm font-semibold text-blue-700">
          Describe what you want to build
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={smartPrompt}
            onChange={(e) => setSmartPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSmartPrompt()}
            placeholder='e.g., "I want to build a SaaS landing page like Linear and Notion"'
            className="flex-1 rounded-lg border border-blue-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleSmartPrompt}
            disabled={!smartPrompt.trim() || suggesting}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
          >
            {suggesting ? "Thinking..." : "Suggest"}
          </button>
        </div>
        {suggestError && <p className="mt-2 text-sm text-red-600">{suggestError}</p>}
        <p className="mt-2 text-xs text-blue-500">
          We&apos;ll suggest URLs, category, and goal for you. Requires an API key (gear icon above).
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs font-medium text-gray-400">or fill in manually</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URLs */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            URLs to Analyze
          </label>
          <div className="space-y-2">
            {urls.map((url, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => updateUrl(i, e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUrl(i)}
                    className="rounded-lg border border-gray-300 px-3 text-gray-400 hover:text-red-500"
                  >
                    x
                  </button>
                )}
              </div>
            ))}
          </div>
          {urls.length < 5 && (
            <button
              type="button"
              onClick={addUrl}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              + Add another URL
            </button>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Category
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`rounded-lg border p-3 text-left transition ${
                  category === cat.id
                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="text-sm font-semibold">{cat.label}</div>
                <div className="mt-0.5 text-xs text-gray-500">{cat.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            What are you building?
          </label>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., A landing page for my new product that converts visitors to signups"
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!urls.some((u) => u.trim())}
          className="w-full rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Analyze Sites
        </button>
      </form>
    </div>
  );
}
