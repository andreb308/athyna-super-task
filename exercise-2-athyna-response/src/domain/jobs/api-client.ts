import {
  athynaJobSchema,
  athynaJobsResponseSchema,
  type AthynaJob,
  type AthynaJobsResponse,
  type JobFilterParams,
} from "./schema"

export interface ApiClientConfig {
  baseUrl?: string
  fetchFn?: typeof fetch
}

export class AthynaApiClient {
  private readonly baseUrl: string
  private readonly fetchFn: typeof fetch

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = (config.baseUrl || "https://develop.api.athyna.com").replace(/\/$/, "")
    this.fetchFn = config.fetchFn || (typeof window !== "undefined" ? window.fetch.bind(window) : globalThis.fetch)
  }

  async fetchJobs(params: JobFilterParams = {}): Promise<AthynaJobsResponse> {
    const url = new URL(`${this.baseUrl}/api/public/jobs`)
    const searchParams = url.searchParams

    if (params.q) searchParams.set("q", params.q)
    if (params.remote !== undefined) searchParams.set("remote", String(params.remote))
    if (params.seniority) searchParams.set("seniority", params.seniority)
    if (params.employmentType) searchParams.set("employmentType", params.employmentType)
    if (params.city) searchParams.set("city", params.city)
    if (params.country) searchParams.set("country", params.country)
    if (params.minSalary !== undefined) searchParams.set("minSalary", String(params.minSalary))
    if (params.maxSalary !== undefined) searchParams.set("maxSalary", String(params.maxSalary))
    if (params.salary !== undefined) searchParams.set("salary", String(params.salary))
    if (params.publishedSince) searchParams.set("publishedSince", params.publishedSince)
    if (params.sortBy) searchParams.set("sortBy", params.sortBy)
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder)
    if (params.pageSize !== undefined) searchParams.set("pageSize", String(params.pageSize))
    if (params.pageNumber !== undefined) searchParams.set("pageNumber", String(params.pageNumber))

    if (params.skills) {
      if (Array.isArray(params.skills)) {
        params.skills.forEach((skill) => searchParams.append("skills", skill))
      } else {
        searchParams.set("skills", params.skills)
      }
    }

    const response = await this.fetchFn(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText)
      throw new Error(`API error: ${response.status} - ${errorText}`)
    }

    const json = await response.json()
    // Validate schema with Zod
    return athynaJobsResponseSchema.parse(json)
  }

  async fetchJobById(id: string): Promise<AthynaJob> {
    const url = `${this.baseUrl}/api/public/jobs/${encodeURIComponent(id)}`
    const response = await this.fetchFn(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText)
      throw new Error(`API error: ${response.status} - ${errorText}`)
    }

    const json = await response.json()
    // Validate schema with Zod
    return athynaJobSchema.parse(json)
  }
}

export const defaultApiClient = new AthynaApiClient()
