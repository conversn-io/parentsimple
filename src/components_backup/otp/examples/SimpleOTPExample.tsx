'use client'

import { useState } from 'react';
import { OTPVerification } from '../OTPVerification';

/**
 * Simple OTP Example - Basic usage
 */
export const SimpleOTPExample = () => {
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
        <h2 className="text-xl font-bold text-green-800 mb-2">
          ✅ Phone Verified Successfully!
        </h2>
        <p className="text-green-700">
          Your phone number <strong>{verifiedPhone}</strong> has been verified.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <OTPVerification
        phoneNumber=""
        onVerificationComplete={handleVerificationComplete}
        onVerificationFailed={handleVerificationFailed}
        showPhoneInput={true}
        autoSendOTP={false}
        debugMode={true}
      />
    </div>
  );
};




