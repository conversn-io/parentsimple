'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Check, Users, UserCircle, MessageCircle } from 'lucide-react'

const GAME_PLAN_START_URL = '/gameplan?start=1'

export function GamePlanLanding() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - logo only */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
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

      {/* Hero Section with Floating Student */}
      <section className="relative bg-white py-12 lg:py-16 overflow-visible pb-0 max-w-[1550px] mx-auto">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          <div className="relative text-center space-y-6 pb-16 md:pb-0">
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1A2B49] leading-tight">
              Claim Your Free Elite Admissions Game Plan
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Includes a personalized Readiness Score and a private 1-on-1 call with a former admissions officer.
            </p>

            {/* CTA Button */}
            <div className="pt-4 relative z-10">
              <Link
                href={GAME_PLAN_START_URL}
                className="inline-flex items-center justify-center w-full sm:w-auto bg-[#1A2B49] text-white px-12 py-5 rounded-xl font-bold text-xl hover:bg-[#152238] transition-all shadow-lg hover:shadow-xl"
              >
                Get My Game Plan Now
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Student Image - Positioned to align bottom with section edge/trust bar */}
        <div className="absolute right-8 lg:right-16 xl:right-24 bottom-0 w-[280px] sm:w-[320px] lg:w-[380px] xl:w-[420px] pointer-events-none hidden md:block">
          <Image
            src="/images/students/latina-student-point.png"
            alt="Student pointing to button"
            width={600}
            height={800}
            className="w-full h-auto"
            priority
          />
        </div>
      </section>

      {/* Trust Bar - Elite Schools Scrolling Marquee */}
      <section className="bg-transparent py-8 border-t border-b border-gray-200">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          <p className="text-sm text-gray-600 text-center mb-6 font-medium">
            Students accepted to elite universities including:
          </p>
          <div className="overflow-hidden relative">
            <div className="flex gap-12 items-center animate-scroll">
              {/* First set of logos */}
              <Image
                src="/images/elite-schools/berkeley-logo.png"
                alt="UC Berkeley"
                width={140}
                height={50}
                className="h-10 w-auto object-contain flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/images/elite-schools/ucla-logo.png"
                alt="UCLA"
                width={100}
                height={50}
                className="h-10 w-auto object-contain flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/images/elite-schools/cornell-logo.png"
                alt="Cornell University"
                width={140}
                height={50}
                className="h-10 w-auto object-contain flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/images/elite-schools/uchicago-logo.png"
                alt="University of Chicago"
                width={160}
                height={50}
                className="h-10 w-auto object-contain flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/images/elite-schools/stanford-logo.png"
                alt="Stanford University"
                width={120}
                height={50}
                className="h-10 w-auto object-contain flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/images/elite-schools/ut-austin-logo.png"
                alt="UT Austin"
                width={140}
                height={50}
                className="h-10 w-auto object-contain flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/images/elite-schools/nyu-logo.png"
                alt="New York University"
                width={160}
                height={50}
                className="h-10 w-auto object-contain flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              />
              {/* Duplicate set for seamless scrolling */}
              <Image
                src="/images/elite-schools/berkeley-logo.png"
                alt="UC Berkeley"
                width={140}
                height={50}
                className="h-10 w-auto object-contain flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/images/elite-schools/ucla-logo.png"
                alt="UCLA"
                width={100}
                height={50}
                className="h-10 w-auto object-contain flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/images/elite-schools/cornell-logo.png"
                alt="Cornell University"
                width={140}
                height={50}
                className="h-10 w-auto object-contain flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/images/elite-schools/uchicago-logo.png"
                alt="University of Chicago"
                width={160}
                height={50}
                className="h-10 w-auto object-contain flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/images/elite-schools/stanford-logo.png"
                alt="Stanford University"
                width={120}
                height={50}
                className="h-10 w-auto object-contain flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/images/elite-schools/ut-austin-logo.png"
                alt="UT Austin"
                width={140}
                height={50}
                className="h-10 w-auto object-contain flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              />
              <Image
                src="/images/elite-schools/nyu-logo.png"
                alt="New York University"
                width={160}
                height={50}
                className="h-10 w-auto object-contain flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's Included - 60% width centered */}
      <section className="bg-[#F9F6EF] py-16">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6">
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

      {/* Why A Readiness (beige box) - 60% width centered */}
      <section className="py-16">
        <div className="max-w-[600px] mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2B49] mb-6">
            Why A Readiness in Your Elite Admissions Game Plan:
          </h2>
          <div className="bg-[#F9F6EF] border border-[#E3E0D5] rounded-2xl p-8">
            <p className="text-lg text-gray-700">
              Admissions today are more competitive than ever — top universities now expect more than great grades or test scores. You need:
            </p>
          </div>
        </div>
      </section>

      {/* Why A Readiness Score Alone - 60% width centered */}
      <section className="py-16">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2B49] mb-6">
            Why a Readiness Score Alone Isn&apos;t Enough
          </h2>
          <p className="text-lg font-semibold text-gray-800 mb-6">You Need:</p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-900">Expert Interpretation</span>
                <span className="text-gray-700"> – Know what your student's score actually means at top schools, from real admissions pros.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-900">Gap Analysis</span>
                <span className="text-gray-700"> – Uncover hidden weaknesses (or missed strengths) that could make or break an application.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-900">Tailored Action Plan</span>
                <span className="text-gray-700"> – Get a step-by-step strategy to boost competitiveness before deadlines hit.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-900">School Targeting Guidance</span>
                <span className="text-gray-700"> – Align your student's profile with the right reach, match, and safety schools.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-gray-900">Insider Insights</span>
                <span className="text-gray-700"> – Understand what matters most post-DEI, from essays to extracurricular positioning.</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Your Next Step - CTA + benefits + social proof - 60% width centered */}
      <section className="bg-[#F9F6EF] py-16">
        <div className="max-w-[700px] mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2B49] mb-10">
            Your Next Step: Claim Your Free Elite Admissions Game Plan
          </h2>
          <div className="space-y-10">
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
