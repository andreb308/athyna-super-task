"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
  baseId: string
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider")
  }
  return context
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || "")
  const baseId = React.useId()
  const isControlled = controlledValue !== undefined
  const currentValue = isControlled ? controlledValue : uncontrolledValue

  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange]
  )

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange, baseId }}>
      <div data-slot="tabs" className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>

export function TabsList({ className, children, onKeyDown, ...props }: TabsListProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e)
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      const tabs = Array.from(
        e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
      )
      const currentIndex = tabs.findIndex((tab) => tab === document.activeElement)
      if (currentIndex === -1) return

      let nextIndex = e.key === "ArrowRight" ? currentIndex + 1 : currentIndex - 1
      if (nextIndex >= tabs.length) nextIndex = 0
      if (nextIndex < 0) nextIndex = tabs.length - 1

      tabs[nextIndex]?.focus()
      tabs[nextIndex]?.click()
      e.preventDefault()
    }
  }

  return (
    <div
      role="tablist"
      data-slot="tabs-list"
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center gap-6 border-b border-border-subtle",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export function TabsTrigger({
  value,
  className,
  children,
  ...props
}: TabsTriggerProps) {
  const { value: activeValue, onValueChange, baseId } = useTabsContext()
  const isSelected = activeValue === value
  const triggerId = `${baseId}-trigger-${value}`
  const panelId = `${baseId}-panel-${value}`

  return (
    <button
      role="tab"
      type="button"
      id={triggerId}
      aria-controls={panelId}
      data-slot="tabs-trigger"
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      onClick={() => onValueChange(value)}
      className={cn(
        "relative pb-3 text-sm font-semibold transition-colors outline-none cursor-pointer",
        isSelected
          ? "text-on-surface"
          : "text-text-muted hover:text-on-surface",
        className
      )}
      {...props}
    >
      {children}
      {isSelected && (
        <span
          data-slot="tabs-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transition-all duration-300 ease-out"
        />
      )}
    </button>
  )
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps) {
  const { value: activeValue, baseId } = useTabsContext()
  const isSelected = activeValue === value
  const triggerId = `${baseId}-trigger-${value}`
  const panelId = `${baseId}-panel-${value}`

  if (!isSelected) return null

  return (
    <div
      role="tabpanel"
      id={panelId}
      aria-labelledby={triggerId}
      data-slot="tabs-content"
      tabIndex={0}
      className={cn("mt-4 focus-visible:outline-none", className)}
      {...props}
    >
      {children}
    </div>
  )
}
