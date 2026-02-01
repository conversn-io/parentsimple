import { NextRequest, NextResponse } from 'next/server';
import { callreadyQuizDb } from '@/lib/callready-quiz-db';
import { createCorsResponse, handleCorsOptions } from '@/lib/cors-headers';

export async function OPTIONS() {
  return handleCorsOptions();
}

/**
 * Track analytics event to Supabase analytics_events table
 * Following SeniorSimple/RateRoots architecture
 * 
 * CRITICAL: Uses 'properties' JSONB field (NOT 'event_data')
 * CRITICAL: Uses 'page_url' for filtering (NOT 'site_key' - doesn't exist)
 */
export async function POST(request: NextRequest) {
  console.log('📊 Analytics Event Tracking API Called');
  console.log('⏰ Timestamp:', new Date().toISOString());

  try {
    const body = await request.json();
    console.log('📥 Event Data:', JSON.stringify(body, null, 2));

    const {
      event_name,
      properties,
      session_id,
      user_id,
      page_url,
      referrer,
      user_agent,
      event_category,
      event_label,
      event_value,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      ip_address
    } = body;

    // Validate required fields
    if (!event_name) {
      return createCorsResponse({ error: 'event_name is required' }, 400);
    }

    if (!properties || typeof properties !== 'object') {
      return createCorsResponse({ error: 'properties object is required' }, 400);
    }

    if (!session_id) {
      return createCorsResponse({ error: 'session_id is required' }, 400);
    }

    if (!page_url) {
      return createCorsResponse({ error: 'page_url is required (full URL with domain)' }, 400);
    }

    // Get IP address from headers if not provided
    const finalIpAddress = ip_address ||
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      null;

    // Get user agent from headers if not provided
    const finalUserAgent = user_agent || 
      request.headers.get('user-agent') || 
      null;

    // Build event data
    const eventData = {
      event_name,
      properties, // ⚠️ CRITICAL: Use 'properties' NOT 'event_data'
      session_id,
      user_id: user_id || session_id, // Use session_id as user_id if not provided
      page_url, // ⚠️ CRITICAL: Full URL with domain (not site_key!)
      referrer: referrer || null,
      user_agent: finalUserAgent,
      event_category: event_category || 'engagement',
      event_label: event_label || event_name,
      event_value: event_value || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      utm_term: utm_term || null,
      utm_content: utm_content || null,
      ip_address: finalIpAddress,
      created_at: new Date().toISOString()
    };

    console.log('💾 Inserting event to analytics_events:', {
      event_name: eventData.event_name,
      session_id: eventData.session_id,
      page_url: eventData.page_url
    });

    // Insert into analytics_events table
    const { data, error } = await callreadyQuizDb
      .from('analytics_events')
      .insert(eventData)
      .select('*')
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return createCorsResponse({ 
        error: 'Failed to insert event', 
        details: error.message 
      }, 500);
    }

    console.log('✅ Event tracked successfully:', {
      id: data.id,
      event_name: data.event_name,
      session_id: data.session_id
    });

    return createCorsResponse({ 
      success: true, 
      event_id: data.id,
      event_name: data.event_name
    });

  } catch (error) {
    console.error('💥 Analytics Event Tracking Exception:', error);
    return createCorsResponse({ error: 'Internal server error' }, 500);
  }
}
