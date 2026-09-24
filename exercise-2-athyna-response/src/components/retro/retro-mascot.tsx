import * as React from "react"
import { cn } from "@/lib/utils"

export interface RetroMascotProps extends React.SVGProps<SVGSVGElement> {
  eyeColor?: string
}

export function RetroMascot({
  className,
  width = 170,
  height = 120,
  eyeColor = "#1D1635",
  ...props
}: RetroMascotProps) {
  return (
    <svg
      fill="none"
      height={height}
      viewBox="0 0 170 120"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
      className={cn("select-none pointer-events-none", className)}
      {...props}
    >
      <rect fill="currentColor" height="10" width="10" x="30" y="0" />
      <rect fill="currentColor" height="10" width="10" x="130" y="0" />
      <rect fill="currentColor" height="10" width="10" x="40" y="10" />
      <rect fill="currentColor" height="10" width="10" x="120" y="10" />
      <rect fill="currentColor" height="10" width="110" x="30" y="20" />
      <rect fill="currentColor" height="10" width="30" x="20" y="30" />
      <rect fill="currentColor" height="10" width="50" x="60" y="30" />
      <rect fill="currentColor" height="10" width="30" x="120" y="30" />
      <rect fill="currentColor" height="20" width="150" x="10" y="40" />
      <rect fill={eyeColor} height="20" width="20" x="40" y="40" />
      <rect fill={eyeColor} height="20" width="20" x="110" y="40" />
      <rect fill="currentColor" height="10" width="130" x="20" y="60" />
      <rect fill="currentColor" height="20" width="10" x="20" y="70" />
      <rect fill="currentColor" height="20" width="10" x="140" y="70" />
      <rect fill="currentColor" height="10" width="20" x="40" y="70" />
      <rect fill="currentColor" height="10" width="20" x="110" y="70" />
      <rect fill="currentColor" height="10" width="20" x="50" y="90" />
      <rect fill="currentColor" height="10" width="20" x="100" y="90" />
    </svg>
  )
}
