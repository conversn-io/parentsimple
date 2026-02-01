'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  LIFE_INSURANCE_CA_STEPS,
  TOTAL_STEPS,
  ONTARIO_REGION_CODE,
} from '@/data/life-insurance-ca-questions'
import { LifeInsuranceCADQScreen } from './LifeInsuranceCADQScreen'
import { formatPhoneForInput } from '@/utils/phone-utils'
import { getMetaCookies } from '@/lib/meta-capi-cookies'
import { useTrustedForm, getTrustedFormCertUrl, getLeadIdToken } from '@/hooks/useTrustedForm'
import { extractUTMParameters, storeUTMParameters, getStoredUTMParameters, hasUTMParameters, type UTMParameters } from '@/utils/utm-utils'

const STORAGE_KEY = 'life_insurance_ca_quiz_data'

type Answers = Record<string, string | { firstName: string; lastName: string; email: string; phone: string }>

export function LifeInsuranceCAQuiz() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isDQ, setIsDQ] = useState(false)
  const [utmParams, setUtmParams] = useState<UTMParameters | null>(null)
  const [contactFirstName, setContactFirstName] = useState('')
  const [contactLastName, setContactLastName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactError, setContactError] = useState('')

  useTrustedForm({ enabled: true })

  useEffect(() => {
    const id = `li_ca_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    setSessionId(id)
    const stored = getStoredUTMParameters()
    if (stored) setUtmParams(stored)
    else {
      const utm = extractUTMParameters()
      if (hasUTMParameters(utm)) {
        storeUTMParameters(utm)
        setUtmParams(utm)
      }
    }
  }, [])

  const currentStepDef = LIFE_INSURANCE_CA_STEPS[step]
  const isProvinceStep = currentStepDef?.id === 'province'
  const isContactStep = currentStepDef?.id === 'contact_info'

  const handleProvinceSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, province: value }))
    const regionCode = value
    if (regionCode !== ONTARIO_REGION_CODE) {
      setIsDQ(true)
    } else {
      setStep(1)
    }
  }

  const handleMultipleChoice = (value: string) => {
    if (!currentStepDef) return
    setAnswers((prev) => ({ ...prev, [currentStepDef.id]: value }))
    if (step < TOTAL_STEPS - 1) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactError('')
    const phone = contactPhone.replace(/\D/g, '').slice(0, 10)
    if (!contactFirstName?.trim() || !contactLastName?.trim() || !contactEmail?.trim() || phone.length < 10) {
      setContactError('Please fill in all required fields with a valid 10-digit phone number.')
      return
    }
    setIsSubmitting(true)

    const phoneE164 = `+1${phone}`
    const contactInfo = {
      firstName: contactFirstName.trim(),
      lastName: contactLastName.trim(),
      email: contactEmail.trim().toLowerCase(),
      phone: phoneE164,
    }
    const fullAnswers = { ...answers, contact_info: contactInfo }

    try {
      const metaCookies = getMetaCookies()
      const fbLoginId =
        typeof window !== 'undefined' && (window as any).FB?.getAuthResponse?.()?.userID
          ? (window as any).FB.getAuthResponse().userID
          : null

      const captureRes = await fetch('/api/leads/capture-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: contactInfo.email,
          firstName: contactInfo.firstName,
          lastName: contactInfo.lastName,
          phoneNumber: phoneE164,
          quizAnswers: fullAnswers,
          sessionId: sessionId || 'unknown',
          funnelType: 'life_insurance_ca',
          zipCode: null,
          state: null,
          stateName: null,
          licensingInfo: null,
          calculatedResults: null,
          utmParams: utmParams,
          trustedFormCertUrl: getTrustedFormCertUrl() || null,
          trustedform_cert_url: getTrustedFormCertUrl() || null,
          jornayaLeadId: getLeadIdToken() || null,
          jornaya_lead_id: getLeadIdToken() || null,
          metaCookies: { fbp: metaCookies.fbp, fbc: metaCookies.fbc, fbLoginId },
        }),
      })

      const captureData = await captureRes.json()
      if (!captureRes.ok) {
        setContactError(captureData?.error || 'Something went wrong. Please try again.')
        setIsSubmitting(false)
        return
      }

      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            answers: fullAnswers,
            calculatedResults: null,
            quizSessionId: sessionId,
            utmParams: utmParams,
            trustedFormCertUrl: getTrustedFormCertUrl() || null,
            jornayaLeadId: getLeadIdToken() || null,
          })
        )
      }
      router.push('/quiz/life-insurance-ca/verify-otp')
    } catch (err) {
      setContactError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (isDQ) return <LifeInsuranceCADQScreen />

  return (
    <div className="min-h-screen bg-[#F9F6EF] life-insurance-ca-quiz">
      {/* Yellow Alert Bar - only show on step 0 */}
      {step === 0 && (
        <div className="bg-[#F4D03F] border-b border-[#F1C40F]">
          <div className="max-w-2xl mx-auto px-6 py-3">
            <p className="text-center text-sm font-semibold text-[#1A2B49] flex items-center justify-center gap-2">
              <span className="text-lg">⏰</span>
              Join 25,000 Ontario Parents Who Just Got Covered Today
            </p>
          </div>
        </div>
      )}

      {/* Progress bar on page - not sticky */}
      <div className="bg-[#F9F6EF] border-b border-[#E3E0D5]">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <p className="text-sm text-gray-600 mb-3 text-center whitespace-nowrap" aria-live="polite">
            Step {step + 1} of {TOTAL_STEPS}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-[#1A2B49] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-8 pb-16 w-full min-w-0">
        {step === 0 && currentStepDef && 'options' in currentStepDef && (
          <>
            {/* Main Headline */}
            <h1 className="text-3xl font-bold text-[#1A2B49] mb-3 text-center" style={{ fontSize: '2rem', lineHeight: 1.2 }}>
              Protect Your Family&apos;s Future with up to $2M in Life Insurance
            </h1>

            {/* Subheadline */}
            <p className="text-gray-700 mb-4 text-center text-base leading-relaxed">
              Get coverage for less than a cup of coffee a day — check your eligibility in under 60 seconds.
            </p>

            {/* Trust Pills - under subheadline */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-sm text-gray-700">No Health Exam</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-sm text-gray-700">Low Monthly Premiums</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-sm text-gray-700">Best Approvals</span>
              </div>
            </div>

            {/* Question Title */}
            <h2 className="text-xl font-semibold text-[#1A2B49] mb-2 text-center" style={{ fontSize: '1.25rem', lineHeight: 1.3 }}>
              {currentStepDef.title}
            </h2>
            {'subtitle' in currentStepDef && currentStepDef.subtitle && (
              <p className="text-gray-600 mb-6 text-sm text-center">{currentStepDef.subtitle}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {((currentStepDef.options as unknown) as { value: string; label: string }[]).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleProvinceSelect(opt.value)}
                  className={`flex items-center gap-3 rounded-xl border-2 px-5 py-4 text-left transition-all w-full min-w-0 ${
                    answers.province === opt.value
                      ? 'border-[#1A2B49] bg-white text-[#1A2B49] shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-[#9DB89D]'
                  }`}
                >
                  <span className="text-[#9DB89D] shrink-0" aria-hidden>📍</span>
                  <span className="font-medium text-[#1A2B49] break-words">{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Testimonial Section */}
            <div className="bg-white rounded-xl p-6 border border-[#E3E0D5] shadow-sm mb-6">
              <div className="flex gap-4 items-start">
                <Image
                  src="/images/life-insurance-funnel/ca-social-proof-h7iBv84u.webp"
                  alt="Sarah M."
                  width={64}
                  height={64}
                  className="rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm italic mb-2">
                    "Found coverage in minutes! The process was so simple and I got quotes from multiple insurers. Best decision for my family's security."
                  </p>
                  <p className="text-xs text-gray-500">— Sarah M., Ontario</p>
                </div>
              </div>
            </div>

            {/* Social Proof Statement */}
            <p className="text-center text-sm text-gray-600">
              Over <span className="font-bold text-[#1A2B49]">12,500</span> Canadians have found life insurance coverage
            </p>
          </>
        )}

        {step >= 1 && !isContactStep && currentStepDef && currentStepDef.type === 'multiple-choice' && (
          <>
            {step === 6 && (
              <p className="text-sm text-gray-500 mb-2 text-center">Almost there! 🎉</p>
            )}
            <h1 className="text-2xl font-bold text-[#1A2B49] mb-2" style={{ fontSize: '1.5rem', lineHeight: 1.3 }}>
              {currentStepDef.title}
            </h1>
            {'subtitle' in currentStepDef && currentStepDef.subtitle && (
              <p className="text-gray-600 mb-6 text-sm">{currentStepDef.subtitle}</p>
            )}
            <div className="flex flex-col gap-4">
              {((currentStepDef.options as unknown) as { value: string; label: string; sublabel?: string }[]).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleMultipleChoice(opt.value)}
                  className={`w-full flex items-center gap-3 rounded-xl border-2 px-5 py-4 text-left transition-all min-w-0 ${
                    answers[currentStepDef.id] === opt.value
                      ? 'border-[#1A2B49] bg-white text-[#1A2B49] shadow-md'
                      : 'border-gray-200 bg-white hover:border-[#9DB89D] text-gray-700'
                  }`}
                >
                  {opt.sublabel ? (
                    <span className="text-gray-900 font-medium min-w-0">
                      <span className="block">{opt.label}</span>
                      <span className="block text-sm font-normal text-gray-500">{opt.sublabel}</span>
                    </span>
                  ) : (
                    <span className="text-gray-900 break-words">{opt.label}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="text-gray-500 text-sm hover:underline"
              >
                ← Back
              </button>
            </div>
          </>
        )}

        {isContactStep && (
          <>
            <input type="hidden" name="xxTrustedFormCertUrl" id="xxTrustedFormCertUrl" />
            <input type="hidden" name="leadid_token" id="leadid_token" />
            
            {/* Exciting match notification */}
            <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 mb-6 text-center">
              <p className="text-lg font-bold text-green-700 flex items-center justify-center gap-2">
                <span className="text-2xl">🎉</span>
                Great! You&apos;re Matched with 13+ Insurers
                <span className="text-2xl">🎉</span>
              </p>
            </div>

            <h1 className="text-2xl font-bold text-[#1A2B49] mb-6 text-center" style={{ fontSize: '1.5rem', lineHeight: 1.3 }}>
              Where should we send your free quote?
            </h1>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input
                    type="text"
                    value={contactFirstName}
                    onChange={(e) => setContactFirstName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#36596A]/20 focus:border-[#36596A] bg-white transition-colors"
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input
                    type="text"
                    value={contactLastName}
                    onChange={(e) => setContactLastName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#36596A]/20 focus:border-[#36596A] bg-white transition-colors"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#36596A]/20 focus:border-[#36596A] bg-white transition-colors"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 py-3 border-2 border-gray-300 rounded-xl bg-gray-50 text-gray-600 text-sm">
                    +1
                  </span>
                  <input
                    type="tel"
                    value={formatPhoneForInput(contactPhone)}
                    onChange={(e) => {
                      const d = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setContactPhone(d)
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#36596A]/20 focus:border-[#36596A] bg-white transition-colors"
                    placeholder="(XXX) XXX-XXXX"
                    inputMode="numeric"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span>🔒</span> We&apos;ll send a verification code to this number
                </p>
              </div>

              {contactError && (
                <p className="text-sm text-red-600">{contactError}</p>
              )}

              {/* Submit Now Reinforcement Box */}
              <div className="bg-white border-2 border-[#36596A] rounded-xl p-4 text-center">
                <p className="text-sm font-semibold text-[#1A2B49]">
                  ✅ Your Personalized Quotes Are Ready
                </p>
              </div>

              {/* Primary CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#36596A] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#2a4a5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg"
              >
                {isSubmitting ? 'Processing...' : 'Get My Quote →'}
              </button>

              {/* TCPA Compliance */}
              <p className="text-xs text-gray-600 leading-relaxed">
                By clicking &quot;Get My Quote&quot; you agree to receive communication from a licensed insurance broker via phone, email, SMS for the purpose of distributing and administering insurance. You may withdraw your consent at any time and you also agree to the{' '}
                <Link href="/terms-of-service" className="text-[#36596A] hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy-policy" className="text-[#36596A] hover:underline">Privacy Policy</Link>.
              </p>

              {/* Social Proof */}
              <div className="bg-[#F9F6EF] rounded-lg p-4 text-center border border-[#E3E0D5]">
                <p className="text-sm text-gray-700">
                  <span className="font-bold text-[#1A2B49]">2,847 quotes</span> sent this week
                </p>
              </div>
              <button
                type="button"
                onClick={handleBack}
                className="block w-full text-center text-gray-500 text-sm hover:underline"
              >
                ← Back
              </button>
            </form>
          </>
        )}
      </main>

      {/* Trust badges */}
      {/* Footer with scrolling logos - only on step 0 */}
      {step === 0 && (
        <footer className="border-t border-[#E3E0D5] py-8 px-6" style={{ background: 'transparent' }}>
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-gray-500 text-center mb-6">We work with trusted Canadian insurers</p>
            <div className="overflow-hidden relative">
              <div className="flex gap-8 items-center animate-scroll">
                {[1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7].map((num, idx) => (
                  <Image
                    key={idx}
                    src={`/images/life-insurance-funnel/ca-insurer-${num}-${
                      num === 1 ? 'DC2UE-tE' : num === 2 ? 'DOKRi4v2' : num === 3 ? '94FxSc0I' : 
                      num === 4 ? '2031J7uc' : num === 5 ? 'C9-fYJNs' : num === 6 ? 'OZ8ZO6bq' : 'DNAUUnB8'
                    }.png`}
                    alt={`Insurer ${num}`}
                    width={100}
                    height={40}
                    className="h-10 w-auto object-contain flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                  />
                ))}
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
