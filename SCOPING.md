# SCOPING: The High-Intent Candidate Loop

## 1. Findings That Matter Most & Why

Two findings represent the highest-leverage leaks in Athyna's acquisition and conversion funnel:

1. **Top-of-Funnel Search Dead-Ends:** Search relies on naive title-substring matching, causing three of the top five queries (`"remote"`, `"part time"`, `"React"`) to return zero results. Simultaneously, candidates who apply a filter convert detail-to-apply at 3x the baseline rate, yet only 24% of users interact with manual filter menus. Candidates are expressing structured intent directly in the search bar, but the platform fails to translate it.
2. **Mobile & Direct-Arrival Bounce:** 43% of detail traffic arrives directly from Google organic search (bypassing the homepage), and 61% of total traffic is mobile. However, mobile converts at only 8% (vs. 24% on desktop) with a median bounce of 11 seconds and an average session depth of 1.2 views. The current mobile detail page buries the external application CTA under an un-scannable wall of text with zero persistent actions, offering no contextual path to explore a second role.

## 2. Proposed Solution

We propose **The High-Intent Loop**—connecting structured search discovery with mobile direct-arrival retention:

- **Client-Side Intent Parser & Auto-Promoted Filter Chips:** When users search queries like `"remote react"`, the client extracts recognized attributes, maps them directly to native API parameters (`remote=true`, `skills=React`, `q=...`), and visually promotes them into interactive filter chips above results. If no exact match is found, an actionable fallback suggests relaxing individual parameters instead of hitting a blank screen.
- **Mobile-Optimized Detail Experience:**
  - **Sticky Action Bar:** A persistent bottom dock keeping the primary "Apply" CTA and salary summary visible at all scroll depths.
  - **Above-the-Fold "At a Glance" Badges:** Highlights remote policy, salary, employment type, and tech stack immediately under the header for rapid candidate qualification in < 5 seconds.
  - **Frictionless Post-Apply Retention Shelf:** Clicking "Apply" opens the employer link in a new tab without blocking interstitials, while updating the Athyna view with a "Similar Roles You Qualify For" shelf (matched on job skills and seniority) to lift session depth.

## 3. Explicit Non-Goals & Trade-offs

To preserve quality within an 8-hour budget against a read-only dev API:

- **No Logged-In Dashboard Redesign:** Although the authenticated dashboard visually clashes with the public board, 74% of users abandon at the sign-up wall. Optimizing post-login UI when the top-of-funnel leaks traffic misallocates effort.
- **No LinkedIn OAuth / Sign-Up Wall Overhaul:** Official LinkedIn Profile API approval requires 2–4 weeks; dev API has no write endpoints. We keep guest external apply completely frictionless.
- **No Backend Search Engine Overhaul:** Client-side parameter orchestration achieves high leverage against the fixed read-only API with zero backend latency or dependencies.
- **No Heavy Multi-Filter Drawers:** Promoting search tokens to filter chips dynamically captures the 3x filter conversion lift without adding modal friction.

## 4. Measurement & Success Metrics

We will validate impact using two paired North Star metrics:

- **Mobile Detail-to-Apply Conversion Rate:** Lift from **8% toward 14–16%**, closing the gap with desktop (24%).
- **Search Zero-Result Rate & Session Depth:** Reduce top-query zero-result rate to **< 5%**, and increase average views per session from **1.2 to > 1.8**.

**Telemetry Events:**
- `search_query_submitted`: `{ raw_query, extracted_filters, result_count }`
- `filter_chip_toggled`: `{ filter_type, filter_value, source: 'auto_promote' | 'manual' }`
- `job_detail_viewed`: `{ job_id, device, referrer: 'direct_google' | 'search_list' }`
- `apply_cta_clicked`: `{ job_id, position: 'sticky_bar' | 'body_bottom', device }`
- `similar_job_clicked`: `{ source_job_id, target_job_id, position }`

*(Detailed architectural decisions, rejected alternatives, and consequences are documented in [`docs/adr/0001-high-intent-funnel-scope.md`](file:///Users/andre/Repositories/athyna-super-task/docs/adr/0001-high-intent-funnel-scope.md) through [`0005-scope-exclusions-and-tradeoffs.md`](file:///Users/andre/Repositories/athyna-super-task/docs/adr/0005-scope-exclusions-and-tradeoffs.md).)*

