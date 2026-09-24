# 0006. Next.js App Router Framework Choice

To address the 43% of candidate traffic arriving directly from Google organic search onto job detail pages with an 11-second median bounce, we chose Next.js 15 App Router (with React 19, Turbopack, and Tailwind CSS v4) over a standalone Vite SPA. Server-side rendering and dynamic OpenGraph/SEO metadata pre-generation guarantee sub-second First Contentful Paint and rich social snippets for incoming organic visitors without client-side rendering waterfalls.

## Considered Options

### Option 1: Vite + React SPA
- Build a lightweight single-page application using Vite and React.
- **Why rejected:** Vite requires shipping a client-side bundle before any HTML content can be parsed. For the 43% of users landing directly from Google on mobile devices, an empty HTML shell with client-side JavaScript execution extends time-to-interactive and First Contentful Paint beyond the critical 11-second bounce window. Furthermore, public job postings rely heavily on search engine crawling and OpenGraph meta tags, which pure client-rendered SPAs handle poorly without third-party pre-rendering services.

### Option 2: Next.js 15 App Router (Turbopack + React 19) — Chosen
- Build on Next.js 15 App Router leveraging React Server Components for initial role page rendering (`page.tsx` with dynamic `generateMetadata`) and fast client components for interactive search.
- **Why chosen:** Delivers pre-rendered HTML for direct Google arrivals to maximize retention during the initial 11 seconds, enables native dynamic metadata generation for job posting SEO, and provides zero-config build/runtime performance via Turbopack while remaining fully compatible with modern component libraries.

### Option 3: Remix / React Router v7
- Use Remix / React Router v7 with SSR loaders and actions.
- **Why rejected:** While strong for SSR, Next.js 15 App Router provided immediate alignment with Athyna's existing code conventions, `@athynacom/athyna-ui` component structures (seen in Exercise 3), and standard deployment ergonomics with zero custom server configuration.

## Consequences

- Direct arrivals receive fully hydrated server-rendered HTML with correct SEO meta tags and preview data.
- Interactive client components require explicit `"use client"` boundaries and client-side lifecycle management.
