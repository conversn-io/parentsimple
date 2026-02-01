import type { Metadata } from 'next'
import { Suspense } from 'react'
import { GamePlanFunnelClient } from '@/components/quiz/GamePlanFunnelClient'

export const metadata: Metadata = {
  title: 'Free Elite Admissions Game Plan | ParentSimple',
  description: 'Claim your free Elite Admissions Game Plan. Get a personalized Readiness Score and a private 1-on-1 call with a former admissions officer.',
  keywords: ['elite admissions', 'game plan', 'college readiness', 'admissions officer', 'ParentSimple', 'Empowerly'],
  openGraph: {
    title: 'Free Elite Admissions Game Plan | ParentSimple',
    description: 'Claim your free Elite Admissions Game Plan. Get a personalized Readiness Score and a private 1-on-1 call.',
    type: 'website',
    url: 'https://parentsimple.org/quiz/elite-university-readiness-c',
    siteName: 'ParentSimple',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Elite Admissions Game Plan | ParentSimple',
    description: 'Claim your free Elite Admissions Game Plan.',
  },
  alternates: {
    canonical: 'https://parentsimple.org/quiz/elite-university-readiness-c',
  },
}

export default function EliteUniversityReadinessCPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9F6EF]" />}>
      <GamePlanFunnelClient />
    </Suspense>
  )
}
