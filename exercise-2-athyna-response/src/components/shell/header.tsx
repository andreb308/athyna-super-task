"use client"

import * as React from "react"
import Link from "next/link"
import { AthynaLogo } from "@/components/brand/athyna-logo"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type HeaderProps = React.HTMLAttributes<HTMLElement>

export function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      data-slot="header"
      className={cn(
        "sticky top-0 w-full z-50 bg-surface/90 backdrop-blur-[16px] border-b border-border-subtle/60 shadow-[0_1px_8px_rgba(0,0,0,0.04)]",
        className
      )}
      {...props}
    >
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand & Hiring Pulse Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            aria-label="Athyna Logo"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
          >
            <AthynaLogo className="h-7 w-auto text-on-surface" />
          </Link>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender-subtle text-primary font-mono text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-mint-emerald animate-pulse" />
            We&apos;re hiring!
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-6"
        >
          <Link
            href="/#browse-roles"
            className="transition-colors bg-lavender-subtle text-primary font-bold rounded-full px-4 py-2 text-sm"
          >
            Explore Jobs
          </Link>
          <Link
            href="#"
            className="text-on-surface-variant hover:text-on-surface text-sm transition-colors"
          >
            For Talent
          </Link>
          <Link
            href="#"
            className="text-on-surface-variant hover:text-on-surface text-sm transition-colors"
          >
            For Employers
          </Link>
        </nav>

        {/* Auth / Action CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="#"
            className="px-4 py-2 rounded-full text-on-surface hover:bg-lavender-subtle hover:text-primary text-sm font-semibold transition-colors"
          >
            Log in
          </Link>
          <Link
            href="#"
            className={cn(buttonVariants({ variant: "default", size: "sm", pill: true }), "font-semibold text-xs px-4")}
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  )
}
