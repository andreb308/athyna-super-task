import * as React from "react"
import { render, screen, fireEvent, within } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import Home from "../page"

describe("Home Page", () => {
  it("renders hero headline and search input without featured roles tabbed section", () => {
    render(<Home />)

    // Hero elements
    expect(screen.getByRole("heading", { level: 1, name: /be the future of/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/what job are you looking for today\?/i)).toBeInTheDocument()

    // Table elements
    expect(screen.getByPlaceholderText(/search for jobs/i)).toBeInTheDocument()
    expect(screen.getByRole("table")).toBeInTheDocument()
    expect(screen.getByText(/commercial legal specialist/i)).toBeInTheDocument()

    // Verify Featured Roles tabbed section is NOT present
    expect(screen.queryByRole("tablist")).not.toBeInTheDocument()
    expect(screen.queryByRole("tab", { name: /hot jobs/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("tab", { name: /recommended/i })).not.toBeInTheDocument()

    // Verify Unlock All Jobs CTA is present
    expect(screen.getByRole("button", { name: /unlock all jobs/i })).toBeInTheDocument()
  })

  it("filters jobs when typing in table filter input", () => {
    render(<Home />)

    const tableInput = screen.getByPlaceholderText(/search for jobs/i)
    fireEvent.change(tableInput, { target: { value: "Mistral" } })

    expect(screen.getByText(/AI Deployment Strategist/i)).toBeInTheDocument()
    expect(screen.queryByText(/Commercial Legal Specialist/i)).not.toBeInTheDocument()
  })

  it("renders unlock all jobs CTA button", () => {
    render(<Home />)
    const unlockButton = screen.getByRole("button", { name: /unlock all jobs/i })
    expect(unlockButton).toBeInTheDocument()
  })

  it("filters jobs when clicking popular search tag", () => {
    render(<Home />)

    const tag = screen.getByRole("button", { name: "AI Engineer" })
    fireEvent.click(tag)

    expect(screen.getByText(/AI Deployment Strategist/i)).toBeInTheDocument()
  })

  it("extracts intent when searching 'remote' in hero search, auto-promotes chip, and filters remote roles", () => {
    render(<Home />)

    const heroInput = screen.getByPlaceholderText(/what job are you looking for today\?/i)
    fireEvent.change(heroInput, { target: { value: "remote" } })
    fireEvent.submit(heroInput.closest("form")!)

    // Filter chip promoted
    const activeFiltersRegion = screen.getByRole("region", { name: /active search filters/i })
    expect(within(activeFiltersRegion).getByText("Remote")).toBeInTheDocument()
  })

  it("extracts intent when searching 'part time' and surfaces part-time roles", () => {
    render(<Home />)

    const heroInput = screen.getByPlaceholderText(/what job are you looking for today\?/i)
    fireEvent.change(heroInput, { target: { value: "part time" } })
    fireEvent.submit(heroInput.closest("form")!)

    const activeFiltersRegion = screen.getByRole("region", { name: /active search filters/i })
    expect(within(activeFiltersRegion).getByText("Part-time")).toBeInTheDocument()
    expect(screen.getByText(/part-time nlp python researcher/i)).toBeInTheDocument()
  })

  it("extracts intent when searching 'React' and surfaces React roles", () => {
    render(<Home />)

    const heroInput = screen.getByPlaceholderText(/what job are you looking for today\?/i)
    fireEvent.change(heroInput, { target: { value: "React" } })
    fireEvent.submit(heroInput.closest("form")!)

    const activeFiltersRegion = screen.getByRole("region", { name: /active search filters/i })
    expect(within(activeFiltersRegion).getByText("Skill: React")).toBeInTheDocument()
    expect(screen.getByText(/lead react full-stack engineer/i)).toBeInTheDocument()
  })

  it("extracts compound query 'senior remote python' into structured filter chips and allows dismissing chip", () => {
    render(<Home />)

    const heroInput = screen.getByPlaceholderText(/what job are you looking for today\?/i)
    fireEvent.change(heroInput, { target: { value: "senior remote python" } })
    fireEvent.submit(heroInput.closest("form")!)

    const activeFiltersRegion = screen.getByRole("region", { name: /active search filters/i })
    expect(within(activeFiltersRegion).getByText("Remote")).toBeInTheDocument()
    expect(within(activeFiltersRegion).getByText("Senior")).toBeInTheDocument()
    expect(within(activeFiltersRegion).getByText("Skill: Python")).toBeInTheDocument()
    expect(screen.getByText(/senior remote python & inference engineer/i)).toBeInTheDocument()

    // Dismissing chip relaxes filter
    const dismissPythonBtn = screen.getByRole("button", { name: /remove filter skill: python/i })
    fireEvent.click(dismissPythonBtn)

    expect(screen.queryByText("Skill: Python")).not.toBeInTheDocument()
  })

  it("displays zero-result fallback with actionable relaxation recommendations and allows one-click recovery", () => {
    render(<Home />)

    const tableInput = screen.getByPlaceholderText(/search for jobs/i)
    fireEvent.change(tableInput, { target: { value: "impossiblequantumxyzjob" } })

    expect(screen.getByRole("heading", { name: /no matching roles found/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /remove keyword "impossiblequantumxyzjob"/i })).toBeInTheDocument()

    // One-click relaxation restores results
    const relaxBtn = screen.getByRole("button", { name: /remove keyword "impossiblequantumxyzjob"/i })
    fireEvent.click(relaxBtn)

    expect(screen.queryByRole("heading", { name: /no matching roles found/i })).not.toBeInTheDocument()
    expect(screen.getByRole("table")).toBeInTheDocument()
  })
})
