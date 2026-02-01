import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Your Quotes Are On the Way | ParentSimple',
  description: 'Thank you for your submission. A licensed broker will reach out with your personalized life insurance quotes.',
}

export default function LifeInsuranceCAThankYouPage() {
  return (
    <div className="min-h-screen bg-[#F9F6EF] life-insurance-ca-quiz flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-[#1A2B49] mb-6" style={{ fontSize: '1.875rem', lineHeight: 1.3 }}>
          Your quotes are on the way
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          A licensed insurance broker will contact you shortly with your personalized life insurance quotes.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-[#36596A] text-white font-semibold rounded-xl hover:bg-[#2a4a5a] transition-colors shadow-lg"
        >
          Back to ParentSimple
        </Link>
      </div>
    </div>
  )
}
