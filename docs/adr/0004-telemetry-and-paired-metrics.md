# 0004. Telemetry and Paired Metrics

To validate the impact of our interventions across both the search discovery and mobile detail surfaces, we require clear success metrics and structured event tracking. We decided to establish two paired North Star metrics alongside a structured telemetry event schema (Option 1).

## Considered Options

### Option 1: Paired North Star Metrics with Granular Telemetry — Chosen
- **Metric 1 (Mobile Conversion):** *Mobile Detail-to-Apply Conversion Rate*. Target: Increase from **8% toward 14–16%**, narrowing the performance gap with desktop (24%).
- **Metric 2 (Discovery & Retention):** *Top-Query Zero-Result Rate* (Target: reduce from baseline to **< 5%** on queries like "remote", "part time", "React") and *Average Views per Session* (Target: lift from **1.2 to > 1.8** via similar role recommendations).
- **Telemetry Event Schema:**
  - `search_query_submitted`: `{ raw_query, extracted_filters: string[], result_count: number }`
  - `filter_chip_toggled`: `{ filter_type: string, filter_value: string, source: 'search_auto_promote' | 'manual_click' }`
  - `job_detail_viewed`: `{ job_id: string, device: 'mobile' | 'desktop', referrer: 'direct_google' | 'search_list' }`
  - `apply_cta_clicked`: `{ job_id: string, position: 'sticky_bar' | 'body_bottom', device: 'mobile' | 'desktop' }`
  - `similar_job_clicked`: `{ source_job_id: string, target_job_id: string, position: number }`
- **Why chosen:** Isolates where value is created—distinguishing search discovery improvements from mobile checkout/apply improvements—while enabling rigorous A/B or cohort analysis.

### Option 2: Single Global North Star (Total Applications)
- Track only global aggregate external apply clicks across the entire site.
- **Why rejected:** Masks channel-specific dynamics; an increase in desktop traffic could obscure continued mobile failure, and it provides no insight into whether search or detail page improvements drove the outcome.

### Option 3: Time-on-Page Focus
- Target increasing median time on the job detail page from 11 seconds to 45+ seconds.
- **Why rejected:** Time on page is an ambiguous proxy metric. A candidate who spends 60 seconds struggling to find the apply button has a worse experience than a candidate who reads the scannable summary and applies in 15 seconds. Business conversion must remain the primary truth.

## Consequences

- The client application must include an analytics abstraction (e.g., PostHog wrapper or typed event logger) that dispatches these structured events uniformly across views.
- Telemetry events must capture viewport/device context to enable segmented reporting.

