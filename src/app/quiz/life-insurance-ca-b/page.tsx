import type { Metadata } from 'next'
import { LifeInsuranceCAQuizVariantB } from '@/components/quiz/LifeInsuranceCAQuizVariantB'

export const metadata: Metadata = {
  title: 'Compare Life Insurance Quotes | ParentSimple',
  description: 'Compare life insurance quotes from 13+ Canadian insurers. No medical exam, instant approval. Ontario residents.',
  keywords: ['life insurance', 'Canada', 'Ontario', 'quotes', 'compare', 'parents', 'ParentSimple'],
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
