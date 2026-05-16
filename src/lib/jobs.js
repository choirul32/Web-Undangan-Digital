import { logApiError } from "./api-logger";

export const jobTypes = {
  MEDIA_PROCESSING: "media.processing",
  THUMBNAIL_GENERATE: "thumbnail.generate",
  AUDIT_EXPORT: "audit.export",
  BILLING_WEBHOOK: "billing.webhook",
};

export async function enqueueJob(supabase, job) {
  const payload = {
    type: job.type,
    status: "queued",
    priority: job.priority || 5,
    payload: job.payload || {},
    run_after: job.runAfter || new Date().toISOString(),
    attempts: 0,
  };

  try {
    const { data, error } = await supabase
      .from("jobs")
      .insert(payload)
      .select()
      .single();

    if (error) {
      logApiError("jobs.enqueue", error, { type: job.type });
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    logApiError("jobs.enqueue.unhandled", error, { type: job.type });
    return { data: null, error };
  }
}

export function shouldRunJob(job) {
  if (!job || job.status !== "queued") {
    return false;
  }

  return new Date(job.run_after || 0).getTime() <= Date.now();
}
