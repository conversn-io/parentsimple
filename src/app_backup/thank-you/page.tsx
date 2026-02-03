'use client'

import { useEffect, useState } from 'react'
import ExpectCall from '../../components/pages/ExpectCall'
import { initializeTracking, trackPageView } from '@/lib/temp-tracking'

interface QuizAnswers {
  firstName?: string;
  lastName?: string;
  ageRange?: string;
  retirementTiming?: string;
  riskTolerance?: string;
  retirementSavings?: number;
  allocationPercent?: any;
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  phone?: string;
  locationInfo?: {
    zipCode?: string;
    state?: string;
    stateName?: string;
  };
}

export default function ThankYouPage() {
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);

  useEffect(() => {
    initializeTracking()
    trackPageView('Thank You', '/thank-you')
    
    // Get quiz answers from sessionStorage
    const storedAnswers = sessionStorage.getItem('quiz_answers');
    if (storedAnswers) {
      try {
        const answers = JSON.parse(storedAnswers);
        setQuizAnswers(answers);
        console.log('📋 Quiz Answers Retrieved:', answers);
      } catch (error) {
        console.error('❌ Error parsing quiz answers:', error);
      }
    }
  }, [])

  // If we have quiz answers, show personalized message
  if (quizAnswers) {
    return <PersonalizedQuizSubmitted quizAnswers={quizAnswers} />
  }

  // Fallback to ExpectCall if no quiz answers
  return <ExpectCall />
}

function PersonalizedQuizSubmitted({ quizAnswers }: { quizAnswers: QuizAnswers }) {
  const firstName = quizAnswers.personalInfo?.firstName || quizAnswers.firstName || 'there';
  const retirementSavings = quizAnswers.retirementSavings;
  const ageRange = quizAnswers.ageRange;
  const retirementTiming = quizAnswers.retirementTiming;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPersonalizedMessage = () => {
    if (retirementSavings && retirementSavings >= 1000000) {
      return `With over ${formatCurrency(retirementSavings)} in retirement savings, you're in an excellent position to explore advanced strategies like indexed annuities.`;
    } else if (retirementSavings && retirementSavings >= 500000) {
      return `Your ${formatCurrency(retirementSavings)} in retirement savings shows you're well-prepared. Let's explore how indexed annuities can help protect and grow your nest egg.`;
    } else if (retirementSavings && retirementSavings >= 250000) {
      return `With ${formatCurrency(retirementSavings)} in retirement savings, you have a solid foundation. We can help you explore options to protect your savings from market volatility.`;
    } else if (retirementSavings && retirementSavings >= 100000) {
      return `Your ${formatCurrency(retirementSavings)} in retirement savings is a great start. Let's discuss strategies to help you build and protect your retirement nest egg.`;
    } else {
      return `Every step toward retirement planning matters. We're here to help you explore options that can help you build a secure retirement future.`;
    }
  };

  const getTimelineMessage = () => {
    if (retirementTiming === 'Within 5 years') {
      return "Since you're planning to retire within 5 years, it's the perfect time to explore how indexed annuities can provide guaranteed income for your retirement.";
    } else if (retirementTiming === '5-10 years') {
      return "With 5-10 years until retirement, you have time to explore strategies that can help protect your savings and provide guaranteed income.";
    } else if (retirementTiming === '10-15 years') {
      return "Having 10-15 years until retirement gives you time to explore how indexed annuities can fit into your long-term retirement strategy.";
    } else {
      return "Whether you're just starting to plan or well into your retirement journey, we can help you explore options that fit your timeline.";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Personalized Thank You Message */}
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-[#36596A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-serif font-semibold text-[#36596A] mb-4">
            Thank You, {firstName}!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            {getPersonalizedMessage()}
          </p>
          
          <p className="text-base text-gray-600 mb-6 max-w-2xl mx-auto">
            {getTimelineMessage()}
          </p>
        </div>

        {/* Rest of the original ExpectCall content */}
        <ExpectCall />
      </div>
    </div>
  );
}
