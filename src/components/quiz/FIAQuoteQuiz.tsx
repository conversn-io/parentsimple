'use client'

import { useState, useEffect } from 'react';
import { QuizProgress } from './QuizProgress';
import { QuizQuestion } from './QuizQuestion';
import { SavingsSlider } from './SavingsSlider';
import { AllocationSlider } from './AllocationSlider';
import { useRouter } from 'next/navigation';
import { OTPVerification } from './OTPVerification';
import { ProcessingState } from './ProcessingState';
import { supabase } from '@/lib/supabase';
import { buildApiUrl } from '@/lib/api-config';
import { extractUTMParameters, storeUTMParameters, getStoredUTMParameters, hasUTMParameters, UTMParameters } from '@/utils/utm-utils';
import { trackUTMParameters } from '@/utils/utm-tracker';
import { 
  initializeTracking, 
  trackQuestionAnswer, 
  trackLeadFormSubmit, 
  trackPageView, 
  trackQuizStart, 
  trackQuizComplete,
  sendCAPILeadEventMultiSite,
  sendCAPIViewContentEventMultiSite,
  LeadData
} from '@/lib/temp-tracking';

interface QuizAnswer {
  [key: string]: any;
}

// FIA Quote Quiz Questions with standardized order
const FIA_QUIZ_QUESTIONS = [
  {
    id: 'ageRange',
    title: 'What is your current age range?',
    subtitle: 'This helps us recommend the right FIA strategy for your timeline',
    type: 'multiple-choice' as const,
    options: [
      '50 or Younger',
      '51 - 60',
      '61 - 70',
      '70+'
    ],
  },
  {
    id: 'retirementTimeline',
    title: 'How soon are you planning to retire?',
    subtitle: 'This helps us recommend the right FIA strategy',
    type: 'multiple-choice' as const,
    options: [
      'Already retired',
      'Within 1-2 years',
      '3-5 years',
      '6-10 years',
      'More than 10 years'
    ],
  },
  {
    id: 'riskTolerance',
    title: 'How would you describe your risk tolerance?',
    subtitle: 'This helps us recommend appropriate FIA strategies',
    type: 'multiple-choice' as const,
    options: [
      'Conservative - I want to protect my principal',
      'Moderate - I want some growth with some protection',
      'Aggressive - I want maximum growth potential'
    ],
  },
  {
    id: 'currentRetirementPlans',
    title: 'What type of retirement accounts do you currently have?',
    subtitle: 'Select all that apply to your current situation',
    type: 'multi-select' as const,
    options: [
      '401(k) or 403(b)',
      'IRA (Traditional or Roth)',
      'Pension',
      'Annuities',
      'Taxable investments',
      'None of the above'
    ],
  },
  {
    id: 'retirementSavings',
    title: 'What is your total retirement savings?',
    subtitle: 'Use the slider to select your total retirement savings across all accounts',
    type: 'savings-slider' as const,
    min: 50000,
    max: 2000000,
    step: 50000,
    defaultValue: 250000,
    unit: '$',
  },
  {
    id: 'allocationPercent',
    title: 'How much of your retirement savings would you like to protect from market volatility?',
    subtitle: 'Use the slider to select your preferred allocation amount',
    type: 'allocation-slider' as const,
    min: 0,
    max: 100,
    step: 5,
    defaultValue: 25,
    unit: '%',
    showValue: true,
    conditional: true, // Only show if savings >= $100k
  },
  {
    id: 'personalInfo',
    title: 'Let\'s get your contact information',
    subtitle: 'We\'ll use this to send you personalized FIA quotes',
    type: 'personal-info' as const,
  },
  {
    id: 'locationInfo',
    title: 'What\'s your ZIP code?',
    subtitle: 'This helps us provide state-specific FIA guidance and connect you with licensed professionals in your area',
    type: 'location-info' as const,
  },
  {
    id: 'phone',
    title: 'What\'s your phone number?',
    subtitle: 'We\'ll send you a verification code to confirm your number',
    type: 'phone-consent' as const,
  },
];

export const FIAQuoteQuiz = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [showOTP, setShowOTP] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [quizSessionId, setQuizSessionId] = useState<string | null>(null);
  const [utmParams, setUtmParams] = useState<UTMParameters | null>(null);

  // Filter questions based on conditional logic
  const getFilteredQuestions = () => {
    // Skip allocation slider if savings < $100k
    if (answers.retirementSavings && answers.retirementSavings < 100000) {
      return FIA_QUIZ_QUESTIONS.filter(q => q.id !== 'allocationPercent');
    }
    
    return FIA_QUIZ_QUESTIONS;
  };

  const questions = getFilteredQuestions();
  const totalSteps = questions.length;

  useEffect(() => {
    // Generate unique session ID for tracking
    const sessionId = `fia_quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setQuizSessionId(sessionId);
    
    // Initialize comprehensive tracking
    initializeTracking();
    
    // Track page view
    trackPageView('SeniorSimple FIA Quote Calculator', '/quote');
    
    // Track quiz start
    trackQuizStart('fia_quote', sessionId);
    
    // Send CAPI ViewContent event (multi-site)
    sendCAPIViewContentEventMultiSite({
      quizType: 'fia_quote',
      sessionId: sessionId
    });
    
    console.log('🚀 FIA Quote Quiz Session Started:', { 
      sessionId,
      totalSteps,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // UTM Tracking - Extract and track UTM parameters
    const extractAndTrackUTM = async () => {
      const utmTracked = sessionStorage.getItem('utm_tracked');
      if (utmTracked === 'true') {
        console.log('📊 UTM Already Tracked for This Session');
        const storedUtm = getStoredUTMParameters();
        if (storedUtm) {
          setUtmParams(storedUtm);
        }
        return;
      }

      const utmData = extractUTMParameters();
      
      if (hasUTMParameters(utmData)) {
        console.log('📊 UTM Parameters Found:', utmData);
        setUtmParams(utmData);
        storeUTMParameters(utmData);
        
        const trackingSuccess = await trackUTMParameters(sessionId, utmData);
        
        if (trackingSuccess) {
          sessionStorage.setItem('utm_tracked', 'true');
          console.log('✅ UTM Parameters Tracked Successfully');
        } else {
          console.error('❌ UTM Tracking Failed');
        }
      } else {
        console.log('📊 No UTM Parameters Found in URL');
        const storedUtm = getStoredUTMParameters();
        if (storedUtm) {
          setUtmParams(storedUtm);
          console.log('📊 Using Stored UTM Parameters:', storedUtm);
        }
      }
    };

    extractAndTrackUTM();
  }, [totalSteps]);

  const handleAnswer = async (answer: any) => {
    const currentQuestion = questions[currentStep];
    
    // Track question answer
    try {
      trackQuestionAnswer(currentQuestion.id, answer, currentStep + 1, questions.length, quizSessionId || 'unknown', 'fia_quote');
    } catch {}
    
    console.log('📝 FIA Quote Answer Received:', {
      sessionId: quizSessionId,
      step: currentStep + 1,
      questionId: currentQuestion.id,
      questionTitle: currentQuestion.title,
      answer: answer,
      answerType: typeof answer,
      timestamp: new Date().toISOString()
    });
    
    // Store answer
    const updatedAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(updatedAnswers);

    // Handle personal info submission
    if (currentQuestion.id === 'personalInfo') {
      console.log('📧 Personal Info Submitted - Capturing Email for Retargeting');
      
      const emailCaptureData = {
        email: answer.email,
        firstName: answer.firstName,
        lastName: answer.lastName,
        quizAnswers: updatedAnswers,
        sessionId: quizSessionId || 'unknown',
        funnelType: 'fia_quote',
        zipCode: updatedAnswers.locationInfo?.zipCode,
        state: updatedAnswers.locationInfo?.state,
        stateName: updatedAnswers.locationInfo?.stateName,
        licensingInfo: updatedAnswers.locationInfo?.licensing,
        utmParams: utmParams
      };

      try {
        const response = await fetch(buildApiUrl('/api/leads/capture-email'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailCaptureData)
        });

        const result = await response.json();
        if (result.success) {
          console.log('✅ Email Captured for Retargeting:', { eventId: result.eventId, email: answer.email });
        } else {
          console.error('❌ Email Capture Failed:', result.error);
        }
      } catch (error) {
        console.error('💥 Email Capture Exception:', error);
      }
    }

    // Handle phone number submission
    if (currentQuestion.id === 'phone') {
      console.log('📱 Phone Number Submitted - Initiating OTP Flow:', {
        sessionId: quizSessionId || 'unknown',
        phoneNumber: answer,
        timestamp: new Date().toISOString()
      });
      
      setShowOTP(true);
      console.log('🔐 OTP State Set to True - Should show OTP verification next');
      return;
    }
    
    // Check if this is the last question
    if (currentStep === questions.length - 1) {
      console.log('🏁 FIA Quote Quiz Completed - All Questions Answered:', {
        sessionId: quizSessionId,
        totalSteps,
        allAnswers: updatedAnswers,
        timestamp: new Date().toISOString()
      });
      
      // Calculate and store results, then redirect to quote-submitted page
      const results = calculateFIAResults();
      sessionStorage.setItem('fia_quote_data', JSON.stringify(results));
      sessionStorage.setItem('phone_number', answer);
      
      console.log('📊 FIA Quote Results Stored:', {
        sessionId: quizSessionId,
        results,
        timestamp: new Date().toISOString()
      });
      
      // Redirect to quote-submitted page
      router.push('/quote-submitted');
    } else {
      const nextStep = currentStep + 1;
      console.log('➡️ Moving to Next Step:', {
        sessionId: quizSessionId,
        fromStep: currentStep + 1,
        toStep: nextStep + 1,
        nextQuestionId: questions[nextStep].id,
        timestamp: new Date().toISOString()
      });
      setCurrentStep(nextStep);
    }
  };

  const calculateFIAResults = () => {
    console.log('🧮 Calculating FIA Quote Results:', {
      sessionId: quizSessionId,
      answers,
      timestamp: new Date().toISOString()
    });

    // Track quiz completion
    try {
      const completionTime = Date.now() - ((window as any).quizStartTime || Date.now());
      trackQuizComplete('fia_quote', quizSessionId || 'unknown', 'fia_quote', completionTime);
    } catch {}

    // Calculate FIA-specific income projections
    const retirementSavings = answers.retirementSavings;
    const ageRange = answers.ageRange;
    const allocationPercent = answers.fiaAllocation?.percentage || 25;
    
    // Parse savings amount - handle both numeric and string values
    let totalSavings = 0;
    if (typeof retirementSavings === 'number') {
      // New SavingsSlider stores numeric values
      totalSavings = retirementSavings;
    } else if (typeof retirementSavings === 'string') {
      // Try to parse as number first
      const numericValue = parseFloat(retirementSavings);
      if (!isNaN(numericValue)) {
        totalSavings = numericValue;
      } else {
        // Fall back to old string-based parsing for backward compatibility
        switch (retirementSavings) {
          case '$1,000,000+':
            totalSavings = 1000000;
            break;
          case '$750,000 - $999,999':
            totalSavings = 750000;
            break;
          case '$500,000 - $749,999':
            totalSavings = 500000;
            break;
          case '$250,000 - $499,999':
            totalSavings = 250000;
            break;
          case '$100,000 - $249,999':
            totalSavings = 100000;
            break;
          default:
            totalSavings = 50000;
        }
      }
    } else {
      // Default fallback
      totalSavings = 50000;
    }

    // Calculate allocation amount
    const allocationAmount = totalSavings * (allocationPercent / 100);
    
    // Get age factor for FIA rates
    let ageFactor = 0.055; // Default
    switch (ageRange) {
      case '50 or Younger':
        ageFactor = 0.045;
        break;
      case '51 - 60':
        ageFactor = 0.055;
        break;
      case '61 - 70':
        ageFactor = 0.065;
        break;
      case '70+':
        ageFactor = 0.075;
        break;
    }

    // Calculate monthly income based on allocation and age
    const monthlyIncome = (allocationAmount * ageFactor) / 12;
    
    const calculatedResults = {
      totalSavings,
      allocationAmount,
      allocationPercent,
      monthlyIncome: {
        conservative: monthlyIncome * 0.85,
        current: monthlyIncome,
        optimistic: monthlyIncome * 1.15
      },
      ageFactor,
      currentRate: ageFactor,
      lastUpdated: new Date().toISOString(),
      personalInfo: answers.personalInfo
    };

    console.log('✅ FIA Quote Results Calculated:', {
      sessionId: quizSessionId,
      calculatedResults,
      timestamp: new Date().toISOString()
    });

    return calculatedResults;
  };

  const handleOTPVerification = async () => {
    console.log('🔐 OTP Verification Complete - Sending to GHL:', {
      sessionId: quizSessionId,
      phoneNumber: answers.phone,
      timestamp: new Date().toISOString()
    });

    setShowOTP(false);
    setShowProcessing(true);

    try {
      const calculatedResults = calculateFIAResults();
      
      const edgeFunctionUrl = '/api/process-lead';
      
      console.log('🚀 Calling Supabase Edge Function:', {
        url: edgeFunctionUrl,
        sessionId: quizSessionId || 'unknown',
        timestamp: new Date().toISOString()
      });

      const edgeResponse = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          site_key: 'SENIORSIMPLE',
          funnel_type: 'fia_quote',
          session_id: quizSessionId || 'unknown',
          user_id: answers.personalInfo?.email,
          contact: {
            email: answers.personalInfo?.email,
            phone: answers.phone,
            first_name: answers.personalInfo?.firstName,
            last_name: answers.personalInfo?.lastName
          },
          quiz_answers: answers,
          lead_score: 85, // Higher lead score for FIA quotes
          utm_source: utmParams?.utm_source,
          utm_medium: utmParams?.utm_medium,
          utm_campaign: utmParams?.utm_campaign,
          zip_code: answers.locationInfo?.zipCode,
          state: answers.locationInfo?.state,
          state_name: answers.locationInfo?.stateName,
          consent: true
        })
      });

      let edgeResult: any = null
      try {
        edgeResult = await edgeResponse.json()
      } catch {
        const rawText = await edgeResponse.text()
        edgeResult = { raw: rawText }
      }
      
      if (edgeResponse.ok && edgeResult.status === 'success') {
        console.log('✅ Lead Processed by Edge Function Successfully:', { 
          leadId: edgeResult.lead_id,
          leadScore: edgeResult.lead_score,
          qualified: edgeResult.qualified,
          sessionId: quizSessionId || 'unknown',
          timestamp: new Date().toISOString()
        });

        // Fire direct client-side GHL webhook
        try {
          const ghlUrl = process.env.NEXT_PUBLIC_GHL_WEBHOOK_SENIORSIMPLE || 'https://services.leadconnectorhq.com/hooks/vTM82D7FNpIlnPgw6XNC/webhook-trigger/28ef726d-7ead-4cd2-aa85-dfc6192adfb6'
          const ghlPayload = {
            firstName: answers.personalInfo?.firstName,
            lastName: answers.personalInfo?.lastName,
            email: answers.personalInfo?.email,
            phone: answers.phone,
            zipCode: answers.locationInfo?.zipCode,
            state: answers.locationInfo?.state,
            stateName: answers.locationInfo?.stateName,
            source: 'SeniorSimple FIA Quote',
            funnelType: 'fia_quote',
            quizAnswers: answers,
            leadScore: edgeResult.lead_score || 85,
            utmParams: utmParams || {},
            timestamp: new Date().toISOString()
          }

          fetch(ghlUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ghlPayload)
          }).then(res => {
            if (res.ok) {
              console.log('✅ GHL webhook (client) sent successfully')
            } else {
              console.warn('⚠️ GHL webhook (client) non-200', res.status)
            }
          }).catch(err => console.error('❌ GHL webhook (client) error', err))
        } catch (err) {
          console.error('❌ GHL webhook (client) exception', err)
        }
      } else {
        console.error('❌ Edge Function Failed:', { 
          error: edgeResult.error || 'Unknown error',
          details: edgeResult.details || edgeResult.raw,
          status: edgeResponse.status,
          sessionId: quizSessionId || 'unknown',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('💥 OTP Verification & GHL Lead Distribution Exception:', { 
        error, 
        sessionId: quizSessionId || 'unknown',
        timestamp: new Date().toISOString()
      });
    }

    setShowProcessing(false);
    
    // Calculate and store results, then redirect to quote-submitted page
    const results = calculateFIAResults();
    sessionStorage.setItem('fia_quote_data', JSON.stringify(results));
    
    console.log('📊 FIA Quote Results Stored After OTP:', {
      sessionId: quizSessionId,
      results,
      timestamp: new Date().toISOString()
    });
    
    // Redirect to quote-submitted page
    router.push('/quote-submitted');
  };

  const handleRestart = () => {
    console.log('🔄 FIA Quote Quiz Restart Initiated:', {
      sessionId: quizSessionId,
      timestamp: new Date().toISOString()
    });

    setCurrentStep(0);
    setAnswers({});
    setShowOTP(false);
    setShowProcessing(false);
    setQuizSessionId(null);
  };

  if (showProcessing) {
    console.log('⏳ Showing Processing State:', {
      sessionId: quizSessionId,
      timestamp: new Date().toISOString()
    });
    return <ProcessingState message="Processing your FIA quote..." />;
  }

  if (showOTP) {
    console.log('📱 Showing OTP Verification:', {
      sessionId: quizSessionId,
      phoneNumber: answers.phone,
      showOTP: true,
      timestamp: new Date().toISOString()
    });
    return (
      <OTPVerification
        phoneNumber={answers.phone}
        onVerificationComplete={handleOTPVerification}
        onBack={() => setShowOTP(false)}
      />
    );
  }


  console.log('📋 Rendering FIA Quote Question:', {
    sessionId: quizSessionId,
    currentStep: currentStep + 1,
    totalSteps,
    questionId: questions[currentStep].id,
    questionTitle: questions[currentStep].title,
    showOTP: showOTP,
    showProcessing: showProcessing,
    timestamp: new Date().toISOString()
  });

  const currentQuestion = questions[currentStep];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <QuizProgress currentStep={currentStep} totalSteps={totalSteps} />
      <div className="mt-2">
        {currentQuestion.type === 'savings-slider' ? (
          <SavingsSlider
            question={currentQuestion}
            onAnswer={handleAnswer}
            currentAnswer={answers[currentQuestion.id]}
          />
        ) : currentQuestion.type === 'allocation-slider' ? (
          <AllocationSlider
            question={currentQuestion}
            onAnswer={handleAnswer}
            currentAnswer={answers[currentQuestion.id]}
            totalSavings={answers.retirementSavings}
          />
        ) : (
          <QuizQuestion
            question={currentQuestion}
            onAnswer={handleAnswer}
            currentAnswer={answers[currentQuestion.id]}
          />
        )}
      </div>
    </div>
  );
};
