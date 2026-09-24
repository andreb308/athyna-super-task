"use client"

import * as React from "react"
import type { AthynaJob, JobFilterParams } from "./schema"
import { getJobs, type JobDataSource } from "./jobs-repository"
import { MOCK_ATHYNA_JOBS } from "./mock-dataset"
import { filterJobs } from "./query-engine"

export interface UseJobsOptions {
  filters?: JobFilterParams
  initialData?: AthynaJob[]
}

export interface UseJobsResult {
  jobs: AthynaJob[]
  allJobs: AthynaJob[]
  total: number
  source: JobDataSource
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useJobs(options: UseJobsOptions = {}): UseJobsResult {
  const { filters, initialData = MOCK_ATHYNA_JOBS } = options

  // Initial immediate state provides zero-latency offline resilience
  const [rawJobs, setRawJobs] = React.useState<AthynaJob[]>(initialData)
  const [source, setSource] = React.useState<JobDataSource>("offline_mock")
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<Error | null>(null)

  const loadJobs = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getJobs({}, initialData)
      if (result.jobs.length > 0) {
        setRawJobs(result.jobs)
        setSource(result.source)
      }
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [initialData])

  React.useEffect(() => {
    loadJobs()
  }, [loadJobs])

  const jobs = React.useMemo(() => {
    if (!filters) return rawJobs
    return filterJobs(rawJobs, filters)
  }, [rawJobs, filters])

  return {
    jobs,
    allJobs: rawJobs,
    total: rawJobs.length,
    source,
    isLoading,
    error,
    refetch: loadJobs,
  }
}
