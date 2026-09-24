"use client"

import * as React from "react"
import { X, Sparkles } from "lucide-react"
import type { FilterChip } from "@/domain/jobs"

interface PromotedFilterChipsProps {
  chips: FilterChip[]
  onRemoveChip: (chip: FilterChip) => void
  onClearAll: () => void
  className?: string
}

export function PromotedFilterChips({
  chips,
  onRemoveChip,
  onClearAll,
  className = "",
}: PromotedFilterChipsProps) {
  if (!chips || chips.length === 0) {
    return null
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-2 py-2 px-1 ${className}`}
      role="region"
      aria-label="Active search filters"
    >
      <div className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-primary uppercase tracking-wider mr-1">
        <Sparkles className="size-3.5 text-primary animate-pulse" />
        <span>Extracted filters:</span>
      </div>

      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender-subtle text-primary border border-primary/20 text-xs font-medium shadow-2xs transition-all hover:bg-lavender-subtle/80"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={() => onRemoveChip(chip)}
            className="p-0.5 rounded-full hover:bg-primary/10 text-primary transition-colors cursor-pointer"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}

      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-mono font-medium text-text-muted hover:text-primary underline ml-1 cursor-pointer transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
