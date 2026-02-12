# 🔍 Design Scout

**AI Design Research Agent** — Crawl websites, analyze UI/UX with Claude Vision, and generate design briefs with ready-to-use build prompts.

> Give it a list of websites. It screenshots them, evaluates them like a senior UX designer, and generates a design brief you can paste into Cursor/Claude/v0 to actually build something.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    DESIGN SCOUT                      │
│                                                      │
│  CLI / Future Web UI                                 │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  scout    │  │ analyze  │  │ library / prompts │  │
│  └────┬─────┘  └────┬─────┘  └────────┬──────────┘  │
│       │              │                 │             │
│  ┌────▼──────────────▼─────────────────▼──────────┐  │
│  │              ORCHESTRATOR                       │  │
│  └──┬──────────┬──────────┬──────────┬────────────┘  │
│     │          │          │          │               │
│  ┌──▼───┐  ┌──▼───┐  ┌──▼────┐  ┌──▼─────┐        │
│  │Crawl │  │Analyze│  │Brief  │  │Storage │        │
│  │      │  │      │  │Gen    │  │        │        │
│  │Playw-│  │Claude│  │Claude │  │Supa-   │        │
│  │right │  │Vision│  │Text   │  │base or │        │
│  │      │  │API   │  │API    │  │Local   │        │
│  └──────┘  └──────┘  └───────┘  └────────┘        │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │         PROMPT LIBRARY (the secret sauce)     │    │
│  │  • UX heuristic scoring rubric                │    │
│  │  • Category overlays (SaaS, healthcare, etc)  │    │
│  │  • Section prompts (hero, pricing, etc)       │    │
│  └──────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### Data Flow

```
URLs → [Playwright] → Screenshots + Metadata
                          ↓
Screenshots → [Claude Vision API] → Structured UI/UX Analysis (JSON)
                                        ↓
Analyses → [Claude Text API] → Design Brief + Build Prompts
                                    ↓
                              [Supabase / Local JSON]
                                    ↓
                              Markdown Brief File
                              (with copy-paste prompts)
```

---

## Quick Start

### 1. Install

```bash
git clone <your-repo>/design-scout
cd design-scout
npm install
npx playwright install chromium
```

### 2. Configure

```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
# Optionally add SUPABASE_URL and SUPABASE_ANON_KEY
```

### 3. Run

```bash
# Full pipeline: crawl → analyze → generate brief
npx tsx src/cli.ts scout \
  --urls "https://linear.app,https://notion.so,https://vercel.com" \
  --category saas-landing \
  --goal "Build a CRM landing page for healthcare enrollment"

# Quick single-site analysis
npx tsx src/cli.ts analyze --url "https://stripe.com" --category saas-landing

# Browse your library
npx tsx src/cli.ts library --category saas-landing
npx tsx src/cli.ts library --briefs

# See available categories
npx tsx src/cli.ts categories

# Browse built-in prompts
npx tsx src/cli.ts prompts
npx tsx src/cli.ts prompts --section hero-saas
```

---

## What It Produces

### 1. Screenshots
Multiple viewport captures per site (desktop, mobile, hero section, etc.)

### 2. UI/UX Analysis (per site)
- **10 heuristic scores** (1-10): visual hierarchy, color, typography, spacing, CTA clarity, navigation, mobile readiness, consistency, accessibility, engagement
- **Design patterns detected** with effectiveness ratings
- **Design tokens extracted**: colors, fonts, spacing, border-radius, shadows
- **Strengths & weaknesses** (specific, not generic)

### 3. Design Brief
- Executive summary & target audience
- Recommended approach (layout, color, typography, CTA, content structure, interactions)
- Suggested design system (palette, fonts, spacing, component list)
- **Ready-to-paste build prompts** for every section (hero, nav, social proof, features, CTA, footer, and a mega-prompt for the full page)

---

## Categories

Built-in category overlays add domain expertise to the analysis:

| Category | Focus Areas |
|---|---|
| `saas-landing` | Value prop, pricing, free trial CTA, social proof |
| `healthcare` | Trust, HIPAA messaging, ADA compliance, calming palette |
| `ecommerce` | Product imagery, cart flow, trust signals, urgency |
| `portfolio` | Work presentation, case study depth, personal brand |
| `startup` | Problem/solution clarity, "why now", waitlist flow |
| `agency` | Capability demonstration, process communication |

---

## Supabase Setup (Optional)

If you want persistent storage, run this in your Supabase SQL editor:

```bash
npx tsx src/cli.ts setup
```

This prints the SQL to create the required tables. Without Supabase, everything saves to `./output/library/` as JSON files.

---

## Adding to Your Stack

### Use with Cursor / Claude Code
The generated brief markdown includes prompts designed to be pasted directly into AI coding tools. The "mega-prompt" in particular is tuned to give Claude/Cursor enough context to generate an entire page.

### Use with SuperDesign (Chrome Extension)
1. Run Design Scout to generate your brief
2. Use SuperDesign's "Clone any website" on the highest-scoring reference site
3. Apply the brief's design tokens and recommendations to modify the clone

### Use with Figma + UX Pilot
1. Run Design Scout to identify patterns and design tokens
2. Feed the design system recommendations into UX Pilot for wireframes
3. Use the component list to build your Figma component library

---

## Extending

### Add a new category
Edit `src/prompts/index.ts` → `CATEGORY_OVERLAYS` and add your domain-specific analysis criteria.

### Add new section prompts
Edit `src/prompts/index.ts` → `SECTION_PROMPTS` with copy-paste-ready prompts for new sections.

### Build a web UI
The modules are designed to be imported directly:

```typescript
import { crawlSite } from "./modules/crawler.js";
import { analyzeSite } from "./modules/analyzer.js";
import { generateBrief } from "./modules/brief-generator.js";

// Use in an Express/Next.js API route
const crawl = await crawlSite("https://example.com");
const analysis = await analyzeSite(crawl, "saas-landing");
```

---

## Cost Estimate

Each full scout run (3 sites, standard depth) costs approximately:
- **Claude API**: ~$0.30-0.80 (depending on screenshot sizes and model)
- **Supabase**: Free tier is fine for hundreds of entries
- **Total per run**: Under $1

---

## License

MIT — Do whatever you want with it.
