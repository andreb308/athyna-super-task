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
  applyRelaxation: (suggestion: RelaxationSuggestion) => void
  resetAll: () => void
}

export function useSearchIntent(): UseSearchIntentResult {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [tableFilter, setTableFilter] = React.useState("")
  const [activeChips, setActiveChips] = React.useState<FilterChip[]>([])

  // Combine residual text and promoted intent chips into JobFilterParams
  const appliedFilters = React.useMemo<JobFilterParams>(() => {
    const params: JobFilterParams = {}
    if (tableFilter !== undefined) {
      params.q = tableFilter
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
        params.skills = [...existing, chip.value]
      }
    }
    return params
  }, [tableFilter, activeChips])

  const submitHeroSearch = React.useCallback((query: string): SearchIntent => {
    const trimmed = query.trim()
    if (!trimmed) {
      setActiveChips([])
      setTableFilter("")
      return { rawQuery: "", q: "", skills: [], chips: [] }
    }
    const intent = parseSearchIntent(trimmed)
    setActiveChips(intent.chips)
    setTableFilter(intent.q)
    return intent
  }, [])

  const applyPopularSearch = React.useCallback((term: string) => {
    setSearchQuery(term)
    const intent = parseSearchIntent(term)
    if (intent.chips.length > 0) {
      setActiveChips(intent.chips)
      setTableFilter(intent.q)
    } else {
      setTableFilter(term)
    }
  }, [])

  const removeChip = React.useCallback((chip: FilterChip) => {
    setActiveChips((prev) => prev.filter((c) => c.id !== chip.id))
  }, [])

  const clearAllChips = React.useCallback(() => {
    setActiveChips([])
  }, [])

  const applyRelaxation = React.useCallback((suggestion: RelaxationSuggestion) => {
    if (suggestion.filterKey === "q") {
      setTableFilter("")
      setSearchQuery("")
    } else {
      setActiveChips((prev) => prev.filter((c) => c.type !== suggestion.filterKey))
    }
  }, [])

  const resetAll = React.useCallback(() => {
    setSearchQuery("")
    setTableFilter("")
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
    applyRelaxation,
    resetAll,
  }
}
