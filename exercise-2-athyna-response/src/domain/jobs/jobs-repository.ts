import { fetchJobs, fetchJobById } from "./api-client"
import { MOCK_ATHYNA_JOBS } from "./mock-dataset"
import { filterJobs } from "./query-engine"
import type { AthynaJob, JobFilterParams } from "./schema"

export type JobDataSource = "live_api" | "cache" | "offline_mock"

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

export async function getJobs(
  params: JobFilterParams = {},
  mockJobs: AthynaJob[] = MOCK_ATHYNA_JOBS
): Promise<GetJobsResult> {
  const cacheKey = JSON.stringify(params)

  try {
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
  } catch (err) {
    const cached = queryCache.get(cacheKey)
    if (cached) {
      return {
        jobs: cached.jobs,
        total: cached.total,
        source: "cache",
      }
    }

    if (process.env.NODE_ENV !== "test") {
      console.warn(
        `[JobsRepository] Live API unavailable (${(err as Error)?.message || err}). Falling back to local dataset.`
      )
    }

    const filtered = filterJobs(mockJobs, params)
    return {
      jobs: filtered,
      total: filtered.length,
      source: "offline_mock",
    }
  }
}

export async function getJobById(
  id: string,
  mockJobs: AthynaJob[] = MOCK_ATHYNA_JOBS
): Promise<GetJobByIdResult> {
  const cached = jobCache.get(id)
  if (cached) {
    return {
      job: cached,
      source: "cache",
    }
  }

  try {
    const job = await fetchJobById(id)
    jobCache.set(id, job)
    return {
      job,
      source: "live_api",
    }
  } catch (err) {
    if (process.env.NODE_ENV !== "test") {
      console.warn(
        `[JobsRepository] Live API unavailable for job ${id} (${(err as Error)?.message || err}). Falling back to local dataset.`
      )
    }

    const matched = mockJobs.find((j) => j.id === id || j.slug === id)
    if (!matched) {
      throw new Error(`Job not found: ${id}`)
    }

    return {
      job: matched,
      source: "offline_mock",
    }
  }
}
