import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { PromotedFilterChips } from "../promoted-filter-chips"
import type { FilterChip } from "@/domain/jobs"

describe("PromotedFilterChips", () => {
  const chips: FilterChip[] = [
    { id: "remote", type: "remote", value: "true", label: "Remote" },
    { id: "skill-react", type: "skill", value: "React", label: "Skill: React" },
  ]

  it("renders all promoted filter chips", () => {
    render(<PromotedFilterChips chips={chips} onRemoveChip={vi.fn()} onClearAll={vi.fn()} />)
    expect(screen.getByText("Remote")).toBeInTheDocument()
    expect(screen.getByText("Skill: React")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /clear all/i })).toBeInTheDocument()
  })

  it("calls onRemoveChip when clicking a chip dismiss button", () => {
    const handleRemove = vi.fn()
    render(<PromotedFilterChips chips={chips} onRemoveChip={handleRemove} onClearAll={vi.fn()} />)

    const removeRemoteBtn = screen.getByRole("button", { name: /remove filter remote/i })
    fireEvent.click(removeRemoteBtn)

    expect(handleRemove).toHaveBeenCalledWith(chips[0])
  })

  it("calls onClearAll when clicking clear all", () => {
    const handleClear = vi.fn()
    render(<PromotedFilterChips chips={chips} onRemoveChip={vi.fn()} onClearAll={handleClear} />)

    fireEvent.click(screen.getByRole("button", { name: /clear all/i }))
    expect(handleClear).toHaveBeenCalledTimes(1)
  })

  it("renders nothing when chips array is empty", () => {
    const { container } = render(
      <PromotedFilterChips chips={[]} onRemoveChip={vi.fn()} onClearAll={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })
})
