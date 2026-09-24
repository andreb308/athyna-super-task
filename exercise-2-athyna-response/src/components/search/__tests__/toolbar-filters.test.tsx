import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { ToolbarFilters, TYPE_OPTIONS, LEVEL_OPTIONS, SORT_OPTIONS } from "../toolbar-filters"
import type { FilterChip } from "@/domain/jobs/intent-parser"

describe("ToolbarFilters Component", () => {
  const defaultProps = {
    activeChips: [] as FilterChip[],
    appliedFilters: {},
    sortBy: undefined,
    sortOrder: undefined,
    toggleFilter: vi.fn(),
    removeChip: vi.fn(),
    setSalaryFilter: vi.fn(),
    setLocationFilter: vi.fn(),
    setSort: vi.fn(),
  }

  it("renders all 5 filter buttons: Location, Type, Level, Salary, Relevance", () => {
    render(<ToolbarFilters {...defaultProps} />)

    expect(screen.getByRole("button", { name: /^location$/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /^type$/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /^level$/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /^salary$/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /^relevance$/i })).toBeInTheDocument()
  })

  describe("Type Filter Dropdown (media_1790280879321.png)", () => {
    it("opens dropdown and lists all 7 employment type options", () => {
      render(<ToolbarFilters {...defaultProps} />)

      const typeBtn = screen.getByRole("button", { name: /^type$/i })
      fireEvent.click(typeBtn)

      expect(screen.getByRole("dialog", { name: /employment type filter/i })).toBeInTheDocument()
      for (const opt of TYPE_OPTIONS) {
        expect(screen.getByText(opt.label)).toBeInTheDocument()
      }
    })

    it("toggles employment type filter when clicking an option", () => {
      const toggleFilter = vi.fn()
      render(<ToolbarFilters {...defaultProps} toggleFilter={toggleFilter} />)

      fireEvent.click(screen.getByRole("button", { name: /^type$/i }))
      fireEvent.click(screen.getByText("Full Time"))

      expect(toggleFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "employmentType",
          value: "Full-time",
          label: "Full Time",
        })
      )
    })

    it("removes active chip when clicking already checked option", () => {
      const removeChip = vi.fn()
      const activeChips: FilterChip[] = [
        { id: "employmentType-full-time", type: "employmentType", value: "Full-time", label: "Full Time" },
      ]

      render(<ToolbarFilters {...defaultProps} activeChips={activeChips} removeChip={removeChip} />)

      fireEvent.click(screen.getByRole("button", { name: /type \(1\)/i }))
      fireEvent.click(screen.getByText("Full Time"))

      expect(removeChip).toHaveBeenCalledWith(activeChips[0])
    })
  })

  describe("Level Filter Dropdown (media_1790280888645.png)", () => {
    it("opens dropdown and lists all 4 experience levels", () => {
      render(<ToolbarFilters {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: /^level$/i }))

      expect(screen.getByRole("dialog", { name: /experience level filter/i })).toBeInTheDocument()
      for (const opt of LEVEL_OPTIONS) {
        expect(screen.getByText(opt.label)).toBeInTheDocument()
      }
    })

    it("toggles seniority filter when clicking an option", () => {
      const toggleFilter = vi.fn()
      render(<ToolbarFilters {...defaultProps} toggleFilter={toggleFilter} />)

      fireEvent.click(screen.getByRole("button", { name: /^level$/i }))
      fireEvent.click(screen.getByText("Senior"))

      expect(toggleFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "seniority",
          value: "Senior",
          label: "Senior",
        })
      )
    })
  })

  describe("Salary Filter Dropdown (media_1790280898082.png)", () => {
    it("displays Minimum, Maximum inputs with $USD and a Confirm button", () => {
      render(<ToolbarFilters {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: /^salary$/i }))

      expect(screen.getByRole("dialog", { name: /salary range filter/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/minimum/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/maximum/i)).toBeInTheDocument()
      expect(screen.getAllByText("$USD")).toHaveLength(2)
      expect(screen.getByRole("button", { name: /confirm/i })).toBeInTheDocument()
    })

    it("calls setSalaryFilter with entered values and closes dropdown upon clicking Confirm", () => {
      const setSalaryFilter = vi.fn()
      render(<ToolbarFilters {...defaultProps} setSalaryFilter={setSalaryFilter} />)

      fireEvent.click(screen.getByRole("button", { name: /^salary$/i }))

      const minInput = screen.getByLabelText(/minimum/i)
      const maxInput = screen.getByLabelText(/maximum/i)

      fireEvent.change(minInput, { target: { value: "50000" } })
      fireEvent.change(maxInput, { target: { value: "120000" } })

      fireEvent.click(screen.getByRole("button", { name: /confirm/i }))

      expect(setSalaryFilter).toHaveBeenCalledWith(50000, 120000)
      expect(screen.queryByRole("dialog", { name: /salary range filter/i })).not.toBeInTheDocument()
    })
  })

  describe("Relevance Dropdown (media_1790280905744.png)", () => {
    it("opens menu and renders Most relevant, Newest, Name A-Z", () => {
      render(<ToolbarFilters {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: /^relevance$/i }))

      expect(screen.getByRole("menu", { name: /sort options/i })).toBeInTheDocument()
      for (const opt of SORT_OPTIONS) {
        expect(screen.getByRole("menuitem", { name: opt.label })).toBeInTheDocument()
      }
    })

    it("highlights active sort option and applies sort when option is clicked", () => {
      const setSort = vi.fn()
      render(<ToolbarFilters {...defaultProps} setSort={setSort} />)

      fireEvent.click(screen.getByRole("button", { name: /^relevance$/i }))
      const newestOption = screen.getByRole("menuitem", { name: /newest/i })
      fireEvent.click(newestOption)

      expect(setSort).toHaveBeenCalledWith("publishedAt", "desc")
      expect(screen.queryByRole("menu")).not.toBeInTheDocument()
    })
  })

  describe("Location Filter Dropdown", () => {
    it("toggles remote only and sets city filter", () => {
      const toggleFilter = vi.fn()
      const setLocationFilter = vi.fn()
      render(
        <ToolbarFilters
          {...defaultProps}
          toggleFilter={toggleFilter}
          setLocationFilter={setLocationFilter}
        />
      )

      fireEvent.click(screen.getByRole("button", { name: /^location$/i }))

      // Toggle Remote only
      fireEvent.click(screen.getByText(/remote only/i))
      expect(toggleFilter).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "remote",
          value: "true",
        })
      )

      // Set City
      const cityInput = screen.getByPlaceholderText(/e\.g\. San Francisco/i)
      fireEvent.change(cityInput, { target: { value: "San Francisco" } })
      fireEvent.click(screen.getByRole("button", { name: /apply/i }))

      expect(setLocationFilter).toHaveBeenCalledWith("San Francisco")
      expect(screen.queryByRole("dialog", { name: /location filters/i })).not.toBeInTheDocument()
    })
  })

  describe("Dropdown Dismissal", () => {
    it("closes open dropdown on Escape key", () => {
      render(<ToolbarFilters {...defaultProps} />)

      fireEvent.click(screen.getByRole("button", { name: /^level$/i }))
      expect(screen.getByRole("dialog", { name: /experience level filter/i })).toBeInTheDocument()

      fireEvent.keyDown(document, { key: "Escape" })
      expect(screen.queryByRole("dialog", { name: /experience level filter/i })).not.toBeInTheDocument()
    })
  })
})
