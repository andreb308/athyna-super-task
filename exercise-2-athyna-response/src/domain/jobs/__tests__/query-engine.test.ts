import { describe, it, expect } from "vitest"
import { filterJobs, getRelaxationSuggestions } from "../query-engine"
import type { AthynaJob } from "../schema"

const TEST_JOBS: AthynaJob[] = [
  {
    id: "job-1",
    slug: "senior-react-engineer",
    title: "Senior React Engineer",
    url: "https://athyna.com/jobs/job-1",
    applicationUrl: "https://athyna.com/apply/job-1",
    company: { name: "Athyna AI", logoUrl: null, websiteUrl: null },
    location: { city: "New York", country: "US", locality: "NY", isRemote: true },
    employmentType: "Full-time",
    seniority: "Senior",
    category: "Software Engineering",
    salary: { min: 160000, max: 200000, currency: "USD", period: "year" },
    skills: ["React", "TypeScript", "Node.js"],
    overview: "Senior React role in AI",
    description: "Build cutting-edge user interfaces",
    publishedAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-01-10T00:00:00.000Z",
    matchIndex: 96,
  },
  {
    id: "job-2",
    slug: "part-time-python-dev",
    title: "Python Machine Learning Developer",
    url: "https://athyna.com/jobs/job-2",
    applicationUrl: "https://athyna.com/apply/job-2",
    company: { name: "OpenData Labs", logoUrl: null, websiteUrl: null },
    location: { city: "London", country: "UK", locality: "Greater London", isRemote: false },
    employmentType: "Part-time",
    seniority: "Mid",
    category: "Machine Learning",
    salary: { min: 80000, max: 100000, currency: "USD", period: "year" },
    skills: ["Python", "ML", "PyTorch"],
    overview: "Part-time ML role",
    description: "Train models and pipelines",
    publishedAt: "2026-01-12T00:00:00.000Z",
    updatedAt: "2026-01-12T00:00:00.000Z",
    matchIndex: 92,
  },
  {
    id: "job-3",
    slug: "associate-qa-analyst",
    title: "Associate QA Automation Engineer",
    url: "https://athyna.com/jobs/job-3",
    applicationUrl: "https://athyna.com/apply/job-3",
    company: { name: "CloudScale", logoUrl: null, websiteUrl: null },
    location: { city: null, country: null, locality: null, isRemote: true },
    employmentType: "Contract",
    seniority: "Associate",
    category: "Quality Assurance",
    salary: { min: 70000, max: 90000, currency: "USD", period: "year" },
    skills: ["QA", "Cypress", "TypeScript"],
    overview: "QA automation role",
    description: "Write automated tests",
    publishedAt: "2026-01-14T00:00:00.000Z",
    updatedAt: "2026-01-14T00:00:00.000Z",
    matchIndex: 88,
  },
]

describe("In-Memory Query Engine", () => {
  it("filters by isRemote boolean flag", () => {
    const results = filterJobs(TEST_JOBS, { remote: true })
    expect(results).toHaveLength(2)
    expect(results.every((j) => j.location.isRemote)).toBe(true)
  })

  it("filters by employmentType case-insensitively", () => {
    const results = filterJobs(TEST_JOBS, { employmentType: "part-time" })
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe("job-2")
  })

  it("filters by skill", () => {
    const results = filterJobs(TEST_JOBS, { skills: ["React"] })
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe("job-1")
  })

  it("filters by seniority level", () => {
    const results = filterJobs(TEST_JOBS, { seniority: "Associate" })
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe("job-3")
  })

  it("filters by residual free-text keyword 'q' across title, company, skills", () => {
    const r1 = filterJobs(TEST_JOBS, { q: "CloudScale" })
    expect(r1).toHaveLength(1)
    expect(r1[0].id).toBe("job-3")

    const r2 = filterJobs(TEST_JOBS, { q: "interfaces" })
    expect(r2).toHaveLength(1)
    expect(r2[0].id).toBe("job-1")
  })

  it("combines multiple filter predicates correctly", () => {
    const results = filterJobs(TEST_JOBS, {
      remote: true,
      seniority: "Senior",
      skills: ["React"],
    })
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe("job-1")
  })

  it("generates actionable relaxation suggestions when query yields zero results", () => {
    // Ultra-specific impossible combination: Senior + Part-time + React
    const applied = {
      remote: true,
      seniority: "Senior",
      employmentType: "Part-time",
      skills: ["React"],
    }
    const filtered = filterJobs(TEST_JOBS, applied)
    expect(filtered).toHaveLength(0)

    const suggestions = getRelaxationSuggestions(TEST_JOBS, applied)
    expect(suggestions.length).toBeGreaterThan(0)
    // Relaxing employmentType should yield job-1 (Senior + Remote + React)
    const empSuggestion = suggestions.find((s) => s.filterKey === "employmentType")
    expect(empSuggestion).toBeDefined()
    expect(empSuggestion?.potentialCount).toBe(1)
  })
})
