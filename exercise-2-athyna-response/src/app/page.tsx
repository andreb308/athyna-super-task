"use client"

import * as React from "react"
import Link from "next/link"
import {
  Search,
  ArrowRight,
  MapPin,
  Clock,
  TrendingUp,
  DollarSign,
  ArrowUpDown,
  ChevronDown,
  Lock,
  Unlock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { PastelPixelCluster } from "@/components/retro/pastel-pixel-cluster"
import { PixelCursorMotif } from "@/components/retro/pixel-cursor-motif"
import { RetroMascot } from "@/components/retro/retro-mascot"
import {
  useJobs,
  useSearchIntent,
  getRelaxationSuggestions,
  type AthynaJob,
} from "@/domain/jobs"
import { PromotedFilterChips } from "@/components/search/promoted-filter-chips"
import { ZeroResultFallback } from "@/components/search/zero-result-fallback"
import { cn } from "@/lib/utils"

const POPULAR_SEARCHES = [
  "AI Engineer",
  "ML",
  "Data Scientist",
  "Data Engineer",
  "Prompt Engineering",
  "NLP",
  "Gen AI",
  "Deep Learning",
  "Software Engineer",
  "DevOps",
  "QA",
  "Product Manager",
]

const TOOLBAR_FILTERS = [
  { id: "location", label: "Location", icon: MapPin },
  { id: "type", label: "Type", icon: Clock },
  { id: "level", label: "Level", icon: TrendingUp },
  { id: "salary", label: "Salary", icon: DollarSign },
  { id: "relevance", label: "Relevance", icon: ArrowUpDown },
]

function formatSalary(salary: AthynaJob["salary"]): string {
  if (!salary || (!salary.min && !salary.max)) return "Competitive"
  const currencySymbol =
    salary.currency === "EUR" ? "€" : salary.currency === "GBP" ? "£" : "$"
  const period =
    salary.period === "hour" ? "/hr" : salary.period === "month" ? "/mo" : "/yr"

  if (salary.min && salary.max && salary.min !== salary.max) {
    return `${currencySymbol}${salary.min.toLocaleString()} - ${currencySymbol}${salary.max.toLocaleString()}${period}`
  }
  const amount = salary.min || salary.max
  return `${currencySymbol}${amount?.toLocaleString()}${period}`
}

function formatLocation(loc: AthynaJob["location"]): string {
  const parts = [loc.city, loc.country].filter(Boolean)
  if (loc.isRemote) {
    return parts.length > 0 ? `${parts.join(", ")} (Remote)` : "Remote"
  }
  return parts.length > 0 ? parts.join(", ") : "Location not specified"
}

export default function Home() {
  const {
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
  } = useSearchIntent()

  const {
    jobs: filteredJobs,
    allJobs,
    isLoading,
    error,
    refetch,
  } = useJobs({ filters: appliedFilters })

  // Contextual fallback suggestions when search yields 0 results
  const relaxationSuggestions = React.useMemo(() => {
    if (filteredJobs.length > 0) return []
    return getRelaxationSuggestions(allJobs, appliedFilters)
  }, [allJobs, appliedFilters, filteredJobs.length])

  const [tableSearchInput, setTableSearchInput] = React.useState(tableFilter)

  React.useEffect(() => {
    setTableSearchInput(tableFilter)
  }, [tableFilter])

  const handleTableSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setTableFilter(tableSearchInput)
  }

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitHeroSearch(searchQuery)
    document.getElementById("browse-roles")?.scrollIntoView?.({ behavior: "smooth" })
  }

  const handlePopularSearch = (term: string) => {
    applyPopularSearch(term)
    document.getElementById("browse-roles")?.scrollIntoView?.({ behavior: "smooth" })
  }

  const handleApplyClick = (job: AthynaJob) => {
    if (typeof window !== "undefined" && job.applicationUrl) {
      window.open(job.applicationUrl, "_blank", "noopener,noreferrer")
    }
  }

  return (
    <div className="w-full bg-surface">
      {/* Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-16 flex flex-col items-center text-center overflow-hidden">
        {/* Ambient Lavender Halo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-primary-fixed/30 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Left Pastel Pixel Cluster Motif */}
        <div
          className="hidden md:block absolute left-4 lg:left-12 top-6 pointer-events-none select-none animate-bounce"
          style={{ animationDuration: "4s" }}
        >
          <PastelPixelCluster />
        </div>

        {/* Right 8-bit Pixel Cursor Motif */}
        <div className="hidden md:block absolute right-4 lg:right-12 top-14 pointer-events-none select-none hover:rotate-6 transition-transform">
          <PixelCursorMotif />
        </div>

        {/* Main Headline with dual-tone AI mark */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-on-surface tracking-tight mb-4 flex items-center justify-center flex-wrap gap-x-3.5">
          <span>Be the future of</span>
          <span className="font-serif italic font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary via-violet-accent to-primary-container drop-shadow-sm select-none">
            AI
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-on-surface font-semibold max-w-2xl leading-snug">
          Find your new opportunity to grow in the hottest field in the world.
        </p>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mt-1">
          Thousands of jobs in AI at your fingertips with Athyna.
        </p>

        {/* Subtitle link */}
        <Link
          href="#browse-roles"
          className="inline-flex items-center gap-1.5 mt-4 text-primary hover:text-primary-container font-mono text-xs sm:text-sm font-semibold transition-colors group"
        >
          <span>Browse 35,000+ fully remote jobs from trusted companies and land more interviews.</span>
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Center Search Bar */}
        <form onSubmit={handleHeroSubmit} className="w-full max-w-3xl mt-8 relative">
          <div className="bg-surface-container-lowest rounded-full p-2 pl-6 shadow-md hover:shadow-lg transition-shadow flex items-center gap-3 border border-border-subtle">
            <Search className="size-5 text-text-muted shrink-0" />
            <input
              type="text"
              id="mainSearchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What job are you looking for today?"
              className="flex-1 bg-transparent text-sm sm:text-base text-on-surface placeholder:text-text-muted outline-none"
              aria-label="Job search input"
            />
            <Button
              type="submit"
              variant="default"
              pill
              className="px-6 py-2.5 font-bold shadow-xs text-sm"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Popular Searches */}
        <div className="w-full max-w-4xl mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="font-mono text-[11px] text-text-muted uppercase tracking-wider mr-1">
            POPULAR SEARCHES:
          </span>
          {POPULAR_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handlePopularSearch(term)}
              className="px-3.5 py-1.5 bg-surface-container-lowest text-on-surface hover:bg-lavender-subtle hover:text-primary font-sans text-xs sm:text-sm rounded-full border border-border-subtle shadow-xs transition-colors cursor-pointer"
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      {/* Filter & Controls Toolbar */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-4 pb-4" id="browse-roles">
        <div className="bg-surface-container-lowest rounded-2xl p-4 border border-border-subtle shadow-xs flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search input + Search button + pill filters */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <form
                onSubmit={handleTableSearchSubmit}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <div className="w-full sm:w-60">
                  <Input
                    placeholder="Search for jobs"
                    value={tableSearchInput}
                    onChange={(e) => setTableSearchInput(e.target.value)}
                    icon={<Search className="size-4" />}
                    pill
                    className="bg-surface-container border-transparent"
                  />
                </div>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  pill
                  aria-label="Search jobs"
                  className="px-4 py-2 font-bold shadow-xs text-xs whitespace-nowrap"
                >
                  Search
                </Button>
              </form>

              {/* Filter Dropdown Pills */}
              {TOOLBAR_FILTERS.map((filter) => {
                const Icon = filter.icon
                const isActive =
                  filter.id === "location"
                    ? activeChips.some((c) => c.type === "remote")
                    : filter.id === "type"
                    ? activeChips.some((c) => c.type === "employmentType")
                    : filter.id === "level"
                    ? activeChips.some((c) => c.type === "seniority")
                    : false

                const handleFilterClick = () => {
                  if (filter.id === "location") {
                    toggleFilter({ id: "remote", type: "remote", value: "true", label: "Remote" })
                  } else if (filter.id === "type") {
                    toggleFilter({
                      id: "employmentType-full-time",
                      type: "employmentType",
                      value: "Full-time",
                      label: "Full-time",
                    })
                  } else if (filter.id === "level") {
                    toggleFilter({
                      id: "seniority-senior",
                      type: "seniority",
                      value: "Senior",
                      label: "Senior",
                    })
                  }
                }

                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={handleFilterClick}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer",
                      isActive
                        ? "bg-primary text-white"
                        : "bg-surface-container hover:bg-lavender-subtle hover:text-primary text-on-surface"
                    )}
                  >
                    <Icon className={cn("size-3.5", isActive ? "text-white" : "text-text-muted")} />
                    <span>{filter.label}</span>
                    <ChevronDown className={cn("size-3.5", isActive ? "text-white" : "text-text-muted")} />
                  </button>
                )
              })}
            </div>

            {/* Scope switcher */}
            <div className="flex items-center gap-2 self-end lg:self-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lavender-subtle text-primary font-mono text-xs sm:text-sm font-bold"
              >
                <span>All jobs</span>
                <ChevronDown className="size-4" />
              </button>
            </div>
          </div>

          {/* Auto-promoted filter chips from parsed search intent */}
          <PromotedFilterChips
            chips={activeChips}
            onRemoveChip={removeChip}
            onClearAll={clearAllChips}
          />
        </div>

        {/* Match count meta label */}
        <div className="mt-4 px-2 flex items-center justify-between text-text-muted">
          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm">
            <span className="font-bold text-primary">{filteredJobs.length}</span>
            <span>matching jobs</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-text-muted">
            <span className="inline-block size-2 rounded-full bg-mint-emerald" />
            <span>Updated real-time with verified AI teams</span>
          </div>
        </div>
      </section>

      {/* Job Listings / Zero-Result Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-3">
        {isLoading ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle p-8 text-center animate-pulse space-y-4">
            <div className="h-6 w-48 bg-surface-container rounded-md mx-auto" />
            <div className="space-y-3 pt-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-surface-container/60 rounded-xl w-full" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle p-8 text-center flex flex-col items-center gap-3">
            <p className="text-sm text-text-muted">Unable to load jobs from the Athyna API ({error.message}).</p>
            <Button variant="default" size="sm" pill onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : filteredJobs.length === 0 ? (
          <ZeroResultFallback
            query={tableFilter || searchQuery}
            suggestions={relaxationSuggestions}
            onSelectSuggestion={applyRelaxation}
            onResetAll={resetAll}
          />
        ) : (
          <div className="bg-surface-container-lowest rounded-2xl border border-border-subtle shadow-xs overflow-hidden">
            <Table>
              <TableHeader className="bg-surface-container">
                <TableRow>
                  <TableHead className="w-[36%] font-mono text-[11px] uppercase tracking-wider font-bold">
                    Role name
                  </TableHead>
                  <TableHead className="w-[18%] font-mono text-[11px] uppercase tracking-wider font-bold">
                    Matching index
                  </TableHead>
                  <TableHead className="font-mono text-[11px] uppercase tracking-wider font-bold">
                    Company
                  </TableHead>
                  <TableHead className="font-mono text-[11px] uppercase tracking-wider font-bold">
                    Location
                  </TableHead>
                  <TableHead className="font-mono text-[11px] uppercase tracking-wider font-bold">
                    Details
                  </TableHead>
                  <TableHead className="text-right font-mono text-[11px] uppercase tracking-wider font-bold">
                    Salary
                  </TableHead>
                  <TableHead className="text-right font-mono text-[11px] uppercase tracking-wider font-bold">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => {
                  const initials = job.company.name.slice(0, 2).toUpperCase()
                  const salaryText = formatSalary(job.salary)
                  const locationText = formatLocation(job.location)

                  return (
                    <TableRow key={job.id} className="hover:bg-surface-canvas/60">
                      <TableCell className="font-semibold text-on-surface py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-surface-container-high text-on-surface flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/jobs/${job.id}`}
                              className="font-bold text-sm sm:text-base text-on-surface hover:text-primary transition-colors block truncate"
                            >
                              {job.title}
                            </Link>
                            <div className="flex items-center gap-2 text-text-muted text-xs mt-0.5 lg:hidden">
                              <span className="font-semibold text-on-surface">
                                {job.company.name}
                              </span>
                              <span>•</span>
                              <span>{locationText}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="match">{job.matchIndex || 95}%</Badge>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-text-muted hover:text-primary text-[11px] font-mono bg-surface-container px-2 py-0.5 rounded-full transition-colors"
                          >
                            <Lock className="size-3" />
                            <span>Login to unlock</span>
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-sm">
                        {job.company.name}
                      </TableCell>
                      <TableCell className="text-text-muted text-xs truncate max-w-[150px]">
                        {locationText}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge variant="neutral">{job.employmentType}</Badge>
                          <Badge variant="neutral">{job.seniority}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono font-bold text-sm">
                        {salaryText}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="mint"
                          size="sm"
                          pill
                          onClick={() => handleApplyClick(job)}
                          className="text-xs font-bold whitespace-nowrap"
                        >
                          Apply now
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {/* Unlock All Jobs Mint Emerald CTA Bar */}
            <div className="p-4 sm:p-6 bg-surface-container-low flex items-center justify-center border-t border-border-subtle">
              <Button
                variant="mint"
                pill
                size="lg"
                className="w-full max-w-xl py-3.5 px-6 font-bold text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-base"
              >
                <Unlock className="size-5" />
                <span>Unlock all jobs</span>
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Promotional Retro Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="relative w-full rounded-3xl bg-brand-purple text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-xl flex flex-col items-center text-center">
          {/* Top-left pixel mosaic */}
          <div className="absolute top-0 left-0 pointer-events-none opacity-40 select-none">
            <PastelPixelCluster width={120} height={120} />
          </div>

          {/* Bottom-right 8-bit space invader / robot mascot */}
          <div className="absolute -bottom-2 right-4 sm:right-10 pointer-events-none opacity-85 select-none hidden md:block">
            <RetroMascot className="text-white" />
          </div>

          <div className="relative z-10 max-w-3xl flex flex-col items-center">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Ready to help build the future of{" "}
              <span className="font-serif italic font-normal underline decoration-mint-emerald decoration-4 underline-offset-8">
                Athyna
              </span>
              ?
            </h2>
            <p className="text-sm sm:text-base text-lavender-subtle/90 max-w-2xl leading-relaxed mb-6 font-normal">
              We are always looking for amazing talent to join our team as we change the face of work around the world. Explore remote positions that let you grow with us.
            </p>
            <Button
              variant="mint"
              pill
              size="lg"
              className="text-base px-8 py-3.5 font-bold shadow-lg"
            >
              Apply now
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
