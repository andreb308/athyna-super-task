# 0010. Client-Side Guest Persistence for Bookmarks and Applied Jobs

To provide immediate candidate utility without triggering the 74% sign-up wall abandonment rate, we implemented client-side `localStorage` persistence for saving roles and marking applications as submitted, completely bypassing account creation.

## Considered Options

### Option 1: Mandatory Sign-Up / Auth Gate
- Require candidates to create an account or sign in before saving a role or tracking application status.
- **Why rejected:** Acquisition data shows that 74% of candidates who hit the sign-up wall abandon Athyna and never return. Gating saved jobs behind authentication destroys top-of-funnel conversion.

### Option 2: In-Memory React State Only
- Hold saved jobs only in React component state.
- **Why rejected:** As soon as the candidate navigates between roles or refreshes the page, their bookmarks and application tracking disappear, eliminating any retention value.

### Option 3: Resilient `localStorage` Guest Store — Chosen
- Persist bookmark maps (`athyna_saved_jobs`) and application tracking maps (`athyna_applied_jobs`) directly in the candidate's browser `localStorage`.
- **Why chosen:** Gives guest candidates immediate utility with zero authentication friction, persists across browsing sessions, and aligns with the read-only constraints of Athyna's public API.

## Consequences

- Bookmarks are scoped to the candidate's device and browser profile.
- Storage operations must be wrapped in `try/catch` to gracefully support private browsing and quota restrictions.
