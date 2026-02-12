import { NextResponse } from "next/server";
import {
  SYSTEM_PROMPT,
  ANALYZE_SCREENSHOT_PROMPT,
  GENERATE_BRIEF_PROMPT,
  CATEGORY_OVERLAYS,
  SECTION_PROMPTS,
} from "@/src/prompts/index";

const SCORING_DIMENSIONS = {
  visual: [
    "Visual Hierarchy",
    "Color Usage",
    "Typography",
    "Spacing & Layout",
    "CTA Clarity",
    "Navigation",
    "Mobile Readiness",
    "Consistency",
    "Accessibility",
    "Engagement",
  ],
  psychology: [
    "Cognitive Load",
    "Trust Signals",
    "Affordance Clarity",
    "Feedback Completeness",
    "Convention Adherence",
    "Gestalt Compliance",
    "Copy Quality",
    "Conversion Psychology",
  ],
};

const CORE_PROMPTS = [
  {
    key: "SYSTEM_PROMPT",
    label: "System Prompt",
    description: "Foundational analysis framework with UX psychology references",
  },
  {
    key: "ANALYZE_SCREENSHOT_PROMPT",
    label: "Analyze Screenshot",
    description: "18 scoring dimensions across visual design and psychology",
  },
  {
    key: "GENERATE_BRIEF_PROMPT",
    label: "Generate Brief",
    description: "Design brief generation with psychology strategy and build prompts",
  },
];

const CATEGORY_META = [
  { key: "saas-landing", label: "SaaS Landing", description: "Conversion sequence, pricing psychology, social proof" },
  { key: "healthcare", label: "Healthcare", description: "Anxiety reduction, trust architecture, accessibility" },
  { key: "ecommerce", label: "E-Commerce", description: "Cart flow, checkout friction, price presentation" },
  { key: "portfolio", label: "Portfolio", description: "Site-as-portfolio, case study depth, personal brand" },
  { key: "startup", label: "Startup", description: "Problem/solution clarity, traction signals, memorability" },
  { key: "agency", label: "Agency", description: "Credibility, case study quality, process communication" },
];

export async function GET() {
  const sectionKeys = Object.keys(SECTION_PROMPTS);
  const sectionMeta = sectionKeys.map((key) => ({
    key,
    label: key
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
  }));

  return NextResponse.json({
    scoring: SCORING_DIMENSIONS,
    corePrompts: CORE_PROMPTS,
    categoryMeta: CATEGORY_META,
    sectionMeta,
    core: {
      SYSTEM_PROMPT,
      ANALYZE_SCREENSHOT_PROMPT,
      GENERATE_BRIEF_PROMPT,
    },
    categories: CATEGORY_OVERLAYS,
    sections: SECTION_PROMPTS,
  });
}
