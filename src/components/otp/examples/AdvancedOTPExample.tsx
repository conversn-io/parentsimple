'use client'

import { useState } from 'react';
import { useOTP } from '@/hooks/useOTP';

/**
 * Advanced OTP Example - Using the useOTP hook directly
 */
export const AdvancedOTPExample = () => {
  const [phoneNumber, setPhoneNumber] = useState('+18587524266');
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState('');

  const {
    state,
    otp,
    setOTP,
    sendOTP,
    verifyOTP,
    resendOTP,
    clearError,
    reset,
    isValidPhone,
    isValidOTP,
    canVerify,
    canResend
  } = useOTP({
    phoneNumber,
    maxAttempts: 3,
    resendCooldown: 60,
    onVerificationComplete: (phone) => {
      console.log('✅ Phone verified:', phone);
      setVerifiedPhone(phone);
      setIsVerified(true);
    },
    onVerificationFailed: (error) => {
      console.error('❌ Verification failed:', error);
    },
    debugMode: true
  });

  const handleSendOTP = async () => {
    const success = await sendOTP();
    if (success) {
      console.log('📱 OTP sent successfully');
    }
  };

  const handleVerifyOTP = async () => {
    const success = await verifyOTP();
    if (success) {
      console.log('✅ OTP verified successfully');
    }
  };

  const handleResendOTP = async () => {
    const success = await resendOTP();
    if (success) {
      console.log('📱 OTP resent successfully');
    }
  };

  if (isVerified) {
    return (
      <div className="max-w-md mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-xl font-bold text-green-800 mb-2">
          ✅ Phone Verified Successfully!
        </h2>
        <p className="text-green-700 mb-4">
          Your phone number <strong>{verifiedPhone}</strong> has been verified.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Advanced OTP Example
      </h2>

      {/* Phone Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="+18587524266"
        />
        {!isValidPhone && phoneNumber && (
          <p className="mt-1 text-sm text-red-600">Please enter a valid phone number</p>
        )}
      </div>

      {/* Send OTP Button */}
      <button
        onClick={handleSendOTP}
        disabled={!isValidPhone || state.isResending}
        className="w-full mb-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {state.isResending ? 'Sending...' : 'Send OTP'}
      </button>

      {/* OTP Input */}
      {state.resendTimer > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono"
            placeholder="123456"
            maxLength={6}
          />
          {!isValidOTP && otp && (
            <p className="mt-1 text-sm text-red-600">Please enter a valid 6-digit code</p>
          )}
        </div>
      )}

      {/* Verify OTP Button */}
      {state.resendTimer > 0 && (
        <button
          onClick={handleVerifyOTP}
          disabled={!canVerify}
          className="w-full mb-4 bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {state.isVerifying ? 'Verifying...' : 'Verify OTP'}
        </button>
      )}

      {/* Resend OTP Button */}
      {state.resendTimer > 0 && (
        <button
          onClick={handleResendOTP}
          disabled={!canResend}
          className="w-full mb-4 bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {state.isResending ? 'Resending...' : `Resend OTP (${state.resendTimer}s)`}
        </button>
      )}

      {/* Error Display */}
      {state.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{state.error}</p>
          <button
            onClick={clearError}
            className="mt-2 text-red-600 hover:text-red-700 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
        <h3 className="font-semibold mb-2">Debug Info:</h3>
        <div className="space-y-1">
          <div>Phone Valid: {isValidPhone ? '✅' : '❌'}</div>
          <div>OTP Valid: {isValidOTP ? '✅' : '❌'}</div>
          <div>Can Verify: {canVerify ? '✅' : '❌'}</div>
          <div>Can Resend: {canResend ? '✅' : '❌'}</div>
          <div>Attempts: {state.attempts}/3</div>
          <div>Resend Timer: {state.resendTimer}s</div>
        </div>
      </div>
    </div>
  );
};
