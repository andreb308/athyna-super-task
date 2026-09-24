import * as React from "react"
import { Badge } from "@/components/ui/badge"
import type { AthynaJob } from "@/domain/jobs"

export interface JobDescriptionViewProps {
  job: AthynaJob
  className?: string
}

interface ParsedSection {
  title: string | null
  paragraphs: string[]
  listItems: string[]
}

function parseDescription(description: string): ParsedSection[] {
  if (!description) return []

  const lines = description.split("\n")
  const sections: ParsedSection[] = []
  let currentSection: ParsedSection = {
    title: null,
    paragraphs: [],
    listItems: [],
  }

  const pushCurrent = () => {
    if (
      currentSection.title ||
      currentSection.paragraphs.length > 0 ||
      currentSection.listItems.length > 0
    ) {
      sections.push({ ...currentSection })
      currentSection = {
        title: null,
        paragraphs: [],
        listItems: [],
      }
    }
  }

  let bufferParagraph = ""

  const flushBuffer = () => {
    if (bufferParagraph.trim()) {
      currentSection.paragraphs.push(bufferParagraph.trim())
      bufferParagraph = ""
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const line = rawLine.trim()

    if (!line) {
      flushBuffer()
      continue
    }

    const headingMatch = line.match(/^#{2,4}\s+(.+)$/)
    if (headingMatch) {
      flushBuffer()
      pushCurrent()
      currentSection.title = headingMatch[1].trim()
      continue
    }

    const bulletMatch = line.match(/^[-*•]\s+(.+)$/)
    if (bulletMatch) {
      flushBuffer()
      currentSection.listItems.push(bulletMatch[1].trim())
      continue
    }

    if (bufferParagraph) {
      bufferParagraph += " " + line
    } else {
      bufferParagraph = line
    }
  }

  flushBuffer()
  pushCurrent()

  return sections
}

export function JobDescriptionView({
  job,
  className = "",
}: JobDescriptionViewProps) {
  const sections = React.useMemo(
    () => parseDescription(job.description),
    [job.description]
  )

  return (
    <article
      className={`mt-10 text-sm sm:text-base text-on-surface leading-relaxed space-y-7 ${className}`}
      data-testid="job-description-view"
    >
      {/* Overview Lead Callout if present */}
      {job.overview && (
        <section className="bg-lavender-subtle/50 rounded-2xl p-5 border border-border-subtle/80">
          <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-primary mb-2">
            Overview
          </h2>
          <p className="text-on-surface text-base sm:text-lg font-medium leading-relaxed">
            {job.overview}
          </p>
        </section>
      )}

      {/* Skills Badges Cluster */}
      {job.skills && job.skills.length > 0 && (
        <section className="pt-1">
          <h2 className="text-base sm:text-lg font-bold text-on-surface mb-3">
            Key Skills & Technologies
          </h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Badge
                key={skill}
                variant="neutral"
                className="px-3 py-1 font-mono text-xs bg-surface-container hover:border-primary transition-colors cursor-default"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Render Parsed Description Sections */}
      {sections.length > 0 ? (
        sections.map((section, idx) => (
          <section key={idx} className="space-y-3">
            {section.title && (
              <h2 className="text-base sm:text-lg font-bold text-on-surface mt-6 mb-2.5">
                {section.title}
              </h2>
            )}

            {section.paragraphs.map((p, pIdx) => (
              <p
                key={pIdx}
                className="text-on-surface/90 text-sm sm:text-base leading-relaxed"
              >
                {p}
              </p>
            ))}

            {section.listItems.length > 0 && (
              <ul className="list-disc pl-5 space-y-1.5 text-on-surface/90 text-sm sm:text-base">
                {section.listItems.map((item, lIdx) => (
                  <li key={lIdx}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))
      ) : (
        <section>
          <h2 className="text-base sm:text-lg font-bold text-on-surface mb-2.5">
            About the Role
          </h2>
          <p className="text-on-surface/80 text-sm sm:text-base leading-relaxed">
            No detailed description available for this role.
          </p>
        </section>
      )}
    </article>
  )
}
