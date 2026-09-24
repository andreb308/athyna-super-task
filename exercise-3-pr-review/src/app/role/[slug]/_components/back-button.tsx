"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@athynacom/athyna-ui/icons";

export function BackButton() {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
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
