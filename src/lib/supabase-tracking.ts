/**
 * UNIFIED SUPABASE TRACKING LIBRARY FOR SENIORSIMPLE
 * 
 * This library provides cookie-proof, deduplicated tracking via Supabase Edge Functions
 * Replaces direct GTM/GA4 calls with server-side tracking for better reliability
 */

interface TrackingEvent {
  site_key: string
  funnel_type: string
  event_name: string
  session_id: string
  user_id?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  zip_code?: string
  state?: string
  state_name?: string
  contact?: {
    email?: string
    phone?: string
    first_name?: string
    last_name?: string
    ga_client_id?: string
  }
  quiz_answers?: Record<string, any>
  lead_score?: number
  consent?: boolean
}

interface LeadData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  zipCode: string
  state: string
  stateName: string
  quizAnswers: Record<string, any>
  sessionId: string
  funnelType: string
  leadScore?: number
  age?: number
  currentInsurance?: string
  healthStatus?: string
  medicareEligibility?: string
  incomeRange?: string
}

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase configuration missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Site configuration
const SITE_CONFIG = {
  site_key: 'SENIORSIMPLE',
  default_funnel: 'medicare'
}

// Utility functions
function getUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  
  const urlParams = new URLSearchParams(window.location.search)
  return {
    utm_source: urlParams.get('utm_source') || '',
    utm_medium: urlParams.get('utm_medium') || '',
    utm_campaign: urlParams.get('utm_campaign') || ''
  }
}

function getGAClientId(): string | undefined {
  if (typeof window === 'undefined') return undefined
  
  // Try to get GA client ID from gtag
  if (typeof window.gtag !== 'undefined') {
    return new Promise((resolve) => {
      window.gtag('get', 'GA_MEASUREMENT_ID', 'client_id', resolve)
    }) as any
  }
  
  // Fallback: try to get from cookies
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === '_ga') {
      return value?.split('.').slice(-2).join('.')
    }
  }
  
  return undefined
}

function getMetaPixelIds(): { fbc?: string; fbp?: string } {
  if (typeof window === 'undefined') return {}
  
  const cookies = document.cookie.split(';')
  const result: { fbc?: string; fbp?: string } = {}
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === '_fbc') result.fbc = value
    if (name === '_fbp') result.fbp = value
  }
  
  return result
}

// Core tracking functions
async function sendEventToSupabase(eventData: TrackingEvent): Promise<boolean> {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/ingest-event`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Supabase tracking error:', error)
      return false
    }

    const result = await response.json()
    if (result.status === 'duplicate') {
      console.log('Event already processed (deduplicated)')
    }
    
    return true
  } catch (error) {
    console.error('Failed to send event to Supabase:', error)
    return false
  }
}

// Public API functions
export function initializeTracking(): void {
  console.log('🎯 SeniorSimple Supabase Tracking Initialized')
}

export function trackPageView(pageTitle: string, pagePath: string): void {
  const utmParams = getUTMParams()
  const gaClientId = getGAClientId()
  const metaIds = getMetaPixelIds()
  
  const eventData: TrackingEvent = {
    site_key: SITE_CONFIG.site_key,
    funnel_type: SITE_CONFIG.default_funnel,
    event_name: 'page_view',
    session_id: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user_id: undefined, // Will be set when user is identified
    utm_source: utmParams.utm_source,
    utm_medium: utmParams.utm_medium,
    utm_campaign: utmParams.utm_campaign,
    contact: {
      ga_client_id: gaClientId,
      ...metaIds
    },
    consent: true // Assume consent for now
  }

  sendEventToSupabase(eventData)
}

export function trackQuizStart(quizType: string, sessionId: string): void {
  const utmParams = getUTMParams()
  const gaClientId = getGAClientId()
  const metaIds = getMetaPixelIds()
  
  const eventData: TrackingEvent = {
    site_key: SITE_CONFIG.site_key,
    funnel_type: quizType,
    event_name: 'quiz_start',
    session_id: sessionId,
    user_id: undefined,
    utm_source: utmParams.utm_source,
    utm_medium: utmParams.utm_medium,
    utm_campaign: utmParams.utm_campaign,
    contact: {
      ga_client_id: gaClientId,
      ...metaIds
    },
    consent: true
  }

  sendEventToSupabase(eventData)
}

export function trackQuestionAnswer(
  questionId: string, 
  answer: any, 
  step: number, 
  totalSteps: number,
  sessionId: string,
  funnelType: string = SITE_CONFIG.default_funnel
): void {
  const utmParams = getUTMParams()
  const gaClientId = getGAClientId()
  const metaIds = getMetaPixelIds()
  
  // Extract structured data from answer if available
  const extra = answer && typeof answer === 'object' ? answer as Record<string, any> : {}
  
  const eventData: TrackingEvent = {
    site_key: SITE_CONFIG.site_key,
    funnel_type: funnelType,
    event_name: 'question_answer',
    session_id: sessionId,
    user_id: undefined,
    utm_source: utmParams.utm_source,
    utm_medium: utmParams.utm_medium,
    utm_campaign: utmParams.utm_campaign,
    zip_code: extra.zip_code,
    state: extra.state,
    state_name: extra.state_name,
    contact: {
      ga_client_id: gaClientId,
      ...metaIds
    },
    quiz_answers: {
      [questionId]: answer,
      step,
      total_steps: totalSteps,
      progress_percentage: Math.round((step / totalSteps) * 100)
    },
    consent: true
  }

  sendEventToSupabase(eventData)
}

export function trackQuizComplete(
  quizType: string,
  sessionId: string,
  funnelType: string,
  completionTime: number
): void {
  const utmParams = getUTMParams()
  const gaClientId = getGAClientId()
  const metaIds = getMetaPixelIds()
  
  const eventData: TrackingEvent = {
    site_key: SITE_CONFIG.site_key,
    funnel_type: funnelType,
    event_name: 'quiz_complete',
    session_id: sessionId,
    user_id: undefined,
    utm_source: utmParams.utm_source,
    utm_medium: utmParams.utm_medium,
    utm_campaign: utmParams.utm_campaign,
    contact: {
      ga_client_id: gaClientId,
      ...metaIds
    },
    quiz_answers: {
      completion_time: completionTime,
      quiz_type: quizType
    },
    consent: true
  }

  sendEventToSupabase(eventData)
}

export function trackLeadFormSubmit(leadData: LeadData): void {
  const utmParams = getUTMParams()
  const gaClientId = getGAClientId()
  const metaIds = getMetaPixelIds()
  
  const eventData: TrackingEvent = {
    site_key: SITE_CONFIG.site_key,
    funnel_type: leadData.funnelType,
    event_name: 'lead_form_submit',
    session_id: leadData.sessionId,
    user_id: undefined,
    utm_source: utmParams.utm_source,
    utm_medium: utmParams.utm_medium,
    utm_campaign: utmParams.utm_campaign,
    zip_code: leadData.zipCode,
    state: leadData.state,
    state_name: leadData.stateName,
    contact: {
      email: leadData.email,
      phone: leadData.phoneNumber,
      first_name: leadData.firstName,
      last_name: leadData.lastName,
      ga_client_id: gaClientId,
      ...metaIds
    },
    quiz_answers: leadData.quizAnswers,
    lead_score: leadData.leadScore,
    consent: true
  }

  sendEventToSupabase(eventData)
}

// Legacy GTM functions (for backward compatibility)
export function trackGA4Event(event: any): void {
  // This is now handled server-side via Supabase
  console.log('GA4 event handled server-side:', event)
}

export function trackMetaEvent(eventName: string, params: any): void {
  // This is now handled server-side via Supabase
  console.log('Meta event handled server-side:', eventName, params)
}

export function sendCAPILeadEventMultiSite(leadData: LeadData): void {
  // This is now handled server-side via Supabase
  console.log('CAPI event handled server-side:', leadData)
}

export function sendCAPIViewContentEventMultiSite(params: any): void {
  // This is now handled server-side via Supabase
  console.log('CAPI view content handled server-side:', params)
}

export function sendCAPIScheduleEventMultiSite(params: any): void {
  // This is now handled server-side via Supabase
  console.log('CAPI schedule handled server-side:', params)
}

// Export types for use in components
export type { LeadData, TrackingEvent }
