'use client'

import Link from 'next/link'

/**
 * Disqualification screen for non-Ontario provinces.
 * Friendly message; built for scale so copy can later support "coming to your province/state".
 */
export function LifeInsuranceCADQScreen() {
  return (
    <div className="min-h-screen bg-[#F9F6EF] flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border border-[#E3E0D5] p-8">
        <h2 className="text-2xl font-bold text-[#1A2B49] mb-4">
          We&apos;re currently serving Ontario
        </h2>
        <p className="text-gray-600 mb-6">
          Life insurance quotes are currently available for Ontario residents. We&apos;re expanding to more provinces soon.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Check back later or visit our main site for other resources.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[#36596A] text-white font-semibold rounded-xl hover:bg-[#2a4a5a] transition-colors"
        >
          Back to ParentSimple
        </Link>
      </div>
    </div>
  )
}
