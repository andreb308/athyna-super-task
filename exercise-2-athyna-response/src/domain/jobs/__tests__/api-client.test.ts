import { describe, it, expect, vi, beforeEach } from "vitest"
import { AthynaApiClient } from "../api-client"

describe("AthynaApiClient", () => {
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    global.fetch = mockFetch
  })

  it("constructs correct query parameters when fetching jobs", async () => {
    const fakeJobs = [
      {
        id: "job-abc",
        title: "Staff Python Engineer",
        applicationUrl: "https://athyna.com/apply/abc",
        company: { name: "Test Co" },
        location: { isRemote: true },
        employmentType: "Full-time",
        seniority: "Staff",
        skills: ["Python"],
        publishedAt: "2026-01-01T00:00:00Z",
      },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => fakeJobs,
    })

    const client = new AthynaApiClient({ baseUrl: "https://test.api.athyna.com" })
    const result = await client.fetchJobs({
      q: "engineer",
      remote: true,
      seniority: "Staff",
      skills: ["Python"],
      pageSize: 20,
    })

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const callUrl = mockFetch.mock.calls[0][0] as string
    expect(callUrl).toContain("https://test.api.athyna.com/api/public/jobs?")
    expect(callUrl).toContain("q=engineer")
    expect(callUrl).toContain("remote=true")
    expect(callUrl).toContain("seniority=Staff")
    expect(callUrl).toContain("skills=Python")
    expect(callUrl).toContain("pageSize=20")

    expect(result.data).toHaveLength(1)
    expect(result.data[0].id).toBe("job-abc")
    expect(result.total).toBe(1)
  })

  it("fetches a single job by id with Zod validation", async () => {
    const singleJob = {
      id: "job-123",
      title: "AI Researcher",
      applicationUrl: "https://athyna.com/apply/123",
      company: { name: "DeepLab" },
      location: { isRemote: true },
      employmentType: "Full-time",
      seniority: "Lead",
      skills: ["AI", "PyTorch"],
      publishedAt: "2026-01-01T00:00:00Z",
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => singleJob,
    })

    const client = new AthynaApiClient({ baseUrl: "https://test.api.athyna.com" })
    const job = await client.fetchJobById("job-123")

    expect(mockFetch).toHaveBeenCalledWith(
      "https://test.api.athyna.com/api/public/jobs/job-123",
      expect.any(Object)
    )
    expect(job.id).toBe("job-123")
    expect(job.title).toBe("AI Researcher")
  })

  it("throws when the API returns a non-200 status", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: "Not Found",
      text: async () => "Job not found",
    })

    const client = new AthynaApiClient()
    await expect(client.fetchJobById("non-existent")).rejects.toThrow(/API error: 404/)
  })

  it("throws validation error when API response fails Zod schema", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ invalid: "payload missing required fields" }),
    })

    const client = new AthynaApiClient()
    await expect(client.fetchJobs()).rejects.toThrow()
  })
})
