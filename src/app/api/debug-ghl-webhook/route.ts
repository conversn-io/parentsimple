import { NextRequest, NextResponse } from 'next/server';
import { callreadyQuizDb } from '@/lib/callready-quiz-db';

export async function POST(request: NextRequest) {
  console.log('🔍 Debug GHL Webhook Test');
  
  try {
    const body = await request.json();
    console.log('📤 Request body:', JSON.stringify(body, null, 2));
    
    const { 
      phoneNumber, 
      email, 
      firstName, 
      lastName, 
      quizAnswers, 
      sessionId, 
      funnelType,
      zipCode,
      state,
      stateName,
      licensingInfo,
      calculatedResults 
    } = body;

    console.log('🔍 Extracted data:', {
      phoneNumber,
      email,
      firstName,
      lastName,
      sessionId,
      funnelType,
      zipCode,
      state,
      stateName
    });

    // Test database insert
    console.log('💾 Testing database insert...');
    const { data: lead, error: leadError } = await callreadyQuizDb
      .from('verified_leads')
      .insert({
        phone_number: phoneNumber,
        email: email,
        first_name: firstName,
        last_name: lastName,
        source: `seniorsimple_${funnelType}_funnel`,
        status: 'verified',
        quiz_answers: {
          ...quizAnswers,
          calculated_results: calculatedResults,
          session_id: sessionId,
          funnel_type: funnelType,
          zip_code: zipCode,
          state: state,
          state_name: stateName,
          licensing_info: licensingInfo
        },
        property_location: zipCode,
        verified_at: new Date().toISOString()
      })
      .select()
      .single();

    if (leadError) {
      console.error('❌ Lead Save Failed:', leadError);
      return NextResponse.json({ 
        success: false,
        error: 'Failed to save verified lead',
        details: leadError,
        code: leadError.code,
        message: leadError.message,
        hint: leadError.hint
      }, { status: 500 });
    }

    console.log('✅ Lead saved successfully:', { leadId: lead.id });

    return NextResponse.json({ 
      success: true,
      message: 'Lead saved successfully',
      leadId: lead.id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 Debug GHL Webhook Exception:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}



