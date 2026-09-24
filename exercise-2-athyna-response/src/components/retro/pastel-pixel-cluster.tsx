import * as React from "react"
import { cn } from "@/lib/utils"

export type PastelPixelClusterProps = React.SVGProps<SVGSVGElement>

export function PastelPixelCluster({
  className,
  width = 68,
  height = 68,
  ...props
}: PastelPixelClusterProps) {
  return (
    <svg
      fill="none"
      height={height}
      viewBox="0 0 68 68"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
      className={cn("drop-shadow-sm select-none pointer-events-none", className)}
      {...props}
    >
      <rect fill="#E8D5FF" height="10" width="10" x="24" y="0" />
      <rect fill="#C8BFFF" height="10" width="10" x="34" y="0" />
      <rect fill="#FEF08A" height="10" width="10" x="14" y="10" />
      <rect fill="#DDD6FE" height="10" width="10" x="24" y="10" />
      <rect fill="#A78BFA" height="10" width="10" x="34" y="10" />
      <rect fill="#FEF08A" height="10" width="10" x="44" y="10" />
      <rect fill="#FEF08A" height="10" width="10" x="4" y="20" />
      <rect fill="#DDD6FE" height="10" width="10" x="14" y="20" />
      <rect fill="#8B5CF6" height="10" width="10" x="24" y="20" />
      <rect fill="#C4B5FD" height="10" width="10" x="34" y="20" />
      <rect fill="#DDD6FE" height="10" width="10" x="44" y="20" />
      <rect fill="#FEF08A" height="10" width="10" x="14" y="30" />
      <rect fill="#DDD6FE" height="10" width="10" x="24" y="30" />
      <rect fill="#A78BFA" height="10" width="10" x="34" y="30" />
      <rect fill="#FEF08A" height="10" width="10" x="44" y="30" />
      <rect fill="#E8D5FF" height="10" width="10" x="24" y="40" />
      <rect fill="#C8BFFF" height="10" width="10" x="34" y="40" />
    </svg>
  )
}
