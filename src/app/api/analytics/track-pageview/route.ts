import { NextRequest, NextResponse } from 'next/server';
import { callreadyQuizDb } from '@/lib/callready-quiz-db';

/**
 * API Route: Track PageView to Supabase analytics_events
 * 
 * This route handles client-side PageView tracking and saves to Supabase.
 * Used by temp-tracking.ts to send page_view events.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      event_name = 'page_view',
      page_title,
      page_path,
      session_id,
      page_url,
      referrer,
      user_agent,
      properties,
      utm_source,
      utm_medium,
      utm_campaign,
      utmParams // Full UTM parameters object
    } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      );
    }

    // Extract UTM parameters from body or properties
    const utmParameters = utmParams || properties?.utm_parameters || {};
    const utmSource = utm_source || utmParameters?.utm_source || null;
    const utmMedium = utm_medium || utmParameters?.utm_medium || null;
    const utmCampaign = utm_campaign || utmParameters?.utm_campaign || null;
    const utmTerm = utmParameters?.utm_term || null;
    const utmContent = utmParameters?.utm_content || null;
    const utmId = utmParameters?.utm_id || null;
    const gclid = utmParameters?.gclid || null;
    const fbclid = utmParameters?.fbclid || null;
    const msclkid = utmParameters?.msclkid || null;

    // Insert into analytics_events with UTM parameters
    const { data, error } = await callreadyQuizDb
      .from('analytics_events')
      .insert({
        event_name,
        event_category: 'navigation',
        event_label: 'parentsimple.org',
        session_id,
        page_url: page_url || page_path,
        referrer: referrer || null,
        user_agent: user_agent || null,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        properties: {
          ...properties,
          page_title,
          page_path,
          site_key: 'parentsimple.org',
          funnel_type: properties?.funnel_type || 'college_consulting',
          utm_parameters: utmParameters || {} // Store full UTM object
        },
        // Store UTM parameters in top-level fields for easy querying
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_term: utmTerm,
        utm_content: utmContent,
        utm_id: utmId,
        gclid: gclid,
        fbclid: fbclid,
        msclkid: msclkid
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase PageView insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save PageView event', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ PageView saved to Supabase:', data.id);

    return NextResponse.json({
      success: true,
      event_id: data.id
    });

  } catch (error: any) {
    console.error('❌ PageView tracking error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}




