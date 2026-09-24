import { describe, it, expect } from "vitest"
import { parseSearchIntent } from "../intent-parser"

describe("Search Intent Parser", () => {
  it("parses single token 'remote' as isRemote filter without residual text", () => {
    const result = parseSearchIntent("remote")
    expect(result.isRemote).toBe(true)
    expect(result.q).toBe("")
    expect(result.chips).toHaveLength(1)
    expect(result.chips[0]).toEqual({
      id: "remote",
      type: "remote",
      value: "true",
      label: "Remote",
    })
  })

  it("parses 'wfh' and 'work from home' as remote", () => {
    const r1 = parseSearchIntent("wfh")
    expect(r1.isRemote).toBe(true)
    expect(r1.q).toBe("")

    const r2 = parseSearchIntent("work from home developer")
    expect(r2.isRemote).toBe(true)
    expect(r2.q).toBe("developer")
  })

  it("parses 'part time' and 'part-time' as employmentType filter", () => {
    const r1 = parseSearchIntent("part time")
    expect(r1.employmentType).toBe("Part-time")
    expect(r1.q).toBe("")
    expect(r1.chips).toContainEqual({
      id: "employmentType-part-time",
      type: "employmentType",
      value: "Part-time",
      label: "Part-time",
    })

    const r2 = parseSearchIntent("part-time designer")
    expect(r2.employmentType).toBe("Part-time")
    expect(r2.q).toBe("designer")
  })

  it("parses 'full time' and 'contract' employment types", () => {
    const r1 = parseSearchIntent("full time")
    expect(r1.employmentType).toBe("Full-time")

    const r2 = parseSearchIntent("contract python")
    expect(r2.employmentType).toBe("Contract")
    expect(r2.skills).toContain("Python")
    expect(r2.q).toBe("")
  })

  it("parses 'react' and 'React engineer' extracting skill and residual q", () => {
    const r1 = parseSearchIntent("react")
    expect(r1.skills).toContain("React")
    expect(r1.q).toBe("")
    expect(r1.chips).toContainEqual({
      id: "skill-react",
      type: "skill",
      value: "React",
      label: "Skill: React",
    })

    const r2 = parseSearchIntent("React engineer")
    expect(r2.skills).toContain("React")
    expect(r2.q).toBe("engineer")
  })

  it("parses compound query 'senior remote python'", () => {
    const result = parseSearchIntent("senior remote python")
    expect(result.seniority).toBe("Senior")
    expect(result.isRemote).toBe(true)
    expect(result.skills).toContain("Python")
    expect(result.q).toBe("")
    expect(result.chips).toHaveLength(3)
  })

  it("parses multiple skills and seniorities in compound query", () => {
    const result = parseSearchIntent("lead typescript node developer")
    expect(result.seniority).toBe("Lead")
    expect(result.skills).toContain("TypeScript")
    expect(result.skills).toContain("Node.js")
    expect(result.q).toBe("developer")
  })

  it("handles acronym skills like AI, ML, NLP, DevOps, QA", () => {
    const r1 = parseSearchIntent("ml engineer")
    expect(r1.skills).toContain("ML")
    expect(r1.q).toBe("engineer")

    const r2 = parseSearchIntent("prompt engineering qa")
    expect(r2.skills).toContain("Prompt Engineering")
    expect(r2.skills).toContain("QA")
    expect(r2.q).toBe("")
  })

  it("preserves purely free-text queries when no domain tokens match", () => {
    const result = parseSearchIntent("fintech payments architect")
    expect(result.isRemote).toBeUndefined()
    expect(result.employmentType).toBeUndefined()
    expect(result.seniority).toBeUndefined()
    expect(result.skills).toEqual([])
    expect(result.q).toBe("fintech payments architect")
    expect(result.chips).toEqual([])
  })

  it("handles empty or whitespace strings gracefully", () => {
    const result = parseSearchIntent("   ")
    expect(result.rawQuery).toBe("   ")
    expect(result.q).toBe("")
    expect(result.chips).toEqual([])
    expect(result.skills).toEqual([])
  })
})
