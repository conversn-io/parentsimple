'use client'

import { useState, useEffect } from 'react';
import { QuizProgress } from './QuizProgress';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
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
import { formatPhoneForGHL } from '@/utils/phone-utils';

interface QuizAnswer {
  [key: string]: any;
}

type FunnelType = 'primary' | 'secondary';

// Primary funnel for investors with assets
const PRIMARY_QUIZ_QUESTIONS = [
  {
    id: 'ageRange',
    title: 'What is your current age range?',
    subtitle: 'This helps us recommend the right strategy for your timeline',
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
    subtitle: 'This helps us recommend the right investment strategy',
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
    subtitle: 'This helps us recommend appropriate investment strategies',
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
    id: 'locationInfo',
    title: 'What\'s your ZIP code?',
    subtitle: 'This helps us provide state-specific guidance and connect you with licensed professionals in your area',
    type: 'location-info' as const,
  },
  {
    id: 'personalInfo',
    title: 'Let\'s get your contact information',
    subtitle: 'We\'ll use this to send you personalized recommendations',
    type: 'personal-info' as const,
  },
];

// Secondary funnel for those with less assets
const SECONDARY_QUIZ_QUESTIONS = [
  {
    id: 'ageRange',
    title: 'What is your current age range?',
    subtitle: 'This helps us recommend the right strategy for your timeline',
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
    subtitle: 'This helps us recommend the right savings strategy',
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
    subtitle: 'This helps us recommend appropriate savings strategies',
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
    defaultValue: 75000,
    unit: '$',
  },
  {
    id: 'locationInfo',
    title: 'What\'s your ZIP code?',
    subtitle: 'This helps us provide state-specific guidance and connect you with licensed professionals in your area',
    type: 'location-info' as const,
  },
  {
    id: 'personalInfo',
    title: 'Let\'s get your contact information',
    subtitle: 'We\'ll use this to send you personalized recommendations',
    type: 'personal-info' as const,
  },
];

interface AnnuityQuizProps {
  skipOTP?: boolean;
}

export const AnnuityQuiz = ({ skipOTP = false }: AnnuityQuizProps) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer>({});
  const [funnelType, setFunnelType] = useState<FunnelType>('primary');
  const [showResults, setShowResults] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [quizSessionId, setQuizSessionId] = useState<string | null>(null);
  const [utmParams, setUtmParams] = useState<UTMParameters | null>(null);

  // Filter questions based on conditional logic
  const getFilteredQuestions = () => {
    const baseQuestions = funnelType === 'primary' ? PRIMARY_QUIZ_QUESTIONS : SECONDARY_QUIZ_QUESTIONS;
    
    // Skip allocation slider if savings < $100k
    if (answers.retirementSavings && answers.retirementSavings < 100000) {
      return baseQuestions.filter(q => q.id !== 'allocationPercent');
    }
    
    return baseQuestions;
  };

  const questions = getFilteredQuestions();
  const totalSteps = questions.length;

  useEffect(() => {
    // Generate unique session ID for tracking
    const sessionId = `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setQuizSessionId(sessionId);
    
    // Initialize comprehensive tracking
    initializeTracking();
    
    // Track page view
    trackPageView('SeniorSimple Retirement Quiz', '/quiz');
    
    // Track quiz start
    trackQuizStart('annuity', sessionId);
    
    // Send CAPI ViewContent event (multi-site)
    sendCAPIViewContentEventMultiSite({
      quizType: 'annuity',
      sessionId: sessionId
    });
    
    console.log('🚀 Quiz Session Started:', { 
      sessionId,
      funnelType, 
      totalSteps,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    // UTM Tracking - Extract and track UTM parameters (following your proven pattern)
    const extractAndTrackUTM = async () => {
      // Check if we've already tracked UTM for this session
      const utmTracked = sessionStorage.getItem('utm_tracked');
      if (utmTracked === 'true') {
        console.log('📊 UTM Already Tracked for This Session');
        const storedUtm = getStoredUTMParameters();
        if (storedUtm) {
          setUtmParams(storedUtm);
        }
        return;
      }

      // Extract UTM parameters from URL
      const utmData = extractUTMParameters();
      
      if (hasUTMParameters(utmData)) {
        console.log('📊 UTM Parameters Found:', utmData);
        setUtmParams(utmData);
        storeUTMParameters(utmData);
        
        // Track UTM parameters using existing track-utm function
        const trackingSuccess = await trackUTMParameters(sessionId, utmData);
        
        if (trackingSuccess) {
          // Mark as tracked to prevent duplicate sends
          sessionStorage.setItem('utm_tracked', 'true');
          console.log('✅ UTM Parameters Tracked Successfully');
        } else {
          console.error('❌ UTM Tracking Failed');
        }
      } else {
        console.log('📊 No UTM Parameters Found in URL');
        // Check for stored UTM parameters from previous session
        const storedUtm = getStoredUTMParameters();
        if (storedUtm) {
          setUtmParams(storedUtm);
          console.log('📊 Using Stored UTM Parameters:', storedUtm);
        }
      }
    };

    extractAndTrackUTM();
  }, [funnelType, totalSteps]);

  const handleAnswer = async (answer: any) => {
    const currentQuestion = questions[currentStep];
    
    // Track question answer
    try {
      trackQuestionAnswer(currentQuestion.id, answer, currentStep + 1, questions.length, quizSessionId || 'unknown', 'medicare');
    } catch {}
    
    console.log('📝 Quiz Answer Received:', {
      sessionId: quizSessionId,
      step: currentStep + 1,
      questionId: currentQuestion.id,
      questionTitle: currentQuestion.title,
      answer: answer,
      answerType: typeof answer,
      timestamp: new Date().toISOString()
    });
    
    // Handle funnel routing
    if (currentQuestion.id === 'investableAssets') {
      if (answer === 'No, I have less than $100,000') {
        console.log('🔄 Funnel Switch: Primary → Secondary', {
          sessionId: quizSessionId,
          reason: 'Assets below $100k threshold',
          timestamp: new Date().toISOString()
        });
        setFunnelType('secondary');
        setCurrentStep(0); // Reset to first question of secondary funnel
        setAnswers({});
        return;
      }
    }

    // Store answer first
    const updatedAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(updatedAnswers);

    // Handle personal info submission - save email for retargeting
    if (currentQuestion.id === 'personalInfo') {
      console.log('📧 Personal Info Submitted - Capturing Email for Retargeting');
      
      const emailCaptureData = {
        email: answer.email,
        firstName: answer.firstName,
        lastName: answer.lastName,
        phoneNumber: answer.phone, // Now included in consolidated form
        quizAnswers: updatedAnswers,
        sessionId: quizSessionId || 'unknown',
        funnelType: funnelType,
        zipCode: updatedAnswers.locationInfo?.zipCode,
        state: updatedAnswers.locationInfo?.state,
        stateName: updatedAnswers.locationInfo?.stateName,
        licensingInfo: updatedAnswers.locationInfo?.licensing,
        utmParams: utmParams // Include UTM parameters
      };

      try {
        const response = await fetch(buildApiUrl('/api/leads/capture-email'), {
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
        } else {
          const errorDetails = {
            status: response.status,
            statusText: response.statusText,
            error: result.error || result.message || result.details || 'Unknown error',
            details: result.details || result.code || 'No additional details',
            response: result,
            url: buildApiUrl('/api/leads/capture-email')
          };
          console.error('❌ Email Capture Failed:', errorDetails);
        }
      } catch (error: any) {
        const errorDetails = {
          error: error.message || String(error),
          stack: error.stack,
          name: error.name,
          emailCaptureData: {
            email: emailCaptureData.email,
            sessionId: emailCaptureData.sessionId,
            funnelType: emailCaptureData.funnelType
          }
        };
        console.error('💥 Email Capture Exception:', errorDetails);
      }
      
      // Branch based on skipOTP prop
      if (skipOTP) {
        // NO OTP FLOW: Send directly to GHL
        console.log('🚀 No OTP Flow - Sending directly to GHL:', {
          sessionId: quizSessionId || 'unknown',
          phoneNumber: answer.phone,
          timestamp: new Date().toISOString()
        });
        
        // Store quiz answers for personalized thank you page
        sessionStorage.setItem('quiz_answers', JSON.stringify(updatedAnswers));
        
        // Process lead and send to GHL directly
        await processLeadAndSendToGHL({
          contact: {
            email: answer.email,
            phone: answer.phone,
            firstName: answer.firstName,
            lastName: answer.lastName
          },
          quizAnswers: updatedAnswers,
          calculatedResults: calculateResults(),
          zipCode: updatedAnswers.locationInfo?.zipCode,
          state: updatedAnswers.locationInfo?.state,
          stateName: updatedAnswers.locationInfo?.stateName,
          utmParams: utmParams,
          sessionId: quizSessionId || 'unknown'
        });
        
        setShowResults(true);
        console.log('✅ No OTP Flow Complete - Results shown');
      } else {
        // OTP FLOW: Show OTP verification
        console.log('📱 Personal Info Complete - Initiating OTP Flow:', {
          sessionId: quizSessionId || 'unknown',
          phoneNumber: answer.phone,
          timestamp: new Date().toISOString()
        });
        
        setShowOTP(true);
        console.log('🔐 OTP State Set to True - Should show OTP verification next');
      }
      return;
    }

    
    // Check if this is the last question
    if (currentStep === questions.length - 1) {
      console.log('🏁 Quiz Completed - All Questions Answered:', {
        sessionId: quizSessionId,
        totalSteps,
        allAnswers: updatedAnswers,
        timestamp: new Date().toISOString()
      });
      // Quiz completed, show results
      setShowResults(true);
      calculateResults();
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

  const calculateResults = () => {
    console.log('🧮 Calculating Quiz Results:', {
      sessionId: quizSessionId,
      answers,
      funnelType,
      timestamp: new Date().toISOString()
    });

    // Track quiz completion
    try {
      const completionTime = Date.now() - ((window as any).quizStartTime || Date.now());
      trackQuizComplete('annuity', quizSessionId || 'unknown', 'medicare', completionTime);
    } catch {}

    // Calculate projected monthly income based on answers
    const retirementSavings = answers.retirementSavings;
    let projectedMonthlyIncomeMin = 0;
    let projectedMonthlyIncomeMax = 0;

    // Simple calculation based on retirement savings
    switch (retirementSavings) {
      case '$1,000,000+':
        projectedMonthlyIncomeMin = 4000;
        projectedMonthlyIncomeMax = 6000;
        break;
      case '$750,000 - $999,999':
        projectedMonthlyIncomeMin = 3000;
        projectedMonthlyIncomeMax = 4500;
        break;
      case '$500,000 - $749,999':
        projectedMonthlyIncomeMin = 2000;
        projectedMonthlyIncomeMax = 3500;
        break;
      case '$250,000 - $499,999':
        projectedMonthlyIncomeMin = 1000;
        projectedMonthlyIncomeMax = 2500;
        break;
      case '$100,000 - $249,999':
        projectedMonthlyIncomeMin = 500;
        projectedMonthlyIncomeMax = 1500;
        break;
      default:
        projectedMonthlyIncomeMin = 300;
        projectedMonthlyIncomeMax = 800;
    }

    const calculatedResults = {
      projected_monthly_income_min: projectedMonthlyIncomeMin,
      projected_monthly_income_max: projectedMonthlyIncomeMax
    };

    console.log('✅ Quiz Results Calculated:', {
      sessionId: quizSessionId,
      calculatedResults,
      timestamp: new Date().toISOString()
    });

    return calculatedResults;
  };

  const processLeadAndSendToGHL = async (data: {
    contact: {
      email: string;
      phone: string;
      firstName: string;
      lastName: string;
    };
    quizAnswers: QuizAnswer;
    calculatedResults: any;
    zipCode?: string;
    state?: string;
    stateName?: string;
    utmParams: any;
    sessionId: string;
  }) => {
    console.log('🚀 Processing Lead and Sending to GHL:', {
      sessionId: data.sessionId,
      timestamp: new Date().toISOString()
    });

    setShowProcessing(true);

    try {
      // Call server-side proxy to Supabase Edge Function
      const edgeFunctionUrl = '/api/process-lead';
      
      console.log('🚀 Calling Supabase Edge Function:', {
        url: edgeFunctionUrl,
        sessionId: data.sessionId,
        timestamp: new Date().toISOString()
      });

      const edgeResponse = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          site_key: 'SENIORSIMPLE',
          funnel_type: funnelType,
          session_id: data.sessionId,
          user_id: data.contact.email,
          contact: {
            email: data.contact.email,
            phone: formatPhoneForGHL(data.contact.phone),
            first_name: data.contact.firstName,
            last_name: data.contact.lastName
          },
          quiz_answers: data.quizAnswers,
          lead_score: 75, // Default lead score - Edge Function will calculate proper score
          utm_source: data.utmParams?.utm_source,
          utm_medium: data.utmParams?.utm_medium,
          utm_campaign: data.utmParams?.utm_campaign,
          zip_code: data.zipCode,
          state: data.state,
          state_name: data.stateName,
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
          sessionId: data.sessionId,
          timestamp: new Date().toISOString()
        });

        // Fire direct client-side GHL webhook in parallel for speed
        const ghlUrl = process.env.NEXT_PUBLIC_GHL_WEBHOOK_SENIORSIMPLE || 'https://services.leadconnectorhq.com/hooks/vTM82D7FNpIlnPgw6XNC/webhook-trigger/28ef726d-7ead-4cd2-aa85-dfc6192adfb6';
        try {
          // Format phone with +1 for GHL webhook
          const formattedPhone = formatPhoneForGHL(data.contact.phone);
          const ghlPayload = {
            firstName: data.contact.firstName,
            lastName: data.contact.lastName,
            email: data.contact.email,
            phone: formattedPhone,
            zipCode: data.zipCode,
            state: data.state,
            stateName: data.stateName,
            source: 'SeniorSimple Quiz',
            funnelType: funnelType,
            sessionId: data.sessionId,
            leadScore: data.calculatedResults.leadScore,
            quizAnswers: data.quizAnswers,
            utmSource: data.utmParams?.utm_source,
            utmMedium: data.utmParams?.utm_medium,
            utmCampaign: data.utmParams?.utm_campaign,
            timestamp: new Date().toISOString()
          };

          console.log('📡 Sending to GHL Webhook:', {
            url: ghlUrl,
            payload: ghlPayload,
            timestamp: new Date().toISOString()
          });

          // Create abort controller for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          const ghlResponse = await fetch(ghlUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ghlPayload),
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);

          let ghlResponseData: any = {};
          try {
            const text = await ghlResponse.text();
            if (text) {
              try {
                ghlResponseData = JSON.parse(text);
              } catch {
                ghlResponseData = { raw: text };
              }
            }
          } catch (parseError) {
            console.warn('⚠️ Could not parse GHL response:', parseError);
          }

          if (ghlResponse.ok) {
            console.log('✅ GHL Webhook Success:', {
              status: ghlResponse.status,
              statusText: ghlResponse.statusText,
              response: ghlResponseData,
              sessionId: data.sessionId,
              timestamp: new Date().toISOString()
            });
          } else {
            const errorDetails = {
              status: ghlResponse.status,
              statusText: ghlResponse.statusText,
              response: ghlResponseData,
              error: ghlResponseData?.error || ghlResponseData?.message || 'Unknown GHL error',
              details: ghlResponseData?.details || ghlResponseData?.raw || 'No additional details',
              payload: {
                firstName: ghlPayload.firstName,
                email: ghlPayload.email,
                phone: ghlPayload.phone ? '***' : undefined,
                sessionId: ghlPayload.sessionId
              },
              url: ghlUrl,
              sessionId: data.sessionId,
              timestamp: new Date().toISOString()
            };
            console.error('❌ GHL Webhook Failed:', errorDetails);
          }
        } catch (ghlError: any) {
          const errorDetails = {
            error: ghlError?.message || String(ghlError),
            name: ghlError?.name,
            stack: ghlError?.stack,
            code: ghlError?.code,
            url: ghlUrl,
            sessionId: data.sessionId,
            timestamp: new Date().toISOString()
          };
          console.error('💥 GHL Webhook Exception:', errorDetails);
        }

        setShowProcessing(false);
        
        // Store quiz answers for personalized thank you page
        sessionStorage.setItem('quiz_answers', JSON.stringify(data.quizAnswers));
        
        setShowResults(true);
        console.log('🎯 Lead Processing Complete - Results shown');
      } else {
        console.error('❌ Edge Function Failed:', {
          status: edgeResponse.status,
          statusText: edgeResponse.statusText,
          result: edgeResult,
          sessionId: data.sessionId,
          timestamp: new Date().toISOString()
        });
        
        // Store quiz answers even on failure
        sessionStorage.setItem('quiz_answers', JSON.stringify(data.quizAnswers));
        
        setShowProcessing(false);
        setShowResults(true); // Still show results even if GHL fails
      }
    } catch (error) {
      console.error('💥 Lead Processing Exception:', {
        error,
        sessionId: data.sessionId,
        timestamp: new Date().toISOString()
      });
      
      // Store quiz answers even on exception
      try {
        sessionStorage.setItem('quiz_answers', JSON.stringify(data.quizAnswers));
      } catch (storageError) {
        console.warn('⚠️ Could not store quiz answers:', storageError);
      }
      
      setShowProcessing(false);
      setShowResults(true); // Still show results even if processing fails
    }
  };

  const handleOTPVerification = async () => {
    console.log('🔐 OTP Verification Complete - Sending to GHL:', {
      sessionId: quizSessionId,
      phoneNumber: answers.personalInfo?.phone,
      timestamp: new Date().toISOString()
    });

    setShowOTP(false);

    // Use the same processLeadAndSendToGHL function for consistency
    await processLeadAndSendToGHL({
      contact: {
        email: answers.personalInfo?.email || '',
        phone: answers.personalInfo?.phone || '',
        firstName: answers.personalInfo?.firstName || '',
        lastName: answers.personalInfo?.lastName || ''
      },
      quizAnswers: answers,
      calculatedResults: calculateResults(),
      zipCode: answers.locationInfo?.zipCode,
      state: answers.locationInfo?.state,
      stateName: answers.locationInfo?.stateName,
      utmParams: utmParams,
      sessionId: quizSessionId || 'unknown'
    });
  };

  const submitQuizToDatabase = async () => {
    console.log('📤 Starting Lead Submission to Database:', {
      sessionId: quizSessionId,
      timestamp: new Date().toISOString()
    });

    try {
      const calculatedResults = calculateResults();
      
      // Extract location data from answers
      const locationData = answers.locationInfo || {};
      
      const leadData = {
        contact_info: {
          first_name: answers.personalInfo?.firstName || answers.firstName,
          last_name: answers.personalInfo?.lastName || answers.lastName,
          email: answers.personalInfo?.email || answers.email,
          phone: answers.personalInfo?.phone || answers.phone || '',
          zip_code: locationData.zipCode || answers.zipCode,
          state: locationData.state || '',
          state_name: locationData.stateName || '',
          address: locationData.address || '',
          city: locationData.city || ''
        },
        quiz_answers: answers,
        calculated_results: calculatedResults,
        lead_score: 75, // Default lead score
        licensing_info: locationData.licensing || {},
        funnel_type: funnelType,
        quiz_session_id: quizSessionId
      };

      console.log('📊 Lead Data Prepared for Submission:', {
        sessionId: quizSessionId,
        leadData,
        timestamp: new Date().toISOString()
      });

      // Track lead form submission
      const trackingLeadData: LeadData = {
        firstName: leadData.contact_info.first_name,
        lastName: leadData.contact_info.last_name,
        email: leadData.contact_info.email,
        phoneNumber: leadData.contact_info.phone,
        zipCode: leadData.contact_info.zip_code,
        state: leadData.contact_info.state,
        stateName: leadData.contact_info.state_name,
        quizAnswers: answers,
        sessionId: quizSessionId || 'unknown',
        funnelType: 'annuity',
        leadScore: leadData.lead_score
      };

      trackLeadFormSubmit(trackingLeadData);
      sendCAPILeadEventMultiSite(trackingLeadData);

      // TODO: Implement actual Supabase submission
      // For now, just log the data - we'll implement proper submission later
      console.log('⚠️ Lead Data Logged (Not Submitted to Database Yet):', leadData);

      console.log('✅ Lead Submission Process Complete:', {
        sessionId: quizSessionId,
        success: true,
        timestamp: new Date().toISOString()
      });

      // Add delay to allow GTM to process tracking events before redirect
      console.log('⏳ Waiting for GTM to process tracking events...');
      setTimeout(() => {
        setShowProcessing(false);
        setShowResults(true);
        
        // Store quiz answers for personalized thank you message
        sessionStorage.setItem('quiz_answers', JSON.stringify(answers));
        
        try { router.push('/quiz-submitted'); } catch {}
      }, 2000); // 2 second delay
    } catch (error) {
      console.error('💥 Lead Submission Error:', {
        sessionId: quizSessionId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      setShowProcessing(false);
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    console.log('🔄 Quiz Restart Initiated:', {
      sessionId: quizSessionId,
      timestamp: new Date().toISOString()
    });

    setCurrentStep(0);
    setAnswers({});
    setFunnelType('primary');
    setShowResults(false);
    setShowOTP(false);
    setShowProcessing(false);
    setQuizSessionId(null);
  };

  // Handle redirect to quiz-submitted page when showResults is true
  // IMPORTANT: This hook MUST come before any conditional returns to avoid React hooks errors
  useEffect(() => {
    if (showResults) {
      console.log('🎯 Redirecting to Quiz Submitted Page:', {
        sessionId: quizSessionId,
        timestamp: new Date().toISOString()
      });
      // Use setTimeout to avoid React state update during render
      const timeoutId = setTimeout(() => {
        router.push('/quiz-submitted');
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [showResults, router, quizSessionId]);

  if (showProcessing) {
    console.log('⏳ Showing Processing State:', {
      sessionId: quizSessionId,
      timestamp: new Date().toISOString()
    });
    return <ProcessingState message="Processing your information..." />;
  }

  if (showOTP) {
    const phoneNumber = answers.personalInfo?.phone || '';
    if (!phoneNumber) {
      console.error('❌ OTP Error: Phone number missing from answers', {
        answers,
        personalInfo: answers.personalInfo
      });
      // Fallback: don't show OTP if phone is missing
      setShowOTP(false);
      return null;
    }
    
    console.log('📱 Showing OTP Verification:', {
      sessionId: quizSessionId,
      phoneNumber,
      showOTP: true,
      timestamp: new Date().toISOString()
    });
    return (
      <OTPVerification
        phoneNumber={phoneNumber}
        onVerificationComplete={handleOTPVerification}
        onBack={() => setShowOTP(false)}
      />
    );
  }

  if (showResults) {
    // Show loading state while redirecting to quiz-submitted page
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#36596A] mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Redirecting...</p>
      </div>
    );
  }

  console.log('📋 Rendering Quiz Question:', {
    sessionId: quizSessionId,
    currentStep: currentStep + 1,
    totalSteps,
    questionId: questions[currentStep].id,
    questionTitle: questions[currentStep].title,
    showOTP: showOTP,
    showResults: showResults,
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