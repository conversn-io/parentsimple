import { NextRequest, NextResponse } from 'next/server';
import { callreadyQuizDb } from '@/lib/callready-quiz-db';
import { sendPageViewEvent } from '@/lib/meta-capi-service';

/**
 * API Route: Track PageView to Supabase analytics_events
 * 
 * This route handles client-side PageView tracking and saves to Supabase.
 * Used by temp-tracking.ts to send page_view events.
 */
export async function POST(request: NextRequest) {
  console.log('📊 PageView Tracking API Called');
  console.log('⏰ Timestamp:', new Date().toISOString());
  
  try {
    const body = await request.json();
    console.log('📥 PageView Data:', JSON.stringify(body, null, 2));
    
    const {
      event_name = 'page_view',
      event_id,
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
      console.warn('⚠️ Missing session_id in pageview request');
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

    console.log('💾 Inserting pageview to analytics_events:', {
      event_name,
      session_id,
      page_url: page_url || page_path,
      page_title,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign
    });

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
        // Store UTM parameters in top-level fields for easy querying (only columns that exist in schema)
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_term: utmTerm,
        utm_content: utmContent,
        // Note: utm_id, gclid, fbclid, msclkid are stored in properties.utm_parameters JSONB
        // They are not top-level columns in the analytics_events table schema
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase PageView insert error:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Failed to save PageView event', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ PageView saved to Supabase successfully:', {
      id: data.id,
      event_name: data.event_name,
      session_id: data.session_id,
      page_url: data.page_url
    });

    const funnelType = properties?.funnel_type || 'college_consulting';
    if (funnelType === 'life_insurance_us') {
      try {
        // Server cookies + Vercel geo headers — same EMQ enrichment as the lead routes.
        const fbpFromCookie = request.cookies.get('_fbp')?.value || null;
        const fbcFromCookie = request.cookies.get('_fbc')?.value || null;
        const inferredCity = request.headers.get('x-vercel-ip-city') || null;
        const inferredPostalCode = request.headers.get('x-vercel-ip-postal-code') || null;

        const capiResult = await sendPageViewEvent({
          pageId: session_id,
          eventId: event_id || undefined,
          fbp: fbpFromCookie || properties?.contact?.fbp || null,
          fbc: fbcFromCookie || properties?.contact?.fbc || null,
          fbLoginId: properties?.contact?.fbLoginId || null,
          ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || null,
          userAgent: user_agent || request.headers.get('user-agent') || null,
          externalId: session_id || null,
          city: inferredCity,
          zipCode: inferredPostalCode,
          country: 'us',
          customData: {
            content_name: page_title || page_path || 'Life Insurance US',
            funnel_type: funnelType,
            page_path,
          },
          eventSourceUrl: page_url || request.url,
          funnelType,
        });

        if (!capiResult.success) {
          console.error('[Meta CAPI] PageView event failed:', capiResult.error);
        } else {
          console.log('[Meta CAPI] PageView event sent:', capiResult.eventId);
        }
      } catch (capiError) {
        console.error('[Meta CAPI] PageView error:', capiError);
      }
    }

    return NextResponse.json({
      success: true,
      event_id: data.id
    });

  } catch (error: any) {
    console.error('💥 PageView Tracking Exception:', error);
    console.error('💥 Stack trace:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


