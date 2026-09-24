## Problem Statement

Athyna receives 43% of detail page traffic directly from Google organic search. Search engine crawlers require accurate OpenGraph and meta title tags to index roles effectively and display rich search snippets. Furthermore, Athyna has two coexisting URL conventions: internal API UUID routes (`/jobs/[id]`) and legacy/public vanity slug routes (`/role/[slug]`, e.g. `ath-legal`). If incoming links to `/role/[slug]` return 404 or lack rich metadata, search rankings drop and direct-arrival candidates land on broken pages.

## Solution

Implement a **Dual Dynamic Routing and Server-Side SEO Metadata Engine**:
- Support both `/jobs/[id]` and `/role/[slug]` using Next.js 15 App Router server components.
- Server-side dynamic `generateMetadata` fetching role details to emit custom HTML `<title>` tags (`${job.title} at ${job.company.name} | Athyna`) and descriptive meta summaries for search crawlers.
- Dual-key in-memory repository indexing in `jobs-repository.ts` that maps both UUIDs and URL slugs to cached job records.
- Server-to-client initial data hydration passing `initialJob` into client components, eliminating blank-page loading spinners on organic entry.

## User Stories

1. As a candidate clicking a shared vanity link (`/role/ath-legal`), I want the job details page to load seamlessly, so that I don't see a 404 error.
2. As a candidate discovering Athyna through Google search, I want search result titles to display the specific role and company name clearly, so that I know the link is relevant to my query.
3. As a candidate landing on a job URL on mobile, I want initial role information rendered server-side on first paint, so that I don't stare at a blank loading screen while JavaScript bundles download.
4. As an employer sharing an Athyna job on LinkedIn or Slack, I want rich preview unfurls displaying the job title and company overview, so that the post looks professional.
5. As a candidate following an invalid or expired job link, I want the page to display an informative "Job Not Found" state with links back to active listings, so that I am not stranded.

## Implementation Decisions

- **Next.js 15 Route Architecture**: Implement both `src/app/jobs/[id]/page.tsx` and `src/app/role/[slug]/page.tsx` delegating to the unified `JobDetailsClient` component.
- **Dynamic Server Metadata**:
  - Dynamically query `getJobById(slug)` within `generateMetadata`.
  - Return formatted title: `${job.title} at ${job.company.name} | Athyna`.
  - Return formatted meta description from `job.overview` or fallback attributes.
- **Dual-Key Caching**: In `jobs-repository.ts`, populate `jobCache.set(job.id, job)` and `jobCache.set(job.slug, job)` simultaneously upon fetch.

## Testing Decisions

- **Testing Philosophy**: Verify route parameter extraction, metadata generation, and repository retrieval for both ID and slug parameters.
- **Seams Tested**:
  - Test `getJobById` retrieves job when queried with UUID or vanity slug.
  - Test `generateMetadata` outputs title containing role title and company name.
- **Prior Art**: Next.js App Router server component tests.

## Out of Scope

- XML Sitemap generation (can be added in future CI pipeline).
