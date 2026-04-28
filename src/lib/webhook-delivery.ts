/**
 * ParentSimple GHL Webhook Delivery Service
 *
 * Sends verified leads to the appropriate GoHighLevel webhook for their funnel.
 * Only verified leads (successful OTP) are forwarded; failed OTP attempts are
 * persisted to Supabase but never sent to GHL.
 */

import { callreadyQuizDb } from './callready-quiz-db';

const GHL_WEBHOOK_URL = process.env.PARENT_SIMPLE_GHL_WEBHOOK || process.env.PARENTSIMPLE_GHL_WEBHOOK || '';
const LIFE_INSURANCE_GHL_WEBHOOK = process.env.PARENTSIMPLE_LIFE_INSURANCE_GHL_WEBHOOK || 'https://services.leadconnectorhq.com/hooks/MDkROYOZzF3nLfQs36Oe/webhook-trigger/cbc3501f-836b-4318-8ac6-d24084fc4385';
const WEBHOOK_TIMEOUT_MS = 10000;

function isLifeInsuranceFunnel(funnelType: string): boolean {
  return funnelType === 'life_insurance_us'
    || funnelType === 'life_insurance_ca'
    || funnelType === 'life_insurance_ca_variant_b';
}

function getGhlWebhookUrl(funnelType: string): string {
  if (isLifeInsuranceFunnel(funnelType)) {
    console.log('📍 Using Life Insurance GHL webhook');
    return LIFE_INSURANCE_GHL_WEBHOOK;
  }
  return GHL_WEBHOOK_URL;
}

// ============================================================================
// INTERFACES
// ============================================================================

export interface WebhookPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  state: string;
  stateName: string;
  householdIncome?: string | null;
  source: string;
  funnelType: string;
  quizAnswers: Record<string, any>;
  calculatedResults?: Record<string, any>;
  licensingInfo?: Record<string, any>;
  leadScore?: number;
  timestamp: string;
  utmParams?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface WebhookResult {
  destination: string;
  success: boolean;
  status?: number;
  statusText?: string;
  response?: any;
  error?: string;
  timeout?: boolean;
  duration?: number;
}

export interface WebhookDeliveryResult {
  ghl: WebhookResult;
  success: boolean;
  timestamp: string;
}

// ============================================================================
// WEBHOOK DELIVERY FUNCTIONS
// ============================================================================

/**
 * Flatten a nested WebhookPayload into a flat object suitable for GHL.
 * GHL webhook custom-field mapping prefers flat top-level keys, so we spread
 * nested objects (quizAnswers, calculatedResults, etc.) onto the root and let
 * top-level scalars overlay them on key collisions.
 */
export function flattenPayloadForGhl(payload: WebhookPayload): Record<string, any> {
  const fullName = `${payload.firstName || ''} ${payload.lastName || ''}`.trim();

  return {
    ...(payload.quizAnswers || {}),
    ...(payload.calculatedResults || {}),
    ...(payload.licensingInfo || {}),
    ...(payload.utmParams || {}),
    ...(payload.metadata || {}),

    firstName: payload.firstName,
    lastName: payload.lastName,
    fullName,
    email: payload.email,
    phone: payload.phone,
    zipCode: payload.zipCode,
    state: payload.state,
    stateName: payload.stateName,
    householdIncome: payload.householdIncome ?? null,

    source: payload.source,
    funnelType: payload.funnelType,
    leadScore: payload.leadScore ?? 0,
    timestamp: payload.timestamp,
  };
}

async function sendWebhookWithTimeout(
  url: string,
  payload: Record<string, any>,
  destination: string
): Promise<WebhookResult> {
  const startTime = Date.now();

  console.log(`🚀 Sending to ${destination}:`, {
    url: url,
    email: payload.email,
    funnelType: payload.funnelType
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    let responseBody: any = {};
    try {
      const text = await response.text();
      if (text) {
        try {
          responseBody = JSON.parse(text);
        } catch {
          responseBody = { raw: text };
        }
      }
    } catch (parseError) {
      console.warn(`⚠️ Could not parse ${destination} response:`, parseError);
    }

    if (response.ok) {
      console.log(`✅ ${destination} success:`, {
        status: response.status,
        duration: `${duration}ms`,
        response: responseBody
      });

      return {
        destination,
        success: true,
        status: response.status,
        statusText: response.statusText,
        response: responseBody,
        duration
      };
    }

    console.error(`❌ ${destination} failed:`, {
      status: response.status,
      statusText: response.statusText,
      response: responseBody,
      duration: `${duration}ms`
    });

    return {
      destination,
      success: false,
      status: response.status,
      statusText: response.statusText,
      response: responseBody,
      duration
    };
  } catch (fetchError: any) {
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    if (fetchError.name === 'AbortError') {
      console.error(`❌ ${destination} timeout after ${WEBHOOK_TIMEOUT_MS}ms`);
      return { destination, success: false, error: 'Request timeout', timeout: true, duration };
    }

    console.error(`❌ ${destination} exception:`, fetchError);
    return { destination, success: false, error: fetchError.message || 'Unknown error', duration };
  }
}

/**
 * Send a verified lead to the appropriate GHL webhook for its funnel.
 *
 * @param payload - The lead data to send
 * @param isVerified - Whether the lead has completed OTP verification
 */
export async function sendLeadToGhl(
  payload: WebhookPayload,
  isVerified: boolean = true
): Promise<WebhookDeliveryResult> {
  console.log('📤 GHL Delivery Service:', {
    email: payload.email,
    funnelType: payload.funnelType,
    isVerified,
    timestamp: new Date().toISOString()
  });

  if (!isVerified) {
    console.log('⚠️ Lead not verified, skipping GHL delivery');
    return {
      ghl: {
        destination: 'GHL',
        success: false,
        error: 'Lead not verified (OTP not completed)'
      },
      success: false,
      timestamp: new Date().toISOString()
    };
  }

  const ghlWebhookUrl = getGhlWebhookUrl(payload.funnelType);

  if (!ghlWebhookUrl) {
    console.warn('⚠️ GHL webhook URL not configured for funnel:', payload.funnelType);
    return {
      ghl: {
        destination: 'GHL',
        success: false,
        error: `GHL webhook not configured for funnel: ${payload.funnelType}`
      },
      success: false,
      timestamp: new Date().toISOString()
    };
  }

  const ghlPayload = flattenPayloadForGhl(payload);
  const ghlResult = await sendWebhookWithTimeout(ghlWebhookUrl, ghlPayload, 'GHL');

  console.log('📊 GHL Delivery Summary:', {
    funnel: payload.funnelType,
    ghl: ghlResult.success ? '✅ Success' : '❌ Failed'
  });

  return {
    ghl: ghlResult,
    success: ghlResult.success,
    timestamp: new Date().toISOString()
  };
}

/**
 * Log webhook delivery to analytics_events table
 */
export async function logWebhookDelivery(
  leadId: string,
  contactId: string,
  sessionId: string,
  deliveryResult: WebhookDeliveryResult,
  payload: WebhookPayload,
  utmParams?: Record<string, any>
): Promise<void> {
  try {
    console.log('📊 Logging webhook delivery to analytics_events...');

    const ghlWebhookUrl = getGhlWebhookUrl(payload.funnelType);

    await callreadyQuizDb.from('analytics_events').insert({
      event_name: 'webhook_delivery',
      event_category: 'lead_distribution',
      event_label: 'parentsimple_lead_delivery',
      user_id: payload.email,
      session_id: sessionId,
      page_url: 'https://parentsimple.org/webhook-delivery',
      utm_source: utmParams?.utm_source || null,
      utm_medium: utmParams?.utm_medium || null,
      utm_campaign: utmParams?.utm_campaign || null,
      utm_term: utmParams?.utm_term || null,
      utm_content: utmParams?.utm_content || null,
      properties: {
        site_key: 'parentsimple.org',
        lead_id: leadId,
        contact_id: contactId,
        funnel_type: payload.funnelType,
        delivery_result: deliveryResult,
        webhooks: {
          ghl: {
            url: ghlWebhookUrl ? 'configured' : 'not_configured',
            funnel_type: payload.funnelType,
            webhook_used: isLifeInsuranceFunnel(payload.funnelType) ? 'life_insurance_specific' : 'default',
            success: deliveryResult.ghl.success,
            status: deliveryResult.ghl.status,
            duration: deliveryResult.ghl.duration
          }
        },
        request_payload: {
          ...payload,
          phone: '***' + payload.phone.slice(-4),
          email: payload.email.split('@')[0].substring(0, 3) + '***@' + payload.email.split('@')[1]
        },
        utm_parameters: utmParams || {}
      }
    });

    console.log('✅ Webhook delivery logged to analytics_events');
  } catch (error) {
    console.error('❌ Failed to log webhook delivery:', error);
  }
}

/**
 * Build webhook payload from lead data
 */
export function buildWebhookPayload(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  state: string;
  stateName: string;
  householdIncome?: string | null;
  funnelType: string;
  quizAnswers: Record<string, any>;
  calculatedResults?: Record<string, any>;
  licensingInfo?: Record<string, any>;
  leadScore?: number;
  utmParams?: Record<string, any>;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}): WebhookPayload {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    zipCode: data.zipCode,
    state: data.state,
    stateName: data.stateName,
    householdIncome: data.householdIncome || null,
    source: 'ParentSimple Quiz',
    funnelType: data.funnelType,
    quizAnswers: {
      ...data.quizAnswers,
      household_income: data.householdIncome
    },
    calculatedResults: data.calculatedResults,
    licensingInfo: data.licensingInfo,
    leadScore: data.leadScore || data.calculatedResults?.totalScore || data.calculatedResults?.readiness_score || 0,
    timestamp: new Date().toISOString(),
    utmParams: data.utmParams || {},
    metadata: {
      site_key: 'parentsimple.org',
      session_id: data.sessionId,
      ip_address: data.ipAddress,
      user_agent: data.userAgent,
      test_submission: false
    }
  };
}

/**
 * Check if the GHL webhook URL is configured for a specific funnel
 */
export function isGhlConfigured(funnelType?: string): boolean {
  const url = funnelType ? getGhlWebhookUrl(funnelType) : GHL_WEBHOOK_URL;
  return !!url;
}

/**
 * Get webhook configuration info (for debugging)
 */
export function getWebhookConfig(): {
  ghl: string;
  lifeInsuranceGhl: string;
} {
  return {
    ghl: GHL_WEBHOOK_URL ? 'configured' : 'not_configured',
    lifeInsuranceGhl: LIFE_INSURANCE_GHL_WEBHOOK ? 'configured' : 'not_configured'
  };
}
