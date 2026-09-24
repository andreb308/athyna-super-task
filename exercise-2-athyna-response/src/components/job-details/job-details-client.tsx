"use client"

import * as React from "react"
import Link from "next/link"
import { useJob, type AthynaJob } from "@/domain/jobs"
import { formatLocation, formatPublishedDate } from "@/lib/job-formatters"
import {
  trackEvent,
  getDeviceCategory,
  getArrivalSource,
} from "@/lib/telemetry"
import { SmartBackButton } from "./smart-back-button"
import { CompanyAvatar } from "./company-avatar"
import { AtAGlanceBadges } from "./at-a-glance-badges"
import { SpecOverviewCard } from "./spec-overview-card"
import { JobInteractions } from "./job-interactions"
import { JobDescriptionView } from "./job-description-view"
import { PrimaryCTABar } from "./primary-cta-bar"
import { StickyActionBar } from "./sticky-action-bar"
import { SimilarRolesShelf } from "./similar-roles-shelf"
import { PostApplyDialog } from "./post-apply-dialog"
import { JobSkeleton } from "./job-skeleton"
import { JobNotFound } from "./job-not-found"
import { AiSummaryCard } from "./ai-summary-card"

export interface JobDetailsClientProps {
  id: string
  initialJob?: AthynaJob | null
}

export function JobDetailsClient({ id, initialJob }: JobDetailsClientProps) {
  const { job, similarJobs, isLoading, error } = useJob(id, { initialJob })
  const [hasApplied, setHasApplied] = React.useState(false)
  const [showPostApplyDialog, setShowPostApplyDialog] = React.useState(false)
  const shelfRef = React.useRef<HTMLDivElement>(null)

  // Telemetry: job_detail_viewed on mount
  React.useEffect(() => {
    if (job) {
      trackEvent("job_detail_viewed", {
        job_id: job.id,
        device: getDeviceCategory(),
        referrer: getArrivalSource(),
      })
    }
  }, [job?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplyClick = React.useCallback(
    (position: "sticky_bar" | "body_bottom") => {
      if (!job) return

      // Telemetry: apply_cta_clicked
      trackEvent("apply_cta_clicked", {
        job_id: job.id,
        position,
        device: getDeviceCategory(),
      })

      // Open external application URL
      const applyUrl =
        job.applicationUrl || job.url || "https://jobs.athyna.com"
      window.open(applyUrl, "_blank", "noopener,noreferrer")

      // Update local post-apply state
      setHasApplied(true)
      setShowPostApplyDialog(true)
    },
    [job]
  )

  const handleSimilarJobClick = React.useCallback(
    (targetJobId: string, position: number) => {
      if (!job) return
      trackEvent("similar_job_clicked", {
        source_job_id: job.id,
        target_job_id: targetJobId,
        position,
      })
    },
    [job]
  )

  const handleDialogClose = React.useCallback(() => {
    setShowPostApplyDialog(false)
    // Scroll to similar roles shelf
    shelfRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  if (isLoading && !job) {
    return <JobSkeleton />
  }

  if (error || !job) {
    return <JobNotFound jobId={id} />
  }

  const locationText = formatLocation(job.location)
  const publishedDateText = formatPublishedDate(job.publishedAt)

  return (
    <div className="w-full bg-surface min-h-[calc(100vh-5rem)]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pb-16 pb-28 w-full">
        {/* Navigation Back Link */}
        <div className="mb-6">
          <SmartBackButton />
        </div>

        {/* Company Badge & Role Title Block */}
        <div className="text-center flex flex-col items-center">
          <CompanyAvatar company={job.company} size="lg" className="mb-5" />

          <h1
            className="text-2xl sm:text-4xl font-extrabold text-on-surface tracking-tight leading-tight sm:leading-snug max-w-2xl px-2"
            data-testid="job-title"
          >
            {job.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-text-muted font-medium">
            <Link
              href={`/#browse-roles`}
              className="text-primary hover:text-primary-container font-semibold hover:underline"
            >
              @{job.company.name}
            </Link>
            <span>•</span>
            <span data-testid="job-location">{locationText}</span>
            <span>•</span>
            <span>Published on {publishedDateText}</span>
          </div>

          {/* Above-the-fold "At a Glance" Badge Cluster */}
          <AtAGlanceBadges job={job} className="mt-4" />
        </div>

        {/* AI Summary of Key Information */}
        <AiSummaryCard className="mt-8" />

        {/* Spec Overview Container (4 Columns) */}
        <SpecOverviewCard job={job} className="mt-4" />

        {/* Job Interactions: Save / Mark as Applied */}
        <JobInteractions jobId={job.id} />

        {/* Verbatim Job Description Article */}
        <JobDescriptionView job={job} />

        {/* Primary CTA Action Bar */}
        <PrimaryCTABar
          job={job}
          hasApplied={hasApplied}
          onApplyClick={() => handleApplyClick("body_bottom")}
        />

        {/* Similar Roles Contextual Recommendation Shelf */}
        <div ref={shelfRef}>
          <SimilarRolesShelf
            jobs={similarJobs}
            onJobClick={handleSimilarJobClick}
          />
        </div>
      </main>

      {/* Persistent Mobile Sticky Action Bar */}
      <StickyActionBar
        job={job}
        onApplyClick={() => handleApplyClick("sticky_bar")}
      />

      {/* Post-Apply Success Dialog */}
      <PostApplyDialog
        open={showPostApplyDialog}
        onClose={handleDialogClose}
        similarJobs={similarJobs}
        onSimilarJobClick={handleSimilarJobClick}
      />
    </div>
  )
}
