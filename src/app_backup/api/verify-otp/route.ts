import { NextRequest, NextResponse } from 'next/server';
import { callreadyQuizDb } from '@/lib/callready-quiz-db';
import { createCorsResponse, handleCorsOptions } from '@/lib/cors-headers';

export async function OPTIONS() {
  return handleCorsOptions();
}

export async function POST(request: NextRequest) {
  console.log('🔐 OTP Verification API Called:', {
    timestamp: new Date().toISOString(),
    url: request.url
  });

  try {
    const body = await request.json();
    const { phoneNumber, otp } = body;

    console.log('📱 OTP Verification Request:', {
      phoneNumber,
      otpLength: otp?.length,
      timestamp: new Date().toISOString()
    });

    // Validate input
    if (!phoneNumber || !otp) {
      console.error('❌ OTP Verification - Missing Parameters:', {
        phoneNumber: !!phoneNumber,
        otp: !!otp,
        timestamp: new Date().toISOString()
      });
      return createCorsResponse(
        { error: 'Phone number and OTP are required' },
        400
      );
    }

    // Validate phone number format (must include country code)
    const phoneRegex = /^\+1\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      console.error('❌ OTP Verification - Invalid Phone Format:', {
        phoneNumber,
        timestamp: new Date().toISOString()
      });
      return createCorsResponse(
        { error: 'Invalid phone number format. Must include country code (+1XXXXXXXXXX)' },
        400
      );
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      console.error('❌ OTP Verification - Invalid OTP Format:', {
        otpLength: otp?.length,
        timestamp: new Date().toISOString()
      });
      return createCorsResponse(
        { error: 'Invalid OTP format. Must be 6 digits.' },
        400
      );
    }

    console.log('🔍 Looking up OTP record in database...');

    // Fetch OTP record from database
    const { data: otpRecord, error: fetchError } = await callreadyQuizDb
      .from('otp_verifications')
      .select('*')
      .eq('phone_number', phoneNumber)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError) {
      console.error('❌ OTP Database Fetch Error:', {
        phoneNumber,
        error: fetchError,
        timestamp: new Date().toISOString()
      });
      return createCorsResponse(
        { error: 'Failed to verify OTP. Please try again.' },
        500
      );
    }

    if (!otpRecord) {
      console.error('❌ OTP Record Not Found:', {
        phoneNumber,
        timestamp: new Date().toISOString()
      });
      return createCorsResponse(
        { error: 'No verification code found for this phone number.' },
        404
      );
    }

    console.log('📋 OTP Record Found:', {
      phoneNumber,
      expiresAt: otpRecord.expires_at,
      attempts: otpRecord.attempts,
      timestamp: new Date().toISOString()
    });

    // Check if OTP has expired
    const now = new Date();
    const expiresAt = new Date(otpRecord.expires_at);
    
    if (now > expiresAt) {
      console.error('❌ OTP Expired:', {
        phoneNumber,
        expiresAt: otpRecord.expires_at,
        currentTime: now.toISOString(),
        timestamp: new Date().toISOString()
      });
      return createCorsResponse(
        { error: 'Verification code has expired. Please request a new one.' },
        400
      );
    }

    // Check if too many attempts
    if (otpRecord.attempts >= 3) {
      console.error('❌ Too Many OTP Attempts:', {
        phoneNumber,
        attempts: otpRecord.attempts,
        timestamp: new Date().toISOString()
      });
      return createCorsResponse(
        { error: 'Too many failed attempts. Please request a new verification code.' },
        400
      );
    }

    // Verify OTP code
    if (otpRecord.otp_code !== otp) {
      console.error('❌ OTP Code Mismatch:', {
        phoneNumber,
        providedOTP: otp,
        expectedOTP: otpRecord.otp_code,
        timestamp: new Date().toISOString()
      });

      // Increment attempts counter
      await callreadyQuizDb
        .from('otp_verifications')
        .update({ 
          attempts: otpRecord.attempts + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', otpRecord.id);

      return createCorsResponse(
        { error: 'Invalid verification code. Please try again.' },
        400
      );
    }

    console.log('✅ OTP Verification Successful:', {
      phoneNumber,
      timestamp: new Date().toISOString()
    });

    // OTP is valid - return success
    return createCorsResponse({
      verified: true,
      phoneNumber,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('💥 OTP Verification Exception:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return createCorsResponse(
      { error: 'Internal server error' },
      500
    );
  }
}