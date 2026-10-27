'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  LIFE_INSURANCE_MP_STEPS,
  MORTGAGE_BALANCE_TO_COVERAGE,
} from '@/data/life-insurance-mp-questions'
import { formatPhoneForInput } from '@/utils/phone-utils'
import { validatePhoneAPI, validatePhoneFormat } from '@/utils/phone-validation'
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
} from '@/lib/unified-tracking'
import StatePickerStep, { type SelectedState } from './StatePickerStep'

const STORAGE_KEY = 'life_insurance_us_quiz_data'
const FUNNEL_TYPE = 'life_insurance_us'
const VARIANT = 'mp'

type Answers = Record<string, string | { firstName: string; lastName: string; email: string; phone: string }>

type StepDef = (typeof LIFE_INSURANCE_MP_STEPS)[number] & {
  conditional?: (answers: Record<string, string>) => boolean
}

export function LifeInsuranceMPQuiz() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [utmParams, setUtmParams] = useState<UTMParameters | null>(null)
  const [contactFirstName, setContactFirstName] = useState('')
  const [contactLastName, setContactLastName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactError, setContactError] = useState('')
  const [phoneError, setPhoneError] = useState<string | null>(null)
  const [phoneValidating, setPhoneValidating] = useState(false)
  const initiateCheckoutFiredRef = useRef(false)

  useTrustedForm({ enabled: true })
  useNoHeaderLayout()

  // Build the active step list for the CURRENT answer state. We skip
  // mortgage_balance when homeownership isn't mortgage/buying_soon so
  // renters and paid-off owners don't see an irrelevant step.
  const activeSteps = useMemo<StepDef[]>(() => {
    const flat: Record<string, string> = {}
    for (const [k, v] of Object.entries(answers)) {
      if (typeof v === 'string') flat[k] = v
    }
    return (LIFE_INSURANCE_MP_STEPS as readonly StepDef[]).filter(
      (s) => !s.conditional || s.conditional(flat),
    )
  }, [answers])

  const totalSteps = activeSteps.length
  const currentStepDef = activeSteps[step]
  const isContactStep = currentStepDef?.id === 'contact_info'
  const isStateStep = currentStepDef?.type === 'state-picker'
  const stateAbbr = typeof answers.state === 'string' ? answers.state : ''
  const stateName = typeof answers.state_name === 'string' ? answers.state_name : ''

  const postProgress = (
    sid: string,
    answersSoFar: Answers,
    utm: UTMParameters | null,
    stepNumber: number,
    stepName: string,
  ) => {
    if (typeof window === 'undefined') return
    const metaCookies = getMetaCookies()
    fetch('/api/leads/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        sessionId: sid,
        funnelType: FUNNEL_TYPE,
        siteKey: 'parentsimple.org',
        quizAnswers: { ...answersSoFar, variant: VARIANT },
        utmParams: utm,
        metaCookies: { fbp: metaCookies.fbp, fbc: metaCookies.fbc },
        trustedFormCertUrl: getTrustedFormCertUrl() || null,
        jornayaLeadId: getLeadIdToken() || null,
        lastStepNumber: stepNumber,
        lastStepName: stepName,
      }),
    }).catch(() => {})
  }

  useEffect(() => {
    const id = `li_mp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    setSessionId(id)
    const stored = getStoredUTMParameters()
    let resolvedUtm: UTMParameters | null = null
    if (stored) {
      setUtmParams(stored)
      resolvedUtm = stored
    } else {
      const utm = extractUTMParameters()
      if (hasUTMParameters(utm)) {
        storeUTMParameters(utm)
        setUtmParams(utm)
        resolvedUtm = utm
      }
    }

    trackQuizStart(id, FUNNEL_TYPE)
    postProgress(id, {}, resolvedUtm, 1, LIFE_INSURANCE_MP_STEPS[0]?.id || 'start')
  }, [])

  useEffect(() => {
    if (contactPhone) {
      let digits = contactPhone.replace(/\D/g, '')
      if (digits.startsWith('1') && digits.length === 11) {
        digits = digits.slice(1)
      }
      const cleaned = digits.slice(0, 10)
      if (cleaned !== contactPhone) {
        setContactPhone(cleaned)
      }
    }
  }, [contactPhone])

  useEffect(() => {
    if (sessionId && currentStepDef) {
      trackQuizStepViewed(
        step + 1,
        currentStepDef.id,
        sessionId,
        FUNNEL_TYPE,
        step > 0 ? activeSteps[step - 1]?.id : undefined,
        totalSteps,
        VARIANT,
      )
    }
  }, [step, sessionId, currentStepDef, activeSteps, totalSteps])

  useEffect(() => {
    if (!isContactStep || !sessionId || initiateCheckoutFiredRef.current) return
    if (typeof window === 'undefined' || typeof (window as any).fbq !== 'function') return
    initiateCheckoutFiredRef.current = true
    const eventId = `${sessionId}-InitiateCheckout-${Math.floor(Date.now() / 1000)}`
    ;(window as any).fbq('track', 'InitiateCheckout', {
      content_name: 'Mortgage Protection Contact Form',
      content_category: FUNNEL_TYPE,
    }, { eventID: eventId })
  }, [isContactStep, sessionId])

  const handleMultipleChoice = (value: string) => {
    if (!currentStepDef) return
    const nextAnswers: Answers = { ...answers, [currentStepDef.id]: value }

    // Derive purpose + pre-select coverage from the MP-specific inputs so the
    // downstream GHL / CAPI payload still carries the fields the US funnel expects.
    if (currentStepDef.id === 'homeownership') {
      nextAnswers.purpose =
        value === 'homeowner_mortgage' || value === 'buying_soon'
          ? 'cover_mortgage'
          : 'protect_family'
    }
    if (currentStepDef.id === 'mortgage_balance') {
      const coverage = MORTGAGE_BALANCE_TO_COVERAGE[value]
      if (coverage) nextAnswers.coverage = coverage
    }

    setAnswers(nextAnswers)

    if (sessionId) {
      trackQuestionAnswer(currentStepDef.id, value, step + 1, totalSteps, sessionId, FUNNEL_TYPE, VARIANT)
      postProgress(sessionId, nextAnswers, utmParams, step + 1, currentStepDef.id)
    }

    if (step < totalSteps - 1) setStep(step + 1)
  }

  const handleStateSelect = (selected: SelectedState) => {
    if (!currentStepDef) return
    const updatedAnswers = {
      ...answers,
      state: selected.abbreviation,
      state_name: selected.name,
    }
    setAnswers(updatedAnswers)

    if (sessionId) {
      trackQuestionAnswer(
        currentStepDef.id,
        selected.abbreviation,
        step + 1,
        totalSteps,
        sessionId,
        FUNNEL_TYPE,
        VARIANT,
      )
      postProgress(sessionId, updatedAnswers, utmParams, step + 1, currentStepDef.id)
    }

    if (step < totalSteps - 1) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const handlePhoneBlur = async () => {
    const digits = contactPhone.replace(/\D/g, '')
    const format = validatePhoneFormat(digits)
    if (!format.isValid) {
      setPhoneError(format.error || null)
      return
    }
    setPhoneError(null)
    setPhoneValidating(true)
    try {
      const apiResult = await validatePhoneAPI(digits, {
        session_id: sessionId,
        funnel_type: FUNNEL_TYPE,
        path: '/quiz/mortgage-protection',
      })
      if (!apiResult.valid) {
        setPhoneError(apiResult.error || 'Please provide a valid mobile phone number')
      } else {
        setPhoneError(null)
      }
    } finally {
      setPhoneValidating(false)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactError('')
    const phone = contactPhone.replace(/\D/g, '').slice(0, 10)
    if (!contactFirstName?.trim() || !contactLastName?.trim() || !contactEmail?.trim() || phone.length < 10) {
      setContactError('Please fill in all required fields with a valid 10-digit phone number.')
      return
    }
    const format = validatePhoneFormat(phone)
    if (!format.isValid) {
      setPhoneError(format.error || 'Please enter a valid mobile phone number')
      return
    }
    if (phoneError) return

    setIsSubmitting(true)

    const phoneE164 = `+1${phone}`
    const contactInfo = {
      firstName: contactFirstName.trim(),
      lastName: contactLastName.trim(),
      email: contactEmail.trim().toLowerCase(),
      phone: phoneE164,
    }
    const isSenior = answers.age_range === '65+'
    const isHealthDq = answers.health_screen === 'yes'
    // Age wins when both fire — matches the WO-1277 Rev 2 spec.
    const dqReason = isSenior
      ? 'age_65_plus_term_run'
      : isHealthDq
        ? 'health_screen_major_condition'
        : null
    const isDisqualified = Boolean(dqReason)
    const fullAnswers = {
      ...answers,
      variant: VARIANT,
      contact_info: contactInfo,
      ...(isDisqualified ? { disqualified: true, dq_reason: dqReason } : {}),
    }
    const metaEventId = `${sessionId || 'li_mp'}-Lead-${Math.floor(Date.now() / 1000)}`

    if (sessionId) {
      trackEmailCapture(contactInfo.email, sessionId, FUNNEL_TYPE)
      if (isSenior) {
        // 65+ gate: skip the optimized `Lead` event and fire a non-optimized
        // custom event so delivery doesn't train on senior completions.
        if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
          ;(window as any).fbq('trackCustom', 'LeadSenior', {
            content_name: 'Mortgage Protection Senior (65+)',
            content_category: FUNNEL_TYPE,
            dq_reason: 'age_65_plus_term_run',
          }, { eventID: metaEventId })
        }
      } else if (isHealthDq) {
        if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
          ;(window as any).fbq('trackCustom', 'LeadHealthDQ', {
            content_name: 'Mortgage Protection Health DQ',
            content_category: FUNNEL_TYPE,
            dq_reason: 'health_screen_major_condition',
          }, { eventID: metaEventId })
        }
      } else {
        trackLeadFormSubmit({
          firstName: contactInfo.firstName,
          lastName: contactInfo.lastName,
          email: contactInfo.email,
          phone: phoneE164,
          zipCode: '',
          state: stateAbbr,
          stateName: stateName,
          quizAnswers: fullAnswers,
          sessionId,
          funnelType: FUNNEL_TYPE,
          metaEventId,
        })
      }
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
          funnelType: FUNNEL_TYPE,
          zipCode: null,
          state: stateAbbr || null,
          stateName: stateName || null,
          licensingInfo: null,
          calculatedResults: null,
          utmParams: utmParams,
          metaEventId,
          trustedFormCertUrl: getTrustedFormCertUrl() || null,
          trustedform_cert_url: getTrustedFormCertUrl() || null,
          jornayaLeadId: getLeadIdToken() || null,
          jornaya_lead_id: getLeadIdToken() || null,
          metaCookies: { fbp: metaCookies.fbp, fbc: metaCookies.fbc, fbLoginId },
          isSenior,
          isHealthDq,
          disqualified: isDisqualified || undefined,
          dqReason: dqReason || undefined,
        }),
      })

      const captureData = await captureRes.json()
      if (!captureRes.ok) {
        if (captureRes.status === 422 && captureData?.phoneValidation) {
          const message = captureData.phoneValidation.error
            || captureData.error
            || 'Please provide a valid mobile phone number'
          setPhoneError(message)
          setContactError('')
        } else {
          setContactError(captureData?.error || 'Something went wrong. Please try again.')
        }
        setIsSubmitting(false)
        return
      }

      try {
        await fetch('https://vpysqshhafthuxvokwqj.supabase.co/functions/v1/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: contactInfo.email,
            site_id: 'parentsimple',
            first_name: contactInfo.firstName ?? null,
            last_name: contactInfo.lastName ?? null,
            source: 'quiz',
            source_detail: 'mortgage-protection',
            quiz_context: fullAnswers,
            tags: ['quiz_completed'],
          }),
        })
      } catch (_) {}

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
          }),
        )
      }
      router.push('/quiz/life-insurance-us/results')
    } catch {
      setContactError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F6EF] life-insurance-ca-quiz">
      {step > 0 && (
        <div className="bg-[#F9F6EF] border-b border-[#E3E0D5]">
          <div className="max-w-2xl mx-auto px-6 py-4">
            <p className="text-sm text-gray-600 mb-3 text-center whitespace-nowrap" aria-live="polite">
              Step {step + 1} of {totalSteps}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-[#1A2B49] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-6 py-6 pb-8 w-full min-w-0">
        {step === 0 && currentStepDef && 'options' in currentStepDef && (
          <>
            <h1
              className="text-[#1A2B49] font-bold text-center mb-3"
              style={{ fontSize: '1.75rem', lineHeight: 1.2 }}
            >
              Mortgage Protection with Living Benefits
            </h1>
            <p className="text-gray-700 text-center text-sm mb-5">
              Term life insurance designed to pay off your home if something happens to you, and pay
              you if you&apos;re diagnosed with a serious illness. Many people qualify with no medical exam.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mb-6 text-xs text-gray-700">
              <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span>No medical exam for many</span>
              <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span>Quotes in about 60 seconds</span>
              <span className="flex items-center gap-1.5"><span className="text-green-600">✓</span>Compare top-rated carriers</span>
            </div>

            <h2
              className="text-xl font-semibold text-[#1A2B49] mb-6 text-center"
              style={{ fontSize: '1.25rem', lineHeight: 1.3 }}
            >
              {currentStepDef.title}
            </h2>

            <div className="flex flex-col gap-3 mb-6">
              {((currentStepDef.options as unknown) as { value: string; label: string }[]).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleMultipleChoice(opt.value)}
                  className={`flex items-center gap-3 rounded-xl px-5 py-3 text-left w-full min-w-0 border-2 transition-colors duration-150 ${
                    answers[currentStepDef.id] === opt.value
                      ? 'border-[#1A2B49] bg-white text-[#1A2B49] shadow-md'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-[#9DB89D]'
                  }`}
                >
                  <span className="shrink-0 text-xl">
                    {opt.value === 'homeowner_mortgage' ? '🏠' :
                      opt.value === 'homeowner_paid' ? '✅' :
                      opt.value === 'buying_soon' ? '🔑' : '🏢'}
                  </span>
                  <span className="font-medium text-[#1A2B49] break-words">{opt.label}</span>
                </button>
              ))}
            </div>

            <div className="text-center mb-6">
              <Image
                src="/images/life-insurance-funnel/trustpilot-proof.png"
                alt="Trustpilot rating - 4.6 out of 5 based on 3563 reviews"
                width={750}
                height={63}
                className="mx-auto h-auto w-full max-w-lg object-contain"
              />
            </div>

            <div className="bg-transparent rounded-xl p-6 mb-6">
              <h4 className="text-sm font-semibold text-[#1A2B49] mb-2">About ParentSimple</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                ParentSimple is part of the Simple Media Network. We offer trusted resources to parents, preparing them for every aspect of their journey — from education planning to financial security. We don&apos;t sell insurance directly; instead, we partner with the best providers in every area to help you make informed decisions and find the right coverage for your family.
              </p>
            </div>
          </>
        )}

        {isStateStep && (
          <>
            {step === totalSteps - 2 && (
              <p className="text-sm text-gray-500 mb-2 text-center">Almost there! 🎉</p>
            )}
            <StatePickerStep
              selectedAbbreviation={stateAbbr}
              onSelect={handleStateSelect}
            />
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

        {step >= 1 && !isContactStep && !isStateStep && currentStepDef && currentStepDef.type === 'multiple-choice' && (
          <>
            {step === totalSteps - 2 && (
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
                  if (currentStepDef.id === 'mortgage_balance') return <span className="shrink-0 text-xl">💵</span>
                  if (currentStepDef.id === 'age_range') return <span className="shrink-0 text-xl">📅</span>
                  if (currentStepDef.id === 'gender') {
                    if (opt.value === 'male') return <span className="text-blue-500 shrink-0 text-xl font-bold">♂</span>
                    if (opt.value === 'female') return <span className="text-pink-500 shrink-0 text-xl font-bold">♀</span>
                    return <span className="shrink-0 text-xl">👥</span>
                  }
                  if (currentStepDef.id === 'best_time') {
                    if (opt.value === 'morning') return <span className="shrink-0 text-xl">🌅</span>
                    if (opt.value === 'afternoon') return <span className="shrink-0 text-xl">☀️</span>
                    if (opt.value === 'evening') return <span className="shrink-0 text-xl">🌙</span>
                    if (opt.value === 'anytime') return <span className="shrink-0 text-xl">🕐</span>
                    return <span className="shrink-0 text-xl">📞</span>
                  }
                  if (currentStepDef.id === 'smoker') {
                    return opt.value === 'yes'
                      ? <span className="shrink-0 text-xl">🚬</span>
                      : <span className="shrink-0 text-xl">🚫</span>
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

            <div className="bg-green-50 border-l-4 border-green-500 px-6 py-3 mb-4 -mx-6">
              <p className="text-base font-semibold text-green-700 flex items-center justify-center gap-2">
                <span className="text-xl">🎉</span>
                Great! You&apos;re Matched with Top Insurers
              </p>
            </div>

            <h1 className="text-2xl font-bold text-[#1A2B49] mb-4 text-center" style={{ fontSize: '1.5rem', lineHeight: 1.3 }}>
              Where should we send your free quote?
            </h1>

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
                    const target = e.target as HTMLInputElement
                    let digits = target.value.replace(/\D/g, '')
                    if (digits.startsWith('1')) digits = digits.slice(1)
                    setContactPhone(digits.slice(0, 10))
                    if (phoneError) setPhoneError(null)
                  }}
                  onBlur={handlePhoneBlur}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-1 focus:ring-[#36596A]/30 bg-white transition-colors ${
                    phoneError ? 'border-red-400 focus:border-red-500' : 'border-gray-300 focus:border-[#36596A]'
                  }`}
                  placeholder="(555) 555-5555"
                  required
                />
                {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
                {phoneValidating && !phoneError && <p className="mt-1 text-xs text-gray-500">Checking number…</p>}
              </div>
              {contactError && <p className="text-sm text-red-600">{contactError}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1A2B49] hover:bg-[#24385C] text-white font-semibold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Get My Free Quote'}
              </button>

              <p className="text-xs text-gray-600 leading-relaxed">
                By clicking &quot;Get My Free Quote&quot; you agree to receive communication from a licensed insurance broker via phone, email, SMS for the purpose of distributing and administering insurance. You may withdraw your consent at any time and you also agree to the{' '}
                <Link href="/terms-of-service" className="text-[#36596A] hover:underline transition-colors duration-150">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy-policy" className="text-[#36596A] hover:underline transition-colors duration-150">Privacy Policy</Link>.
              </p>

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
    </div>
  )
}
