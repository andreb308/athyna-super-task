import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from '../badge'

describe('Badge Primitive (Component Rendering & Accessibility Seam)', () => {
  it('renders badge with accessible text', () => {
    render(<Badge>Full Time</Badge>)
    expect(screen.getByText('Full Time')).toBeInTheDocument()
  })

  it('renders trending badge with sparkle indicator', () => {
    render(<Badge variant="trending">Trending Role</Badge>)
    const badge = screen.getByText('Trending Role').closest('[data-slot="badge"]')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveAttribute('data-variant', 'trending')
    expect(badge?.querySelector('svg')).toBeInTheDocument()
  })

  it('renders match score badge with bolt indicator', () => {
    render(<Badge variant="match">95% Match</Badge>)
    const badge = screen.getByText('95% Match').closest('[data-slot="badge"]')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveAttribute('data-variant', 'match')
    expect(badge?.querySelector('svg')).toBeInTheDocument()
  })

  it('renders neutral metadata badge', () => {
    render(<Badge variant="neutral">Senior</Badge>)
    const badge = screen.getByText('Senior').closest('[data-slot="badge"]')
    expect(badge).toHaveAttribute('data-variant', 'neutral')
  })
})
