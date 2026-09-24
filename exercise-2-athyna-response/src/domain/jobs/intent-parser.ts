export interface FilterChip {
  id: string
  type: "remote" | "employmentType" | "seniority" | "skill" | "salary" | "location"
  value: string
  label: string
}

export interface SearchIntent {
  rawQuery: string
  q: string
  isRemote?: boolean
  employmentType?: string
  seniority?: string
  skills: string[]
  chips: FilterChip[]
}

const REMOTE_PATTERNS = [
  /\bwork\s+from\s+home\b/i,
  /\bwfh\b/i,
  /\bremote\b/i,
]

const EMPLOYMENT_TYPE_PATTERNS: Array<{ regex: RegExp; value: string; label: string }> = [
  { regex: /\bpart[- ]time\b/i, value: "Part-time", label: "Part-time" },
  { regex: /\bfull[- ]time\b/i, value: "Full-time", label: "Full-time" },
  { regex: /\bcontract(?:or)?\b/i, value: "Contract", label: "Contract" },
  { regex: /\binternship\b/i, value: "Internship", label: "Internship" },
]

const SENIORITY_PATTERNS: Array<{ regex: RegExp; value: string; label: string }> = [
  { regex: /\bprincipal\b/i, value: "Principal", label: "Principal" },
  { regex: /\bstaff\b/i, value: "Staff", label: "Staff" },
  { regex: /\blead\b/i, value: "Lead", label: "Lead" },
  { regex: /\bsenior\b/i, value: "Senior", label: "Senior" },
  { regex: /\bsr\.?\b/i, value: "Senior", label: "Senior" },
  { regex: /\bjunior\b/i, value: "Junior", label: "Junior" },
  { regex: /\bjr\.?\b/i, value: "Junior", label: "Junior" },
  { regex: /\bassociate\b/i, value: "Associate", label: "Associate" },
  { regex: /\bintern\b/i, value: "Intern", label: "Intern" },
  { regex: /\bmid[- ]level\b/i, value: "Mid", label: "Mid" },
]

const SKILL_PATTERNS: Array<{ regex: RegExp; value: string; label: string; slug: string }> = [
  { regex: /\bprompt\s+engineering\b/i, value: "Prompt Engineering", label: "Skill: Prompt Engineering", slug: "prompt-engineering" },
  { regex: /\bdeep\s+learning\b/i, value: "Deep Learning", label: "Skill: Deep Learning", slug: "deep-learning" },
  { regex: /\bgenerative\s+ai\b/i, value: "Generative AI", label: "Skill: Generative AI", slug: "gen-ai" },
  { regex: /\bgen\s+ai\b/i, value: "Gen AI", label: "Skill: Gen AI", slug: "gen-ai" },
  { regex: /\bdata\s+scientist\b/i, value: "Data Science", label: "Skill: Data Science", slug: "data-science" },
  { regex: /\bdata\s+science\b/i, value: "Data Science", label: "Skill: Data Science", slug: "data-science" },
  { regex: /\btypescript\b/i, value: "TypeScript", label: "Skill: TypeScript", slug: "typescript" },
  { regex: /\bjavascript\b/i, value: "JavaScript", label: "Skill: JavaScript", slug: "javascript" },
  { regex: /\bnode(?:\.js)?\b/i, value: "Node.js", label: "Skill: Node.js", slug: "node" },
  { regex: /\breact(?:\.js)?\b/i, value: "React", label: "Skill: React", slug: "react" },
  { regex: /\bpython\b/i, value: "Python", label: "Skill: Python", slug: "python" },
  { regex: /\bdevops\b/i, value: "DevOps", label: "Skill: DevOps", slug: "devops" },
  { regex: /\bnlp\b/i, value: "NLP", label: "Skill: NLP", slug: "nlp" },
  { regex: /\bml\b/i, value: "ML", label: "Skill: ML", slug: "ml" },
  { regex: /\bai\b/i, value: "AI", label: "Skill: AI", slug: "ai" },
  { regex: /\bqa\b/i, value: "QA", label: "Skill: QA", slug: "qa" },
  { regex: /\bgolang\b/i, value: "Go", label: "Skill: Go", slug: "go" },
  { regex: /\brust\b/i, value: "Rust", label: "Skill: Rust", slug: "rust" },
]

export function parseSearchIntent(query: string): SearchIntent {
  let residual = query
  let isRemote: boolean | undefined = undefined
  let employmentType: string | undefined = undefined
  let seniority: string | undefined = undefined
  const skills: string[] = []
  const chips: FilterChip[] = []

  // 1. Remote tokens
  for (const pattern of REMOTE_PATTERNS) {
    if (pattern.test(residual)) {
      isRemote = true
      residual = residual.replace(pattern, " ")
      chips.push({
        id: "remote",
        type: "remote",
        value: "true",
        label: "Remote",
      })
      break
    }
  }

  // 2. Employment type tokens
  for (const entry of EMPLOYMENT_TYPE_PATTERNS) {
    if (entry.regex.test(residual)) {
      employmentType = entry.value
      residual = residual.replace(entry.regex, " ")
      chips.push({
        id: `employmentType-${entry.value.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        type: "employmentType",
        value: entry.value,
        label: entry.label,
      })
      break
    }
  }

  // 3. Seniority tokens
  for (const entry of SENIORITY_PATTERNS) {
    if (entry.regex.test(residual)) {
      seniority = entry.value
      residual = residual.replace(entry.regex, " ")
      chips.push({
        id: `seniority-${entry.value.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        type: "seniority",
        value: entry.value,
        label: entry.label,
      })
      break
    }
  }

  // 4. Skill tokens
  for (const entry of SKILL_PATTERNS) {
    if (entry.regex.test(residual)) {
      if (!skills.includes(entry.value)) {
        skills.push(entry.value)
        chips.push({
          id: `skill-${entry.slug}`,
          type: "skill",
          value: entry.value,
          label: entry.label,
        })
      }
      residual = residual.replace(entry.regex, " ")
    }
  }

  const cleanResidual = residual.replace(/\s+/g, " ").trim()

  return {
    rawQuery: query,
    q: cleanResidual,
    isRemote,
    employmentType,
    seniority,
    skills,
    chips,
  }
}
