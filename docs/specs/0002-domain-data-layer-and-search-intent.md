## Problem Statement

Athyna's acquisition data shows that three of the top five candidate search queries (`"remote"`, `"part time"`, `"React"`) return zero results because existing search naively performs title-substring matching against a database where `"remote"` is a boolean column, `"part time"` is an employment type, and `"React"` is stored in a skills array. Furthermore, candidates who apply a filter convert detail-to-apply at 3x the baseline rate, yet only 24% of users navigate manual filter menus. Candidates are directly articulating structured criteria in the search bar, but the platform treats it as an opaque string, dead-ending high-intent users before they ever see relevant roles.

## Solution

Build a domain data layer and client-side intent engine aligned with the Athyna Public Jobs API specification and Architecture Decision Record 0002:
- An intelligent intent parser that deconstructs natural language and compound search terms into typed criteria: boolean remote flags, employment types, seniority levels, recognized technical skills, and residual free-text keywords.
- An API data client implementing the contract of Athyna's public endpoints (`GET /api/public/jobs` and `GET /api/public/jobs/{id}`) supporting query parameters (`q`, `remote`, `skills`, `seniority`, `employmentType`, `city`, `salary`, `sortBy`, `sortOrder`).
- An offline/sandbox resilient dataset providing real job records matching the exact schema returned by `develop.api.athyna.com`.
- Telemetry instrumentation capturing search queries, extracted filters, result yields, and filter toggles to measure the reduction in zero-result rates.

## User Stories

1. As a candidate typing `"remote"`, I want the system to understand that I am seeking remote-friendly positions, so that I see remote roles instead of a blank zero-result screen.
2. As a candidate searching `"part time"`, I want the platform to recognize this as an employment type filter, so that matching part-time opportunities are surfaced immediately.
3. As a developer typing `"React engineer"`, I want the platform to extract `"React"` as a skill and `"engineer"` as a title query, so that I find relevant frontend and full-stack positions.
4. As a candidate typing compound queries like `"senior remote python"`, I want the system to parse `seniority: SE`, `remote: true`, and `skills: [Python]`, so that I receive targeted high-relevance matches.
5. As a candidate who makes a typo or enters an ultra-specific query that yields zero exact matches, I want the system to provide actionable fallback recommendations, so that I can relax specific parameters without starting over from scratch.
6. As a candidate, I want to see extracted search attributes promoted as interactive filter chips, so that I have complete visibility and control over how my query was interpreted.
7. As a candidate, I want to click any promoted filter chip to dismiss or modify it, so that I can broaden or narrow my search results instantly.
8. As a candidate browsing jobs, I want consistent data attributes (company name, logo, location, salary min/max, employment type, seniority) formatted cleanly, so that I can evaluate role compatibility in seconds.
9. As a product engineer, I want the data client to adhere to the public API schema (`AthynaJob` and `AthynaJobsResponse`), so that the frontend can seamlessly switch between live development endpoints and local mock stubs.
10. As a product analyst, I want `search_query_submitted` events emitted with raw query strings, extracted filter maps, and result counts, so that we can track whether zero-result queries drop below 5%.
11. As a product analyst, I want `filter_chip_toggled` events tracked whenever a candidate interacts with an auto-promoted chip or manual filter, so that we can measure adoption of the 3x-converting filter loop.
12. As a mobile user on an unstable connection, I want cached and local fallback data available immediately, so that network latency does not degrade my initial browsing experience.

## Implementation Decisions

- **Domain Type Shape**: Standardize on the Athyna Public Jobs API schema encoding jobs and paginated responses:
  ```ts
  export interface AthynaJob {
    id: string;
    slug: string;
    title: string;
    url: string;
    applicationUrl: string;
    company: {
      name: string;
      logoUrl: string | null;
      websiteUrl: string | null;
    };
    location: {
      city: string | null;
      country: string | null;
      locality: string | null;
      isRemote: boolean;
    };
    employmentType: string;
    seniority: string;
    category: string | null;
    experience?: {
      minYears: number | null;
      maxYears: number | null;
    };
    salary: {
      min: number | null;
      max: number | null;
      currency: string | null;
      period: string | null;
    } | null;
    skills: string[];
    overview: string | null;
    description: string;
    publishedAt: string;
    updatedAt: string;
    matchIndex?: number;
  }
  ```
- **Client-Side Intent Parser Grammar**: Implement deterministic token recognition based on a curated domain glossary:
  - *Remote tokens*: `"remote"`, `"wfh"`, `"work from home"` -> `isRemote: true`.
  - *Employment types*: `"part time"`, `"part-time"`, `"contract"`, `"full time"`, `"full-time"` -> `employmentType`.
  - *Seniority levels*: `"senior"`, `"sr"`, `"lead"`, `"principal"`, `"staff"`, `"junior"`, `"jr"`, `"associate"`, `"intern"` -> `seniority`.
  - *Skill dictionary*: `"react"`, `"python"`, `"ai"`, `"ml"`, `"nlp"`, `"typescript"`, `"node"`, `"prompt engineering"`, `"devops"`, `"qa"` -> `skills: string[]`.
  - *Residual keywords*: Remaining terms become the keyword search query `q`.
- **Zero-Latency In-Memory Filtering**: Provide a local query engine executing the same filter predicates against the dataset, ensuring instant client-side updates as the user types without UI hitching or debounce lag.
- **Resilient Multi-Source Data Provider**: Provide a unified data layer that attempts live endpoint fetching (`https://develop.api.athyna.com/api/public/jobs`) and automatically falls back to the high-fidelity mock dataset with real job records when running offline or in restricted sandbox environments.
- **Telemetry Event Contract**: Structured telemetry dispatcher supporting:
  - `search_query_submitted`: `{ rawQuery: string, extractedFilters: Record<string, unknown>, resultCount: number }`
  - `filter_chip_toggled`: `{ filterType: string, filterValue: string, action: 'add' | 'remove', source: 'auto_promote' | 'manual' }`

## Testing Decisions

- **Testing Philosophy**: Focus testing on pure domain logic and observable data transformations rather than network transport or private parser state. Ensure that all canonical dead-end queries produce correct structured representations.
- **Seams Tested**:
  - *Intent Parser Functional Seam*: Unit tests passing representative queries (`"remote"`, `"part time"`, `"react"`, `"senior remote python"`, `"data engineer"`) and verifying the returned structured filter object.
  - *Data Provider Contract Seam*: Verification that both live response payloads and mock fallback data conform strictly to `AthynaJobsResponse` typing.
  - *Telemetry Dispatcher Seam*: Verification that search and filter interactions produce well-formed event payloads matching the telemetry specification.
- **Prior Art**: Architectural decision record ADR 0002 (`client-side-search-intent-parser`) and ADR 0004 (`telemetry-and-paired-metrics`).

## Out of Scope

- Natural language AI model / LLM-based query parsing (deterministic token matching avoids latency, API costs, and network failure modes).
- Persistent search history stored in a remote user account database.
- Backend API write endpoints for submitting job postings.

## Further Notes

The intent parser is designed to run synchronously in < 2ms, enabling instant feedback in the search UI without throttling user input.
