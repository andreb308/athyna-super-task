# Super Task | Product Engineer

# **About the Task 🎯**

Welcome to your trial day as a Product Engineer at Athyna. You'll spend a day doing the kind of work that actually lands on this role: read a real problem in the data, decide what's worth building in response, build it against our real (development) API, and review a real piece of code from our history.

This isn't a coding quiz, and it isn't "build this exact spec." We want to see how you read a messy, real signal, what you choose to do about it, and how well you execute that choice.

### Guidelines

- **Total Time:** Approximately 8 hours (you may complete this over a couple of days).
- **Compensation:** You will receive USD $140 for completing this task.
- **Support:** If you have any questions, please reach out in the Slack channel.

### **Deliverables**

Submit a GitHub/GitLab repo containing:

1. Source code.
2. `SCOPING.md`  your written response to the brief (see Exercise 1). Written before you start building, not reverse-engineered after.
3. `README.md` with:
    - Setup instructions.
    - Brief explanation of your approach and trade-offs.
    - A recording of your feature working (unlisted YouTube link is fine).
    - (Optional) Notes on what you'd improve with more time.
4. `AI_USAGE.md`  see expectations below.
5. `PR_REVIEW.md`  see Exercise 3.

### Expectations

#### What we care about

We’re evaluating this like a real pull request, including the thinking behind it:

- **Product decisions:** Did you make the right calls for the feature?
- **Code quality:** Is this something we’d be comfortable merging?
- **Data:** Would we trust the numbers it produces in production?
- **Scope:** Did you focus on what matters?

Polish is great, but a small, well-reasoned, correctly scoped feature beats a flashy one that overlooks the fundamentals.

#### What we’re not testing

You **don’t** need to build:

- A production-grade backend
- A redesigned visual identity
- An exhaustive feature set
- Real infrastructure for every part of the feature

You can **mock, stub, or assume** any backend API you need. If you need persistence, an in-memory store or stubbed endpoint is fine.

We’re evaluating whether your engineering choices match the feature you scoped, not whether you built production infrastructure.

#### A note on AI usage

We expect you to use AI tools while building this, and we encourage it. The role involves using AI to move faster **without cutting corners**, so we’d rather see how you actually work.

In `AI_USAGE.md`, briefly explain:

- How you used AI to complete the task
- Where it helped
- Anything else about your AI workflow that you think is worth sharing

#### What you're working with

- **Live reference:** [jobs.athyna.com](http://jobs.athyna.com/)  look at it for inspiration, but you are building your own fresh client, not extending its code, and you do not need to match it pixel-for-pixel. We are not giving you access to its repository; you're starting from an empty project.
- **Real API, read access:**
    - GET jobs list: [https://develop.api.athyna.com/api/docs#/public-jobs/PublicJobsController_findPublicJobs](https://develop.api.athyna.com/api/docs#/public-jobs/PublicJobsController_findPublicJobs)
    - GET job by id: [https://develop.api.athyna.com/api/docs#/public-jobs/PublicJobsController_findPublicJobById](https://develop.api.athyna.com/api/docs#/public-jobs/PublicJobsController_findPublicJobById)
    - These are live endpoints on our development environment, prepared for this exercise. Read the docs carefully: they support more than the bare minimum.
    - There is no write endpoint. If your proposed feature needs to save or persist something please mock or stub that part. We are not evaluating backend architecture here.
- **An analytics snapshot** (below), which is your brief. We won't clarify requirements beyond what's there — deciding what it means is part of the exercise.

#### Real API endpoint documentation (toggle 👇🏻)

## Public Jobs API — reference

Everything you need to call the two endpoints for this exercise. This is a standalone snapshot, not a link to our interactive API docs, since that also documents unrelated internal endpoints we're not sharing for this exercise.

Base URL: `https://develop.api.athyna.com`

No authentication is required for either endpoint below.

### GET /api/public/jobs

Returns a list of jobs matching the given filters.

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `pageSize` | number | No | Default 20, max 50 |
| `pageNumber` | number | No | For pagination |
| `q` | string | No | Free-text search over the job title, category and skills |
| `city` | string | No | Location filter |
| `country` | string | No | Country filter |
| `remote` | boolean | No | Return only remote-friendly jobs |
| `seniority` | string | No | Experience level filter |
| `employmentType` | string | No | Employment type name, e.g. "Full-time" |
| `skills` | string[] | No | Repeatable or comma-separated skill names |
| `minSalary` | number | No | Minimum annual salary |
| `maxSalary` | number | No | Maximum annual salary |
| `publishedSince` | string | No | ISO-8601 date; only jobs published on or after it are returned |
| `sortBy` | string | No | `publishedAt` | `salary` | `title` (default `publishedAt`) |
| `sortOrder` | string | No | `asc` | `desc` (default `desc`) |

**Response:** an array of job objects. We're not pre-documenting the exact field shape here. Call the endpoint (e.g. `curl "https://develop.api.athyna.com/api/public/jobs?pageSize=1"`) and read a real sample response to see the fields available (title, location, employment type, seniority, skills, salary range, and publish date are all in there in some form).

### GET /api/public/jobs/{id}

Returns a single job by its id.

| Parameter | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | Yes (path) | Job identifier |

**Response:** a single job object (same shape as one item from the list above). Returns `404` with "Job not found or not publicly listed" if the id doesn't match a public job.


# The scenario 🧩

Here's what we currently know about [jobs.athyna.com](http://jobs.athyna.com/):

- Mobile is 61% of traffic, converts detail-to-apply at 8%; desktop converts at 24%.
- Median time on a job detail page before bouncing: 11 seconds.
- 43% of detail views arrive from Google organic straight to the detail page, never touching the list.
- Sessions average 1.2 job detail views. Almost nobody browses a second job.
- Users who apply a filter convert detail-to-apply at 3x the base rate, but only 24% of users touch a filter at all.
- Search is title-substring only. Three of the top five queries ("remote", "part time", "React") return zero results.
- Of the users who hit the sign-up wall, 74% never return.

Given this, propose, justify, and build a way forward. You don't have to address every point above. Pick what you think matters most and say why.

## Exercise 1 - Diagnose and propose

**Goal:** Turn a real, messy analytics snapshot into a defensible plan for one day of work.

Before writing any code, write `SCOPING.md` (cap yourself around 400–500 words. We're evaluating judgment, not prose) covering:

- Which finding(s) above you think matter most, and why.
- What you're proposing to build in response, specifically.
- What you're explicitly not doing, and why that's the right call given the time you have.
- How you'll know it worked — what you'd instrument, and what change in the data would tell you it helped.

## Exercise 2 - Build your response

**Goal:** Ship the thing you scoped in Exercise 1, against the real API.

- Initialize a React + TypeScript project (Vite or your preference).
- Build enough of a job board client, using the two endpoints above, to demonstrate your proposed change in context. You do **not** need full feature parity with [jobs.athyna.com](http://jobs.athyna.com/)
    - Build what your proposal actually needs, nothing more. If you're fixing search, you need a real search-and-results experience. If you're reworking the detail page for direct-arrival traffic, the list view can be minimal or stubbed; it's not what you're being judged on.
- Handle loading and error states for whatever you build.
- Instrument it with events that match the success metric from your `SCOPING.md` (PostHog, or a clearly-labeled mock of it if you don't want to wire up a real account, just note which in your README).
- Keep it clean, responsive, and modern.

<aside>
💡

If you finish early, the better use of remaining time is almost always tightening what you already built (more rigorous instrumentation, a sharper edge case, a clearer README), **not adding unrelated polish**. We're not scoring extra features.

</aside>

## Exercise 3 - Review a real PR

You'll be given two files from our real history, as they looked before a real bug was fixed (no repo access, no git history):

- `back-button.tsx` a small "Back to jobs" component.
- `page.tsx`the job detail page that uses it.

Something about how the back button behaves is wrong for a real, common way people actually arrive at this page. Find it, fix it in your own copy of the code, and write up in `PR_REVIEW.md`: what was wrong, why it's a product-level miss and not just a code bug, and how you'd fix it. We're less interested in a diff and more interested in your reasoning.

[src.zip](Super%20Task%20Product%20Engineer/src.zip)