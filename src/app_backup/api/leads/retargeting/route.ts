import { NextRequest, NextResponse } from 'next/server';
import { callreadyQuizDb } from '@/lib/callready-quiz-db';

export async function GET() {
  console.log('🔄 Retargeting Leads API Called');
  
  try {
    // Get email captures for retargeting (last 24 hours)
    const { data: emailCaptures, error } = await callreadyQuizDb
      .from('analytics_events')
      .select('*')
      .eq('event_name', 'email_captured')
      .eq('properties->status', 'email_captured_for_retargeting')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching retargeting leads:', error);
      return NextResponse.json({ error: 'Failed to fetch retargeting leads' }, { status: 500 });
    }

    console.log(`✅ Found ${emailCaptures?.length || 0} leads for retargeting.`);
    return NextResponse.json({ emailCaptures });

  } catch (error) {
    console.error('💥 Retargeting Leads Exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('📧 Retargeting Campaign API Called');
  
  try {
    const body = await request.json();
    const { campaignType, targetEmails, message } = body;

    // Get email captures for retargeting
    const { data: emailCaptures, error } = await callreadyQuizDb
      .from('analytics_events')
      .select('*')
      .eq('event_name', 'email_captured')
      .eq('properties->status', 'email_captured_for_retargeting')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('❌ Error fetching retargeting leads:', error);
      return NextResponse.json({ error: 'Failed to fetch retargeting leads' }, { status: 500 });
    }

    // Log retargeting campaign attempt
    await callreadyQuizDb.from('analytics_events').insert({
      event_name: 'retargeting_campaign_sent',
      event_category: 'marketing',
      event_label: 'seniorsimple_quiz_retargeting',
      properties: {
        site_key: 'seniorsimple.org',
        campaign_type: campaignType,
        target_count: emailCaptures?.length || 0,
        message: message,
        target_emails: targetEmails
      }
    });

    console.log(`✅ Retargeting campaign sent to ${emailCaptures?.length || 0} leads.`);
    return NextResponse.json({ 
      success: true, 
      targetCount: emailCaptures?.length || 0,
      campaignType 
    });

  } catch (error) {
    console.error('💥 Retargeting Campaign Exception:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}






