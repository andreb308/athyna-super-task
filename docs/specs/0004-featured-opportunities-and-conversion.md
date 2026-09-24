## Problem Statement

Analytics show that candidate sessions average only 1.2 job detail views, meaning almost nobody browses a second job after landing on the site. Without contextual discovery opportunities and compelling conversion moments, candidates bounce after viewing a single role. The platform currently lacks mechanisms to nurture candidate interest, highlight standout opportunities, and extend session depth.

## Solution

Implement the featured opportunities and employer branding layer:
- A responsive card grid highlighting curated high-demand roles with company avatars, trending sparkle badges, seniority chips, publication recency, and direct application links.
- The high-impact "Ready to help build the future of Athyna?" banner in deep brand purple (`#1D1635`), featuring retro pixel mosaic patterns, an 8-bit alien robot mascot, and a high-conversion Mint Emerald action button.
- Comprehensive telemetry tracking instrumenting all interaction points (`apply_cta_clicked`, `similar_job_clicked`) to evaluate lift in session depth toward the > 1.8 target defined in SCOPING.md.

## User Stories

1. As a candidate who has finished scanning the primary table, I want to explore curated featured roles, so that I can discover top breakout positions I might not have explicitly searched for.
2. As a candidate viewing featured job cards, I want to see company initials, location, and a "Trending" badge with a sparkle icon, so that I can quickly identify high-momentum employers.
3. As a candidate on a featured card, I want to see seniority and employment type tags, so that I know immediately if the role fits my career level.
4. As a candidate browsing cards, I want an "Apply now" button with a right arrow that elevates on hover, so that applying to compelling roles is effortless.
5. As a candidate wanting full role details from a featured card, I want to click the role title to navigate directly to `/jobs/[id]`, so that I can evaluate the complete description.
6. As a candidate interested in Athyna's own mission, I want to see the "Ready to help build the future of Athyna?" banner, so that I can explore joining Athyna's internal team directly.
7. As a developer browsing the banner, I want to see authentic 8-bit alien robot and pixel mosaic artwork, so that the experience feels creative, nostalgic, and tailored to builders.
8. As a product analyst, I want `apply_cta_clicked` events to include the source card position and target job details, so that we can measure the conversion efficiency of cards versus tabular rows.
9. As a mobile visitor, I want the featured cards grid to stack into a clean single-column vertical feed, so that cards are easily readable on narrow screens without horizontal clipping.
10. As a candidate who opens an application link, I want the external employer page to open in a new tab without blocking interstitials, so that I can return to browse additional recommended roles without friction.

## Implementation Decisions

- **Featured Card Component Specification**:
  - Pure white surface (`#FFFFFF`) with 12px rounded corners, subtle border, and soft elevation on hover (`0 4px 16px -2px rgba(98, 70, 234, 0.08)`).
  - Header: 48x48 rounded company icon container, company name and location metadata, and pill badge with purple sparkle glyph.
  - Title: 2-line clamp headline font transitioning to brand violet on card hover, linking to `/jobs/[id]`.
  - Footer: Publication timestamp ("Published 13 hours ago") and primary link with right chevron icon.
- **Future of Athyna Hero Banner**:
  - Dark container styled in `#1D1635` with 24px border radius and deep drop shadow.
  - Top-left decorative pixel mosaic pattern vector with 40% opacity.
  - Bottom-right 8-bit space invader / alien robot vector with 85% opacity.
  - Center content with headline ("Ready to help build the future of Athyna?"), mint-underlined "Athyna" accent, supporting paragraph, and large Mint Emerald CTA button (`#2ED197`).
- **Telemetry Event Pipeline**:
  - Dispatch structured events via client telemetry provider:
    - `apply_cta_clicked`: `{ jobId: string, position: 'featured_card' | 'table_row' | 'banner', company: string, device: 'desktop' | 'mobile' }`
    - `similar_job_clicked`: `{ sourceJobId: string, targetJobId: string, position: number }`

## Testing Decisions

- **Testing Philosophy**: Verify that card interactions properly trigger navigation and telemetry dispatches, and that external links render with required security attributes (`rel="noopener noreferrer"`).
- **Seams Tested**:
  - *Card Navigation & Link Seam*: Test that card apply links render correct external application targets and title links route to the role detail page.
  - *Telemetry Dispatch Seam*: Test that clicking "Apply now" on featured cards dispatches the `apply_cta_clicked` event with the correct card position metadata.
- **Prior Art**: React Testing Library component integration tests and simulated user click suites.

## Out of Scope

- User authentication gates on featured job cards (all featured roles offer frictionless direct external application per SCOPING.md ADR 0005).
- Internal Athyna hiring application submission forms (the banner CTA links to Athyna's public careers portal).

## Further Notes

This component provides a high-visibility discovery path at the bottom of the listings page, directly targeting the average session depth metric without introducing authentication friction.
