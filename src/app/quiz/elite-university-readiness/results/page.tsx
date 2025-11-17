'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { EliteUniversityReadinessResults } from '@/components/quiz/EliteUniversityReadinessResults'
import { initializeTracking } from '@/lib/temp-tracking'

// Default results structure (fallback if URL params missing)
const defaultResults = {
  totalScore: 0,
  category: 'Needs Improvement',
  breakdown: {
    academics: 0,
    testScores: 0,
    extracurriculars: 0,
    achievements: 0,
    essays: 0,
    recommendations: 0,
    strategy: 0,
    research: 0,
    diversity: 0,
  },
  strengths: ['Building foundation in key areas'],
  improvements: ['Focus on academics, test preparation, and meaningful extracurricular involvement'],
  recommendations: ['Build a comprehensive improvement plan', 'Focus on long-term development strategy'],
  graduationYear: undefined,
}

function ResultsContent() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState(defaultResults)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize tracking
    initializeTracking()
    
    // Track results page view
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'results_page_view', {
        event_category: 'quiz_interaction',
        event_label: 'elite_university_readiness',
        score: searchParams.get('score') || 0,
        category: searchParams.get('category') || '',
      })
    }

    // Try to get results from URL parameters or session storage
    const score = searchParams.get('score')
    const category = searchParams.get('category')
    
    // Try to get full results from session storage (stored by quiz component)
    let storedResults = null
    if (typeof sessionStorage !== 'undefined') {
      const stored = sessionStorage.getItem('elite_university_readiness_results')
      if (stored) {
        try {
          storedResults = JSON.parse(stored)
        } catch (e) {
          console.error('Failed to parse stored results:', e)
        }
      }
    }

    if (storedResults) {
      // Use stored results if available (most complete)
      setResults(storedResults)
      setIsLoading(false)
    } else if (score && category) {
      // Reconstruct from URL parameters (basic fallback)
      const scoreNum = parseInt(score, 10)
      setResults({
        ...defaultResults,
        totalScore: scoreNum,
        category: decodeURIComponent(category),
      })
      setIsLoading(false)
    } else {
      // No results available - show default
      setIsLoading(false)
    }
  }, [searchParams])

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
    <div className="min-h-screen bg-[#F9F6EF]">
      <EliteUniversityReadinessResults
        score={results.totalScore}
        category={results.category}
        breakdown={results.breakdown}
        strengths={results.strengths}
        improvements={results.improvements}
        recommendations={results.recommendations}
        graduationYear={results.graduationYear}
      />
    </div>
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

