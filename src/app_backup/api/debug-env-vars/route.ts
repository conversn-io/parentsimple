import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    // Supabase Quiz Database
    SUPABASE_QUIZ_URL: process.env.SUPABASE_QUIZ_URL || 'NOT SET',
    SUPABASE_QUIZ_ANON_KEY: process.env.SUPABASE_QUIZ_ANON_KEY ? 'SET' : 'NOT SET',
    SUPABASE_QUIZ_SERVICE_ROLE_KEY: process.env.SUPABASE_QUIZ_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
    
    // Supabase CMS Database
    SUPABASE_URL: process.env.SUPABASE_URL || 'NOT SET',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
    
    // GHL Webhook
    annuity_GHL_webhook: process.env.annuity_GHL_webhook ? 'SET' : 'NOT SET',
    
    // All environment variables that start with SUPABASE
    allSupabaseVars: Object.keys(process.env).filter(key => key.startsWith('SUPABASE')),
    
    // Node environment
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };

  return NextResponse.json({
    message: 'Environment Variables Debug',
    environment: envVars,
    timestamp: new Date().toISOString()
  });
}



