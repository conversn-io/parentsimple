'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFunnelLayout } from '@/hooks/useFunnelFooter'
import { initializeTracking, trackPageView } from '@/lib/temp-tracking'
import { AgentAssignmentPage } from '@/components/quiz/AgentAssignmentPage'

interface QuizAnswers {
  firstName?: string
  lastName?: string
  gender?: string
  ageRange?: string
  smoker?: string
  coverage?: string
  purpose?: string
  bestTime?: string
  contact_info?: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
  }
  email?: string
  phone?: string
  sessionId?: string
  [key: string]: any
}

export default function LifeInsuranceUSResultsPage() {
  useFunnelLayout()
  const router = useRouter()
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeTracking()
    trackPageView('Life Insurance US Results', '/quiz/life-insurance-us/results')

    const loadQuizAnswers = () => {
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }

      let attemptCount = 0
      const maxAttempts = 5
      const attemptDelays = [0, 100, 300, 500, 1000]

      const tryLoadAnswers = (delay: number) => {
        setTimeout(() => {
          attemptCount++

          let storedAnswers = sessionStorage.getItem('life_insurance_us_quiz_data')

          if (!storedAnswers) {
            storedAnswers = localStorage.getItem('life_insurance_us_quiz_data')
            if (storedAnswers) {
              try {
                sessionStorage.setItem('life_insurance_us_quiz_data', storedAnswers)
              } catch {}
            }
          }

          if (storedAnswers) {
            try {
              const data = JSON.parse(storedAnswers)
              const answers = data.answers || data

              if (!answers.sessionId) {
                const sessionId =
                  data.quizSessionId ||
                  sessionStorage.getItem('session_id') ||
                  `li_us_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                answers.sessionId = sessionId
              }

              setQuizAnswers(answers)
              setIsLoading(false)
            } catch {
              if (attemptCount < maxAttempts) {
                tryLoadAnswers(attemptDelays[attemptCount])
              } else {
                setIsLoading(false)
              }
            }
          } else if (attemptCount < maxAttempts) {
            tryLoadAnswers(attemptDelays[attemptCount])
          } else {
            setIsLoading(false)
          }
        }, delay)
      }

      tryLoadAnswers(attemptDelays[0])
    }

    loadQuizAnswers()
  }, [router])

  const handleRestart = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('life_insurance_us_quiz_data')
      localStorage.removeItem('life_insurance_us_quiz_data')
    }
    router.push('/quiz/life-insurance-us')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#36596A] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your results...</p>
        </div>
      </div>
    )
  }

  if (!quizAnswers) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Results Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find your quiz results. Please start the quiz again.
          </p>
          <button
            onClick={() => router.push('/quiz/life-insurance-us')}
            className="bg-[#36596A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2a4a5a] transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    )
  }

  return <AgentAssignmentPage answers={quizAnswers} onRestart={handleRestart} funnelType="life-insurance-us" />
}
