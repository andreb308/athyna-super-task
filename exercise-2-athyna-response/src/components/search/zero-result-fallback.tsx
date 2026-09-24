"use client"

import * as React from "react"
import { SearchX, RotateCcw, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { RelaxationSuggestion } from "@/domain/jobs"
import { cn } from "@/lib/utils"

interface ZeroResultFallbackProps {
  query?: string
  suggestions: RelaxationSuggestion[]
  onSelectSuggestion: (suggestion: RelaxationSuggestion) => void
  onResetAll: () => void
  className?: string
}

export function ZeroResultFallback({
  query,
  suggestions,
  onSelectSuggestion,
  onResetAll,
  className,
}: ZeroResultFallbackProps) {
  return (
    <div
      className={cn(
        "w-full py-12 px-6 flex flex-col items-center justify-center text-center bg-surface-container-lowest rounded-2xl border border-border-subtle shadow-xs",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="size-14 rounded-2xl bg-lavender-subtle text-primary flex items-center justify-center mb-4 shadow-xs">
        <SearchX className="size-7" />
      </div>

      <h3 className="text-xl font-bold text-on-surface tracking-tight mb-2">
        No matching roles found
      </h3>

      <p className="text-sm text-on-surface-variant max-w-md mb-6 leading-relaxed">
        {query ? (
          <>
            We couldn&apos;t find roles matching <span className="font-semibold text-on-surface">&quot;{query}&quot;</span> with your current filters.
          </>
        ) : (
          "We couldn't find roles matching your current filter criteria."
        )}
      </p>

      {suggestions.length > 0 && (
        <div className="w-full max-w-lg mb-6 text-left">
          <div className="font-mono text-xs font-bold text-text-muted uppercase tracking-wider mb-2.5 text-center sm:text-left">
            Try relaxing a criteria to see results:
          </div>
          <div className="flex flex-col gap-2">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSuggestion(suggestion)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-container hover:bg-lavender-subtle text-on-surface hover:text-primary border border-border-subtle transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <ArrowRight className="size-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">{suggestion.label}</span>
                </div>
                {suggestion.potentialCount > 0 && (
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-mint-emerald/15 text-mint-emerald shrink-0">
                    +{suggestion.potentialCount} roles
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          pill
          size="sm"
          onClick={onResetAll}
          className="gap-2 text-xs font-mono font-semibold"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset all filters</span>
        </Button>
      </div>
    </div>
  )
}
