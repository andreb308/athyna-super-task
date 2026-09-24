## Problem Statement

Traffic analytics reveal that 43% of all job detail views arrive directly from Google organic search, completely bypassing the homepage and discovery listings. When these direct-arrival candidates click a standard "Back to jobs" button wired to `router.back()` (`window.history.back()`), they are ejected out of Athyna and sent straight back to the Google search results page. This hands high-intent talent directly to competitor job boards (LinkedIn, Indeed, Otta), contributing heavily to Athyna's 11-second median bounce time and 1.2 views/session plateau. Conversely, replacing the button with a hard link to `/` wipes active filter chips, pagination, and scroll depth for internal visitors who filtered before clicking.

## Solution

Implement a **Smart Back Button** component mounted across all job detail views that dynamically differentiates internal navigation from external direct arrivals:
- For internal visitors (referrer origin matches `window.location.origin` and `window.history.length > 1`), the button executes `router.back()` to preserve their filtered search state, active chips, and scroll position.
- For external arrivals, direct Google visitors, and new browser tabs (`target="_blank"`), the button gracefully falls back to navigating into Athyna's primary catalog (`/`).
- Prevents candidate leakage to competitor boards while maintaining 100% fidelity for filtered search users.

## User Stories

1. As a candidate arriving on a job detail page directly from a Google organic search result, I want clicking "Back to jobs" to take me to Athyna's job board, so that I can explore more roles on Athyna rather than bouncing back to Google.
2. As a candidate who opened a job in a new browser tab (`target="_blank"`), I want clicking "Back to jobs" to navigate to the job catalog, so that I don't experience a broken dead click caused by having no previous browser history.
3. As a candidate who spent time configuring search filters on the homepage before viewing a job, I want clicking "Back to jobs" to return me to my exact filtered catalog with all active chips and scroll position intact, so that I don't have to reconfigure my search from scratch.
4. As a mobile candidate with limited screen real estate, I want the "Back to jobs" button positioned at the top left of the role detail view with clear iconography and generous touch padding, so that I can tap it easily with one thumb.
5. As an assistive technology user, I want the back navigation control rendered as a semantic anchor or accessible button with an informative label, so that screen readers announce the intended destination clearly.
6. As a product analyst, I want navigation telemetry to track whether back clicks resulted in browser history traversal or catalog fallback navigation, so that we can evaluate organic traffic retention.

## Implementation Decisions

- **Referrer Origin Verification**: Compare `document.referrer` against `window.location.origin` inside a client-side effect to establish whether the previous page belongs to Athyna.
- **Dual-Mode Execution**:
  - If internal referrer and history length > 1: execute `router.back()`.
  - Otherwise: navigate to `fallbackHref` (defaults to `/`).
- **Fallback Prop Configurable**: Expose `fallbackHref` to allow specific parent layouts to designate alternative catalog routes (e.g. `/role`, `/jobs`).
- **SSR & Test Resiliency**: Wrap Next.js router instantiation in try/catch to ensure graceful rendering in headless testing environments and server-rendered contexts.

## Testing Decisions

- **Testing Philosophy**: Verify navigation behavior against mocked browser history and referrer states:
  - When `document.referrer` is from `google.com`, clicking the button invokes router navigation to the fallback href.
  - When `document.referrer` is from `window.location.origin` and history length > 1, clicking the button invokes `router.back()`.
  - When opened in a fresh tab with empty history, clicking navigates to the fallback href.
- **Prior Art**: Unit tests in `exercise-2-athyna-response/src/components/job-details/__tests__/` and PR review verification in `PR_REVIEW.md`.

## Out of Scope

- Storing full multi-page navigation stacks in session storage (relying on standard browser history API and referrer inspection is lightweight and zero-dependency).

## Further Notes

This component directly addresses the Exercise 3 PR defect and closes the primary funnel leak identified in SCOPING.md.
