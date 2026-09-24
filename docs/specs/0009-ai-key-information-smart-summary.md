## Problem Statement

Mobile candidates spend a median of only 11 seconds on a job detail page before bouncing, and 61% of all traffic is mobile. Standard job postings contain thousands of words of dense legal boilerplate, company background, and unstructured prose. Within an 11-second window, candidates cannot locate vital decision criteria—such as must-have technical proficiencies, work arrangements, office requirements, and visa sponsorship—causing high-intent candidates to bounce prematurely.

## Solution

Implement an **AI Summary of Key Information ("Smart Summary") Card** prominently positioned above the fold on all role detail pages:
- Highlights the four most critical candidate qualification criteria in a structured bullet format.
- Styled in an ambient lavender gradient container with subtle borders, an AI Sparkles icon, and an official "Smart Summary" badge.
- Allows mobile and desktop visitors to evaluate role fit in under 3 seconds, directly combating the 11-second bounce.

## User Stories

1. As a mobile candidate landing directly from Google search, I want to see an AI Key Information card immediately below the role header, so that I can understand the position requirements without scrolling through long paragraphs.
2. As a developer evaluating tech requirements, I want the "Must-Have Skills" bullet to highlight primary tools and models (e.g. LLMs, Claude), so that I know if my experience matches.
3. As a remote or hybrid job seeker, I want the "Work Arrangement" bullet to specify office requirements (e.g., hybrid 3 days/week in SF or NY), so that I don't waste time on roles outside my geographical range.
4. As an international candidate, I want summarized details like "Compensation & Visa" whenever available, to state base salary ranges and visa sponsorship availability upfront, so that I know if the position can support my relocation needs.
5. As an assistive technology user, I want the summary wrapped in a semantic `<section aria-label="Key information">`, so that I can navigate directly to key criteria using screen reader landmarks.

## Implementation Decisions

- **Component Geometry**: Container styled with gradient `bg-gradient-to-br from-lavender-subtle/50 via-surface-container-lowest to-surface-container-lowest` and rounded-2xl border.
- **Standardized Bullet Structure**:
  - Core Role: synthesized 1-line statement of role purpose.
  - Must-Have Skills: explicit core tech stack competencies.
  - Work Arrangement: exact office days and location requirements.
  - Compensation & Visa: base salary bounds and sponsorship eligibility.
- **Fallback Content**: Provide structured fallback bullets derived from job overview and metadata when live AI extraction is unavailable.

## Testing Decisions

- **Testing Philosophy**: Verify that the summary renders with proper semantic landmarks, accessible bullets, and correct copy without crashing when job descriptions are sparse.
- **Seams Tested**:
  - Test that all four bullet labels ("Core Role", "Must-Have Skills", "Work Arrangement", "Compensation & Visa") are present.
  - Test that the section has accessible name "Key information".
- **Prior Art**: React Testing Library component tests.

## Out of Scope

- Interactive on-the-fly LLM streaming generation in the browser (uses pre-synthesized role metadata to guarantee sub-second First Contentful Paint).
