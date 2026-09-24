# 0005. Scope Exclusions and Trade-offs

Within an estimated 8-hour trial budget on a read-only development API, maintaining strict scope discipline is vital. We evaluated several plausible technical and product paths and explicitly excluded them to protect execution depth on the highest-leverage funnel improvements.

## Excluded Opportunities and Rationale

### 1. Logged-In Candidate Dashboard Redesign
- **Observation:** The authenticated candidate dashboard (`/screenshots/logged-in-dashboard/athyna_dashboard_desktop.png`) features a generic, stark SaaS table and sidebar that visually clashes with the vibrant public job board and appears empty for new users.
- **Why excluded:** The analytics prove that **74% of candidates abandon at the sign-up wall**. The overwhelming majority of users bounce before ever reaching the authenticated dashboard. Redesigning post-login UI when the top-of-funnel acquisition leaks at 61% mobile (8% conversion) and 43% direct Google bounce is addressing the wrong end of the user journey.

### 2. LinkedIn OAuth and Profile Auto-Fill
- **Observation:** In initial brainstorming (`brainstorm.md`), importing LinkedIn profile data was considered to reduce sign-up friction.
- **Why excluded:** Official access to the LinkedIn Profile API requires applying for enterprise programs (e.g., Talent Solutions) with approval taking 2 to 4 weeks. Scraping violates LinkedIn Terms of Service. Furthermore, Athyna's development API has no write endpoints for persistence. Guest external apply provides immediate conversion without auth infrastructure.

### 3. Backend Search Engine / Vector Search Migration
- **Observation:** The current backend endpoint performs naive title-substring filtering.
- **Why excluded:** As a frontend client implementation against fixed read-only endpoints, replacing backend indexing (e.g., Elasticsearch, Algolia, pg_vector) is out of scope. Implementing client-side query tokenization into the API's existing rich query parameters (`remote`, `skills`, `employmentType`) solves candidate pain points immediately without backend dependency.

### 4. Heavy Multi-Parameter Filter Drawers
- **Observation:** Athyna's public API supports extensive filtering (salary ranges, multiple countries, seniority levels).
- **Why excluded:** Only 24% of users interact with manual filter menus. Building elaborate multi-step filter drawers consumes excessive UI bandwidth for low user adoption. Promoting parsed search tokens into active filter chips delivers the 3x filter conversion benefit dynamically with zero extra interaction friction.

## Consequences

- All engineering effort in Exercise 2 is concentrated squarely on:
  1. The search input intent tokenizer and chip state.
  2. The responsive job detail page with sticky actions and similar job fetching.
  3. A robust telemetry abstraction to verify the success criteria.

