# PR Review: Job Detail Navigation (`BackButton` & `RolePage`)

**Target:** `src/app/role/[slug]/_components/back-button.tsx`  
**Recommendation:** 🔴 **Request Changes** (Product-Level Defect)

---

## 1. What Was Wrong

The component relies unconditionally on `router.back()` (`window.history.back()`):

```tsx
const handleBackClick = () => {
  router.back();
};
```

This breaks the two most common user arrival paths:
1. **Google Organic Traffic (43% of detail views):** Candidates arriving directly from Google who click *"Back to jobs"* are booted right back to the Google search results page.
2. **New Tabs / Fresh Sessions (`target="_blank"`, shared links):** `window.history.length === 1`, so clicking the button does nothing (dead click).

---

## 2. Why It's a Product-Level Miss

* **Leaking candidates back to competitors:** The copy promises **"Back to jobs"** (Athyna's listings catalog), but the code executes **browser history back**. Ejecting organic visitors back to Google SERP hands high-intent talent directly to rival boards (LinkedIn, Indeed, Otta), directly driving our **11-second bounce** and **1.2 views/session** plateau.
* **Why a naive `<Link href="/">` is also wrong:** Candidates who filtered before clicking a job convert at **3x the baseline rate**. A hard link to `/` wipes their active filters, pagination, and scroll state.
* **The product requirement is dual-mode:**
  * **Internal visitors:** Call `router.back()` to preserve their filtered search state.
  * **External arrivals / Fresh tabs:** Gracefully route to `/` (the jobs catalog).

---

## 3. The Solution

Use a simple check on click to distinguish internal navigation from external arrivals:

```tsx
"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@athynacom/athyna-ui/icons";

export function BackButton({ fallbackHref = "/" }: { fallbackHref?: string }) {
  const router = useRouter();

  const handleBackClick = () => {
    // If navigating internally, go back to preserve filters & scroll position
    if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
      router.back();
    } else {
      // Fallback for direct Google arrivals, external referrers, or new tabs
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBackClick}
      className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors w-fit"
    >
      <ChevronLeftIcon width={16} height={16} />
      Back to jobs
    </button>
  );
}
```

---

## 4. Validation & Metrics

* **Telemetry:** Log `back_button_clicked` with `{ destination: 'history_back' | 'catalog_fallback' }` to measure external traffic retention.
* **Success Target:** Increase organic direct-arrival session depth past the current **1.2 views/session** benchmark and reduce immediate Google bounce rates.
