import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, PlayCircle } from 'lucide-react'
import { WEBINAR_VIDEOS, WEBINAR_TOTAL, vimeoEmbedUrl } from '../videos'

const CANONICAL_BASE = 'https://www.parentsimple.org/life-insurance-webinar'
const QUIZ_HREF = '/quiz/life-insurance-us'

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
      {/* Player */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[#9DB89D] mb-3">
          Part {active.n} of {WEBINAR_TOTAL}
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-[#1A2B49] mb-6">
          {active.title}: Life Insurance Webinar
        </h1>
        <div className="rounded-2xl overflow-hidden shadow-lg border border-[#E3E0D5] bg-black">
          <div className="relative w-full aspect-video">
            <iframe
              key={active.vimeoId}
              src={vimeoEmbedUrl(active.vimeoId)}
              title={`${active.title} — Life Insurance Webinar`}
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Single primary CTA — extra-large, centered, with 2-line subline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16 text-center">
        <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[#9DB89D] mb-3">
          Ready when you are
        </p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-semibold text-[#1A2B49] leading-tight max-w-2xl mx-auto mb-8">
          Now that you understand how life insurance works, see what fits your situation.
        </h2>
        <div className="flex flex-col items-center">
          <Link
            href={QUIZ_HREF}
            className="group inline-flex items-center gap-3 bg-[#1A2B49] text-white px-10 md:px-14 py-5 md:py-6 rounded-xl shadow-lg text-xl md:text-2xl font-semibold hover:bg-[#152238] transition-colors"
          >
            Get My Free Quote
            <ArrowRight className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <p className="text-sm md:text-base text-gray-600 mt-4 leading-snug">
            Takes about 60 seconds.
            <br />
            Free · no obligation · licensed agents only.
          </p>
        </div>
      </section>

      {/* Next up */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-20 pb-16 lg:pb-24">
        <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#9DB89D] mb-4 text-center">
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
