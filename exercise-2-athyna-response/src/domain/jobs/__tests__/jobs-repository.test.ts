import { describe, it, expect, vi, beforeEach } from "vitest"
import { getJobs, getJobById, clearJobsCache } from "../jobs-repository"
import * as apiClient from "../api-client"
import { MOCK_ATHYNA_JOBS } from "../mock-dataset"

describe("Functional Jobs Repository", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    clearJobsCache()
  })

  it("returns data from live API when API request succeeds", async () => {
    const liveJobs = [
      {
        ...MOCK_ATHYNA_JOBS[0],
        id: "live-1",
        title: "Live API Job",
      },
    ]

    vi.spyOn(apiClient, "fetchJobs").mockResolvedValueOnce({
      data: liveJobs,
      total: 1,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    })

    const result = await getJobs({ q: "Live" })

    expect(result.source).toBe("live_api")
    expect(result.jobs).toHaveLength(1)
    expect(result.jobs[0].title).toBe("Live API Job")
  })

  it("serves repeated requests from in-memory cache", async () => {
    const liveJobs = [
      {
        ...MOCK_ATHYNA_JOBS[0],
        id: "live-cache-1",
        title: "Cached Job",
      },
    ]

    const spy = vi.spyOn(apiClient, "fetchJobs").mockResolvedValueOnce({
      data: liveJobs,
      total: 1,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    })

    // First call fetches from API
    const res1 = await getJobs({ q: "Cache" })
    expect(res1.source).toBe("live_api")
    expect(spy).toHaveBeenCalledTimes(1)

    // Second call with network down should hit cache
    spy.mockRejectedValueOnce(new Error("Network offline"))
    const res2 = await getJobs({ q: "Cache" })
    expect(res2.source).toBe("cache")
    expect(res2.jobs[0].title).toBe("Cached Job")
  })

  it("gracefully falls back to offline mock dataset when API fails or is blocked by policy", async () => {
    vi.spyOn(apiClient, "fetchJobs").mockRejectedValueOnce(
      new Error("Request to GET /api/public/jobs on develop.api.athyna.com not allowed by policy")
    )

    const result = await getJobs({ remote: true })

    expect(result.source).toBe("offline_mock")
    expect(result.jobs.length).toBeGreaterThan(0)
    expect(result.jobs.every((j) => j.location.isRemote)).toBe(true)
  })

  it("fetches single job from live API or falls back to mock", async () => {
    vi.spyOn(apiClient, "fetchJobById").mockRejectedValueOnce(new Error("Network offline"))

    const result = await getJobById("anthropic-legal")

    expect(result.source).toBe("offline_mock")
    expect(result.job.id).toBe("anthropic-legal")
    expect(result.job.company.name).toBe("Anthropic")
  })

  it("throws not found when job id does not exist in mock fallback", async () => {
    vi.spyOn(apiClient, "fetchJobById").mockRejectedValueOnce(new Error("Network offline"))

    await expect(getJobById("non-existent-id")).rejects.toThrow(/Job not found/)
  })
})
