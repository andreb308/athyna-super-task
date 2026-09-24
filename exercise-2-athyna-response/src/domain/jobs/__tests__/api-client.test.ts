import { describe, it, expect, vi } from "vitest"
import type { AxiosInstance } from "axios"
import { fetchJobs, fetchJobById, createJobsApiClient } from "../api-client"

describe("Functional Jobs API Client", () => {
  it("initializes an Axios client with base URL and timeout", () => {
    const client = createJobsApiClient("https://custom.api.athyna.com")
    expect(client.defaults.baseURL).toBe("https://custom.api.athyna.com")
    expect(client.defaults.timeout).toBe(8000)
  })

  it("fetches jobs passing serialized query params and validates response schema", async () => {
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

    const mockGet = vi.fn().mockResolvedValueOnce({
      data: fakeJobs,
      status: 200,
    })

    const mockClient = { get: mockGet } as unknown as AxiosInstance

    const result = await fetchJobs(
      {
        q: "engineer",
        remote: true,
        seniority: "Staff",
        skills: ["Python", "AI"],
        pageSize: 20,
      },
      mockClient
    )

    expect(mockGet).toHaveBeenCalledWith("/api/public/jobs", {
      params: {
        q: "engineer",
        remote: true,
        seniority: "Staff",
        skills: "Python,AI",
        pageSize: 20,
      },
    })
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

    const mockGet = vi.fn().mockResolvedValueOnce({
      data: singleJob,
      status: 200,
    })

    const mockClient = { get: mockGet } as unknown as AxiosInstance
    const job = await fetchJobById("job-123", mockClient)

    expect(mockGet).toHaveBeenCalledWith("/api/public/jobs/job-123")
    expect(job.id).toBe("job-123")
    expect(job.title).toBe("AI Researcher")
  })

  it("throws validation error when API returns malformed payload", async () => {
    const mockGet = vi.fn().mockResolvedValueOnce({
      data: { invalid: "missing required fields" },
      status: 200,
    })

    const mockClient = { get: mockGet } as unknown as AxiosInstance
    await expect(fetchJobs({}, mockClient)).rejects.toThrow()
  })
})
