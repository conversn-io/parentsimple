/**
 * ParentSimple Unified Webhook Delivery Service
 * 
 * Sends verified leads to multiple destinations:
 * 1. GoHighLevel (GHL) CRM
 * 2. Funnel-specific Zapier webhooks (third-party client)
 * 3. Supabase database
 * 
 * Key Features:
 * - Funnel-specific webhook routing (Life Insurance CA vs Elite University)
 * - Parallel webhook delivery for speed
 * - Comprehensive error handling
 * - Timeout protection
 * - Detailed logging
 * - Only sends VERIFIED leads (successful OTP) to external webhooks
 * - Failed OTP attempts only saved to Supabase, not sent to webhooks
 */

import { callreadyQuizDb } from './callready-quiz-db';

// Configuration - Funnel-specific webhooks
const GHL_WEBHOOK_URL = process.env.PARENT_SIMPLE_GHL_WEBHOOK || process.env.PARENTSIMPLE_GHL_WEBHOOK || '';
const LIFE_INSURANCE_ZAPIER_WEBHOOK = process.env.PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK || '';
const ELITE_UNIVERSITY_ZAPIER_WEBHOOK = process.env.PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK || '';
const WEBHOOK_TIMEOUT_MS = 10000; // 10 seconds

/**
 * Get appropriate Zapier webhook URL based on funnel type
 */
function getZapierWebhookUrl(funnelType: string): string {
  console.log('🔀 Routing webhook for funnel:', funnelType);
  
  if (funnelType === 'life_insurance_ca') {
    console.log('📍 Using Life Insurance Zapier webhook');
    return LIFE_INSURANCE_ZAPIER_WEBHOOK;
  }
  
  if (funnelType === 'elite_university_readiness') {
    console.log('📍 Using Elite University Zapier webhook');
    return ELITE_UNIVERSITY_ZAPIER_WEBHOOK;
  }
  
  console.warn('⚠️ Unknown funnel type, no Zapier webhook configured:', funnelType);
  return '';
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
  zapier: WebhookResult;
  allSuccessful: boolean;
  timestamp: string;
}

// ============================================================================
// WEBHOOK DELIVERY FUNCTIONS
// ============================================================================

/**
 * Send webhook with timeout protection
 */
async function sendWebhookWithTimeout(
  url: string,
  payload: WebhookPayload,
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    // Try to parse response body
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
    } else {
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
    }
  } catch (fetchError: any) {
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    if (fetchError.name === 'AbortError') {
      console.error(`❌ ${destination} timeout after ${WEBHOOK_TIMEOUT_MS}ms`);
      return {
        destination,
        success: false,
        error: 'Request timeout',
        timeout: true,
        duration
      };
    }

    console.error(`❌ ${destination} exception:`, fetchError);
    return {
      destination,
      success: false,
      error: fetchError.message || 'Unknown error',
      duration
    };
  }
}

/**
 * Send verified lead to all webhook destinations (GHL + Zapier)
 * 
 * @param payload - The lead data to send
 * @param isVerified - Whether the lead has completed OTP verification
 * @returns Results from all webhook deliveries
 */
export async function sendLeadToWebhooks(
  payload: WebhookPayload,
  isVerified: boolean = true
): Promise<WebhookDeliveryResult> {
  console.log('📤 Webhook Delivery Service:', {
    email: payload.email,
    funnelType: payload.funnelType,
    isVerified: isVerified,
    timestamp: new Date().toISOString()
  });

  // Only send to external webhooks if lead is verified
  if (!isVerified) {
    console.log('⚠️ Lead not verified, skipping webhook delivery');
    return {
      ghl: {
        destination: 'GHL',
        success: false,
        error: 'Lead not verified (OTP not completed)'
      },
      zapier: {
        destination: 'Zapier',
        success: false,
        error: 'Lead not verified (OTP not completed)'
      },
      allSuccessful: false,
      timestamp: new Date().toISOString()
    };
  }

  // Get funnel-specific Zapier webhook URL
  const zapierWebhookUrl = getZapierWebhookUrl(payload.funnelType);

  // Check webhook URLs are configured
  if (!GHL_WEBHOOK_URL) {
    console.warn('⚠️ GHL webhook URL not configured');
  }
  if (!zapierWebhookUrl) {
    console.warn(`⚠️ No Zapier webhook configured for funnel: ${payload.funnelType}`);
  }

  // Send to both webhooks in parallel for speed
  const webhookPromises: Promise<WebhookResult>[] = [];

  if (GHL_WEBHOOK_URL) {
    webhookPromises.push(
      sendWebhookWithTimeout(GHL_WEBHOOK_URL, payload, 'GHL')
    );
  }

  if (zapierWebhookUrl) {
    webhookPromises.push(
      sendWebhookWithTimeout(zapierWebhookUrl, payload, `Zapier (${payload.funnelType})`)
    );
  }

  // Wait for all webhooks to complete
  const results = await Promise.all(webhookPromises);

  // Parse results
  const ghlResult = results.find(r => r.destination === 'GHL') || {
    destination: 'GHL',
    success: false,
    error: 'GHL webhook not configured'
  };

  const zapierResult = results.find(r => r.destination.includes('Zapier')) || {
    destination: 'Zapier',
    success: false,
    error: `No Zapier webhook configured for funnel: ${payload.funnelType}`
  };

  const allSuccessful = ghlResult.success && zapierResult.success;

  console.log('📊 Webhook Delivery Summary:', {
    funnel: payload.funnelType,
    ghl: ghlResult.success ? '✅ Success' : '❌ Failed',
    zapier: zapierResult.success ? '✅ Success' : '❌ Failed',
    zapierUrl: zapierWebhookUrl ? 'configured' : 'not_configured',
    allSuccessful: allSuccessful ? '✅ All Successful' : '⚠️ Some Failed'
  });

  return {
    ghl: ghlResult,
    zapier: zapierResult,
    allSuccessful,
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
    
    // Get the Zapier webhook URL that was used for this funnel
    const zapierWebhookUrl = getZapierWebhookUrl(payload.funnelType);

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
            url: GHL_WEBHOOK_URL ? 'configured' : 'not_configured',
            success: deliveryResult.ghl.success,
            status: deliveryResult.ghl.status,
            duration: deliveryResult.ghl.duration
          },
          zapier: {
            url: zapierWebhookUrl ? 'configured' : 'not_configured',
            funnel_type: payload.funnelType,
            webhook_used: zapierWebhookUrl ? 'funnel_specific' : 'none',
            success: deliveryResult.zapier.success,
            status: deliveryResult.zapier.status,
            duration: deliveryResult.zapier.duration
          }
        },
        request_payload: {
          ...payload,
          // Redact sensitive data for logging
          phone: '***' + payload.phone.slice(-4),
          email: payload.email.split('@')[0].substring(0, 3) + '***@' + payload.email.split('@')[1]
        },
        utm_parameters: utmParams || {}
      }
    });

    console.log('✅ Webhook delivery logged to analytics_events');
  } catch (error) {
    console.error('❌ Failed to log webhook delivery:', error);
    // Don't throw - logging failure shouldn't break the flow
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
      household_income: data.householdIncome // Ensure it's in quizAnswers too
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
 * Check if webhook URLs are configured for a specific funnel
 */
export function areWebhooksConfigured(funnelType?: string): {
  ghl: boolean;
  zapier: boolean;
  zapierUrl?: string;
  any: boolean;
  all: boolean;
} {
  const zapierUrl = funnelType ? getZapierWebhookUrl(funnelType) : '';
  
  return {
    ghl: !!GHL_WEBHOOK_URL,
    zapier: !!zapierUrl,
    zapierUrl: zapierUrl || undefined,
    any: !!(GHL_WEBHOOK_URL || zapierUrl),
    all: !!(GHL_WEBHOOK_URL && zapierUrl)
  };
}

/**
 * Get webhook configuration info (for debugging)
 */
export function getWebhookConfig(): {
  ghl: string;
  lifeInsuranceZapier: string;
  eliteUniversityZapier: string;
} {
  return {
    ghl: GHL_WEBHOOK_URL ? 'configured' : 'not_configured',
    lifeInsuranceZapier: LIFE_INSURANCE_ZAPIER_WEBHOOK ? 'configured' : 'not_configured',
    eliteUniversityZapier: ELITE_UNIVERSITY_ZAPIER_WEBHOOK ? 'configured' : 'not_configured'
  };
}
