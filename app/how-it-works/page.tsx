const PIPELINE_STEPS = [
  {
    icon: "\uD83D\uDD17",
    label: "URL Input",
    sublabel: "1\u20135 websites",
    color: "border-blue-200 bg-blue-50",
  },
  {
    icon: "\uD83D\uDD77\uFE0F",
    label: "Crawl",
    sublabel: "Playwright",
    color: "border-purple-200 bg-purple-50",
  },
  {
    icon: "\uD83D\uDCF8",
    label: "Screenshot",
    sublabel: "Desktop + Mobile",
    color: "border-green-200 bg-green-50",
  },
  {
    icon: "\uD83E\uDDE0",
    label: "Analyze",
    sublabel: "18 dimensions",
    color: "border-orange-200 bg-orange-50",
  },
  {
    icon: "\uD83D\uDCDD",
    label: "Brief",
    sublabel: "Psychology-informed",
    color: "border-red-200 bg-red-50",
  },
  {
    icon: "\uD83D\uDE80",
    label: "Build Prompts",
    sublabel: "Copy-paste ready",
    color: "border-teal-200 bg-teal-50",
  },
];

const STEP_DETAILS = [
  {
    title: "URL Input",
    description:
      "Enter 1\u20135 websites you want to learn from. These can be competitors, inspirations, or best-in-class examples in your category.",
    details: [
      "Or use the Smart Prompt to describe what you want and let AI suggest URLs",
      "Choose from 6 categories: SaaS, Healthcare, E-commerce, Portfolio, Startup, Agency",
      "Each category adds domain-specific evaluation criteria",
    ],
  },
  {
    title: "Crawl with Playwright",
    description:
      "A headless Chromium browser visits each site, scrolls through the full page, and captures everything just like a real user would see it.",
    details: [
      "Full-page screenshots at desktop (1440px) and mobile (390px) viewports",
      "Section-level captures: hero, navigation, features, footer, etc.",
      "Extracts metadata: fonts, colors, tech stack, page title",
      "Runs locally \u2014 no third-party crawling service needed",
    ],
  },
  {
    title: "Multi-Viewport Screenshots",
    description:
      "Up to 5 screenshots per site capture different sections and viewports, giving the vision model a complete picture of the design.",
    details: [
      "Desktop full-page + mobile full-page",
      "Hero section close-up for first-impression analysis",
      "Key sections captured individually for detailed scoring",
      "Images are base64-encoded and sent directly to the vision model",
    ],
  },
  {
    title: "Vision LLM Analysis (18 Dimensions)",
    description:
      "Each screenshot is analyzed by a vision-capable AI model using a psychology-informed scoring framework rooted in established UX principles.",
    details: [
      "10 Visual Scores: hierarchy, color, typography, spacing, CTA, navigation, mobile, consistency, accessibility, engagement",
      "8 Psychology Scores: cognitive load, trust, affordances, feedback, conventions, Gestalt, copy quality, conversion psychology",
      "Pattern detection: what works well and what doesn\u2019t (with specific principle references)",
      "Design token extraction: colors, fonts, spacing, shadows, border-radius",
      "Principle-specific notes: Norman Doors, Hick\u2019s violations, Fitts\u2019 issues, Trunk Test",
    ],
  },
  {
    title: "Design Brief Generation",
    description:
      "All site analyses are merged into a single actionable design brief with psychology strategy, design system recommendations, and a complete color/typography/spacing system.",
    details: [
      "Executive summary with emotional target and dominant psychological principles",
      "Hook Model strategy: triggers, actions, variable rewards, investments",
      "Trust building sequence, friction reduction tactics, conversion psychology",
      "Exact color palette (hex codes), font pairing, spacing scale",
      "CTA strategy with Fitts\u2019 Law sizing and copy patterns",
    ],
  },
  {
    title: "Copy-Paste Build Prompts",
    description:
      "The brief includes 11+ section-specific prompts you can paste directly into AI coding tools (Cursor, Claude, v0) to build each section of your site.",
    details: [
      "One mega-prompt for the entire page (hero through footer)",
      "Individual prompts: hero, navigation, social proof, features, pricing, testimonials, how-it-works, FAQ, CTA, footer",
      "Each prompt includes exact pixel values, colors, animations, accessibility requirements",
      "Psychology principles baked into every prompt (not just design specs)",
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">How Design Scout Works</h1>
        <p className="mt-2 text-gray-500">
          The pipeline from URL input to actionable, psychology-informed design
          brief.
        </p>
      </div>

      {/* Pipeline Diagram */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 md:p-8">
        <div className="flex flex-col items-center gap-2 md:flex-row md:justify-between md:gap-0">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center">
              <div
                className={`min-w-[110px] rounded-lg border ${step.color} p-4 text-center`}
              >
                <div className="text-2xl">{step.icon}</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">
                  {step.label}
                </div>
                <div className="text-xs text-gray-500">{step.sublabel}</div>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <>
                  <span className="hidden px-2 text-xl text-gray-300 md:block">
                    &rarr;
                  </span>
                  <span className="block text-xl text-gray-300 md:hidden">
                    &darr;
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cost callout */}
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="text-sm font-medium text-green-800">
          Default model: Gemini 2.0 Flash via OpenRouter &mdash; costs ~$0.001&ndash;0.005 per run (3 sites).
          That&apos;s roughly 200+ full analyses for $1.
        </p>
      </div>

      {/* Step details */}
      <div className="space-y-6">
        {STEP_DETAILS.map((step, i) => (
          <div
            key={step.title}
            className="rounded-lg border border-gray-200 bg-white p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                {i + 1}
              </div>
              <h3 className="text-base font-semibold text-gray-900">
                {step.title}
              </h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">{step.description}</p>
            <ul className="mt-3 space-y-1">
              {step.details.map((d, j) => (
                <li key={j} className="text-sm text-gray-500">
                  &bull; {d}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
