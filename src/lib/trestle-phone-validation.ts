const CACHE_TTL_MS = 5 * 60 * 1000;
const PHONE_CACHE = new Map<string, { result: TrestlePhoneValidationResult; timestamp: number }>();

interface TrestlePhoneIntelResponse {
  id?: string | null;
  phone_number?: string | null;
  is_valid?: boolean | null;
  activity_score?: number | null;
  country_calling_code?: string | null;
  country_code?: string | null;
  country_name?: string | null;
  line_type?: string | null;
  carrier?: string | null;
  is_prepaid?: boolean | null;
  error?: {
    name?: string;
    message?: string;
  } | null;
  warnings?: string[] | null;
}

export interface TrestlePhoneValidationResult {
  provider: 'trestle';
  inputPhone: string;
  normalizedPhone: string;
  valid: boolean;
  lineType: string | null;
  carrier: string | null;
  activityScore: number | null;
  countryCode: string | null;
  isPrepaid: boolean | null;
  error?: string;
  raw: TrestlePhoneIntelResponse | null;
}

function normalizeUsPhone(phone: string): string | null {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return null;
}

function toValidationResult(
  inputPhone: string,
  normalizedPhone: string,
  payload: TrestlePhoneIntelResponse | null,
): TrestlePhoneValidationResult {
  const valid = payload?.is_valid === true;
  return {
    provider: 'trestle',
    inputPhone,
    normalizedPhone,
    valid,
    lineType: payload?.line_type ?? null,
    carrier: payload?.carrier ?? null,
    activityScore: typeof payload?.activity_score === 'number' ? payload.activity_score : null,
    countryCode: payload?.country_code ?? null,
    isPrepaid: typeof payload?.is_prepaid === 'boolean' ? payload.is_prepaid : null,
    error: valid ? undefined : payload?.error?.message || 'Invalid phone number',
    raw: payload,
  };
}

export async function validatePhoneWithTrestle(phone: string): Promise<TrestlePhoneValidationResult> {
  const normalizedPhone = normalizeUsPhone(phone);
  if (!normalizedPhone) {
    return {
      provider: 'trestle',
      inputPhone: phone,
      normalizedPhone: '',
      valid: false,
      lineType: null,
      carrier: null,
      activityScore: null,
      countryCode: null,
      isPrepaid: null,
      error: 'Please enter a valid 10-digit US phone number',
      raw: null,
    };
  }

  const cached = PHONE_CACHE.get(normalizedPhone);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.result;
  }

  const apiKey = process.env.TRESTLE_API_KEY;
  if (!apiKey) {
    throw new Error('TRESTLE_API_KEY is not configured');
  }

  const url = new URL('https://api.trestleiq.com/3.0/phone_intel');
  url.searchParams.set('phone', normalizedPhone);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
    },
    cache: 'no-store',
  });

  const responseText = await response.text();
  let payload: TrestlePhoneIntelResponse | null = null;

  if (responseText) {
    try {
      payload = JSON.parse(responseText) as TrestlePhoneIntelResponse;
    } catch {
      payload = {
        error: {
          message: responseText,
        },
      };
    }
  }

  if (!response.ok) {
    const message = payload?.error?.message || `Trestle request failed with status ${response.status}`;
    throw new Error(message);
  }

  const result = toValidationResult(phone, normalizedPhone, payload);
  PHONE_CACHE.set(normalizedPhone, { result, timestamp: Date.now() });
  return result;
}
