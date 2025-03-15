'use client'

import { useSearchParams } from 'next/navigation'

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="h-[100vh] w-full flex items-center justify-center">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="p-6 bg-destructive/10 border border-destructive rounded-lg shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <p className="text-center font-medium text-destructive">
              {error ? `Authentication Error: ${error}` : 'An error occurred'}
            </p>
            <p className="text-sm text-muted-foreground">
              Please try signing in again
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}