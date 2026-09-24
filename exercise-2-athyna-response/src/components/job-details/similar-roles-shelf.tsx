import * as React from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { AthynaJob } from "@/domain/jobs"
import { formatSalary, formatLocation } from "@/lib/job-formatters"

export interface SimilarRolesShelfProps {
  jobs: AthynaJob[]
  onJobClick?: (targetJobId: string, position: number) => void
  className?: string
}

export function SimilarRolesShelf({
  jobs,
  onJobClick,
  className = "",
}: SimilarRolesShelfProps) {
  if (!jobs || jobs.length === 0) return null

  return (
    <section
      className={`mt-16 pt-10 border-t border-border-subtle ${className}`}
      data-testid="similar-roles-shelf"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="size-3.5 text-primary" />
            <span>Similar Roles You Qualify For</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-on-surface mt-1">
            Keep exploring top opportunities
          </h2>
        </div>

        <Link
          href="/#browse-roles"
          className="text-xs sm:text-sm font-mono font-semibold text-primary hover:text-primary-container inline-flex items-center gap-1 group transition-colors"
        >
          <span>All roles</span>
          <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {jobs.map((simJob, idx) => {
          const initials = (simJob.company.name || "Co").slice(0, 2).toUpperCase()
          const salary = formatSalary(simJob.salary)
          const location = formatLocation(simJob.location)

          return (
            <Link
              key={simJob.id}
              href={`/jobs/${simJob.id}`}
              onClick={() => onJobClick?.(simJob.id, idx)}
              className="group p-4 rounded-2xl bg-surface-container-lowest border border-border-subtle hover:border-primary/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              data-testid="similar-role-card"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center font-mono font-bold text-xs text-on-surface border border-border-subtle">
                    {initials}
                  </div>
                  <Badge variant="match" className="text-[11px]">
                    {simJob.matchIndex || 95}% Match
                  </Badge>
                </div>

                <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors line-clamp-2 mb-1">
                  {simJob.title}
                </h3>
                <p className="text-xs text-text-muted font-medium mb-3">
                  {simJob.company.name} • {location}
                </p>
              </div>

              <div className="pt-3 border-t border-border-subtle/60 flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-on-surface">
                  {salary}
                </span>
                <span className="text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>View</span>
                  <ArrowRight className="size-3" />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
