import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Header } from '../header'
import { Footer } from '../footer'

describe('Application Shell (Layout & Shell Seam)', () => {
  describe('Header Component', () => {
    it('renders Athyna logo and "We\'re hiring!" live badge', () => {
      render(<Header />)
      expect(screen.getByRole('link', { name: /athyna logo/i })).toBeInTheDocument()
      expect(screen.getByText(/we're hiring!/i)).toBeInTheDocument()
    })

    it('renders main navigation links', () => {
      render(<Header />)
      expect(screen.getByRole('link', { name: /explore jobs/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /for talent/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /for employers/i })).toBeInTheDocument()
    })

    it('renders login and signup callouts', () => {
      render(<Header />)
      expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument()
    })
  })

  describe('Footer Component', () => {
    it('renders company links and mission statement', () => {
      render(<Footer />)
      expect(screen.getByRole('link', { name: /about athyna/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /life at athyna/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /hire talent/i })).toBeInTheDocument()
      expect(screen.getByText(/frontier talent ecosystem/i)).toBeInTheDocument()
    })

    it('renders newsletter subscription form', () => {
      render(<Footer />)
      expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
    })

    it('renders social icons with accessible labels', () => {
      render(<Footer />)
      expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /instagram/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /x/i })).toBeInTheDocument()
    })

    it('renders legal links and copyright information', () => {
      render(<Footer />)
      expect(screen.getByRole('link', { name: /terms and conditions/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument()
      expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument()
    })
  })
})
