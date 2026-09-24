## Problem Statement

Athyna's traffic analytics indicate that 61% of all visitors arrive on mobile devices, yet mobile converts from detail-to-apply at only 8% (compared to 24% on desktop), with a median session duration of just 11 seconds before bouncing. Desktop visitors, conversely, face poorly structured data layouts that hinder quick scanning of compensation, seniority, and matching criteria. The current homepage lacks an inviting, high-converting discovery experience with clear visual hierarchy, intuitive search entry points, and responsive listing presentations.

## Solution

Rebuild the core Homepage - Athyna discovery and listings experience matching Stitch screen `95704cdf34e0453e9f2be3dbbc178983`:
- An engaging hero section featuring ambient lavender lighting, nostalgic 8-bit pixel accents, a prominent search input, and 12 clickable popular search tags for one-touch filtering.
- A comprehensive filter and controls toolbar with live search filtering, dropdown pills (Location, Type, Level, Salary, Relevance), scope controls, and real-time match counters.
- A high-density 12-column desktop tabular layout segmenting role title, AI match score, company name, location, metadata badges, salary, and direct action triggers.
- A mobile-first responsive card layout reflowing tabular rows into structured vertical cards with above-the-fold qualification badges to solve the 11-second mobile bounce.
- A prominent full-width Mint Emerald "Unlock all jobs" CTA bar driving conversion.

## User Stories

1. As a candidate arriving on the homepage, I want to see an engaging hero header with clear copy and playful pixel art, so that I immediately understand Athyna's focus on premier AI roles.
2. As a candidate seeking quick ideas, I want to see popular search tags (such as "AI Engineer", "ML", "Prompt Engineering", "NLP", "Gen AI"), so that I can browse relevant niches with a single tap.
3. As a candidate typing into the hero search bar, I want clicking "Search" to smoothly scroll down to the filtered results table, so that I can see matching opportunities without manual scrolling.
4. As a candidate browsing jobs on desktop, I want listings displayed in a clean 12-column tabular format, so that I can compare company names, locations, levels, and salaries across multiple positions at a glance.
5. As a candidate browsing jobs on mobile, I want listings displayed as clear, compact vertical cards with full-sized tap targets, so that I can easily browse and apply using one hand.
6. As a candidate evaluating role fit, I want to see an AI match percentage (such as 95%) with a lightning bolt badge, so that I can prioritize jobs that best match my qualifications.
7. As an unregistered visitor, I want to see a subtle "Login to unlock" badge next to the match score, so that I am encouraged to join the network for personalized scoring.
8. As a candidate looking for compensation transparency, I want to see clear annual or hourly salary figures prominently displayed, so that I only spend time on roles meeting my financial requirements.
9. As a candidate filtering listings in real time, I want a live search box in the toolbar that immediately filters rows as I type, so that I can find specific companies or skills without reloading the page.
10. As a candidate refining my search, I want filter dropdown pills for Location, Type, Level, Salary, and Relevance, so that I can tailor the listing to my exact career preferences.
11. As a candidate, I want to see a verified counter showing the number of matching remote jobs updated in real-time, so that I know the inventory is fresh.
12. As a candidate reaching the end of the initial preview listings, I want to see a full-width Mint Emerald "Unlock all jobs" button, so that I have a clear and compelling conversion path to access the full catalog.
13. As a candidate ready to apply, I want clicking "Apply now" on any listing to open the application link directly in a new tab, so that I do not lose my place on the Athyna board.
14. As a candidate wanting full role details, I want to click on a job card or title to navigate directly to its dedicated job detail view (`/jobs/[id]`), so that I can evaluate responsibilities, requirements, and similar roles.

## Implementation Decisions

- **Hero Section Composition**:
  - Center-aligned layout with ambient radial lavender gradient blur (`rgba(229, 222, 255, 0.3)`).
  - Floating left pastel pixel cluster vector and right 8-bit cursor motif vector.
  - Headline featuring gradient text ("Be the future of AI") with italic serif accent styling.
  - Big pill-shaped search input container with leading search glyph and high-contrast submit button.
  - Popular searches badge row wrapping 12 domain pills (`AI Engineer`, `ML`, `Data Scientist`, `Data Engineer`, `Prompt Engineering`, `NLP`, `Gen AI`, `Deep Learning`, `Software Engineer`, `DevOps`, `QA`, `Product Manager`).
- **Filter & Controls Toolbar**:
  - Container with rounded-2xl geometry and subtle drop shadow.
  - Real-time search input integrated with client-side filtering logic.
  - Five filter dropdown pills with leading category icons and trailing chevron glyphs (Location, Type, Level, Salary, Relevance).
  - Scope switcher dropdown default set to "All jobs".
  - Real-time match count label accompanied by an active green status indicator dot.
- **Dual-Mode Listings Architecture**:
  - *Desktop (>= 1024px)*: 12-column grid system dividing columns: Role name & company (4 cols), Match index & unlock chip (2 cols), Company (1 col), Location (2 cols), Details badges (1 col), Salary (1 col), Action button (1 col). Role title links to `/jobs/[id]`.
  - *Mobile (< 768px)*: Card view stacking role title, company avatar, location, qualification chips, and full-width action button. Entire card header navigates to `/jobs/[id]`.
- **Paywall / Growth Conversion Bar**:
  - Full-width container positioned at the bottom of the table with rounded-full Mint Emerald button (`#2ED197`), hover brightness shift, and unlock icon.
- **Micro-Interactions**:
  - Row hover transition shifting background to `#F9F9FB` with 150ms ease.
  - Smooth scroll behavior when submitting queries from the hero input.

## Testing Decisions

- **Testing Philosophy**: Verify user discovery workflows end-to-end through observable DOM updates, ensuring search inputs, tag clicks, and responsive switches render the expected items and counts.
- **Seams Tested**:
  - *Discovery & Filtering Seam*: Test that entering a query or clicking a popular tag updates the displayed job rows and updates the match count indicator.
  - *Responsive Presentation Seam*: Verify desktop table headers are hidden on mobile viewports (< 768px) and mobile card metadata is rendered cleanly.
  - *Action Trigger Seam*: Verify clicking "Apply now" triggers the application link with `target="_blank"` and dispatches `apply_cta_clicked` telemetry.
- **Prior Art**: Next.js App Router component testing with React Testing Library and user event simulation.

## Out of Scope

- Paginated server-side infinite scrolling (initial implementation renders top priority verified roles with conversion unlock bar).
- Drag-and-drop column reordering.
- Complex multi-select filter modal dialogs (filter chips provide immediate direct manipulation).

## Further Notes

This discovery experience is optimized for the < 11-second attention window identified in the brief, prioritizing immediate visual clarity and frictionless application.
