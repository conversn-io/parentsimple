'use client'

import { useState, useEffect, useCallback } from 'react';
import { formatUSPhoneNumber, isValidUSPhoneNumber } from '@/utils/phone-utils';
import { validateOTP, createOTPErrorMessage, formatTimeRemaining } from '@/utils/otp-utils';
import type { OTPHookConfig, OTPHookReturn, OTPState } from '@/types/otp-types';

export const useOTP = (config: OTPHookConfig): OTPHookReturn => {
  const {
    phoneNumber: initialPhone,
    maxAttempts = 3,
    resendCooldown = 60,
    onVerificationComplete,
    onVerificationFailed,
    onResendOTP,
    autoResend = false,
    debugMode = false
  } = config;

  // State
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [otp, setOTP] = useState('');
  const [state, setState] = useState<OTPState>({
    isVerifying: false,
    isResending: false,
    attempts: 0,
    error: null,
    canResend: true,
    resendTimer: 0
  });

  // Computed values
  const isValidPhone = isValidUSPhoneNumber(formatUSPhoneNumber(phoneNumber));
  const isValidOTP = validateOTP(otp);
  const canVerify = isValidPhone && isValidOTP && !state.isVerifying && state.attempts < maxAttempts;
  const canResend = state.canResend && !state.isResending;

  // Debug logging
  const log = useCallback((message: string, data?: any) => {
    if (debugMode) {
      console.log(`[useOTP] ${message}`, data || '');
    }
  }, [debugMode]);

  // Resend timer countdown
  useEffect(() => {
    if (state.resendTimer > 0) {
      const timer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          resendTimer: prev.resendTimer - 1
        }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (state.resendTimer === 0 && !state.canResend) {
      setState(prev => ({
        ...prev,
        canResend: true
      }));
    }
  }, [state.resendTimer, state.canResend]);

  // Clear error when phone or OTP changes
  useEffect(() => {
    if (state.error) {
      setState(prev => ({ ...prev, error: null }));
    }
  }, [phoneNumber, otp, state.error]);

  // Send OTP
  const sendOTP = useCallback(async (): Promise<boolean> => {
    if (!isValidPhone) {
      setState(prev => ({ ...prev, error: 'Please enter a valid phone number' }));
      return false;
    }

    setState(prev => ({ ...prev, isResending: true, error: null }));
    log('Sending OTP', { phoneNumber });

    try {
      // Use client-side environment variables (NEXT_PUBLIC_ prefixed)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_QUIZ_URL || 'https://jqjftrlnyysqcwbbigpw.supabase.co';
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_QUIZ_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxamZ0cmxueXlzcWN3YmJpZ3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTQ2MzksImV4cCI6MjA2Njg3MDYzOX0.ZqgLIflQJY5zC3ZnU5K9k_KEM9bDdNhtq3ek6ckuwjAo';
      
      // Debug environment variables
      console.log('🔍 Environment Debug:', {
        envUrl: process.env.NEXT_PUBLIC_SUPABASE_QUIZ_URL ? 'SET' : 'NOT SET',
        envKey: process.env.NEXT_PUBLIC_SUPABASE_QUIZ_ANON_KEY ? 'SET' : 'NOT SET',
        fallbackUrl: supabaseUrl,
        fallbackKeyPrefix: anonKey.substring(0, 20) + '...'
      });
      
      console.log('🔍 OTP Send Debug:', {
        supabaseUrl,
        anonKeyPrefix: anonKey.substring(0, 20) + '...',
        phoneNumber
      });
      
      const response = await fetch(`${supabaseUrl}/functions/v1/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`
        },
        body: JSON.stringify({ phoneNumber })
      });

      const data = await response.json();
      log('Send OTP Response', { status: response.status, data });

      if (response.ok && (data.success || data.sent)) {
        console.log('✅ OTP Sent Successfully:', data);
        setState(prev => ({
          ...prev,
          isResending: false,
          canResend: false,
          resendTimer: resendCooldown,
          error: null
        }));
        return true;
      } else {
        console.error('❌ OTP Send Failed:', {
          formattedPhoneNumber: phoneNumber,
          error: data.error || 'Failed to send verification code. Please try again.',
          response: data
        });
        const errorMessage = createOTPErrorMessage(data);
        setState(prev => ({ ...prev, isResending: false, error: errorMessage }));
        return false;
      }
    } catch (error) {
      const errorMessage = createOTPErrorMessage(error);
      log('Send OTP Error', error);
      setState(prev => ({ ...prev, isResending: false, error: errorMessage }));
      return false;
    }
  }, [phoneNumber, isValidPhone, resendCooldown, log]);

  // Verify OTP
  const verifyOTP = useCallback(async (): Promise<boolean> => {
    if (!canVerify) {
      setState(prev => ({ ...prev, error: 'Please enter a valid phone number and OTP code' }));
      return false;
    }

    setState(prev => ({ ...prev, isVerifying: true, error: null }));
    log('Verifying OTP', { phoneNumber, otpLength: otp.length });

    try {
      // Use client-side environment variables (NEXT_PUBLIC_ prefixed)
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_QUIZ_URL || 'https://jqjftrlnyysqcwbbigpw.supabase.co';
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_QUIZ_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxamZ0cmxueXlzcWN3YmJpZ3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTQ2MzksImV4cCI6MjA2Njg3MDYzOX0.ZqgLIflQJY5zC3ZnU5K9k_KEM9bDdNhtq3ek6ckuwjAo';
      
      console.log('🔍 OTP Verify Debug:', {
        supabaseUrl,
        anonKeyPrefix: anonKey.substring(0, 20) + '...',
        phoneNumber,
        otpLength: otp.length
      });
      
      const response = await fetch(`${supabaseUrl}/functions/v1/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`
        },
        body: JSON.stringify({ phoneNumber, otp })
      });

      const data = await response.json();
      log('Verify OTP Response', { status: response.status, data });

      if (response.ok && (data.verified || data.success)) {
        console.log('✅ OTP Verification Successful:', data);
        setState(prev => ({ ...prev, isVerifying: false }));
        onVerificationComplete(phoneNumber);
        return true;
      } else {
        console.error('❌ OTP Verification Failed:', {
          phoneNumber,
          otpLength: otp.length,
          error: data.error || 'Invalid verification code. Please try again.',
          response: data
        });
        const errorMessage = createOTPErrorMessage(data);
        setState(prev => ({
          ...prev,
          isVerifying: false,
          attempts: prev.attempts + 1,
          error: errorMessage
        }));
        onVerificationFailed?.(errorMessage);
        return false;
      }
    } catch (error) {
      const errorMessage = createOTPErrorMessage(error);
      log('Verify OTP Error', error);
      setState(prev => ({
        ...prev,
        isVerifying: false,
        attempts: prev.attempts + 1,
        error: errorMessage
      }));
      onVerificationFailed?.(errorMessage);
      return false;
    }
  }, [phoneNumber, otp, canVerify, onVerificationComplete, onVerificationFailed, log]);

  // Resend OTP
  const resendOTP = useCallback(async (): Promise<boolean> => {
    if (!canResend) return false;
    
    if (onResendOTP) {
      return await onResendOTP(phoneNumber);
    } else {
      return await sendOTP();
    }
  }, [canResend, phoneNumber, onResendOTP, sendOTP]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Reset
  const reset = useCallback(() => {
    setPhoneNumber(initialPhone);
    setOTP('');
    setState({
      isVerifying: false,
      isResending: false,
      attempts: 0,
      error: null,
      canResend: true,
      resendTimer: 0
    });
  }, [initialPhone]);

  return {
    // State
    state,
    phoneNumber,
    otp,
    
    // Actions
    setPhoneNumber,
    setOTP,
    sendOTP,
    verifyOTP,
    resendOTP,
    clearError,
    reset,
    
    // Computed
    isValidPhone,
    isValidOTP,
    canVerify,
    canResend
  };
};
