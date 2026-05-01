import { NextRequest, NextResponse } from 'next/server';
import { validatePhoneWithTrestle } from '@/lib/trestle-phone-validation';
import { classifyPhone } from '@/lib/phone-tier';
import { callreadyQuizDb } from '@/lib/callready-quiz-db';

const SITE_KEY = 'parentsimple.org';

function logToAnalytics(
  sessionId: string | null,
  phone: string,
  tier: string,
  blocked: boolean,
  lineType: string | null | undefined,
  carrier: string | null | undefined,
  activityScore: number | null | undefined,
  isPrepaid: boolean | null | undefined,
  countryCode: string | null | undefined,
  rejectedReason: string | null | undefined,
  reasons: string[],
  valid: boolean,
  funnelType: string | null,
  path: string | null,
  userAgent: string | null,
  ipAddress: string | null,
) {
  const digits = (phone || '').replace(/\D/g, '');
  const phoneLast4 = digits.length >= 4 ? digits.slice(-4) : null;
  callreadyQuizDb
    .from('analytics_events')
    .insert({
      event_name: blocked ? 'phone_validation_block' : 'phone_validation',
      event_category: 'validation',
      event_label: SITE_KEY,
      session_id: sessionId || null,
      user_id: sessionId || null,
      page_url: path || null,
      user_agent: userAgent || null,
      ip_address: ipAddress || null,
      properties: {
        site_key: SITE_KEY,
        funnel_type: funnelType || null,
        path: path || null,
        tier,
        blocked,
        valid,
        line_type: lineType || null,
        carrier: carrier || null,
        activity_score: activityScore ?? null,
        is_prepaid: isPrepaid ?? null,
        country_code: countryCode || null,
        rejected_reason: rejectedReason || null,
        reasons: reasons || [],
        phone_last4: phoneLast4,
      },
    })
    .then(({ error }) => {
      if (error) console.warn('⚠️  phone_validation analytics write failed:', error.message);
    });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = body?.phone;
    const sessionId = body?.session_id || body?.sessionId || null;
    const funnelType = body?.funnel_type || null;
    const path = body?.path || request.headers.get('referer') || null;
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';

    if (!phone) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
    }

    const result = await validatePhoneWithTrestle(String(phone));
    let classification = classifyPhone(result);

    // Failopen guard: ParentSimple has no Tier B / OTP path. If a future change
    // ever reintroduces it, downgrade to Tier A so users aren't routed to a
    // verification screen that doesn't exist.
    if (classification.tier === 'B') {
      console.warn('⚠️ [PHONE] Tier B encountered but OTP removed — downgrading to A (failopen)');
      classification = {
        tier: 'A',
        reasons: [...classification.reasons, 'otp_unavailable_failopen'],
      };
    }

    const clientValid = result.valid && classification.tier !== 'C';
    const blocked = classification.tier === 'C';

    const logPrefix = blocked ? '⛔ [PHONE-BLOCK]' : clientValid ? '✅ [PHONE]' : '❌ [PHONE]';
    console.log(
      `${logPrefix} ${result.normalizedPhone || phone} | tier=${classification.tier} | ${result.lineType || 'unknown'} | ${result.carrier || 'no-carrier'} | activity:${result.activityScore ?? '?'} | prepaid:${result.isPrepaid ?? '?'} | session:${sessionId ? sessionId.slice(-8) : 'none'}`,
      JSON.stringify({
        phone: result.normalizedPhone || phone,
        lineType: result.lineType,
        carrier: result.carrier,
        activityScore: result.activityScore,
        isPrepaid: result.isPrepaid,
        countryCode: result.countryCode,
        tier: classification.tier,
        reasons: classification.reasons,
        rejected_reason: classification.rejected_reason,
        blocked,
        valid: clientValid,
        funnel_type: funnelType,
        path,
        session_id: sessionId,
      })
    );

    logToAnalytics(
      sessionId,
      phone,
      classification.tier,
      blocked,
      result.lineType,
      result.carrier,
      result.activityScore,
      result.isPrepaid,
      result.countryCode,
      classification.rejected_reason,
      classification.reasons,
      clientValid,
      funnelType,
      path,
      userAgent,
      ipAddress,
    );

    return NextResponse.json({
      ...result,
      valid: clientValid,
      error: clientValid ? result.error : (classification.helper_message || result.error || 'Please provide a valid mobile phone number'),
      tier: classification.tier,
      tier_reasons: classification.reasons,
      rejected_reason: classification.rejected_reason || null,
    });
  } catch (error) {
    console.error('Phone validation error:', error);
    return NextResponse.json(
      { valid: true, phoneValidated: false, lineType: null, tier: 'A', error: 'Trestle unavailable — pass-through' },
      { status: 200 },
    );
  }
}
