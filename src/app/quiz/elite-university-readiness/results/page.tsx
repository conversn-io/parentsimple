'use client'

import { Suspense } from 'react'
import { EliteUniversityReadinessResults } from '@/components/quiz/EliteUniversityReadinessResults'
import { useEliteReadinessResults } from '@/hooks/useEliteReadinessResults'

function ResultsContent() {
  const { results, isLoading } = useEliteReadinessResults()

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

