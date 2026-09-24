import { AthynaApiClient, defaultApiClient } from "./api-client"
import { MOCK_ATHYNA_JOBS } from "./mock-dataset"
import { filterJobs } from "./query-engine"
import type { AthynaJob, JobFilterParams } from "./schema"

export interface JobsRepositoryConfig {
  apiClient?: AthynaApiClient
  mockJobs?: AthynaJob[]
}

export type JobDataSource = "live_api" | "offline_mock"

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

  constructor(config: JobsRepositoryConfig = {}) {
    this.apiClient = config.apiClient || defaultApiClient
    this.mockJobs = config.mockJobs || MOCK_ATHYNA_JOBS
  }

  async getJobs(params: JobFilterParams = {}): Promise<GetJobsResult> {
    try {
      const response = await this.apiClient.fetchJobs(params)
      return {
        jobs: response.data,
        total: response.total,
        source: "live_api",
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "test") {
        console.warn(
          `[AthynaJobsRepository] Live API unavailable (${(error as Error)?.message || error}). Falling back to offline dataset.`
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
    try {
      const job = await this.apiClient.fetchJobById(id)
      return {
        job,
        source: "live_api",
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "test") {
        console.warn(
          `[AthynaJobsRepository] Live API unavailable for job ${id} (${(error as Error)?.message || error}). Falling back to offline dataset.`
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
