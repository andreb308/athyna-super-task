# Athyna Super Task — Product Engineer

> **High-Intent Candidate Loop**: Bridging structured search discovery with mobile direct-arrival retention against Athyna's public jobs API.

---

## 📹 Feature Walkthrough Recording

> [!IMPORTANT]
> **Watch the Feature Demo Video:**
> 🔗 **[Unlisted YouTube Video Link](https://youtu.be/dmiahU6un9Y)**

### Demonstrated User Flows in the Recording:
| Flow | Feature Highlighted | Data Problem Addressed |
| :--- | :--- | :--- |
| **1. Intent-Driven Search** | Typing queries like `"remote react"` parses tokens into active filter chips (`[Remote ✕]`, `[Skill: React ✕]`) mapped directly to API query parameters | 3 of top 5 queries previously returned 0 results |
| **2. Zero-Result Recovery** | Actionable fallback with 1-click filter relaxation suggestions when no exact match exists | Eliminates dead-end bounce states |
| **3. Mobile Direct Arrival** | Above-the-fold scannable summary ("At a Glance" & AI Key Information) and persistent sticky Apply action bar | 11-second median bounce & 8% mobile conversion rate |
| **4. Post-Apply Retention** | Non-blocking external apply opening in new tab + immediate "Similar Roles" recommendation shelf | 1.2 views/session limit and 74% sign-up wall abandonment |
| **5. Observability** | Console/event bus structured telemetry emitting paired funnel events | Validates conversion and discovery targets |

---

## 📂 Deliverables & Repository Map

| Deliverable | File / Directory | Description |
| :--- | :--- | :--- |
| **Exercise 1: Diagnosis & Proposal** | [`SCOPING.md`](./SCOPING.md) | 500-word written response analyzing the analytics snapshot, defining scope, non-goals, and paired metrics |
| **Exercise 2: Web Application** | [`exercise-2-athyna-response/`](./exercise-2-athyna-response/) | Next.js 15 (Turbopack, React 19, TypeScript, Tailwind CSS) job board client with zero-config live API integration |
| **Exercise 3: PR Review** | [`PR_REVIEW.md`](./PR_REVIEW.md) *(or [`exercise-3-pr-review/`](./exercise-3-pr-review/))* | Diagnosis and product-level reasoning for the direct-arrival "Back to jobs" history bug |
| **AI Tooling Transparency** | [`AI_USAGE.md`](./AI_USAGE.md) | Transparent accounting of AI tools used, workflows, and productivity gains |
| **Architectural Decision Records** | [`docs/adr/`](./docs/adr/) | 11 ADRs (0001–0011) detailing high-intent scope, search intent parser, mobile retention, telemetry, Next.js framework, toolbar filters, smart back navigation, and guest persistence |
| **Technical Specifications** | [`docs/specs/`](./docs/specs/) | 10 Technical Specifications (0001–0010) covering UI foundations, search engine, listings, retention, toolbar filters, smart back navigation, guest saves, and AI summary |

---

## 🚀 Setup & Running Instructions

The application is built with **Next.js 15 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**. It integrates out of the box with Athyna's live development API (`https://develop.api.athyna.com`) with zero environment configuration required.

### Prerequisites
- **Node.js**: `v18.18.0` or higher (`v20.x` or `v22.x` recommended)
- **Package Manager**: `npm` (or `pnpm` / `yarn`)

### 1. Install Dependencies
```bash
cd exercise-2-athyna-response
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
- **Search & Listings**: [http://localhost:3000](http://localhost:3000)
- **Role Detail (Example)**: [http://localhost:3000/role/ath-legal](http://localhost:3000/role/ath-legal) (or browse any live job card)

### 3. Run the Test Suite
The codebase features comprehensive unit and integration coverage across domain schemas, the query engine, API client, telemetry seam, and UI components:
```bash
npm test
```
*(Runs 22 test suites and 126 tests via Vitest).*

### 4. Production Build
```bash
npm run build
npm run start
```

---

## 💡 Approach and Trade-offs

### 1. The Core Problems Diagnosed
From the analytics snapshot, we identified two severe leaks at opposing ends of the funnel:
- **Search Dead-Ends (Top-of-Funnel):** 3 of the top 5 search queries (`"remote"`, `"part time"`, `"React"`) returned zero results due to naive substring matching. Although filters convert at 3x baseline, only 24% of candidates ever opened manual filter menus.
- **Mobile & Direct-Arrival Bounce (Mid-Funnel):** 43% of detail traffic arrives directly from Google organic search, and 61% is mobile. Yet mobile converted at only 8% (vs. 24% desktop) with an 11-second median bounce and an average of 1.2 views per session.

### 2. What We Built: "The High-Intent Loop"
Rather than treating search and detail pages in isolation, we built an integrated loop that captures high-intent candidates regardless of where they land:
- **Client-Side Search Intent Tokenizer:** Parses free-text queries for known attributes (e.g. `"remote react"`) and automatically promotes recognized tokens into active, removable filter chips (`remote=true`, `skills=React`, `q=...`). Includes actionable zero-result fallbacks with one-click relaxation.
- **Mobile-Optimized Detail Experience:**
  - **Above-the-Fold Scannable Summary:** "At a Glance" badges and an AI Key Information card allowing candidates to assess fit in under 5 seconds.
  - **Sticky Action Bar:** Persistent viewport dock keeping the Apply CTA and compensation visible across all scroll depths.
  - **Frictionless Post-Apply Retention Shelf:** Apply clicks immediately open the external role in a new tab without blocking modals, while the originating tab reveals a "Similar Roles You Qualify For" shelf to lift session depth.
- **Telemetry Seam (ADR 0004):** Structured event tracking (`search_query_submitted`, `filter_chip_toggled`, `job_detail_viewed`, `apply_cta_clicked`, `similar_job_clicked`) with device and arrival attribution (`direct_google` vs `search_list`).

### 3. Deliberate Trade-offs & Scope Exclusions
With an ~8-hour budget and a read-only API, maintaining strict scope discipline was critical:

| Discarded Opportunity | Rationale for Exclusion |
| :--- | :--- |
| **Logged-In Dashboard Redesign** | **74% of users abandon at the sign-up wall.** Optimizing post-login UI when top-of-funnel leaks so heavily misallocates effort. |
| **LinkedIn OAuth / Auto-Fill** | Profile API access takes weeks for enterprise approval, scraping violates ToS, and the API has no write endpoints. Guest external apply provides immediate conversion. |
| **Backend Search Engine Rewrite** | Replacing backend infrastructure with vector search was out of scope for a client evaluation. Client-side query tokenization unlocks the API's existing rich query parameters with zero backend latency. |
| **Heavy Multi-Filter Drawers** | Only 24% of users open manual dropdowns. Auto-promoting search tokens directly into chips delivers the 3x filter conversion lift without modal friction. |

---

## 🔮 Notes on What We'd Improve with More Time

If given an additional cycle, here are the four highest-leverage improvements to pursue:

1. **Production Telemetry Pipeline (PostHog Cloud):**
   - Connect the existing telemetry abstraction (`src/lib/telemetry.ts`) directly to PostHog Cloud or Segment.
   - Build automated funnel retention dashboards segmenting mobile vs. desktop conversion rates and direct-arrival retention.

2. **Backend Search & Typo-Tolerant Indexing:**
   - Migrate token extraction to the backend search service with fuzzy matching (Levenshtein distance) and synonym expansion (e.g., `"FE"` → `"Frontend"`, `"Node"` → `"Node.js"`).
   - Leverage vector embeddings for hybrid keyword + semantic search.

3. **Guest Saved Jobs & Frictionless Bookmarking:**
   - Implement client-side `localStorage` bookmarking for guest candidates so they can save roles without hitting the 74% drop-off sign-up wall.
   - Introduce an optional lightweight 1-click email magic-link alert service to re-engage candidates.

4. **Automated Cross-Device E2E Testing:**
   - Introduce a Playwright test suite validating mobile viewports (iPhone, Android) to automatically assert that the sticky action bar and post-apply modal maintain correct touch targets and z-indexes across viewports.
