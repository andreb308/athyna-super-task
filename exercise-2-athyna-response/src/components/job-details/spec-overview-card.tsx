import * as React from "react"
import { MapPin, Clock, Briefcase, DollarSign } from "lucide-react"
import type { AthynaJob } from "@/domain/jobs"
import { formatSalary, formatLocation } from "@/lib/job-formatters"

export interface SpecOverviewCardProps {
  job: AthynaJob
  className?: string
}

export function SpecOverviewCard({ job, className = "" }: SpecOverviewCardProps) {
  const locationText = formatLocation(job.location)
  const salaryText = formatSalary(job.salary)
  const employmentText = job.employmentType || "Full Time"
  const experienceText = job.seniority || "Not specified"

  return (
    <div
      className={`border-2 border-zinc-900 rounded-2xl p-4 sm:p-6 bg-surface-container-lowest shadow-sm ${className}`}
      data-testid="spec-overview-card"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
        {/* Location */}
        <div className="flex flex-col items-center pt-2 sm:pt-0">
          <div className="w-8 h-8 rounded-full bg-purple-50 text-primary flex items-center justify-center mb-2">
            <MapPin className="size-4" />
          </div>
          <span className="text-xs text-text-muted font-medium">Location</span>
          <span className="text-xs sm:text-sm font-bold text-on-surface mt-0.5 truncate max-w-[160px]">
            {locationText}
          </span>
        </div>

        {/* Employment */}
        <div className="flex flex-col items-center pt-2 sm:pt-0 sm:px-2">
          <div className="w-8 h-8 rounded-full bg-purple-50 text-primary flex items-center justify-center mb-2">
            <Clock className="size-4" />
          </div>
          <span className="text-xs text-text-muted font-medium">Employment</span>
          <span className="text-xs sm:text-sm font-bold text-on-surface mt-0.5">
            {employmentText}
          </span>
        </div>

        {/* Experience */}
        <div className="flex flex-col items-center pt-4 sm:pt-0 sm:px-2">
          <div className="w-8 h-8 rounded-full bg-purple-50 text-primary flex items-center justify-center mb-2">
            <Briefcase className="size-4" />
          </div>
          <span className="text-xs text-text-muted font-medium">Experience</span>
          <span className="text-xs sm:text-sm font-bold text-on-surface mt-0.5">
            {experienceText}
          </span>
        </div>

        {/* Salary */}
        <div className="flex flex-col items-center pt-4 sm:pt-0 sm:px-2">
          <div className="w-8 h-8 rounded-full bg-purple-50 text-primary flex items-center justify-center mb-2">
            <DollarSign className="size-4" />
          </div>
          <span className="text-xs text-text-muted font-medium">Salary</span>
          <span className="text-xs sm:text-sm font-bold text-on-surface mt-0.5">
            {salaryText}
          </span>
        </div>
      </div>
    </div>
  )
}
