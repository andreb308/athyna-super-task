import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../button'

describe('Button Primitive (Component Rendering & Accessibility Seam)', () => {
  it('renders with role="button" and accessible text', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('handles click events when enabled', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Submit</Button>)
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders disabled state correctly without triggering click events', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled Action</Button>)
    
    const button = screen.getByRole('button', { name: /disabled action/i })
    expect(button).toBeDisabled()
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('supports mint variant for high-conversion actions', () => {
    render(<Button variant="mint">Unlock all jobs</Button>)
    const button = screen.getByRole('button', { name: /unlock all jobs/i })
    expect(button).toHaveAttribute('data-variant', 'mint')
  })

  it('supports pill shape', () => {
    render(<Button pill>Pill Button</Button>)
    const button = screen.getByRole('button', { name: /pill button/i })
    expect(button).toHaveAttribute('data-pill', 'true')
  })
})
