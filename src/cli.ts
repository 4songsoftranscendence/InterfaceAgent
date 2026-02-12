#!/usr/bin/env node
// ============================================
// DESIGN SCOUT — CLI
// ============================================
// The main entry point. Run:
//   npx tsx src/cli.ts scout --urls "https://linear.app,https://notion.so" --category saas-landing --goal "Build a CRM landing page"
//   npx tsx src/cli.ts analyze --url "https://stripe.com"
//   npx tsx src/cli.ts library --category saas-landing

import { config } from "dotenv";
config();

import { Command } from "commander";
import * as fs from "fs/promises";
import * as path from "path";
import { crawlSite, crawlMultiple } from "./modules/crawler.js";
import { analyzeSite, analyzeMultiple } from "./modules/analyzer.js";
import { generateBrief } from "./modules/brief-generator.js";
import {
  saveAnalysis,
  saveBrief,
  getByCategory,
  getBriefs,
  SETUP_SQL,
} from "./modules/storage.js";
import { CATEGORY_OVERLAYS, SECTION_PROMPTS } from "./prompts/index.js";
import type { DesignBrief } from "./types/index.js";

const program = new Command();

program
  .name("design-scout")
  .description(
    "🔍 AI Design Research Agent — Crawl sites, analyze UI/UX, generate design briefs"
  )
  .version("0.1.0");

// ============================================
// SCOUT — Full pipeline: crawl → analyze → brief
// ============================================
program
  .command("scout")
  .description("Run the full pipeline: crawl → analyze → generate brief")
  .requiredOption(
    "-u, --urls <urls>",
    "Comma-separated URLs to analyze"
  )
  .option(
    "-c, --category <category>",
    "Site category (saas-landing, healthcare, ecommerce, portfolio, startup, agency)",
    "saas-landing"
  )
  .option(
    "-g, --goal <goal>",
    "What you're building",
    "A modern website in this category"
  )
  .option(
    "-d, --depth <depth>",
    "Analysis depth: quick, standard, deep",
    "standard"
  )
  .option("-o, --output <dir>", "Output directory", "./output")
  .action(async (opts) => {
    console.log("\n🚀 DESIGN SCOUT — Starting full pipeline\n");
    console.log(`   Category: ${opts.category}`);
    console.log(`   Goal: ${opts.goal}`);
    console.log(`   Depth: ${opts.depth}\n`);

    const urls = opts.urls.split(",").map((u: string) => u.trim());

    // Determine screenshot sections based on depth
    const sections =
      opts.depth === "quick"
        ? (["above-fold"] as const)
        : opts.depth === "deep"
          ? (["full", "above-fold", "hero", "footer", "mobile"] as const)
          : (["full", "above-fold", "mobile"] as const);

    // Step 1: Crawl
    console.log("━━━ STEP 1/3: Crawling ━━━");
    const crawlResults = await crawlMultiple(urls, {
      outputDir: path.join(opts.output, "screenshots"),
      sections: [...sections],
    });

    if (crawlResults.length === 0) {
      console.error("❌ No sites could be crawled. Exiting.");
      process.exit(1);
    }

    // Step 2: Analyze
    console.log("\n━━━ STEP 2/3: Analyzing UI/UX ━━━");
    const analyses = await analyzeMultiple(crawlResults, opts.category);

    // Save individual analyses
    for (const analysis of analyses) {
      await saveAnalysis(analysis, opts.category);
    }

    if (analyses.length === 0) {
      console.error("❌ No analyses completed. Exiting.");
      process.exit(1);
    }

    // Step 3: Generate brief
    console.log("\n━━━ STEP 3/3: Generating Design Brief ━━━");
    const brief = await generateBrief(analyses, opts.category, opts.goal);
    await saveBrief(brief);

    // Write the brief to a readable markdown file
    const briefPath = path.join(opts.output, `brief-${opts.category}-${Date.now()}.md`);
    await writeBriefMarkdown(brief, briefPath);

    // Write raw JSON too
    const jsonPath = path.join(opts.output, `brief-${opts.category}-${Date.now()}.json`);
    await fs.mkdir(path.dirname(jsonPath), { recursive: true });
    await fs.writeFile(jsonPath, JSON.stringify(brief, null, 2));

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ DESIGN SCOUT — Pipeline Complete!");
    console.log(`   📄 Brief: ${briefPath}`);
    console.log(`   📊 JSON:  ${jsonPath}`);
    console.log(`   🖼️  Screenshots: ${opts.output}/screenshots/`);
    console.log(`   📚 Library: ./output/library/`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  });

// ============================================
// ANALYZE — Single site analysis (no brief)
// ============================================
program
  .command("analyze")
  .description("Analyze a single URL without generating a brief")
  .requiredOption("-u, --url <url>", "URL to analyze")
  .option("-c, --category <category>", "Site category")
  .option("-o, --output <dir>", "Output directory", "./output")
  .action(async (opts) => {
    console.log(`\n🔍 Analyzing: ${opts.url}\n`);

    const crawlResult = await crawlSite(opts.url, {
      outputDir: path.join(opts.output, "screenshots"),
    });
    const analysis = await analyzeSite(crawlResult, opts.category);
    await saveAnalysis(analysis, opts.category || "uncategorized");

    // Print summary
    console.log("\n📊 Analysis Summary:");
    console.log(`   Overall Score: ${analysis.overallScore}/10`);
    console.log(`   Strengths:`);
    analysis.strengths.forEach((s) => console.log(`     ✓ ${s}`));
    console.log(`   Weaknesses:`);
    analysis.weaknesses.forEach((w) => console.log(`     ✗ ${w}`));
    console.log(`   Patterns Found:`);
    analysis.patterns.forEach((p) =>
      console.log(`     • ${p.name} (${p.effectiveness})`)
    );
    console.log(`\n   Design Tokens:`);
    console.log(`     Colors: ${analysis.designTokens.primaryColors.join(", ")}`);
    console.log(`     Fonts:  ${analysis.designTokens.fontFamilies.join(", ")}`);
    console.log();
  });

// ============================================
// LIBRARY — Browse stored analyses
// ============================================
program
  .command("library")
  .description("Browse your design research library")
  .option("-c, --category <category>", "Filter by category")
  .option("--briefs", "Show briefs instead of analyses")
  .action(async (opts) => {
    if (opts.briefs) {
      const briefs = await getBriefs(opts.category);
      console.log(`\n📚 Design Briefs (${briefs.length} found):\n`);
      for (const brief of briefs) {
        console.log(`  [${brief.category}] ${brief.goal}`);
        console.log(`    Created: ${brief.createdAt}`);
        console.log(`    Sites: ${brief.analyzedSites.length} analyzed`);
        console.log(`    Summary: ${brief.executiveSummary.slice(0, 120)}...`);
        console.log();
      }
    } else {
      const entries = await getByCategory(opts.category || "all");
      console.log(`\n📚 Library (${entries.length} entries):\n`);
      for (const entry of entries) {
        console.log(
          `  [${entry.category}] ${entry.url} — Score: ${entry.analysis.overallScore}/10`
        );
      }
    }
  });

// ============================================
// CATEGORIES — List available categories
// ============================================
program
  .command("categories")
  .description("List available category overlays")
  .action(() => {
    console.log("\n📂 Available Categories:\n");
    for (const [key, description] of Object.entries(CATEGORY_OVERLAYS)) {
      console.log(`  ${key}`);
      console.log(`    ${description.split("\n")[0].trim()}`);
      console.log();
    }
  });

// ============================================
// PROMPTS — Show section prompt library
// ============================================
program
  .command("prompts")
  .description("Show the built-in prompt library for vibe-coding")
  .option("-s, --section <section>", "Show a specific section prompt")
  .action((opts) => {
    if (opts.section) {
      const prompt = SECTION_PROMPTS[opts.section];
      if (prompt) {
        console.log(`\n🎨 Prompt: ${opts.section}\n`);
        console.log(prompt);
      } else {
        console.log(`Unknown section. Available: ${Object.keys(SECTION_PROMPTS).join(", ")}`);
      }
    } else {
      console.log("\n🎨 Section Prompt Library:\n");
      for (const [key] of Object.entries(SECTION_PROMPTS)) {
        console.log(`  ${key}`);
      }
      console.log('\n  Use --section <name> to see a specific prompt');
    }
  });

// ============================================
// SETUP — Print Supabase setup SQL
// ============================================
program
  .command("setup")
  .description("Print Supabase setup SQL")
  .action(() => {
    console.log("\n📦 Run this SQL in your Supabase SQL Editor:\n");
    console.log(SETUP_SQL);
  });

// ============================================
// Helper: write brief as readable markdown
// ============================================
async function writeBriefMarkdown(
  brief: DesignBrief,
  filepath: string
): Promise<void> {
  await fs.mkdir(path.dirname(filepath), { recursive: true });

  const md = `# Design Brief: ${brief.category}
> Generated by Design Scout on ${new Date(brief.createdAt).toLocaleDateString()}

## Goal
${brief.goal}

## Executive Summary
${brief.executiveSummary}

## Target Audience
${brief.targetAudience}

---

## Recommended Approach

### Layout
${brief.recommendedApproach.layout}

### Color Strategy
${brief.recommendedApproach.colorStrategy}

### Typography
${brief.recommendedApproach.typographyStrategy}

### CTA Strategy
${brief.recommendedApproach.ctaStrategy}

### Content Structure
${brief.recommendedApproach.contentStructure}

### Interaction Patterns
${brief.recommendedApproach.interactionPatterns}

---

## Psychology Strategy

### Hook Model
${brief.psychologyStrategy?.hookModel || "N/A"}

### Trust Building Sequence
${brief.psychologyStrategy?.trustBuilding || "N/A"}

### Friction Reduction
${brief.psychologyStrategy?.frictionReduction || "N/A"}

### Conversion Tactics
${brief.psychologyStrategy?.conversionTactics || "N/A"}

### Emotional Design
${brief.psychologyStrategy?.emotionalDesign || "N/A"}

---

## Design System

**Palette:** ${brief.designSystem.suggestedPalette.join(", ")}

**Fonts:** ${brief.designSystem.suggestedFonts.join(", ")}

**Spacing:** ${brief.designSystem.spacingNotes}

**Components Needed:**
${brief.designSystem.componentList.map((c: any) => `- ${c}`).join("\n")}

---

## Build Prompts (copy-paste into Cursor/Claude/v0)

### Hero Section
\`\`\`
${brief.buildPrompts.heroSection}
\`\`\`

### Navigation
\`\`\`
${brief.buildPrompts.navigation}
\`\`\`

### Social Proof
\`\`\`
${brief.buildPrompts.socialProof}
\`\`\`

### Features
\`\`\`
${brief.buildPrompts.features}
\`\`\`

### Pricing
\`\`\`
${brief.buildPrompts.pricing || "N/A"}
\`\`\`

### Testimonials
\`\`\`
${brief.buildPrompts.testimonials || "N/A"}
\`\`\`

### How It Works
\`\`\`
${brief.buildPrompts.howItWorks || "N/A"}
\`\`\`

### FAQ
\`\`\`
${brief.buildPrompts.faq || "N/A"}
\`\`\`

### CTA
\`\`\`
${brief.buildPrompts.cta}
\`\`\`

### Footer
\`\`\`
${brief.buildPrompts.footer}
\`\`\`

### Full Page (single mega-prompt)
\`\`\`
${brief.buildPrompts.overall}
\`\`\`

---

## Reference Sites Analyzed

${brief.analyzedSites.map((s) => `| ${s.url} | ${s.score}/10 | ${s.keyTakeaway} |`).join("\n")}

---
*Generated by [Design Scout](https://github.com/your-repo/design-scout) v0.1.0*
`;

  await fs.writeFile(filepath, md);
}

program.parse();
