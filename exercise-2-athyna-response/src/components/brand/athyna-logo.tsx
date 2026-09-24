import * as React from "react"
import { cn } from "@/lib/utils"

export type AthynaLogoProps = React.SVGProps<SVGSVGElement>

export function AthynaLogo({
  className,
  width = 140,
  height = 32,
  ...props
}: AthynaLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 140 32"
      fill="none"
      width={width}
      height={height}
      aria-label="Athyna Logo"
      role="img"
      className={cn("inline-block select-none", className)}
      {...props}
    >
      <text
        x="0"
        y="24"
        fontFamily="var(--font-sans), system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="26"
        letterSpacing="-0.5px"
        fill="currentColor"
      >
        athyna<tspan fill="#6246EA">.</tspan>
      </text>
    </svg>
  )
}
