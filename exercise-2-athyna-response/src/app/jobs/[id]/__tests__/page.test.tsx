import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { JobDetailsClient } from "@/components/job-details/job-details-client"
import type { AthynaJob } from "@/domain/jobs"
import * as repo from "@/domain/jobs/jobs-repository"

describe("JobDetailsClient (Dynamic Athyna Job Details)", () => {
  const sampleJob: AthynaJob = {
    id: "anthropic-legal",
    slug: "commercial-legal-specialist-technical-ai",
    title: "Commercial Legal Specialist, Technical AI Implementation",
    url: "https://develop.api.athyna.com/api/public/jobs/anthropic-legal",
    applicationUrl: "https://boards.anthropic.com/jobs/commercial-legal-specialist",
    company: {
      name: "Anthropic",
      logoUrl: null,
      websiteUrl: "https://anthropic.com",
    },
    location: {
      city: "San Francisco",
      country: "United States",
      locality: "California",
      isRemote: true,
    },
    employmentType: "Full-time",
    seniority: "Associate",
    category: "Legal & Operations",
    salary: {
      min: 195000,
      max: 220000,
      currency: "USD",
      period: "year",
    },
    skills: ["AI", "Compliance", "Contract Negotiation"],
    overview: "Help scale technical AI deployments.",
    description: "Full description of commercial legal specialist...",
    publishedAt: "2026-09-23T10:00:00.000Z",
    updatedAt: "2026-09-23T10:00:00.000Z",
    matchIndex: 95,
  }

  const secondJob: AthynaJob = {
    ...sampleJob,
    id: "anthropic-safeguards",
    slug: "program-manager-safeguards",
    title: "Program Manager, Safeguards Workforce Operations",
    seniority: "Lead",
  }

  beforeEach(() => {
    vi.restoreAllMocks()
    repo.clearJobsCache()
    localStorage.clear()
  })

  it("renders all dynamic job attributes correctly", async () => {
    render(<JobDetailsClient id={sampleJob.id} initialJob={sampleJob} />)

    // Job title
    expect(screen.getByTestId("job-title")).toHaveTextContent(sampleJob.title)

    // Company link / handle
    expect(screen.getByText(`@${sampleJob.company.name}`)).toBeInTheDocument()

    // Spec overview 4 columns
    const specCard = screen.getByTestId("spec-overview-card")
    expect(specCard).toBeInTheDocument()
    expect(specCard).toHaveTextContent("Location")
    expect(specCard).toHaveTextContent("Employment")
    expect(specCard).toHaveTextContent("Experience")
    expect(specCard).toHaveTextContent("Salary")
    expect(specCard).toHaveTextContent(sampleJob.employmentType)
    expect(specCard).toHaveTextContent(sampleJob.seniority)

    // Description & Skills
    const descriptionView = screen.getByTestId("job-description-view")
    expect(descriptionView).toBeInTheDocument()
    sampleJob.skills.forEach((skill) => {
      expect(screen.getAllByText(skill).length).toBeGreaterThanOrEqual(1)
    })

    // Primary CTA Apply button
    const applyBtn = screen.getByTestId("primary-apply-button")
    expect(applyBtn).toBeInTheDocument()
    expect(applyBtn).toHaveAttribute("href", sampleJob.applicationUrl)
  })

  it("toggles Save and Mark as Applied states and stores in localStorage", async () => {
    render(<JobDetailsClient id={sampleJob.id} initialJob={sampleJob} />)

    const saveBtn = screen.getByRole("button", { name: /^save$/i })
    expect(saveBtn).toBeInTheDocument()

    // Click save
    fireEvent.click(saveBtn)
    expect(screen.getByRole("button", { name: /^saved$/i })).toBeInTheDocument()

    const savedFromStorage = JSON.parse(
      localStorage.getItem("athyna_saved_jobs") || "{}"
    )
    expect(savedFromStorage[sampleJob.id]).toBe(true)

    // Click mark as applied
    const appliedBtn = screen.getByRole("button", { name: /mark as applied/i })
    fireEvent.click(appliedBtn)
    expect(screen.getByRole("button", { name: /^applied$/i })).toBeInTheDocument()

    const appliedFromStorage = JSON.parse(
      localStorage.getItem("athyna_applied_jobs") || "{}"
    )
    expect(appliedFromStorage[sampleJob.id]).toBe(true)
  })

  it("renders contextual Similar Roles Shelf with related jobs", async () => {
    vi.spyOn(repo, "getJobs").mockResolvedValueOnce({
      jobs: [sampleJob, secondJob],
      total: 2,
      source: "live_api",
    })

    render(<JobDetailsClient id={sampleJob.id} initialJob={sampleJob} />)

    await waitFor(() => {
      const shelf = screen.getByTestId("similar-roles-shelf")
      expect(shelf).toBeInTheDocument()
      expect(
        screen.getByText(/Similar Roles You Qualify For/i)
      ).toBeInTheDocument()
    })
  })

  it("renders JobNotFound error state when invalid job ID is requested", async () => {
    vi.spyOn(repo, "getJobById").mockRejectedValueOnce(
      new Error("Job not found: invalid-xyz")
    )

    render(<JobDetailsClient id="invalid-xyz" />)

    await waitFor(() => {
      expect(screen.getByTestId("job-not-found")).toBeInTheDocument()
      expect(screen.getByText(/Job not found/i)).toBeInTheDocument()
      expect(screen.getByText(/invalid-xyz/i)).toBeInTheDocument()
    })
  })

  it("renders dynamic data for a completely different job", async () => {
    render(<JobDetailsClient id={secondJob.id} initialJob={secondJob} />)

    expect(screen.getByTestId("job-title")).toHaveTextContent(secondJob.title)
    expect(screen.getByTestId("spec-overview-card")).toHaveTextContent(
      secondJob.seniority
    )
  })
})
