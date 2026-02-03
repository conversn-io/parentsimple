'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Users, Heart, DollarSign, Calendar, Shield, ArrowRight, Check, Sunrise, Sun, Moon, Cigarette, Ban } from 'lucide-react'
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
import { useNoHeaderLayout } from '@/hooks/useFunnelFooter'
import {
  trackQuizStart,
  trackQuizStepViewed,
  trackQuestionAnswer,
  trackEmailCapture,
  trackLeadFormSubmit,
  getSessionId as getTrackingSessionId
} from '@/lib/unified-tracking'

const STORAGE_KEY = 'life_insurance_ca_quiz_data'

type Answers = Record<string, string | { firstName: string; lastName: string; email: string; phone: string }>

export function LifeInsuranceCAQuizVariantB() {
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
  useNoHeaderLayout() // No header, funnel footer only

  useEffect(() => {
    const id = `li_ca_b_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
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
    
    // Track quiz start - mark as variant B
    trackQuizStart(id, 'life_insurance_ca_variant_b')
  }, [])

  // Clean up phone number after browser autofill
  useEffect(() => {
    if (contactPhone) {
      let digits = contactPhone.replace(/\D/g, '')
      // Remove leading 1 if it's an 11-digit number (North American format with country code)
      if (digits.startsWith('1') && digits.length === 11) {
        digits = digits.slice(1)
      }
      const cleaned = digits.slice(0, 10)
      if (cleaned !== contactPhone) {
        setContactPhone(cleaned)
      }
    }
  }, [contactPhone])

  const currentStepDef = LIFE_INSURANCE_CA_STEPS[step]
  const isProvinceStep = currentStepDef?.id === 'province'
  const isContactStep = currentStepDef?.id === 'contact_info'

  // Track step views
  useEffect(() => {
    if (sessionId && currentStepDef) {
      trackQuizStepViewed(
        step + 1,
        currentStepDef.id,
        sessionId,
        'life_insurance_ca_variant_b',
        step > 0 ? LIFE_INSURANCE_CA_STEPS[step - 1]?.id : undefined,
        TOTAL_STEPS
      )
    }
  }, [step, sessionId, currentStepDef])

  const handleProvinceSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, province: value }))
    
    // Track answer
    if (sessionId) {
      trackQuestionAnswer('province', value, 1, TOTAL_STEPS, sessionId, 'life_insurance_ca')
    }
    
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
    
    // Track answer
    if (sessionId) {
      trackQuestionAnswer(currentStepDef.id, value, step + 1, TOTAL_STEPS, sessionId, 'life_insurance_ca_variant_b')
    }
    
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

    // Track email capture
    if (sessionId) {
      trackEmailCapture(contactInfo.email, sessionId, 'life_insurance_ca')
      trackLeadFormSubmit({
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        email: contactInfo.email,
        phone: phoneE164,
        zipCode: '',
        state: '',
        stateName: '',
        quizAnswers: fullAnswers,
        sessionId: sessionId,
        funnelType: 'life_insurance_ca'
      })
    }

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
          funnelType: 'life_insurance_ca_variant_b',
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
      {/* Subtle Green Social Proof Bar - only show on step 0 */}
      {step === 0 && (
        <div className="bg-green-50 border-b border-green-100">
          <div className="max-w-2xl mx-auto px-6 py-2">
            <p className="text-center text-xs text-green-700 flex items-center justify-center gap-1.5">
              <span className="text-sm">✓</span>
              Join 250+ Ontario Parents who got quotes today
            </p>
          </div>
        </div>
      )}

      {/* Progress bar on page - not sticky, hidden on landing page */}
      {step > 0 && (
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
      )}

      <main className="max-w-2xl mx-auto px-6 py-4 pb-8 w-full min-w-0">
        {step === 0 && currentStepDef && 'options' in currentStepDef && (
          <>
            {/* H3 Headline - Variant B */}
            <h3 className="text-lg font-semibold text-center text-gray-800 mb-6 mt-2">
              Compare Insurance Quotes
            </h3>

            {/* Question Title */}
            <h2 className="text-xl font-semibold text-[#1A2B49] mb-2 text-center" style={{ fontSize: '1.25rem', lineHeight: 1.3 }}>
              {currentStepDef.title}
            </h2>
            {'subtitle' in currentStepDef && currentStepDef.subtitle && (
              <p className="text-gray-600 mb-6 text-sm text-center">{currentStepDef.subtitle}</p>
            )}

            <div className="flex flex-col gap-3 mb-6">
              {((currentStepDef.options as unknown) as { value: string; label: string }[]).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleProvinceSelect(opt.value)}
                  className={`flex items-center gap-3 rounded-xl px-5 py-3 text-left w-full min-w-0 border-2 transition-colors duration-150 ${
                    answers.province === opt.value
                      ? 'border-[#1A2B49] bg-white text-[#1A2B49] shadow-md'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-[#9DB89D]'
                  }`}
                >
                  <MapPin className={`shrink-0 ${answers.province === opt.value ? 'text-[#9DB89D]' : 'text-gray-400'}`} size={20} />
                  <span className="font-medium text-[#1A2B49] break-words">{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Trust Pills - Below Questions */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
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

            {/* Trusted Insurers Logo Scroller */}
            <div className="mb-6 overflow-hidden">
              <p className="text-center text-xs text-gray-500 mb-3">Trusted Canadian Insurers</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
                  <span className="text-xs font-semibold text-gray-600">Manulife</span>
                </div>
                <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
                  <span className="text-xs font-semibold text-gray-600">Sun Life</span>
                </div>
                <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
                  <span className="text-xs font-semibold text-gray-600">Canada Life</span>
                </div>
                <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg">
                  <span className="text-xs font-semibold text-gray-600">iA Financial</span>
                </div>
              </div>
            </div>

            {/* Happy Customers Image - Centered */}
            <div className="text-center mb-3">
              <Image
                src="/images/life-insurance-funnel/ca-social-proof-h7iBv84u.webp"
                alt="Happy customers"
                width={48}
                height={48}
                className="rounded-full mx-auto"
              />
            </div>

            {/* Join 40,000 Canadians */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600">
                Join 40,000 Canadians who found coverage with us
              </p>
            </div>

            {/* Michael T. Testimonial */}
            <div className="bg-white rounded-xl p-6 border border-[#E3E0D5] shadow-sm mb-6">
              <div className="flex gap-4 items-start">
                <Image
                  src="/images/life-insurance-funnel/testimonial-guy.jpg"
                  alt="Michael T."
                  width={64}
                  height={64}
                  className="rounded-full flex-shrink-0 object-cover"
                />
                <div className="flex-1">
                  <p className="text-gray-700 text-sm italic mb-2">
                    "Found coverage in minutes! The process was so simple and I got quotes from multiple insurers. Best decision for my family's security."
                  </p>
                  <p className="text-xs text-gray-500">— Michael T., Ontario</p>
                </div>
              </div>
            </div>

            {/* Scroll to Top Button */}
            <div className="text-center mb-6">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A2B49] text-white rounded-lg hover:bg-[#2A3B59] transition-colors duration-200"
              >
                <ArrowRight className="rotate-[-90deg]" size={18} />
                Back to Top
              </button>
            </div>

            {/* About ParentSimple */}
            <div className="bg-white rounded-xl p-6 border border-[#E3E0D5] shadow-sm mb-6">
              <h4 className="text-sm font-semibold text-[#1A2B49] mb-2">About ParentSimple</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                ParentSimple is part of the Simple Media Network. We offer trusted resources to parents, preparing them for every aspect of their journey—from education planning to financial security. We don't sell insurance directly; instead, we partner with the best providers in every area to help you make informed decisions and find the right coverage for your family.
              </p>
            </div>
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
              <p className="text-gray-600 mb-4 text-sm">{currentStepDef.subtitle}</p>
            )}
            <div className="flex flex-col gap-3">
              {((currentStepDef.options as unknown) as { value: string; label: string; sublabel?: string }[]).map((opt) => {
                const getIcon = () => {
                  // Purpose icons
                  if (currentStepDef.id === 'purpose') {
                    if (opt.value === 'protect_family') return <Heart className="text-red-500 shrink-0" size={20} />
                    if (opt.value === 'cover_mortgage') return <Shield className="text-blue-500 shrink-0" size={20} />
                    if (opt.value === 'final_expenses') return <DollarSign className="text-green-500 shrink-0" size={20} />
                    if (opt.value === 'legacy') return <Users className="text-purple-500 shrink-0" size={20} />
                    return <Check className="text-gray-400 shrink-0" size={20} />
                  }
                  // Coverage icons
                  if (currentStepDef.id === 'coverage') return <DollarSign className="text-green-600 shrink-0" size={20} />
                  // Age range icons
                  if (currentStepDef.id === 'age_range') return <Calendar className="text-blue-500 shrink-0" size={20} />
                  // Gender icons - use symbols
                  if (currentStepDef.id === 'gender') {
                    if (opt.value === 'male') return <span className="text-blue-500 shrink-0 text-xl font-bold">♂</span>
                    if (opt.value === 'female') return <span className="text-pink-500 shrink-0 text-xl font-bold">♀</span>
                    return <Users className="text-indigo-500 shrink-0" size={20} />
                  }
                  // Best time icons - specific for each time
                  if (currentStepDef.id === 'best_time') {
                    if (opt.value === 'morning') return <Sunrise className="text-orange-400 shrink-0" size={20} />
                    if (opt.value === 'afternoon') return <Sun className="text-yellow-500 shrink-0" size={20} />
                    if (opt.value === 'evening') return <Moon className="text-indigo-500 shrink-0" size={20} />
                    if (opt.value === 'anytime') return <Calendar className="text-gray-500 shrink-0" size={20} />
                    return <Calendar className="text-orange-500 shrink-0" size={20} />
                  }
                  // Smoker icons - no smoking sign for "no"
                  if (currentStepDef.id === 'smoker') {
                    return opt.value === 'yes' ? 
                      <Cigarette className="text-gray-500 shrink-0" size={20} /> : 
                      <div className="relative shrink-0">
                        <Ban className="text-red-500" size={20} />
                      </div>
                  }
                  return null
                }
                
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleMultipleChoice(opt.value)}
                    className={`w-full flex items-center gap-3 rounded-xl px-5 py-4 text-left min-w-0 border-2 transition-colors duration-150 ${
                      answers[currentStepDef.id] === opt.value
                        ? 'border-[#1A2B49] bg-white text-[#1A2B49] shadow-md'
                        : 'border-gray-300 bg-white hover:border-[#9DB89D] text-gray-700'
                    }`}
                  >
                    {getIcon()}
                    {opt.sublabel ? (
                      <span className="text-gray-900 font-medium min-w-0 flex-1">
                        <span className="block">{opt.label}</span>
                        <span className="block text-sm font-normal text-gray-500">{opt.sublabel}</span>
                      </span>
                    ) : (
                      <span className="text-gray-900 break-words flex-1">{opt.label}</span>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="mt-8 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="text-gray-500 text-sm hover:underline transition-colors duration-150"
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
            
            {/* Full-width notification bar */}
            <div className="bg-green-50 border-l-4 border-green-500 px-6 py-3 mb-4 -mx-6">
              <p className="text-base font-semibold text-green-700 flex items-center justify-center gap-2">
                <span className="text-xl">🎉</span>
                Great! You&apos;re Matched with 13+ Insurers
              </p>
            </div>

            <h1 className="text-2xl font-bold text-[#1A2B49] mb-2 text-center" style={{ fontSize: '1.5rem', lineHeight: 1.3 }}>
              Where should we send your free quote?
            </h1>

            {/* Social proof below headline */}
            <p className="text-xs text-gray-500 text-center mb-4">
              <span className="font-semibold text-[#1A2B49]">2,847</span> quotes sent this week
            </p>
            <form onSubmit={handleContactSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input
                    type="text"
                    name="given-name"
                    autoComplete="given-name"
                    value={contactFirstName}
                    onChange={(e) => setContactFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#36596A]/30 focus:border-[#36596A] bg-white transition-colors"
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input
                    type="text"
                    name="family-name"
                    autoComplete="family-name"
                    value={contactLastName}
                    onChange={(e) => setContactLastName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#36596A]/30 focus:border-[#36596A] bg-white transition-colors"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#36596A]/30 focus:border-[#36596A] bg-white transition-colors"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile number</label>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  value={formatPhoneForInput(contactPhone)}
                  onInput={(e) => {
                    // Strip all non-digits and any leading country code
                    const target = e.target as HTMLInputElement
                    let digits = target.value.replace(/\D/g, '')
                    // Remove leading 1 or +1 from autofill
                    if (digits.startsWith('1')) {
                      digits = digits.slice(1)
                    }
                    setContactPhone(digits.slice(0, 10))
                  }}
                  onChange={(e) => {
                    // Backup handler for onChange events
                    let digits = e.target.value.replace(/\D/g, '')
                    if (digits.startsWith('1')) {
                      digits = digits.slice(1)
                    }
                    setContactPhone(digits.slice(0, 10))
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#36596A]/30 focus:border-[#36596A] bg-white transition-colors"
                  placeholder="(XXX) XXX-XXXX"
                  inputMode="numeric"
                  required
                />
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span>🔒</span> We&apos;ll send a verification code to this number
                </p>
              </div>

              {contactError && (
                <p className="text-sm text-red-600">{contactError}</p>
              )}

              {/* Primary CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#36596A] text-white font-bold py-4 px-6 rounded-xl hover:bg-[#2a4a5a] transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  'Processing...'
                ) : (
                  <>
                    Get My Quote
                    <ArrowRight className="inline-block" size={20} />
                  </>
                )}
              </button>

              {/* TCPA Compliance */}
              <p className="text-xs text-gray-600 leading-relaxed">
                By clicking &quot;Get My Quote&quot; you agree to receive communication from a licensed insurance broker via phone, email, SMS for the purpose of distributing and administering insurance. You may withdraw your consent at any time and you also agree to the{' '}
                <Link href="/terms-of-service" className="text-[#36596A] hover:underline transition-colors duration-150">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy-policy" className="text-[#36596A] hover:underline transition-colors duration-150">Privacy Policy</Link>.
              </p>

              {/* Back Button */}
              <button
                type="button"
                onClick={handleBack}
                className="block w-full text-center text-gray-500 text-sm hover:underline transition-colors duration-150"
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
        <footer className="border-t border-[#E3E0D5] py-4 px-6" style={{ background: 'transparent' }}>
          <div className="max-w-2xl mx-auto">
            <p className="text-xs text-gray-500 text-center mb-3">We work with trusted Canadian insurers</p>
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
