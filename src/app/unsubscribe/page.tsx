'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

function UnsubscribeForm() {
  const searchParams = useSearchParams()
  const sid = searchParams.get('sid')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!sid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F6EF] px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
          <h1 className="text-2xl font-bold text-[#1A2B49] mb-4">
            Invalid Link
          </h1>
          <p className="text-gray-600">
            This unsubscribe link appears to be invalid. Please check your email
            for the correct link.
          </p>
        </div>
      </div>
    )
  }

  async function handleUnsubscribe() {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriber_id: sid }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to unsubscribe')
      }

      window.location.href = '/unsubscribe/confirmed'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F6EF] px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-[#F9F6EF] rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-[#1A2B49]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-[#1A2B49] mb-2">
          Unsubscribe from ParentSimple?
        </h1>
        <p className="text-gray-600 mb-8">
          You&apos;ll stop receiving our newsletter and updates. You can
          always resubscribe later.
        </p>

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleUnsubscribe}
          disabled={loading}
          className="w-full py-3 px-6 rounded-lg bg-[#1A2B49] text-white font-semibold hover:bg-[#1A2B49]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Yes, Unsubscribe Me'}
        </button>

        <a
          href="/"
          className="block mt-4 text-sm text-[#9DB89D] hover:text-[#1A2B49] transition-colors"
        >
          Never mind, keep me subscribed
        </a>
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F9F6EF]">
          <p className="text-gray-500">Loading...</p>
        </div>
      }
    >
      <UnsubscribeForm />
    </Suspense>
  )
}
