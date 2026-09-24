export type DeviceContext = "mobile" | "desktop"

export interface SearchQuerySubmittedEvent {
  name: "search_query_submitted"
  properties: {
    raw_query: string
    extracted_filters: string[]
    result_count: number
  }
}

export interface FilterChipToggledEvent {
  name: "filter_chip_toggled"
  properties: {
    filter_type: string
    filter_value: string
    source: "search_auto_promote" | "manual_click"
  }
}

export interface JobDetailViewedEvent {
  name: "job_detail_viewed"
  properties: {
    job_id: string
    device: DeviceContext
    referrer: "direct_google" | "search_list"
  }
}

export interface ApplyCtaClickedEvent {
  name: "apply_cta_clicked"
  properties: {
    job_id: string
    position: "sticky_bar" | "body_bottom" | "featured_card" | "table_row" | "banner"
    device: DeviceContext
  }
}

export interface SimilarJobClickedEvent {
  name: "similar_job_clicked"
  properties: {
    source_job_id: string
    target_job_id: string
    position: number
  }
}

export type TelemetryEvent =
  | SearchQuerySubmittedEvent
  | FilterChipToggledEvent
  | JobDetailViewedEvent
  | ApplyCtaClickedEvent
  | SimilarJobClickedEvent

export type TelemetrySink = (event: TelemetryEvent) => void

export interface TelemetryContextValue {
  track: (event: TelemetryEvent) => void
  trackSearchQuery: (props: {
    raw_query: string
    extracted_filters: string[]
    result_count: number
  }) => void
  trackFilterChipToggled: (props: {
    filter_type: string
    filter_value: string
    source: "search_auto_promote" | "manual_click"
  }) => void
  trackJobDetailViewed: (props: {
    job_id: string
    referrer: "direct_google" | "search_list"
    device?: DeviceContext
  }) => void
  trackApplyCtaClicked: (props: {
    job_id: string
    position: "sticky_bar" | "body_bottom" | "featured_card" | "table_row" | "banner"
    device?: DeviceContext
  }) => void
  trackSimilarJobClicked: (props: {
    source_job_id: string
    target_job_id: string
    position: number
  }) => void
  getEvents: () => TelemetryEvent[]
  clearEvents: () => void
}
