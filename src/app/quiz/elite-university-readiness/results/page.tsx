'use client'

import { Suspense, useEffect } from 'react'
import { EliteUniversityReadinessResultsSimplified } from '@/components/quiz/EliteUniversityReadinessResultsSimplified'
import { useEliteReadinessResults } from '@/hooks/useEliteReadinessResults'
import { trackPageView } from '@/lib/temp-tracking'
import { useFunnelLayout } from '@/hooks/useFunnelFooter'

function ResultsContent() {
  const { results, isLoading } = useEliteReadinessResults()

  useFunnelLayout() // Enable funnel header and footer

  // Track route-specific analytics
  useEffect(() => {
    if (!isLoading) {
      trackPageView('Results Page - Simplified', '/quiz/elite-university-readiness/results')
      
      // GA4 custom event
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'results_page_view', {
          event_category: 'quiz_interaction',
          event_label: 'results_layout_simplified',
          page_path: '/quiz/elite-university-readiness/results',
          score: results.totalScore,
          category: results.category,
        })
      }

      // Meta Pixel PageView
      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', 'PageView', {
          content_name: 'Results Page - Simplified',
          content_category: 'quiz_results',
          page_path: '/quiz/elite-university-readiness/results'
        })
      }
    }
  }, [isLoading, results.totalScore, results.category])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B49] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    )
  }

  return (
    <EliteUniversityReadinessResultsSimplified
      score={results.totalScore}
      category={results.category}
    />
  )
}

export default function EliteUniversityReadinessResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9F6EF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B49] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}

