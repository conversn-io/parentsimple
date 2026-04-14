'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ConfirmedContent() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')

  let icon: React.ReactNode
  let heading: string
  let message: string

  switch (status) {
    case 'already':
      icon = (
        <svg className="w-8 h-8 text-[#9DB89D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
      heading = 'Already Unsubscribed'
      message = 'You were already unsubscribed from our mailing list.'
      break

    case 'not_found':
      icon = (
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
      heading = 'Subscription Not Found'
      message = "We couldn't find your subscription. You may have already been removed from our list."
      break

    default:
      icon = (
        <svg className="w-8 h-8 text-[#9DB89D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
        </svg>
      )
      heading = "You've Been Unsubscribed"
      message = "We'll miss you. You won't receive any more emails from us."
      break
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6EF] px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-[#F9F6EF] rounded-full flex items-center justify-center">
          {icon}
        </div>

        <h1 className="text-2xl font-bold text-[#1A2B49] mb-2">
          {heading}
        </h1>
        <p className="text-gray-600 mb-8">
          {message}
        </p>

        <a
          href="/"
          className="inline-block py-3 px-6 rounded-lg bg-[#9DB89D] text-white font-semibold hover:bg-[#9DB89D]/90 transition-colors"
        >
          Resubscribe
        </a>

        <a
          href="/"
          className="block mt-4 text-sm text-gray-500 hover:text-[#1A2B49] transition-colors"
        >
          Back to ParentSimple
        </a>
      </div>
    </div>
  )
}

export default function UnsubscribeConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F9F6EF]">
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <ConfirmedContent />
    </Suspense>
  )
}
