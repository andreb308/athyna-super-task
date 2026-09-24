import * as React from "react"
import Link from "next/link"
import { Search, ArrowRight, FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface JobNotFoundProps {
  jobId?: string
}

export function JobNotFound({ jobId }: JobNotFoundProps) {
  return (
    <div
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center"
      data-testid="job-not-found"
    >
      <div className="w-16 h-16 rounded-2xl bg-lavender-subtle text-primary flex items-center justify-center mb-6 shadow-xs border border-border-subtle">
        <FileQuestion className="size-8" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-2">
        Job not found
      </h1>

      <p className="text-sm sm:text-base text-text-muted max-w-md mb-8">
        {jobId ? (
          <>
            We couldn&apos;t find an active listing matching{" "}
            <span className="font-mono font-semibold text-on-surface">
              &quot;{jobId}&quot;
            </span>
            . It may have expired or been filled.
          </>
        ) : (
          "This job listing may have been filled or is no longer accepting public applications."
        )}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link href="/#browse-roles">
          <Button variant="default" pill size="lg" className="px-6 font-bold text-sm">
            <Search className="size-4 mr-2" />
            <span>Browse 35,000+ jobs</span>
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" pill size="lg" className="px-6 text-sm">
            <span>Back to home</span>
            <ArrowRight className="size-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
