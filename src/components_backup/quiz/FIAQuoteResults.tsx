'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FIAQuoteResultsProps {
  answers: any;
  onRestart: () => void;
}

export const FIAQuoteResults = ({ answers, onRestart }: FIAQuoteResultsProps) => {
  const router = useRouter();
  const [incomeProjections, setIncomeProjections] = useState<any>(null);

  useEffect(() => {
    // Calculate FIA income projections
    const calculateFIAResults = () => {
      const retirementSavings = answers.retirementSavings;
      const ageRange = answers.ageRange;
      const allocationPercent = answers.fiaAllocation?.percentage || 25;
      
      // Parse savings amount - handle both numeric and string values
      let totalSavings = 0;
      if (typeof retirementSavings === 'number') {
        totalSavings = retirementSavings;
      } else if (typeof retirementSavings === 'string') {
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
        totalSavings = 100000; // Default fallback
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
      
      return {
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
        lastUpdated: new Date().toISOString()
      };
    };

    const results = calculateFIAResults();
    setIncomeProjections(results);
    
    // Store quote data in session storage for quote-submitted page
    try {
      sessionStorage.setItem('fia_quote_data', JSON.stringify(results));
      console.log('💾 Quote data stored in session storage:', results);
    } catch (error) {
      console.error('❌ Error storing quote data:', error);
    }
  }, [answers]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (!incomeProjections) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#36596A] mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating your FIA quote...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fia-quote-thank-you max-w-4xl mx-auto p-6">
      {/* Personalized Income Display */}
      <div className="income-highlight bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Your FIA Income Projection
        </h1>
        <div className="allocation-summary mb-6">
          <p className="text-lg text-gray-700">
            Based on your <span className="font-semibold">${formatNumber(incomeProjections.allocationAmount)}</span> FIA allocation:
          </p>
        </div>
        <div className="income-range flex items-center justify-center mb-4">
          <span className="amount text-4xl font-bold text-[#36596A]">
            ${formatNumber(incomeProjections.monthlyIncome.conservative)}
          </span>
          <span className="separator text-2xl text-gray-500 mx-4"> - </span>
          <span className="amount text-4xl font-bold text-[#36596A]">
            ${formatNumber(incomeProjections.monthlyIncome.optimistic)}
          </span>
          <span className="period text-2xl text-gray-600 ml-2">/month</span>
        </div>
        <p className="disclaimer text-sm text-gray-600">
          Current FIA rate: {(incomeProjections.currentRate * 100).toFixed(1)}% | 
          Last updated: {formatDate(new Date())}
        </p>
      </div>

      {/* Value-Driven CTAs */}
      <div className="cta-section grid md:grid-cols-2 gap-6 mb-8">
        <div className="primary-cta bg-white rounded-xl p-6 shadow-lg border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Get Your Personalized FIA Quote
          </h3>
          <p className="text-gray-600 mb-4">
            Our FIA specialists will contact you within 24 hours with:
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center text-gray-700">
              <span className="text-green-500 mr-2">✅</span>
              Exact rates from top FIA carriers
            </li>
            <li className="flex items-center text-gray-700">
              <span className="text-green-500 mr-2">✅</span>
              Product comparison for your age range ({answers.ageRange})
            </li>
            <li className="flex items-center text-gray-700">
              <span className="text-green-500 mr-2">✅</span>
              Tax-advantaged strategies for your allocation
            </li>
            <li className="flex items-center text-gray-700">
              <span className="text-green-500 mr-2">✅</span>
              No-obligation consultation
            </li>
          </ul>
          <button className="btn-primary w-full bg-[#36596A] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#2a4a5a] transition-colors">
            Schedule Your FIA Call
          </button>
        </div>

        <div className="secondary-cta bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <h4 className="text-xl font-bold text-gray-900 mb-4">
            Learn More About FIAs
          </h4>
          <div className="space-y-3">
            <button className="btn-secondary w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Download FIA Guide
            </button>
            <button className="btn-secondary w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Watch FIA Webinar
            </button>
          </div>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="trust-section bg-white rounded-xl p-6 shadow-lg mb-8">
        <div className="credentials">
          <h4 className="text-xl font-bold text-gray-900 mb-4">
            Why Choose SeniorSimple for FIAs?
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2">
              <li className="flex items-center text-gray-700">
                <span className="text-[#36596A] mr-2">🏆</span>
                Licensed in all 50 states
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-[#36596A] mr-2">📊</span>
                Access to 50+ FIA carriers
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-700">
                <span className="text-[#36596A] mr-2">💰</span>
                No fees for our service
              </li>
              <li className="flex items-center text-gray-700">
                <span className="text-[#36596A] mr-2">🔒</span>
                Your information is secure
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section bg-gray-50 rounded-xl p-6">
        <h4 className="text-xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h4>
        <div className="space-y-4">
          <div className="faq-item">
            <h5 className="font-semibold text-gray-800 mb-2">
              What is a Fixed Indexed Annuity (FIA)?
            </h5>
            <p className="text-gray-600 text-sm">
              A Fixed Indexed Annuity is a type of annuity that provides principal protection while offering the potential for growth based on the performance of a market index, such as the S&P 500.
            </p>
          </div>
          <div className="faq-item">
            <h5 className="font-semibold text-gray-800 mb-2">
              How do FIAs differ from traditional annuities?
            </h5>
            <p className="text-gray-600 text-sm">
              Unlike traditional fixed annuities, FIAs offer the potential for higher returns based on market performance while still protecting your principal from market losses.
            </p>
          </div>
          <div className="faq-item">
            <h5 className="font-semibold text-gray-800 mb-2">
              What are the tax benefits of FIAs?
            </h5>
            <p className="text-gray-600 text-sm">
              FIAs grow tax-deferred, meaning you don't pay taxes on the growth until you withdraw the money, potentially allowing for more significant accumulation over time.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center mt-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/quote-submitted')}
            className="bg-[#36596A] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2a4a5a] transition-colors"
          >
            Get Detailed Quote
          </button>
          <button
            onClick={onRestart}
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
};
