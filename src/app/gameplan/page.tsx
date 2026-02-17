import type { Metadata } from 'next'
import { Suspense } from 'react'
import { GamePlanV2FunnelClient } from '@/components/quiz/GamePlanV2FunnelClient'

export const metadata: Metadata = {
  title: 'Free Elite Admissions Game Plan | ParentSimple',
  description: 'Claim your free Elite Admissions Game Plan. Get a personalized Readiness Score and a private 1-on-1 call with a former admissions officer.',
  keywords: ['elite admissions', 'game plan', 'college readiness', 'admissions officer', 'ParentSimple', 'Empowerly', 'college planning'],
  openGraph: {
    title: 'Free Elite Admissions Game Plan | ParentSimple',
    description: 'Get a personalized Readiness Score and connect with expert counselors from Empowerly.',
    type: 'website',
    url: 'https://parentsimple.org/gameplan',
    siteName: 'ParentSimple',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Elite Admissions Game Plan | ParentSimple',
    description: 'Claim your free Elite Admissions Game Plan.',
  },
  alternates: {
    canonical: 'https://parentsimple.org/gameplan',
  },
}

export default function GamePlanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <GamePlanV2FunnelClient />
    </Suspense>
  )
}
