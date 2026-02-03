import { NextResponse } from 'next/server';

// CORS headers for API routes
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Helper function to create CORS-enabled responses
export const createCorsResponse = (data: any, status: number = 200) => {
  return NextResponse.json(data, { 
    status,
    headers: corsHeaders 
  });
};

// Handle preflight OPTIONS requests
export const handleCorsOptions = () => {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders
  });
};




