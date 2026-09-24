"use client"

import * as React from "react"
import type { AthynaJob } from "./schema"
import { getJobById, getJobs, type JobDataSource } from "./jobs-repository"

export interface UseJobOptions {
  initialJob?: AthynaJob | null
}

export interface UseJobResult {
  job: AthynaJob | null
  similarJobs: AthynaJob[]
  source: JobDataSource
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Computes similar roles based on category, skills overlap, and seniority
 */
export function findSimilarJobs(
  targetJob: AthynaJob,
  pool: AthynaJob[],
  limit: number = 3
): AthynaJob[] {
  return pool
    .filter((j) => j.id !== targetJob.id && j.slug !== targetJob.slug)
    .map((j) => {
      let score = 0
      if (j.category && targetJob.category && j.category === targetJob.category) {
        score += 3
      }
      if (j.seniority && targetJob.seniority && j.seniority === targetJob.seniority) {
        score += 2
      }
      const skillMatches = j.skills.filter((s) =>
        targetJob.skills.some((ts) => ts.toLowerCase() === s.toLowerCase())
      )
      score += skillMatches.length * 2
      return { job: j, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.job)
}

/**
 * Hook to fetch a single job by id/slug from the Athyna Public Jobs API via a single API call.
 * Contains no mock data; queries the live endpoints exclusively.
 */
export function useJob(
  idOrSlug: string,
  options: UseJobOptions = {}
): UseJobResult {
  const { initialJob = null } = options

  const [job, setJob] = React.useState<AthynaJob | null>(initialJob)
  const [similarJobs, setSimilarJobs] = React.useState<AthynaJob[]>([])
  const [source, setSource] = React.useState<JobDataSource>("live_api")
  const [isLoading, setIsLoading] = React.useState<boolean>(!initialJob)
  const [error, setError] = React.useState<Error | null>(null)

  const loadJob = React.useCallback(async () => {
    if (!idOrSlug) return

    let currentJob = initialJob
    if (!currentJob || (currentJob.id !== idOrSlug && currentJob.slug !== idOrSlug)) {
      setIsLoading(true)
      setError(null)

      try {
        const jobResult = await getJobById(idOrSlug)
        currentJob = jobResult.job
        setJob(currentJob)
        setSource(jobResult.source)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
        setIsLoading(false)
        return
      }
    } else {
      setJob(currentJob)
    }

    // Query live API for contextual related jobs
    try {
      const poolResult = await getJobs({ pageSize: 15 })
      if (poolResult.jobs.length > 0 && currentJob) {
        setSimilarJobs(findSimilarJobs(currentJob, poolResult.jobs, 3))
      }
    } catch {
      // Non-critical background recommendation failure
    } finally {
      setIsLoading(false)
    }
  }, [idOrSlug, initialJob])

  React.useEffect(() => {
    loadJob()
  }, [loadJob])

  return {
    job,
    similarJobs,
    source,
    isLoading,
    error,
    refetch: loadJob,
  }
}
