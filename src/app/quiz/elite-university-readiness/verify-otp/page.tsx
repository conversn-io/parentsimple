'use client'

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OTPVerification } from '@/components/quiz/OTPVerification';
import { ProcessingState } from '@/components/quiz/ProcessingState';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [quizData, setQuizData] = useState<any>(null);
  const [showProcessing, setShowProcessing] = useState(false);

  useEffect(() => {
    // Retrieve quiz data from sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      const storedData = sessionStorage.getItem('elite_university_quiz_data');
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
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
        }

        // Clear quiz data from sessionStorage
        sessionStorage.removeItem('elite_university_quiz_data');

        // Redirect to results page
        setTimeout(() => {
          router.push(`/quiz/elite-university-readiness/results?score=${readinessScore}&category=${encodeURIComponent(quizData.calculatedResults?.category || '')}`);
        }, 2000);
      } else {
        console.error('❌ Lead Processing Failed:', data);
        setShowProcessing(false);
        alert('There was an error processing your request. Please try again.');
      }
    } catch (error: any) {
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
      <div className="min-h-screen bg-[#F9F6EF]">
        <ProcessingState 
          message="We're processing your information and preparing your personalized readiness report..." 
          isComplete={false}
        />
      </div>
    );
  }

  if (!phoneNumber) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F6EF]">
      <OTPVerification
        phoneNumber={phoneNumber}
        onVerificationComplete={handleOTPVerification}
        onBack={handleBack}
      />
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9F6EF] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}

