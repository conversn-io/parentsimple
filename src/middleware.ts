/**
 * ParentSimple A/B Test Middleware
 *
 * Handles traffic splitting for landing page variants:
 * - /quiz/elite-university-readiness → control or variant_b
 * - /quiz/life-insurance-us → control or variant_b
 *
 * Uses shared middleware utility from @/lib/ab-test-middleware.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSplitTestMiddleware } from '@/lib/ab-test-middleware';

const splitTests = [
  createSplitTestMiddleware({
    entryPath: '/quiz/elite-university-readiness',
    variants: {
      control: '/quiz/elite-university-readiness',
      variant_b: '/quiz/elite-university-readiness-b'
    },
    cookieName: 'ps_landing_page_variant',
    siteKey: 'parentsimple.org',
    defaultVariant: 'control',
    weights: { control: 0.5, variant_b: 0.5 },
    cookieTtlDays: 30,
    queryParamName: 'variant',
    allowQueryOverride: true
  }),
  createSplitTestMiddleware({
    entryPath: '/quiz/life-insurance-us',
    variants: {
      control: '/quiz/life-insurance-us',
      variant_b: '/quiz/life-insurance-us-b'
    },
    cookieName: 'ps_life_variant',
    siteKey: 'parentsimple.org',
    defaultVariant: 'control',
    weights: { control: 0.5, variant_b: 0.5 },
    cookieTtlDays: 30,
    queryParamName: 'variant',
    allowQueryOverride: true
  })
];

export const middleware = async (request: NextRequest) => {
  for (const test of splitTests) {
    const result = await test(request);
    if (!result) continue;

    if (result.status === 307 && result.url) {
      const response = NextResponse.redirect(new URL(result.url, request.url));

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

      if (result.headers) {
        Object.entries(result.headers).forEach(([key, value]) => {
          response.headers.set(key, value as string);
        });
      }

      return response;
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    '/quiz/elite-university-readiness',
    '/quiz/life-insurance-us'
  ]
};
