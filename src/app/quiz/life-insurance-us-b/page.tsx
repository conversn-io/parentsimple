import type { Metadata } from 'next'
import { LifeInsuranceUSQuizVariantB } from '@/components/quiz/LifeInsuranceUSQuizVariantB'

export const metadata: Metadata = {
  title: 'Life Insurance Quotes for Families | ParentSimple',
  description: 'Compare life insurance quotes. Get matched with top options. No medical exam and no waiting period on qualifying plans.',
  keywords: ['life insurance', 'quotes', 'family protection', 'parents', 'ParentSimple'],
  openGraph: {
    title: 'Life Insurance Quotes | ParentSimple',
    description: 'Compare life insurance quotes. No medical exam, no waiting period.',
    type: 'website',
    url: 'https://parentsimple.org/quiz/life-insurance-us',
    siteName: 'ParentSimple',
  },
  alternates: {
    canonical: 'https://parentsimple.org/quiz/life-insurance-us',
  },
}

export default function LifeInsuranceUSVariantBPage() {
  return <LifeInsuranceUSQuizVariantB />
}
