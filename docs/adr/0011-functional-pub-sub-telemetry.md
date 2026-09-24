# 0011. Functional Pub/Sub Telemetry Dispatcher

To prevent unnecessary React component re-renders caused by telemetry state updates and simplify event dispatching across both server-adjacent components and client trees, we refactored telemetry from a React Context Provider to a lean, standalone pub/sub module in `lib/telemetry.ts`.

## Considered Options

### Option 1: React Context Provider (`TelemetryProvider`)
- Wrap the entire application tree in a React Context that provides tracking methods via `useTelemetry()`.
- **Why rejected:** In commit `6900bad`, this was refactored because context providers forced all subscribing components to re-render, added tree nesting in `layout.tsx`, and prevented tracking events in utility functions or outside React render cycles.

### Option 2: Direct Third-Party SDK Calls
- Directly invoke `posthog.capture()` or `analytics.track()` at call-sites.
- **Why rejected:** Tightly couples the domain layer and UI components to a specific analytics vendor, preventing headless unit testing and easy switching.

### Option 3: Lean Functional Pub/Sub Module — Chosen
- Implement typed functions `trackEvent(name, payload)` and `onTelemetry(callback)` backed by an in-memory subscriber array and `console.debug` logger.
- **Why chosen:** Zero React context overhead, zero re-renders, callable from any function or hook, and completely isolated behind a clean contract ready to connect to PostHog or Segment.

## Consequences

- Components dispatch telemetry directly via `trackEvent` without needing `useContext`.
- Listeners (e.g. debug inspectors or analytics SDK adapters) register via `onTelemetry`.
