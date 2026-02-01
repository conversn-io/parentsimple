'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackPageView } from '@/lib/temp-tracking'

/**
 * PageView Tracker Component (Internal)
 * 
 * Automatically tracks page views on all route changes.
 * Fires Meta Pixel PageView event and GA4 page_view event.
 */
function PageViewTrackerInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Skip if not in browser
    if (typeof window === 'undefined') {
      return
    }

    // Get full path including query parameters
    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    
    // Get page title from document
    const pageTitle = typeof document !== 'undefined' ? document.title : pathname || 'ParentSimple'
    
    // Track page view
    trackPageView(pageTitle, fullPath)
  }, [pathname, searchParams])

  return null // This component doesn't render anything
}

/**
 * PageView Tracker Component
 * 
 * Wrapped in Suspense boundary to satisfy Next.js 15 requirements for useSearchParams()
 * 
 * Usage: Add to root layout to track all page views automatically
 */
export function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <PageViewTrackerInner />
    </Suspense>
  )
}

