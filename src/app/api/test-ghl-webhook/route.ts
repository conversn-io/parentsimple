import { NextRequest, NextResponse } from 'next/server';

const GHL_WEBHOOK_URL = process.env.annuity_GHL_webhook || "https://services.leadconnectorhq.com/hooks/vTM82D7FNpIlnPgw6XNC/webhook-trigger/28ef726d-7ead-4cd2-aa85-dfc6192adfb6";

export async function GET() {
  console.log('🧪 Testing GHL Webhook');
  console.log('🔗 GHL Webhook URL:', GHL_WEBHOOK_URL);
  
  try {
    const testPayload = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '555-123-4567',
      zipCode: '12345',
      state: 'CA',
      stateName: 'California',
      source: 'SeniorSimple Test',
      funnelType: 'annuity',
      leadScore: 75,
      timestamp: new Date().toISOString()
    };

    console.log('📤 Sending test payload to GHL:', testPayload);

    const response = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload),
    });

    const responseData = await response.json().catch(() => ({}));

    console.log('📡 GHL Test Response:', {
      status: response.status,
      statusText: response.statusText,
      data: responseData
    });

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      response: responseData,
      webhookUrl: GHL_WEBHOOK_URL
    });

  } catch (error) {
    console.error('❌ GHL Test Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      webhookUrl: GHL_WEBHOOK_URL
    }, { status: 500 });
  }
}