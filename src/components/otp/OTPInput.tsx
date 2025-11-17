'use client'

import { useState, useEffect, useRef } from 'react';
import { validateOTP } from '@/utils/otp-utils';
import type { OTPInputProps } from '@/types/otp-types';

export const OTPInput = ({
  value,
  onChange,
  onComplete,
  disabled = false,
  error,
  className = '',
  maxLength = 6
}: OTPInputProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update display value when prop changes
  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow only digits
    const digitsOnly = inputValue.replace(/\D/g, '');
    
    // Limit to maxLength
    const truncated = digitsOnly.slice(0, maxLength);
    
    setDisplayValue(truncated);
    onChange(truncated);
    
    // Auto-complete when maxLength is reached
    if (truncated.length === maxLength && onComplete) {
      onComplete(truncated);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true)) {
      return;
    }
    
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digitsOnly = pastedData.replace(/\D/g, '').slice(0, maxLength);
    
    setDisplayValue(digitsOnly);
    onChange(digitsOnly);
    
    if (digitsOnly.length === maxLength && onComplete) {
      onComplete(digitsOnly);
    }
  };

  const isValid = validateOTP(displayValue);
  const hasError = error || (displayValue.length > 0 && !isValid && displayValue.length === maxLength);

  return (
    <div className={`otp-input ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          disabled={disabled}
          placeholder="000000"
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 text-center text-2xl font-mono border-2 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${hasError 
              ? 'border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
          autoComplete="one-time-code"
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>
      
      {hasError && (
        <p className="mt-2 text-sm text-red-600 text-center">
          {error || 'Please enter a valid 6-digit code'}
        </p>
      )}
      
      {isValid && displayValue.length === maxLength && (
        <p className="mt-2 text-sm text-green-600 text-center">
          ✓ Valid code format
        </p>
      )}
      
      <div className="mt-2 text-sm text-gray-500 text-center">
        Enter the {maxLength}-digit code sent to your phone
      </div>
    </div>
  );
};




