import { describe, it, expect } from "vitest"
import {
  athynaJobSchema,
  athynaJobsResponseSchema,
  type AthynaJob,
  type AthynaJobsResponse,
} from "../schema"

describe("Athyna Jobs Zod Schemas", () => {
  const validJob: AthynaJob = {
    id: "job-1",
    slug: "senior-react-engineer",
    title: "Senior React Engineer",
    url: "https://athyna.com/jobs/job-1",
    applicationUrl: "https://athyna.com/apply/job-1",
    company: {
      name: "Acme Corp",
      logoUrl: "https://acme.corp/logo.png",
      websiteUrl: "https://acme.corp",
    },
    location: {
      city: "San Francisco",
      country: "United States",
      locality: "California",
      isRemote: true,
    },
    employmentType: "Full-time",
    seniority: "Senior",
    category: "Engineering",
    experience: {
      minYears: 5,
      maxYears: 8,
    },
    salary: {
      min: 150000,
      max: 180000,
      currency: "USD",
      period: "year",
    },
    skills: ["React", "TypeScript", "Node.js"],
    overview: "We are looking for a Senior React Engineer.",
    description: "Detailed description of the role...",
    publishedAt: "2026-01-15T00:00:00.000Z",
    updatedAt: "2026-01-16T00:00:00.000Z",
    matchIndex: 95,
  }

  it("validates a complete AthynaJob object", () => {
    const parsed = athynaJobSchema.parse(validJob)
    expect(parsed.id).toBe("job-1")
    expect(parsed.title).toBe("Senior React Engineer")
    expect(parsed.location.isRemote).toBe(true)
    expect(parsed.skills).toContain("React")
  })

  it("applies sensible defaults for optional or missing fields", () => {
    const minimalJob = {
      id: "job-min",
      title: "Software Engineer",
      applicationUrl: "https://athyna.com/apply/job-min",
      company: {
        name: "Minimal Inc",
      },
      location: {
        city: null,
      },
      employmentType: "Full-time",
      seniority: "Mid",
      publishedAt: "2026-01-01T00:00:00Z",
    }

    const parsed = athynaJobSchema.parse(minimalJob)
    expect(parsed.id).toBe("job-min")
    expect(parsed.slug).toBe("job-min")
    expect(parsed.location.isRemote).toBe(false)
    expect(parsed.skills).toEqual([])
    expect(parsed.description).toBe("")
  })

  it("rejects jobs missing required fields like id or title", () => {
    const invalidJob = {
      title: "Missing ID",
    }
    expect(() => athynaJobSchema.parse(invalidJob)).toThrow()
  })

  it("validates an AthynaJobsResponse object with data array and pagination metadata", () => {
    const responsePayload: AthynaJobsResponse = {
      data: [validJob],
      total: 1,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    }

    const parsed = athynaJobsResponseSchema.parse(responsePayload)
    expect(parsed.data).toHaveLength(1)
    expect(parsed.total).toBe(1)
  })

  it("coerces a raw array response into the normalized AthynaJobsResponse shape", () => {
    const rawArray = [validJob]
    const parsed = athynaJobsResponseSchema.parse(rawArray)
    expect(parsed.data).toHaveLength(1)
    expect(parsed.total).toBe(1)
    expect(parsed.data[0].id).toBe("job-1")
  })

  it("ensures MOCK_ATHYNA_JOBS has <= 20 items and all pass schema validation", async () => {
    const { MOCK_ATHYNA_JOBS } = await import("../mock-dataset")
    expect(MOCK_ATHYNA_JOBS.length).toBeGreaterThan(0)
    expect(MOCK_ATHYNA_JOBS.length).toBeLessThanOrEqual(20)
    for (const job of MOCK_ATHYNA_JOBS) {
      expect(athynaJobSchema.parse(job)).toBeDefined()
    }
  })
})
