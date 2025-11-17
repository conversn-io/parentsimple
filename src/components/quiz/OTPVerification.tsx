"use client";

import { OTPVerification as ReusableOTP } from '@/components/otp';

interface OTPVerificationProps {
  phoneNumber: string;
  onVerificationComplete: () => void;
  onBack: () => void;
}

export const OTPVerification = ({ phoneNumber, onVerificationComplete, onBack }: OTPVerificationProps) => {
  console.log('🔐 OTPVerification Component Rendered:', {
    phoneNumber,
    timestamp: new Date().toISOString()
  });
  
  return (
    <div className="w-full max-w-xl mx-auto px-4 py-10">
      <div className="w-full bg-white rounded-2xl shadow-2xl border border-[#E3E0D5] p-6 sm:p-8">
        <ReusableOTP
          phoneNumber={phoneNumber}
          onVerificationComplete={onVerificationComplete}
          showPhoneNumber={true}
          showResendButton={true}
          autoSendOTP={false}
          debugMode={process.env.NODE_ENV === 'development'}
          className="quiz-otp w-full"
          onVerificationFailed={(error) => {
            console.error('❌ OTP Verification Failed:', error);
          }}
          onBack={onBack}
        />
      </div>
    </div>
  );
};