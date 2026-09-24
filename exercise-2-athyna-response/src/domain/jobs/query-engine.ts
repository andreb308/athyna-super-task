import type { AthynaJob, JobFilterParams } from "./schema"

export interface RelaxationSuggestion {
  filterKey: "remote" | "employmentType" | "seniority" | "skills" | "q"
  label: string
  relaxedFilters: JobFilterParams
  potentialCount: number
}

function normalize(str?: string | null): string {
  return (str || "").toLowerCase().trim()
}

function escapeRegex(str: string): string {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
}

export function filterJobs(jobs: AthynaJob[], params?: JobFilterParams): AthynaJob[] {
  if (!params) return jobs

  const q = normalize(params.q)
  const targetSeniority = normalize(params.seniority)
  const targetEmploymentType = normalize(params.employmentType)
  const targetCity = normalize(params.city)
  const targetCountry = normalize(params.country)

  const skillArray = Array.isArray(params.skills)
    ? params.skills.map((s) => normalize(s))
    : params.skills
    ? [normalize(params.skills)]
    : []

  let filtered = jobs.filter((job) => {
    // 1. Remote filter
    if (params.remote !== undefined && params.remote !== false) {
      if (!job.location.isRemote) {
        return false
      }
    }

    // 2. Seniority filter
    if (targetSeniority) {
      const jobSeniority = normalize(job.seniority)
      if (!jobSeniority.includes(targetSeniority) && !targetSeniority.includes(jobSeniority)) {
        return false
      }
    }

    // 3. Employment type filter
    if (targetEmploymentType) {
      const jobEmp = normalize(job.employmentType)
      const sanitizedTarget = targetEmploymentType.replace(/[- ]/g, "")
      const sanitizedJob = jobEmp.replace(/[- ]/g, "")
      if (!sanitizedJob.includes(sanitizedTarget) && !sanitizedTarget.includes(sanitizedJob)) {
        return false
      }
    }

    // 4. Skills filter (exact match or whole-word match to avoid false positives like "HTML" matching "ml")
    if (skillArray.length > 0) {
      const jobSkills = job.skills.map((s) => normalize(s))
      const matchesAllSkills = skillArray.every((reqSkill) =>
        jobSkills.some((jobSkill) => {
          if (jobSkill === reqSkill) return true
          const wordRegex = new RegExp(`\\b${escapeRegex(reqSkill)}\\b`, "i")
          return wordRegex.test(jobSkill)
        })
      )
      if (!matchesAllSkills) {
        return false
      }
    }

    // 5. City & Country
    if (targetCity && !normalize(job.location.city).includes(targetCity)) {
      return false
    }
    if (targetCountry && !normalize(job.location.country).includes(targetCountry)) {
      return false
    }

    // 6. Salary filters
    if (params.salary !== undefined) {
      if (job.salary?.max && job.salary.max < params.salary) return false
    }
    if (params.minSalary !== undefined && job.salary?.max && job.salary.max < params.minSalary) {
      return false
    }
    if (params.maxSalary !== undefined && job.salary?.min && job.salary.min > params.maxSalary) {
      return false
    }

    // 7. Published date filter
    if (params.publishedSince) {
      const sinceDate = new Date(params.publishedSince)
      const jobDate = new Date(job.publishedAt)
      if (!isNaN(sinceDate.getTime()) && !isNaN(jobDate.getTime()) && jobDate < sinceDate) {
        return false
      }
    }

    // 8. Free-text residual q (matches title, category, skills, company name)
    if (q) {
      const inTitle = normalize(job.title).includes(q)
      const inCompany = normalize(job.company.name).includes(q)
      const inCategory = normalize(job.category).includes(q)
      const inOverview = normalize(job.overview).includes(q)
      const inDescription = normalize(job.description).includes(q)
      const inSkills = job.skills.some((s) => normalize(s).includes(q))

      if (!inTitle && !inCompany && !inCategory && !inOverview && !inDescription && !inSkills) {
        return false
      }
    }

    return true
  })

  // 9. Sorting
  if (params.sortBy) {
    const sortMultiplier = params.sortOrder === "asc" ? 1 : -1
    filtered = [...filtered].sort((a, b) => {
      if (params.sortBy === "publishedAt") {
        return (new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()) * sortMultiplier
      }
      if (params.sortBy === "title") {
        return a.title.localeCompare(b.title) * sortMultiplier
      }
      if (params.sortBy === "salary") {
        const salaryA = a.salary?.max ?? a.salary?.min ?? 0
        const salaryB = b.salary?.max ?? b.salary?.min ?? 0
        return (salaryA - salaryB) * sortMultiplier
      }
      return 0
    })
  }

  // 10. Pagination
  if (params.pageSize !== undefined && params.pageSize > 0) {
    const pageNum = params.pageNumber && params.pageNumber > 0 ? params.pageNumber : 1
    const start = (pageNum - 1) * params.pageSize
    filtered = filtered.slice(start, start + params.pageSize)
  }

  return filtered
}

export function getRelaxationSuggestions(
  jobs: AthynaJob[],
  params: JobFilterParams
): RelaxationSuggestion[] {
  const suggestions: RelaxationSuggestion[] = []

  type Dimension = {
    key: "q" | "remote" | "seniority" | "employmentType" | "skills"
    hasFilter: boolean
    getLabel: () => string
  }

  const dimensions: Dimension[] = [
    {
      key: "q",
      hasFilter: Boolean(params.q),
      getLabel: () => `Remove keyword "${params.q}"`,
    },
    {
      key: "remote",
      hasFilter: Boolean(params.remote),
      getLabel: () => "Include on-site and hybrid roles",
    },
    {
      key: "seniority",
      hasFilter: Boolean(params.seniority),
      getLabel: () => `Search across all experience levels (relax "${params.seniority}")`,
    },
    {
      key: "employmentType",
      hasFilter: Boolean(params.employmentType),
      getLabel: () => `Search all job types (relax "${params.employmentType}")`,
    },
    {
      key: "skills",
      hasFilter: Boolean(params.skills && (Array.isArray(params.skills) ? params.skills.length > 0 : true)),
      getLabel: () => {
        const skillName = Array.isArray(params.skills) ? params.skills.join(", ") : params.skills
        return `Search without skill requirement (${skillName})`
      },
    },
  ]

  for (const dim of dimensions) {
    if (dim.hasFilter) {
      const relaxed: JobFilterParams = { ...params, [dim.key]: undefined }
      const count = filterJobs(jobs, relaxed).length
      if (count > 0) {
        suggestions.push({
          filterKey: dim.key,
          label: dim.getLabel(),
          relaxedFilters: relaxed,
          potentialCount: count,
        })
      }
    }
  }

  return suggestions
}
