# 0001. High-Intent Funnel Scope

The analytics snapshot revealed severe funnel leakage at both ends: search yields zero results for top queries, while 43% of traffic lands directly on detail pages via Google and 61% of mobile users convert at only 8% with an 11-second median bounce. We decided to anchor our scope on the "High-Intent Loop" (Option C), combining client-side search intent discovery with mobile direct-arrival retention, rather than treating the list page and detail page in isolation.

## Considered Options

### Option A: The Direct-Arrival & Mobile Conversion Engine (Detail Page Focus)
- Focus entirely on the 43% direct Google arrivals and 61% mobile visitors.
- Scope would build a sticky mobile CTA bar, an above-the-fold "At a Glance" summary, and a "Similar Roles" shelf to combat the 11-second bounce and 1.2 views/session limit.
- **Why rejected as sole focus:** While high-impact, ignoring the search discovery experience leaves the top 5 query failures ("remote", "part time", "React") unaddressed. For a Product Engineer evaluation, treating only the tail end leaves the primary navigation broken for intentional searchers.

### Option B: Smart Intent Search & Discovery (List Page Focus)
- Focus entirely on fixing the list search experience.
- Scope would build query parsing, filter pills, and zero-state recovery.
- **Why rejected as sole focus:** 43% of traffic lands directly from Google on job detail pages and never interacts with the search bar. Furthermore, 61% of volume is mobile where conversion is an abysmal 8%. Focusing only on search fixes discovery for a subset of users while ignoring the massive leak where the majority of traffic actually lands.

### Option C: The High-Intent Loop (Search Intent + Mobile Detail Retention) — Chosen
- Connects the two high-intent candidate entry points: candidates who search with explicit intent, and candidates who arrive directly from Google onto a specific job.
- Delivers an intent parser with auto-promoted filter chips for discovery, plus a mobile-optimized detail page with sticky actions and related role discovery.
- Fully buildable and testable within the ~8-hour project budget using Athyna's live read endpoints (`GET /api/public/jobs` and `GET /api/public/jobs/{id}`).

## Consequences

- The prototype scope encompasses both the search/list view and the job detail view, requiring clear seams and shared types between them.
- Deeper cosmetic redesigns and secondary features (e.g., complex multi-criteria filter drawers, applicant dashboards) must be strictly omitted to protect the ~8-hour budget.

