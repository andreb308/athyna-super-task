"use client"

import * as React from "react"
import {
  MapPin,
  Clock,
  TrendingUp,
  Banknote,
  ArrowUpDown,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { FilterChip } from "@/domain/jobs/intent-parser"
import type { JobFilterParams } from "@/domain/jobs/schema"

export interface ToolbarFiltersProps {
  activeChips: FilterChip[]
  appliedFilters: JobFilterParams
  sortBy?: "publishedAt" | "salary" | "title"
  sortOrder?: "asc" | "desc"
  toggleFilter: (chip: FilterChip) => void
  removeChip: (chip: FilterChip) => void
  setSalaryFilter: (min?: number, max?: number) => void
  setLocationFilter: (city?: string) => void
  setSort: (sortBy?: "publishedAt" | "salary" | "title", sortOrder?: "asc" | "desc") => void
  className?: string
}

export const TYPE_OPTIONS = [
  { label: "Contract", value: "Contract" },
  { label: "Internship", value: "Internship" },
  { label: "Temporary", value: "Temporary" },
  { label: "Freelance", value: "Freelance" },
  { label: "Full Time", value: "Full-time" },
  { label: "Part Time", value: "Part-time" },
  { label: "Apprenticeship", value: "Apprenticeship" },
]

export const LEVEL_OPTIONS = [
  { label: "Junior", value: "Junior" },
  { label: "Mid", value: "Mid" },
  { label: "Senior", value: "Senior" },
  { label: "Lead", value: "Lead" },
]

export const SORT_OPTIONS: Array<{
  id: string
  label: string
  sortBy?: "publishedAt" | "salary" | "title"
  sortOrder?: "asc" | "desc"
}> = [
  { id: "relevant", label: "Most relevant", sortBy: undefined, sortOrder: undefined },
  { id: "newest", label: "Newest", sortBy: "publishedAt", sortOrder: "desc" },
  { id: "alpha", label: "Name A-Z", sortBy: "title", sortOrder: "asc" },
]

type DropdownId = "location" | "type" | "level" | "salary" | "relevance" | null

export function ToolbarFilters({
  activeChips,
  sortBy,
  sortOrder,
  toggleFilter,
  removeChip,
  setSalaryFilter,
  setLocationFilter,
  setSort,
  className,
}: ToolbarFiltersProps) {
  const [openDropdown, setOpenDropdown] = React.useState<DropdownId>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Local state for salary inputs
  const [minSalaryInput, setMinSalaryInput] = React.useState<string>("")
  const [maxSalaryInput, setMaxSalaryInput] = React.useState<string>("")

  // Local state for location input
  const [cityInput, setCityInput] = React.useState<string>("")

  // Synchronize salary inputs whenever active salary chip changes
  React.useEffect(() => {
    const salaryChip = activeChips.find((c) => c.type === "salary")
    if (salaryChip) {
      const [minStr, maxStr] = salaryChip.value.split(":")
      setMinSalaryInput(minStr || "")
      setMaxSalaryInput(maxStr || "")
    } else {
      setMinSalaryInput("")
      setMaxSalaryInput("")
    }
  }, [activeChips])

  // Synchronize city input when location chip changes
  React.useEffect(() => {
    const locationChip = activeChips.find((c) => c.type === "location")
    if (locationChip) {
      setCityInput(locationChip.value)
    } else {
      setCityInput("")
    }
  }, [activeChips])

  // Close dropdown on outside click or Escape key
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const toggleDropdown = (id: DropdownId) => {
    setOpenDropdown((prev) => (prev === id ? null : id))
  }

  // Type helper checks
  const isTypeActive = (value: string) => {
    const normalized = value.toLowerCase().replace(/[- ]/g, "")
    return activeChips.some(
      (c) =>
        c.type === "employmentType" &&
        c.value.toLowerCase().replace(/[- ]/g, "") === normalized
    )
  }

  const handleTypeToggle = (item: (typeof TYPE_OPTIONS)[number]) => {
    const activeChip = activeChips.find(
      (c) =>
        c.type === "employmentType" &&
        c.value.toLowerCase().replace(/[- ]/g, "") ===
          item.value.toLowerCase().replace(/[- ]/g, "")
    )
    if (activeChip) {
      removeChip(activeChip)
    } else {
      toggleFilter({
        id: `employmentType-${item.value.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        type: "employmentType",
        value: item.value,
        label: item.label,
      })
    }
  }

  // Level helper checks
  const isLevelActive = (value: string) => {
    return activeChips.some(
      (c) => c.type === "seniority" && c.value.toLowerCase() === value.toLowerCase()
    )
  }

  const handleLevelToggle = (item: (typeof LEVEL_OPTIONS)[number]) => {
    const activeChip = activeChips.find(
      (c) => c.type === "seniority" && c.value.toLowerCase() === item.value.toLowerCase()
    )
    if (activeChip) {
      removeChip(activeChip)
    } else {
      toggleFilter({
        id: `seniority-${item.value.toLowerCase()}`,
        type: "seniority",
        value: item.value,
        label: item.label,
      })
    }
  }

  // Salary confirm handler
  const handleSalaryConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    const min = minSalaryInput.trim() ? Number(minSalaryInput) : undefined
    const max = maxSalaryInput.trim() ? Number(maxSalaryInput) : undefined
    setSalaryFilter(min, max)
    setOpenDropdown(null)
  }

  // Location handlers
  const isRemoteActive = activeChips.some((c) => c.type === "remote")
  const handleRemoteToggle = () => {
    const remoteChip = activeChips.find((c) => c.type === "remote")
    if (remoteChip) {
      removeChip(remoteChip)
    } else {
      toggleFilter({
        id: "remote",
        type: "remote",
        value: "true",
        label: "Remote",
      })
    }
  }

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocationFilter(cityInput)
    setOpenDropdown(null)
  }

  // Summary counts / active states for trigger buttons
  const typeActiveCount = activeChips.filter((c) => c.type === "employmentType").length
  const levelActiveCount = activeChips.filter((c) => c.type === "seniority").length
  const hasSalaryFilter = activeChips.some((c) => c.type === "salary")
  const hasLocationFilter = isRemoteActive || activeChips.some((c) => c.type === "location")
  const activeSortOption =
    SORT_OPTIONS.find(
      (s) => s.sortBy === sortBy && (s.sortOrder || "desc") === (sortOrder || "desc")
    ) || SORT_OPTIONS[0]

  return (
    <div
      ref={containerRef}
      className={cn("flex flex-wrap items-center gap-2 relative", className)}
    >
      {/* 1. Location Button & Dropdown */}
      <div className="relative">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={openDropdown === "location"}
          onClick={() => toggleDropdown("location")}
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer select-none",
            openDropdown === "location"
              ? "bg-neutral-200/80 border-neutral-400 text-neutral-900"
              : hasLocationFilter
              ? "bg-lavender-subtle text-primary border-primary/30 font-semibold"
              : "border-neutral-200/90 bg-white hover:bg-neutral-50 text-neutral-700"
          )}
        >
          <MapPin
            className={cn(
              "size-4",
              hasLocationFilter ? "text-primary" : "text-neutral-500"
            )}
          />
          <span>Location</span>
        </button>

        {openDropdown === "location" && (
          <div
            role="dialog"
            aria-label="Location filters"
            className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-neutral-200/80 w-60 animate-in fade-in zoom-in-95 duration-100"
          >
            <div
              role="checkbox"
              aria-checked={isRemoteActive}
              tabIndex={0}
              onClick={handleRemoteToggle}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault()
                  handleRemoteToggle()
                }
              }}
              className="flex items-center gap-3 py-1 cursor-pointer select-none group"
            >
              <div
                className={cn(
                  "size-5 rounded-md border flex items-center justify-center shrink-0 transition-colors",
                  isRemoteActive
                    ? "bg-[#8b7ff5] border-[#8b7ff5] text-white"
                    : "border-neutral-300 bg-white group-hover:border-neutral-400"
                )}
              >
                {isRemoteActive && <Check className="size-3.5 stroke-[3]" />}
              </div>
              <span className="text-sm font-medium text-neutral-800">Remote only</span>
            </div>

            <form onSubmit={handleLocationSubmit} className="mt-4 pt-3 border-t border-neutral-100">
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                City or Country
              </label>
              <input
                type="text"
                placeholder="e.g. San Francisco"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="w-full border border-neutral-300 rounded-xl px-3 py-1.5 text-xs text-neutral-800 placeholder:text-neutral-400 outline-none focus:border-[#8b7ff5] focus:ring-1 focus:ring-[#8b7ff5]/20"
              />
              <button
                type="submit"
                className="w-full mt-2.5 py-1.5 bg-[#8b7ff5] hover:bg-[#7a6ee3] text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 2. Type Button & Dropdown (media_1790280879321.png) */}
      <div className="relative">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={openDropdown === "type"}
          onClick={() => toggleDropdown("type")}
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer select-none",
            openDropdown === "type"
              ? "bg-neutral-200/80 border-neutral-400 text-neutral-900"
              : typeActiveCount > 0
              ? "bg-lavender-subtle text-primary border-primary/30 font-semibold"
              : "border-neutral-200/90 bg-white hover:bg-neutral-50 text-neutral-700"
          )}
        >
          <Clock
            className={cn(
              "size-4",
              typeActiveCount > 0 ? "text-primary" : "text-neutral-500"
            )}
          />
          <span>Type{typeActiveCount > 0 ? ` (${typeActiveCount})` : ""}</span>
        </button>

        {openDropdown === "type" && (
          <div
            role="dialog"
            aria-label="Employment type filter"
            className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-neutral-200/80 w-56 animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="flex flex-col space-y-3">
              {TYPE_OPTIONS.map((item) => {
                const checked = isTypeActive(item.value)
                return (
                  <div
                    key={item.value}
                    role="checkbox"
                    aria-checked={checked}
                    tabIndex={0}
                    onClick={() => handleTypeToggle(item)}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault()
                        handleTypeToggle(item)
                      }
                    }}
                    className="flex items-center gap-3 cursor-pointer select-none group"
                  >
                    <div
                      className={cn(
                        "size-5 rounded-md border flex items-center justify-center shrink-0 transition-colors",
                        checked
                          ? "bg-[#8b7ff5] border-[#8b7ff5] text-white"
                          : "border-neutral-300 bg-white group-hover:border-neutral-400"
                      )}
                    >
                      {checked && <Check className="size-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-medium text-neutral-800 group-hover:text-black transition-colors">
                      {item.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Level Button & Dropdown (media_1790280888645.png) */}
      <div className="relative">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={openDropdown === "level"}
          onClick={() => toggleDropdown("level")}
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer select-none",
            openDropdown === "level"
              ? "bg-neutral-200/80 border-neutral-400 text-neutral-900"
              : levelActiveCount > 0
              ? "bg-lavender-subtle text-primary border-primary/30 font-semibold"
              : "border-neutral-200/90 bg-white hover:bg-neutral-50 text-neutral-700"
          )}
        >
          <TrendingUp
            className={cn(
              "size-4",
              levelActiveCount > 0 ? "text-primary" : "text-neutral-500"
            )}
          />
          <span>Level{levelActiveCount > 0 ? ` (${levelActiveCount})` : ""}</span>
        </button>

        {openDropdown === "level" && (
          <div
            role="dialog"
            aria-label="Experience level filter"
            className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-neutral-200/80 w-52 animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="flex flex-col space-y-3">
              {LEVEL_OPTIONS.map((item) => {
                const checked = isLevelActive(item.value)
                return (
                  <div
                    key={item.value}
                    role="checkbox"
                    aria-checked={checked}
                    tabIndex={0}
                    onClick={() => handleLevelToggle(item)}
                    onKeyDown={(e) => {
                      if (e.key === " " || e.key === "Enter") {
                        e.preventDefault()
                        handleLevelToggle(item)
                      }
                    }}
                    className="flex items-center gap-3 cursor-pointer select-none group"
                  >
                    <div
                      className={cn(
                        "size-5 rounded-md border flex items-center justify-center shrink-0 transition-colors",
                        checked
                          ? "bg-[#8b7ff5] border-[#8b7ff5] text-white"
                          : "border-neutral-300 bg-white group-hover:border-neutral-400"
                      )}
                    >
                      {checked && <Check className="size-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-sm font-medium text-neutral-800 group-hover:text-black transition-colors">
                      {item.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. Salary Button & Dropdown (media_1790280898082.png) */}
      <div className="relative">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={openDropdown === "salary"}
          onClick={() => toggleDropdown("salary")}
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer select-none",
            openDropdown === "salary"
              ? "bg-neutral-200/80 border-neutral-400 text-neutral-900"
              : hasSalaryFilter
              ? "bg-lavender-subtle text-primary border-primary/30 font-semibold"
              : "border-neutral-200/90 bg-white hover:bg-neutral-50 text-neutral-700"
          )}
        >
          <Banknote
            className={cn(
              "size-4",
              hasSalaryFilter ? "text-primary" : "text-neutral-500"
            )}
          />
          <span>Salary</span>
        </button>

        {openDropdown === "salary" && (
          <div
            role="dialog"
            aria-label="Salary range filter"
            className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl p-4 sm:p-5 shadow-xl border border-neutral-200/80 w-64 animate-in fade-in zoom-in-95 duration-100"
          >
            <form onSubmit={handleSalaryConfirm}>
              <div className="mb-3">
                <label
                  htmlFor="min-salary-input"
                  className="block text-sm font-semibold text-neutral-900 mb-1.5"
                >
                  Minimum
                </label>
                <div className="flex items-center border border-neutral-300 rounded-xl px-3 py-2 bg-white focus-within:border-[#8b7ff5] focus-within:ring-2 focus-within:ring-[#8b7ff5]/20 transition-all">
                  <span className="font-semibold text-xs sm:text-sm text-neutral-900 mr-2 select-none">
                    $USD
                  </span>
                  <span className="text-neutral-300 mr-2 select-none font-light">|</span>
                  <input
                    id="min-salary-input"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="00.00"
                    value={minSalaryInput}
                    onChange={(e) => setMinSalaryInput(e.target.value)}
                    className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-300 outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="max-salary-input"
                  className="block text-sm font-semibold text-neutral-900 mb-1.5"
                >
                  Maximum
                </label>
                <div className="flex items-center border border-neutral-300 rounded-xl px-3 py-2 bg-white focus-within:border-[#8b7ff5] focus-within:ring-2 focus-within:ring-[#8b7ff5]/20 transition-all">
                  <span className="font-semibold text-xs sm:text-sm text-neutral-900 mr-2 select-none">
                    $USD
                  </span>
                  <span className="text-neutral-300 mr-2 select-none font-light">|</span>
                  <input
                    id="max-salary-input"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="00.00"
                    value={maxSalaryInput}
                    onChange={(e) => setMaxSalaryInput(e.target.value)}
                    className="w-full bg-transparent text-sm text-neutral-800 placeholder:text-neutral-300 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#8b7ff5] hover:bg-[#7a6ee3] text-white font-semibold text-sm rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                Confirm
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 5. Relevance Button & Dropdown (media_1790280905744.png) */}
      <div className="relative">
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={openDropdown === "relevance"}
          onClick={() => toggleDropdown("relevance")}
          className={cn(
            "inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors cursor-pointer select-none",
            openDropdown === "relevance"
              ? "bg-neutral-200/80 border-neutral-400 text-neutral-900"
              : sortBy
              ? "bg-lavender-subtle text-primary border-primary/30 font-semibold"
              : "border-neutral-200/90 bg-white hover:bg-neutral-50 text-neutral-700"
          )}
        >
          <ArrowUpDown
            className={cn("size-4", sortBy ? "text-primary" : "text-neutral-500")}
          />
          <span>{sortBy ? activeSortOption.label : "Relevance"}</span>
        </button>

        {openDropdown === "relevance" && (
          <div
            role="menu"
            aria-label="Sort options"
            className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl p-2 shadow-xl border border-neutral-200/80 w-48 flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-100"
          >
            {SORT_OPTIONS.map((opt) => {
              const isSelected =
                (!sortBy && !opt.sortBy) ||
                (sortBy === opt.sortBy && (sortOrder || "desc") === (opt.sortOrder || "desc"))

              return (
                <button
                  key={opt.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setSort(opt.sortBy, opt.sortOrder)
                    setOpenDropdown(null)
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm transition-colors cursor-pointer",
                    isSelected
                      ? "bg-[#8b7ff5] text-white shadow-xs font-medium"
                      : "text-neutral-800 hover:bg-neutral-100 hover:text-black"
                  )}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
