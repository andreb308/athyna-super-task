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

  return jobs.filter((job) => {
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

    // 4. Skills filter (job must include at least all requested skills, or match skill array)
    if (skillArray.length > 0) {
      const jobSkills = job.skills.map((s) => normalize(s))
      const matchesAllSkills = skillArray.every((reqSkill) =>
        jobSkills.some((js) => js.includes(reqSkill) || reqSkill.includes(js))
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

    // 6. Salary
    if (params.minSalary !== undefined && job.salary?.max && job.salary.max < params.minSalary) {
      return false
    }
    if (params.maxSalary !== undefined && job.salary?.min && job.salary.min > params.maxSalary) {
      return false
    }

    // 7. Free-text residual q
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
}

export function getRelaxationSuggestions(
  jobs: AthynaJob[],
  params: JobFilterParams
): RelaxationSuggestion[] {
  const suggestions: RelaxationSuggestion[] = []

  // Check relaxing q
  if (params.q) {
    const relaxed: JobFilterParams = { ...params, q: undefined }
    const count = filterJobs(jobs, relaxed).length
    if (count > 0) {
      suggestions.push({
        filterKey: "q",
        label: `Remove keyword "${params.q}"`,
        relaxedFilters: relaxed,
        potentialCount: count,
      })
    }
  }

  // Check relaxing remote
  if (params.remote) {
    const relaxed: JobFilterParams = { ...params, remote: undefined }
    const count = filterJobs(jobs, relaxed).length
    if (count > 0) {
      suggestions.push({
        filterKey: "remote",
        label: "Include on-site and hybrid roles",
        relaxedFilters: relaxed,
        potentialCount: count,
      })
    }
  }

  // Check relaxing seniority
  if (params.seniority) {
    const relaxed: JobFilterParams = { ...params, seniority: undefined }
    const count = filterJobs(jobs, relaxed).length
    if (count > 0) {
      suggestions.push({
        filterKey: "seniority",
        label: `Search across all experience levels (relax "${params.seniority}")`,
        relaxedFilters: relaxed,
        potentialCount: count,
      })
    }
  }

  // Check relaxing employmentType
  if (params.employmentType) {
    const relaxed: JobFilterParams = { ...params, employmentType: undefined }
    const count = filterJobs(jobs, relaxed).length
    if (count > 0) {
      suggestions.push({
        filterKey: "employmentType",
        label: `Search all job types (relax "${params.employmentType}")`,
        relaxedFilters: relaxed,
        potentialCount: count,
      })
    }
  }

  // Check relaxing skills
  if (params.skills && (Array.isArray(params.skills) ? params.skills.length > 0 : true)) {
    const relaxed: JobFilterParams = { ...params, skills: undefined }
    const count = filterJobs(jobs, relaxed).length
    if (count > 0) {
      const skillName = Array.isArray(params.skills) ? params.skills.join(", ") : params.skills
      suggestions.push({
        filterKey: "skills",
        label: `Search without skill requirement (${skillName})`,
        relaxedFilters: relaxed,
        potentialCount: count,
      })
    }
  }

  return suggestions
}
