
'use client';

import { useState } from "react";
import QuizErrorBoundary from "../quiz/QuizErrorBoundary";
import { AnnuityQuiz } from "../quiz/AnnuityQuiz";
import { useFunnelLayout } from "../../hooks/useFunnelFooter";
import "../../styles/quiz-mobile.css";

interface QuizProps {
  skipOTP?: boolean;
}

const Quiz = ({ skipOTP = false }: QuizProps) => {
  useFunnelLayout(); // This sets both header and footer to 'funnel'

  const handleQuizReset = () => {
    // Force a page refresh to fully reset the quiz state
    window.location.reload();
  };

  return (
    <QuizErrorBoundary onReset={handleQuizReset}>
      <div className="min-h-screen bg-[#F5F5F0]">
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#36596A] mb-4 sm:mb-6 leading-tight">
              Retirement Rescue™ Quiz
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-4 leading-relaxed max-w-3xl mx-auto">
              Discover personalized Retirement Rescue™ strategies based on your unique situation.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <AnnuityQuiz skipOTP={skipOTP} />
          </div>
        </section>
        {/* Footer is now handled by layout */}
      </div>
    </QuizErrorBoundary>
  );
};

export default Quiz;
