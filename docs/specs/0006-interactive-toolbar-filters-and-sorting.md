## Problem Statement

Although candidates who apply filters convert from detail-to-apply at 3x the baseline rate, only 24% of users interact with manual filter menus. While free-text search intent tokenization handles high-frequency queries like `"remote react"`, candidates frequently require precise refinement across secondary dimensions (specific city locations, multiple employment types, seniority levels, salary boundaries, or date recency). Without an accessible, interactive filter bar directly above the listings catalog, candidates must either repeatedly edit search strings or abandon their search when results are too broad.

## Solution

Deliver an integrated, interactive toolbar filter system positioned directly above the listings table:
- Five interactive dropdown controls: Location (free-text city input), Employment Type (multi-select options), Experience Level (multi-select options), Salary Range (custom min/max inputs with confirmation), and Relevance/Sorting (Most Relevant, Newest, Name A-Z).
- Bidirectional synchronization between toolbar dropdowns and Auto-Promoted Filter Chips: selecting a criteria in a dropdown immediately generates a removable chip above the listings; removing a chip automatically deselects the corresponding option in the dropdown.
- Real-time match counter accompanied by an active status indicator dot that updates instantly as filters are toggled.
- Keyboard-accessible popover containers with click-outside dismissal and accessible ARIA attributes.

## User Stories

1. As a candidate browsing jobs, I want to click the "Location" dropdown in the toolbar and type a specific city, so that I can filter listings to my desired metropolitan area.
2. As a candidate seeking non-standard work arrangements, I want to select multiple employment types (such as "Contract" and "Part-time") simultaneously from the Type dropdown, so that I see all matching flexible opportunities in one view.
3. As an experienced practitioner, I want to select multiple seniority levels (such as "Senior" and "Lead") from the Level dropdown, so that I can filter out junior roles.
4. As a candidate with strict compensation requirements, I want to enter custom minimum and maximum annual salary numbers in the Salary dropdown and click "Confirm", so that only roles meeting my financial criteria appear.
5. As a candidate who wants to see the latest openings first, I want to select "Newest" from the Relevance dropdown, so that the listings sort chronologically by publication date.
6. As an alphabetically minded searcher, I want to select "Name A-Z", so that listings sort alphabetically by job title.
7. As a candidate who activated a filter via a dropdown, I want an Auto-Promoted Filter Chip to appear above the table with an "✕" button, so that I have clear visual confirmation of all active constraints.
8. As a candidate dismissing an active filter chip, I want the corresponding checkbox or text input inside the dropdown to uncheck or clear automatically, so that toolbar state remains perfectly synchronized.
9. As a candidate opening a dropdown, I want clicking anywhere outside the menu or pressing Escape to close the popover cleanly, so that it does not obscure the listings table.
10. As a candidate adjusting filters, I want to see an updated count of matching jobs with an active green pulse indicator, so that I know exactly how many opportunities meet my criteria before scrolling.
11. As a keyboard user, I want full tab and enter navigation across all dropdown triggers, inputs, and selection checkboxes, so that I can filter without a mouse.
12. As a product analyst, I want `filter_chip_toggled` telemetry events emitted whenever a candidate toggles a filter via the toolbar, so that we can measure the adoption rate of manual filters versus search intent tokens.

## Implementation Decisions

- **Toolbar Component Architecture**: Implement an interactive container wrapping five distinct popover triggers with chevron indicators and badge count badges.
- **Multi-Select State Representation**: Support multi-select arrays for employment types and seniority levels, serializing them into comma-separated values for the public API query parameters.
- **Range & Location Synchronization**: Bind salary minimum/maximum values and city inputs to dedicated synthetic chips (`type: "salary"`, `type: "location"`), parsing and formatting them cleanly.
- **Bidirectional Event Seam**: Unify dropdown mutations with the `useSearchIntent` hook so that free-text tokenization and dropdown selections share a single source of truth for `activeChips` and `appliedFilters`.
- **Sorting Integration**: Pass `sortBy` and `sortOrder` directly into the query engine to execute client-side or server-side sorting without resetting active filter chips.

## Testing Decisions

- **Testing Philosophy**: Verify external user behavior through DOM interactions: clicking dropdown triggers, entering values, toggling checkboxes, and observing that table rows and match counters update correctly.
- **Seams Tested**:
  - *Dropdown Interaction Seam*: Test that clicking triggers opens popovers and clicking outside closes them.
  - *Multi-Select Filtering Seam*: Test that selecting multiple employment types filters listings to include any matching type.
  - *Salary Range Seam*: Test that submitting min/max salary inputs filters out jobs below min or above max.
  - *Bidirectional Sync Seam*: Test that toggling a dropdown adds an active chip, and removing the chip unchecks the dropdown option.
  - *Sort Order Seam*: Test that selecting "Newest" sorts jobs descending by published date.
- **Prior Art**: React Testing Library user-event simulations in `src/app/__tests__/page.test.tsx` and `src/components/search/__tests__/toolbar-filters.test.tsx`.

## Out of Scope

- Persisting toolbar filter selections across browser refreshes in `localStorage` (filters are session-scoped and URL-aligned).
- Complex nested boolean filter expressions (e.g. `(Remote AND Full-time) OR (Contract AND Senior)`).

## Further Notes

This feature directly supersedes the preliminary exclusion in ADR 0005 by implementing inline dropdowns rather than heavy modal drawers, delivering the 3x filter conversion lift with zero modal friction.
