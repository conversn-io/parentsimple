/**
 * Shared A/B Test Middleware Utility
 * 
 * Reusable middleware function for split testing across multiple properties.
 * Each property can import and configure this middleware with property-specific settings.
 * 
 * Usage:
 * ```typescript
 * import { NextRequest, NextResponse } from 'next/server';
 * import { createSplitTestMiddleware } from '../../shared-utils/ab-test-middleware';
 * 
 * const sharedMiddleware = createSplitTestMiddleware({...});
 * export const middleware = async (request: NextRequest) => {
 *   const result = await sharedMiddleware(request);
 *   if (!result) return NextResponse.next();
 *   const response = NextResponse.redirect(new URL(result.url, request.url));
 *   if (result.setCookie) {
 *     response.cookies.set(result.setCookie.name, result.setCookie.value, {...});
 *   }
 *   return response;
 * };
 * ```
 * 
 * Note: This file avoids Next.js dependencies by returning plain objects.
 * Each property wraps the result with NextResponse in their middleware.ts.
 */

export interface SplitTestConfig {
  /** Entry path that triggers the split test (e.g., '/quiz', '/landing-page-test') */
  entryPath: string;
  
  /** Map of variant names to their target routes */
  variants: Record<string, string>;
  
  /** Cookie name for sticky assignment (e.g., 'ss_landing_page_variant') */
  cookieName: string;
  
  /** Site identifier for tracking (e.g., 'seniorsimple.org') */
  siteKey: string;
  
  /** Default variant if assignment fails (defaults to first variant) */
  defaultVariant?: string;
  
  /** Custom weights for variants (defaults to equal split) */
  weights?: Record<string, number>;
  
  /** Cookie TTL in days (default: 30) */
  cookieTtlDays?: number;
  
  /** Query parameter override name (default: 'variant') */
  queryParamName?: string;
  
  /** Whether to allow query parameter override (default: true) */
  allowQueryOverride?: boolean;
}

export interface MiddlewareResult {
  status: 307;
  url: string;
  variant: string;
  setCookie?: {
    name: string;
    value: string;
    ttlDays: number;
  };
  headers?: Record<string, string>;
}

/**
 * Create a middleware function for A/B testing
 * Returns a function that returns a plain object result (not NextResponse)
 * Each property should wrap this result with NextResponse in their middleware.ts
 */
export function createSplitTestMiddleware(config: SplitTestConfig) {
  const {
    entryPath,
    variants,
    cookieName,
    siteKey,
    defaultVariant = Object.keys(variants)[0],
    weights,
    cookieTtlDays = 30,
    queryParamName = 'variant',
    allowQueryOverride = true
  } = config;

  return async (request: any): Promise<MiddlewareResult | null> => {
    const { pathname, searchParams } = request.nextUrl;
    
    // Only handle entry path - return null to pass through
    if (pathname !== entryPath) {
      return null;
    }

    // Check query parameter override (for testing)
    if (allowQueryOverride) {
      const queryVariant = searchParams.get(queryParamName);
      if (queryVariant && variants[queryVariant]) {
        const redirectUrl = new URL(variants[queryVariant], request.url);
        return {
          status: 307,
          url: redirectUrl.toString(),
          variant: queryVariant,
          setCookie: { name: cookieName, value: queryVariant, ttlDays: cookieTtlDays },
          headers: {
            'X-AB-Test-Variant': queryVariant,
            'X-AB-Test-Site': siteKey
          }
        };
      }
    }

    // Check existing cookie for sticky assignment
    const existingVariant = request.cookies?.get?.(cookieName);
    if (existingVariant?.value && variants[existingVariant.value]) {
      const redirectUrl = new URL(variants[existingVariant.value], request.url);
      return {
        status: 307,
        url: redirectUrl.toString(),
        variant: existingVariant.value
      };
    }

    // Assign variant based on weights or equal split
    const assignedVariant = assignVariant(variants, weights, defaultVariant);
    const redirectUrl = new URL(variants[assignedVariant], request.url);
    
    return {
      status: 307,
      url: redirectUrl.toString(),
      variant: assignedVariant,
      setCookie: { name: cookieName, value: assignedVariant, ttlDays: cookieTtlDays },
      headers: {
        'X-AB-Test-Variant': assignedVariant,
        'X-AB-Test-Site': siteKey
      }
    };
  };
}

/**
 * Assign variant based on weights or equal split
 */
function assignVariant(
  variants: Record<string, string>,
  weights?: Record<string, number>,
  defaultVariant?: string
): string {
  // If weights provided, use weighted random assignment
  if (weights) {
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (totalWeight === 0) {
      return defaultVariant || Object.keys(variants)[0];
    }

    const random = Math.random() * totalWeight;
    let cumulative = 0;

    for (const [variant, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (random < cumulative && variants[variant]) {
        return variant;
      }
    }
  }

  // Default to equal split
  const variantKeys = Object.keys(variants);
  const random = Math.random();
  const index = Math.floor(random * variantKeys.length);
  
  return variantKeys[index] || defaultVariant || variantKeys[0];
}

/**
 * Get variant from request cookies (helper function for client-side)
 */
export function getVariantFromRequest(request: any, cookieName: string): string | null {
  const cookie = request.cookies?.get?.(cookieName);
  return cookie?.value || null;
}
