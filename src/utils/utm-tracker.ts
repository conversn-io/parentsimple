import { UTMParameters } from './utm-utils';

export const trackUTMParameters = async (
  sessionId: string, 
  utmParams: UTMParameters,
  userId?: string
): Promise<boolean> => {
  try {
    // Use the existing track-utm Supabase Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_QUIZ_URL || 'https://jqjftrlnyysqcwbbigpw.supabase.co';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_QUIZ_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxamZ0cmxueXlzcWN3YmJpZ3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTQ2MzksImV4cCI6MjA2Njg3MDYzOX0.ZqgLIflQJY5zC3ZnU5K9k_KEM9bDdNhtq3ek6ckuwjAo';

    // Create flattened payload structure (following your proven pattern)
    const utmPayload = {
      session_id: sessionId,
      page_url: window.location.href,
      landing_page: window.location.pathname,
      referrer: document.referrer,
      funnel_type: 'annuity',
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      utm_source: utmParams.utm_source,
      utm_medium: utmParams.utm_medium,
      utm_campaign: utmParams.utm_campaign,
      utm_term: utmParams.utm_term,
      utm_content: utmParams.utm_content,
      utm_id: utmParams.utm_id,
      gclid: utmParams.gclid,
      fbclid: utmParams.fbclid,
      msclkid: utmParams.msclkid,
      utm: utmParams // Keep nested object too
    };

    console.log('📊 UTM Tracking Payload:', utmPayload);

    const response = await fetch(`${supabaseUrl}/functions/v1/track-utm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`
      },
      body: JSON.stringify(utmPayload)
    });

    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ UTM Parameters Tracked Successfully:', {
        sessionId,
        utmRecordId: result.utmRecordId,
        timestamp: new Date().toISOString()
      });
      return true;
    } else {
      console.error('❌ UTM Tracking Failed:', {
        sessionId,
        error: result.error,
        response: result,
        timestamp: new Date().toISOString()
      });
      return false;
    }
  } catch (error) {
    console.error('❌ UTM Tracking Exception:', {
      sessionId,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
    return false;
  }
};


