import * as React from "react"
import { render, screen, fireEvent, within, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import Home from "../page"
import * as repo from "@/domain/jobs/jobs-repository"
import type { AthynaJob } from "@/domain/jobs"

describe("Home Page", () => {
  const TEST_JOBS: AthynaJob[] = [
    {
      id: "ath-legal",
      slug: "commercial-legal-specialist-technical-ai",
      title: "Commercial Legal Specialist, Technical AI Implementation",
      url: "https://develop.api.athyna.com/api/public/jobs/ath-legal",
      applicationUrl: "https://boards.anthropic.com/jobs/commercial-legal-specialist",
      company: { name: "Anthropic", logoUrl: null, websiteUrl: null },
      location: { city: "San Francisco", country: "United States", locality: "California", isRemote: true },
      employmentType: "Full-time",
      seniority: "Associate",
      skills: ["AI", "Compliance"],
      overview: "Commercial legal specialist overview",
      description: "Full description...",
      publishedAt: "2026-09-24T00:00:00Z",
      matchIndex: 95,
    },
    {
      id: "mistral-ai",
      slug: "ai-deployment-strategist",
      title: "AI Deployment Strategist",
      url: "https://develop.api.athyna.com/api/public/jobs/mistral-ai",
      applicationUrl: "https://mistral.ai/careers",
      company: { name: "Mistral", logoUrl: null, websiteUrl: null },
      location: { city: "Paris", country: "France", locality: "Île-de-France", isRemote: false },
      employmentType: "Full-time",
      seniority: "Lead",
      skills: ["AI", "AI Engineer", "Deployment"],
      overview: "AI strategist overview",
      description: "Full description...",
      publishedAt: "2026-09-24T00:00:00Z",
      matchIndex: 92,
    },
    {
      id: "nlp-part-time",
      slug: "part-time-nlp-python-researcher",
      title: "Part-time NLP Python Researcher",
      url: "https://develop.api.athyna.com/api/public/jobs/nlp-part-time",
      applicationUrl: "https://example.com/apply",
      company: { name: "ResearchLab", logoUrl: null, websiteUrl: null },
      location: { city: "Remote", country: null, locality: null, isRemote: true },
      employmentType: "Part-time",
      seniority: "Mid",
      skills: ["NLP", "Python"],
      overview: "Part-time NLP researcher",
      description: "Full description...",
      publishedAt: "2026-09-24T00:00:00Z",
      matchIndex: 88,
    },
    {
      id: "react-fullstack",
      slug: "lead-react-full-stack-engineer",
      title: "Lead React Full-Stack Engineer",
      url: "https://develop.api.athyna.com/api/public/jobs/react-fullstack",
      applicationUrl: "https://example.com/apply",
      company: { name: "ScaleUp", logoUrl: null, websiteUrl: null },
      location: { city: "New York", country: "United States", locality: null, isRemote: true },
      employmentType: "Full-time",
      seniority: "Lead",
      skills: ["React", "TypeScript", "Node.js"],
      overview: "Lead React engineer",
      description: "Full description...",
      publishedAt: "2026-09-24T00:00:00Z",
      matchIndex: 90,
    },
    {
      id: "senior-python-remote",
      slug: "senior-remote-python-inference-engineer",
      title: "Senior Remote Python & Inference Engineer",
      url: "https://develop.api.athyna.com/api/public/jobs/senior-python-remote",
      applicationUrl: "https://example.com/apply",
      company: { name: "InferenceCore", logoUrl: null, websiteUrl: null },
      location: { city: "Remote", country: null, locality: null, isRemote: true },
      employmentType: "Full-time",
      seniority: "Senior",
      skills: ["Python", "Inference", "AI"],
      overview: "Senior Python & Inference",
      description: "Full description...",
      publishedAt: "2026-09-24T00:00:00Z",
      matchIndex: 97,
    },
  ]

  beforeEach(() => {
    vi.restoreAllMocks()
    repo.clearJobsCache()
    vi.spyOn(repo, "getJobs").mockResolvedValue({
      jobs: TEST_JOBS,
      total: TEST_JOBS.length,
      source: "live_api",
    })
  })

  it("renders hero headline and search input without featured roles tabbed section", async () => {
    render(<Home />)

    // Hero elements
    expect(screen.getByRole("heading", { level: 1, name: /be the future of/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/what job are you looking for today\?/i)).toBeInTheDocument()

    // Wait for dynamic API jobs to load into table
    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument()
      expect(screen.getByText(/commercial legal specialist/i)).toBeInTheDocument()
    })

    // Verify Featured Roles tabbed section is NOT present
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument()
    expect(screen.queryByRole("tab", { name: /hot jobs/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("tab", { name: /recommended/i })).not.toBeInTheDocument()

    // Verify Unlock All Jobs CTA is present
    expect(screen.getByRole("button", { name: /unlock all jobs/i })).toBeInTheDocument()
  })

  it("filters jobs when submitting search in table filter input form", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument()
    })

    const tableInput = screen.getByPlaceholderText(/search for jobs/i)
    fireEvent.change(tableInput, { target: { value: "Mistral" } })

    // Verify it has not filtered/queried yet before pressing Search
    expect(screen.getByText(/Commercial Legal Specialist/i)).toBeInTheDocument()

    // Press Search button
    const searchJobsBtn = screen.getByRole("button", { name: /search jobs/i })
    fireEvent.click(searchJobsBtn)

    await waitFor(() => {
      expect(screen.getByText(/AI Deployment Strategist/i)).toBeInTheDocument()
      expect(screen.queryByText(/Commercial Legal Specialist/i)).not.toBeInTheDocument()
    })
  })

  it("does not query on each text change until Search button is pressed", async () => {
    const getJobsSpy = vi.spyOn(repo, "getJobs")
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument()
    })

    const initialCallCount = getJobsSpy.mock.calls.length

    const tableInput = screen.getByPlaceholderText(/search for jobs/i)
    // Simulate typing character by character
    fireEvent.change(tableInput, { target: { value: "M" } })
    fireEvent.change(tableInput, { target: { value: "Mi" } })
    fireEvent.change(tableInput, { target: { value: "Mis" } })
    fireEvent.change(tableInput, { target: { value: "Mistral" } })

    // Ensure getJobs was NOT called on each keystroke
    expect(getJobsSpy.mock.calls.length).toBe(initialCallCount)

    // Press Search button
    const searchJobsBtn = screen.getByRole("button", { name: /search jobs/i })
    fireEvent.click(searchJobsBtn)

    await waitFor(() => {
      expect(getJobsSpy.mock.calls.length).toBeGreaterThan(initialCallCount)
    })
  })

  it("renders unlock all jobs CTA button", async () => {
    render(<Home />)
    await waitFor(() => {
      const unlockButton = screen.getByRole("button", { name: /unlock all jobs/i })
      expect(unlockButton).toBeInTheDocument()
    })
  })

  it("filters jobs when clicking popular search tag", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument()
    })

    const tag = screen.getByRole("button", { name: "AI Engineer" })
    fireEvent.click(tag)

    await waitFor(() => {
      expect(screen.getByText(/AI Deployment Strategist/i)).toBeInTheDocument()
    })
  })

  it("extracts intent when searching 'remote' in hero search, auto-promotes chip, and filters remote roles", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument()
    })

    const heroInput = screen.getByPlaceholderText(/what job are you looking for today\?/i)
    fireEvent.change(heroInput, { target: { value: "remote" } })
    fireEvent.submit(heroInput.closest("form")!)

    // Filter chip promoted
    const activeFiltersRegion = screen.getByRole("region", { name: /active search filters/i })
    expect(within(activeFiltersRegion).getByText("Remote")).toBeInTheDocument()
  })

  it("extracts intent when searching 'part time' and surfaces part-time roles", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument()
    })

    const heroInput = screen.getByPlaceholderText(/what job are you looking for today\?/i)
    fireEvent.change(heroInput, { target: { value: "part time" } })
    fireEvent.submit(heroInput.closest("form")!)

    const activeFiltersRegion = screen.getByRole("region", { name: /active search filters/i })
    expect(within(activeFiltersRegion).getByText("Part-time")).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(/part-time nlp python researcher/i)).toBeInTheDocument()
    })
  })

  it("extracts intent when searching 'React' and surfaces React roles", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument()
    })

    const heroInput = screen.getByPlaceholderText(/what job are you looking for today\?/i)
    fireEvent.change(heroInput, { target: { value: "React" } })
    fireEvent.submit(heroInput.closest("form")!)

    const activeFiltersRegion = screen.getByRole("region", { name: /active search filters/i })
    expect(within(activeFiltersRegion).getByText("Skill: React")).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(/lead react full-stack engineer/i)).toBeInTheDocument()
    })
  })

  it("extracts compound query 'senior remote python' into structured filter chips and allows dismissing chip", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument()
    })

    const heroInput = screen.getByPlaceholderText(/what job are you looking for today\?/i)
    fireEvent.change(heroInput, { target: { value: "senior remote python" } })
    fireEvent.submit(heroInput.closest("form")!)

    const activeFiltersRegion = screen.getByRole("region", { name: /active search filters/i })
    expect(within(activeFiltersRegion).getByText("Remote")).toBeInTheDocument()
    expect(within(activeFiltersRegion).getByText("Senior")).toBeInTheDocument()
    expect(within(activeFiltersRegion).getByText("Skill: Python")).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText(/senior remote python & inference engineer/i)).toBeInTheDocument()
    })

    // Dismissing chip relaxes filter
    const dismissPythonBtn = screen.getByRole("button", { name: /remove filter skill: python/i })
    fireEvent.click(dismissPythonBtn)

    expect(screen.queryByText("Skill: Python")).not.toBeInTheDocument()
  })

  it("displays zero-result fallback with actionable relaxation recommendations and allows one-click recovery", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument()
    })

    const tableInput = screen.getByPlaceholderText(/search for jobs/i)
    fireEvent.change(tableInput, { target: { value: "impossiblequantumxyzjob" } })
    const searchJobsBtn = screen.getByRole("button", { name: /search jobs/i })
    fireEvent.click(searchJobsBtn)

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /no matching roles found/i })).toBeInTheDocument()
    })
    expect(screen.getByRole("button", { name: /remove keyword "impossiblequantumxyzjob"/i })).toBeInTheDocument()

    // One-click relaxation restores results
    const relaxBtn = screen.getByRole("button", { name: /remove keyword "impossiblequantumxyzjob"/i })
    fireEvent.click(relaxBtn)

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: /no matching roles found/i })).not.toBeInTheDocument()
      expect(screen.getByRole("table")).toBeInTheDocument()
    })
  })

  it("extracts intent and auto-promotes chips when submitting 'remote' in the table search input", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument()
    })

    const tableInput = screen.getByPlaceholderText(/search for jobs/i)
    fireEvent.change(tableInput, { target: { value: "remote" } })
    const searchJobsBtn = screen.getByRole("button", { name: /search jobs/i })
    fireEvent.click(searchJobsBtn)

    const activeFiltersRegion = screen.getByRole("region", { name: /active search filters/i })
    expect(within(activeFiltersRegion).getByText("Remote")).toBeInTheDocument()

    await waitFor(() => {
      // Non-remote job (Mistral in Paris, isRemote: false) should not be visible
      expect(screen.queryByText(/AI Deployment Strategist/i)).not.toBeInTheDocument()
      // Remote job should be visible
      expect(screen.getByText(/Commercial Legal Specialist/i)).toBeInTheDocument()
    })
  })

  it("clears prior chips when clicking a popular search term without intent chips", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument()
    })

    // First search 'remote' in hero
    const heroInput = screen.getByPlaceholderText(/what job are you looking for today\?/i)
    fireEvent.change(heroInput, { target: { value: "remote" } })
    fireEvent.submit(heroInput.closest("form")!)

    const activeFiltersRegion = screen.getByRole("region", { name: /active search filters/i })
    expect(within(activeFiltersRegion).getByText("Remote")).toBeInTheDocument()

    // Then click popular search 'Product Manager'
    const pmTag = screen.getByRole("button", { name: "Product Manager" })
    fireEvent.click(pmTag)

    // Remote chip should be cleared
    expect(screen.queryByRole("region", { name: /active search filters/i })).not.toBeInTheDocument()
  })

  it("relaxes skill filter when clicking relaxation suggestion for skills", async () => {
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument()
    })

    // Search for a skill + nonexistent keyword so it yields zero results
    const heroInput = screen.getByPlaceholderText(/what job are you looking for today\?/i)
    fireEvent.change(heroInput, { target: { value: "React nonexistentroletextxyz" } })
    fireEvent.submit(heroInput.closest("form")!)

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /no matching roles found/i })).toBeInTheDocument()
    })

    const relaxKeywordBtn = screen.getByRole("button", {
      name: /remove keyword "nonexistentroletextxyz"/i,
    })
    fireEvent.click(relaxKeywordBtn)

    await waitFor(() => {
      expect(screen.getByText(/lead react full-stack engineer/i)).toBeInTheDocument()
    })
  })
})
