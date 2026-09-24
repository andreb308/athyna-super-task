"use client"

import * as React from "react"
import { ExternalLink, Bookmark } from "lucide-react"
import type { AthynaJob } from "@/domain/jobs"
import { formatSalary } from "@/lib/job-formatters"

export interface StickyActionBarProps {
  job: AthynaJob
  onApplyClick?: () => void
  className?: string
}

export function StickyActionBar({
  job,
  onApplyClick,
  className = "",
}: StickyActionBarProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isSaved, setIsSaved] = React.useState(false)
  const salaryText = formatSalary(job.salary)

  // Load saved state from localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined" && job.id) {
      try {
        const savedMap = JSON.parse(
          localStorage.getItem("athyna_saved_jobs") || "{}"
        )
        setIsSaved(Boolean(savedMap[job.id]))
      } catch {
        // ignore
      }
    }
  }, [job.id])

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isVisible) return null

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault()
    onApplyClick?.()
  }

  const toggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev
      if (typeof window !== "undefined" && job.id) {
        try {
          const savedMap = JSON.parse(
            localStorage.getItem("athyna_saved_jobs") || "{}"
          )
          if (next) {
            savedMap[job.id] = true
          } else {
            delete savedMap[job.id]
          }
          localStorage.setItem("athyna_saved_jobs", JSON.stringify(savedMap))
        } catch {
          // ignore
        }
      }
      return next
    })
  }

  const applyUrl = job.applicationUrl || job.url || "https://jobs.athyna.com"

  return (
    <aside
      aria-label="Quick apply bar"
      className={`fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md border-t border-border-subtle p-3 px-4 flex items-center justify-between gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] sm:hidden animate-in fade-in slide-in-from-bottom duration-200 ${className}`}
      data-testid="sticky-action-bar"
    >
      <div className="min-w-0 flex-1">
        <div className="font-bold text-xs text-on-surface truncate">
          {job.title}
        </div>
        <div className="text-[11px] font-mono font-semibold text-primary">
          {salaryText}
        </div>
      </div>

      {/* Save / Bookmark button */}
      <button
        type="button"
        onClick={toggleSave}
        className="shrink-0 p-2 rounded-full hover:bg-lavender-subtle transition-colors"
        aria-label={isSaved ? "Unsave role" : "Save role"}
        aria-pressed={isSaved}
        data-testid="sticky-save-button"
      >
        <Bookmark
          className={`size-4 ${
            isSaved ? "fill-primary text-primary" : "text-on-surface"
          }`}
        />
      </button>

      {/* Apply button */}
      <a
        href={applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleApply}
        className="shrink-0 bg-mint-emerald hover:bg-mint-emerald-hover text-zinc-950 font-bold text-xs py-2 px-4 rounded-full flex items-center gap-1.5 shadow-xs transition"
        data-testid="sticky-apply-button"
      >
        <span>Apply</span>
        <ExternalLink className="size-3.5 stroke-[2.5]" />
      </a>
    </aside>
  )
}
