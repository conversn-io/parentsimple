import { NextRequest, NextResponse } from 'next/server';
import { callreadyQuizDb } from '@/lib/callready-quiz-db';
import { createCorsResponse, handleCorsOptions } from '@/lib/cors-headers';

export async function OPTIONS() {
  return handleCorsOptions();
}

export async function POST(request: NextRequest) {
  console.log('📤 Send OTP API Called:', {
    timestamp: new Date().toISOString(),
    url: request.url
  });

  try {
    // Debug environment variables
    console.log('🔍 Environment Variables Debug:', {
      SUPABASE_QUIZ_URL: process.env.SUPABASE_QUIZ_URL ? 'SET' : 'NOT SET',
      SUPABASE_QUIZ_ANON_KEY: process.env.SUPABASE_QUIZ_ANON_KEY ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      timestamp: new Date().toISOString()
    });

    // Test database connection
    console.log('🔍 Testing CallReady Quiz Database Connection...');
    const { data: testData, error: testError } = await callreadyQuizDb
      .from('otp_verifications')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Database Connection Test Failed:', {
        error: testError,
        errorMessage: testError.message,
        errorCode: testError.code,
        errorDetails: testError.details,
        errorHint: testError.hint,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('✅ Database Connection Test Successful:', {
        testData,
        timestamp: new Date().toISOString()
      });
    }
    const body = await request.json();
    const { phoneNumber } = body;

    console.log('📱 Send OTP Request:', {
      phoneNumber,
      timestamp: new Date().toISOString()
    });

    // Validate input
    if (!phoneNumber) {
      console.error('❌ Send OTP - Missing Phone Number:', {
        phoneNumber: !!phoneNumber,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone number format (should be +1XXXXXXXXXX)
    const phoneRegex = /^\+1\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      console.error('❌ Send OTP - Invalid Phone Number Format:', {
        phoneNumber,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json(
        { error: 'Invalid phone number format. Please use a valid US phone number.' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔐 Generated OTP:', { otp: '***' + otp.slice(-2) }); // Log partial OTP for debugging

    // Store OTP in Supabase database with expiration
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    
    console.log('🔍 Attempting to store OTP in database:', {
      phoneNumber,
      expiresAt: expiresAt.toISOString(),
      timestamp: new Date().toISOString()
    });

    const { data, error: dbError } = await callreadyQuizDb
      .from('otp_verifications')
      .upsert({
        phone_number: phoneNumber,
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
        attempts: 0,
        created_at: new Date().toISOString()
      })
      .select();

    if (dbError) {
      console.error('❌ OTP Send - Database Error:', {
        error: dbError,
        errorMessage: dbError.message,
        errorCode: dbError.code,
        errorDetails: dbError.details,
        errorHint: dbError.hint,
        phoneNumber,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json(
        { error: 'Failed to store verification code', details: dbError.message },
        { status: 500 }
      );
    }

    console.log('✅ OTP Database Insert Result:', {
      data,
      phoneNumber,
      timestamp: new Date().toISOString()
    });

    console.log('✅ OTP Stored in Supabase Database:', {
      phoneNumber,
      expiresAt: expiresAt.toISOString(),
      timestamp: new Date().toISOString()
    });

    // TODO: Implement actual SMS sending via Twilio or other SMS provider
    // For now, we'll log that SMS would be sent
    console.log('📱 SMS would be sent via SMS provider:', { 
      to: phoneNumber, 
      message: `Your SeniorSimple verification code is: ${otp}. This code expires in 10 minutes.` 
    });

    // In development, log the OTP to console for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 DEVELOPMENT OTP (for testing):', otp);
    }

    return NextResponse.json({
      sent: true,
      message: 'OTP sent successfully',
      // In development, include OTP for testing
      ...(process.env.NODE_ENV === 'development' && { developmentOTP: otp })
    });

  } catch (error) {
    console.error('💥 Send OTP API Error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

