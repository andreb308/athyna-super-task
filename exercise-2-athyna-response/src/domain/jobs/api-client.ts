import axios, { type AxiosInstance } from "axios"
import {
  athynaJobSchema,
  athynaJobsResponseSchema,
  type AthynaJob,
  type AthynaJobsResponse,
  type JobFilterParams,
} from "./schema"

export const DEFAULT_ATHYNA_API_BASE_URL = "https://develop.api.athyna.com"

export function createJobsApiClient(baseURL: string = DEFAULT_ATHYNA_API_BASE_URL): AxiosInstance {
  return axios.create({
    baseURL: baseURL.replace(/\/$/, ""),
    headers: {
      Accept: "application/json",
    },
    timeout: 8000,
  })
}

export const defaultApiClient: AxiosInstance = createJobsApiClient()

export async function fetchJobs(
  params: JobFilterParams = {},
  client: AxiosInstance = defaultApiClient
): Promise<AthynaJobsResponse> {
  const queryParams: Record<string, unknown> = {}

  if (params.q) queryParams.q = params.q
  if (params.seniority) {
    queryParams.seniority = Array.isArray(params.seniority) ? params.seniority.join(",") : params.seniority
  }
  if (params.employmentType) {
    queryParams.employmentType = Array.isArray(params.employmentType) ? params.employmentType.join(",") : params.employmentType
  }
  if (params.city) queryParams.city = params.city
  if (params.country) queryParams.country = params.country
  if (params.remote !== undefined) queryParams.remote = params.remote
  if (params.salary !== undefined) queryParams.salary = params.salary
  if (params.minSalary !== undefined) queryParams.minSalary = params.minSalary
  if (params.maxSalary !== undefined) queryParams.maxSalary = params.maxSalary
  if (params.publishedSince) queryParams.publishedSince = params.publishedSince
  if (params.sortBy) queryParams.sortBy = params.sortBy
  if (params.sortOrder) queryParams.sortOrder = params.sortOrder
  if (params.pageSize !== undefined) queryParams.pageSize = params.pageSize
  if (params.pageNumber !== undefined) queryParams.pageNumber = params.pageNumber

  if (params.skills) {
    queryParams.skills = Array.isArray(params.skills) ? params.skills.join(",") : params.skills
  }

  const response = await client.get("/api/public/jobs", { params: queryParams })
  return athynaJobsResponseSchema.parse(response.data)
}

export async function fetchJobById(
  id: string,
  client: AxiosInstance = defaultApiClient
): Promise<AthynaJob> {
  const response = await client.get(`/api/public/jobs/${encodeURIComponent(id)}`)
  return athynaJobSchema.parse(response.data)
}
