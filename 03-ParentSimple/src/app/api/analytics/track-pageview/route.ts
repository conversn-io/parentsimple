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
      utm_campaign
    } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      );
    }

    // Insert into analytics_events
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
          funnel_type: properties?.funnel_type || 'college_consulting'
        }
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




