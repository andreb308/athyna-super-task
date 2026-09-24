/**
 * Telemetry event dispatcher per ADR 0004.
 *
 * Structured events are dispatched via a thin abstraction that logs to
 * `console.debug` today and can be swapped for PostHog / Segment / etc.
 * without touching call-sites.
 */

export interface JobDetailViewedEvent {
  job_id: string
  device: "mobile" | "desktop"
  referrer: "direct_google" | "search_list"
}

export interface ApplyCtaClickedEvent {
  job_id: string
  position: "sticky_bar" | "body_bottom"
  device: "mobile" | "desktop"
}

export interface SimilarJobClickedEvent {
  source_job_id: string
  target_job_id: string
  position: number
}

type TelemetryEventMap = {
  job_detail_viewed: JobDetailViewedEvent
  apply_cta_clicked: ApplyCtaClickedEvent
  similar_job_clicked: SimilarJobClickedEvent
}

export type TelemetryEventName = keyof TelemetryEventMap

const subscribers: Array<(name: string, payload: unknown) => void> = []

/**
 * Register a listener that receives every dispatched event.
 * Returns an unsubscribe function.
 */
export function onTelemetry(
  cb: (name: string, payload: unknown) => void
): () => void {
  subscribers.push(cb)
  return () => {
    const idx = subscribers.indexOf(cb)
    if (idx >= 0) subscribers.splice(idx, 1)
  }
}

/**
 * Dispatch a structured telemetry event.
 */
export function trackEvent<K extends TelemetryEventName>(
  name: K,
  payload: TelemetryEventMap[K]
): void {
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.debug(`[telemetry] ${name}`, payload)
  }
  for (const cb of subscribers) {
    cb(name, payload)
  }
}

/**
 * Detect device category from viewport width.
 */
export function getDeviceCategory(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop"
  return window.innerWidth < 768 ? "mobile" : "desktop"
}

/**
 * Infer arrival source from document.referrer.
 * If the referrer is from the same origin, the user arrived from
 * the internal search list. Otherwise, treat as direct/Google arrival.
 */
export function getArrivalSource(): "direct_google" | "search_list" {
  if (typeof window === "undefined") return "direct_google"
  try {
    if (!document.referrer) return "direct_google"
    const referrerOrigin = new URL(document.referrer).origin
    return referrerOrigin === window.location.origin
      ? "search_list"
      : "direct_google"
  } catch {
    return "direct_google"
  }
}
