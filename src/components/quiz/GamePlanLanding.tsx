'use client'

import Link from 'next/link'
import Image from 'next/image'
import { GraduationCap, Check, ArrowRight, Users, UserCircle, MessageCircle } from 'lucide-react'

const GAME_PLAN_START_URL = '/gameplan?start=1'

export function GamePlanLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - logo only */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Hero */}
      <section className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2B49] flex items-center gap-3">
              <GraduationCap className="w-10 h-10 sm:w-12 sm:h-12 text-[#1A2B49] flex-shrink-0" />
              Claim Your Free Elite Admissions Game Plan
            </h1>
            <p className="text-lg text-gray-700">
              Includes a personalized Readiness Score and a private 1-on-1 call with a former admissions officer.
            </p>
            <Link
              href={GAME_PLAN_START_URL}
              className="inline-flex items-center justify-center w-full sm:w-auto bg-[#1A2B49] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#152238] transition-all shadow-lg hover:shadow-xl"
            >
              Get My Game Plan Now
            </Link>
            <p className="text-sm text-gray-500 pt-2">
              Trusted by Harvard · Td Trunch · Entrepreneur
            </p>
          </div>
          <div className="lg:col-span-3 relative">
            <div className="aspect-[4/3] lg:aspect-[16/10] relative rounded-2xl overflow-hidden bg-[#F9F6EF]">
              <Image
                src="/images/topics/young-students-visit-school.jpeg"
                alt="Student on path to college"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-[#F9F6EF] py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2B49] mb-10">
            What&apos;s Included in Your Elite Admissions Game Plan?
          </h2>
          <ul className="grid sm:grid-cols-2 gap-6">
            {[
              'Your Elite University Readiness Score',
              'Expert Analysis of Your Child\'s Admissions Profile',
              '1-on-1 Guidance from a Former Admissions Officer',
              'Standout extracurricular narratives',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-lg text-gray-800">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why A Readiness (beige box) */}
      <section className="py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2B49] mb-6">
            Why A Readiness in Your Elite Admissions Game Plan:
          </h2>
          <div className="bg-[#F9F6EF] border border-[#E3E0D5] rounded-2xl p-8 max-w-3xl">
            <p className="text-lg text-gray-700">
              Admissions today are more competitive than ever — top universities now expect more than great grades or test scores. You need:
            </p>
          </div>
        </div>
      </section>

      {/* Why A Readiness Score Alone */}
      <section className="py-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2B49] mb-6">
            Why A Readiness Score Alone Isn&apos;t Enough
          </h2>
          <p className="text-lg text-gray-700 flex items-center gap-2 max-w-3xl">
            Admissions today are more competitive than ever — top universities now expect more than great grades or test scores. You need:
            <ArrowRight className="w-6 h-6 text-[#1A2B49] flex-shrink-0" />
          </p>
        </div>
      </section>

      {/* Your Next Step - CTA + benefits + social proof */}
      <section className="bg-[#F9F6EF] py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2B49] mb-10">
            Your Next Step: Claim Your Free Elite Admissions Game Plan
          </h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-4">Fill out the short quiz to:</p>
              <ul className="space-y-3">
                {[
                  'Get your personalized Elite Readiness Score',
                  'Receive a free strategy session to increase acceptance odds',
                  'And discover the best path to your student\'s dream school',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <span className="text-gray-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#E3E0D5] shadow-sm">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Used by 25,000+ families planning for college</span>
                </li>
                <li className="flex items-start gap-3">
                  <UserCircle className="w-6 h-6 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Backed by former admissions officers & top college counselors</span>
                </li>
                <li className="flex items-start gap-3">
                  <MessageCircle className="w-6 h-6 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Trusted partner of ParentSimple</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 text-center">
            <Link
              href={GAME_PLAN_START_URL}
              className="inline-flex items-center justify-center bg-[#1A2B49] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#152238] transition-all shadow-lg hover:shadow-xl"
            >
              Get My Game Plan Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
