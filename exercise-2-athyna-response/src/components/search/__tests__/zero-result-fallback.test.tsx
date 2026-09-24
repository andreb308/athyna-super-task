import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { ZeroResultFallback } from "../zero-result-fallback"
import type { RelaxationSuggestion } from "@/domain/jobs"

describe("ZeroResultFallback", () => {
  const suggestions: RelaxationSuggestion[] = [
    {
      filterKey: "remote",
      label: "Include on-site and hybrid roles",
      relaxedFilters: { remote: undefined },
      potentialCount: 5,
    },
    {
      filterKey: "skills",
      label: "Search without skill requirement (React)",
      relaxedFilters: { skills: undefined },
      potentialCount: 8,
    },
  ]

  it("renders empty state headline and relaxation suggestions", () => {
    render(
      <ZeroResultFallback
        query="super niche react query"
        suggestions={suggestions}
        onSelectSuggestion={vi.fn()}
        onResetAll={vi.fn()}
      />
    )

    expect(screen.getByRole("heading", { name: /no matching roles found/i })).toBeInTheDocument()
    expect(screen.getByText(/include on-site and hybrid roles/i)).toBeInTheDocument()
    expect(screen.getByText(/\+5 roles/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /reset all filters/i })).toBeInTheDocument()
  })

  it("triggers onSelectSuggestion when candidate clicks a suggestion", () => {
    const handleSelect = vi.fn()
    render(
      <ZeroResultFallback
        query="test query"
        suggestions={suggestions}
        onSelectSuggestion={handleSelect}
        onResetAll={vi.fn()}
      />
    )

    const firstBtn = screen.getByText(/include on-site and hybrid roles/i).closest("button")
    expect(firstBtn).not.toBeNull()
    fireEvent.click(firstBtn!)

    expect(handleSelect).toHaveBeenCalledWith(suggestions[0])
  })

  it("triggers onResetAll when clicking reset button", () => {
    const handleReset = vi.fn()
    render(
      <ZeroResultFallback
        query="test query"
        suggestions={suggestions}
        onSelectSuggestion={vi.fn()}
        onResetAll={handleReset}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: /reset all filters/i }))
    expect(handleReset).toHaveBeenCalledTimes(1)
  })
})
