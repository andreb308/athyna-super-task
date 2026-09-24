# 0002. Client-Side Search Intent Parser

Athyna's search input currently operates as a literal title-substring search, causing three of the top five user queries ("remote", "part time", "React") to return zero results. Meanwhile, users who apply filters convert at 3x the baseline rate, but only 24% of users interact with manual filter menus. We decided to implement an intent parser that extracts structured parameters from search input and automatically promotes them into visible, interactive filter chips (Option 2).

## Considered Options

### Option 1: Silent Parameter Rewriter
- Intercept the query string, match known keywords ("remote" -> `remote=true`, "part time" -> `employmentType=Part-time`, "React" -> `skills=React`), and silently append them to the API request while keeping the raw string in the input.
- **Why rejected:** The candidate receives no visual confirmation of why certain results appeared or why terms were modified. Crucially, it misses the opportunity to expose the filter interface to the 76% of users who never touch manual dropdowns.

### Option 2: Intent Parser with Auto-Promoted Filter Chips — Chosen
- As the user submits a search (e.g., `"remote react engineer"`):
  1. The client tokenizes the query against known attribute dictionaries (work arrangements, employment types, high-frequency skills).
  2. Extracted attributes are removed from free-text `q` and rendered as removable filter chips above the results (e.g., `[Remote ✕]`, `[Skill: React ✕]`).
  3. The request maps cleanly to the existing API schema: `q=engineer&remote=true&skills=React`.
  4. If a query still yields zero results, the UI provides an actionable fallback offering one-click suggestions to relax individual constraints.
- **Why chosen:** Directly bridges the two findings—it eliminates the zero-result dead end on top searches while dynamically activating the 3x filter conversion mechanic without requiring extra clicks.

### Option 3: Typeahead / Autocomplete Dropdown Only
- Maintain naive string search by default, but display a dropdown suggestions menu as the user types (e.g., "Filter by 'remote' in Work Type", "Filter by 'React' in Skills").
- **Why rejected:** If the candidate presses Enter without explicitly selecting a dropdown item, they still fall into the zero-result title-substring trap. Building accessible, debounced, and mobile-friendly autocomplete menus also consumes disproportionate engineering time within an 8-hour window.

## Consequences

- The client requires a lightweight keyword/token mapping utility covering standard work types and skills.
- Filter chips and URL search parameters must remain synchronized so that shared search URLs retain both parsed filters and remaining search text.

