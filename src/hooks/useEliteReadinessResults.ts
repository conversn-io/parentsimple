'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { initializeTracking } from '@/lib/temp-tracking'

export interface EliteReadinessResultsData {
  totalScore: number
  category: string
  breakdown: {
    academics: number
    testScores: number
    extracurriculars: number
    achievements: number
    essays: number
    recommendations: number
    strategy: number
    research: number
    diversity: number
  }
  strengths: string[]
  improvements: string[]
  recommendations: string[]
  graduationYear?: string
}

export const defaultEliteReadinessResults: EliteReadinessResultsData = {
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

export function useEliteReadinessResults() {
  const searchParams = useSearchParams()
  const [results, setResults] = useState<EliteReadinessResultsData>(defaultEliteReadinessResults)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeTracking()

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'results_page_view', {
        event_category: 'quiz_interaction',
        event_label: 'elite_university_readiness',
        score: searchParams.get('score') || 0,
        category: searchParams.get('category') || '',
      })
    }

    const score = searchParams.get('score')
    const category = searchParams.get('category')

    let storedResults: EliteReadinessResultsData | null = null
    if (typeof sessionStorage !== 'undefined') {
      const stored = sessionStorage.getItem('elite_university_readiness_results')
      if (stored) {
        try {
          storedResults = JSON.parse(stored)
        } catch (error) {
          console.error('Failed to parse stored results:', error)
        }
      }
    }

    if (storedResults) {
      setResults(storedResults)
      setIsLoading(false)
      return
    }

    if (score && category) {
      const scoreNum = parseInt(score, 10)
      setResults({
        ...defaultEliteReadinessResults,
        totalScore: Number.isNaN(scoreNum) ? 0 : scoreNum,
        category: decodeURIComponent(category),
      })
      setIsLoading(false)
      return
    }

    setIsLoading(false)
  }, [searchParams])

  return { results, isLoading }
}


