import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useSearchIntent } from "../use-search-intent"
import type { RelaxationSuggestion } from "../query-engine"

describe("Search Intent Linking & Bugs", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("BUG 1: applyRelaxation should remove skill chip when relaxing 'skills'", () => {
    const { result } = renderHook(() => useSearchIntent())

    act(() => {
      result.current.submitHeroSearch("React")
    })

    expect(result.current.activeChips).toHaveLength(1)
    expect(result.current.activeChips[0].type).toBe("skill")
    expect(result.current.activeChips[0].value).toBe("React")

    const suggestion: RelaxationSuggestion = {
      filterKey: "skills",
      label: "Search without skill requirement (React)",
      relaxedFilters: {},
      potentialCount: 10,
    }

    act(() => {
      result.current.applyRelaxation(suggestion)
    })

    expect(result.current.activeChips).toHaveLength(0)
  })

  it("BUG 2: applyPopularSearch should clear prior chips when applying a query with no intent chips", () => {
    const { result } = renderHook(() => useSearchIntent())

    // First search 'remote' which produces a remote chip
    act(() => {
      result.current.applyPopularSearch("remote")
    })
    expect(result.current.activeChips).toHaveLength(1)
    expect(result.current.activeChips[0].type).toBe("remote")

    // Then click popular search 'Product Manager' which has 0 intent chips
    act(() => {
      result.current.applyPopularSearch("Product Manager")
    })

    // Chips should be cleared, tableFilter should be 'Product Manager'
    expect(result.current.activeChips).toEqual([])
    expect(result.current.tableFilter).toBe("Product Manager")
  })

  it("BUG 3: searching or typing in table filter should link to intent parsing", () => {
    const { result } = renderHook(() => useSearchIntent())

    act(() => {
      result.current.setTableFilter("remote")
    })

    // If linked to intent parsing, appliedFilters should have remote: true and activeChips should have Remote chip
    expect(result.current.appliedFilters.remote).toBe(true)
    expect(result.current.appliedFilters.q).toBe("")
    expect(result.current.activeChips.some((c) => c.type === "remote")).toBe(true)
  })

  it("BUG 4: compound query in table filter parses seniority, remote, and skills", () => {
    const { result } = renderHook(() => useSearchIntent())

    act(() => {
      result.current.setTableFilter("senior remote python")
    })

    expect(result.current.appliedFilters.remote).toBe(true)
    expect(result.current.appliedFilters.seniority).toBe("Senior")
    expect(result.current.appliedFilters.skills).toContain("Python")
    expect(result.current.appliedFilters.q).toBe("")
    expect(result.current.activeChips).toHaveLength(3)
  })

  it("BUG 5: typing free-text keyword leaves it in tableFilter and appliedFilters.q without chips", () => {
    const { result } = renderHook(() => useSearchIntent())

    act(() => {
      result.current.setTableFilter("Mistral")
    })

    expect(result.current.activeChips).toHaveLength(0)
    expect(result.current.appliedFilters.q).toBe("Mistral")
    expect(result.current.tableFilter).toBe("Mistral")
  })
})
