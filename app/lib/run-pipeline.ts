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

    // Step 2: Analyze each site (up to 3 in parallel for speed)
    const ANALYSIS_CONCURRENCY = 3;

    updateJob(job.id, {
      status: "analyzing",
      progress: {
        ...job.progress,
        sitesCrawled: crawlResults.length,
        currentStep: `Analyzing ${new URL(crawlResults[0].url).hostname}...`,
      },
    });

    const analyses = [];
    let analysisCompleted = 0;

    for (let batchStart = 0; batchStart < crawlResults.length; batchStart += ANALYSIS_CONCURRENCY) {
      const batch = crawlResults.slice(batchStart, batchStart + ANALYSIS_CONCURRENCY);
      const batchNames = batch.map((c) => new URL(c.url).hostname).join(", ");

      updateJob(job.id, {
        progress: {
          ...job.progress,
          sitesCrawled: crawlResults.length,
          sitesAnalyzed: analysisCompleted,
          currentStep: `Analyzing ${batchNames} (${batchStart + 1}-${Math.min(batchStart + batch.length, crawlResults.length)}/${crawlResults.length})...`,
        },
      });

      const batchResults = await Promise.all(
        batch.map(async (crawl) => {
          try {
            return await analyzeSite(crawl, category, apiKey);
          } catch (err) {
            console.error(`Failed to analyze ${crawl.url}:`, err);
            return null;
          }
        })
      );

      for (const result of batchResults) {
        if (result) analyses.push(result);
        analysisCompleted++;
      }

      updateJob(job.id, {
        progress: { ...job.progress, sitesCrawled: crawlResults.length, sitesAnalyzed: analysisCompleted },
      });

      // Rate limit between batches
      if (batchStart + ANALYSIS_CONCURRENCY < crawlResults.length) {
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
