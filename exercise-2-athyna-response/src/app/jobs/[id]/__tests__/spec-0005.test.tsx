import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { JobDetailsClient } from "@/components/job-details/job-details-client"
import type { AthynaJob } from "@/domain/jobs"
import * as repo from "@/domain/jobs/jobs-repository"
import * as telemetry from "@/lib/telemetry"

/**
 * Tests for spec 0005: Job Detail Experience and Retention.
 *
 * Seams tested (per spec Testing Decisions):
 * 1. Scannable Summary Seam
 * 2. Post-Apply Shelf Seam
 * 3. Telemetry Dispatch Seam
 */

const sampleJob: AthynaJob = {
  id: "anthropic-legal",
  slug: "commercial-legal-specialist-technical-ai",
  title: "Commercial Legal Specialist, Technical AI Implementation",
  url: "https://develop.api.athyna.com/api/public/jobs/anthropic-legal",
  applicationUrl:
    "https://boards.anthropic.com/jobs/commercial-legal-specialist",
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
  skills: ["AI", "Compliance", "Contract Negotiation", "SaaS"],
  overview: "Help scale technical AI deployments.",
  description: "Full description of commercial legal specialist...",
  publishedAt: "2026-09-23T10:00:00.000Z",
  updatedAt: "2026-09-23T10:00:00.000Z",
  matchIndex: 95,
}

const similarJob: AthynaJob = {
  ...sampleJob,
  id: "anthropic-safeguards",
  slug: "program-manager-safeguards",
  title: "Program Manager, Safeguards Workforce Operations",
  seniority: "Lead",
}

describe("Spec 0005: Scannable Summary Seam", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    repo.clearJobsCache()
    localStorage.clear()
  })

  it("renders above-the-fold At a Glance badges with remote status, salary, employment type, and top skills", () => {
    render(<JobDetailsClient id={sampleJob.id} initialJob={sampleJob} />)

    const badges = screen.getByTestId("at-a-glance-badges")
    expect(badges).toBeInTheDocument()

    // Remote status badge
    expect(screen.getByTestId("remote-status-badge")).toHaveTextContent(
      "Remote"
    )

    // Compensation badge
    expect(screen.getByTestId("compensation-badge")).toHaveTextContent(
      "$195k-$220k"
    )

    // Employment type
    expect(badges).toHaveTextContent("Full-time")

    // Top 4 skill tags
    expect(badges).toHaveTextContent("AI")
    expect(badges).toHaveTextContent("Compliance")
    expect(badges).toHaveTextContent("Contract Negotiation")
    expect(badges).toHaveTextContent("SaaS")
  })

  it("shows On-site badge for non-remote jobs", () => {
    const onsiteJob: AthynaJob = {
      ...sampleJob,
      location: {
        ...sampleJob.location,
        isRemote: false,
      },
    }
    render(<JobDetailsClient id={onsiteJob.id} initialJob={onsiteJob} />)

    expect(screen.getByTestId("remote-status-badge")).toHaveTextContent(
      "On-site"
    )
  })
})

describe("Spec 0005: Post-Apply Shelf Seam", () => {
  let windowOpenSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.restoreAllMocks()
    repo.clearJobsCache()
    localStorage.clear()
    windowOpenSpy = vi
      .spyOn(window, "open")
      .mockImplementation(() => null)
  })

  afterEach(() => {
    windowOpenSpy.mockRestore()
  })

  it("clicking Apply opens external URL and shows post-apply dialog with similar roles", async () => {
    vi.spyOn(repo, "getJobs").mockResolvedValueOnce({
      jobs: [sampleJob, similarJob],
      total: 2,
      source: "live_api",
    })

    render(<JobDetailsClient id={sampleJob.id} initialJob={sampleJob} />)

    // Wait for similar jobs to load
    await waitFor(() => {
      expect(screen.getByTestId("similar-roles-shelf")).toBeInTheDocument()
    })

    // Click the primary Apply button
    const applyBtn = screen.getByTestId("primary-apply-button")
    fireEvent.click(applyBtn)

    // Verify external URL was opened
    expect(windowOpenSpy).toHaveBeenCalledWith(
      sampleJob.applicationUrl,
      "_blank",
      "noopener,noreferrer"
    )

    // Verify post-apply dialog appears
    await waitFor(() => {
      expect(screen.getByTestId("post-apply-dialog")).toBeInTheDocument()
      expect(
        screen.getByText("Application opened in new tab!")
      ).toBeInTheDocument()
    })

    // Verify dialog shows similar roles
    const dialogSimilarJobs = screen.getAllByTestId("post-apply-similar-job")
    expect(dialogSimilarJobs.length).toBeGreaterThanOrEqual(1)
  })

  it("Apply button text changes to Applied state after clicking", async () => {
    render(<JobDetailsClient id={sampleJob.id} initialJob={sampleJob} />)

    const applyBtn = screen.getByTestId("primary-apply-button")
    fireEvent.click(applyBtn)

    expect(applyBtn).toHaveTextContent("Applied (Open Application)")
  })
})

describe("Spec 0005: Telemetry Dispatch Seam", () => {
  let events: Array<{ name: string; payload: unknown }>
  let unsubscribe: () => void

  beforeEach(() => {
    vi.restoreAllMocks()
    repo.clearJobsCache()
    localStorage.clear()
    events = []
    unsubscribe = telemetry.onTelemetry((name, payload) => {
      events.push({ name, payload })
    })
  })

  afterEach(() => {
    unsubscribe()
  })

  it("emits job_detail_viewed with correct job_id and device on mount", async () => {
    render(<JobDetailsClient id={sampleJob.id} initialJob={sampleJob} />)

    await waitFor(() => {
      const viewEvents = events.filter(
        (e) => e.name === "job_detail_viewed"
      )
      expect(viewEvents.length).toBe(1)
      const payload = viewEvents[0].payload as telemetry.JobDetailViewedEvent
      expect(payload.job_id).toBe(sampleJob.id)
      expect(["mobile", "desktop"]).toContain(payload.device)
      expect(["direct_google", "search_list"]).toContain(payload.referrer)
    })
  })

  it("emits apply_cta_clicked with position body_bottom when primary Apply is clicked", async () => {
    const windowOpenSpy = vi
      .spyOn(window, "open")
      .mockImplementation(() => null)

    render(<JobDetailsClient id={sampleJob.id} initialJob={sampleJob} />)

    const applyBtn = screen.getByTestId("primary-apply-button")
    fireEvent.click(applyBtn)

    const applyEvents = events.filter(
      (e) => e.name === "apply_cta_clicked"
    )
    expect(applyEvents.length).toBe(1)
    const payload = applyEvents[0].payload as telemetry.ApplyCtaClickedEvent
    expect(payload.job_id).toBe(sampleJob.id)
    expect(payload.position).toBe("body_bottom")

    windowOpenSpy.mockRestore()
  })

  it("emits similar_job_clicked with source and target IDs when recommendation is clicked", async () => {
    vi.spyOn(repo, "getJobs").mockResolvedValueOnce({
      jobs: [sampleJob, similarJob],
      total: 2,
      source: "live_api",
    })

    render(<JobDetailsClient id={sampleJob.id} initialJob={sampleJob} />)

    await waitFor(() => {
      expect(screen.getByTestId("similar-roles-shelf")).toBeInTheDocument()
    })

    // Click the first similar role card
    const cards = screen.getAllByTestId("similar-role-card")
    fireEvent.click(cards[0])

    const clickEvents = events.filter(
      (e) => e.name === "similar_job_clicked"
    )
    expect(clickEvents.length).toBe(1)
    const payload =
      clickEvents[0].payload as telemetry.SimilarJobClickedEvent
    expect(payload.source_job_id).toBe(sampleJob.id)
    expect(payload.target_job_id).toBe(similarJob.id)
    expect(payload.position).toBe(0)
  })
})
