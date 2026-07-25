import type { Metadata } from 'next'
import { BookOpen, Layers, DollarSign, PlayCircle } from 'lucide-react'
import WebinarGate from './WebinarGate'

const CANONICAL = 'https://www.parentsimple.org/life-insurance-webinar'

export const metadata: Metadata = {
  title: 'The Free Life Insurance Webinar Series | ParentSimple',
  description:
    'A free, plain-language video series that explains how life insurance actually works — the types, what tends to fit which situation, and what determines the cost. No pressure, no obligation.',
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'The Free Life Insurance Webinar Series | ParentSimple',
    description:
      'Understand life insurance before you decide — a free video series, in plain language, at your pace.',
    type: 'article',
    url: CANONICAL,
    siteName: 'ParentSimple',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Free Life Insurance Webinar Series | ParentSimple',
    description:
      'Understand life insurance before you decide — a free video series, in plain language, at your pace.',
  },
}

const learningPoints = [
  {
    icon: BookOpen,
    title: 'How life insurance works',
    body: 'How it is different from other kinds of insurance, and what the policy actually promises.',
  },
  {
    icon: Layers,
    title: 'The types of life insurance',
    body: 'Term, whole, and final expense — and which tends to fit which situation.',
  },
  {
    icon: DollarSign,
    title: 'How much it costs, and why',
    body: 'What determines the amount you may need and what moves the price.',
  },
]

export default function LifeInsuranceWebinarPage() {
  return (
    <div className="bg-[#F9F6EF] min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A2B49] to-[#243b62]" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-[#9DB89D] uppercase mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9DB89D]" />
                Free webinar · Life insurance
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-5">
                Understand Life Insurance Before You Decide
              </h1>
              <p className="text-lg md:text-xl text-white/85 max-w-xl leading-relaxed">
                A free video series that explains how life insurance actually works — in plain
                language, at your pace. No pressure, no obligation.
              </p>

              <ul className="mt-8 space-y-2.5 text-white/90 text-base">
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#9DB89D] flex-shrink-0" />
                  <span>Learn how life insurance is different from other kinds of coverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#9DB89D] flex-shrink-0" />
                  <span>Understand term, whole, and final expense — and where each fits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#9DB89D] flex-shrink-0" />
                  <span>See what determines how much you may need and what moves the price</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="w-full max-w-md lg:hidden">
                <WebinarGate />
              </div>
              <div className="hidden lg:flex w-full max-w-md items-center justify-center">
                <div className="relative w-full aspect-video rounded-2xl bg-[#0F1B33] border border-white/10 shadow-2xl flex items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent" aria-hidden />
                  <div className="relative flex flex-col items-center gap-3 text-white/90">
                    <PlayCircle className="w-16 h-16 text-[#E4CDA1]" strokeWidth={1.5} />
                    <div className="text-sm font-semibold tracking-[0.2em] uppercase text-[#E4CDA1]">
                      5-part series
                    </div>
                    <div className="font-serif text-lg text-white/80">Unlock all videos below</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you'll learn + Gate */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <p className="text-sm font-semibold tracking-[0.2em] text-[#9DB89D] uppercase mb-3">
              What you&apos;ll learn
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#1A2B49] mb-8">
              A calm, useful primer — not a sales pitch
            </h2>
            <div className="grid sm:grid-cols-1 gap-5">
              {learningPoints.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="bg-white rounded-xl border border-[#E3E0D5] p-5 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#9DB89D]/15 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-[#1A2B49]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1A2B49] mb-1.5">{title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mt-8">
              The series is five short videos you can watch in order or jump around. Together they
              cover the ground above — no jargon, no pressure to buy anything.
            </p>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2 hidden lg:block">
            <div className="lg:sticky lg:top-8">
              <WebinarGate />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile gate placement below fold */}
      <section className="lg:hidden max-w-xl mx-auto px-4 sm:px-6 pb-16">
        <WebinarGate />
      </section>

      {/* Compliance / disclaimer */}
      <section className="bg-white border-t border-[#E3E0D5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-serif font-semibold text-[#1A2B49] mb-3">
            About this webinar
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            This webinar is educational content designed to help you understand how life insurance
            works and the common types of coverage available. It does not recommend a specific
            policy, carrier, or product for your situation and does not create an advisor-client or
            agent-client relationship.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Nothing in this series is investment, tax, or legal advice. Coverage availability,
            eligibility, and pricing depend on your individual circumstances, the state you live
            in, and the carrier&apos;s underwriting. If you&apos;d like personalized guidance, we
            can match you with a licensed insurance professional.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            ParentSimple is an educational publisher. Insurance products are offered through
            licensed professionals and are not available in all states. No coverage is guaranteed
            and no guaranteed-issue product is being marketed here.
          </p>
        </div>
      </section>
    </div>
  )
}
