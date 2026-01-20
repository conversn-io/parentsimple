'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QuizProgress } from './QuizProgress';
import { QuizQuestion } from './QuizQuestion';
import {
  initializeTracking,
  trackQuestionAnswer,
  trackLeadFormSubmit,
  trackPageView,
  trackQuizStart,
  trackQuizComplete,
  trackGraduationYearSelected,
  trackScoreCalculated,
  LeadData,
} from '@/lib/temp-tracking';
import { extractUTMParameters, storeUTMParameters, getStoredUTMParameters, hasUTMParameters, UTMParameters } from '@/utils/utm-utils';
import { trackUTMParameters } from '@/utils/utm-tracker';
import { ELITE_UNIVERSITY_QUESTIONS } from '@/data/elite-university-questions';
import { calculateEliteUniversityReadinessScore, type EliteUniversityReadinessResults } from '@/utils/elite-university-scoring';

const RESULT_VARIANT_STORAGE_KEY = 'elite_university_result_variant';
const RESULTS_LAYOUT_VARIANT_KEY = 'results_layout_variant';

type QuizVariant = 'default' | 'embed';

// Helper function to get A/B test results route
const getResultsRoute = (): string => {
  if (typeof window === 'undefined') return '/quiz/elite-university-readiness/results';
  
  // Check if already assigned in this session
  const stored = sessionStorage.getItem(RESULTS_LAYOUT_VARIANT_KEY);
  if (stored === 'video') return '/quiz/elite-university-readiness/results-video';
  if (stored === 'simplified') return '/quiz/elite-university-readiness/results';
  
  // Random assignment (50/50)
  const variant = Math.random() < 0.5 ? 'video' : 'simplified';
  sessionStorage.setItem(RESULTS_LAYOUT_VARIANT_KEY, variant);
  
  // Track assignment to analytics
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'ab_test_assignment', {
      event_category: 'ab_testing',
      event_label: `results_layout_${variant}`,
      variant: variant
    });
  }
  
  return variant === 'video' 
    ? '/quiz/elite-university-readiness/results-video'
    : '/quiz/elite-university-readiness/results';
};

type QuizAnswer = Record<string, unknown>;

type ContactInfoAnswer = {
  firstName: string;
  lastName: string;
  studentFirstName?: string;
  email: string;
  phone: string;
  consent?: boolean;
};

type QuizAnswerValue = string | number | string[] | ContactInfoAnswer | undefined;

interface EliteUniversityReadinessQuizProps {
  resultVariant?: QuizVariant;
  skipOTP?: boolean; // If true, skip OTP verification and submit directly to GHL
}

export const EliteUniversityReadinessQuiz = ({ resultVariant = 'default', skipOTP = false }: EliteUniversityReadinessQuizProps) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [calculatedResults, setCalculatedResults] = useState<EliteUniversityReadinessResults | null>(null);
  const [quizSessionId, setQuizSessionId] = useState<string | null>(null);
  const [utmParams, setUtmParams] = useState<UTMParameters | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<number>(Date.now());

  const questions = ELITE_UNIVERSITY_QUESTIONS;
  const totalSteps = questions.length;

  useEffect(() => {
    if (typeof sessionStorage === 'undefined') return;
    if (resultVariant === 'embed') {
      sessionStorage.setItem(RESULT_VARIANT_STORAGE_KEY, 'embed');
    } else {
      sessionStorage.removeItem(RESULT_VARIANT_STORAGE_KEY);
    }
  }, [resultVariant]);

  useEffect(() => {
    // Generate unique session ID for tracking
    const sessionId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setQuizSessionId(sessionId);
    setQuizStartTime(Date.now());
    
    // Initialize comprehensive tracking
    initializeTracking();
    
    // Track page view
    const pageTitle =
      resultVariant === 'embed'
        ? 'Elite University Readiness Assessment – Empowerly Beta'
        : 'Elite University Readiness Assessment | ParentSimple';
    const pagePath =
      resultVariant === 'embed'
        ? '/quiz/elite-university-readiness/empowerly'
        : '/quiz/elite-university-readiness';
    trackPageView(pageTitle, pagePath);
    
    // Track quiz start
    trackQuizStart('elite_university_readiness', sessionId);
    
    console.log('🚀 Elite University Readiness Quiz Session Started:', { 
      sessionId,
      totalSteps,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    });

    // UTM Tracking - Extract and track UTM parameters
    const extractAndTrackUTM = async () => {
      const utmTracked = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('utm_tracked') : null;
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
        
        if (trackingSuccess && typeof sessionStorage !== 'undefined') {
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
  }, [resultVariant, totalSteps]);

  // Calculate readiness score when answers change
  useEffect(() => {
    const graduationYear = answers.graduation_year;
    if (typeof graduationYear === 'string' && Object.keys(answers).length >= 2) {
      const results = calculateEliteUniversityReadinessScore(answers, graduationYear);
      setCalculatedResults(results);
      console.log('📊 Readiness Score Calculated:', {
        totalScore: results.totalScore,
        category: results.category,
        breakdown: results.breakdown
      });
      
      // Track score calculation
      trackScoreCalculated(quizSessionId || 'unknown', results.totalScore, results.category);
    }
  }, [answers, quizSessionId]);

  const handleAnswer = async (answer: QuizAnswerValue) => {
    const currentQuestion = questions[currentStep];
    
    // Track question answer
    try {
      trackQuestionAnswer(
        currentQuestion.id, 
        answer, 
        currentStep + 1, 
        questions.length, 
        quizSessionId || 'unknown', 
        'elite_university_readiness'
      );
      
      // Track graduation year selection specifically
      if (currentQuestion.id === 'graduation_year') {
        trackGraduationYearSelected(quizSessionId || 'unknown', answer as string);
      }
    } catch (err) {
      console.error('Tracking error:', err);
    }
    
    console.log('📝 Quiz Answer Received:', {
      sessionId: quizSessionId,
      step: currentStep + 1,
      questionId: currentQuestion.id,
      questionTitle: currentQuestion.title,
      answer,
      timestamp: new Date().toISOString()
    });
    
    // Store answer
    const updatedAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(updatedAnswers);

    // Handle personal info submission - save email for retargeting
    if (currentQuestion.id === 'contact_info') {
      if (!answer || typeof answer !== 'object') {
        console.error('❌ Invalid contact info answer payload');
        return;
      }

      const contactInfo = answer as ContactInfoAnswer;
      console.log('📧 Personal Info Submitted - Capturing Email for Retargeting');
      
      const readinessScore = calculatedResults?.totalScore || 0;
      
      const emailCaptureData = {
        email: contactInfo.email,
        firstName: contactInfo.firstName,
        lastName: contactInfo.lastName,
        studentFirstName: contactInfo.studentFirstName,
        phoneNumber: contactInfo.phone,
        quizAnswers: updatedAnswers,
        sessionId: quizSessionId || 'unknown',
        funnelType: 'college_consulting',
        zipCode: null, // Not collected in this quiz
        state: null,
        stateName: null,
        licensingInfo: null,
        calculatedResults: calculatedResults,
        utmParams: utmParams,
        leadScore: readinessScore
      };

      try {
        const response = await fetch('/api/leads/capture-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailCaptureData)
        });

        let result: Record<string, unknown> = {};
        try {
          const text = await response.text();
          if (text) {
            try {
              result = JSON.parse(text);
            } catch {
              result = { raw: text, success: false, error: 'Invalid JSON response' };
            }
          }
        } catch (parseError) {
          console.warn('⚠️ Could not parse email capture response:', parseError);
          result = { success: false, error: 'Failed to parse response' };
        }

        if (response.ok && result.success) {
          console.log('✅ Email Captured for Retargeting:', { eventId: result.eventId, email: contactInfo.email });
          
          // Track quiz completion
          try {
            const completionTime = Math.round((Date.now() - quizStartTime) / 1000); // Convert to seconds
            trackQuizComplete(
              'elite_university_readiness',
              quizSessionId || 'unknown',
              'college_consulting',
              completionTime
            );
          } catch (err) {
            console.error('Tracking error (quiz complete):', err);
          }
          
          // Track lead form submit
          const leadData: LeadData = {
            firstName: contactInfo.firstName,
            lastName: contactInfo.lastName,
            email: contactInfo.email,
            phoneNumber: contactInfo.phone,
            zipCode: '',
            state: '',
            stateName: '',
            quizAnswers: updatedAnswers,
            sessionId: quizSessionId || 'unknown',
            funnelType: 'college_consulting',
            leadScore: readinessScore,
            householdIncome: (typeof updatedAnswers?.household_income === 'string' ? updatedAnswers.household_income : undefined) // Include household income for tracking
          };
          trackLeadFormSubmit(leadData);
        } else {
          console.error('❌ Email Capture Failed:', result);
        }
      } catch (error) {
        console.error('💥 Email Capture Exception:', error);
      }
      
      // If skipOTP is true, submit directly without OTP verification
      if (skipOTP) {
        console.log('📝 Skipping OTP - Submitting directly to GHL:', {
          sessionId: quizSessionId || 'unknown',
          phoneNumber: contactInfo.phone,
          timestamp: new Date().toISOString()
        });
        
        try {
          // Use submit-without-otp route that handles database save + GHL webhook without OTP
          const response = await fetch('/api/leads/submit-without-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: contactInfo.email,
              phoneNumber: contactInfo.phone,
              firstName: contactInfo.firstName,
              lastName: contactInfo.lastName,
              studentFirstName: contactInfo.studentFirstName,
              quizAnswers: updatedAnswers,
              calculatedResults: calculatedResults,
              zipCode: null, // Not collected in this quiz
              state: null,
              stateName: null,
              licensingInfo: null,
              utmParams: utmParams,
              sessionId: quizSessionId || 'unknown',
              funnelType: 'college_consulting'
            })
          });

          let result: Record<string, unknown> = {};
          try {
            const text = await response.text();
            if (text) {
              try {
                result = JSON.parse(text);
              } catch {
                result = { raw: text, success: false, error: 'Invalid JSON response' };
              }
            }
          } catch (parseError) {
            console.warn('⚠️ Could not parse submit response:', parseError);
            result = { success: false, error: 'Failed to parse response' };
          }

          if (response.ok && result.success) {
            console.log('✅ Lead Submitted Successfully (No OTP):', { leadId: result.leadId, email: contactInfo.email });
            
            // Store results in sessionStorage for results page
            if (typeof sessionStorage !== 'undefined' && calculatedResults) {
              sessionStorage.setItem('elite_university_readiness_results', JSON.stringify({
                ...calculatedResults,
                graduationYear: answers.graduation_year as string
              }));
            }
            
            // Route to results page with score and category (A/B test routing)
            const readinessScore = calculatedResults?.totalScore || 0;
            const category = calculatedResults?.category || 'Needs Improvement';
            const resultsRoute = getResultsRoute();
            router.push(`${resultsRoute}?score=${readinessScore}&category=${encodeURIComponent(category)}`);
          } else {
            console.error('❌ Submit Failed:', result);
            // Still route to results page even if webhook fails (lead was saved)
            if (typeof sessionStorage !== 'undefined' && calculatedResults) {
              sessionStorage.setItem('elite_university_readiness_results', JSON.stringify({
                ...calculatedResults,
                graduationYear: answers.graduation_year as string
              }));
            }
            const readinessScore = calculatedResults?.totalScore || 0;
            const category = calculatedResults?.category || 'Needs Improvement';
            const resultsRoute = getResultsRoute();
            router.push(`${resultsRoute}?score=${readinessScore}&category=${encodeURIComponent(category)}`);
          }
        } catch (error) {
          console.error('💥 Submit Exception:', error);
          // Route to results page even on error
          if (typeof sessionStorage !== 'undefined' && calculatedResults) {
            sessionStorage.setItem('elite_university_readiness_results', JSON.stringify({
              ...calculatedResults,
              graduationYear: answers.graduation_year as string
            }));
          }
          const readinessScore = calculatedResults?.totalScore || 0;
          const category = calculatedResults?.category || 'Needs Improvement';
          const resultsRoute = getResultsRoute();
          router.push(`${resultsRoute}?score=${readinessScore}&category=${encodeURIComponent(category)}`);
        }
        
        return;
      }
      
      // Store quiz data in sessionStorage before routing to OTP page
      console.log('📱 Personal Info Complete - Routing to OTP Page:', {
        sessionId: quizSessionId || 'unknown',
        phoneNumber: contactInfo.phone,
        timestamp: new Date().toISOString()
      });
      
      // Store all necessary data for OTP page
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem('elite_university_quiz_data', JSON.stringify({
          answers: updatedAnswers,
          calculatedResults: calculatedResults,
          quizSessionId: quizSessionId,
          utmParams: utmParams,
          quizStartTime: quizStartTime
        }));
      }
      
      // Route to separate OTP verification page
      router.push('/quiz/elite-university-readiness/verify-otp');
      return;
    }

    // Auto-advance for multiple-choice questions (tap to continue)
    if (currentQuestion.type === 'multiple-choice' && typeof answer === 'string' && answer) {
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 300);
      return;
    }

    // Auto-advance for slider and multi-select after explicit continue
    if (currentQuestion.type === 'slider' && typeof answer === 'number') {
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 150);
      return;
    }

    if (currentQuestion.type === 'multi-select' && Array.isArray(answer)) {
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 150);
      return;
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen bg-[#F9F6EF]">
      <QuizProgress currentStep={currentStep} totalSteps={totalSteps} />
      <div className="mt-8">
        <QuizQuestion
          question={currentQuestion}
          onAnswer={handleAnswer}
          currentAnswer={answers[currentQuestion.id]}
        />
      </div>
    </div>
  );
};

