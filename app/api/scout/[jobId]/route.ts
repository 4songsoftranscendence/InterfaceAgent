import { NextResponse } from "next/server";
import { getJob } from "@/app/lib/jobs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const job = getJob(jobId);

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: job.id,
    status: job.status,
    progress: job.progress,
    config: job.config,
    result: job.result || null,
    analyses: job.analyses.map((a) => ({
      url: a.url,
      overallScore: a.overallScore,
      strengths: a.strengths,
      weaknesses: a.weaknesses,
    })),
    error: job.error || null,
    createdAt: job.createdAt,
  });
}
