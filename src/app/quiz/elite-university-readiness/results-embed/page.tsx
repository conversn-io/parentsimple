'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, Sparkles, Users } from 'lucide-react'
import { useEliteReadinessResults } from '@/hooks/useEliteReadinessResults'
import { EmpowerlyConsultationEmbed } from '@/components/empowerly/EmpowerlyConsultationEmbed'
import { Button } from '@/components/ui/Button'

const EMPOWERLY_EMBED_URL = process.env.NEXT_PUBLIC_EMPOWERLY_EMBED_URL || ''
const EMBED_CONTEXT_STORAGE_KEY = 'elite_university_embed_context'
const EMBED_CONTEXT_TTL_MS = 1000 * 60 * 60 // 1 hour freshness window

type EmbedLeadContext = {
  parent?: Record<string, unknown> | null
  student?: Record<string, unknown> | null
  readiness?: {
    score?: number
    category?: string
    strengths?: unknown
    improvements?: unknown
  }
  [key: string]: unknown
}

const loadingState = (
  <div className="min-h-screen bg-[#F9F6EF] flex items-center justify-center px-4">
    <div className="text-center bg-white shadow-lg rounded-2xl px-6 py-8 border border-[#E3E0D5]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A2B49] mx-auto mb-4"></div>
      <p className="text-gray-600">Loading your Empowerly experience...</p>
    </div>
  </div>
)

const getScoreVisuals = (score: number) => {
  if (score >= 85) {
    return {
      label: 'Elite Ready',
      circleBorder: 'border-green-500',
      badgeBg: 'bg-green-100',
      badgeText: 'text-green-800',
    }
  }
  if (score >= 70) {
    return {
      label: 'Competitive',
      circleBorder: 'border-amber-400',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
    }
  }
  if (score >= 55) {
    return {
      label: 'Developing',
      circleBorder: 'border-orange-400',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-800',
    }
  }
  return {
    label: 'Foundation',
    circleBorder: 'border-red-400',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-800',
  }
}

function ResultsEmbedContent() {
  const { results, isLoading } = useEliteReadinessResults()
  const [leadContext, setLeadContext] = useState<EmbedLeadContext | null>(null)
  const [leadContextLoaded, setLeadContextLoaded] = useState(false)

  useEffect(() => {
    if (isLoading) return

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'results_page_view_variant_b', {
        event_category: 'quiz_interaction',
        event_label: 'empowerly_embed_variant',
        score: results.totalScore,
        category: results.category,
      })
    }
  }, [isLoading, results.totalScore, results.category])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const loadContext = () => {
      const now = Date.now()

      const parseContext = (raw: string | null): EmbedLeadContext | null => {
        if (!raw) return null
        try {
          const parsed = JSON.parse(raw) as EmbedLeadContext & { timestamp?: string }
          if (parsed.timestamp) {
            const ageMs = now - new Date(parsed.timestamp).getTime()
            if (Number.isFinite(ageMs) && ageMs > EMBED_CONTEXT_TTL_MS) {
              return null
            }
          }
          return parsed
        } catch (error) {
          console.error('Failed to parse Empowerly embed context:', error)
          return null
        }
      }

      const sessionValue = sessionStorage.getItem(EMBED_CONTEXT_STORAGE_KEY)
      let context = parseContext(sessionValue)

      if (!context) {
        const localValue = typeof localStorage !== 'undefined' ? localStorage.getItem(EMBED_CONTEXT_STORAGE_KEY) : null
        context = parseContext(localValue)
        if (context && sessionValue === null) {
          sessionStorage.setItem(EMBED_CONTEXT_STORAGE_KEY, JSON.stringify(context))
        }
      }

      if (!context) {
        console.warn('⚠️ No Empowerly embed context found in storage (session/local)')
      } else {
        const readinessScore = context.readiness?.score
        console.log('📦 Loaded Empowerly embed context:', {
          hasParent: Boolean(context.parent),
          hasStudent: Boolean(context.student),
          readinessScore,
          source: sessionValue ? 'sessionStorage' : 'localStorage',
        })
      }
      setLeadContext(context)
      setLeadContextLoaded(true)
    }

    loadContext()
  }, [])

  if (isLoading) {
    return loadingState
  }

  const scoreVisuals = getScoreVisuals(results.totalScore)
  const improvementHighlights = results.improvements.slice(0, 3)
  const classicResultsHref = `/quiz/elite-university-readiness/results?score=${results.totalScore}&category=${encodeURIComponent(results.category)}`

  return (
    <div className="min-h-screen bg-[#F9F6EF] py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl border border-[#E3E0D5] p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="uppercase text-xs tracking-[0.35em] text-[#9DB89D] font-semibold">
                Elite Readiness Assessment • Variant B
              </p>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A2B49] mt-2">
                Empowerly Consultation Landing
              </h1>
              <p className="text-gray-600 mt-3 max-w-2xl">
                You unlocked the embedded Empowerly intake experience. Book a consultation without leaving ParentSimple and
                keep this tab open for quick reference.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`w-28 h-28 rounded-full border-4 ${scoreVisuals.circleBorder} flex flex-col items-center justify-center bg-white`}
              >
                <span className="text-3xl font-bold text-[#1A2B49]">{results.totalScore}</span>
                <span className="text-xs uppercase tracking-wide text-gray-500">Score</span>
              </div>
              <div>
                <span
                  className={`inline-flex px-4 py-1 rounded-full text-sm font-semibold ${scoreVisuals.badgeBg} ${scoreVisuals.badgeText}`}
                >
                  {scoreVisuals.label}
                </span>
                <p className="mt-2 text-sm text-gray-600">
                  Category:{' '}
                  <span className="font-semibold text-[#1A2B49]">
                    {results.category || 'Needs Improvement'}
                  </span>
                </p>
                {results.graduationYear && (
                  <p className="text-sm text-gray-500">Graduation year: {results.graduationYear}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <section className="rounded-2xl bg-gradient-to-br from-[#1A2B49] via-[#141F37] to-[#0F182C] text-white shadow-2xl border border-[#0D1423] p-6 sm:p-8 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="uppercase tracking-[0.35em] text-xs text-[#9DB89D]">Beta Experience</p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-2">
                Schedule with Empowerly Inside ParentSimple
              </h2>
              <p className="text-white/80 mt-3 max-w-2xl">
                We&apos;re testing a fully embedded workflow so your consultation booking, qualification data, and Empowerly follow-up all stay in sync.
                No additional redirects, no duplicate forms.
              </p>
            </div>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              <ShieldCheck className="w-5 h-5 text-[#9DB89D]" />
              <span>Secure iframe • scoped data sharing</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 text-sm">
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <Sparkles className="w-5 h-5 text-[#9DB89D]" />
              <h3 className="font-semibold mt-3">Step 1</h3>
              <p className="text-white/80 mt-1">
                Review your readiness score and focus areas so you can highlight them during the Empowerly call.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <Users className="w-5 h-5 text-[#9DB89D]" />
              <h3 className="font-semibold mt-3">Step 2</h3>
              <p className="text-white/80 mt-1">
                Complete the embedded intake and pick a time that works. Empowerly will confirm via email/SMS.
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
              <ShieldCheck className="w-5 h-5 text-[#9DB89D]" />
              <h3 className="font-semibold mt-3">Step 3</h3>
              <p className="text-white/80 mt-1">
                After submitting, return to this tab anytime to revisit your score and recommendations.
              </p>
            </div>
          </div>
        </section>

        {EMPOWERLY_EMBED_URL ? (
          <EmpowerlyConsultationEmbed embedUrl={EMPOWERLY_EMBED_URL} minHeight={960} leadData={leadContext ?? undefined} />
        ) : (
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-900 shadow-inner">
            <p className="font-semibold">Empowerly embed URL not configured</p>
            <p className="text-sm mt-2">
              Add <code className="font-mono text-xs">NEXT_PUBLIC_EMPOWERLY_EMBED_URL</code> to your environment to render the live consultation iframe.
            </p>
          </div>
        )}

        {leadContextLoaded && !leadContext && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
            <p className="font-semibold">We couldn&apos;t auto-fill your info.</p>
            <p className="text-sm mt-1">
              Please complete the Elite University Readiness assessment and OTP verification before using the embedded Empowerly scheduler so we can pass your contact details securely.
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-[#E3E0D5] p-6 sm:p-8">
          <h3 className="text-xl font-semibold text-[#1A2B49]">Top Focus Areas</h3>
          <p className="text-gray-600 mt-2">
            Share these highlights with Empowerly so they already know where to dive deeper during your consultation.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {improvementHighlights.map((item, index) => (
              <li key={index} className="flex items-start gap-3 rounded-xl border border-[#E3E0D5] p-3">
                <span className="text-sm font-semibold text-[#9DB89D]">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
            {improvementHighlights.length === 0 && (
              <li className="text-sm text-gray-500">
                Recommendations will appear here when available.
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#DAD3C3] bg-[#FCFAF5] shadow-inner p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-[#1A2B49]">Need the full results deck?</h3>
            <p className="text-gray-600 mt-1">
              Access the classic results view for detailed breakdowns or restart the quiz if you want to test another path.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[#1A2B49] hover:bg-[#152238] text-white px-6"
            >
              <Link href={classicResultsHref}>
                View Classic Results
              </Link>
            </Button>
            <Link
              href="/quiz/elite-university-readiness"
              className="text-sm font-semibold text-[#1A2B49] underline-offset-4 hover:underline"
            >
              Restart assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EliteUniversityReadinessEmbedResultsPage() {
  return (
    <Suspense fallback={loadingState}>
      <ResultsEmbedContent />
    </Suspense>
  )
}


