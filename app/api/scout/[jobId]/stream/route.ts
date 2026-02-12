import { getJob, subscribe } from "@/app/lib/jobs";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const job = getJob(jobId);

  if (!job) {
    return new Response("Job not found", { status: 404 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send current state immediately
      const data = JSON.stringify({
        status: job.status,
        progress: job.progress,
        error: job.error || null,
      });
      controller.enqueue(encoder.encode(`data: ${data}\n\n`));

      // If already done, close
      if (job.status === "complete" || job.status === "error") {
        controller.close();
        return;
      }

      // Subscribe to updates
      const unsubscribe = subscribe(jobId, (updatedJob) => {
        const update = JSON.stringify({
          status: updatedJob.status,
          progress: updatedJob.progress,
          error: updatedJob.error || null,
        });
        try {
          controller.enqueue(encoder.encode(`data: ${update}\n\n`));
        } catch {
          // Stream was closed by client
          unsubscribe();
        }

        if (updatedJob.status === "complete" || updatedJob.status === "error") {
          unsubscribe();
          try {
            controller.close();
          } catch {
            // Already closed
          }
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
