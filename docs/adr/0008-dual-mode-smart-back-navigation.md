# 0008. Dual-Mode Smart History Back Navigation

To stop candidate leakage to competitor job boards caused by standard `router.back()` on the 43% of traffic arriving directly from Google organic search, we implemented a dual-mode back navigation check that inspects `document.referrer` against `window.location.origin`. Internal visitors are routed via `router.back()` to preserve their filtered catalog state, while external direct arrivals are gracefully routed to the Athyna catalog root (`/`).

## Considered Options

### Option 1: Unconditional `router.back()` (Status Quo in Exercise 3)
- Execute `window.history.back()` on every click.
- **Why rejected:** For 43% of traffic landing directly from Google, this kicks the candidate right back to the Google search results page, leaking high-intent talent directly to competitors (LinkedIn, Indeed, Otta) and driving the 11-second median bounce.

### Option 2: Hardcoded Link to `/` (`<Link href="/">`)
- Always navigate to the root homepage.
- **Why rejected:** Candidates who filtered before clicking a job convert at 3x baseline. A hard link wipes active filter chips, pagination, and scroll depth, frustrating candidates who want to return to their curated list.

### Option 3: Referrer-Based Dual-Mode Navigation — Chosen
- Check `document.referrer` and `window.history.length`. If navigating internally from Athyna, call `router.back()`. Otherwise, call `router.push("/")`.
- **Why chosen:** Directly bridges the two requirements: it preserves filtered state for intentional searchers while providing a safe on-ramp into the catalog for direct Google arrivals.

## Consequences

- The `SmartBackButton` component must be executed as a client component with window and document access.
- In headless test environments where `document.referrer` is empty, navigation safely defaults to the fallback catalog link.
