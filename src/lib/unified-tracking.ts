/**
 * ParentSimple Unified Tracking System
 * Following SeniorSimple/RateRoots Architecture
 * 
 * Dual Tracking:
 * - Client-side: GA4 and Meta Pixel
 * - Server-side: Supabase analytics_events table
 * 
 * Key Features:
 * - Quiz step tracking
 * - Page view tracking
 * - Lead form submission tracking
 * - UTM parameter capture
 * - Session management
 * - Graceful error handling
 */

// Global declarations
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: any;
    dataLayer: any[];
  }
}

// Configuration
const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID_PARENTSIMPLE || 'G-ZC29XQ0W2J';
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID_PARENTSIMPLE || '799755069642014';

console.log('🔧 ParentSimple Unified Tracking Config:', {
  GA4_ID: GA4_MEASUREMENT_ID,
  META_ID: META_PIXEL_ID,
});

// ============================================================================
// INTERFACES
// ============================================================================

export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  zipCode: string;
  state: string;
  stateName: string;
  householdIncome?: string;
  quizAnswers: Record<string, any>;
  calculatedResults?: Record<string, any>;
  licensingInfo?: Record<string, any>;
  sessionId: string;
  funnelType: string;
  leadScore?: number;
  utmParams?: Record<string, any>;
  metaEventId?: string;
}

export interface SupabaseTrackingEvent {
  event_name: string;
  properties: Record<string, any>;
  session_id: string;
  user_id: string;
  page_url: string;
  referrer: string | null;
  user_agent: string | null;
  event_category: string;
  event_label: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  ip_address?: string | null;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Bot detection
 */
export function isBot(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  
  const ua = navigator.userAgent || '';
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /crawling/i,
    /facebookexternalhit/i, /Googlebot/i, /Bingbot/i,
    /Slurp/i, /DuckDuckBot/i, /Baiduspider/i,
    /YandexBot/i, /Sogou/i, /Exabot/i,
    /facebot/i, /ia_archiver/i
  ];
  
  return botPatterns.some(pattern => pattern.test(ua));
}

/**
 * Get or create session ID
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session_id', sessionId);
  }
  
  return sessionId;
}

/**
 * Extract UTM parameters from URL
 */
export function getUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  return {
    utm_source: urlParams.get('utm_source') || '',
    utm_medium: urlParams.get('utm_medium') || '',
    utm_campaign: urlParams.get('utm_campaign') || '',
    utm_term: urlParams.get('utm_term') || '',
    utm_content: urlParams.get('utm_content') || '',
    utm_id: urlParams.get('utm_id') || '',
    gclid: urlParams.get('gclid') || '',
    fbclid: urlParams.get('fbclid') || '',
    msclkid: urlParams.get('msclkid') || ''
  };
}

/**
 * Get GA4 Client ID
 */
export function getGAClientId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === '_ga') {
      const parts = value?.split('.');
      if (parts && parts.length >= 2) {
        return parts.slice(-2).join('.');
      }
    }
  }
  
  return undefined;
}

/**
 * Get Meta Pixel IDs
 */
export function getMetaPixelIds(): { fbc?: string; fbp?: string; fbLoginId?: string } {
  if (typeof window === 'undefined') return {};
  
  const result: { fbc?: string; fbp?: string; fbLoginId?: string } = {};
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbc') result.fbc = value;
    if (name === '_fbp') result.fbp = value;
  }
  
  return result;
}

// ============================================================================
// CLIENT-SIDE TRACKING (GA4 & META PIXEL)
// ============================================================================

/**
 * Track GA4 event
 */
function trackGA4Event(eventName: string, parameters: Record<string, any>): void {
  if (isBot()) return;
  
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...parameters,
      site_key: 'parentsimple.org',
    });
    console.log(`✅ GA4: ${eventName}`, parameters);
  } else {
    console.warn('⚠️ GA4 not available');
  }
}

/**
 * Track Meta Pixel event
 */
function trackMetaEvent(
  eventName: string,
  parameters: Record<string, any>,
  options?: { eventId?: string }
): void {
  if (isBot()) return;
  
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    if (options?.eventId) {
      window.fbq('track', eventName, parameters, { eventID: options.eventId });
    } else {
      window.fbq('track', eventName, parameters);
    }
    console.log(`✅ Meta: ${eventName}`, parameters);
  } else {
    console.warn('⚠️ Meta Pixel not available');
  }
}

// ============================================================================
// SERVER-SIDE TRACKING (SUPABASE)
// ============================================================================

/**
 * Send tracking event to Supabase via API route
 */
async function sendToSupabase(eventData: SupabaseTrackingEvent): Promise<boolean> {
  if (isBot()) {
    console.log('🤖 Bot detected, skipping Supabase tracking');
    return false;
  }

  // Note: the /api/analytics/track-event route writes via a server-side
  // Supabase client with its own credentials, so the NEXT_PUBLIC anon key
  // is not required here. Gating on it previously caused silent tracking
  // loss whenever the env was missing on a deploy.

  try {
    const response = await fetch('/api/analytics/track-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      console.warn('⚠️ Supabase tracking failed:', response.statusText);
      return false;
    }

    console.log('✅ Event sent to Supabase:', eventData.event_name);
    return true;
  } catch (error) {
    console.error('❌ Supabase tracking error:', error);
    return false;
  }
}

// ============================================================================
// PUBLIC TRACKING FUNCTIONS
// ============================================================================

/**
 * Track quiz start
 */
export function trackQuizStart(
  quizType: string, 
  sessionId: string,
  funnelType: string = 'life_insurance_ca'
): void {
  console.log('📊 Tracking quiz_start:', { quizType, sessionId, funnelType });
  
  // Client-side tracking
  trackGA4Event('quiz_start', {
    quiz_type: quizType,
    funnel_type: funnelType,
    session_id: sessionId,
    event_category: 'quiz'
  });
  
  // Server-side tracking
  const utmParams = getUTMParams();
  sendToSupabase({
    event_name: 'quiz_start',
    properties: {
      site_key: 'parentsimple.org',
      quiz_type: quizType,
      funnel_type: funnelType,
      utm_parameters: utmParams,
      contact: {
        ga_client_id: getGAClientId(),
        ...getMetaPixelIds()
      }
    },
    session_id: sessionId,
    user_id: sessionId,
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : null,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    event_category: 'quiz',
    event_label: 'quiz_start',
    utm_source: utmParams.utm_source || null,
    utm_medium: utmParams.utm_medium || null,
    utm_campaign: utmParams.utm_campaign || null,
    utm_term: utmParams.utm_term || null,
    utm_content: utmParams.utm_content || null
  }).catch(err => console.error('Failed to track quiz_start to Supabase:', err));
}

/**
 * Track quiz step viewed
 */
export function trackQuizStepViewed(
  stepNumber: number,
  stepName: string,
  sessionId: string,
  funnelType: string,
  previousStep?: string | null,
  timeOnPreviousStep?: number | null
): void {
  console.log('📊 Tracking quiz_step_viewed:', { stepNumber, stepName, funnelType });
  
  // Client-side tracking
  trackGA4Event('quiz_step_viewed', {
    step_number: stepNumber,
    step_name: stepName,
    funnel_type: funnelType,
    session_id: sessionId,
    event_category: 'quiz'
  });
  
  // Server-side tracking
  const utmParams = getUTMParams();
  sendToSupabase({
    event_name: 'quiz_step_viewed',
    properties: {
      site_key: 'parentsimple.org',
      step_number: stepNumber,
      step_name: stepName,
      funnel_type: funnelType,
      previous_step: previousStep,
      time_on_previous_step: timeOnPreviousStep,
      utm_parameters: utmParams
    },
    session_id: sessionId,
    user_id: sessionId,
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : null,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    event_category: 'quiz',
    event_label: 'step_view',
    utm_source: utmParams.utm_source || null,
    utm_medium: utmParams.utm_medium || null,
    utm_campaign: utmParams.utm_campaign || null
  }).catch(err => console.error('Failed to track step view to Supabase:', err));
}

/**
 * Track question answer
 */
export function trackQuestionAnswer(
  questionId: string,
  answer: any,
  step: number,
  totalSteps: number,
  sessionId: string,
  funnelType: string
): void {
  console.log('📊 Tracking question_answer:', { questionId, answer, step });
  
  const progressPercentage = Math.round((step / totalSteps) * 100);
  
  // Client-side tracking
  trackGA4Event('question_answer', {
    question_id: questionId,
    answer: answer,
    step: step,
    total_steps: totalSteps,
    progress_percentage: progressPercentage,
    session_id: sessionId,
    funnel_type: funnelType,
    event_category: 'quiz'
  });
  
  // Server-side tracking
  const utmParams = getUTMParams();
  sendToSupabase({
    event_name: 'question_answer',
    properties: {
      site_key: 'parentsimple.org',
      question_id: questionId,
      answer: answer,
      step: step,
      total_steps: totalSteps,
      progress_percentage: progressPercentage,
      funnel_type: funnelType,
      utm_parameters: utmParams
    },
    session_id: sessionId,
    user_id: sessionId,
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : null,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    event_category: 'quiz',
    event_label: 'question_answer',
    utm_source: utmParams.utm_source || null,
    utm_medium: utmParams.utm_medium || null,
    utm_campaign: utmParams.utm_campaign || null
  }).catch(err => console.error('Failed to track answer to Supabase:', err));
}

/**
 * Track quiz complete
 */
export function trackQuizComplete(
  quizType: string,
  sessionId: string,
  funnelType: string,
  completionTime: number
): void {
  console.log('📊 Tracking quiz_complete:', { quizType, sessionId, completionTime });
  
  // Client-side tracking
  trackGA4Event('quiz_complete', {
    quiz_type: quizType,
    funnel_type: funnelType,
    completion_time_seconds: completionTime,
    session_id: sessionId,
    event_category: 'quiz'
  });
  
  // Server-side tracking
  const utmParams = getUTMParams();
  sendToSupabase({
    event_name: 'quiz_complete',
    properties: {
      site_key: 'parentsimple.org',
      quiz_type: quizType,
      funnel_type: funnelType,
      completion_time_seconds: completionTime,
      utm_parameters: utmParams
    },
    session_id: sessionId,
    user_id: sessionId,
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : null,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    event_category: 'quiz',
    event_label: 'quiz_complete',
    utm_source: utmParams.utm_source || null,
    utm_medium: utmParams.utm_medium || null,
    utm_campaign: utmParams.utm_campaign || null
  }).catch(err => console.error('Failed to track complete to Supabase:', err));
}

/**
 * Track page view
 */
export function trackPageView(pageName: string, pagePath: string): void {
  console.log('📊 Tracking page_view:', { pageName, pagePath });
  
  if (isBot()) {
    console.log('🤖 Bot detected, skipping page view tracking');
    return;
  }
  
  const sessionId = getSessionId();
  
  // Client-side tracking
  trackGA4Event('page_view', {
    page_title: pageName,
    page_location: pagePath,
    event_category: 'engagement'
  });
  
  // Server-side tracking
  const utmParams = getUTMParams();
  sendToSupabase({
    event_name: 'page_view',
    properties: {
      site_key: 'parentsimple.org',
      path: pagePath,
      search: typeof window !== 'undefined' ? window.location.search : '',
      utm_parameters: utmParams,
      contact: {
        ga_client_id: getGAClientId(),
        ...getMetaPixelIds()
      }
    },
    session_id: sessionId,
    user_id: sessionId,
    page_url: typeof window !== 'undefined' ? window.location.href : pagePath,
    referrer: typeof document !== 'undefined' ? document.referrer : null,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    event_category: 'engagement',
    event_label: 'page_view',
    utm_source: utmParams.utm_source || null,
    utm_medium: utmParams.utm_medium || null,
    utm_campaign: utmParams.utm_campaign || null
  }).catch(err => console.error('Failed to track page view to Supabase:', err));
}

/**
 * Track email capture
 */
export function trackEmailCapture(email: string, sessionId: string, funnelType: string): void {
  console.log('📊 Tracking email_capture:', { email, sessionId });
  
  // Client-side tracking
  trackGA4Event('email_capture', {
    session_id: sessionId,
    funnel_type: funnelType,
    event_category: 'lead_generation'
  });
  
  // Server-side tracking
  const utmParams = getUTMParams();
  sendToSupabase({
    event_name: 'email_capture',
    properties: {
      site_key: 'parentsimple.org',
      funnel_type: funnelType,
      utm_parameters: utmParams
    },
    session_id: sessionId,
    user_id: email,
    page_url: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer : null,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    event_category: 'lead_generation',
    event_label: 'email_capture',
    utm_source: utmParams.utm_source || null,
    utm_medium: utmParams.utm_medium || null,
    utm_campaign: utmParams.utm_campaign || null
  }).catch(err => console.error('Failed to track email capture to Supabase:', err));
}

/**
 * Track lead form submit (phone verification complete)
 */
export function trackLeadFormSubmit(leadData: LeadData): void {
  console.log('📊 Tracking lead_form_submit:', { email: leadData.email, sessionId: leadData.sessionId });
  const metaEventId = (leadData as any).metaEventId || `${leadData.sessionId}-Lead-${Math.floor(Date.now() / 1000)}`;
  
  // Client-side tracking
  trackGA4Event('lead_form_submit', {
    session_id: leadData.sessionId,
    funnel_type: leadData.funnelType,
    value: leadData.leadScore || 0,
    state: leadData.state,
    zip_code: leadData.zipCode,
    event_category: 'lead_generation'
  });
  
  // Meta Pixel Lead event
  trackMetaEvent('Lead', {
    content_name:
      leadData.funnelType === 'life_insurance_us'
        ? 'Life Insurance US Lead'
        : leadData.funnelType === 'life_insurance_ca' || leadData.funnelType === 'life_insurance_ca_variant_b'
          ? 'Life Insurance Canada Lead'
          : 'College Planning Lead',
    content_category: 'lead_generation',
    value: leadData.leadScore || 0,
    currency:
      leadData.funnelType === 'life_insurance_ca' || leadData.funnelType === 'life_insurance_ca_variant_b'
        ? 'CAD'
        : 'USD'
  }, {
    eventId: metaEventId
  });
  
  // Server-side tracking handled by verify-otp-and-send-to-ghl route
}
