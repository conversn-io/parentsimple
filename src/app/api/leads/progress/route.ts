import { NextRequest } from 'next/server';
import { callreadyQuizDb } from '@/lib/callready-quiz-db';
import { createCorsResponse, handleCorsOptions } from '@/lib/cors-headers';

export async function OPTIONS() {
  return handleCorsOptions();
}

// Progressive shadow lead — written during the quiz, before contact submit.
// Lets us keep UTM, partial answers, and tracking IDs for users who bounce
// before reaching the contact step. capture-email later attaches the
// contact_id to the existing row instead of inserting a new one.
export async function POST(request: NextRequest) {
  console.log('🟤 [PROGRESS] Quiz progress request received');

  try {
    const body = await request.json();
    const {
      sessionId,
      funnelType,
      siteKey,
      quizAnswers,
      utmParams,
      metaCookies,
      trustedFormCertUrl,
      jornayaLeadId,
      lastStepNumber,
      lastStepName,
    } = body || {};

    if (!sessionId || !funnelType) {
      return createCorsResponse({ error: 'sessionId and funnelType are required' }, 400);
    }

    const referrer = request.headers.get('referer') || request.headers.get('referrer') || null;
    const landingPage = request.headers.get('x-forwarded-url') || request.url || referrer || null;
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      null;
    const userAgent = request.headers.get('user-agent') || null;

    // Server cookies are authoritative — same enrichment pattern as the
    // capture-email and verify-otp routes.
    const fbpFromCookie = request.cookies.get('_fbp')?.value || null;
    const fbcFromCookie = request.cookies.get('_fbc')?.value || null;
    const inferredCity = request.headers.get('x-vercel-ip-city') || null;
    const inferredPostalCode = request.headers.get('x-vercel-ip-postal-code') || null;

    const utmSource = utmParams?.utm_source || null;
    const utmMedium = utmParams?.utm_medium || null;
    const utmCampaign = utmParams?.utm_campaign || null;
    const utmTerm = utmParams?.utm_term || null;
    const utmContent = utmParams?.utm_content || null;

    // Find any existing lead for this (funnel, session). Don't filter on
    // contact_id — if capture-email already promoted this row, we still
    // want to update it rather than insert a parallel shadow.
    const { data: existingLead } = await callreadyQuizDb
      .from('leads')
      .select('*')
      .eq('session_id', sessionId)
      .eq('funnel_type', funnelType)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const mergedQuizAnswers = {
      ...(existingLead?.quiz_answers || {}),
      ...(quizAnswers || {}),
      utm_parameters: utmParams || existingLead?.quiz_answers?.utm_parameters || {},
      meta_cookies: {
        fbp: fbpFromCookie || metaCookies?.fbp || null,
        fbc: fbcFromCookie || metaCookies?.fbc || null,
        fbLoginId: metaCookies?.fbLoginId || null,
      },
      progress: {
        last_step_number: lastStepNumber ?? existingLead?.quiz_answers?.progress?.last_step_number ?? null,
        last_step_name: lastStepName ?? existingLead?.quiz_answers?.progress?.last_step_name ?? null,
        last_progress_at: new Date().toISOString(),
        inferred_city: inferredCity,
        inferred_postal_code: inferredPostalCode,
      },
    };

    if (existingLead?.id) {
      // Don't downgrade: never overwrite a higher status with 'in_progress',
      // never clear a contact_id that capture-email already attached.
      const updateData: Record<string, unknown> = {
        quiz_answers: mergedQuizAnswers,
        utm_source: utmSource ?? existingLead.utm_source,
        utm_medium: utmMedium ?? existingLead.utm_medium,
        utm_campaign: utmCampaign ?? existingLead.utm_campaign,
        utm_term: utmTerm ?? existingLead.utm_term,
        utm_content: utmContent ?? existingLead.utm_content,
        referrer: existingLead.referrer || referrer,
        landing_page: existingLead.landing_page || landingPage,
        ip_address: existingLead.ip_address || ipAddress,
        trustedform_cert_url: trustedFormCertUrl || existingLead.trustedform_cert_url || null,
        jornaya_lead_id: jornayaLeadId || existingLead.jornaya_lead_id || null,
      };
      if (!existingLead.status) updateData.status = 'in_progress';

      const { error: updateError } = await callreadyQuizDb
        .from('leads')
        .update(updateData)
        .eq('id', existingLead.id);

      if (updateError) {
        console.error('🔴 [PROGRESS] Update failed:', updateError.message);
        return createCorsResponse({ error: 'Failed to update progress', details: updateError.message }, 500);
      }
      console.log('🟢 [PROGRESS] Lead updated:', { leadId: existingLead.id, step: lastStepNumber });
      return createCorsResponse({ success: true, leadId: existingLead.id, action: 'updated' });
    }

    const insertData: Record<string, unknown> = {
      session_id: sessionId,
      funnel_type: funnelType,
      site_key: siteKey || 'parentsimple.org',
      status: 'in_progress',
      is_verified: false,
      quiz_answers: mergedQuizAnswers,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      utm_content: utmContent,
      referrer,
      landing_page: landingPage,
      ip_address: ipAddress,
      user_id: sessionId,
      trustedform_cert_url: trustedFormCertUrl || null,
      jornaya_lead_id: jornayaLeadId || null,
    };

    const { data: newLead, error: insertError } = await callreadyQuizDb
      .from('leads')
      .insert(insertData)
      .select('id')
      .single();

    if (insertError) {
      console.error('🔴 [PROGRESS] Insert failed:', insertError.message);
      return createCorsResponse({ error: 'Failed to insert progress', details: insertError.message }, 500);
    }

    console.log('🟢 [PROGRESS] Shadow lead created:', { leadId: newLead?.id, step: lastStepNumber });
    return createCorsResponse({ success: true, leadId: newLead?.id, action: 'created' });
  } catch (error: any) {
    console.error('💥 [PROGRESS] Exception:', error?.message || error);
    return createCorsResponse({ error: 'Internal server error', details: error?.message }, 500);
  }
}
