import type { Metadata } from 'next'
import { LifeInsuranceMPQuiz } from '@/components/quiz/LifeInsuranceMPQuiz'

export const metadata: Metadata = {
  title: 'Mortgage Protection with Living Benefits | ParentSimple',
  description:
    'Term life insurance designed to pay off your home if something happens to you, and pay you if you\'re diagnosed with a serious illness. Many people qualify with no medical exam.',
  keywords: ['mortgage protection', 'term life insurance', 'living benefits', 'family protection', 'ParentSimple'],
  openGraph: {
    title: 'Mortgage Protection with Living Benefits | ParentSimple',
    description:
      'Term life insurance designed to pay off your home if something happens to you. Many people qualify with no medical exam.',
    type: 'website',
    url: 'https://parentsimple.org/quiz/mortgage-protection',
    siteName: 'ParentSimple',
  },
  alternates: {
    canonical: 'https://parentsimple.org/quiz/mortgage-protection',
  },
}

export default function MortgageProtectionPage() {
  return <LifeInsuranceMPQuiz />
}
