/**
 * Meta Cookie Capture Utilities
 * 
 * Client-side utilities for capturing Meta pixel cookies (fbp, fbc)
 * These cookies are critical for deduplication between pixel and CAPI events
 */

/**
 * Get Facebook Browser Pixel cookie (_fbp)
 * Format: fb.{version}.{timestamp}.{random}
 * Example: fb.1.1234567890.1234567890
 */
export function getFbpCookie(): string | null {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbp' && value) {
      return value;
    }
  }

  return null;
}

/**
 * Get Facebook Click ID cookie (_fbc)
 * Format: fb.{version}.{timestamp}.{click_id}
 * Example: fb.1.1234567890.1234567890
 */
export function getFbcCookie(): string | null {
  if (typeof window === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === '_fbc' && value) {
      return value;
    }
  }

  return null;
}

/**
 * Get Facebook Click ID from URL parameter (fbclid)
 * This is set when users click on Facebook ads
 * Should be converted to _fbc cookie format if needed
 */
export function getFbclidFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('fbclid');
}

/**
 * Get both fbp and fbc cookies/parameters
 * Returns object with fbp and fbc values
 */
export function getMetaCookies(): { fbp: string | null; fbc: string | null } {
  return {
    fbp: getFbpCookie(),
    fbc: getFbcCookie() || getFbclidFromUrl(), // Fallback to URL param
  };
}

/**
 * Convert fbclid URL parameter to _fbc cookie format
 * Meta's pixel automatically does this, but we can do it manually if needed
 * 
 * Format: fb.{version}.{timestamp}.{click_id}
 * Version is typically 1
 * Timestamp is Unix timestamp in seconds
 * Click ID is the fbclid value
 */
export function convertFbclidToFbc(fbclid: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  return `fb.1.${timestamp}.${fbclid}`;
}

/**
 * Check if Meta pixel is loaded and available
 */
export function isMetaPixelLoaded(): boolean {
  if (typeof window === 'undefined') return false;
  return typeof (window as any).fbq === 'function';
}

/**
 * Get Meta pixel ID from window object (if available)
 */
export function getMetaPixelId(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Meta pixel stores the pixel ID in window._fbq
  const fbq = (window as any).fbq;
  if (fbq && typeof fbq === 'function') {
    // Try to get pixel ID from fbq instance
    // This is implementation-dependent
    return null; // Pixel ID should come from env vars
  }

  return null;
}

