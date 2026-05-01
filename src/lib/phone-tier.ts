import type { TrestlePhoneValidationResult } from './trestle-phone-validation';

export type PhoneTier = 'A' | 'B' | 'C';

export interface PhoneClassification {
  tier: PhoneTier;
  reasons: string[];
  helper_message?: string;
  rejected_reason?: string;
}

function readBool(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  return raw.toLowerCase() === 'true' || raw === '1';
}

export function classifyPhone(
  result: TrestlePhoneValidationResult
): PhoneClassification {
  const reasons: string[] = [];

  if (!result.valid) {
    return {
      tier: 'C',
      reasons: ['invalid'],
      helper_message: 'Please provide a valid mobile phone number',
      rejected_reason: 'invalid_phone',
    };
  }

  if (result.countryCode && result.countryCode !== 'US') {
    return {
      tier: 'C',
      reasons: ['non_us'],
      helper_message: 'Please provide a valid mobile phone number',
      rejected_reason: 'non_us',
    };
  }

  const lineType = (result.lineType || '').trim();
  const activity = result.activityScore ?? 0;

  if (lineType === 'Landline') {
    return {
      tier: 'C',
      reasons: ['landline'],
      helper_message: 'Please provide a valid mobile phone number',
      rejected_reason: 'landline',
    };
  }

  if (lineType === 'TollFree') {
    return {
      tier: 'C',
      reasons: ['toll_free'],
      helper_message: 'Please provide a valid mobile phone number',
      rejected_reason: 'toll_free',
    };
  }

  if (lineType === 'FixedVOIP') {
    reasons.push('fixed_voip_delivered');
    return { tier: 'A', reasons };
  }

  if (lineType === 'NonFixedVOIP') {
    return {
      tier: 'C',
      reasons: ['nonfixed_voip'],
      helper_message: 'Please provide a valid mobile phone number',
      rejected_reason: 'nonfixed_voip',
    };
  }

  if (lineType === 'Mobile') {
    if (result.isPrepaid && readBool('TRESTLE_REJECT_ON_PREPAID', false)) {
      return {
        tier: 'C',
        reasons: ['prepaid'],
        helper_message: 'Please provide a valid mobile phone number',
        rejected_reason: 'prepaid',
      };
    }
    if (activity < 20) reasons.push('low_activity_mobile');
    if (result.isPrepaid) reasons.push('prepaid');
    return { tier: 'A', reasons };
  }

  reasons.push('unknown_line_type');
  return { tier: 'A', reasons };
}
