import type { Metadata } from 'next'
import { LifeInsuranceCAQuizVariantB } from '@/components/quiz/LifeInsuranceCAQuizVariantB'

export const metadata: Metadata = {
  title: 'Compare Life Insurance Quotes | ParentSimple',
  description: 'Compare life insurance quotes from top providers. No medical exam, instant approval on qualifying plans.',
  keywords: ['life insurance', 'quotes', 'compare', 'family protection', 'parents', 'ParentSimple'],
  openGraph: {
    title: 'Compare Life Insurance Quotes | ParentSimple',
    description: 'Compare life insurance quotes from 13+ insurers. No medical exam, instant approval.',
    type: 'website',
    url: 'https://parentsimple.org/quiz/life-insurance-ca-b',
    siteName: 'ParentSimple',
  },
  alternates: {
    canonical: 'https://parentsimple.org/quiz/life-insurance-ca-b',
  },
}

export default function LifeInsuranceCAVariantBPage() {
  return <LifeInsuranceCAQuizVariantB />
}
