// ============================================
// In-memory job manager for scout pipeline runs
// ============================================

import type { DesignBrief, UIAnalysis } from "@/src/types/index";

export interface JobProgress {
  currentStep: string;
  sitesTotal: number;
  sitesCrawled: number;
  sitesAnalyzed: number;
  briefGenerated: boolean;
}

export interface Job {
  id: string;
  status: "pending" | "crawling" | "analyzing" | "generating" | "complete" | "error";
  config: { urls: string[]; category: string; goal: string };
  progress: JobProgress;
  analyses: UIAnalysis[];
  result?: DesignBrief;
  error?: string;
  createdAt: Date;
}

const jobs = new Map<string, Job>();

// Listeners for SSE: jobId -> Set of callbacks
const listeners = new Map<string, Set<(job: Job) => void>>();

export function createJob(config: Job["config"]): Job {
  const id = crypto.randomUUID();
  const job: Job = {
    id,
    status: "pending",
    config,
    progress: {
      currentStep: "Starting...",
      sitesTotal: config.urls.length,
      sitesCrawled: 0,
      sitesAnalyzed: 0,
      briefGenerated: false,
    },
    analyses: [],
    createdAt: new Date(),
  };
  jobs.set(id, job);
  return job;
}

export function getJob(id: string): Job | undefined {
  return jobs.get(id);
}

export function updateJob(id: string, updates: Partial<Job>): void {
  const job = jobs.get(id);
  if (!job) return;
  Object.assign(job, updates);
  // Notify all SSE listeners
  const jobListeners = listeners.get(id);
  if (jobListeners) {
    for (const cb of jobListeners) {
      cb(job);
    }
  }
}

export function subscribe(jobId: string, callback: (job: Job) => void): () => void {
  if (!listeners.has(jobId)) {
    listeners.set(jobId, new Set());
  }
  listeners.get(jobId)!.add(callback);

  // Return unsubscribe function
  return () => {
    listeners.get(jobId)?.delete(callback);
    if (listeners.get(jobId)?.size === 0) {
      listeners.delete(jobId);
    }
  };
}

// Clean up jobs older than 1 hour
setInterval(() => {
  const cutoff = Date.now() - 60 * 60 * 1000;
  for (const [id, job] of jobs) {
    if (job.createdAt.getTime() < cutoff) {
      jobs.delete(id);
      listeners.delete(id);
    }
  }
}, 5 * 60 * 1000);
