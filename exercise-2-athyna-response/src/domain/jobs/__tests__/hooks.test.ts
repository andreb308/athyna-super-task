import { renderHook, act } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { useSearchIntent } from "../use-search-intent"
import { useJobs } from "../use-jobs"

describe("Domain React Hooks", () => {
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
    it("returns jobs initialized with mock dataset and supports filtering", () => {
      const { result } = renderHook(() => useJobs({ filters: { remote: true } }))

      expect(result.current.jobs.length).toBeGreaterThan(0)
      expect(result.current.jobs.every((j) => j.location.isRemote)).toBe(true)
    })
  })
})
