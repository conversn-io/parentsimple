import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, PlayCircle, ShieldCheck } from 'lucide-react'
import { WEBINAR_VIDEOS, WEBINAR_TOTAL } from '../videos'

const CANONICAL_BASE = 'https://www.parentsimple.org/life-insurance-webinar'

export async function generateStaticParams() {
  return WEBINAR_VIDEOS.map((v) => ({ n: String(v.n) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>
}): Promise<Metadata> {
  const { n } = await params
  const idx = Number.parseInt(n, 10)
  const active = WEBINAR_VIDEOS.find((v) => v.n === idx)
  if (!active) return { title: 'Not found | ParentSimple' }

  const title = `${active.title} · Life Insurance Webinar | ParentSimple`
  const description =
    'A free, plain-language video series explaining how life insurance actually works — watch at your own pace, no obligation.'
  const url = `${CANONICAL_BASE}/${active.n}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      type: 'video.other',
      url,
      siteName: 'ParentSimple',
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function WebinarVideoPage({
  params,
}: {
  params: Promise<{ n: string }>
}) {
  const { n } = await params
  const idx = Number.parseInt(n, 10)
  const active = WEBINAR_VIDEOS.find((v) => v.n === idx)
  if (!active) notFound()

  const others = WEBINAR_VIDEOS.filter((v) => v.n !== active.n)

  return (
    <div className="bg-[#F9F6EF] min-h-screen">
      {/* Header */}
      <section className="border-b border-[#E3E0D5] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
          <Link
            href="/life-insurance-webinar"
            className="inline-flex items-center gap-1.5 text-sm text-[#1A2B49] hover:text-[#152238] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to series
          </Link>
          <div className="text-xs font-semibold tracking-[0.2em] uppercase text-[#9DB89D]">
            Part {active.n} of {WEBINAR_TOTAL}
          </div>
        </div>
      </section>

      {/* Player */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-[#1A2B49] mb-6">
          {active.title}: Life Insurance Webinar
        </h1>
        <div className="rounded-2xl overflow-hidden shadow-lg border border-[#E3E0D5] bg-black">
          <video
            key={active.src}
            controls
            preload="metadata"
            playsInline
            className="w-full aspect-video bg-black"
          >
            <source src={active.src} type="video/mp4" />
            Your browser doesn&apos;t support embedded video.{' '}
            <a href={active.src} className="underline text-white">
              Download the file
            </a>
            .
          </video>
        </div>
      </section>

      {/* Bridge CTA: watched a video → take the quiz */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-14">
        <div className="rounded-2xl bg-gradient-to-br from-[#1A2B49] to-[#243b62] text-white p-8 md:p-10 shadow-lg">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase text-[#E4CDA1] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E4CDA1]" />
              Ready when you are
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold leading-tight mb-4">
              Now that you understand how life insurance works, see what fits your situation.
            </h2>
            <p className="text-white/85 text-base md:text-lg leading-relaxed mb-6">
              Answer a few short questions and we&apos;ll match you with a licensed agent who can
              walk you through your best-fit coverage — plain language, no obligation.
            </p>
            <Link
              href="/quiz/life-insurance-us"
              className="inline-flex items-center gap-2 bg-[#E4CDA1] text-[#1A2B49] px-6 py-3.5 rounded-lg font-semibold hover:bg-[#EDD9B4] transition-colors"
            >
              Start the 60-Second Quiz
              <ArrowRight className="w-4 h-4" />
            </Link>
            <ul className="mt-6 grid sm:grid-cols-3 gap-3 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#9DB89D] flex-shrink-0" />
                Takes about 60 seconds
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#9DB89D] flex-shrink-0" />
                Free · no obligation
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#9DB89D] flex-shrink-0" />
                Licensed agents only
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Next up */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#9DB89D] mb-4">
          More in this series
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {others.map((v) => (
            <Link
              key={v.n}
              href={`/life-insurance-webinar/${v.n}`}
              className="group block bg-white/50 rounded-xl border border-[#E3E0D5]/70 p-3 hover:bg-white hover:border-[#1A2B49]/25 hover:shadow-sm transition-all"
            >
              <div className="aspect-video rounded-lg bg-gray-200/70 flex items-center justify-center mb-2.5 group-hover:bg-[#0F1B33] transition-colors">
                <PlayCircle
                  className="w-8 h-8 text-gray-400 group-hover:text-[#E4CDA1] transition-colors"
                  strokeWidth={1.5}
                />
              </div>
              <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-gray-400 group-hover:text-[#9DB89D] transition-colors mb-0.5">
                Part {v.n}
              </div>
              <div className="text-sm font-semibold text-gray-500 group-hover:text-[#1A2B49] transition-colors">
                {v.title}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Close block: reinforce the next step */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 lg:pb-24">
        <div className="rounded-2xl bg-white border border-[#E3E0D5] p-8 md:p-10 shadow-sm">
          <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-8 items-start">
            <div className="w-14 h-14 rounded-full bg-[#9DB89D]/15 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-7 h-7 text-[#1A2B49]" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-serif font-semibold text-[#1A2B49] mb-3">
                Decide with confidence — not pressure
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                We built this series so families could understand life insurance before talking to
                anyone. When you&apos;re ready, we&apos;ll match you with a licensed agent who can
                walk you through your options — the same plain-language way. No hard sell, ever.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/quiz/life-insurance-us"
                  className="inline-flex items-center justify-center gap-2 bg-[#1A2B49] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#152238] transition-colors"
                >
                  Start the 60-Second Quiz
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/life-insurance-webinar"
                  className="inline-flex items-center justify-center gap-2 border border-[#E3E0D5] text-[#1A2B49] px-6 py-3 rounded-lg font-semibold hover:bg-[#F9F6EF] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to the series
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance / disclaimer */}
      <section className="bg-white border-t border-[#E3E0D5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-xs text-gray-500 leading-relaxed">
            Educational content only. Not investment, tax, or legal advice. Insurance products are
            offered through licensed professionals and are not available in all states. No coverage
            is guaranteed and no guaranteed-issue product is being marketed here.
          </p>
        </div>
      </section>
    </div>
  )
}
