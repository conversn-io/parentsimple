'use client'

import { useState } from 'react'
import { CheckCircle2, Download, Loader2, Mail } from 'lucide-react'

const PDF_URL =
  'https://vpysqshhafthuxvokwqj.supabase.co/storage/v1/object/public/lead-magnets/parentsimple/education/college-funding-guide.pdf'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type GtagFn = (
  event: 'event',
  name: string,
  params?: Record<string, unknown>,
) => void

export default function GuideGate() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const normalized = email.trim().toLowerCase()
    if (!EMAIL_RE.test(normalized)) {
      setError('Please enter a valid email address.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: normalized,
          first_name: firstName.trim() || undefined,
          site_id: 'parentsimple',
          source: 'guide-upgrade',
          source_detail: 'education-college-funding-guide:landing',
          quiz_bucket: 'college',
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || `Request failed (${res.status})`)
      }

      const gtag = (window as unknown as { gtag?: GtagFn }).gtag
      if (typeof gtag === 'function') {
        gtag('event', 'lead_capture', {
          asset: 'college-funding-guide',
          pillar: 'education',
          slot: 'guide-upgrade',
          site: 'parentsimple',
        })
      }

      setSuccess(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-[#E3E0D5] p-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#9DB89D]/20 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-[#5F7F5F]" />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#1A2B49]">
            Your guide is ready
          </h2>
          <p className="text-gray-700 max-w-md">
            We&apos;ve sent a copy to your inbox. You can also download it right now below.
          </p>
          <a
            href={PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1A2B49] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#152238] transition-colors"
          >
            <Download className="w-5 h-5" />
            Download the College Funding Guide
          </a>
          <p className="text-xs text-gray-500 max-w-md mt-2">
            Educational content only. Not investment, tax, or legal advice.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-[#E3E0D5] p-6 md:p-8">
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-[#9DB89D] uppercase mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9DB89D]" />
          Free guide · No obligation
        </div>
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-[#1A2B49]">
          Get Free College Guide
        </h2>
        <p className="text-gray-700 mt-2">
          A clear plan for saving toward your child&apos;s education — sent to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="guide-first-name"
            className="block text-sm font-medium text-[#1A2B49] mb-1.5"
          >
            First name <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="guide-first-name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={submitting}
            className="w-full px-4 py-3 border border-[#E3E0D5] rounded-lg focus:ring-2 focus:ring-[#1A2B49]/30 focus:border-[#1A2B49] focus:outline-none disabled:opacity-60"
            placeholder="Your first name"
          />
        </div>

        <div>
          <label
            htmlFor="guide-email"
            className="block text-sm font-medium text-[#1A2B49] mb-1.5"
          >
            Email <span className="text-[#B45E5E]">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="guide-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className="w-full pl-10 pr-4 py-3 border border-[#E3E0D5] rounded-lg focus:ring-2 focus:ring-[#1A2B49]/30 focus:border-[#1A2B49] focus:outline-none disabled:opacity-60"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {error && (
          <div className="text-sm text-[#B45E5E] bg-[#FBEBEB] border border-[#F1CFCF] rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-[#1A2B49] text-white px-6 py-3.5 rounded-lg font-semibold hover:bg-[#152238] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending…
            </>
          ) : (
            'Get Free College Guide'
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          We&apos;ll email your guide and occasional education planning tips. Unsubscribe anytime.
        </p>
      </form>
    </div>
  )
}
