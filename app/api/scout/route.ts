import { NextResponse } from "next/server";
import { createJob } from "@/app/lib/jobs";
import { runPipeline } from "@/app/lib/run-pipeline";
import { CATEGORY_OVERLAYS } from "@/src/prompts/index";

export async function POST(request: Request) {
  const userApiKey = request.headers.get("X-OpenRouter-Key") || undefined;
  const body = await request.json();
  const { urls, category, goal } = body;

  // Validate
  if (!urls || !Array.isArray(urls) || urls.length === 0 || urls.length > 10) {
    return NextResponse.json(
      { error: "Provide 1-10 URLs as an array." },
      { status: 400 }
    );
  }

  for (const url of urls) {
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: `Invalid URL: ${url}` },
        { status: 400 }
      );
    }
  }

  if (!category || !CATEGORY_OVERLAYS[category]) {
    return NextResponse.json(
      { error: `Invalid category. Choose from: ${Object.keys(CATEGORY_OVERLAYS).join(", ")}` },
      { status: 400 }
    );
  }

  if (!goal || typeof goal !== "string" || goal.trim().length === 0) {
    return NextResponse.json(
      { error: "Goal is required." },
      { status: 400 }
    );
  }

  const job = createJob({ urls, category, goal: goal.trim() });

  // Fire and forget — pipeline runs in background
  runPipeline(job, userApiKey).catch((err) => {
    console.error("Pipeline crashed:", err);
  });

  return NextResponse.json({ jobId: job.id }, { status: 201 });
}
