"use client"

import * as React from "react"
import {
  type DeviceContext,
  type TelemetryEvent,
  type TelemetrySink,
  type TelemetryContextValue,
} from "./types"

const TelemetryContext = React.createContext<TelemetryContextValue | null>(null)

function getDeviceContext(): DeviceContext {
  if (typeof window === "undefined") {
    return "desktop"
  }
  return window.innerWidth < 768 ? "mobile" : "desktop"
}

export interface TelemetryProviderProps {
  children: React.ReactNode
  sinks?: TelemetrySink[]
  debug?: boolean
}

export function TelemetryProvider({
  children,
  sinks = [],
  debug,
}: TelemetryProviderProps) {
  const eventsRef = React.useRef<TelemetryEvent[]>([])
  const [, setRevision] = React.useState(0)

  const isDebug =
    debug !== undefined ? debug : process.env.NODE_ENV === "development"

  const track = React.useCallback(
    (event: TelemetryEvent) => {
      eventsRef.current.push(event)
      setRevision((r) => r + 1)

      if (isDebug) {
        console.log(`[Telemetry] ${event.name}`, event)
      }

      for (const sink of sinks) {
        try {
          sink(event)
        } catch (error) {
          console.error("[Telemetry] Sink error:", error)
        }
      }
    },
    [isDebug, sinks]
  )

  const trackSearchQuery = React.useCallback(
    (props: {
      raw_query: string
      extracted_filters: string[]
      result_count: number
    }) => {
      track({
        name: "search_query_submitted",
        properties: props,
      })
    },
    [track]
  )

  const trackFilterChipToggled = React.useCallback(
    (props: {
      filter_type: string
      filter_value: string
      source: "search_auto_promote" | "manual_click"
    }) => {
      track({
        name: "filter_chip_toggled",
        properties: props,
      })
    },
    [track]
  )

  const trackJobDetailViewed = React.useCallback(
    (props: {
      job_id: string
      referrer: "direct_google" | "search_list"
      device?: DeviceContext
    }) => {
      track({
        name: "job_detail_viewed",
        properties: {
          job_id: props.job_id,
          referrer: props.referrer,
          device: props.device || getDeviceContext(),
        },
      })
    },
    [track]
  )

  const trackApplyCtaClicked = React.useCallback(
    (props: {
      job_id: string
      position: "sticky_bar" | "body_bottom" | "featured_card" | "table_row" | "banner"
      device?: DeviceContext
    }) => {
      track({
        name: "apply_cta_clicked",
        properties: {
          job_id: props.job_id,
          position: props.position,
          device: props.device || getDeviceContext(),
        },
      })
    },
    [track]
  )

  const trackSimilarJobClicked = React.useCallback(
    (props: {
      source_job_id: string
      target_job_id: string
      position: number
    }) => {
      track({
        name: "similar_job_clicked",
        properties: props,
      })
    },
    [track]
  )

  const getEvents = React.useCallback(() => [...eventsRef.current], [])

  const clearEvents = React.useCallback(() => {
    eventsRef.current = []
    setRevision((r) => r + 1)
  }, [])

  const contextValue = React.useMemo<TelemetryContextValue>(
    () => ({
      track,
      trackSearchQuery,
      trackFilterChipToggled,
      trackJobDetailViewed,
      trackApplyCtaClicked,
      trackSimilarJobClicked,
      getEvents,
      clearEvents,
    }),
    [
      track,
      trackSearchQuery,
      trackFilterChipToggled,
      trackJobDetailViewed,
      trackApplyCtaClicked,
      trackSimilarJobClicked,
      getEvents,
      clearEvents,
    ]
  )

  return (
    <TelemetryContext.Provider value={contextValue}>
      {children}
    </TelemetryContext.Provider>
  )
}

export function useTelemetry(): TelemetryContextValue {
  const context = React.useContext(TelemetryContext)
  if (!context) {
    throw new Error("useTelemetry must be used within a TelemetryProvider")
  }
  return context
}
