"use client"

import * as React from "react"
import { parseSearchIntent, type FilterChip, type SearchIntent } from "./intent-parser"
import type { JobFilterParams } from "./schema"
import type { RelaxationSuggestion } from "./query-engine"

export interface UseSearchIntentResult {
  searchQuery: string
  tableFilter: string
  activeChips: FilterChip[]
  appliedFilters: JobFilterParams
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  setTableFilter: React.Dispatch<React.SetStateAction<string>>
  submitHeroSearch: (query: string) => SearchIntent
  applyPopularSearch: (term: string) => void
  removeChip: (chip: FilterChip) => void
  clearAllChips: () => void
  toggleFilter: (chip: FilterChip) => void
  applyRelaxation: (suggestion: RelaxationSuggestion) => void
  resetAll: () => void
}

export function useSearchIntent(): UseSearchIntentResult {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [tableFilter, setTableFilterState] = React.useState("")
  const [activeChips, setActiveChips] = React.useState<FilterChip[]>([])

  // Combined filters from active chips and residual table filter
  const appliedFilters = React.useMemo<JobFilterParams>(() => {
    const params: JobFilterParams = {
      q: tableFilter || "",
    }
    for (const chip of activeChips) {
      if (chip.type === "remote") {
        params.remote = true
      } else if (chip.type === "employmentType") {
        params.employmentType = chip.value
      } else if (chip.type === "seniority") {
        params.seniority = chip.value
      } else if (chip.type === "skill") {
        const existing = Array.isArray(params.skills)
          ? params.skills
          : params.skills
          ? [params.skills]
          : []
        if (!existing.includes(chip.value)) {
          params.skills = [...existing, chip.value]
        }
      }
    }
    return params
  }, [tableFilter, activeChips])

  // Linked table filter updater that automatically extracts intent tokens
  const setTableFilter = React.useCallback(
    (action: React.SetStateAction<string>) => {
      setTableFilterState((prev) => {
        const nextValue = typeof action === "function" ? action(prev) : action
        const trimmed = nextValue.trim()
        if (!trimmed) {
          return ""
        }
        const intent = parseSearchIntent(trimmed)
        if (intent.chips.length > 0) {
          setActiveChips((prevChips) => {
            const merged = [...prevChips]
            for (const chip of intent.chips) {
              if (!merged.some((c) => c.id === chip.id)) {
                merged.push(chip)
              }
            }
            return merged
          })
          return intent.q
        }
        return nextValue
      })
    },
    []
  )

  const submitHeroSearch = React.useCallback((query: string): SearchIntent => {
    const trimmed = query.trim()
    if (!trimmed) {
      setActiveChips([])
      setTableFilterState("")
      return { rawQuery: "", q: "", skills: [], chips: [] }
    }
    const intent = parseSearchIntent(trimmed)
    setActiveChips(intent.chips)
    setTableFilterState(intent.q)
    return intent
  }, [])

  const applyPopularSearch = React.useCallback((term: string) => {
    setSearchQuery(term)
    const intent = parseSearchIntent(term)
    setActiveChips(intent.chips)
    setTableFilterState(intent.q || (intent.chips.length === 0 ? term : ""))
  }, [])

  const removeChip = React.useCallback((chip: FilterChip) => {
    setActiveChips((prev) => prev.filter((c) => c.id !== chip.id))
  }, [])

  const clearAllChips = React.useCallback(() => {
    setActiveChips([])
  }, [])

  const toggleFilter = React.useCallback((chip: FilterChip) => {
    setActiveChips((prev) => {
      const exists = prev.some((c) => c.id === chip.id)
      if (exists) {
        return prev.filter((c) => c.id !== chip.id)
      }
      return [...prev, chip]
    })
  }, [])

  const applyRelaxation = React.useCallback((suggestion: RelaxationSuggestion) => {
    if (suggestion.filterKey === "q") {
      setTableFilterState("")
      setSearchQuery("")
    } else {
      const targetType = suggestion.filterKey === "skills" ? "skill" : suggestion.filterKey
      setActiveChips((prev) => prev.filter((c) => c.type !== targetType))
    }
  }, [])

  const resetAll = React.useCallback(() => {
    setSearchQuery("")
    setTableFilterState("")
    setActiveChips([])
  }, [])

  return {
    searchQuery,
    tableFilter,
    activeChips,
    appliedFilters,
    setSearchQuery,
    setTableFilter,
    submitHeroSearch,
    applyPopularSearch,
    removeChip,
    clearAllChips,
    toggleFilter,
    applyRelaxation,
    resetAll,
  }
}
