#!/usr/bin/env node
/**
 * ParentSimple Lead Conversion Smoke Test
 * Tests complete flow: OTP verification → Webhook delivery → Logging
 */

const testPayload = {
  // Contact Information (clearly marked as TEST)
  phoneNumber: '+16475551234',
  email: 'test.smoke@parentsimple.test',
  firstName: 'TEST_SMOKE',
  lastName: 'CONVERSION',
  
  // Quiz Session Data
  sessionId: `test-smoke-${Date.now()}`,
  funnelType: 'life_insurance_ca',
  
  // Location (test data)
  zipCode: 'M5H2N2',
  state: 'ON',
  stateName: 'Ontario',
  
  // Quiz Answers (simulated)
  quizAnswers: {
    contact_info: {
      firstName: 'TEST_SMOKE',
      lastName: 'CONVERSION',
      email: 'test.smoke@parentsimple.test',
      phone: '+16475551234'
    },
    household_income: '$75,000 - $100,000',
    coverage_amount: '$500,000',
    age: '35-44',
    health_status: 'good',
    smoker: 'no',
    province: 'ON',
    test_mode: true // Flag for testing
  },
  
  // Calculated Results
  calculatedResults: {
    totalScore: 85,
    readiness_score: 85,
    risk_level: 'low',
    estimated_premium: '$45/month'
  },
  
  // Licensing Info
  licensingInfo: {
    province: 'ON',
    licensed: true
  },
  
  // UTM Parameters (test campaign)
  utmParams: {
    utm_source: 'smoke_test',
    utm_medium: 'api_test',
    utm_campaign: 'conversion_test',
    utm_content: Date.now().toString(),
    test_run: true
  },
  
  // Meta CAPI cookies (simulated)
  metaCookies: {
    fbp: 'fb.1.test.smoke',
    fbc: 'fb.1.test.conversion',
    fbLoginId: null
  },
  
  // TrustedForm & Jornaya (test values)
  trustedFormCertUrl: `https://cert.trustedform.com/test-smoke-${Date.now()}`,
  jornayaLeadId: `test-smoke-jornaya-${Date.now()}`
};

async function runSmokeTest() {
  const baseUrl = process.argv[2] || 'https://parentsimple.org';
  const endpoint = `${baseUrl}/api/leads/verify-otp-and-send-to-ghl`;
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🧪 ParentSimple Lead Conversion Smoke Test');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log(`📍 Target: ${endpoint}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  console.log(`🔑 Session ID: ${testPayload.sessionId}\n`);
  
  console.log('📤 Sending test lead payload...\n');
  
  try {
    const startTime = Date.now();
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ParentSimple-SmokeTest/1.0',
        'X-Test-Run': 'true'
      },
      body: JSON.stringify(testPayload)
    });
    
    const duration = Date.now() - startTime;
    const responseData = await response.json();
    
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 RESPONSE SUMMARY');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`📡 Status: ${response.status} ${response.statusText}`);
    console.log(`✅ Success: ${responseData.success ? 'YES' : 'NO'}\n`);
    
    if (responseData.success) {
      console.log('🎯 LEAD DETAILS:');
      console.log(`   Lead ID: ${responseData.leadId || 'N/A'}`);
      console.log(`   Contact ID: ${responseData.contactId || 'N/A'}\n`);
      
      if (responseData.webhookResults) {
        console.log('📨 WEBHOOK DELIVERY STATUS:');
        console.log(`   GHL: ${responseData.webhookResults.ghl?.success ? '✅ SUCCESS' : '❌ FAILED'}`);
        if (responseData.webhookResults.ghl?.status) {
          console.log(`        Status Code: ${responseData.webhookResults.ghl.status}`);
        }
        console.log(`   Zapier: ${responseData.webhookResults.zapier?.success ? '✅ SUCCESS' : '❌ FAILED'}`);
        if (responseData.webhookResults.zapier?.status) {
          console.log(`        Status Code: ${responseData.webhookResults.zapier.status}`);
        }
      }
      
      console.log('\n✅ ══════════════════════════════════════════════════════');
      console.log('✅ SMOKE TEST PASSED');
      console.log('✅ ══════════════════════════════════════════════════════\n');
      console.log('📋 Next Steps:');
      console.log('   1. Check GHL for test lead');
      console.log('   2. Check Zapier history for webhook');
      console.log('   3. Query Supabase analytics_events:');
      console.log(`      SELECT * FROM analytics_events WHERE session_id = '${testPayload.sessionId}';`);
      console.log('   4. Check lead in Supabase:');
      console.log(`      SELECT * FROM leads WHERE session_id = '${testPayload.sessionId}';\n`);
      
      process.exit(0);
    } else {
      console.log('❌ ERROR DETAILS:');
      console.log(JSON.stringify(responseData, null, 2));
      console.log('\n❌ ══════════════════════════════════════════════════════');
      console.log('❌ SMOKE TEST FAILED');
      console.log('❌ ══════════════════════════════════════════════════════\n');
      process.exit(1);
    }
    
  } catch (error) {
    console.log('❌ ══════════════════════════════════════════════════════');
    console.log('❌ SMOKE TEST FAILED - EXCEPTION');
    console.log('❌ ══════════════════════════════════════════════════════\n');
    console.error('💥 Error:', error.message);
    console.error('\nStack:', error.stack);
    process.exit(1);
  }
}

// Run the test
runSmokeTest();
