import * as React from "react"

export function JobSkeleton() {
  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 w-full animate-pulse"
      data-testid="job-skeleton"
    >
      <div className="w-24 h-5 bg-surface-container rounded-md mb-6" />

      <div className="text-center flex flex-col items-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface-container rounded-2xl mb-5" />
        <div className="w-3/4 max-w-lg h-9 bg-surface-container rounded-lg mb-3" />
        <div className="w-1/2 max-w-xs h-5 bg-surface-container rounded-md" />
      </div>

      <div className="mt-8 border-2 border-border-subtle rounded-2xl p-6 bg-surface-container-lowest">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-surface-container" />
              <div className="w-16 h-3 bg-surface-container rounded" />
              <div className="w-24 h-4 bg-surface-container rounded" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="h-10 bg-surface-container rounded-xl" />
        <div className="h-10 bg-surface-container rounded-xl" />
      </div>

      <div className="mt-12 space-y-6">
        <div className="w-40 h-6 bg-surface-container rounded" />
        <div className="space-y-2">
          <div className="w-full h-4 bg-surface-container rounded" />
          <div className="w-5/6 h-4 bg-surface-container rounded" />
          <div className="w-4/6 h-4 bg-surface-container rounded" />
        </div>

        <div className="w-48 h-6 bg-surface-container rounded mt-8" />
        <div className="space-y-2">
          <div className="w-full h-4 bg-surface-container rounded" />
          <div className="w-full h-4 bg-surface-container rounded" />
          <div className="w-3/4 h-4 bg-surface-container rounded" />
        </div>
      </div>

      <div className="mt-10 flex flex-col space-y-3">
        <div className="w-full h-12 bg-surface-container rounded-full" />
        <div className="w-full h-12 bg-surface-container rounded-full" />
      </div>
    </div>
  )
}
