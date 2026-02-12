# Design Scout

**AI Design Research Agent** — Crawl websites, analyze UI/UX with any vision model, and generate design briefs with ready-to-use build prompts.

> Give it a list of websites. It screenshots them, evaluates them like a senior UX designer, and generates a design brief you can paste into Cursor/Claude/v0 to actually build something.

---

## Architecture

```
URLs → [Playwright] → Screenshots + Metadata
                          ↓
Screenshots → [Vision Model via OpenRouter] → Structured UI/UX Analysis (JSON)
                                                  ↓
Analyses → [LLM via OpenRouter] → Design Brief + Build Prompts
                                      ↓
                                [Supabase / Local JSON]
                                      ↓
                                Markdown Brief File
                                (with copy-paste prompts)
```

Uses **OpenRouter** to access any vision-capable model. Default: **Gemini 2.0 Flash** (~$0.0002 per screenshot analyzed).

---

## Quick Start

### 1. Install

```bash
git clone https://github.com/4songsoftranscendence/InterfaceAgent.git
cd InterfaceAgent
npm install
npx playwright install chromium
```

### 2. Configure

```bash
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY (get one at https://openrouter.ai/keys)
```

### 3. Run

```bash
# Full pipeline: crawl → analyze → generate brief
npx tsx src/cli.ts scout \
  --urls "https://linear.app,https://notion.so,https://vercel.com" \
  --category saas-landing \
  --goal "Build a modern landing page for my product"

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

### 4. Web UI (local)

```bash
npx next dev
# Open http://localhost:3000
```

---

## What It Produces

### 1. Screenshots
Multiple viewport captures per site (desktop, mobile, hero section, etc.)

### 2. UI/UX Analysis (per site)
- **10 heuristic scores** (1-10): visual hierarchy, color, typography, spacing, CTA clarity, navigation, mobile readiness, consistency, accessibility, engagement
- **8 psychology scores**: cognitive load, trust signals, affordance clarity, feedback, conventions, gestalt, copy quality, conversion psychology
- **Design patterns detected** with effectiveness ratings
- **Design tokens extracted**: colors, fonts, spacing, border-radius, shadows
- **Strengths & weaknesses** (specific, not generic)

### 3. Design Brief
- Executive summary & target audience
- Psychology strategy (hook model, trust building, friction reduction, conversion tactics)
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

## Model Configuration

Default model is `google/gemini-2.0-flash-001` via OpenRouter. Override with:

```bash
# In .env
SCOUT_MODEL=anthropic/claude-sonnet-4  # or any OpenRouter vision model
```

Browse available models at [openrouter.ai/models](https://openrouter.ai/models?modality=image).

### Cost Estimate

Each full scout run (3 sites, standard depth):
- **Gemini 2.0 Flash** (default): ~$0.001-0.005 per run
- **Claude Sonnet**: ~$0.30-0.80 per run
- **Free models** (Qwen, Llama): $0 (rate-limited)

---

## Extending

### Add a new category
Edit `src/prompts/index.ts` → `CATEGORY_OVERLAYS` and add your domain-specific analysis criteria.

### Add new section prompts
Edit `src/prompts/index.ts` → `SECTION_PROMPTS` with copy-paste-ready prompts for new sections.

---

## License

MIT
