import type { AthynaJob } from "@/domain/jobs"

export function formatSalary(salary: AthynaJob["salary"]): string {
  if (!salary || (!salary.min && !salary.max)) return "Competitive"
  const currencySymbol =
    salary.currency === "EUR" ? "€" : salary.currency === "GBP" ? "£" : "$"
  const period =
    salary.period === "hour" ? "/hr" : salary.period === "month" ? "/mo" : "/yr"

  const fmt = (n: number) => {
    if (n >= 1000) return `${currencySymbol}${Math.round(n / 1000)}k`
    return `${currencySymbol}${n}`
  }

  if (salary.min && salary.max && salary.min !== salary.max) {
    return `${fmt(salary.min)}-${fmt(salary.max)}`
  }
  const amount = salary.min || salary.max
  return amount ? `${fmt(amount)}${period}` : "Competitive"
}

export function formatLocation(loc: AthynaJob["location"]): string {
  if (!loc) return "Location not specified"
  const parts = [loc.city, loc.country].filter(Boolean)
  if (loc.isRemote) {
    return parts.length > 0 ? `${parts.join(", ")} (Remote)` : "Remote"
  }
  return parts.length > 0 ? parts.join(", ") : "Location not specified"
}

export function formatPublishedDate(dateString: string): string {
  try {
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return "Recently published"
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(d)
  } catch {
    return "Recently published"
  }
}
