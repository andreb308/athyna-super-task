"use client"

import * as React from "react"
import type { AthynaJob, JobFilterParams } from "./schema"
import { getJobs, type JobDataSource } from "./jobs-repository"
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

/**
 * Hook to fetch jobs from the Athyna Public Jobs API via a single API call.
 * Contains no mock data; queries the live endpoints exclusively.
 */
export function useJobs(options: UseJobsOptions = {}): UseJobsResult {
  const { filters, initialData = [] } = options

  const [rawJobs, setRawJobs] = React.useState<AthynaJob[]>(initialData)
  const [total, setTotal] = React.useState<number>(initialData.length)
  const [source, setSource] = React.useState<JobDataSource>("live_api")
  const [isLoading, setIsLoading] = React.useState<boolean>(initialData.length === 0)
  const [error, setError] = React.useState<Error | null>(null)

  const filterKey = React.useMemo(() => JSON.stringify(filters || {}), [filters])

  const loadJobs = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getJobs(filters || {})
      setRawJobs(result.jobs)
      setTotal(result.total)
      setSource(result.source)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey])

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
    total,
    source,
    isLoading,
    error,
    refetch: loadJobs,
  }
}
