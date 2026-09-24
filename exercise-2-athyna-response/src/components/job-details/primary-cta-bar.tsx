"use client"

import * as React from "react"
import Link from "next/link"
import { ExternalLink, Unlock } from "lucide-react"
import type { AthynaJob } from "@/domain/jobs"

export interface PrimaryCTABarProps {
  job: AthynaJob
  hasApplied?: boolean
  onApplyClick?: () => void
  className?: string
}

export function PrimaryCTABar({
  job,
  hasApplied = false,
  onApplyClick,
  className = "",
}: PrimaryCTABarProps) {
  const handleApply = (e: React.MouseEvent) => {
    // Prevent the default anchor navigation — the parent handler opens the URL
    e.preventDefault()
    onApplyClick?.()
  }

  const applyUrl = job.applicationUrl || job.url || "https://jobs.athyna.com"

  return (
    <div className={`mt-10 flex flex-col space-y-3 ${className}`}>
      {/* Primary Conversion CTA */}
      <a
        href={applyUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleApply}
        className="w-full bg-mint-emerald hover:bg-mint-emerald-hover text-zinc-950 font-bold text-center py-3.5 px-6 rounded-full flex items-center justify-center space-x-2 transition shadow-sm hover:shadow-md text-sm sm:text-base cursor-pointer"
        data-testid="primary-apply-button"
      >
        <span>{hasApplied ? "Applied (Open Application)" : "Apply externally"}</span>
        <ExternalLink className="size-4 shrink-0 stroke-[2.5]" />
      </a>

      {/* Unlock / Browse All Jobs Secondary */}
      <Link
        href="/#browse-roles"
        className="w-full bg-surface-container-lowest hover:bg-surface-container border border-mint-emerald/80 text-on-surface font-semibold text-center py-3 px-6 rounded-full transition text-sm sm:text-base flex items-center justify-center gap-2"
      >
        <Unlock className="size-4 text-mint-emerald" />
        <span>Unlock all jobs</span>
      </Link>
    </div>
  )
}
