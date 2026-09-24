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
  sortBy?: "publishedAt" | "salary" | "title"
  sortOrder?: "asc" | "desc"
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  setTableFilter: React.Dispatch<React.SetStateAction<string>>
  submitHeroSearch: (query: string) => SearchIntent
  applyPopularSearch: (term: string) => void
  removeChip: (chip: FilterChip) => void
  clearAllChips: () => void
  toggleFilter: (chip: FilterChip) => void
  setSalaryFilter: (min?: number, max?: number) => void
  setLocationFilter: (city?: string) => void
  setSort: (sortBy?: "publishedAt" | "salary" | "title", sortOrder?: "asc" | "desc") => void
  applyRelaxation: (suggestion: RelaxationSuggestion) => void
  resetAll: () => void
}

export function useSearchIntent(): UseSearchIntentResult {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [tableFilter, setTableFilterState] = React.useState("")
  const [activeChips, setActiveChips] = React.useState<FilterChip[]>([])
  const [sortBy, setSortBy] = React.useState<"publishedAt" | "salary" | "title" | undefined>(undefined)
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc" | undefined>(undefined)

  // Combined filters from active chips and residual table filter
  const appliedFilters = React.useMemo<JobFilterParams>(() => {
    const params: JobFilterParams = {
      q: tableFilter || "",
    }
    const empTypes: string[] = []
    const seniorities: string[] = []
    const skills: string[] = []

    for (const chip of activeChips) {
      if (chip.type === "remote") {
        params.remote = true
      } else if (chip.type === "employmentType") {
        if (!empTypes.includes(chip.value)) {
          empTypes.push(chip.value)
        }
      } else if (chip.type === "seniority") {
        if (!seniorities.includes(chip.value)) {
          seniorities.push(chip.value)
        }
      } else if (chip.type === "skill") {
        if (!skills.includes(chip.value)) {
          skills.push(chip.value)
        }
      } else if (chip.type === "salary") {
        const [minStr, maxStr] = chip.value.split(":")
        if (minStr) params.minSalary = Number(minStr)
        if (maxStr) params.maxSalary = Number(maxStr)
      } else if (chip.type === "location") {
        params.city = chip.value
      }
    }

    if (empTypes.length === 1) {
      params.employmentType = empTypes[0]
    } else if (empTypes.length > 1) {
      params.employmentType = empTypes
    }

    if (seniorities.length === 1) {
      params.seniority = seniorities[0]
    } else if (seniorities.length > 1) {
      params.seniority = seniorities
    }

    if (skills.length > 0) {
      params.skills = skills
    }

    if (sortBy) params.sortBy = sortBy
    if (sortOrder) params.sortOrder = sortOrder

    return params
  }, [tableFilter, activeChips, sortBy, sortOrder])

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

  const setSalaryFilter = React.useCallback((min?: number, max?: number) => {
    setActiveChips((prev) => {
      const filtered = prev.filter((c) => c.type !== "salary")
      if ((min === undefined || isNaN(min)) && (max === undefined || isNaN(max))) {
        return filtered
      }
      let label = ""
      if (min !== undefined && !isNaN(min) && max !== undefined && !isNaN(max)) {
        label = `$USD ${min.toLocaleString()} - $USD ${max.toLocaleString()}`
      } else if (min !== undefined && !isNaN(min)) {
        label = `Min: $USD ${min.toLocaleString()}`
      } else if (max !== undefined && !isNaN(max)) {
        label = `Max: $USD ${max.toLocaleString()}`
      }

      return [
        ...filtered,
        {
          id: "salary-filter",
          type: "salary" as const,
          value: `${min !== undefined && !isNaN(min) ? min : ""}:${max !== undefined && !isNaN(max) ? max : ""}`,
          label,
        },
      ]
    })
  }, [])

  const setLocationFilter = React.useCallback((city?: string) => {
    setActiveChips((prev) => {
      const filtered = prev.filter((c) => c.type !== "location")
      if (!city || !city.trim()) {
        return filtered
      }
      const trimmed = city.trim()
      return [
        ...filtered,
        {
          id: `location-${trimmed.toLowerCase()}`,
          type: "location" as const,
          value: trimmed,
          label: `Location: ${trimmed}`,
        },
      ]
    })
  }, [])

  const setSort = React.useCallback(
    (newSortBy?: "publishedAt" | "salary" | "title", newSortOrder?: "asc" | "desc") => {
      setSortBy(newSortBy)
      setSortOrder(newSortOrder)
    },
    []
  )

  const resetAll = React.useCallback(() => {
    setSearchQuery("")
    setTableFilterState("")
    setActiveChips([])
    setSortBy(undefined)
    setSortOrder(undefined)
  }, [])

  return {
    searchQuery,
    tableFilter,
    activeChips,
    appliedFilters,
    sortBy,
    sortOrder,
    setSearchQuery,
    setTableFilter,
    submitHeroSearch,
    applyPopularSearch,
    removeChip,
    clearAllChips,
    toggleFilter,
    setSalaryFilter,
    setLocationFilter,
    setSort,
    applyRelaxation,
    resetAll,
  }
}
