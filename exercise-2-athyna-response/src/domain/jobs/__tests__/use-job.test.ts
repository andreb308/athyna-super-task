import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useJob, findSimilarJobs } from "../use-job"
import * as repo from "../jobs-repository"
import type { AthynaJob } from "../schema"

describe("useJob", () => {
  const dummyJob: AthynaJob = {
    id: "legal-1",
    slug: "legal-specialist",
    title: "Legal Specialist",
    url: "https://develop.api.athyna.com/api/public/jobs/legal-1",
    applicationUrl: "https://example.com/apply/legal-1",
    company: { name: "Anthropic", logoUrl: null, websiteUrl: null },
    location: { city: null, country: null, locality: null, isRemote: true },
    employmentType: "Full-time",
    seniority: "Mid",
    category: "Legal",
    skills: ["AI", "Contracts"],
    overview: "Legal role",
    description: "Full description...",
    publishedAt: "2026-09-24T00:00:00Z",
    matchIndex: 90,
  }

  const poolJob: AthynaJob = {
    ...dummyJob,
    id: "legal-2",
    slug: "senior-legal-specialist",
    title: "Senior Legal Specialist",
    seniority: "Senior",
  }

  beforeEach(() => {
    vi.restoreAllMocks()
    repo.clearJobsCache()
  })

  it("findSimilarJobs matches on category and skills overlap", () => {
    const similar = findSimilarJobs(dummyJob, [dummyJob, poolJob], 3)

    expect(similar.length).toBe(1)
    expect(similar[0].id).toBe("legal-2")
    // Target job itself should never be in similar jobs
    expect(similar.some((j) => j.id === dummyJob.id)).toBe(false)
  })

  it("loads job data dynamically via single API call by id", async () => {
    vi.spyOn(repo, "getJobById").mockResolvedValueOnce({
      job: dummyJob,
      source: "live_api",
    })

    const { result } = renderHook(() => useJob(dummyJob.id))

    await waitFor(() => {
      expect(result.current.job).not.toBeNull()
      expect(result.current.job?.id).toBe(dummyJob.id)
      expect(result.current.isLoading).toBe(false)
    })
  })

  it("handles non-existent job gracefully with error state", async () => {
    vi.spyOn(repo, "getJobById").mockRejectedValueOnce(
      new Error("Job not found: non-existent-id")
    )

    const { result } = renderHook(() => useJob("non-existent-id"))

    await waitFor(() => {
      expect(result.current.error).not.toBeNull()
      expect(result.current.error?.message).toContain("Job not found")
      expect(result.current.isLoading).toBe(false)
    })
  })
})
