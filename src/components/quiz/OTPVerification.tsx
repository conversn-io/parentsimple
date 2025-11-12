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
    <div className="max-w-md mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <ReusableOTP
          phoneNumber={phoneNumber}
          onVerificationComplete={onVerificationComplete}
          showPhoneNumber={true}
          showResendButton={true}
          autoSendOTP={false}
          debugMode={process.env.NODE_ENV === 'development'}
          className="quiz-otp"
          onVerificationFailed={(error) => {
            console.error('❌ OTP Verification Failed:', error);
          }}
        />
      </div>
    </div>
  );
};