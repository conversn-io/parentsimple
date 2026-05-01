const FAKE_PHONE_PATTERNS = {
  tollFree: ['800', '833', '844', '855', '866', '877', '888'],
  fakeSequences: ['555', '1234', '0000', '1111', '2222', '3333', '4444', '6666', '7777', '8888', '9999'],
  testNumbers: ['5550100', '5551234', '5555555'],
};

export function detectFakePhone(phone: string): { isFake: boolean; reason?: string } {
  const digits = phone.replace(/\D/g, '');

  if (digits.length !== 10) {
    return { isFake: false };
  }

  const areaCode = digits.slice(0, 3);

  if (FAKE_PHONE_PATTERNS.tollFree.includes(areaCode)) {
    return { isFake: true, reason: 'Please enter a personal phone number — toll-free numbers are not accepted.' };
  }

  if (FAKE_PHONE_PATTERNS.fakeSequences.some(pattern => digits.includes(pattern))) {
    return { isFake: true, reason: 'This appears to be a test number. Please enter your real phone number.' };
  }

  if (FAKE_PHONE_PATTERNS.testNumbers.some(test => digits.includes(test))) {
    return { isFake: true, reason: 'Test numbers are not allowed. Please enter your real phone number.' };
  }

  if (/^(\d)\1{9}$/.test(digits)) {
    return { isFake: true, reason: 'Invalid phone number pattern' };
  }

  return { isFake: false };
}

export function validatePhoneFormat(phone: string): { isValid: boolean; error?: string; isFake?: boolean } {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 0) {
    return { isValid: false, error: undefined };
  }

  if (digits.length < 10) {
    return { isValid: false, error: 'Please enter a valid 10-digit US phone number' };
  }

  if (digits.length === 10) {
    const fakeCheck = detectFakePhone(digits);
    if (fakeCheck.isFake) {
      return { isValid: false, error: fakeCheck.reason, isFake: true };
    }
    return { isValid: true };
  }

  return { isValid: false, error: 'Phone number must be exactly 10 digits' };
}

export function getPhoneValidationState(phone: string): 'empty' | 'invalid' | 'valid' {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 0) return 'empty';
  if (digits.length === 10) return 'valid';
  return 'invalid';
}

export interface PhoneAPIResult {
  valid: boolean;
  error?: string;
  lineType?: string | null;
  phoneValidated: boolean;
  tier?: 'A' | 'B' | 'C';
  tierReasons?: string[];
  rejectedReason?: string | null;
}

export interface PhoneValidationContext {
  session_id?: string | null;
  funnel_type?: string | null;
  path?: string | null;
}

export async function validatePhoneAPI(
  phone: string,
  context?: PhoneValidationContext,
): Promise<PhoneAPIResult> {
  try {
    const digits = phone.replace(/\D/g, '');
    if (digits.length !== 10) {
      return { valid: false, error: 'Phone number must be 10 digits', phoneValidated: false };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let response: Response;
    try {
      response = await fetch('/api/validate-phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          session_id: context?.session_id || null,
          funnel_type: context?.funnel_type || null,
          path: context?.path
            || (typeof window !== 'undefined' ? window.location.pathname : null),
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      console.warn('Trestle unavailable — passing through unvalidated');
      return { valid: true, phoneValidated: false };
    }

    const data = await response.json();

    if (!data.valid) {
      return {
        valid: false,
        error: data.error || 'Please provide a valid mobile phone number',
        phoneValidated: true,
        lineType: data.lineType,
        tier: data.tier,
        tierReasons: data.tier_reasons,
        rejectedReason: data.rejected_reason,
      };
    }

    return {
      valid: true,
      phoneValidated: true,
      lineType: data.lineType,
      tier: data.tier,
      tierReasons: data.tier_reasons,
      rejectedReason: data.rejected_reason,
    };
  } catch (error) {
    console.warn('Phone API validation unavailable — failing open:', error);
    return { valid: true, phoneValidated: false };
  }
}
