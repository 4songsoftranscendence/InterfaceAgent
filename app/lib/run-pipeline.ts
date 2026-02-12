// ============================================
// Pipeline runner — executes the full scout pipeline
// and updates the job as it progresses.
// ============================================

import "dotenv/config";
import { crawlSite } from "@/src/modules/crawler";
import { analyzeSite } from "@/src/modules/analyzer";
import { generateBrief } from "@/src/modules/brief-generator";
import { saveBrief } from "@/src/modules/storage";
import type { CrawlResult } from "@/src/types/index";
import { updateJob, type Job } from "./jobs";

export async function runPipeline(job: Job, apiKey?: string): Promise<void> {
  const { urls, category, goal } = job.config;

  try {
    // Step 1: Crawl all URLs
    updateJob(job.id, {
      status: "crawling",
      progress: { ...job.progress, currentStep: `Crawling ${urls[0]}...` },
    });

    const crawlResults: CrawlResult[] = [];
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      updateJob(job.id, {
        progress: {
          ...job.progress,
          currentStep: `Crawling ${new URL(url).hostname} (${i + 1}/${urls.length})...`,
          sitesCrawled: i,
        },
      });

      try {
        const result = await crawlSite(url, {
          outputDir: `./output/screenshots`,
        });
        crawlResults.push(result);
      } catch (err) {
        console.error(`Failed to crawl ${url}:`, err);
      }

      updateJob(job.id, {
        progress: { ...job.progress, sitesCrawled: i + 1 },
      });
    }

    if (crawlResults.length === 0) {
      updateJob(job.id, {
        status: "error",
        error: "None of the URLs could be crawled. Please check the URLs and try again.",
      });
      return;
    }

    // Step 2: Analyze each site
    updateJob(job.id, {
      status: "analyzing",
      progress: {
        ...job.progress,
        sitesCrawled: crawlResults.length,
        currentStep: `Analyzing ${new URL(crawlResults[0].url).hostname}...`,
      },
    });

    const analyses = [];
    for (let i = 0; i < crawlResults.length; i++) {
      const crawl = crawlResults[i];
      updateJob(job.id, {
        progress: {
          ...job.progress,
          sitesCrawled: crawlResults.length,
          sitesAnalyzed: i,
          currentStep: `Analyzing ${new URL(crawl.url).hostname} (${i + 1}/${crawlResults.length})...`,
        },
      });

      try {
        const analysis = await analyzeSite(crawl, category, apiKey);
        analyses.push(analysis);
      } catch (err) {
        console.error(`Failed to analyze ${crawl.url}:`, err);
      }

      updateJob(job.id, {
        progress: { ...job.progress, sitesCrawled: crawlResults.length, sitesAnalyzed: i + 1 },
      });

      // Rate limit between API calls
      if (i < crawlResults.length - 1) {
        await new Promise((r) => setTimeout(r, 1000));
      }
    }

    if (analyses.length === 0) {
      updateJob(job.id, {
        status: "error",
        error: "Analysis failed for all sites. This may be a temporary API issue — please try again.",
      });
      return;
    }

    updateJob(job.id, { analyses });

    // Step 3: Generate brief
    updateJob(job.id, {
      status: "generating",
      progress: {
        ...job.progress,
        sitesCrawled: crawlResults.length,
        sitesAnalyzed: analyses.length,
        currentStep: "Generating design brief...",
      },
    });

    const brief = await generateBrief(analyses, category, goal, apiKey);
    await saveBrief(brief);

    updateJob(job.id, {
      status: "complete",
      result: brief,
      progress: {
        ...job.progress,
        sitesCrawled: crawlResults.length,
        sitesAnalyzed: analyses.length,
        briefGenerated: true,
        currentStep: "Complete!",
      },
    });
  } catch (err: any) {
    console.error("Pipeline error:", err);
    updateJob(job.id, {
      status: "error",
      error: err?.message || "An unexpected error occurred.",
    });
  }
}
