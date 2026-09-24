import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  endIcon?: React.ReactNode
  pill?: boolean
  containerClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      icon,
      endIcon,
      pill = false,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const hasAdornments = Boolean(icon || endIcon || pill)

    if (hasAdornments) {
      return (
        <div
          data-slot="input-container"
          className={cn(
            "flex items-center gap-2 border border-border-subtle bg-surface-container-lowest transition-colors",
            pill ? "rounded-full px-4 py-2" : "rounded-md px-3 py-2",
            "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
            containerClassName
          )}
        >
          {icon && (
            <span className="text-text-muted shrink-0 pointer-events-none flex items-center justify-center">
              {icon}
            </span>
          )}
          <input
            type={type}
            ref={ref}
            data-slot="input"
            className={cn(
              "w-full bg-transparent text-sm text-on-surface placeholder:text-text-muted outline-none disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            {...props}
          />
          {endIcon && (
            <span className="text-text-muted shrink-0 flex items-center justify-center">
              {endIcon}
            </span>
          )}
        </div>
      )
    }

    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        className={cn(
          "flex h-9 w-full rounded-md border border-border-subtle bg-surface-container-lowest px-3 py-1 text-sm text-on-surface shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
