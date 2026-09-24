import { fetchJobs, fetchJobById } from "./api-client"
import type { AthynaJob, JobFilterParams } from "./schema"

export type JobDataSource = "live_api" | "cache"

export interface GetJobsResult {
  jobs: AthynaJob[]
  total: number
  source: JobDataSource
}

export interface GetJobByIdResult {
  job: AthynaJob
  source: JobDataSource
}

const queryCache = new Map<string, { jobs: AthynaJob[]; total: number }>()
const jobCache = new Map<string, AthynaJob>()

export function clearJobsCache(): void {
  queryCache.clear()
  jobCache.clear()
}

/**
 * Fetches jobs directly from the Athyna Public Jobs API (/api/public/jobs).
 * Caches results in memory for sub-millisecond query performance.
 */
export async function getJobs(
  params: JobFilterParams = {}
): Promise<GetJobsResult> {
  const cacheKey = JSON.stringify(params)

  const cached = queryCache.get(cacheKey)
  if (cached) {
    return {
      jobs: cached.jobs,
      total: cached.total,
      source: "cache",
    }
  }

  const response = await fetchJobs(params)
  queryCache.set(cacheKey, {
    jobs: response.data,
    total: response.total,
  })
  response.data.forEach((job) => jobCache.set(job.id, job))

  return {
    jobs: response.data,
    total: response.total,
    source: "live_api",
  }
}

/**
 * Fetches a single job directly from the Athyna Public Jobs API (/api/public/jobs/{id}).
 * Checks in-memory cache first before making the live HTTP request.
 */
export async function getJobById(
  id: string
): Promise<GetJobByIdResult> {
  const cached = jobCache.get(id)
  if (cached) {
    return {
      job: cached,
      source: "cache",
    }
  }

  const job = await fetchJobById(id)
  jobCache.set(id, job)
  if (job.slug) {
    jobCache.set(job.slug, job)
  }
  return {
    job,
    source: "live_api",
  }
}
