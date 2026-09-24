import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        neutral:
          "border-transparent bg-surface-container text-on-surface-variant font-mono text-[11px] font-medium tracking-wide",
        trending:
          "border-transparent bg-lavender-subtle text-primary font-mono text-[11px] font-bold shadow-xs",
        match:
          "border-transparent bg-mint-surface text-mint-text font-mono text-[11px] font-bold shadow-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
}

function Badge({ className, variant = "default", icon, children, ...props }: BadgeProps) {
  let defaultIcon: React.ReactNode = null
  if (variant === "trending") {
    defaultIcon = <Sparkles className="size-3 shrink-0" aria-hidden="true" />
  } else if (variant === "match") {
    defaultIcon = <Zap className="size-3 shrink-0 fill-current" aria-hidden="true" />
  }

  return (
    <div
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {icon ?? defaultIcon}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
