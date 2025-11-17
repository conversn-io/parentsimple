'use client'

import { useState, useEffect } from 'react';
import { formatPhoneForOTP, formatTimeRemaining } from '@/utils/otp-utils';
import { PhoneInput } from './PhoneInput';
import { OTPInput } from './OTPInput';
import { useOTP } from '@/hooks/useOTP';
import type { OTPConfig, OTPCallbacks } from '@/types/otp-types';

interface OTPVerificationProps extends OTPConfig, OTPCallbacks {
  showPhoneInput?: boolean;
  showResendButton?: boolean;
  autoSendOTP?: boolean;
  debugMode?: boolean;
  onBack?: () => void;
}

export const OTPVerification = ({
  phoneNumber: initialPhone,
  onVerificationComplete,
  onVerificationFailed,
  onResendOTP,
  showPhoneNumber = true,
  showPhoneInput = false,
  showResendButton = true,
  autoSendOTP = false,
  maxAttempts = 3,
  resendCooldown = 60,
  className = '',
  debugMode = false,
  onBack
}: OTPVerificationProps) => {
  const [step, setStep] = useState<'phone' | 'otp'>('otp');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);

  const {
    state,
    otp,
    setOTP,
    sendOTP,
    verifyOTP,
    resendOTP,
    clearError,
    isValidPhone,
    isValidOTP,
    canVerify,
    canResend
  } = useOTP({
    phoneNumber,
    maxAttempts,
    resendCooldown,
    onVerificationComplete,
    onVerificationFailed,
    onResendOTP,
    debugMode
  });

  // Auto-send OTP when phone is valid
  useEffect(() => {
    if (autoSendOTP && isValidPhone && step === 'phone') {
      handleSendOTP();
    }
  }, [autoSendOTP, isValidPhone, step]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidPhone) {
      await handleSendOTP();
    }
  };

  const handleSendOTP = async () => {
    const success = await sendOTP();
    if (success) {
      setStep('otp');
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (canVerify) {
      await verifyOTP();
    }
  };

  const handleResendOTP = async () => {
    await resendOTP();
  };

  const handleOTPComplete = async (otpValue: string) => {
    setOTP(otpValue);
    if (canVerify) {
      await verifyOTP();
    }
  };

  const displayPhone = formatPhoneForOTP(phoneNumber);

  return (
    <div className={`otp-verification ${className}`}>
      {step === 'phone' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Phone Number
            </h2>
            <p className="text-gray-600">
              We'll send you a verification code to confirm your phone number
            </p>
          </div>

          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder="Enter your phone number"
              error={state.error || undefined}
              disabled={state.isResending}
            />

            <button
              type="submit"
              disabled={!isValidPhone || state.isResending}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {state.isResending ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        </div>
      )}

      {step === 'otp' && (
        <div className="space-y-3">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 leading-tight">
              Enter Verification Code
            </h2>
            {showPhoneNumber && (
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mt-1">
                We sent a 6-digit code to <span className="font-semibold">{displayPhone}</span>
              </p>
            )}
          </div>

          <form onSubmit={handleOTPSubmit} className="space-y-3">
            <OTPInput
              value={otp}
              onChange={setOTP}
              onComplete={handleOTPComplete}
              disabled={state.isVerifying}
              error={state.error || undefined}
            />

            <button
              type="submit"
              disabled={!canVerify}
              className="w-full bg-[#1A2B49] text-white py-2.5 px-6 rounded-lg font-semibold hover:bg-[#152238] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-base sm:text-lg"
            >
              {state.isVerifying ? 'Verifying...' : 'Verify Code'}
            </button>

            {showResendButton && (
              <div className="text-center">
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={state.isResending}
                    className="text-[#1A2B49] hover:text-[#152238] font-medium disabled:text-gray-400 text-sm sm:text-base"
                  >
                    {state.isResending ? 'Sending...' : 'Resend Code'}
                  </button>
                ) : (
                  <p className="text-gray-500 text-sm sm:text-base">
                    Resend code in {formatTimeRemaining(state.resendTimer)}
                  </p>
                )}
              </div>
            )}

            {state.attempts > 0 && (
              <div className="text-center text-sm text-gray-500">
                Attempts: {state.attempts}/{maxAttempts}
              </div>
            )}

            <div className="text-center space-y-1">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="text-[#1A2B49] hover:text-[#152238] text-sm sm:text-base font-medium block w-full"
                >
                  ← Back
                </button>
              )}
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-[#1A2B49] hover:text-[#152238] text-sm sm:text-base font-medium"
              >
                ← Change phone number
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
