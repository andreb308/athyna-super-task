"use client"

import * as React from "react"
import { Wifi, Building2, DollarSign, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { AthynaJob } from "@/domain/jobs"
import { formatSalary } from "@/lib/job-formatters"

export interface AtAGlanceBadgesProps {
  job: AthynaJob
  className?: string
}

function getRemoteStatusLabel(
  location: AthynaJob["location"]
): "Remote" | "Hybrid" | "On-site" {
  if (location.isRemote) return "Remote"
  // Heuristic: if no city/country, treat as hybrid
  if (!location.city && !location.country) return "Hybrid"
  return "On-site"
}

/**
 * Above-the-fold horizontal badge cluster per spec 0005.
 * Renders: Remote status, Compensation, Employment type, Top 4 skill tags.
 */
export function AtAGlanceBadges({
  job,
  className = "",
}: AtAGlanceBadgesProps) {
  const remoteStatus = getRemoteStatusLabel(job.location)
  const salaryText = formatSalary(job.salary)
  const topSkills = job.skills.slice(0, 4)

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-2 ${className}`}
      data-testid="at-a-glance-badges"
    >
      {/* Remote status badge */}
      <Badge
        variant="trending"
        icon={<Wifi className="size-3 shrink-0" aria-hidden="true" />}
        data-testid="remote-status-badge"
      >
        {remoteStatus}
      </Badge>

      {/* Compensation badge */}
      <Badge
        variant="match"
        icon={<DollarSign className="size-3 shrink-0" aria-hidden="true" />}
        data-testid="compensation-badge"
      >
        {salaryText}
      </Badge>

      {/* Employment type */}
      <Badge
        variant="neutral"
        icon={<Briefcase className="size-3 shrink-0" aria-hidden="true" />}
      >
        {job.employmentType}
      </Badge>

      {/* Top skill tags */}
      {topSkills.map((skill) => (
        <Badge
          key={skill}
          variant="neutral"
          className="bg-surface-container hover:border-primary/50 transition-colors"
        >
          {skill}
        </Badge>
      ))}
    </div>
  )
}
