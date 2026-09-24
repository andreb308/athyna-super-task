"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"

export interface AiSummaryCardProps {
  className?: string
}

export const DEFAULT_AI_SUMMARY_BULLETS = [
  {
    label: "Core Role",
    content:
      "Implement Claude-driven AI solutions and integrations to automate and scale Anthropic's legal workflows.",
  },
  {
    label: "Must-Have Skills",
    content:
      "Proven experience deploying legal technology platforms and hands-on proficiency with LLMs (especially Claude).",
  },
  {
    label: "Work Arrangement",
    content:
      "Hybrid schedule requiring at least three days per week in either the San Francisco or New York office.",
  },
  {
    label: "Compensation & Visa",
    content:
      "Annual base salary of $170,000–$220,000 USD, with potential visa sponsorship provided.",
  },
]

export function AiSummaryCard({ className = "" }: AiSummaryCardProps) {
  return (
    <section
      aria-label="AI Summary of key information"
      className={`border border-primary/20 bg-gradient-to-br from-lavender-subtle/50 via-surface-container-lowest to-surface-container-lowest rounded-2xl p-4 sm:p-6 shadow-xs hover:border-primary/40 transition-all ${className}`}
      data-testid="ai-summary-card"
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-subtle/60">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="size-3.5 fill-primary/20 text-primary" />
          </div>
          <h2 className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-primary">
            AI Summary of Key Information
          </h2>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-primary bg-lavender-subtle px-2.5 py-0.5 rounded-full border border-primary/20">
          Smart Summary
        </span>
      </div>

      <ul className="space-y-3">
        {DEFAULT_AI_SUMMARY_BULLETS.map((item) => (
          <li
            key={item.label}
            className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface leading-relaxed"
          >
            <span
              className="text-primary font-bold shrink-0 select-none text-sm leading-none mt-0.5"
              aria-hidden="true"
            >
              ⚬
            </span>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-on-surface">{item.label}:</span>{" "}
              <span className="text-on-surface/90">{item.content}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
