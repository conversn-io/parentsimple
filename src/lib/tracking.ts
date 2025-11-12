// 🎯 COMPREHENSIVE TRACKING SOLUTION FOR SENIORSIMPLE PLATFORM
// Implements GA4, Meta, and Lead Delivery tracking with hardened reliability

// Declare global interfaces for tracking
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    fbq: any;
    dataLayer: any[];
    google_tag_manager?: any;
  }
}

// Configuration - SeniorSimple specific
const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID_SENIORSIMPLE || process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX';
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID_SENIORSIMPLE || process.env.NEXT_PUBLIC_META_PIXEL_ID || 'XXXXXXXXXXXXXXX';
const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID_SENIORSIMPLE || 'GTM-XXXXXXX';

// Tracking event interfaces
interface TrackingEvent {
  event_name: string;
  event_category: string;
  event_label?: string;
  value?: number;
  properties?: Record<string, any>;
}

export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  zipCode: string;
  state: string;
  stateName: string;
  quizAnswers: Record<string, any>;
  sessionId: string;
  funnelType: string;
  age?: number;
  currentInsurance?: string;
  healthStatus?: string;
  leadScore?: number;
  riskLevel?: string;
  recommendedProducts?: string[];
  medicareEligibility?: string;
  incomeRange?: string;
}

// Initialize tracking functions
export function initializeTracking() {
  // Initialize GTM
  if (typeof window !== 'undefined' && window.google_tag_manager) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });
  }

  // Initialize GA4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA4_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href
    });
  }

  // Initialize Meta Pixel
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
}

// GA4 Event Tracking
export function trackGA4Event(event: TrackingEvent) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.event_name, {
      event_category: event.event_category,
      event_label: event.event_label,
      value: event.value,
      ...event.properties
    });
  }

  // Also push to dataLayer for GTM
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: event.event_name,
      event_category: event.event_category,
      event_label: event.event_label,
      value: event.value,
      ...event.properties
    });
  }
}

// Meta Pixel Event Tracking
export function trackMetaEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, properties);
  }
}

// Question-level tracking for fall-off analysis
export function trackQuestionAnswer(questionId: string, answer: any, step: number, totalSteps: number) {
  const event: TrackingEvent = {
    event_name: 'question_answer',
    event_category: 'quiz_interaction',
    event_label: questionId,
    properties: {
      question_id: questionId,
      answer: answer,
      step: step,
      total_steps: totalSteps,
      progress_percentage: Math.round((step / totalSteps) * 100)
    }
  };

  trackGA4Event(event);
  
  // Also track in dataLayer for detailed analysis
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'question_answer',
      question_id: questionId,
      answer: answer,
      step: step,
      total_steps: totalSteps,
      progress_percentage: Math.round((step / totalSteps) * 100)
    });
  }
}

// Lead form submission tracking
export function trackLeadFormSubmit(leadData: LeadData) {
  // GA4 Lead Event
  const ga4Event: TrackingEvent = {
    event_name: 'lead_form_submit',
    event_category: 'lead_generation',
    event_label: 'seniorsimple_lead',
    value: 1,
    properties: {
      lead_source: 'seniorsimple_platform',
      funnel_type: leadData.funnelType,
      lead_score: leadData.leadScore,
      state: leadData.state,
      zip_code: leadData.zipCode,
      session_id: leadData.sessionId
    }
  };

  trackGA4Event(ga4Event);

  // Meta Lead Event
  trackMetaEvent('Lead', {
    content_name: `SeniorSimple ${leadData.funnelType} Lead`,
    content_category: 'lead_generation',
    value: leadData.leadScore || 0,
    currency: 'USD'
  });

  // GTM dataLayer push
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'lead_form_submit',
      lead_data: leadData,
      lead_source: 'seniorsimple_platform',
      funnel_type: leadData.funnelType,
      session_id: leadData.sessionId,
      lead_score: leadData.leadScore
    });
  }
}

// Page view tracking
export function trackPageView(pageName: string, pagePath: string) {
  // GA4 Page View
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA4_MEASUREMENT_ID, {
      page_title: pageName,
      page_location: window.location.href,
      page_path: pagePath
    });
  }

  // Meta PageView
  trackMetaEvent('PageView');

  // GTM dataLayer
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_name: pageName,
      page_path: pagePath
    });
  }
}

// Quiz start tracking
export function trackQuizStart(quizType: string, sessionId: string) {
  const event: TrackingEvent = {
    event_name: 'quiz_start',
    event_category: 'quiz_interaction',
    event_label: quizType,
    properties: {
      quiz_type: quizType,
      session_id: sessionId
    }
  };

  trackGA4Event(event);
  trackMetaEvent('InitiateCheckout', { content_name: `${quizType} Quiz` });
}

// Quiz completion tracking
export function trackQuizComplete(quizType: string, sessionId: string, completionTime: number) {
  const event: TrackingEvent = {
    event_name: 'quiz_complete',
    event_category: 'quiz_interaction',
    event_label: quizType,
    value: completionTime,
    properties: {
      quiz_type: quizType,
      session_id: sessionId,
      completion_time_seconds: completionTime
    }
  };

  trackGA4Event(event);
  trackMetaEvent('CompleteRegistration', { content_name: `${quizType} Quiz` });
}

// Lead delivery tracking
export async function trackLeadDelivery(leadData: LeadData) {
  try {
    // Send to Supabase (CallReady Client Platform)
    const supabaseResponse = await fetch('/api/leads/save-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });

    if (!supabaseResponse.ok) {
      throw new Error('Supabase save failed');
    }

    // Send to GHL webhook
    const ghlResponse = await fetch('/api/leads/send-to-ghl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });

    if (!ghlResponse.ok) {
      throw new Error('GHL webhook failed');
    }

    // Track successful delivery
    trackGA4Event({
      event_name: 'lead_delivered',
      event_category: 'lead_processing',
      event_label: 'success',
      properties: {
        supabase_success: true,
        ghl_success: true,
        lead_id: leadData.sessionId
      }
    });

    return { success: true, supabase: true, ghl: true };
  } catch (error) {
    console.error('Lead delivery failed:', error);
    
    // Track failed delivery
    trackGA4Event({
      event_name: 'lead_delivery_failed',
      event_category: 'lead_processing',
      event_label: 'error',
      properties: {
        error: error instanceof Error ? error.message : String(error),
        lead_id: leadData.sessionId
      }
    });

    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// Legacy functions for backward compatibility
export function trackQuizStartLegacy(data: any) {
  trackQuizStart(data.quizType || 'unknown', data.sessionId || 'unknown');
}

export function trackQuizCompleteLegacy(data: any) {
  trackQuizComplete(data.quizType || 'unknown', data.sessionId || 'unknown', data.completionTime || 0);
}

export function updateUserData(data: any) {
  console.log('User data updated:', data);
}

export function extractFacebookClickId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('fbclid') || null;
}

export function trackAppointmentBooked(data: any) {
  trackGA4Event({
    event_name: 'appointment_booked',
    event_category: 'conversion',
    event_label: 'appointment',
    value: 1
  });
  
  trackMetaEvent('Schedule', { content_name: 'Appointment Booking' });
}

export function trackPhoneClick() {
  trackGA4Event({
    event_name: 'phone_click',
    event_category: 'engagement',
    event_label: 'phone_number'
  });
  
  trackMetaEvent('Contact', { content_name: 'Phone Click' });
}

// CAPI Lead Event
export async function sendCAPILeadEvent(leadData: LeadData) {
  try {
    const response = await fetch('/api/capi/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData)
    });
    
    if (response.ok) {
      console.log('✅ CAPI Lead event sent');
    } else {
      console.error('❌ CAPI Lead failed:', await response.text());
    }
  } catch (error) {
    console.error('❌ CAPI Lead error:', error);
  }
}

// CAPI Schedule Event
export async function sendCAPIScheduleEvent(appointmentData: any) {
  try {
    const response = await fetch('/api/capi/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });
    
    if (response.ok) {
      console.log('✅ CAPI Schedule event sent');
    } else {
      console.error('❌ CAPI Schedule failed:', await response.text());
    }
  } catch (error) {
    console.error('❌ CAPI Schedule error:', error);
  }
}

// CAPI ViewContent Event
export async function sendCAPIViewContentEvent(quizData: any) {
  try {
    const response = await fetch('/api/capi/view-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quizData)
    });
    
    if (response.ok) {
      console.log('✅ CAPI ViewContent event sent');
    } else {
      console.error('❌ CAPI ViewContent failed:', await response.text());
    }
  } catch (error) {
    console.error('❌ CAPI ViewContent error:', error);
  }
}
// Site configuration mapping for SeniorSimple
const SITE_CONFIG: Record<string, string> = {
  'senior-simple': 'SENIORSIMPLE',
  'medicare': 'SENIORSIMPLE',
  'insurance': 'SENIORSIMPLE',
  'annuity': 'SENIORSIMPLE',
  'retirement': 'SENIORSIMPLE',
  'health-insurance': 'SENIORSIMPLE',
  'medicare-supplement': 'SENIORSIMPLE',
  'medicare-advantage': 'SENIORSIMPLE'
}

// Determine site key based on funnel type or current domain
function determineSiteKey(funnelType: string): string {
  // First try to determine by funnel type
  if (SITE_CONFIG[funnelType]) {
    return SITE_CONFIG[funnelType]
  }
  
  // Fallback to domain-based detection
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    if (hostname.includes('seniorsimple.com')) {
      return 'SENIORSIMPLE'
    } else if (hostname.includes('rateroots.com')) {
      return 'RATEROOTS'
    }
  }
  
  // Default to SENIORSIMPLE for this platform
  return 'SENIORSIMPLE'
}

// Updated CAPI Lead Event with site detection
export async function sendCAPILeadEventMultiSite(leadData: LeadData) {
  try {
    const siteKey = determineSiteKey(leadData.funnelType || 'medicare')
    
    const response = await fetch('/api/capi/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...leadData,
        siteKey: siteKey
      })
    });
    
    if (response.ok) {
      const result = await response.json()
      console.log(`✅ CAPI Lead event sent for ${result.siteKey || siteKey}`);
    } else {
      console.error('❌ CAPI Lead failed:', await response.text());
    }
  } catch (error) {
    console.error('❌ CAPI Lead error:', error);
  }
}

// Updated CAPI Schedule Event with site detection
export async function sendCAPIScheduleEventMultiSite(appointmentData: any) {
  try {
    const siteKey = determineSiteKey(appointmentData.funnelType || 'medicare')
    
    const response = await fetch('/api/capi/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...appointmentData,
        siteKey: siteKey
      })
    });
    
    if (response.ok) {
      const result = await response.json()
      console.log(`✅ CAPI Schedule event sent for ${result.siteKey || siteKey}`);
    } else {
      console.error('❌ CAPI Schedule failed:', await response.text());
    }
  } catch (error) {
    console.error('❌ CAPI Schedule error:', error);
  }
}

// Updated CAPI ViewContent Event with site detection
export async function sendCAPIViewContentEventMultiSite(quizData: any) {
  try {
    const siteKey = determineSiteKey(quizData.quizType || 'medicare')
    
    const response = await fetch('/api/capi/view-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...quizData,
        siteKey: siteKey
      })
    });
    
    if (response.ok) {
      const result = await response.json()
      console.log(`✅ CAPI ViewContent event sent for ${result.siteKey || siteKey}`);
    } else {
      console.error('❌ CAPI ViewContent failed:', await response.text());
    }
  } catch (error) {
    console.error('❌ CAPI ViewContent error:', error);
  }
}
