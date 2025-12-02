'use client'

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { OTPVerification } from '@/components/quiz/OTPVerification';
import { ProcessingState } from '@/components/quiz/ProcessingState';

const EMBED_CONTEXT_STORAGE_KEY = 'elite_university_embed_context';
const RESULT_VARIANT_STORAGE_KEY = 'elite_university_result_variant';

type ContactInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consent?: boolean;
};

type QuizResults = {
  totalScore: number;
  category?: string;
  strengths?: string[];
  improvements?: string[];
};

type QuizSessionData = {
  answers: {
    contact_info: ContactInfo;
    graduation_year?: string;
    gpa_score?: number;
    ap_course_load?: number;
    test_scores?: string;
    extracurriculars?: string;
    [key: string]: unknown;
  };
  calculatedResults?: QuizResults;
  quizSessionId?: string;
  utmParams?: Record<string, unknown>;
};

function VerifyOTPContent() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [quizData, setQuizData] = useState<QuizSessionData | null>(null);
  const [showProcessing, setShowProcessing] = useState(false);

  useEffect(() => {
    // Retrieve quiz data from sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      const storedData = sessionStorage.getItem('elite_university_quiz_data');
      if (storedData) {
        try {
          const data = JSON.parse(storedData) as QuizSessionData;
          setQuizData(data);
          setPhoneNumber(data.answers?.contact_info?.phone || '');
        } catch (error) {
          console.error('❌ Failed to parse quiz data:', error);
          router.push('/quiz/elite-university-readiness');
        }
      } else {
        // No quiz data found, redirect back to quiz
        console.error('❌ No quiz data found in sessionStorage');
        router.push('/quiz/elite-university-readiness');
      }
    }
  }, [router]);

  const handleOTPVerification = async () => {
    if (!quizData) {
      console.error('❌ Quiz data missing for OTP verification');
      return;
    }

    console.log('🔐 OTP Verification Complete - Sending to GHL:', {
      sessionId: quizData.quizSessionId || 'unknown',
      timestamp: new Date().toISOString()
    });

    setShowProcessing(true);

    const readinessScore = quizData.calculatedResults?.totalScore || 0;
    const personalInfo = quizData.answers.contact_info;

    try {
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
          funnelType: 'college_consulting',
          zipCode: null,
          state: null,
          stateName: null,
          licensingInfo: null,
          calculatedResults: quizData.calculatedResults,
          utmParams: quizData.utmParams
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('✅ Lead Processed and Sent to GHL Successfully:', {
          leadId: data.leadId,
          readinessScore: readinessScore,
          category: quizData.calculatedResults?.category,
          sessionId: quizData.quizSessionId || 'unknown',
          timestamp: new Date().toISOString()
        });

        // Store results in session storage for results page
        if (typeof sessionStorage !== 'undefined' && quizData.calculatedResults) {
          sessionStorage.setItem('elite_university_readiness_results', JSON.stringify({
            ...quizData.calculatedResults,
            graduationYear: quizData.answers.graduation_year
          }));

          // Persist sanitized context for Empowerly embed variant
          try {
            const embedLeadContext = {
              parent: {
                firstName: personalInfo.firstName,
                lastName: personalInfo.lastName,
                email: personalInfo.email,
                phone: personalInfo.phone,
                consent: personalInfo.consent ?? true,
              },
              student: {
                graduationYear: quizData.answers.graduation_year,
                gpa: quizData.answers.gpa_score,
                apCourseLoad: quizData.answers.ap_course_load,
                testScores: quizData.answers.test_scores,
                extracurriculars: quizData.answers.extracurriculars,
              },
              readiness: {
                score: quizData.calculatedResults?.totalScore,
                category: quizData.calculatedResults?.category,
                strengths: quizData.calculatedResults?.strengths,
                improvements: quizData.calculatedResults?.improvements,
              },
              utm: quizData.utmParams,
              sessionId: quizData.quizSessionId || 'unknown',
              timestamp: new Date().toISOString(),
            };

            const serializedContext = JSON.stringify(embedLeadContext);
            sessionStorage.setItem(EMBED_CONTEXT_STORAGE_KEY, serializedContext);
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(EMBED_CONTEXT_STORAGE_KEY, serializedContext);
            }
            console.log('💾 Empowerly embed context stored:', {
              parent: embedLeadContext.parent,
              student: {
                graduationYear: embedLeadContext.student.graduationYear,
                gpa: embedLeadContext.student.gpa,
                apCourseLoad: embedLeadContext.student.apCourseLoad,
              },
              readinessScore: embedLeadContext.readiness.score,
              category: embedLeadContext.readiness.category,
              storageKeys: ['sessionStorage', 'localStorage'],
            });
          } catch (embedError) {
            console.error('⚠️ Failed to store Empowerly embed context:', embedError);
          }
        }

        // Clear quiz data from sessionStorage
        sessionStorage.removeItem('elite_university_quiz_data');

        const resultVariant =
          typeof sessionStorage !== 'undefined'
            ? sessionStorage.getItem(RESULT_VARIANT_STORAGE_KEY)
            : null;

        const baseResultsRoute =
          resultVariant === 'embed'
            ? '/quiz/elite-university-readiness/results-embed'
            : '/quiz/elite-university-readiness/results';

        // Redirect to appropriate results page
        setTimeout(() => {
          router.push(`${baseResultsRoute}?score=${readinessScore}&category=${encodeURIComponent(quizData.calculatedResults?.category || '')}`);
        }, 2000);
      } else {
        console.error('❌ Lead Processing Failed:', data);
        setShowProcessing(false);
        alert('There was an error processing your request. Please try again.');
      }
    } catch (error) {
      console.error('💥 Lead Processing Exception:', error);
      setShowProcessing(false);
      alert('There was an error processing your request. Please try again.');
    }
  };

  const handleBack = () => {
    router.push('/quiz/elite-university-readiness');
  };

  if (showProcessing) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex justify-center items-start px-4 pt-8 pb-10">
        <div className="w-full max-w-xl">
          <ProcessingState 
            message="We're processing your information and preparing your personalized readiness report..." 
            isComplete={false}
          />
        </div>
      </div>
    );
  }

  if (!phoneNumber) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex justify-center items-start px-4 pt-8 pb-10">
        <div className="text-center bg-white shadow-lg rounded-xl px-6 py-6">
          <p className="text-gray-600">Loading your secure verification flow…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6EF] flex justify-center items-start px-4 pt-8 pb-10">
      <div className="w-full max-w-xl">
        <OTPVerification
          phoneNumber={phoneNumber}
          onVerificationComplete={handleOTPVerification}
          onBack={handleBack}
        />
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9F6EF] flex justify-center items-start px-4 pt-8 pb-10">
        <div className="text-center bg-white shadow-lg rounded-xl px-6 py-6">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}

