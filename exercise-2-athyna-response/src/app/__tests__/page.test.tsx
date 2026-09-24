import * as React from "react"
import { render, screen, fireEvent, within } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import Home from "../page"
import { TelemetryProvider } from "@/lib/telemetry"

describe("Home Page", () => {
  it("renders hero headline and search input without featured roles tabbed section", () => {
    render(
      <TelemetryProvider>
        <Home />
      </TelemetryProvider>
    )

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

  it("filters jobs when typing in table filter input and dispatches search telemetry", () => {
    const sink = vi.fn()
    render(
      <TelemetryProvider sinks={[sink]}>
        <Home />
      </TelemetryProvider>
    )

    const tableInput = screen.getByPlaceholderText(/search for jobs/i)
    fireEvent.change(tableInput, { target: { value: "Mistral" } })

    expect(screen.getByText(/AI Deployment Strategist/i)).toBeInTheDocument()
    expect(screen.queryByText(/Commercial Legal Specialist/i)).not.toBeInTheDocument()

    expect(sink).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "search_query_submitted",
        properties: expect.objectContaining({
          raw_query: "Mistral",
        }),
      })
    )
  })

  it("dispatches telemetry when clicking unlock all jobs button", () => {
    const sink = vi.fn()
    render(
      <TelemetryProvider sinks={[sink]}>
        <Home />
      </TelemetryProvider>
    )

    const unlockButton = screen.getByRole("button", { name: /unlock all jobs/i })
    fireEvent.click(unlockButton)

    expect(sink).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "apply_cta_clicked",
        properties: expect.objectContaining({
          job_id: "unlock_all_roles",
          position: "banner",
        }),
      })
    )
  })

  it("dispatches telemetry when clicking popular search tag", () => {
    const sink = vi.fn()
    render(
      <TelemetryProvider sinks={[sink]}>
        <Home />
      </TelemetryProvider>
    )

    const tag = screen.getByRole("button", { name: "AI Engineer" })
    fireEvent.click(tag)

    expect(sink).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "filter_chip_toggled",
        properties: expect.objectContaining({
          filter_type: "popular_search",
          filter_value: "AI Engineer",
          source: "manual_click",
        }),
      })
    )
  })

  it("extracts intent when searching 'remote' in hero search, auto-promotes chip, and filters remote roles", () => {
    const sink = vi.fn()
    render(
      <TelemetryProvider sinks={[sink]}>
        <Home />
      </TelemetryProvider>
    )

    const heroInput = screen.getByPlaceholderText(/what job are you looking for today\?/i)
    fireEvent.change(heroInput, { target: { value: "remote" } })
    fireEvent.submit(heroInput.closest("form")!)

    // Filter chip promoted
    expect(screen.getByText("Remote")).toBeInTheDocument()

    // Telemetry dispatched with extracted filter
    expect(sink).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "search_query_submitted",
        properties: expect.objectContaining({
          raw_query: "remote",
          extracted_filters: expect.arrayContaining(["Remote"]),
        }),
      })
    )

    expect(sink).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "filter_chip_toggled",
        properties: expect.objectContaining({
          filter_type: "remote",
          filter_value: "true",
          source: "search_auto_promote",
        }),
      })
    )
  })

  it("extracts intent when searching 'part time' and surfaces part-time roles", () => {
    render(
      <TelemetryProvider>
        <Home />
      </TelemetryProvider>
    )

    const heroInput = screen.getByPlaceholderText(/what job are you looking for today\?/i)
    fireEvent.change(heroInput, { target: { value: "part time" } })
    fireEvent.submit(heroInput.closest("form")!)

    const activeFiltersRegion = screen.getByRole("region", { name: /active search filters/i })
    expect(within(activeFiltersRegion).getByText("Part-time")).toBeInTheDocument()
    expect(screen.getByText(/part-time nlp python researcher/i)).toBeInTheDocument()
  })

  it("extracts intent when searching 'React' and surfaces React roles", () => {
    render(
      <TelemetryProvider>
        <Home />
      </TelemetryProvider>
    )

    const heroInput = screen.getByPlaceholderText(/what job are you looking for today\?/i)
    fireEvent.change(heroInput, { target: { value: "React" } })
    fireEvent.submit(heroInput.closest("form")!)

    const activeFiltersRegion = screen.getByRole("region", { name: /active search filters/i })
    expect(within(activeFiltersRegion).getByText("Skill: React")).toBeInTheDocument()
    expect(screen.getByText(/lead react full-stack engineer/i)).toBeInTheDocument()
  })

  it("extracts compound query 'senior remote python' into structured filter chips", () => {
    const sink = vi.fn()
    render(
      <TelemetryProvider sinks={[sink]}>
        <Home />
      </TelemetryProvider>
    )

    const heroInput = screen.getByPlaceholderText(/what job are you looking for today\?/i)
    fireEvent.change(heroInput, { target: { value: "senior remote python" } })
    fireEvent.submit(heroInput.closest("form")!)

    const activeFiltersRegion = screen.getByRole("region", { name: /active search filters/i })
    expect(within(activeFiltersRegion).getByText("Remote")).toBeInTheDocument()
    expect(within(activeFiltersRegion).getByText("Senior")).toBeInTheDocument()
    expect(within(activeFiltersRegion).getByText("Skill: Python")).toBeInTheDocument()
    expect(screen.getByText(/senior remote python & inference engineer/i)).toBeInTheDocument()

    // Dismissing chip relaxes filter and emits telemetry
    const dismissPythonBtn = screen.getByRole("button", { name: /remove filter skill: python/i })
    fireEvent.click(dismissPythonBtn)

    expect(sink).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "filter_chip_toggled",
        properties: expect.objectContaining({
          filter_type: "skill",
          filter_value: "Python",
          source: "manual_click",
        }),
      })
    )
    expect(screen.queryByText("Skill: Python")).not.toBeInTheDocument()
  })

  it("displays zero-result fallback with actionable relaxation recommendations and allows one-click recovery", () => {
    render(
      <TelemetryProvider>
        <Home />
      </TelemetryProvider>
    )

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

