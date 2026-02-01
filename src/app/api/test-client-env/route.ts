import { NextResponse } from 'next/server';

export async function GET() {
  // Check what environment variables are available
  const envVars = {
    // Server-side variables
    SUPABASE_QUIZ_URL: process.env.SUPABASE_QUIZ_URL || 'NOT SET',
    SUPABASE_QUIZ_ANON_KEY: process.env.SUPABASE_QUIZ_ANON_KEY ? 'SET' : 'NOT SET',
    
    // Client-side variables (these should be available in browser)
    NEXT_PUBLIC_SUPABASE_QUIZ_URL: process.env.NEXT_PUBLIC_SUPABASE_QUIZ_URL || 'NOT SET',
    NEXT_PUBLIC_SUPABASE_QUIZ_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_QUIZ_ANON_KEY ? 'SET' : 'NOT SET',
    
    // All NEXT_PUBLIC variables
    allNextPublic: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')),
    
    // Environment info
    NODE_ENV: process.env.NODE_ENV,
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };

  return NextResponse.json({
    message: 'Client Environment Variables Debug',
    environment: envVars,
    timestamp: new Date().toISOString()
  });
}




