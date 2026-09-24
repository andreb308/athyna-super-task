"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@athynacom/athyna-ui/icons";

export function BackButton({ fallbackHref = "/" }: { fallbackHref?: string }) {
  const router = useRouter();

  const handleBackClick = () => {
    // If arriving from within Athyna, go back to preserve search filters and scroll position
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

