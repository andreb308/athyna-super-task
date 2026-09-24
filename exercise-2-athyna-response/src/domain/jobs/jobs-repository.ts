import { AthynaApiClient, defaultApiClient } from "./api-client"
import { MOCK_ATHYNA_JOBS } from "./mock-dataset"
import { filterJobs } from "./query-engine"
import type { AthynaJob, JobFilterParams } from "./schema"

export interface JobsRepositoryConfig {
  apiClient?: AthynaApiClient
  mockJobs?: AthynaJob[]
}

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

export class AthynaJobsRepository {
  private readonly apiClient: AthynaApiClient
  private readonly mockJobs: AthynaJob[]
  private readonly queryCache = new Map<string, { jobs: AthynaJob[]; total: number; timestamp: number }>()
  private readonly jobCache = new Map<string, AthynaJob>()

  constructor(config: JobsRepositoryConfig = {}) {
    this.apiClient = config.apiClient || defaultApiClient
    this.mockJobs = config.mockJobs || MOCK_ATHYNA_JOBS
  }

  private getCacheKey(params: JobFilterParams): string {
    return JSON.stringify(params)
  }

  async getJobs(params: JobFilterParams = {}): Promise<GetJobsResult> {
    const cacheKey = this.getCacheKey(params)

    try {
      const response = await this.apiClient.fetchJobs(params)
      // Cache response for offline / unstable mobile retention
      this.queryCache.set(cacheKey, {
        jobs: response.data,
        total: response.total,
        timestamp: Date.now(),
      })
      response.data.forEach((job) => this.jobCache.set(job.id, job))

      return {
        jobs: response.data,
        total: response.total,
        source: "live_api",
      }
    } catch (error) {
      // 1. Check local in-memory cache first
      const cached = this.queryCache.get(cacheKey)
      if (cached) {
        return {
          jobs: cached.jobs,
          total: cached.total,
          source: "cache",
        }
      }

      // 2. Fall back to resilient mock dataset
      if (process.env.NODE_ENV !== "test") {
        console.warn(
          `[AthynaJobsRepository] Live API unavailable (${(error as Error)?.message || error}). Falling back to local dataset.`
        )
      }

      const filtered = filterJobs(this.mockJobs, params)
      return {
        jobs: filtered,
        total: filtered.length,
        source: "offline_mock",
      }
    }
  }

  async getJobById(id: string): Promise<GetJobByIdResult> {
    // 1. Check local cache
    const cached = this.jobCache.get(id)
    if (cached) {
      return {
        job: cached,
        source: "cache",
      }
    }

    try {
      const job = await this.apiClient.fetchJobById(id)
      this.jobCache.set(id, job)
      return {
        job,
        source: "live_api",
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "test") {
        console.warn(
          `[AthynaJobsRepository] Live API unavailable for job ${id} (${(error as Error)?.message || error}). Falling back to local dataset.`
        )
      }

      const matched = this.mockJobs.find((j) => j.id === id || j.slug === id)
      if (!matched) {
        throw new Error(`Job not found: ${id}`)
      }

      return {
        job: matched,
        source: "offline_mock",
      }
    }
  }
}

export const defaultJobsRepository = new AthynaJobsRepository()
