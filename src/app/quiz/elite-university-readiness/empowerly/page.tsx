import type { Metadata } from 'next'
import Link from 'next/link'
import { EliteUniversityReadinessQuiz } from '@/components/quiz/EliteUniversityReadinessQuiz'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Elite University Readiness – Empowerly Beta | ParentSimple',
  description:
    "Test the embedded Empowerly consultation flow with our Elite University Readiness assessment. Complete the quiz, verify OTP, and experience the new in-page booking experience.",
  openGraph: {
    title: 'Elite University Readiness – Empowerly Beta | ParentSimple',
    description:
      'Start the Empowerly beta funnel: complete the Elite University Readiness quiz and book a consultation without leaving the page.',
    type: 'website',
    url: 'https://parentsimple.org/quiz/elite-university-readiness/empowerly',
    siteName: 'ParentSimple',
  },
  alternates: {
    canonical: 'https://parentsimple.org/quiz/elite-university-readiness/empowerly',
  },
}

export default function EliteUniversityEmpowerlyVariantPage() {
  return (
    <div className="min-h-screen bg-[#F9F6EF]">
      <section className="bg-gradient-to-br from-[#0F182C] via-[#141F37] to-[#1A2B49] text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 space-y-6">
          <p className="text-xs uppercase tracking-[0.4em] text-[#9DB89D] font-semibold">
            Variant B • Empowerly Embedded Intake
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white">
            Run the Elite Readiness Assessment &amp; Empowerly Embed in One Flow
          </h1>
          <p className="text-lg text-white/80 max-w-3xl">
            This beta route mirrors the main quiz but routes verified leads directly into the embedded Empowerly
            consultation scheduler. Use this URL to QA the full experience without impacting the default path.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild className="bg-white text-[#1A2B49] hover:bg-[#F9F6EF] font-semibold">
              <a href="#quiz-start">Start Variant B</a>
            </Button>
            <Link
              href="/quiz/elite-university-readiness"
              className="text-white/80 font-semibold underline-offset-4 hover:underline"
            >
              View default experience
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 text-sm text-white/80 pt-4">
            <div className="bg-white/10 rounded-2xl border border-white/10 p-4">
              <p className="font-semibold text-white">1. Take the quiz</p>
              <p className="mt-1">10-question readiness assessment identical to the default path.</p>
            </div>
            <div className="bg-white/10 rounded-2xl border border-white/10 p-4">
              <p className="font-semibold text-white">2. OTP verify</p>
              <p className="mt-1">Phone verification writes a sanitized payload for the embed.</p>
            </div>
            <div className="bg-white/10 rounded-2xl border border-white/10 p-4">
              <p className="font-semibold text-white">3. Land on embed</p>
              <p className="mt-1">Results redirect to `/results-embed` with the Empowerly iframe auto-populated.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="quiz-start" className="min-h-screen bg-[#F9F6EF]">
        <EliteUniversityReadinessQuiz resultVariant="embed" />
      </section>
    </div>
  )
}


