'use client'

import { useState } from 'react';
import { OTPVerification } from '@/components/otp';
import { SimpleOTPExample, AdvancedOTPExample } from '@/components/otp/examples';

export default function OTPTestPage() {
  const [activeExample, setActiveExample] = useState<'simple' | 'advanced' | 'component'>('simple');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            OTP System Test Page
          </h1>
          <p className="text-gray-600">
            Test the reusable OTP verification system
          </p>
        </div>

        {/* Example Selector */}
        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setActiveExample('simple')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeExample === 'simple'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Simple Example
            </button>
            <button
              onClick={() => setActiveExample('advanced')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeExample === 'advanced'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Advanced Example
            </button>
            <button
              onClick={() => setActiveExample('component')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeExample === 'component'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Component Only
            </button>
          </div>
        </div>

        {/* Example Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeExample === 'simple' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Simple OTP Example
              </h2>
              <p className="text-gray-600 mb-6">
                Basic usage with the OTPVerification component
              </p>
              <SimpleOTPExample />
            </div>
          )}

          {activeExample === 'advanced' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Advanced OTP Example
              </h2>
              <p className="text-gray-600 mb-6">
                Using the useOTP hook directly for custom UI
              </p>
              <AdvancedOTPExample />
            </div>
          )}

          {activeExample === 'component' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Component Only Example
              </h2>
              <p className="text-gray-600 mb-6">
                Direct usage of the OTPVerification component
              </p>
              <ComponentOnlyExample />
            </div>
          )}
        </div>

        {/* Documentation Link */}
        <div className="mt-8 text-center">
          <a
            href="/src/components/otp/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            📚 View Full Documentation
          </a>
        </div>
      </div>
    </div>
  );
}

// Component Only Example
function ComponentOnlyExample() {
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState('');

  const handleVerificationComplete = (phoneNumber: string) => {
    console.log('✅ Phone verified:', phoneNumber);
    setVerifiedPhone(phoneNumber);
    setIsVerified(true);
  };

  const handleVerificationFailed = (error: string) => {
    console.error('❌ Verification failed:', error);
  };

  if (isVerified) {
    return (
      <div className="max-w-md mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-bold text-green-800 mb-2">
          ✅ Phone Verified Successfully!
        </h3>
        <p className="text-green-700">
          Your phone number <strong>{verifiedPhone}</strong> has been verified.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <OTPVerification
        phoneNumber="+18587524266"
        onVerificationComplete={handleVerificationComplete}
        onVerificationFailed={handleVerificationFailed}
        showPhoneInput={true}
        autoSendOTP={false}
        debugMode={true}
        className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
      />
    </div>
  );
}
