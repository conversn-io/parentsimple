'use client';

import { useState } from 'react';

interface SavingsSliderProps {
  question: {
    id: string;
    title: string;
    subtitle: string;
    min: number;
    max: number;
    step: number;
    defaultValue: number;
    unit: string;
  };
  onAnswer: (answer: any) => void;
  currentAnswer?: any;
}

export const SavingsSlider = ({ 
  question, 
  onAnswer, 
  currentAnswer
}: SavingsSliderProps) => {
  const [value, setValue] = useState(currentAnswer || question.defaultValue);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleSliderChange = (newValue: number) => {
    setValue(newValue);
    setIsValid(newValue >= question.min);
  };

  const handleContinue = async () => {
    if (!isValid) return;
    
    setIsLoading(true);
    
    console.log('💰 Retirement Savings Selected:', {
      amount: value,
      formattedAmount: formatNumber(value),
      timestamp: new Date().toISOString()
    });

    // Small delay to show loading state
    setTimeout(() => {
      onAnswer(value);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="savings-slider-container">
      <div className="slider-header mb-6">
        <h3 className="question-title text-2xl font-bold text-gray-900 mb-2">
          {question.title}
        </h3>
        <p className="question-subtitle text-lg text-gray-600">
          {question.subtitle}
        </p>
      </div>

      <div className="slider-section bg-white rounded-xl p-6 shadow-lg">
        <div className="slider-value-display text-center mb-6">
          <div className="value text-4xl font-bold text-[#36596A] mb-2">
            {formatNumber(value)}
          </div>
          <p className="text-sm text-gray-500">Use the slider to select your total retirement savings</p>
        </div>

        <div className="slider-container mb-6">
          <input
            type="range"
            min={question.min}
            max={question.max}
            step={question.step}
            value={value}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="savings-slider w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #36596A 0%, #36596A ${((value - question.min) / (question.max - question.min)) * 100}%, #e5e7eb ${((value - question.min) / (question.max - question.min)) * 100}%, #e5e7eb 100%)`
            }}
            disabled={isLoading}
          />
          
          <div className="slider-labels flex justify-between mt-2 text-sm text-gray-500">
            <span>{formatNumber(question.min)}</span>
            <span>{formatNumber(question.min + (question.max - question.min) / 4)}</span>
            <span>{formatNumber(question.min + (question.max - question.min) / 2)}</span>
            <span>{formatNumber(question.min + ((question.max - question.min) * 3) / 4)}</span>
            <span>{formatNumber(question.max)}</span>
          </div>
        </div>

        <div className="savings-context p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700 text-center">
            {value < 100000 && "We'll help you develop strategies to grow your retirement savings."}
            {value >= 100000 && value < 500000 && "Great start! You have a solid foundation for retirement planning."}
            {value >= 500000 && value < 1000000 && "Excellent! You have significant retirement assets to work with."}
            {value >= 1000000 && "Outstanding! You're in an excellent position for retirement planning."}
          </p>
        </div>
      </div>

      <div className="slider-actions mt-6">
        <button
          onClick={handleContinue}
          disabled={!isValid || isLoading}
          className="btn-continue w-full bg-[#36596A] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#2a4a5a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Continue with ${formatNumber(value)}`
          )}
        </button>
      </div>
    </div>
  );
};

