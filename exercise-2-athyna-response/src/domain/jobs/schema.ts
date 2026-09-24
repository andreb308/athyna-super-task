import { z } from "zod"

export const athynaJobCompanySchema = z.object({
  name: z.string().default("Unknown Company"),
  logoUrl: z.string().nullable().optional().default(null),
  websiteUrl: z.string().nullable().optional().default(null),
})

export const athynaJobLocationSchema = z.object({
  city: z.string().nullable().optional().default(null),
  country: z.string().nullable().optional().default(null),
  locality: z.string().nullable().optional().default(null),
  isRemote: z.boolean().default(false),
})

export const athynaJobExperienceSchema = z
  .object({
    minYears: z.number().nullable().optional().default(null),
    maxYears: z.number().nullable().optional().default(null),
  })
  .optional()

export const athynaJobSalarySchema = z
  .object({
    min: z.number().nullable().optional().default(null),
    max: z.number().nullable().optional().default(null),
    currency: z.string().nullable().optional().default("USD"),
    period: z.string().nullable().optional().default("year"),
  })
  .nullable()
  .optional()
  .default(null)

export const athynaJobSchema = z
  .object({
    id: z.string(),
    slug: z.string().optional(),
    title: z.string(),
    url: z.string().optional().default(""),
    applicationUrl: z.string().default(""),
    company: athynaJobCompanySchema.default({
      name: "Athyna Partner",
      logoUrl: null,
      websiteUrl: null,
    }),
    location: athynaJobLocationSchema.default({
      city: null,
      country: null,
      locality: null,
      isRemote: false,
    }),
    employmentType: z.string().default("Full-time"),
    seniority: z.string().default("Mid-Level"),
    category: z.string().nullable().optional().default(null),
    experience: athynaJobExperienceSchema,
    salary: athynaJobSalarySchema,
    skills: z.array(z.string()).default([]),
    overview: z.string().nullable().optional().default(null),
    description: z.string().default(""),
    publishedAt: z.string(),
    updatedAt: z.string().optional().default(new Date().toISOString()),
    matchIndex: z.number().optional().default(95),
  })
  .transform((job) => ({
    ...job,
    slug: job.slug || job.id,
    url: job.url || `https://jobs.athyna.com/jobs/${job.id}`,
    applicationUrl: job.applicationUrl || `https://jobs.athyna.com/jobs/${job.id}/apply`,
  }))

export type AthynaJob = z.infer<typeof athynaJobSchema>

export const athynaJobsResponseSchema = z
  .union([
    z.array(athynaJobSchema).transform((jobs) => ({
      data: jobs,
      total: jobs.length,
      page: 1,
      pageSize: jobs.length,
      totalPages: 1,
    })),
    z.object({
      data: z.array(athynaJobSchema),
      total: z.number().optional(),
      page: z.number().optional().default(1),
      pageSize: z.number().optional().default(20),
      totalPages: z.number().optional(),
    }).transform((res) => ({
      data: res.data,
      total: res.total ?? res.data.length,
      page: res.page,
      pageSize: res.pageSize,
      totalPages: res.totalPages ?? Math.ceil((res.total ?? res.data.length) / (res.pageSize || 20)),
    })),
  ])

export type AthynaJobsResponse = z.infer<typeof athynaJobsResponseSchema>

export interface JobFilterParams {
  q?: string
  remote?: boolean
  skills?: string[] | string
  seniority?: string
  employmentType?: string
  city?: string
  country?: string
  minSalary?: number
  maxSalary?: number
  salary?: number
  publishedSince?: string
  sortBy?: "publishedAt" | "salary" | "title"
  sortOrder?: "asc" | "desc"
  pageSize?: number
  pageNumber?: number
}
