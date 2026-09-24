# 0003. Mobile Detail Experience and Retention

Mobile traffic accounts for 61% of total visitors but converts detail-to-apply at only 8% (compared to 24% on desktop), with a median bounce time of 11 seconds and an average session depth of 1.2 views. Furthermore, 74% of users who hit the sign-up wall abandon the platform entirely. We decided to implement a mobile-first sticky action bar, above-the-fold scannable metadata, and frictionless post-apply role recommendations (Option A).

## Considered Options

### Option A: Sticky Bottom Bar + Frictionless Post-Apply Recommendations — Chosen
- **Sticky Action Bar:** Renders a fixed toolbar at the bottom of the mobile viewport with role title, salary snippet, and a high-contrast "Apply" button. The primary CTA is visible from second 0 through second 11 and beyond, eliminating the need to scroll through thousands of words of text.
- **Above-the-Fold "At a Glance" Summary:** Highlights compensation, remote policy, employment type, and key skills immediately below the header so candidates can assess qualification in under 5 seconds.
- **Post-Apply Retention:** Clicking "Apply" opens the employer destination immediately in a new tab (zero friction). The current Athyna tab transitions to display a "Similar Roles You May Qualify For" shelf based on the current job's skills and seniority.
- **Why chosen:** Solves the mobile conversion deficit without placing any barrier between the user and their application, while providing an immediate off-ramp to explore a second role to combat the 1.2 views/session bounce.

### Option B: Pre-Apply Interstitial Modal
- Intercept the "Apply" click with an interstitial modal asking the user to log in or leave an email for reminders and job alerts before redirecting.
- **Why rejected:** The analytics demonstrate that 74% of users abandon when hitting a sign-up wall. Adding a blocking modal immediately before the external application risks triggering that exact churn at the highest-intent moment in the funnel.

### Option C: Inline Static Summary + Bottom Similar Jobs Carousel Only
- Move the apply CTA higher into the static page body and add a recommendations carousel at the end of the text.
- **Why rejected:** As soon as the candidate begins scrolling through responsibilities or requirements, the CTA scrolls out of view. Given the 11-second median bounce, static body buttons fail to provide the persistent affordance needed on long mobile viewports.

## Consequences

- The mobile layout must account for the height of the sticky action bar by applying appropriate bottom padding to avoid obscuring page content or footer links.
- The external application trigger must handle new tab redirection cleanly across mobile web browsers while updating the current view state.

