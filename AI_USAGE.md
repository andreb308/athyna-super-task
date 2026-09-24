# AI Usage & Agentic Workflow

> How a disciplined, skill-driven agentic framework was used to build, test, and ship the Athyna trial project fast without accumulating architectural debt or code rot.

---

## 1. Philosophy: Precision Amplification vs. "Vibe Coding"

Unconstrained AI code generation ("vibe coding") quickly turns codebases into a mess. When LLMs are prompted with loose, horizontal goals, they suffer from predictable failure modes:
- **Context Degradation:** Pushing beyond the ~120k token "Smart Zone" causes models to hallucinate missing helpers, forget constraints, and regress earlier code.
- **Over-Engineering:** Agents default to speculative abstractions and sprawling wrappers rather than clean vertical slices.
- **Untestable Spaghetti:** Without pre-agreed architectural seams, generated code lacks clear boundaries and resists automated testing.
- **Vocabulary Drift:** Concepts get named inconsistently across files, fracturing domain clarity.

To move fast **without cutting corners**, this project followed Matt Pocock's skill-based agentic workflow. Rather than treating AI as an autonomous author, AI was deployed through specialized, constraint-enforcing stages: **Questioning → Specifying → Slicing → Implementing (TDD) → Reviewing**.

---

## 2. The Core Flow: `/grill-me` → `/to-spec` → `/implement`

### 1. Socratic Grilling (`/grill-me` / `/grill-with-docs`)
Before authoring any code, the agent relentlessly interviews the engineer down the decision tree, resolving edge cases and trade-offs:
- **Ubiquitous Language:** Standardized domain terminology in [`CONTEXT.md`](file:///Users/andre/Repositories/athyna-super-task/CONTEXT.md) (e.g., *Direct Arrival*, *Search Intent Tokenization*, *Sticky Action Bar*).
- **Hardening Trade-offs:** Documented key decisions and non-goals in formal ADRs ([`docs/adr/`](file:///Users/andre/Repositories/athyna-super-task/docs/adr/)), ruling out backend rewrites and third-party auth before touching application code.

### 2. Settling Unknowns with Throwaway Spikes (`/prototype`)
When an interaction cannot be settled on paper, the workflow takes an intentional detour through a disposable prototype:
- **Strict Rules:** Single command to run, in-memory state, zero production polish.
- **Application:** Spiked the client-side intent tokenizer and filter chip promotion behavior. Once validated, the throwaway code was discarded; only the proven schema and reducer contracts were carried into the spec.

### 3. Formal Synthesis (`/to-spec`)
Synthesizes the grilled consensus into a formal technical spec ([`docs/specs/`](file:///Users/andre/Repositories/athyna-super-task/docs/specs/)):
- Defines problem and solution strictly from the candidate's perspective with numbered user stories.
- Establishes test seams at the highest viable boundary *before* writing implementation code.
- Avoids premature, drift-prone code snippets.

### 4. Vertical Tracer Bullets & Context Hygiene (`/to-tickets`)
Specs are broken into **vertical tracer bullets**—narrow paths cutting through types, domain logic, UI, and tests:
- **Context Hygiene:** Ideation and spec synthesis live in one context window. Once tickets are published, **context is compacted or cleared between tickets**. Starting each implementation ticket fresh keeps the model within its sharpest reasoning zone.

### 5. Seam-Driven Implementation (`/implement`)
Executes the work through disciplined test-driven development:
- **Internal TDD:** Drives `/tdd` at agreed seams, writing failing tests first against pure domain contracts ([`search-query-engine.ts`](file:///Users/andre/Repositories/athyna-super-task/exercise-2-athyna-response/src/lib/search-query-engine.ts) and [`athyna-api.ts`](file:///Users/andre/Repositories/athyna-super-task/exercise-2-athyna-response/src/lib/athyna-api.ts)).
- **Automated Validation:** Continuous typechecking and full Vitest suite runs (22 suites, 126 tests).
- **Two-Axis Review (`/code-review`):** Audits the diff against **Standards** (code quality and idioms) and **Spec** (did we build what was agreed without hallucinated scope?).

---

## 3. Targeted Diagnosis: `/diagnosing-bugs`

For Exercise 3 (the historical `BackButton` defect reviewed in [`PR_REVIEW.md`](file:///Users/andre/Repositories/athyna-super-task/PR_REVIEW.md)), we applied the structured discipline of `/diagnosing-bugs`:
1. **No Loop, No Theory:** Refuses to guess causes until a tight, deterministic repro exists.
2. **Isolating the Symptom:** 43% of detail traffic arrives directly from Google organic search or new tabs (`window.history.length === 1`). Calling `router.back()` ejects these candidates back to Google SERP or dead-clicks.
3. **Falsifiable Hypotheses:** Evaluated a static `<Link href="/">` (falsified: wipes active filters for internal navigators) versus dual-mode history/referrer detection.
4. **Regression-Tested Seam:** Fixed with a clean fallback branching on `document.referrer`, preserving search context for internal browsing while retaining direct organic arrivals.

---

## 4. Human Judgment vs. AI Leverage

- **Where AI Accelerated:** Rapid scaffolding, generating 126 Vitest unit and integration tests, creating type-safe Zod contracts, and drafting initial documentation templates.
- **Where Human Judgment Was Essential:** Analyzing raw analytics to identify the high-intent candidate loop, defining non-goals in [`SCOPING.md`](file:///Users/andre/Repositories/athyna-super-task/SCOPING.md), recognizing the commercial impact of organic candidate leakage, and setting architectural boundaries.

---

## 5. Key Takeaways

1. **Constraints beat prompt engineering:** A rigid spec, domain glossary, and pre-agreed seams keep agent code clean and maintainable.
2. **Context hygiene protects reasoning:** Clearing context between vertical tickets prevents hallucination and reasoning degradation.
3. **Prototypes answer questions, specs direct builds:** Throwaway spikes resolve ambiguity early; specs keep the final build focused.
4. **TDD is the ultimate sandbox:** Forcing agents to work test-first ensures high reliability without manual trial-and-error.
