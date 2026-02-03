// OTP Utility Functions
import { formatUSPhoneNumber, isValidUSPhoneNumber } from './phone-utils';

/**
 * Generate a random 6-digit OTP code
 */
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Validate OTP format (6 digits)
 */
export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

/**
 * Format OTP for display (adds spaces for readability)
 */
export const formatOTPDisplay = (otp: string): string => {
  return otp.replace(/(\d{3})(\d{3})/, '$1 $2');
};

/**
 * Calculate resend timer in seconds
 */
export const calculateResendTimer = (cooldownSeconds: number, startTime: number): number => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  return Math.max(0, cooldownSeconds - elapsed);
};

/**
 * Format phone number for OTP display
 */
export const formatPhoneForOTP = (phoneNumber: string): string => {
  const formatted = formatUSPhoneNumber(phoneNumber);
  if (isValidUSPhoneNumber(formatted)) {
    // Format as +1 (XXX) XXX-XXXX
    const cleaned = formatted.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      const number = cleaned.slice(1);
      return `+1 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`;
    }
  }
  return formatted;
};

/**
 * Mask phone number for display (shows only last 4 digits)
 */
export const maskPhoneNumber = (phoneNumber: string): string => {
  const formatted = formatUSPhoneNumber(phoneNumber);
  if (isValidUSPhoneNumber(formatted)) {
    const cleaned = formatted.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      const number = cleaned.slice(1);
      return `+1 (***) ***-${number.slice(-4)}`;
    }
  }
  return formatted;
};

/**
 * Validate phone number for OTP sending
 */
export const validatePhoneForOTP = (phoneNumber: string): { isValid: boolean; error?: string } => {
  if (!phoneNumber) {
    return { isValid: false, error: 'Phone number is required' };
  }

  const formatted = formatUSPhoneNumber(phoneNumber);
  
  if (!isValidUSPhoneNumber(formatted)) {
    return { isValid: false, error: 'Please enter a valid US phone number' };
  }

  // Check if it's a US number (+1)
  if (!formatted.startsWith('+1')) {
    return { isValid: false, error: 'Please enter a US phone number with country code' };
  }

  return { isValid: true };
};

/**
 * Create OTP error message
 */
export const createOTPErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error) {
    return error.error;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Check if OTP is expired (10 minutes)
 */
export const isOTPExpired = (createdAt: string): boolean => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMinutes = (now.getTime() - created.getTime()) / (1000 * 60);
  return diffMinutes > 10;
};

/**
 * Format time remaining for resend
 */
export const formatTimeRemaining = (seconds: number): string => {
  if (seconds <= 0) return '0s';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  
  return `${remainingSeconds}s`;
};




