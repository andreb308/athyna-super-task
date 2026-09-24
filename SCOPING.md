# SCOPING: The High-Intent Candidate Loop

## 1. Findings That Matter Most & Why

Two core findings highlight the highest-leverage leaks in Athyna's acquisition and conversion funnel:

1. **Top-of-Funnel Search Dead-Ends:** Naive substring matching causes 3 of the top 5 queries (`"remote"`, `"part time"`, `"React"`) to return zero results. Although filtered searches convert detail-to-apply at 3x the baseline rate, only 24% of candidates open filter menus. Candidates express structured intent in search, but the system fails to parse it.
2. **Mobile & Direct-Arrival Bounce:** 43% of detail traffic arrives directly from Google organic search, and 61% is mobile. Yet mobile converts at only 8% (vs. 24% desktop) with an 11-second median bounce and 1.2 average views. The mobile detail page buries the apply CTA beneath dense text, lacking persistent actions or paths to discover other roles.

## 2. Proposed Solution

I propose **The High-Intent Loop**—connecting structured search discovery with mobile direct-arrival retention:

- **Client-Side Intent Parser & Auto-Promoted Filter Chips:** Queries like `"remote react"` automatically map recognized tokens into native API parameters (`remote=true`, `skills=React`, `q=...`) as interactive chips. Fallbacks suggest relaxing individual parameters instead of showing blank states.
- **Mobile-Optimized Detail Experience:**
  - **Sticky Action Bar:** Persistent bottom dock keeping primary Apply CTA and compensation visible across all scroll depths.
  - **Above-the-Fold Badges:** Highlights remote status, salary, contract type, and key skills for rapid scanning (< 5s).
  - **Post-Apply Retention Shelf:** Clicking Apply opens external links in a new tab without blocking modals, displaying a "Similar Roles You Qualify For" shelf to lift session depth.

## 3. Explicit Non-Goals & Trade-offs

Some of the other ideas that were discarded for time constraints and low priority:

- **Logged-In Dashboard Redesign:** 74% of candidates drop off before sign-up, therefore optimizing post-login UI while top-of-funnel leaks misallocates effort.
- **LinkedIn OAuth / Sign-Up Overhaul:** LinkedIn API approval takes weeks and the dev API lacks write endpoints;
- **Backend Search Overhaul:** Client-side parsing delivers high leverage against the read-only API with zero backend latency or dependencies.
- **Heavy Multi-Filter Drawers:** Instead of using multi-filter drawers, we auto-promote search tokens into chips to capture the 3x filter conversion lift without modal friction.

## 4. Measurement & Success Metrics

I target two paired North Star metrics:
- **Mobile Detail-to-Apply Conversion Rate:** Increase from **8%**, as an attempt to close the desktop gap (24%).
- **Search Zero-Result Rate & Session Depth:** Reduce the instances of zero-result rate queries and lift session depth up from 1.2 views.

Impact could be validated via PostHog telemetry, but due to time constraints, active implementation was omitted. The proposed event schema is defined below:

**Telemetry Events:**
- `search_query_submitted`: `{ raw_query, extracted_filters, result_count }`
- `filter_chip_toggled`: `{ filter_type, filter_value, source: 'auto_promote' | 'manual' }`
- `job_detail_viewed`: `{ job_id, device, referrer: 'direct_google' | 'search_list' }`
- `apply_cta_clicked`: `{ job_id, position: 'sticky_bar' | 'body_bottom', device }`
- `similar_job_clicked`: `{ source_job_id, target_job_id, position }`

*(Detailed architectural decisions and trade-offs are documented in [`docs/adr/0001-high-intent-funnel-scope.md`](file:///Users/andre/Repositories/athyna-super-task/docs/adr/0001-high-intent-funnel-scope.md) through [`0005-scope-exclusions-and-tradeoffs.md`](file:///Users/andre/Repositories/athyna-super-task/docs/adr/0005-scope-exclusions-and-tradeoffs.md).)*
