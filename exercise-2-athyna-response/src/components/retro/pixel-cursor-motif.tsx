import * as React from "react"
import { cn } from "@/lib/utils"

export type PixelCursorMotifProps = React.SVGProps<SVGSVGElement>

export function PixelCursorMotif({
  className,
  width = 60,
  height = 74,
  ...props
}: PixelCursorMotifProps) {
  return (
    <svg
      fill="none"
      height={height}
      viewBox="0 0 60 74"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
      className={cn("drop-shadow-md select-none pointer-events-none", className)}
      {...props}
    >
      <path
        d="M0 0H8V8H16V16H24V24H32V32H40V40H48V48H32V56H24V64H16V72H8V48H0V0Z"
        fill="#FDE047"
        opacity="0.6"
      />
      <path
        d="M6 6H14V14H22V22H30V30H38V38H46V46H30V54H22V62H14V70H6V46H6V6Z"
        fill="#FFFFFF"
      />
      <path
        d="M8 8H12V14H20V22H28V30H36V38H42V42H28V52H20V60H12V66H8V8Z"
        fill="#6246EA"
      />
      <rect fill="#A7F3D0" height="8" width="8" x="44" y="44" />
      <rect fill="#DDD6FE" height="8" width="8" x="52" y="52" />
    </svg>
  )
}
