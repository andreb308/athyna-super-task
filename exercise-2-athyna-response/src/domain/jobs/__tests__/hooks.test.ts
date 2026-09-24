import { renderHook, act, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { useSearchIntent } from "../use-search-intent"
import { useJobs } from "../use-jobs"
import * as repo from "../jobs-repository"
import type { AthynaJob } from "../schema"

describe("Domain React Hooks", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    repo.clearJobsCache()
  })

  describe("useSearchIntent", () => {
    it("submits hero search and extracts intent chips", () => {
      const { result } = renderHook(() => useSearchIntent())

      act(() => {
        result.current.submitHeroSearch("senior remote python")
      })

      expect(result.current.activeChips).toHaveLength(3)
      expect(result.current.appliedFilters.remote).toBe(true)
      expect(result.current.appliedFilters.seniority).toBe("Senior")
      expect(result.current.appliedFilters.skills).toContain("Python")
      expect(result.current.appliedFilters.q).toBe("")
    })

    it("allows dismissing an individual filter chip", () => {
      const { result } = renderHook(() => useSearchIntent())

      act(() => {
        result.current.submitHeroSearch("remote react")
      })
      expect(result.current.activeChips).toHaveLength(2)

      const remoteChip = result.current.activeChips.find((c) => c.type === "remote")!
      act(() => {
        result.current.removeChip(remoteChip)
      })

      expect(result.current.activeChips).toHaveLength(1)
      expect(result.current.appliedFilters.remote).toBeUndefined()
      expect(result.current.appliedFilters.skills).toContain("React")
    })

    it("applies relaxation suggestion and resets filters", () => {
      const { result } = renderHook(() => useSearchIntent())

      act(() => {
        result.current.submitHeroSearch("senior remote")
      })

      act(() => {
        result.current.applyRelaxation({
          filterKey: "seniority",
          label: "Relax senior",
          relaxedFilters: {},
          potentialCount: 5,
        })
      })

      expect(result.current.appliedFilters.seniority).toBeUndefined()
      expect(result.current.appliedFilters.remote).toBe(true)

      act(() => {
        result.current.resetAll()
      })

      expect(result.current.activeChips).toHaveLength(0)
      expect(result.current.searchQuery).toBe("")
      expect(result.current.tableFilter).toBe("")
    })
  })

  describe("useJobs", () => {
    it("fetches and returns jobs via a single API call from repository", async () => {
      const sampleJobs: AthynaJob[] = [
        {
          id: "j-1",
          slug: "remote-ai-engineer",
          title: "Remote AI Engineer",
          url: "https://develop.api.athyna.com/api/public/jobs/j-1",
          applicationUrl: "https://athyna.com/apply/j-1",
          company: { name: "Athyna Partner", logoUrl: null, websiteUrl: null },
          location: { city: null, country: null, locality: null, isRemote: true },
          employmentType: "Full-time",
          seniority: "Senior",
          category: "Engineering",
          skills: ["AI", "React"],
          overview: "Work on AI systems.",
          description: "Full description...",
          publishedAt: "2026-09-24T00:00:00Z",
          matchIndex: 95,
        },
      ]

      vi.spyOn(repo, "getJobs").mockResolvedValueOnce({
        jobs: sampleJobs,
        total: 1,
        source: "live_api",
      })

      const { result } = renderHook(() => useJobs({ filters: { remote: true } }))

      await waitFor(() => {
        expect(result.current.jobs).toHaveLength(1)
        expect(result.current.jobs[0].title).toBe("Remote AI Engineer")
        expect(result.current.source).toBe("live_api")
        expect(result.current.isLoading).toBe(false)
      })
    })
  })
})
