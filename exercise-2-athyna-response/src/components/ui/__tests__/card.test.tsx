import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../card"

describe("Card Primitive", () => {
  it("renders card with header, title, description, content and footer slots", () => {
    render(
      <Card data-testid="card-root">
        <CardHeader>
          <CardTitle>AI Engineer</CardTitle>
          <CardDescription>Anthropic • San Francisco</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Key responsibilities</p>
        </CardContent>
        <CardFooter>
          <span>Published today</span>
        </CardFooter>
      </Card>
    )

    expect(screen.getByTestId("card-root")).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 3, name: "AI Engineer" })).toBeInTheDocument()
    expect(screen.getByText("Anthropic • San Francisco")).toBeInTheDocument()
    expect(screen.getByText("Key responsibilities")).toBeInTheDocument()
    expect(screen.getByText("Published today")).toBeInTheDocument()
  })

  it("applies hoverable styles when hoverable prop is set", () => {
    render(
      <Card hoverable data-testid="card-hover">
        <CardContent>Content</CardContent>
      </Card>
    )

    expect(screen.getByTestId("card-hover")).toHaveClass("hover:shadow-md")
  })
})
