import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Separator } from "../separator"

describe("Separator Primitive", () => {
  it("renders horizontal separator with proper role and orientation", () => {
    render(<Separator decorative={false} data-testid="sep-h" />)

    const sep = screen.getByRole("separator")
    expect(sep).toBeInTheDocument()
    expect(sep).toHaveAttribute("aria-orientation", "horizontal")
    expect(sep).toHaveClass("h-[1px]")
    expect(sep).toHaveClass("w-full")
  })

  it("renders vertical separator with proper role and orientation", () => {
    render(<Separator orientation="vertical" decorative={false} data-testid="sep-v" />)

    const sep = screen.getByRole("separator")
    expect(sep).toBeInTheDocument()
    expect(sep).toHaveAttribute("aria-orientation", "vertical")
    expect(sep).toHaveClass("w-[1px]")
    expect(sep).toHaveClass("h-full")
  })

  it("renders decorative separator without separator role", () => {
    render(<Separator decorative data-testid="sep-dec" />)

    expect(screen.queryByRole("separator")).not.toBeInTheDocument()
    expect(screen.getByTestId("sep-dec")).toHaveAttribute("role", "none")
  })
})
