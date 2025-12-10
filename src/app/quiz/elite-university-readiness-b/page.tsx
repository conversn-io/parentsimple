import type { Metadata } from 'next'
import { EliteUniversityReadinessQuiz } from '@/components/quiz/EliteUniversityReadinessQuiz'

export const metadata: Metadata = {
  title: 'Elite University Readiness Assessment | ParentSimple',
  description: 'Assess your child\'s readiness for elite universities (Ivy League, top 20) with our comprehensive 10-question assessment. Get personalized recommendations and connect with Empowerly\'s expert college counselors.',
  keywords: ['elite university readiness', 'ivy league admissions', 'college readiness assessment', 'college counseling', 'university admissions', 'college prep', 'elite college admissions', 'empowerly'],
  openGraph: {
    title: 'Elite University Readiness Assessment | ParentSimple',
    description: 'Assess your child\'s readiness for elite universities with our comprehensive assessment. Get personalized recommendations.',
    type: 'website',
    url: 'https://parentsimple.org/quiz/elite-university-readiness-b',
    siteName: 'ParentSimple',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elite University Readiness Assessment | ParentSimple',
    description: 'Assess your child\'s readiness for elite universities with our comprehensive assessment.',
  },
  alternates: {
    canonical: 'https://parentsimple.org/quiz/elite-university-readiness-b',
  },
}

export default function EliteUniversityReadinessNoOtpPage() {
  return (
    <div className="min-h-screen bg-[#F9F6EF]">
      <EliteUniversityReadinessQuiz skipOTP={true} />
    </div>
  )
}

