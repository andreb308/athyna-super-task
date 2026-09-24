import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import {
  TelemetryProvider,
  useTelemetry,
  type TelemetryEvent,
  type JobDetailViewedEvent,
  type ApplyCtaClickedEvent,
} from "../index"

function TestConsumer({
  onReady,
}: {
  onReady?: (telemetry: ReturnType<typeof useTelemetry>) => void
}) {
  const telemetry = useTelemetry()

  React.useEffect(() => {
    if (onReady) {
      onReady(telemetry)
    }
  }, [telemetry, onReady])

  return (
    <div>
      <button
        onClick={() =>
          telemetry.trackSearchQuery({
            raw_query: "machine learning",
            extracted_filters: ["AI"],
            result_count: 42,
          })
        }
      >
        Track Search
      </button>
      <button
        onClick={() =>
          telemetry.trackFilterChipToggled({
            filter_type: "location",
            filter_value: "remote",
            source: "manual_click",
          })
        }
      >
        Track Filter
      </button>
      <button
        onClick={() =>
          telemetry.trackJobDetailViewed({
            job_id: "anthropic-1",
            referrer: "search_list",
          })
        }
      >
        Track Job View
      </button>
      <button
        onClick={() =>
          telemetry.trackApplyCtaClicked({
            job_id: "anthropic-1",
            position: "table_row",
          })
        }
      >
        Track Apply CTA
      </button>
      <button
        onClick={() =>
          telemetry.trackSimilarJobClicked({
            source_job_id: "anthropic-1",
            target_job_id: "openai-2",
            position: 1,
          })
        }
      >
        Track Similar Job
      </button>
      <span data-testid="events-count">{telemetry.getEvents().length}</span>
    </div>
  )
}

describe("Telemetry Dispatch Seam", () => {
  it("provides telemetry context to child components", () => {
    render(
      <TelemetryProvider>
        <TestConsumer />
      </TelemetryProvider>
    )

    expect(screen.getByRole("button", { name: /track search/i })).toBeInTheDocument()
  })

  it("dispatches search_query_submitted with ADR 0004 payload", () => {
    const sink = vi.fn()
    render(
      <TelemetryProvider sinks={[sink]}>
        <TestConsumer />
      </TelemetryProvider>
    )

    fireEvent.click(screen.getByRole("button", { name: /track search/i }))

    expect(sink).toHaveBeenCalledTimes(1)
    const event = sink.mock.calls[0][0] as TelemetryEvent
    expect(event.name).toBe("search_query_submitted")
    expect(event.properties).toEqual({
      raw_query: "machine learning",
      extracted_filters: ["AI"],
      result_count: 42,
    })
  })

  it("dispatches filter_chip_toggled with ADR 0004 payload", () => {
    const sink = vi.fn()
    render(
      <TelemetryProvider sinks={[sink]}>
        <TestConsumer />
      </TelemetryProvider>
    )

    fireEvent.click(screen.getByRole("button", { name: /track filter/i }))

    expect(sink).toHaveBeenCalledTimes(1)
    const event = sink.mock.calls[0][0] as TelemetryEvent
    expect(event.name).toBe("filter_chip_toggled")
    expect(event.properties).toEqual({
      filter_type: "location",
      filter_value: "remote",
      source: "manual_click",
    })
  })

  it("dispatches job_detail_viewed with auto-detected device context", () => {
    const sink = vi.fn()
    render(
      <TelemetryProvider sinks={[sink]}>
        <TestConsumer />
      </TelemetryProvider>
    )

    fireEvent.click(screen.getByRole("button", { name: /track job view/i }))

    expect(sink).toHaveBeenCalledTimes(1)
    const event = sink.mock.calls[0][0] as JobDetailViewedEvent
    expect(event.name).toBe("job_detail_viewed")
    expect(event.properties.job_id).toBe("anthropic-1")
    expect(event.properties.referrer).toBe("search_list")
    expect(["mobile", "desktop"]).toContain(event.properties.device)
  })

  it("dispatches apply_cta_clicked with position and device context", () => {
    const sink = vi.fn()
    render(
      <TelemetryProvider sinks={[sink]}>
        <TestConsumer />
      </TelemetryProvider>
    )

    fireEvent.click(screen.getByRole("button", { name: /track apply cta/i }))

    expect(sink).toHaveBeenCalledTimes(1)
    const event = sink.mock.calls[0][0] as ApplyCtaClickedEvent
    expect(event.name).toBe("apply_cta_clicked")
    expect(event.properties.job_id).toBe("anthropic-1")
    expect(event.properties.position).toBe("table_row")
    expect(["mobile", "desktop"]).toContain(event.properties.device)
  })

  it("dispatches similar_job_clicked with source, target, and position", () => {
    const sink = vi.fn()
    render(
      <TelemetryProvider sinks={[sink]}>
        <TestConsumer />
      </TelemetryProvider>
    )

    fireEvent.click(screen.getByRole("button", { name: /track similar job/i }))

    expect(sink).toHaveBeenCalledTimes(1)
    const event = sink.mock.calls[0][0] as TelemetryEvent
    expect(event.name).toBe("similar_job_clicked")
    expect(event.properties).toEqual({
      source_job_id: "anthropic-1",
      target_job_id: "openai-2",
      position: 1,
    })
  })

  it("maintains an in-memory buffer of dispatched events", () => {
    render(
      <TelemetryProvider>
        <TestConsumer />
      </TelemetryProvider>
    )

    expect(screen.getByTestId("events-count")).toHaveTextContent("0")
    fireEvent.click(screen.getByRole("button", { name: /track search/i }))
    fireEvent.click(screen.getByRole("button", { name: /track filter/i }))
    expect(screen.getByTestId("events-count")).toHaveTextContent("2")
  })

  it("logs events to console when debug mode is enabled", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})
    render(
      <TelemetryProvider debug={true}>
        <TestConsumer />
      </TelemetryProvider>
    )

    fireEvent.click(screen.getByRole("button", { name: /track search/i }))
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[Telemetry]"),
      expect.objectContaining({ name: "search_query_submitted" })
    )

    consoleSpy.mockRestore()
  })
})
