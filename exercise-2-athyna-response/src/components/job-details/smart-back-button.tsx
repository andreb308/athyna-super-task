"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

export interface SmartBackButtonProps {
  fallbackHref?: string
  className?: string
}

export function SmartBackButton({
  fallbackHref = "/",
  className = "",
}: SmartBackButtonProps) {
  let router: ReturnType<typeof useRouter> | null = null
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    router = useRouter()
  } catch {
    // Graceful fallback in environments without Router context (e.g. tests)
  }
  const [hasInternalHistory, setHasInternalHistory] = React.useState(false)

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isInternalReferrer =
        document.referrer &&
        new URL(document.referrer, window.location.href).origin ===
          window.location.origin

      if (isInternalReferrer && window.history.length > 1) {
        setHasInternalHistory(true)
      }
    }
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    if (hasInternalHistory && router) {
      e.preventDefault()
      router.back()
    }
  }

  return (
    <Link
      href={fallbackHref}
      onClick={handleClick}
      className={`inline-flex items-center text-xs sm:text-sm font-medium text-text-muted hover:text-on-surface transition-colors gap-1.5 py-1 px-2 -ml-2 rounded-lg hover:bg-surface-container ${className}`}
    >
      <ChevronLeft className="size-4 shrink-0" />
      <span>Back to jobs</span>
    </Link>
  )
}
