## Problem Statement

Athyna's acquisition data shows that 74% of candidates who hit a sign-up wall abandon the platform and never return. Most job boards force candidates to create an account before saving jobs or tracking applications. Because Athyna's public API is read-only with no user authentication or persistence endpoints, requiring candidates to register before saving a role creates immediate churn at the moment of highest intent.

## Solution

Implement **Guest Role Interactions** enabling candidates to save (bookmark) opportunities and flag roles as "Applied" entirely within client-side `localStorage`:
- Dedicated dual-action toggle controls placed in the job detail header: "Save" / "Saved" and "Mark as Applied" / "Applied".
- State persists across browser sessions on the candidate's device with zero registration or sign-up wall friction.
- Visual state updates immediately with accessible feedback (`aria-pressed`, high-contrast color shifts, and filled icon states).
- Error-resilient storage wrapper handling private browsing restrictions and quota limits gracefully without throwing runtime errors.

## User Stories

1. As a guest candidate browsing without an account, I want to click "Save" on a job detail page, so that I can bookmark the opportunity to review later.
2. As a candidate who previously saved a job, I want the button to display "Saved" with a filled purple bookmark icon when I revisit the page, so that I know I have already flagged it.
3. As a candidate who has applied to a position on an external ATS, I want to click "Mark as Applied", so that I can keep track of which opportunities I have already submitted.
4. As a candidate viewing an applied job, I want the button to display "Applied" with a green checkmark badge, so that I don't accidentally waste time re-applying.
5. As a candidate who saved a job by accident, I want to click "Saved" again to un-save it, so that my saved list remains accurate.
6. As a candidate browsing in private/incognito mode, I want the save and applied buttons to function in-memory without crashing if `localStorage` access is blocked.
7. As a screen reader user, I want the save and applied buttons to communicate their toggle state via `aria-pressed="true|false"`, so that I know whether the action is active.

## Implementation Decisions

- **Storage Keys**: Persist maps in `localStorage` under `athyna_saved_jobs` and `athyna_applied_jobs` as JSON dictionaries keyed by job ID (`{ [jobId: string]: boolean }`).
- **Resilient Storage Parser**: Wrap all read and write operations in `try/catch` blocks to protect against `QuotaExceededError` or `SecurityError` in incognito browsing modes.
- **Button Styling States**:
  - Saved: `border-primary bg-lavender-subtle text-primary` with filled `Bookmark` glyph.
  - Applied: `border-mint-emerald bg-mint-surface text-mint-text` with filled `CheckCircle2` glyph.
  - Inactive: `border-border-subtle bg-surface-container-lowest text-on-surface`.

## Testing Decisions

- **Testing Philosophy**: Verify toggle behavior, DOM updates, and localStorage updates from the user's perspective.
- **Seams Tested**:
  - Test clicking "Save" stores `jobId: true` in `localStorage` and sets `aria-pressed="true"`.
  - Test clicking a second time removes `jobId` and resets button text to "Save".
  - Test clicking "Mark as Applied" stores state in `localStorage` and updates styling.
- **Prior Art**: Component test suites using simulated localStorage mocks.

## Out of Scope

- Cloud synchronization across devices (guest storage is localized to the device/browser).
- Sending automated email reminders for saved jobs (requires backend write APIs and authentication).
