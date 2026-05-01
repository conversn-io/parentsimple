// DEPRECATED: life-insurance-us no longer redirects users here. Trestle
// line-type validation in the contact step replaces SMS OTP; the GHL push
// happens inside /api/leads/capture-email. This page is retained so users
// on stale browser bundles don't 404 mid-flow. Safe to remove ~48h after
// deploy.
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { OTPVerification } from '@/components/quiz/OTPVerification'
import { ProcessingState } from '@/components/quiz/ProcessingState'
import { getMetaCookies } from '@/lib/meta-capi-cookies'
import { useFunnelLayout } from '@/hooks/useFunnelFooter'

const STORAGE_KEY = 'life_insurance_us_quiz_data'

type ContactInfo = { firstName: string; lastName: string; email: string; phone: string }
type QuizSessionData = {
  answers: { contact_info: ContactInfo; [key: string]: unknown }
  quizSessionId?: string
  utmParams?: Record<string, unknown>
  trustedFormCertUrl?: string | null
  jornayaLeadId?: string | null
}

function VerifyOTPContent() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [quizData, setQuizData] = useState<QuizSessionData | null>(null)
  const [showProcessing, setShowProcessing] = useState(false)

  useFunnelLayout()

  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return
    const stored = sessionStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored) as QuizSessionData
        setQuizData(data)
        setPhoneNumber(data.answers?.contact_info?.phone || '')
      } catch {
        router.push('/quiz/life-insurance-us')
      }
    } else {
      router.push('/quiz/life-insurance-us')
    }
  }, [router])

  const handleOTPVerification = async () => {
    if (!quizData) return
    setShowProcessing(true)
    const personalInfo = quizData.answers.contact_info

    try {
      const metaCookies = getMetaCookies()
      const fbLoginId =
        typeof window !== 'undefined' && (window as any).FB?.getAuthResponse?.()?.userID
          ? (window as any).FB.getAuthResponse().userID
          : null

      const response = await fetch('/api/leads/verify-otp-and-send-to-ghl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: personalInfo.phone,
          email: personalInfo.email,
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          quizAnswers: quizData.answers,
          sessionId: quizData.quizSessionId || 'unknown',
          funnelType: 'life_insurance_us',
          zipCode: null,
          state: null,
          stateName: null,
          licensingInfo: null,
          calculatedResults: null,
          utmParams: quizData.utmParams,
          trustedFormCertUrl: quizData.trustedFormCertUrl ?? null,
          trustedform_cert_url: quizData.trustedFormCertUrl ?? null,
          jornayaLeadId: quizData.jornayaLeadId ?? null,
          jornaya_lead_id: quizData.jornayaLeadId ?? null,
          metaCookies: { fbp: metaCookies.fbp, fbc: metaCookies.fbc, fbLoginId },
        }),
      })

      const data = await response.json()
      if (response.ok && data.success) {
        setTimeout(() => router.push('/quiz/life-insurance-us/results'), 2000)
      } else {
        setShowProcessing(false)
        alert(data?.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setShowProcessing(false)
      alert('Something went wrong. Please try again.')
    }
  }

  const handleBack = () => router.push('/quiz/life-insurance-us')

  if (showProcessing) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] life-insurance-ca-quiz flex justify-center items-start px-6 pt-8 pb-10">
        <div className="w-full max-w-2xl">
          <ProcessingState
            message="We're preparing your personalized quotes..."
            isComplete={false}
          />
        </div>
      </div>
    )
  }

  if (!phoneNumber) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] life-insurance-ca-quiz flex justify-center items-start px-6 pt-8 pb-10">
        <div className="text-center bg-white rounded-xl px-6 py-6 border border-[#E3E0D5]">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9F6EF] life-insurance-ca-quiz flex justify-center items-start px-6 pt-8 pb-10">
      <div className="w-full max-w-2xl">
        <OTPVerification
          phoneNumber={phoneNumber}
          onVerificationComplete={handleOTPVerification}
          onBack={handleBack}
        />
      </div>
    </div>
  )
}

export default function LifeInsuranceUSVerifyOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F9F6EF] life-insurance-ca-quiz flex justify-center items-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      }
    >
      <VerifyOTPContent />
    </Suspense>
  )
}
