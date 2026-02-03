import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    SUPABASE_QUIZ_URL: process.env.SUPABASE_QUIZ_URL || 'NOT SET',
    SUPABASE_QUIZ_ANON_KEY: process.env.SUPABASE_QUIZ_ANON_KEY ? 'SET' : 'NOT SET',
    SUPABASE_QUIZ_SERVICE_ROLE_KEY: process.env.SUPABASE_QUIZ_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };

  return NextResponse.json({
    message: 'OTP Environment Variables Debug',
    environment: envVars,
    timestamp: new Date().toISOString()
  });
}
