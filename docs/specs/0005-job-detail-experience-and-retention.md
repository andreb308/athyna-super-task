## Problem Statement

Athyna's acquisition data demonstrates that 43% of all candidate traffic arrives directly from Google organic search onto the job detail page, completely bypassing the homepage and discovery search lists. Furthermore, 61% of total visitors are browsing on mobile devices. However, mobile traffic converts from detail-to-apply at an abysmal 8% (compared to 24% on desktop), with a median session duration of just 11 seconds before bouncing. 

On mobile devices, the existing job detail layout presents thousands of words of unformatted text, burying the "Apply externally" button at the very bottom of the screen. Candidates cannot quickly assess core qualifications (such as remote eligibility, tech stack, or salary) within their 11-second attention window, and scrolling through an endless wall of text to reach the CTA creates severe friction. In addition, sessions average only 1.2 job views; candidates who decide a role is a poor fit—or who complete their application—find no contextual path to explore similar positions, causing them to bounce straight back to Google.

## Solution

Re-engineer the Job Detail experience into a high-converting, mobile-first landing surface aligned with Architecture Decision Record 0003:
- A persistent **Sticky Mobile Action Bar** docked at the bottom of the viewport featuring the role title, salary snippet, and a high-contrast "Apply" button visible across all scroll depths.
- An above-the-fold **"At a Glance" Scannable Summary** displaying key qualification badges (compensation, remote work policy, employment type, and key skills) immediately below the header so candidates can verify fit in under 5 seconds.
- A **Frictionless External Application Path** that opens employer application destinations in a new tab immediately, without blocking interstitial walls or forced registration screens.
- A contextual **"Similar Roles You Qualify For" Shelf** matching the active job's skills and seniority to provide an instant browsing off-ramp, directly lifting session depth from 1.2 toward the > 1.8 target defined in SCOPING.md.
- Comprehensive telemetry tracking capturing detail view sources (`direct_google` vs `search_list`), scroll depths, CTA click positions, and similar role interactions per ADR 0004.

## User Stories

1. As a mobile candidate landing directly from Google search, I want to see an above-the-fold "At a Glance" summary with remote eligibility, salary range, and key skills, so that I can determine if I qualify for the role within seconds.
2. As a mobile candidate scrolling through a lengthy job description, I want a sticky action bar docked at the bottom of my screen with an "Apply" button, so that I can apply at any point without scrolling all the way to the bottom.
3. As a mobile candidate with limited screen space, I want the sticky action bar to display the job title and salary snippet concisely, so that I always maintain context on the position.
4. As a candidate reviewing role requirements, I want technical skill badges displayed prominently, so that I can immediately match my expertise with the role's stack.
5. As a candidate clicking "Apply", I want the external employer application to open in a new tab immediately without blocking modal dialogs, so that I experience zero friction when submitting my application.
6. As a candidate who has opened an application link, I want the Athyna tab to transition smoothly to show a "Similar Roles You Qualify For" shelf, so that I can immediately apply to other matching opportunities.
7. As a candidate reading a role that is not a good fit, I want to scroll down and see 3 to 4 related jobs matching similar skills, so that I can continue browsing on Athyna rather than bouncing back to Google search.
8. As a candidate browsing a job detail page, I want a clean "Back to jobs" navigation affordance that safely returns me to the job board without breaking my browser history.
9. As a candidate on desktop, I want the job detail header, metadata cards, and description presented with generous spacing and high readability, so that the reading experience remains comfortable on large monitors.
10. As a candidate wanting to bookmark an opportunity, I want a "Save role" button in the action bar, so that I can flag the job for later review.
11. As a product analyst, I want a `job_detail_viewed` event dispatched containing the job ID, device category (`mobile` vs `desktop`), and arrival source (`direct_google` vs `search_list`), so that we can isolate direct-arrival conversion dynamics.
12. As a product analyst, I want `apply_cta_clicked` events to record whether the click came from the `sticky_bar` or the `body_bottom` button, so that we can evaluate the exact lift delivered by the sticky bar.
13. As a product analyst, I want `similar_job_clicked` events tracked with the source and target job IDs, so that we can measure the retention efficiency of the recommendation shelf.
14. As a candidate landing on an invalid or expired job URL, I want an informative error state with suggested active roles, so that I am not stranded on a dead-end 404 page.

## Implementation Decisions

- **Route Architecture**:
  - Implement `/jobs/[id]` as a dedicated route supporting both direct external URL entry (simulating Google organic arrival) and internal list navigation.
  - Server-render initial role metadata for optimal sub-second First Contentful Paint.
- **Above-the-Fold "At a Glance" Highlights**:
  - Render a horizontal badge cluster directly beneath the company and title header.
  - Badges include: Remote status badge (`Remote` / `Hybrid` / `On-site`), Compensation badge (formatted min-max range or `Competitive`), Employment type (`Full-time`, `Contract`, `Part-time`), and Top 4 skill tags.
- **Sticky Mobile Action Bar**:
  - Rendered fixed at the bottom viewport on screens < 768px (`fixed bottom-0 left-0 right-0 z-50`).
  - High-contrast background with subtle top divider and backdrop blur.
  - Layout: Left side displays truncated role title and salary; right side houses the primary Mint Emerald "Apply" button and secondary bookmark icon.
  - Adds corresponding bottom margin/padding to page container (`pb-24`) to ensure footer and body content are never obscured.
- **Frictionless Apply & Post-Apply State**:
  - The "Apply" CTA opens `job.applicationUrl` in a new window/tab (`window.open(url, '_blank', 'noopener,noreferrer')`).
  - The current page updates local state to display a post-apply success banner ("Application opened in new tab!") and focuses attention on the "Similar Roles" shelf.
- **"Similar Roles You Qualify For" Shelf**:
  - Fetches up to 4 roles matching the current job's skills or seniority via `GET /api/public/jobs?skills={currentJob.skills}`.
  - Renders as a compact horizontal scroll or card list at the bottom of the job description.
- **Telemetry Event Dispatching**:
  - Track `job_detail_viewed` on initial mount.
  - Track `apply_cta_clicked` on apply button triggers (passing `position: 'sticky_bar' | 'body_bottom'`).
  - Track `similar_job_clicked` when a candidate clicks through to another role.

## Testing Decisions

- **Testing Philosophy**: Verify user-facing interactions and responsive behavior rather than internal CSS styles. Ensure that the sticky action bar is present on mobile viewports, that external application URLs open securely, and that recommendation cards trigger expected navigation and telemetry.
- **Seams Tested**:
  - *Responsive Sticky Bar Seam*: Verify the sticky bar renders on mobile viewports and emits `apply_cta_clicked` with `position: 'sticky_bar'`.
  - *Scannable Summary Seam*: Verify all key role metadata (remote status, salary, skills) is present above the fold without requiring user scroll.
  - *Post-Apply Shelf Seam*: Verify clicking "Apply" reveals the similar roles shelf and that clicking a recommendation triggers navigation to the new job ID.
  - *Telemetry Dispatch Seam*: Verify `job_detail_viewed` is emitted with correct device and referrer attributes on mount.
- **Prior Art**: React Testing Library component integration tests and user event simulation.

## Out of Scope

- Pre-apply blocking registration or login modals (per SCOPING.md and ADR 0003).
- Full application form hosting or resume uploading on Athyna (application links route to external ATS/company endpoints).
- Backend database persistence for bookmarked jobs (local storage is sufficient for client session persistence).

## Further Notes

This spec operationalizes the second half of **The High-Intent Loop** ([ADR 0001](file:///Users/andre/Repositories/athyna-super-task/docs/adr/0001-high-intent-funnel-scope.md) and [ADR 0003](file:///Users/andre/Repositories/athyna-super-task/docs/adr/0003-mobile-detail-experience-and-retention.md)), specifically designed to solve the 8% mobile conversion rate and the 11-second bounce on the 43% of traffic arriving directly from Google organic search.
