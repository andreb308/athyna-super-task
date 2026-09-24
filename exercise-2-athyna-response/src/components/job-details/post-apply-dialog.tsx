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
        className="sm:max-w-md"
        data-testid="post-apply-dialog"
      >
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-full bg-mint-surface flex items-center justify-center mb-2">
            <CheckCircle2 className="size-6 text-mint-emerald" />
          </div>
          <DialogTitle className="text-center">
            Application opened in new tab!
          </DialogTitle>
          <DialogDescription className="text-center">
            Complete your application in the employer&apos;s portal. In the
            meantime, explore more matching opportunities.
          </DialogDescription>
        </DialogHeader>

        {/* Similar roles mini-list inside dialog */}
        {similarJobs.length > 0 && (
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3" />
              <span>Similar Roles</span>
            </div>
            {similarJobs.slice(0, 3).map((simJob, idx) => (
              <Link
                key={simJob.id}
                href={`/jobs/${simJob.id}`}
                onClick={() => onSimilarJobClick?.(simJob.id, idx)}
                className="group flex items-center justify-between p-3 rounded-xl border border-border-subtle hover:border-primary/50 bg-surface-container-lowest hover:bg-lavender-subtle/30 transition-all"
                data-testid="post-apply-similar-job"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                    {simJob.title}
                  </p>
                  <p className="text-xs text-text-muted">
                    {simJob.company.name} •{" "}
                    <span className="font-mono font-semibold">
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
            className="w-full sm:w-auto font-bold"
          >
            Continue browsing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
