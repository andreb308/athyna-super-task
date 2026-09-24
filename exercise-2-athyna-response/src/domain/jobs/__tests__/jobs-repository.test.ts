import { describe, it, expect, vi, beforeEach } from "vitest"
import { getJobs, getJobById, clearJobsCache } from "../jobs-repository"
import * as apiClient from "../api-client"
import type { AthynaJob } from "../schema"

describe("Live Athyna Jobs Repository (No Mock Data)", () => {
  const dummyJob: AthynaJob = {
    id: "live-1",
    slug: "live-job-1",
    title: "Staff AI Engineer",
    url: "https://develop.api.athyna.com/api/public/jobs/live-1",
    applicationUrl: "https://boards.greenhouse.io/job/live-1",
    company: {
      name: "Anthropic",
      logoUrl: null,
      websiteUrl: "https://anthropic.com",
    },
    location: {
      city: "San Francisco",
      country: "United States",
      locality: "California",
      isRemote: true,
    },
    employmentType: "Full-time",
    seniority: "Staff",
    category: "AI",
    salary: {
      min: 220000,
      max: 260000,
      currency: "USD",
      period: "year",
    },
    skills: ["AI", "Python"],
    overview: "Build frontier systems.",
    description: "Join our team...",
    publishedAt: "2026-09-24T00:00:00.000Z",
    updatedAt: "2026-09-24T00:00:00.000Z",
    matchIndex: 98,
  }

  beforeEach(() => {
    vi.restoreAllMocks()
    clearJobsCache()
  })

  it("returns data directly from live API when API request succeeds", async () => {
    vi.spyOn(apiClient, "fetchJobs").mockResolvedValueOnce({
      data: [dummyJob],
      total: 1,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    })

    const result = await getJobs({ q: "Staff" })

    expect(result.source).toBe("live_api")
    expect(result.jobs).toHaveLength(1)
    expect(result.jobs[0].title).toBe("Staff AI Engineer")
  })

  it("serves repeated requests from in-memory cache", async () => {
    const spy = vi.spyOn(apiClient, "fetchJobs").mockResolvedValueOnce({
      data: [dummyJob],
      total: 1,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    })

    // First call fetches from API
    const res1 = await getJobs({ q: "Staff" })
    expect(res1.source).toBe("live_api")
    expect(spy).toHaveBeenCalledTimes(1)

    // Second call serves from cache without hitting network
    const res2 = await getJobs({ q: "Staff" })
    expect(res2.source).toBe("cache")
    expect(res2.jobs[0].id).toBe("live-1")
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it("propagates API errors when live API request fails and no cache exists", async () => {
    vi.spyOn(apiClient, "fetchJobs").mockRejectedValueOnce(
      new Error("API network error")
    )

    await expect(getJobs({ remote: true })).rejects.toThrow("API network error")
  })

  it("fetches single job by id from live API and caches result", async () => {
    const fetchByIdSpy = vi
      .spyOn(apiClient, "fetchJobById")
      .mockResolvedValueOnce(dummyJob)

    const result = await getJobById("live-1")

    expect(result.source).toBe("live_api")
    expect(result.job.id).toBe("live-1")
    expect(fetchByIdSpy).toHaveBeenCalledWith("live-1")

    // Subsequent call should hit cache
    const cachedResult = await getJobById("live-1")
    expect(cachedResult.source).toBe("cache")
    expect(cachedResult.job.id).toBe("live-1")
    expect(fetchByIdSpy).toHaveBeenCalledTimes(1)
  })

  it("propagates 404 error when job id does not exist in live API", async () => {
    vi.spyOn(apiClient, "fetchJobById").mockRejectedValueOnce(
      new Error("Job not found")
    )

    await expect(getJobById("non-existent-id")).rejects.toThrow("Job not found")
  })
})
