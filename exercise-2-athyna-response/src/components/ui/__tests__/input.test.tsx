import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Search } from 'lucide-react'
import { Input } from '../input'

describe('Input Primitive (Component Rendering & Accessibility Seam)', () => {
  it('renders input with accessible role and placeholder', () => {
    render(<Input placeholder="Search for jobs" aria-label="Search jobs" />)
    const input = screen.getByRole('textbox', { name: /search jobs/i })
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('placeholder', 'Search for jobs')
  })

  it('updates value on change', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} aria-label="Query" />)
    const input = screen.getByRole('textbox', { name: /query/i })
    
    fireEvent.change(input, { target: { value: 'Frontend Engineer' } })
    expect(handleChange).toHaveBeenCalled()
    expect((input as HTMLInputElement).value).toBe('Frontend Engineer')
  })

  it('renders with leading icon adornment', () => {
    render(
      <Input
        aria-label="Search"
        icon={<Search data-testid="search-icon" className="size-4" />}
      />
    )
    expect(screen.getByTestId('search-icon')).toBeInTheDocument()
  })

  it('supports pill curvature for search bar inputs', () => {
    render(<Input aria-label="Pill Search" pill />)
    const input = screen.getByRole('textbox', { name: /pill search/i })
    const container = input.closest('[data-slot="input-container"]') || input
    expect(container.className).toContain('rounded-full')
  })
})
