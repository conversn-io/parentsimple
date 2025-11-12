'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackPageView } from '@/lib/temp-tracking';
import { Phone, Download, Play, CheckCircle, Clock, User, BookOpen } from 'lucide-react';
import Link from 'next/link';

interface QuoteData {
  totalSavings: number;
  allocationAmount: number;
  allocationPercent: number;
  monthlyIncome: {
    conservative: number;
    current: number;
    optimistic: number;
  };
  ageFactor: number;
  currentRate: number;
  lastUpdated: string;
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export default function QuoteSubmittedPage() {
  const router = useRouter();
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  useEffect(() => {
    // Track page view
    trackPageView('SeniorSimple FIA Quote Submitted', '/quote-submitted');
    
    console.log('🎯 FIA Quote Submitted Page Loaded:', {
      timestamp: new Date().toISOString(),
      url: window.location.href
    });

    // Try to get quote data from session storage or URL params
    const storedQuoteData = sessionStorage.getItem('fia_quote_data');
    if (storedQuoteData) {
      try {
        const parsedData = JSON.parse(storedQuoteData);
        setQuoteData(parsedData);
        console.log('📊 Quote Data Retrieved:', parsedData);
      } catch (error) {
        console.error('❌ Error parsing quote data:', error);
      }
    }

    // Get phone number from session storage for display
    const storedPhone = sessionStorage.getItem('phone_number');
    if (storedPhone) {
      // Extract last 4 digits
      const digits = storedPhone.replace(/\D/g, '');
      if (digits.length >= 4) {
        setPhoneNumber(digits.slice(-4));
      }
    }
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank you {quoteData?.personalInfo?.firstName || ''}!
          </h1>
          <p className="text-lg text-gray-600">
            One of our licensed specialists will be contacting you within the next 24 hours to complete your quote and provide you with more information about your next steps.
          </p>
        </div>

        {/* Quote Details Section */}
        {quoteData && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            {/* Income Projections */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                Projected Monthly Tax Free Income
              </h3>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Based on your ${formatNumber(quoteData.allocationAmount)} FIA allocation:
                </p>
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl font-bold text-[#36596A]">
                    ${formatNumber(quoteData.monthlyIncome.conservative)}
                  </span>
                  <span className="text-2xl text-gray-500 mx-4"> - </span>
                  <span className="text-4xl font-bold text-[#36596A]">
                    ${formatNumber(quoteData.monthlyIncome.optimistic)}
                  </span>
                  <span className="text-2xl text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-sm text-gray-600">
                  Current FIA rate: {(quoteData.currentRate * 100).toFixed(1)}% | 
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Quote Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Allocation Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Savings:</span>
                  <span className="font-medium">${formatNumber(quoteData.totalSavings)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Allocation %:</span>
                  <span className="font-medium">{quoteData.allocationPercent}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Allocation Amount:</span>
                  <span className="font-medium">${formatNumber(quoteData.allocationAmount)}</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This is only an estimate based on the information you provided. 
                A licensed professional will walk you through all your options and provide personalized guidance 
                based on your complete financial situation.
              </p>
            </div>
          </div>
        )}

        {/* Download Free Resource */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Download the Free Resource
          </h2>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              "The Retirement Revolution"
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              "The Retirement Revolution" exposes exactly why Wall Street's 401(k) and IRA system has failed millions of Americans, while revealing how Fixed Indexed Annuities provide guaranteed lifetime income that you can never outlive. This eye-opening guide gives you the insider knowledge to understand why the annuity quote you just requested could be the smartest financial decision you'll ever make for your retirement security.
            </p>
            <div className="text-center">
              <button className="bg-[#36596A] text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#2a4a5a] transition-colors">
                Download Free Guide
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Read these articles</h4>
            <div className="space-y-3">
              <Link href="/content/can-i-lose-money-in-a-fixed-annuity" className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Can I Lose Money in a Fixed Annuity?</span>
                  <span className="text-[#36596A] text-sm">→</span>
                </div>
              </Link>
              <Link href="/content/annuities-explained-secure-your-retirement-income-with-confidence" className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Annuities Explained: Secure Your Retirement Income with Confidence</span>
                  <span className="text-[#36596A] text-sm">→</span>
                </div>
              </Link>
              <Link href="/content/tax-free-retirement-income-complete-guide" className="block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Tax-Free Retirement Income: Complete Guide</span>
                  <span className="text-[#36596A] text-sm">→</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Why Choose Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Choose Our FIA Specialists?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <User className="w-6 h-6 text-[#36596A] mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Licensed Professionals</h3>
                <p className="text-gray-600 text-sm">Our specialists are fully licensed and experienced in FIA products.</p>
              </div>
            </div>
            <div className="flex items-start">
              <BookOpen className="w-6 h-6 text-[#36596A] mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Educational Approach</h3>
                <p className="text-gray-600 text-sm">We educate you on all options before making any recommendations.</p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-[#36596A] mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">No Obligation</h3>
                <p className="text-gray-600 text-sm">Free consultation with no pressure to purchase anything.</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="w-6 h-6 text-[#36596A] mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Personalized Service</h3>
                <p className="text-gray-600 text-sm">One-on-one consultation tailored to your specific needs.</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">What is a Fixed Indexed Annuity?</h3>
              <p className="text-gray-600 text-sm">
                A Fixed Indexed Annuity (FIA) is a retirement savings product that offers the potential for growth 
                based on market performance while providing protection against market losses.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">How long does it take to get my quote?</h3>
              <p className="text-gray-600 text-sm">
                We typically provide personalized quotes within 24 hours of your request. 
                Our specialists will contact you directly with your options.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Is there any cost for the consultation?</h3>
              <p className="text-gray-600 text-sm">
                No, our consultation is completely free with no obligation to purchase anything. 
                We're here to educate and help you make informed decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/')}
            className="bg-[#36596A] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2a4a5a] transition-colors"
          >
            Return to Homepage
          </button>
          <button
            onClick={() => router.push('/quiz')}
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Take Retirement Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
