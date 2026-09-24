import { describe, it, expect, vi, beforeEach } from "vitest"
import { AthynaJobsRepository } from "../jobs-repository"
import type { AthynaApiClient } from "../api-client"

describe("AthynaJobsRepository", () => {
  let mockApiClient: {
    fetchJobs: ReturnType<typeof vi.fn>
    fetchJobById: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockApiClient = {
      fetchJobs: vi.fn(),
      fetchJobById: vi.fn(),
    }
  })

  it("returns data from live API when API request succeeds", async () => {
    const liveJobs = [
      {
        id: "live-1",
        slug: "live-1",
        title: "Live API Job",
        url: "https://athyna.com/jobs/live-1",
        applicationUrl: "https://athyna.com/apply/live-1",
        company: { name: "Live Corp", logoUrl: null, websiteUrl: null },
        location: { city: null, country: null, locality: null, isRemote: true },
        employmentType: "Full-time",
        seniority: "Senior",
        skills: ["AI"],
        publishedAt: "2026-01-01T00:00:00Z",
      },
    ]

    mockApiClient.fetchJobs.mockResolvedValueOnce({
      data: liveJobs,
      total: 1,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    })

    const repo = new AthynaJobsRepository({ apiClient: mockApiClient as unknown as AthynaApiClient })
    const result = await repo.getJobs({ q: "Live" })

    expect(result.source).toBe("live_api")
    expect(result.jobs).toHaveLength(1)
    expect(result.jobs[0].title).toBe("Live API Job")
  })

  it("gracefully falls back to offline mock dataset when API fails or is blocked by policy", async () => {
    mockApiClient.fetchJobs.mockRejectedValueOnce(
      new Error("Request to GET /api/public/jobs on develop.api.athyna.com not allowed by policy")
    )

    const repo = new AthynaJobsRepository({ apiClient: mockApiClient as unknown as AthynaApiClient })
    const result = await repo.getJobs({ remote: true })

    expect(result.source).toBe("offline_mock")
    expect(result.jobs.length).toBeGreaterThan(0)
    expect(result.jobs.every((j) => j.location.isRemote)).toBe(true)
  })

  it("fetches single job from live API or falls back to mock", async () => {
    mockApiClient.fetchJobById.mockRejectedValueOnce(new Error("Network offline"))

    const repo = new AthynaJobsRepository({ apiClient: mockApiClient as unknown as AthynaApiClient })
    const result = await repo.getJobById("anthropic-legal")

    expect(result.source).toBe("offline_mock")
    expect(result.job.id).toBe("anthropic-legal")
    expect(result.job.company.name).toBe("Anthropic")
  })

  it("throws not found when job id does not exist in mock fallback", async () => {
    mockApiClient.fetchJobById.mockRejectedValueOnce(new Error("Network offline"))

    const repo = new AthynaJobsRepository({ apiClient: mockApiClient as unknown as AthynaApiClient })
    await expect(repo.getJobById("non-existent-id")).rejects.toThrow(/Job not found/)
  })
})
