import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, PlayCircle } from 'lucide-react'
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

      {/* Next up */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pb-20">
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
