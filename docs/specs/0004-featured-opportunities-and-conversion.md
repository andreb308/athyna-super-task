## Problem Statement

Analytics show that candidate sessions average only 1.2 job detail views, meaning almost nobody browses a second job after landing on the site. Furthermore, of the users who encounter a sign-up wall, 74% abandon and never return. Without contextual retention shelves highlighting high-growth opportunities, personalized recommendations, or compelling conversion moments, candidates bounce after viewing a single role. The platform currently lacks mechanisms to nurture candidate interest or extend session depth.

## Solution

Implement the retention and conversion layer defined in the Stitch Homepage specification:
- An interactive tabbed showcase allowing candidates to toggle between **Hot new jobs** and **Recommended jobs**.
- A 3-column card grid highlighting high-demand roles with company avatars, trending sparkle badges, seniority chips, publication recency, and direct application links.
- The high-impact "Ready to help build the future of Athyna?" banner in deep brand purple (`#1D1635`), featuring retro pixel mosaic patterns, an 8-bit alien robot mascot, and a high-conversion Mint Emerald action button.
- Comprehensive telemetry tracking instrumenting all interaction points (`job_detail_viewed`, `apply_cta_clicked`, `similar_job_clicked`) to evaluate lift in session depth toward the > 1.8 target defined in SCOPING.md.
- A secondary conversion banner and newsletter capture in the footer to retain candidates not ready for immediate job applications.

## User Stories

1. As a candidate who has finished scanning the primary table, I want to explore curated "Hot new jobs", so that I can discover top breakout positions I might not have explicitly searched for.
2. As a candidate looking for tailored suggestions, I want to switch to the "Recommended jobs" tab, so that I can view roles aligned with emerging AI trends.
3. As a candidate viewing featured job cards, I want to see company initials, location, and a "Trending" badge with a sparkle icon, so that I can quickly identify high-momentum employers.
4. As a candidate on a featured card, I want to see seniority and employment type tags, so that I know immediately if the role fits my career level.
5. As a candidate browsing cards, I want an "Apply now" button with a right arrow that elevates on hover, so that applying to compelling roles is effortless.
6. As a candidate interested in Athyna's own mission, I want to see the "Ready to help build the future of Athyna?" banner, so that I can explore joining Athyna's internal team directly.
7. As a developer browsing the banner, I want to see authentic 8-bit alien robot and pixel mosaic artwork, so that the experience feels creative, nostalgic, and tailored to builders.
8. As a candidate not ready to apply today, I want to enter my email into the newsletter input in the footer, so that I can receive monthly insights, salary trends, and curated job alerts.
9. As a product analyst, I want tab switch events tracked whenever a candidate toggles between "Hot new jobs" and "Recommended jobs", so that we can evaluate engagement with curated content.
10. As a product analyst, I want `apply_cta_clicked` events to include the source card position and target job details, so that we can measure the conversion efficiency of cards versus tabular rows.
11. As a mobile visitor, I want the featured cards grid to stack into a clean single-column carousel or vertical feed, so that cards are easily readable on narrow screens without horizontal clipping.
12. As a candidate who opens an application link, I want the external employer page to open in a new tab without blocking interstitials, so that I can return to browse additional recommended roles without friction.

## Implementation Decisions

- **Interactive Tab Controller**:
  - Controlled client state toggling between `'hot'` and `'recommended'` view modes.
  - Active tab rendered with bold headline typography and an animated primary purple underline indicator bar.
  - Inactive tab rendered in muted foreground text with smooth hover contrast transition.
- **Featured Card Component Specification**:
  - Pure white surface (`#FFFFFF`) with 12px rounded corners, subtle border, and soft elevation on hover (`0 4px 16px -2px rgba(98, 70, 234, 0.08)`).
  - Header: 48x48 rounded company icon container, company name and location metadata, and pill badge with purple sparkle glyph.
  - Title: 2-line clamp headline font transitioning to brand violet on card hover.
  - Footer: Publication timestamp ("Published 13 hours ago") and primary link with right chevron icon.
- **Future of Athyna Hero Banner**:
  - Dark container styled in `#1D1635` with 24px border radius and deep drop shadow.
  - Top-left decorative pixel mosaic pattern vector with 40% opacity.
  - Bottom-right 8-bit space invader / alien robot vector with 85% opacity.
  - Center content with headline ("Ready to help build the future of Athyna?"), mint-underlined "Athyna" accent, supporting paragraph, and large Mint Emerald CTA button (`#2ED197`).
- **Telemetry Event Pipeline**:
  - Implement logger dispatching events to console/mock store:
    - `apply_cta_clicked`: `{ jobId: string, position: 'featured_card' | 'table_row' | 'banner', company: string, device: 'desktop' | 'mobile' }`
    - `similar_job_clicked`: `{ sourceJobId: string, targetJobId: string, position: number }`
    - `newsletter_subscribed`: `{ email: string, source: 'footer' }`

## Testing Decisions

- **Testing Philosophy**: Verify that tab interactions properly alter the rendered card list in the DOM, that card links point to valid targets with security attributes (`rel="noopener noreferrer"`), and that click events trigger telemetry dispatches.
- **Seams Tested**:
  - *Tab State & Grid Render Seam*: Test that clicking the "Recommended jobs" tab replaces hot job cards with recommended cards and moves the active indicator.
  - *Card Interaction & Navigation Seam*: Test that card apply links render correct URLs and trigger click handlers.
  - *Conversion Banner Seam*: Test newsletter form submission prevents default page reload and records telemetry.
- **Prior Art**: React Testing Library tab component integration tests and simulated user interaction suites.

## Out of Scope

- Backend database persistence of newsletter email subscribers (mock acknowledgement is sufficient for this scope).
- User authentication gates on featured job cards (all featured roles offer frictionless direct external application per SCOPING.md ADR 0005).

## Further Notes

This spec directly targets lifting session depth from the baseline of 1.2 toward the > 1.8 goal set in SCOPING.md by providing high-visibility secondary exploration paths.
