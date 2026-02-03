// OTP System TypeScript Interfaces
export interface OTPConfig {
  phoneNumber: string;
  maxAttempts?: number;
  resendCooldown?: number;
  showPhoneNumber?: boolean;
  className?: string;
}

export interface OTPState {
  isVerifying: boolean;
  isResending: boolean;
  attempts: number;
  error: string | null;
  canResend: boolean;
  resendTimer: number;
}

export interface OTPCallbacks {
  onVerificationComplete: (phoneNumber: string) => void;
  onVerificationFailed?: (error: string) => void;
  onResendOTP?: (phoneNumber: string) => Promise<boolean>;
}

export interface OTPResponse {
  success: boolean;
  verified?: boolean;
  error?: string;
  message?: string;
}

export interface PhoneInputProps {
  value: string;
  onChange: (phoneNumber: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export interface OTPInputProps {
  value: string;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  maxLength?: number;
}

export interface OTPHookConfig extends OTPConfig, OTPCallbacks {
  autoResend?: boolean;
  debugMode?: boolean;
}

export interface OTPHookReturn {
  // State
  state: OTPState;
  phoneNumber: string;
  otp: string;
  
  // Actions
  setPhoneNumber: (phone: string) => void;
  setOTP: (otp: string) => void;
  sendOTP: () => Promise<boolean>;
  verifyOTP: () => Promise<boolean>;
  resendOTP: () => Promise<boolean>;
  clearError: () => void;
  reset: () => void;
  
  // Computed
  isValidPhone: boolean;
  isValidOTP: boolean;
  canVerify: boolean;
  canResend: boolean;
}




