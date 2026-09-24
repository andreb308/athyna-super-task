"use client"

import * as React from "react"
import Link from "next/link"
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { AthynaJob } from "@/domain/jobs"
import { formatSalary } from "@/lib/job-formatters"

export interface PostApplyDialogProps {
  open: boolean
  onClose: () => void
  similarJobs: AthynaJob[]
  onSimilarJobClick?: (targetJobId: string, position: number) => void
}

export function PostApplyDialog({
  open,
  onClose,
  similarJobs,
  onSimilarJobClick,
}: PostApplyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="sm:max-w-xl md:max-w-2xl w-full p-6 overflow-hidden"
        data-testid="post-apply-dialog"
      >
        <DialogHeader className="items-center text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-mint-surface flex items-center justify-center mb-1">
            <CheckCircle2 className="size-6 text-mint-emerald" />
          </div>
          <DialogTitle className="text-center font-bold text-lg sm:text-xl text-on-surface">
            Application opened in new tab!
          </DialogTitle>
          <DialogDescription className="text-center text-text-muted text-xs sm:text-sm max-w-sm mx-auto">
            Complete your application in the employer&apos;s portal. In the
            meantime, explore more matching opportunities.
          </DialogDescription>
        </DialogHeader>

        {/* Similar roles mini-list inside dialog */}
        {similarJobs.length > 0 && (
          <div className="space-y-2.5 mt-2 min-w-0 w-full overflow-hidden">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" />
              <span>Similar Roles</span>
            </div>
            {similarJobs.slice(0, 3).map((simJob, idx) => (
              <Link
                key={simJob.id}
                href={`/jobs/${simJob.id}`}
                onClick={() => onSimilarJobClick?.(simJob.id, idx)}
                className="group flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border-subtle hover:border-primary/50 bg-surface-container-lowest hover:bg-lavender-subtle/30 transition-all min-w-0 w-full overflow-hidden"
                data-testid="post-apply-similar-job"
              >
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p
                    className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate block"
                    title={simJob.title}
                  >
                    {simJob.title}
                  </p>
                  <p className="text-xs text-text-muted truncate block mt-0.5">
                    {simJob.company.name} •{" "}
                    <span className="font-mono font-semibold text-on-surface">
                      {formatSalary(simJob.salary)}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-2 shrink-0">
                  <Badge variant="match" className="text-[10px]">
                    {simJob.matchIndex || 95}%
                  </Badge>
                  <ArrowRight className="size-3.5 text-primary group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="default"
            pill
            onClick={onClose}
            className="w-full sm:w-auto font-bold px-6"
          >
            Continue browsing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
