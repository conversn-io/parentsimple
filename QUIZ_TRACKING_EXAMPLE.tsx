/**
 * ParentSimple Quiz Component - Tracking Integration Example
 * 
 * This example shows how to integrate unified tracking into quiz components
 * Following SeniorSimple/RateRoots proven patterns
 */

import { useEffect, useState, useRef } from 'react';
import {
  trackQuizStart,
  trackQuizStepViewed,
  trackQuestionAnswer,
  trackEmailCapture,
  trackQuizComplete,
  trackLeadFormSubmit,
  getSessionId
} from '@/lib/unified-tracking';

interface QuizProps {
  funnelType: string; // e.g., 'life_insurance_ca'
}

export function LifeInsuranceQuiz({ funnelType }: QuizProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [email, setEmail] = useState('');
  const sessionId = getSessionId();
  const quizStartTime = useRef<number>(Date.now());
  const stepStartTime = useRef<number>(Date.now());
  const previousStep = useRef<string | null>(null);

  const totalSteps = 8; // Adjust based on your quiz

  // Step configuration
  const steps = [
    { number: 1, name: 'coverage_type', label: 'What type of coverage?' },
    { number: 2, name: 'coverage_amount', label: 'How much coverage?' },
    { number: 3, name: 'age_range', label: 'Your age range?' },
    { number: 4, name: 'gender', label: 'Gender?' },
    { number: 5, name: 'smoker', label: 'Do you smoke?' },
    { number: 6, name: 'health_conditions', label: 'Health conditions?' },
    { number: 7, name: 'email_capture', label: 'Your email?' },
    { number: 8, name: 'phone_capture', label: 'Your phone?' },
  ];

  // Track quiz start on mount
  useEffect(() => {
    console.log('📊 Quiz Component Mounted - Tracking Start');
    trackQuizStart('life_insurance_ca', sessionId, funnelType);
    
    // Track first step view
    trackQuizStepViewed(
      1,
      steps[0].name,
      sessionId,
      funnelType,
      null, // no previous step
      null  // no time on previous step
    );
    
    quizStartTime.current = Date.now();
    stepStartTime.current = Date.now();
  }, []);

  // Track step changes
  useEffect(() => {
    if (currentStep > 1) {
      const currentStepInfo = steps[currentStep - 1];
      const previousStepInfo = steps[currentStep - 2];
      const timeOnPreviousStep = Math.floor((Date.now() - stepStartTime.current) / 1000);

      console.log('📊 Step Changed - Tracking View:', {
        step: currentStep,
        name: currentStepInfo.name,
        previous: previousStepInfo.name,
        timeSpent: timeOnPreviousStep
      });

      trackQuizStepViewed(
        currentStep,
        currentStepInfo.name,
        sessionId,
        funnelType,
        previousStepInfo.name,
        timeOnPreviousStep
      );

      stepStartTime.current = Date.now();
      previousStep.current = previousStepInfo.name;
    }
  }, [currentStep]);

  // Handle answer selection
  const handleAnswer = (questionId: string, answer: any) => {
    console.log('📊 Answer Selected:', { questionId, answer });

    // Save answer to state
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Track the answer
    trackQuestionAnswer(
      questionId,
      answer,
      currentStep,
      totalSteps,
      sessionId,
      funnelType
    );

    // Move to next step (after short delay for UX)
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 300);
  };

  // Handle email capture
  const handleEmailSubmit = (emailValue: string) => {
    console.log('📊 Email Captured:', emailValue);
    
    setEmail(emailValue);
    
    // Track email capture
    trackEmailCapture(emailValue, sessionId, funnelType);
    
    // Move to next step
    setCurrentStep(prev => prev + 1);
  };

  // Handle quiz completion (after phone/OTP)
  const handleQuizComplete = () => {
    const completionTime = Math.floor((Date.now() - quizStartTime.current) / 1000);
    
    console.log('📊 Quiz Completed:', {
      completionTime,
      totalAnswers: Object.keys(quizAnswers).length
    });

    trackQuizComplete(
      'life_insurance_ca',
      sessionId,
      funnelType,
      completionTime
    );
  };

  // Handle final lead submission (after OTP verification)
  const handleLeadSubmit = (leadData: any) => {
    console.log('📊 Lead Form Submit:', leadData);
    
    trackLeadFormSubmit({
      ...leadData,
      quizAnswers,
      sessionId,
      funnelType
    });
  };

  // Render current step
  const renderStep = () => {
    const currentStepInfo = steps[currentStep - 1];

    switch (currentStepInfo.name) {
      case 'coverage_type':
        return (
          <div>
            <h2>What type of coverage are you looking for?</h2>
            <button onClick={() => handleAnswer('coverage_type', 'term_life')}>
              Term Life Insurance
            </button>
            <button onClick={() => handleAnswer('coverage_type', 'whole_life')}>
              Whole Life Insurance
            </button>
            <button onClick={() => handleAnswer('coverage_type', 'universal_life')}>
              Universal Life Insurance
            </button>
          </div>
        );

      case 'coverage_amount':
        return (
          <div>
            <h2>How much coverage do you need?</h2>
            <button onClick={() => handleAnswer('coverage_amount', '$250,000')}>
              $250,000
            </button>
            <button onClick={() => handleAnswer('coverage_amount', '$500,000')}>
              $500,000
            </button>
            <button onClick={() => handleAnswer('coverage_amount', '$1,000,000')}>
              $1,000,000
            </button>
            <button onClick={() => handleAnswer('coverage_amount', '$1,000,000+')}>
              $1,000,000+
            </button>
          </div>
        );

      case 'age_range':
        return (
          <div>
            <h2>What is your age range?</h2>
            <button onClick={() => handleAnswer('age_range', '18-24')}>18-24</button>
            <button onClick={() => handleAnswer('age_range', '25-34')}>25-34</button>
            <button onClick={() => handleAnswer('age_range', '35-44')}>35-44</button>
            <button onClick={() => handleAnswer('age_range', '45-54')}>45-54</button>
            <button onClick={() => handleAnswer('age_range', '55-64')}>55-64</button>
            <button onClick={() => handleAnswer('age_range', '65+')}>65+</button>
          </div>
        );

      case 'email_capture':
        return (
          <div>
            <h2>What's your email address?</h2>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={() => handleEmailSubmit(email)}>
              Continue
            </button>
          </div>
        );

      // Add more steps as needed...

      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="quiz-container">
      {/* Progress indicator */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="step-counter">
        Step {currentStep} of {totalSteps}
      </div>

      {/* Current step content */}
      {renderStep()}

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="debug-info">
          <p>Session ID: {sessionId}</p>
          <p>Funnel Type: {funnelType}</p>
          <p>Answers: {JSON.stringify(quizAnswers, null, 2)}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example: Email Capture Component with Tracking
 */
export function EmailCaptureStep({ onSubmit, funnelType }: any) {
  const [email, setEmail] = useState('');
  const sessionId = getSessionId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }

    // Track email capture
    trackEmailCapture(email, sessionId, funnelType);

    // Call parent's onSubmit
    await onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter your email to see your results</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
      />
      <button type="submit">Get My Results</button>
    </form>
  );
}

/**
 * Example: Results Page with Lead Form Submit Tracking
 */
export function ResultsPage({ calculatedResults, quizAnswers, funnelType }: any) {
  const sessionId = getSessionId();

  useEffect(() => {
    // Track that user reached results page
    trackQuizComplete(
      'life_insurance_ca',
      sessionId,
      funnelType,
      0 // completion time can be calculated if needed
    );
  }, []);

  const handleFinalSubmit = async (phoneNumber: string) => {
    // After OTP verification succeeds, track lead form submit
    trackLeadFormSubmit({
      email: quizAnswers.email,
      phone: phoneNumber,
      firstName: quizAnswers.firstName,
      lastName: quizAnswers.lastName,
      zipCode: quizAnswers.zipCode,
      state: quizAnswers.state,
      stateName: quizAnswers.stateName,
      quizAnswers: quizAnswers,
      calculatedResults: calculatedResults,
      sessionId: sessionId,
      funnelType: funnelType,
      leadScore: calculatedResults.readiness_score || 0
    });
  };

  return (
    <div>
      <h1>Your Life Insurance Results</h1>
      <div className="results">
        <p>Recommended Coverage: {calculatedResults.recommended_coverage}</p>
        <p>Estimated Premium: {calculatedResults.estimated_monthly_premium}</p>
        <p>Readiness Score: {calculatedResults.readiness_score}/100</p>
      </div>
      
      {/* Phone capture and OTP verification */}
      <PhoneVerification onSuccess={handleFinalSubmit} />
    </div>
  );
}

/**
 * Example: Page View Tracking in Layout
 */
export function QuizLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Track page view whenever route changes
    import('@/lib/unified-tracking').then(({ trackPageView }) => {
      trackPageView(
        document.title || 'ParentSimple Quiz',
        window.location.pathname
      );
    });
  }, []);

  return (
    <div className="quiz-layout">
      {children}
    </div>
  );
}

/**
 * Integration Checklist:
 * 
 * ✅ Import unified-tracking functions
 * ✅ Call trackQuizStart() on quiz mount
 * ✅ Call trackQuizStepViewed() on each step
 * ✅ Call trackQuestionAnswer() for each answer
 * ✅ Call trackEmailCapture() when email submitted
 * ✅ Call trackQuizComplete() when quiz finishes
 * ✅ Call trackLeadFormSubmit() after OTP verification
 * ✅ Call trackPageView() in layout or pages
 * 
 * Key Points:
 * - Use getSessionId() consistently
 * - Track step views with time spent
 * - Track all quiz answers
 * - Only track lead submit AFTER OTP verification
 * - Track page views for all pages
 */
