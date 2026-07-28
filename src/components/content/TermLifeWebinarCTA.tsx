'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2, Mail, PlayCircle } from 'lucide-react'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WEBINAR_URL = '/life-insurance-webinar'

type GtagFn = (
  event: 'event',
  name: string,
  params?: Record<string, unknown>,
) => void

interface Props {
  slug: string
  variant?: 'inline' | 'end'
}

export default function TermLifeWebinarCTA({ slug, variant = 'inline' }: Props) {
  const [email, setEmail] = useState('')
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
          site_id: 'parentsimple',
          source: 'article',
          source_detail: `life-insurance-webinar:${slug}`,
          quiz_bucket: 'life-insurance',
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.error || `Request failed (${res.status})`)
      }

      const gtag = (window as unknown as { gtag?: GtagFn }).gtag
      if (typeof gtag === 'function') {
        gtag('event', 'lead_capture', {
          asset: 'life-insurance-webinar',
          pillar: 'insurance',
          slot: variant === 'end' ? 'article-end' : 'article-inline',
          site: 'parentsimple',
          slug,
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
      <aside
        className="not-prose my-10 rounded-2xl border border-[#E3E0D5] bg-white p-6 md:p-8 shadow-sm"
        data-content-upgrade="life-insurance-webinar"
      >
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#9DB89D]/20 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-[#5F7F5F]" />
          </div>
          <h3 className="text-xl md:text-2xl font-serif font-semibold text-[#1A2B49]">
            You&apos;re in — watch the series now
          </h3>
          <p className="text-gray-700 max-w-md text-sm md:text-base">
            We&apos;ve emailed the link. You can start the first video right away.
          </p>
          <a
            href={WEBINAR_URL}
            className="inline-flex items-center gap-2 bg-[#1A2B49] text-white px-5 py-2.5 rounded-lg font-medium hover:bg-[#152238] transition-colors"
          >
            <PlayCircle className="w-4 h-4" />
            Watch the webinar
          </a>
        </div>
      </aside>
    )
  }

  return (
    <aside
      className="not-prose my-10 rounded-2xl border border-[#E3E0D5] bg-[#F9F6EF] p-6 md:p-8 shadow-sm"
      data-content-upgrade="life-insurance-webinar"
    >
      <div className="grid md:grid-cols-[auto_1fr] gap-5 md:gap-6 items-start">
        <div className="w-12 h-12 rounded-xl bg-[#1A2B49] flex items-center justify-center flex-shrink-0">
          <PlayCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-[#5F7F5F] uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9DB89D]" />
            Free webinar · No obligation
          </div>
          <h3 className="text-xl md:text-2xl font-serif font-semibold text-[#1A2B49] mb-2">
            Understand life insurance before you decide
          </h3>
          <p className="text-gray-700 text-sm md:text-base mb-4">
            A free plain-language video series — how the types work, what tends to fit a parent&apos;s
            situation, and what moves the price. At your pace.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" noValidate>
            <label htmlFor={`tl-email-${variant}`} className="sr-only">
              Email
            </label>
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id={`tl-email-${variant}`}
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#E3E0D5] rounded-lg focus:ring-2 focus:ring-[#1A2B49]/30 focus:border-[#1A2B49] focus:outline-none disabled:opacity-60"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#1A2B49] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#152238] transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending…
                </>
              ) : (
                'Send me the webinar'
              )}
            </button>
          </form>

          {error && (
            <div className="mt-3 text-sm text-[#B45E5E] bg-[#FBEBEB] border border-[#F1CFCF] rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <p className="text-xs text-gray-500 mt-3">
            Educational content only. Not a specific policy recommendation. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </aside>
  )
}
