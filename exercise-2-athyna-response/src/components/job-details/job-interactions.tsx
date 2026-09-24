"use client"

import * as React from "react"
import { Bookmark, CheckCircle2 } from "lucide-react"

export interface JobInteractionsProps {
  jobId: string
  className?: string
}

export function JobInteractions({ jobId, className = "" }: JobInteractionsProps) {
  const [isSaved, setIsSaved] = React.useState<boolean>(false)
  const [isApplied, setIsApplied] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (typeof window !== "undefined" && jobId) {
      try {
        const savedMap = JSON.parse(localStorage.getItem("athyna_saved_jobs") || "{}")
        const appliedMap = JSON.parse(localStorage.getItem("athyna_applied_jobs") || "{}")
        setIsSaved(Boolean(savedMap[jobId]))
        setIsApplied(Boolean(appliedMap[jobId]))
      } catch {
        // Fallback gracefully on private browsing / quota errors
      }
    }
  }, [jobId])

  const toggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev
      if (typeof window !== "undefined" && jobId) {
        try {
          const savedMap = JSON.parse(localStorage.getItem("athyna_saved_jobs") || "{}")
          if (next) {
            savedMap[jobId] = true
          } else {
            delete savedMap[jobId]
          }
          localStorage.setItem("athyna_saved_jobs", JSON.stringify(savedMap))
        } catch {
          // ignore
        }
      }
      return next
    })
  }

  const toggleApplied = () => {
    setIsApplied((prev) => {
      const next = !prev
      if (typeof window !== "undefined" && jobId) {
        try {
          const appliedMap = JSON.parse(localStorage.getItem("athyna_applied_jobs") || "{}")
          if (next) {
            appliedMap[jobId] = true
          } else {
            delete appliedMap[jobId]
          }
          localStorage.setItem("athyna_applied_jobs", JSON.stringify(appliedMap))
        } catch {
          // ignore
        }
      }
      return next
    })
  }

  return (
    <div className={`grid grid-cols-2 gap-3 mt-4 ${className}`}>
      <button
        type="button"
        onClick={toggleSave}
        className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border transition-all text-xs sm:text-sm font-semibold cursor-pointer shadow-xs ${
          isSaved
            ? "border-primary bg-lavender-subtle text-primary"
            : "border-border-subtle bg-surface-container-lowest hover:bg-surface-container text-on-surface"
        }`}
        aria-pressed={isSaved}
      >
        <Bookmark
          className={`size-4 ${isSaved ? "fill-primary text-primary" : "text-primary"}`}
        />
        <span>{isSaved ? "Saved" : "Save"}</span>
      </button>

      <button
        type="button"
        onClick={toggleApplied}
        className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border transition-all text-xs sm:text-sm font-semibold cursor-pointer shadow-xs ${
          isApplied
            ? "border-mint-emerald bg-mint-surface text-mint-text"
            : "border-border-subtle bg-surface-container-lowest hover:bg-surface-container text-on-surface"
        }`}
        aria-pressed={isApplied}
      >
        <CheckCircle2
          className={`size-4 ${isApplied ? "fill-mint-emerald text-white" : "text-primary"}`}
        />
        <span>{isApplied ? "Applied" : "Mark as Applied"}</span>
      </button>
    </div>
  )
}
