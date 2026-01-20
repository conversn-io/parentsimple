/**
 * ParentSimple A/B Test Middleware
 * 
 * Handles traffic splitting for landing page variants:
 * - /quiz/elite-university-readiness → splits to control or variant_b
 * 
 * Uses shared middleware utility from shared-utils/ab-test-middleware.ts
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSplitTestMiddleware } from '../../../shared-utils/ab-test-middleware';

// Create middleware with ParentSimple-specific configuration
const sharedMiddleware = createSplitTestMiddleware({
  entryPath: '/quiz/elite-university-readiness',
  variants: {
    control: '/quiz/elite-university-readiness',
    variant_b: '/quiz/elite-university-readiness-b'
  },
  cookieName: 'ps_landing_page_variant',
  siteKey: 'parentsimple.org',
  defaultVariant: 'control',
  weights: {
    control: 0.5,
    variant_b: 0.5
  },
  cookieTtlDays: 30,
  queryParamName: 'variant',
  allowQueryOverride: true
});

// Export middleware with proper Next.js types
export const middleware = async (request: NextRequest) => {
  const result = await sharedMiddleware(request);
  
  // If no result, pass through
  if (!result) {
    return NextResponse.next();
  }
  
  // Create redirect response
  if (result.status === 307 && result.url) {
    const response = NextResponse.redirect(new URL(result.url, request.url));
    
    // Set cookie if specified
    if (result.setCookie) {
      const expires = new Date();
      expires.setTime(expires.getTime() + result.setCookie.ttlDays * 24 * 60 * 60 * 1000);
      response.cookies.set(result.setCookie.name, result.setCookie.value, {
        expires,
        path: '/',
        sameSite: 'lax',
        httpOnly: false
      });
    }
    
    // Set custom headers
    if (result.headers) {
      Object.entries(result.headers).forEach(([key, value]) => {
        response.headers.set(key, value as string);
      });
    }
    
    return response;
  }
  
  return NextResponse.next();
};

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    '/quiz/elite-university-readiness',
    // Add other entry paths if needed
  ]
};

