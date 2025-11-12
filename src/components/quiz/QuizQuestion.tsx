'use client'

import { useState, useEffect } from 'react';
import { formatPhoneForInput, formatPhoneForGHL, extractUSPhoneNumber } from '@/utils/phone-utils';
import { buildApiUrl } from '@/lib/api-config';

interface QuizQuestionProps {
  question: {
    id: string;
    title: string;
    subtitle?: string;
    type: 'multiple-choice' | 'multi-select' | 'slider' | 'input' | 'personal-info' | 'location-info' | 'address-info' | 'phone-consent';
    options?: string[];
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number | string;
    placeholder?: string;
    isQualifying?: boolean;
  };
  onAnswer: (answer: any) => void;
  currentAnswer?: any;
  isLoading?: boolean;
}

interface ZipValidationResult {
  valid: boolean;
  zipCode: string;
  state: string;
  stateName: string;
  licensing: {
    requires_license: boolean;
    license_type: string;
    notes: string;
  };
  error?: string;
}

export const QuizQuestion = ({ question, onAnswer, currentAnswer, isLoading }: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<any>(currentAnswer || question.defaultValue);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(currentAnswer || []);
  const [sliderValue, setSliderValue] = useState(question.defaultValue as number || question.min || 0);
  
  // Personal info fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  
  // Location info fields
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // Zip validation state
  const [zipValidationResult, setZipValidationResult] = useState<ZipValidationResult | null>(null);
  const [isValidatingZip, setIsValidatingZip] = useState(false);
  const [zipError, setZipError] = useState('');

  // Phone error state
  const [phoneError, setPhoneError] = useState('');

  // Debounced zip validation
  useEffect(() => {
    if (question.type === 'location-info' && zipCode.length >= 5) {
      const timeoutId = setTimeout(() => {
        validateZipCode(zipCode);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [zipCode, question.type]);

  const validateZipCode = async (zip: string) => {
    if (!zip || zip.length < 5) {
      setZipValidationResult(null);
      setZipError('');
      return;
    }

    setIsValidatingZip(true);
    setZipError('');

    try {
      const response = await fetch(buildApiUrl('/api/validate-zipcode'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ zipCode: zip }),
      });

      const data = await response.json();

      if (response.ok && data?.valid) {
        setZipValidationResult(data);
        setZipError('');
        // Auto-populate state if available
        if (data.stateName) {
          setState(data.stateName);
        }
      } else {
        setZipValidationResult({ 
          valid: false, 
          zipCode: zip, 
          state: '', 
          stateName: '', 
          licensing: { requires_license: false, license_type: 'none', notes: '' },
          error: data?.error || 'Invalid zip code'
        });
        setZipError(data?.error || 'Invalid zip code');
      }
    } catch (err: any) {
      console.error('Zip validation error:', err);
      setZipError('Unable to validate zip code. Please try again.');
      setZipValidationResult(null);
    } finally {
      setIsValidatingZip(false);
    }
  };

  const handleMultipleChoice = (answer: string) => {
    setSelectedAnswer(answer);
    onAnswer(answer);
  };

  const handleMultiSelect = (answer: string) => {
    const newAnswers = selectedAnswers.includes(answer)
      ? selectedAnswers.filter(a => a !== answer)
      : [...selectedAnswers, answer];
    setSelectedAnswers(newAnswers);
    // Don't call onAnswer immediately for multi-select - wait for Continue button
  };

  const handleMultiSelectContinue = () => {
    onAnswer(selectedAnswers);
  };

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    onAnswer(value);
  };

  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName && lastName && email && phone && consentChecked) {
      // Extract 10 digits from phone input
      const digits = extractUSPhoneNumber(phone);
      
      // Validate we have 10 digits
      if (digits.length !== 10) {
        setPhoneError('Please enter a valid 10-digit US phone number.');
        return;
      }
      
      // Format phone with +1 for storage/submission
      const formattedPhoneNumber = formatPhoneForGHL(digits);
      
      onAnswer({
        firstName,
        lastName,
        email,
        phone: formattedPhoneNumber,
        consent: consentChecked
      });
    }
  };

  const handleLocationInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (zipCode && zipValidationResult?.valid) {
      onAnswer({
        zipCode,
        state: zipValidationResult.state,
        stateName: zipValidationResult.stateName,
        licensing: zipValidationResult.licensing
      });
    }
  };


  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            {question.options?.map((option, index) => (
              <button
                key={index}
                onClick={() => handleMultipleChoice(option)}
                className={`quiz-button w-full p-6 text-left border-3 rounded-xl transition-all duration-200 transform active:scale-95 ${
                  selectedAnswer === option
                    ? 'border-[#36596A] bg-white text-[#36596A] shadow-lg'
                    : 'border-gray-200 bg-white hover:border-[#36596A] hover:shadow-lg text-gray-700'
                }`}
                disabled={isLoading}
                style={{ minHeight: '64px' }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg leading-relaxed">{option}</span>
                  {selectedAnswer === option && (
                    <div className="w-6 h-6 bg-[#36596A] rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        );

      case 'multi-select':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {question.options?.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleMultiSelect(option)}
                  className={`quiz-button w-full p-6 text-left border-3 rounded-xl transition-all duration-200 transform active:scale-95 ${
                    selectedAnswers.includes(option)
                      ? 'border-[#36596A] bg-white text-[#36596A] shadow-lg'
                      : 'border-gray-200 bg-white hover:border-[#36596A] hover:shadow-lg text-gray-700'
                  }`}
                  disabled={isLoading}
                  style={{ minHeight: '64px' }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg leading-relaxed">{option}</span>
                    <div className={`w-6 h-6 border-3 rounded flex items-center justify-center flex-shrink-0 ${
                      selectedAnswers.includes(option)
                        ? 'border-[#36596A] bg-[#36596A]'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswers.includes(option) && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Continue button for multi-select */}
            <button
              onClick={handleMultiSelectContinue}
              className="quiz-button w-full bg-[#36596A] text-white py-4 px-8 rounded-xl font-bold text-xl hover:bg-[#2a4a5a] transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={selectedAnswers.length === 0 || isLoading}
              style={{ minHeight: '64px' }}
            >
              Continue
            </button>
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-[#36596A] mb-4">
                ${sliderValue.toLocaleString()}
              </div>
            </div>
            <div className="px-4">
              <input
                type="range"
                min={question.min}
                max={question.max}
                step={question.step}
                value={sliderValue}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #36596A 0%, #36596A ${((sliderValue - (question.min || 0)) / ((question.max || 100) - (question.min || 0))) * 100}%, #e5e7eb ${((sliderValue - (question.min || 0)) / ((question.max || 100) - (question.min || 0))) * 100}%, #e5e7eb 100%)`
                }}
                disabled={isLoading}
              />
              <div className="flex justify-between text-lg text-gray-600 mt-4">
                <span className="font-semibold">${question.min?.toLocaleString()}</span>
                <span className="font-semibold">${question.max?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );

      case 'personal-info':
        return (
          <form onSubmit={handlePersonalInfoSubmit} className="space-y-8">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                First Name *
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="quiz-input w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#36596A]/20 focus:border-[#36596A] transition-all"
                required
                disabled={isLoading}
                style={{ minHeight: '56px' }}
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Last Name *
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="quiz-input w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#36596A]/20 focus:border-[#36596A] transition-all"
                required
                disabled={isLoading}
                style={{ minHeight: '56px' }}
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="quiz-input w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#36596A]/20 focus:border-[#36596A] transition-all"
                required
                disabled={isLoading}
                style={{ minHeight: '56px' }}
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <span className="text-gray-500 text-lg font-medium">+1</span>
                </div>
                <input
                  type="tel"
                  value={formatPhoneForInput(phone)}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Remove all non-digit characters
                    const digits = inputValue.replace(/\D/g, '');
                    // Limit to 10 digits
                    const limitedDigits = digits.slice(0, 10);
                    setPhone(limitedDigits);
                  }}
                  className="quiz-input w-full pr-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#36596A]/20 focus:border-[#36596A] transition-all"
                  placeholder="(555) 123-4567"
                  required
                  disabled={isLoading}
                  autoComplete="tel-national"
                  style={{ 
                    minHeight: '56px',
                    paddingLeft: '100px'
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                We'll send a verification code to this number
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <input
                type="checkbox"
                id="consent"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-2 w-6 h-6 text-[#36596A] border-2 border-gray-300 rounded focus:ring-4 focus:ring-[#36596A]/20"
                disabled={isLoading}
              />
              <label htmlFor="consent" className="text-lg text-gray-600 leading-relaxed">
                I consent to receive SMS messages and phone calls from CallReady and its partners regarding my retirement planning inquiry. Message and data rates may apply. Reply STOP to opt out.
              </label>
            </div>

            {phoneError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{phoneError}</p>
              </div>
            )}

            <button
              type="submit"
              className="quiz-button w-full bg-[#36596A] text-white py-4 px-8 rounded-xl font-bold text-xl hover:bg-[#2a4a5a] transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={!firstName || !lastName || !email || !phone || !consentChecked || isLoading}
              style={{ minHeight: '64px' }}
            >
              Continue
            </button>
          </form>
        );

      case 'location-info':
        return (
          <form onSubmit={handleLocationInfoSubmit} className="space-y-8">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                ZIP Code *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').substring(0, 5))}
                  className={`quiz-input w-full px-6 py-4 text-lg border-2 rounded-xl focus:ring-4 focus:ring-[#36596A]/20 focus:border-[#36596A] transition-all ${
                    zipError ? 'border-red-500' : zipValidationResult?.valid ? 'border-green-500' : 'border-gray-300'
                  }`}
                  placeholder="12345"
                  required
                  disabled={isLoading}
                  style={{ minHeight: '56px' }}
                />
                {isValidatingZip && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#36596A]"></div>
                  </div>
                )}
                {zipValidationResult?.valid && !isValidatingZip && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Validation feedback */}
              {zipError && (
                <p className="text-red-500 text-lg mt-2 font-medium">{zipError}</p>
              )}
              
              {zipValidationResult?.valid && (
                <div className="mt-3 p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                  <p className="text-green-800 text-lg font-medium">
                    ✓ Valid zip code for {zipValidationResult.stateName}
                  </p>
                  {zipValidationResult.licensing.requires_license && (
                    <p className="text-green-700 text-base mt-2">
                      Note: {zipValidationResult.licensing.notes}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="quiz-button w-full bg-[#36596A] text-white py-4 px-8 rounded-xl font-bold text-xl hover:bg-[#2a4a5a] transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={!zipCode || !zipValidationResult?.valid || isLoading}
              style={{ minHeight: '64px' }}
            >
              Continue
            </button>
          </form>
        );

      case 'phone-consent':
        // Handle phone-consent the same way as personal-info (phone + consent only)
        return (
          <form onSubmit={handlePersonalInfoSubmit} className="space-y-8">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <span className="text-gray-500 text-lg font-medium">+1</span>
                </div>
                <input
                  type="tel"
                  value={formatPhoneForInput(phone)}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Remove all non-digit characters
                    const digits = inputValue.replace(/\D/g, '');
                    // Limit to 10 digits
                    const limitedDigits = digits.slice(0, 10);
                    setPhone(limitedDigits);
                  }}
                  className="quiz-input w-full pr-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#36596A]/20 focus:border-[#36596A] transition-all"
                  placeholder="(555) 123-4567"
                  required
                  disabled={isLoading}
                  autoComplete="tel-national"
                  style={{ 
                    minHeight: '56px',
                    paddingLeft: '100px'
                  }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                We'll send a verification code to this number
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <input
                type="checkbox"
                id="consent"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-2 w-6 h-6 text-[#36596A] border-2 border-gray-300 rounded focus:ring-4 focus:ring-[#36596A]/20"
                disabled={isLoading}
              />
              <label htmlFor="consent" className="text-lg text-gray-600 leading-relaxed">
                I consent to receive SMS messages and phone calls from CallReady and its partners regarding my retirement planning inquiry. Message and data rates may apply. Reply STOP to opt out.
              </label>
            </div>

            {phoneError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{phoneError}</p>
              </div>
            )}

            <button
              type="submit"
              className="quiz-button w-full bg-[#36596A] text-white py-4 px-8 rounded-xl font-bold text-xl hover:bg-[#2a4a5a] transition-all duration-200 transform active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={!phone || !consentChecked || isLoading}
              style={{ minHeight: '64px' }}
            >
              Continue
            </button>
          </form>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="space-y-8 pt-6">
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">{question.title}</h2>
        {question.subtitle && (
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">{question.subtitle}</p>
        )}
      </div>
      
      {renderQuestion()}
    </div>
  );
};