import type { Metadata } from 'next'
import Image from 'next/image'
import { BookOpen, ShieldCheck, GraduationCap, Wallet } from 'lucide-react'
import GuideGate from './GuideGate'

const CANONICAL = 'https://www.parentsimple.org/guides/college-funding-guide'
const COVER_URL =
  'https://vpysqshhafthuxvokwqj.supabase.co/storage/v1/object/public/lead-magnets/parentsimple/education/college-funding-guide-cover.png'

export const metadata: Metadata = {
  title: 'The College Funding Guide — Free Download | ParentSimple',
  description:
    "A clear, plain-English plan for saving toward your child's education. Covers 529s, ESAs, UTMAs, and how to think about the years ahead — free, no obligation.",
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: 'The College Funding Guide | ParentSimple',
    description:
      "A clear plan for saving toward your child's education — free, no obligation.",
    type: 'article',
    url: CANONICAL,
    siteName: 'ParentSimple',
    images: [{ url: COVER_URL, width: 800, height: 1035, alt: 'The College Funding Guide cover' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The College Funding Guide | ParentSimple',
    description:
      "A clear plan for saving toward your child's education — free, no obligation.",
    images: [COVER_URL],
  },
}

const insidePoints = [
  {
    icon: Wallet,
    title: 'How the accounts actually work',
    body: '529 plans, Coverdell ESAs, and UTMAs — what each is designed for and where each fits.',
  },
  {
    icon: GraduationCap,
    title: 'What college can really cost',
    body: 'Public vs. private, in-state vs. out-of-state, and how aid and scholarships change the sticker price.',
  },
  {
    icon: BookOpen,
    title: 'A saving cadence you can keep',
    body: 'Pick a starting point that fits your household — and a way to raise it as your child grows.',
  },
  {
    icon: ShieldCheck,
    title: 'Questions to ask a consultant',
    body: 'What to look for when you match with a college funding consultant so the conversation is useful from day one.',
  },
]

export default function CollegeFundingGuidePage() {
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
                Free guide · Education planning
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-5">
                The College Funding Guide
              </h1>
              <p className="text-lg md:text-xl text-white/85 max-w-xl leading-relaxed">
                A clear plan for saving toward your child&apos;s education — plain language, no
                jargon, no sales pitch. Sent straight to your inbox.
              </p>

              <ul className="mt-8 space-y-2.5 text-white/90 text-base">
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#9DB89D] flex-shrink-0" />
                  <span>Understand 529s, ESAs, and UTMAs without the guesswork</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#9DB89D] flex-shrink-0" />
                  <span>See what public and private college actually costs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#9DB89D] flex-shrink-0" />
                  <span>Choose a saving cadence you can keep</span>
                </li>
              </ul>
            </div>

            <div className="w-full max-w-md mx-auto lg:mx-0 lg:justify-self-end">
              <GuideGate />
            </div>
          </div>
        </div>
      </section>

      {/* Gate + What's inside */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <p className="text-sm font-semibold tracking-[0.2em] text-[#9DB89D] uppercase mb-3">
              What&apos;s inside
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#1A2B49] mb-8">
              A calm, useful primer — not a sales brochure
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {insidePoints.map(({ icon: Icon, title, body }) => (
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
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2 hidden lg:block">
            <div className="lg:sticky lg:top-8 flex justify-center">
              <Image
                src={COVER_URL}
                alt="The College Funding Guide — cover"
                width={320}
                height={414}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Compliance / disclaimer */}
      <section className="bg-white border-t border-[#E3E0D5]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-xl font-serif font-semibold text-[#1A2B49] mb-3">
            About this guide
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            The College Funding Guide is educational content designed to help parents understand
            common ways to save toward higher education. It explains how 529 plans, Coverdell
            Education Savings Accounts (ESAs), and UTMA custodial accounts are typically used —
            without recommending a specific product for your situation.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            Nothing in this guide is investment, tax, or legal advice, and reading it does not
            create an advisor-client relationship. If you&apos;d like personalized guidance, we can
            match you with a college funding consultant.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            ParentSimple is an educational publisher. We do not sell investment products. Tax
            treatment of any account depends on your individual circumstances and current law; you
            should consult a qualified tax professional before acting on any information in this
            guide.
          </p>
        </div>
      </section>
    </div>
  )
}
