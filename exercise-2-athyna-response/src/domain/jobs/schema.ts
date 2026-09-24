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
  .nullable()
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

export const athynaJobSchema = z
  .object({
    id: z.string(),
    slug: z.string().nullable().optional(),
    title: z.string(),
    url: z.string().nullable().optional().default(""),
    applicationUrl: z.string().nullable().optional().default(""),
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
    employmentType: z.string().nullable().optional().default("Full-time"),
    seniority: z.string().nullable().optional().default("Not specified"),
    category: z.string().nullable().optional(),
    experience: athynaJobExperienceSchema,
    salary: athynaJobSalarySchema,
    skills: z.array(z.string()).default([]),
    overview: z.string().nullable().optional(),
    description: z.string().nullable().optional().default(""),
    publishedAt: z.string().nullable().optional().default(() => new Date().toISOString()),
    updatedAt: z.string().nullable().optional(),
    matchIndex: z.number().optional().default(95),
  })
  .transform((job) => ({
    ...job,
    slug: job.slug || job.id,
    url: job.url || `https://develop.api.athyna.com/api/public/jobs/${job.id}`,
    applicationUrl:
      job.applicationUrl || job.url || `https://jobs.athyna.com/jobs/${job.id}/apply`,
    employmentType: job.employmentType || "Full-time",
    seniority: job.seniority || "Not specified",
    description: job.description || "",
    publishedAt: job.publishedAt || new Date().toISOString(),
  }))

export type AthynaJob = z.infer<typeof athynaJobSchema>

export const athynaPaginationSchema = z
  .object({
    pageNumber: z.number().optional().default(1),
    pageSize: z.number().optional().default(20),
    totalItems: z.number().optional(),
    totalPages: z.number().optional(),
    hasNextPage: z.boolean().optional(),
    hasPreviousPage: z.boolean().optional(),
  })
  .optional()

export const athynaJobsResponseSchema = z
  .union([
    z.array(athynaJobSchema).transform((jobs) => ({
      data: jobs,
      total: jobs.length,
      page: 1,
      pageSize: jobs.length,
      totalPages: 1,
    })),
    z
      .object({
        data: z.array(athynaJobSchema),
        pagination: athynaPaginationSchema,
        total: z.number().optional(),
        page: z.number().optional(),
        pageSize: z.number().optional(),
        totalPages: z.number().optional(),
      })
      .transform((res) => ({
        data: res.data,
        total: res.pagination?.totalItems ?? res.total ?? res.data.length,
        page: res.pagination?.pageNumber ?? res.page ?? 1,
        pageSize: res.pagination?.pageSize ?? res.pageSize ?? 20,
        totalPages:
          res.pagination?.totalPages ??
          res.totalPages ??
          Math.ceil(
            (res.pagination?.totalItems ?? res.total ?? res.data.length) /
              (res.pagination?.pageSize ?? res.pageSize ?? 20)
          ),
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
