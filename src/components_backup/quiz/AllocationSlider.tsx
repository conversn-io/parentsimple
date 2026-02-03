'use client';

import { useState, useEffect } from 'react';

interface AllocationSliderProps {
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
  totalSavings?: string | number;
}

export const AllocationSlider = ({ 
  question, 
  onAnswer, 
  currentAnswer,
  totalSavings 
}: AllocationSliderProps) => {
  const [value, setValue] = useState(currentAnswer?.percentage || question.defaultValue);
  const [isValid, setIsValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Parse total savings amount - handle both numeric and string values
  const parseSavingsAmount = (savings: string | number | undefined) => {
    // If it's already a number, return it
    if (typeof savings === 'number') {
      return savings;
    }
    
    // If it's a string, try to parse it as a number first
    if (typeof savings === 'string') {
      const numericValue = parseFloat(savings);
      if (!isNaN(numericValue)) {
        return numericValue;
      }
      
      // Fall back to old string-based parsing for backward compatibility
      switch (savings) {
        case '$1,000,000+':
          return 1000000;
        case '$750,000 - $999,999':
          return 750000;
        case '$500,000 - $749,999':
          return 500000;
        case '$250,000 - $499,999':
          return 250000;
        case '$100,000 - $249,999':
          return 100000;
        default:
          return 100000; // Default to $100k instead of $50k
      }
    }
    
    // Default fallback
    return 100000;
  };


  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const calculateAmount = (percentage: number, savings: string | number | undefined) => {
    const totalAmount = parseSavingsAmount(savings);
    return totalAmount * (percentage / 100);
  };

  const calculateRemaining = (percentage: number, savings: string | number | undefined) => {
    const totalAmount = parseSavingsAmount(savings);
    return totalAmount * ((100 - percentage) / 100);
  };

  const handleSliderChange = (newValue: number) => {
    setValue(newValue);
    setIsValid(newValue > 0);
  };

  const handleContinue = async () => {
    if (!isValid) return;
    
    setIsLoading(true);
    
    const allocationData = {
      percentage: value,
      amount: calculateAmount(value, totalSavings || 100000),
      allocation: `${value}%`,
      remaining: calculateRemaining(value, totalSavings || 100000)
    };

    console.log('📊 FIA Allocation Selected:', {
      percentage: value,
      amount: allocationData.amount,
      totalSavings: totalSavings,
      timestamp: new Date().toISOString()
    });

    // Small delay to show loading state
    setTimeout(() => {
      onAnswer(allocationData);
      setIsLoading(false);
    }, 300);
  };

  const currentAmount = calculateAmount(value, totalSavings || 100000);
  const remainingAmount = calculateRemaining(value, totalSavings || 100000);

  return (
    <div className="allocation-slider-container">
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
            {value}%
          </div>
          <div className="amount text-xl text-gray-600">
            ${formatNumber(currentAmount)}
          </div>
        </div>

        <div className="slider-container mb-6">
          <input
            type="range"
            min={question.min}
            max={question.max}
            step={question.step}
            value={value}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="allocation-slider w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #36596A 0%, #36596A ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`
            }}
            disabled={isLoading}
          />
          
          <div className="slider-labels flex justify-between mt-2 text-sm text-gray-500">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="allocation-preview flex justify-between p-4 bg-gray-50 rounded-lg">
          <div className="preview-item text-center">
            <div className="text-sm text-gray-600 mb-1">Allocation:</div>
            <div className="amount font-bold text-lg text-gray-800">
              ${formatNumber(currentAmount)}
            </div>
          </div>
          <div className="preview-item text-center">
            <div className="text-sm text-gray-600 mb-1">Remaining:</div>
            <div className="amount font-bold text-lg text-gray-800">
              ${formatNumber(remainingAmount)}
            </div>
          </div>
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
            `Continue with ${value}% Allocation`
          )}
        </button>
      </div>
    </div>
  );
};
