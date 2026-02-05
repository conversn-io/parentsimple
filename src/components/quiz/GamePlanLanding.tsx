'use client'

import Link from 'next/link'
import Image from 'next/image'

const GAME_PLAN_START_URL = '/gameplan?start=1'

export function GamePlanLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - logo only */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 md:h-20">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/images/logos/ParentSimple-header-logo.png"
                alt="ParentSimple"
                width={180}
                height={32}
                className="h-8 md:h-10 w-auto"
                priority
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Tight Column */}
      <section className="relative bg-white py-12 lg:py-16">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6">
          <div className="text-center space-y-6">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1A2B49] leading-tight">
              Claim Your Free Elite Admissions Game Plan
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed">
              Includes a personalized Readiness Score and a private 1-on-1 call with a former admissions officer.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href={GAME_PLAN_START_URL}
                className="inline-flex items-center justify-center w-full sm:w-auto bg-[#1A2B49] text-white px-12 py-5 rounded-xl font-bold text-xl hover:bg-[#152238] transition-all shadow-lg hover:shadow-xl"
              >
                Get My Game Plan Now
              </Link>
            </div>

            {/* Student Image with Pointer */}
            <div className="relative mt-8 flex justify-center">
              <div className="relative w-full max-w-md">
                <Image
                  src="/images/students/latina-student-point.png"
                  alt="Student pointing to button"
                  width={600}
                  height={800}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar - Elite Schools */}
      <section className="bg-[#F9F6EF] py-8 border-t border-b border-gray-200">
        <div className="max-w-[680px] mx-auto px-4 sm:px-6">
          <p className="text-sm text-gray-600 text-center mb-5 font-medium">
            Students accepted to elite universities including:
          </p>
          <div className="overflow-hidden relative">
            <div className="flex gap-6 sm:gap-8 items-center justify-center animate-scroll flex-wrap">
              {[
                'UCLA',
                'Dartmouth',
                'NYU',
                'UT Austin',
                'UChicago',
                'Stanford',
                'Cornell',
                'Johns Hopkins',
              ].map((school, i) => (
                <div
                  key={i}
                  className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
                >
                  <span className="text-sm font-serif font-semibold text-[#1A2B49] whitespace-nowrap">
                    {school}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
