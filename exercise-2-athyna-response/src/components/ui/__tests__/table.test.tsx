import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "../table"

describe("Table Primitive", () => {
  it("renders semantic table structure with headers, rows, cells and caption", () => {
    render(
      <Table>
        <TableCaption>AI Jobs Directory</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Role</TableHead>
            <TableHead>Company</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Machine Learning Engineer</TableCell>
            <TableCell>Athyna</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>1 role listed</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )

    expect(screen.getByRole("table")).toBeInTheDocument()
    expect(screen.getByText("AI Jobs Directory")).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Role" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "Company" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "Machine Learning Engineer" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "Athyna" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "1 role listed" })).toBeInTheDocument()
  })
})
