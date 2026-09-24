import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs'

describe('Tabs Primitive (Component Rendering & Accessibility Seam)', () => {
  it('renders tablist and tabs with semantic ARIA attributes', () => {
    render(
      <Tabs defaultValue="hot">
        <TabsList aria-label="Job categories">
          <TabsTrigger value="hot">Hot Jobs</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>
        <TabsContent value="hot">Hot Jobs Content</TabsContent>
        <TabsContent value="recommended">Recommended Content</TabsContent>
      </Tabs>
    )

    const tablist = screen.getByRole('tablist', { name: /job categories/i })
    expect(tablist).toBeInTheDocument()

    const hotTab = screen.getByRole('tab', { name: /hot jobs/i })
    const recTab = screen.getByRole('tab', { name: /recommended/i })

    expect(hotTab).toHaveAttribute('aria-selected', 'true')
    expect(recTab).toHaveAttribute('aria-selected', 'false')

    expect(screen.getByText('Hot Jobs Content')).toBeInTheDocument()
    expect(screen.queryByText('Recommended Content')).not.toBeInTheDocument()
  })

  it('switches tabs and active aria-selected state on click', () => {
    const handleValueChange = vi.fn()
    render(
      <Tabs defaultValue="hot" onValueChange={handleValueChange}>
        <TabsList>
          <TabsTrigger value="hot">Hot Jobs</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>
        <TabsContent value="hot">Hot Jobs Content</TabsContent>
        <TabsContent value="recommended">Recommended Content</TabsContent>
      </Tabs>
    )

    const recTab = screen.getByRole('tab', { name: /recommended/i })
    fireEvent.click(recTab)

    expect(handleValueChange).toHaveBeenCalledWith('recommended')
    expect(recTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: /hot jobs/i })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Recommended Content')).toBeInTheDocument()
    expect(screen.queryByText('Hot Jobs Content')).not.toBeInTheDocument()
  })
})
