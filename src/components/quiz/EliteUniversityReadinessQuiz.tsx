'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QuizProgress } from './QuizProgress';
import { QuizQuestion } from './QuizQuestion';
import { ProcessingState } from './ProcessingState';
import { 
  initializeTracking, 
  trackQuestionAnswer, 
  trackLeadFormSubmit, 
  trackPageView, 
  trackQuizStart, 
  trackQuizComplete,
  trackGraduationYearSelected,
  trackScoreCalculated,
  LeadData
} from '@/lib/temp-tracking';
import { extractUTMParameters, storeUTMParameters, getStoredUTMParameters, hasUTMParameters, UTMParameters } from '@/utils/utm-utils';
import { trackUTMParameters } from '@/utils/utm-tracker';
import { ELITE_UNIVERSITY_QUESTIONS } from '@/data/elite-university-questions';
import { calculateEliteUniversityReadinessScore } from '@/utils/elite-university-scoring';

interface QuizAnswer {
  [key: string]: any;
}

export const EliteUniversityReadinessQuiz = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [calculatedResults, setCalculatedResults] = useState<any>(null);
  const [showProcessing, setShowProcessing] = useState(false);
  const [quizSessionId, setQuizSessionId] = useState<string | null>(null);
  const [utmParams, setUtmParams] = useState<UTMParameters | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<number>(Date.now());

  const questions = ELITE_UNIVERSITY_QUESTIONS;
  const totalSteps = questions.length;

  useEffect(() => {
    // Generate unique session ID for tracking
    const sessionId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setQuizSessionId(sessionId);
    setQuizStartTime(Date.now());
    
    // Initialize comprehensive tracking
    initializeTracking();
    
    // Track page view
    trackPageView('ParentSimple Elite University Readiness Assessment', '/quiz/elite-university-readiness');
    
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
  }, [totalSteps]);

  // Calculate readiness score when answers change
  useEffect(() => {
    if (answers.graduation_year && Object.keys(answers).length >= 2) {
      const results = calculateEliteUniversityReadinessScore(
        answers,
        answers.graduation_year
      );
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

  const handleAnswer = async (answer: any) => {
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
        trackGraduationYearSelected(quizSessionId || 'unknown', answer);
      }
    } catch (err) {
      console.error('Tracking error:', err);
    }
    
    console.log('📝 Quiz Answer Received:', {
      sessionId: quizSessionId,
      step: currentStep + 1,
      questionId: currentQuestion.id,
      questionTitle: currentQuestion.title,
      answer: answer,
      timestamp: new Date().toISOString()
    });
    
    // Store answer
    const updatedAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(updatedAnswers);

    // Handle personal info submission - save email for retargeting
    if (currentQuestion.id === 'contact_info') {
      console.log('📧 Personal Info Submitted - Capturing Email for Retargeting');
      
      const readinessScore = calculatedResults?.totalScore || 0;
      
      const emailCaptureData = {
        email: answer.email,
        firstName: answer.firstName,
        lastName: answer.lastName,
        phoneNumber: answer.phone,
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

        let result: any = {};
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
          console.log('✅ Email Captured for Retargeting:', { eventId: result.eventId, email: answer.email });
          
          // Track lead form submit
          const leadData: LeadData = {
            firstName: answer.firstName,
            lastName: answer.lastName,
            email: answer.email,
            phoneNumber: answer.phone,
            zipCode: '',
            state: '',
            stateName: '',
            quizAnswers: updatedAnswers,
            sessionId: quizSessionId || 'unknown',
            funnelType: 'college_consulting',
            leadScore: readinessScore
          };
          trackLeadFormSubmit(leadData);
        } else {
          console.error('❌ Email Capture Failed:', result);
        }
      } catch (error: any) {
        console.error('💥 Email Capture Exception:', error);
      }
      
      // Store quiz data in sessionStorage before routing to OTP page
      console.log('📱 Personal Info Complete - Routing to OTP Page:', {
        sessionId: quizSessionId || 'unknown',
        phoneNumber: answer.phone,
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
    if (currentQuestion.type === 'multiple-choice' && answer) {
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 300);
      return;
    }

    // Auto-advance for slider and multi-select after explicit continue
    if (
      (currentQuestion.type === 'slider' || currentQuestion.type === 'multi-select') &&
      typeof answer !== 'undefined'
    ) {
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 150);
      return;
    }
  };


  if (showProcessing) {
    return (
      <div className="min-h-screen bg-[#F9F6EF] flex justify-center items-start px-4 pt-8 pb-10">
        <ProcessingState 
          message="We're processing your information and preparing your personalized readiness report..." 
          isComplete={false}
        />
      </div>
    );
  }


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

