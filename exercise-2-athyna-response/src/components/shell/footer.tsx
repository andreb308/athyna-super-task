"use client"

import * as React from "react"
import Link from "next/link"
import { AthynaLogo } from "@/components/brand/athyna-logo"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ShieldCheck } from "lucide-react"

export type FooterProps = React.HTMLAttributes<HTMLElement>

const SOCIAL_LINKS = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="size-3.5" aria-hidden="true">
        <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    name: "Glassdoor",
    href: "https://glassdoor.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
        <path d="M8 6h.01" />
        <path d="M16 6h.01" />
        <path d="M12 6h.01" />
        <path d="M12 10h.01" />
        <path d="M12 14h.01" />
        <path d="M16 10h.01" />
        <path d="M16 14h.01" />
        <path d="M8 10h.01" />
        <path d="M8 14h.01" />
      </svg>
    ),
  },
]

export function Footer({ className, ...props }: FooterProps) {
  return (
    <footer
      data-slot="footer"
      className={cn(
        "w-full bg-surface-container-low pt-16 pb-12 mt-16 border-t border-border-subtle",
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Pre-footer Callout Banner */}
        <div className="w-full rounded-2xl bg-deep-purple text-white p-8 lg:p-12 mb-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_12px_32px_rgba(75,30,155,0.18)]">
          <div className="max-w-xl z-10">
            <h3 className="font-headline-lg text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              Find your next opportunity, anywhere.
            </h3>
            <p className="font-body-md text-sm md:text-base text-lavender-subtle/80">
              Join verified talent, connect with leading startups, and fast-track your AI career today.
            </p>
          </div>
          <div className="z-10 flex flex-wrap gap-3">
            <Link
              href="/#browse-roles"
              className={cn(buttonVariants({ variant: "mint", size: "lg", pill: true }), "font-bold text-sm")}
            >
              Browse roles
            </Link>
          </div>
          <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-violet-accent/20 blur-3xl pointer-events-none" />
        </div>

        {/* Multi-column Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <Link
              href="/"
              aria-label="Athyna Home"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
            >
              <AthynaLogo className="h-7 w-auto text-on-surface" />
            </Link>
            <p className="font-body-sm text-xs sm:text-sm text-text-muted leading-relaxed max-w-sm">
              A frontier talent ecosystem matching world-class technical minds with visionary companies building the AI-first future.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2 mt-1">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            <h4 className="font-mono text-xs text-on-surface uppercase tracking-wider font-bold mb-2">
              Company
            </h4>
            <Link
              href="#"
              className="text-sm text-text-muted hover:text-on-surface transition-colors"
            >
              About Athyna
            </Link>
            <Link
              href="#"
              className="text-sm text-text-muted hover:text-on-surface transition-colors"
            >
              Life at Athyna
            </Link>
            <Link
              href="#"
              className="text-sm text-text-muted hover:text-on-surface transition-colors"
            >
              Hire talent
            </Link>
          </div>

          {/* Newsletter Signup */}
          <div className="lg:col-span-5 flex flex-col gap-2">
            <h4 className="font-mono text-xs text-on-surface uppercase tracking-wider font-bold mb-2">
              Get the latest
            </h4>
            <p className="text-xs sm:text-sm text-text-muted mb-2">
              Sign up to receive benefits, news and insights in your inbox once a month.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-2"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                pill
                aria-label="Email address"
                className="text-sm"
              />
              <Button
                variant="mint"
                pill
                type="submit"
                className="font-bold whitespace-nowrap text-sm px-6"
              >
                Subscribe
              </Button>
            </form>
            <div className="flex items-center gap-1.5 mt-2 text-text-muted text-[11px]">
              <ShieldCheck className="size-3.5 text-mint-emerald" />
              <span>Protected by reCAPTCHA and Subject to Google Privacy Policy.</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© 2024 Athyna. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-on-surface transition-colors">
              Terms and Conditions
            </Link>
            <Link href="#" className="hover:text-on-surface transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
