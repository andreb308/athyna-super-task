# Athyna Public Job Board

Domain language and glossary for the public job board candidate acquisition and conversion funnel.

## Funnel & Traffic

**Direct Arrival**:
A candidate session landing directly onto a specific job detail page from an external acquisition channel (e.g., Google organic search), completely bypassing the homepage and search list.
_Avoid_: Direct traffic, organic bounce.

**Guest Apply**:
Allowing candidates to proceed directly to the external employer application URL without requiring Athyna account creation or login.
_Avoid_: Anonymous apply, bypass apply.

**Sign-Up Wall**:
A mandatory registration or login barrier presented to candidates before they can view jobs or apply.
_Avoid_: Paywall, auth wall.

**Smart Back Navigation**:
A dual-mode history handler that inspects referrer origin, executing browser back navigation for internal visitors to preserve filtered catalog state while routing external direct arrivals to the primary catalog root.
_Avoid_: Browser back, history pop, back link.

## Discovery & Search

**Search Intent Tokenization**:
Extracting structured attribute dimensions (such as remote eligibility, employment type, or specific skills) from free-text queries rather than passing raw text into naive substring matching.
_Avoid_: Natural language search, query translation.

**Auto-Promoted Filter Chip**:
An active filter badge rendered visibly above search results automatically when recognized intent tokens are parsed from a search query.
_Avoid_: Dynamic tag, auto-filter.

**Interactive Toolbar Filters**:
Inline popover dropdown pills docked above the listings catalog that allow immediate multi-select and range filtering directly synchronized with search intent chips.
_Avoid_: Filter drawer, filter modal, filter sidebar.

**Zero-Result Fallback**:
An intentional empty state displayed when a search yields no exact matches, offering one-click suggestions to relax specific filters.
_Avoid_: Empty state, 404 search.

**Dimension Relaxation**:
The algorithmic evaluation of query constraints that calculates exact match yields across individual dimensions to offer one-click fallback suggestions when zero exact results exist.
_Avoid_: Fuzzy search, broadened query, fallback search.

## Job Detail & Mobile Experience

**Sticky Action Bar**:
A persistent, docked toolbar at the bottom of the mobile viewport that keeps the primary application call-to-action (and save button) accessible regardless of scroll depth.
_Avoid_: Floating button, bottom nav.

**Scannable Summary ("At a Glance")**:
A concise, structured badge cluster rendered above the fold summarizing vital decision criteria (compensation, location/remote policy, employment type, tech stack) to enable fast evaluation.
_Avoid_: Job overview, summary card.

**Smart Summary**:
A standardized above-the-fold badge and bullet cluster synthesizing core role responsibilities, required skills, work arrangements, and compensation into a 3-second evaluation surface.
_Avoid_: AI snippet, description preview, job blurb.

**Guest Role Interactions**:
Client-side candidate state toggles (such as saving a role or marking an application as submitted) persisted directly in browser storage without requiring user registration.
_Avoid_: Account bookmarks, user favorites, logged-in saves.

**Similar Roles Shelf**:
A contextual recommendation section displaying related job openings matching the current job's skills and seniority to encourage continuous browsing.
_Avoid_: Related jobs, job carousel.

