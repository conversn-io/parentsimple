/**
 * Meta Conversions API (CAPI) Service
 * 
 * Gold-standard implementation for sending server-side events to Meta.
 * Features:
 * - SHA256 hashing for PII (email, phone, names)
 * - fbp/fbc cookie handling for deduplication
 * - Event ID generation for pixel/CAPI deduplication
 * - Retry logic with exponential backoff
 * - Comprehensive error handling and logging
 * 
 * @see https://developers.facebook.com/docs/marketing-api/conversions-api
 */

import crypto from 'crypto';

// ============================================================================
// Configuration
// ============================================================================

// Funnel-specific pixel IDs
// Canonical names per .env.example: META_PIXEL_ID_LIFE_INSURANCE / META_PIXEL_ID_COLLEGE.
// Legacy META_PIXEL_ID_INSURANCE kept for backward compatibility during transition.
const META_PIXEL_ID_LIFE_INSURANCE =
  process.env.META_PIXEL_ID_LIFE_INSURANCE || process.env.META_PIXEL_ID_INSURANCE;
const META_PIXEL_ID_COLLEGE = process.env.META_PIXEL_ID_COLLEGE;
const META_PIXEL_ID = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID; // Fallback

// Funnel-specific access tokens. Each pixel has its own system-user token in Meta —
// pairing a pixel ID with the wrong token returns 190/Invalid OAuth.
const META_CAPI_TOKEN_LIFE_INSURANCE = process.env.META_CAPI_TOKEN_LIFE_INSURANCE;
const META_CAPI_TOKEN_COLLEGE = process.env.META_CAPI_TOKEN_COLLEGE;
const META_CAPI_TOKEN = process.env.META_CAPI_TOKEN || process.env.META_CAPI_ACCESS_TOKEN;
const META_CAPI_VERSION = process.env.META_CAPI_VERSION || 'v21.0';
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE; // Optional, for testing

/**
 * Get the correct pixel ID based on funnel type
 */
export function getPixelIdForFunnel(funnelType?: string | null): string | undefined {
  if (!funnelType) return META_PIXEL_ID;

  const normalized = funnelType.toLowerCase();
  if (normalized.includes('insurance') || normalized.includes('life')) {
    return META_PIXEL_ID_LIFE_INSURANCE || META_PIXEL_ID;
  }
  if (normalized.includes('college') || normalized.includes('consulting')) {
    return META_PIXEL_ID_COLLEGE || META_PIXEL_ID;
  }
  return META_PIXEL_ID;
}

/**
 * Get the correct CAPI access token based on funnel type.
 * Token must travel with its paired pixel — Meta rejects mismatches.
 */
export function getTokenForFunnel(funnelType?: string | null): string | undefined {
  if (!funnelType) return META_CAPI_TOKEN;

  const normalized = funnelType.toLowerCase();
  if (normalized.includes('insurance') || normalized.includes('life')) {
    return META_CAPI_TOKEN_LIFE_INSURANCE || META_CAPI_TOKEN;
  }
  if (normalized.includes('college') || normalized.includes('consulting')) {
    return META_CAPI_TOKEN_COLLEGE || META_CAPI_TOKEN;
  }
  return META_CAPI_TOKEN;
}

// ============================================================================
// Types & Interfaces
// ============================================================================

export type ActionSource = 'website' | 'app' | 'phone_call' | 'chat' | 'email' | 'other' | 'business_management';

export interface MetaUserData {
  em?: string[]; // SHA256 hashed email(s)
  ph?: string[]; // SHA256 hashed phone number(s)
  fn?: string[]; // SHA256 hashed first name(s)
  ln?: string[]; // SHA256 hashed last name(s)
  fbp?: string;  // Facebook browser pixel cookie (_fbp)
  fbc?: string;  // Facebook click ID (_fbc or fbclid)
  fb_login_id?: string; // Facebook Login ID (do NOT hash)
  client_ip_address?: string;
  client_user_agent?: string;
  external_id?: string[]; // External ID (hashed)
  ge?: string;   // Gender (m/f)
  db?: string;   // Date of birth (YYYYMMDD)
  ct?: string;   // City
  st?: string;   // State (2-letter code)
  zp?: string;   // Zip/postal code
  country?: string; // Country code (2-letter)
}

export interface MetaCustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  contents?: Array<{
    id?: string;
    quantity?: number;
    item_price?: number;
  }>;
  num_items?: number;
  order_id?: string;
  search_string?: string;
  status?: string;
  [key: string]: any; // Allow custom fields
}

export interface MetaCAPIEvent {
  event_name: string;
  event_time: number; // Unix timestamp in seconds
  event_id: string; // For deduplication with pixel
  action_source: ActionSource;
  user_data: MetaUserData;
  custom_data?: MetaCustomData;
  event_source_url?: string;
  opt_out?: boolean;
}

export interface SendCAPIOptions {
  pixelId?: string; // Override default pixel ID
  accessToken?: string; // Override default access token
  testEventCode?: string; // Override test event code
  retries?: number; // Number of retry attempts (default: 3)
}

export interface SendCAPIResult {
  success: boolean;
  eventId: string;
  error?: string;
  response?: any;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Hash PII data for Meta CAPI using SHA256
 * Meta requires lowercase, trimmed values before hashing
 */
export function hashForMeta(value: string | null | undefined): string | null {
  if (!value) return null;
  
  const normalized = value.toLowerCase().trim();
  if (!normalized) return null;
  
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Normalize phone number for hashing
 * Removes all non-digit characters
 */
export function normalizePhoneForHashing(phone: string | null | undefined): string | null {
  if (!phone) return null;
  
  const digits = phone.replace(/\D/g, '');
  return digits || null;
}

/**
 * Generate deterministic event ID for deduplication
 * Format: {leadId}-{eventType}-{timestamp}
 * 
 * This event_id should match between pixel and CAPI for deduplication
 */
export function generateEventId(
  leadId: string,
  eventType: string,
  timestamp?: number
): string {
  const ts = timestamp || Math.floor(Date.now() / 1000);
  return `${leadId}-${eventType}-${ts}`;
}

/**
 * Build user_data object for Meta CAPI
 * Handles hashing of PII and includes cookies/attribution data
 */
export function buildUserData(input: {
  email?: string | null;
  phone?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  fbp?: string | null; // Facebook browser pixel cookie
  fbc?: string | null; // Facebook click ID
  fb_login_id?: string | null; // Facebook Login ID (do NOT hash)
  ip_address?: string | null;
  user_agent?: string | null;
  external_id?: string | null;
  gender?: string | null;
  date_of_birth?: string | null; // YYYYMMDD format
  city?: string | null;
  state?: string | null; // 2-letter code
  zip_code?: string | null;
  country?: string | null; // 2-letter code
}): MetaUserData {
  const userData: MetaUserData = {};

  // Hash email
  if (input.email) {
    const hashedEmail = hashForMeta(input.email);
    if (hashedEmail) {
      userData.em = [hashedEmail];
    }
  }

  // Hash phone (normalize first)
  if (input.phone) {
    const normalizedPhone = normalizePhoneForHashing(input.phone);
    if (normalizedPhone) {
      const hashedPhone = hashForMeta(normalizedPhone);
      if (hashedPhone) {
        userData.ph = [hashedPhone];
      }
    }
  }

  // Hash first name
  if (input.first_name) {
    const hashedFn = hashForMeta(input.first_name);
    if (hashedFn) {
      userData.fn = [hashedFn];
    }
  }

  // Hash last name
  if (input.last_name) {
    const hashedLn = hashForMeta(input.last_name);
    if (hashedLn) {
      userData.ln = [hashedLn];
    }
  }

  // Facebook cookies (critical for deduplication)
  if (input.fbp) {
    userData.fbp = input.fbp;
  }
  if (input.fbc) {
    userData.fbc = input.fbc;
  }
  
  // Facebook Login ID (do NOT hash - pass as-is)
  if (input.fb_login_id) {
    userData.fb_login_id = input.fb_login_id;
  }

  // IP address and user agent (helpful for matching)
  if (input.ip_address) {
    userData.client_ip_address = input.ip_address;
  }
  if (input.user_agent) {
    userData.client_user_agent = input.user_agent;
  }

  // External ID (if provided, hash it)
  if (input.external_id) {
    const hashedExternalId = hashForMeta(input.external_id);
    if (hashedExternalId) {
      userData.external_id = [hashedExternalId];
    }
  }

  // Demographic data (optional)
  if (input.gender) {
    userData.ge = input.gender.toLowerCase().substring(0, 1); // 'm' or 'f'
  }
  if (input.date_of_birth) {
    userData.db = input.date_of_birth; // YYYYMMDD format
  }
  // Geo fields are PII per Meta — hash like email/phone (lowercase, trim, then SHA256).
  if (input.city) {
    const hashedCity = hashForMeta(input.city);
    if (hashedCity) userData.ct = hashedCity;
  }
  if (input.state) {
    const hashedState = hashForMeta(input.state.substring(0, 2));
    if (hashedState) userData.st = hashedState;
  }
  if (input.zip_code) {
    const hashedZip = hashForMeta(input.zip_code.substring(0, 10));
    if (hashedZip) userData.zp = hashedZip;
  }
  // Country: hash like other PII. Default to 'us' so the signal is always present.
  // Meta expects 2-letter ISO code, lowercased + trimmed before hashing.
  const countryRaw = (input.country || 'us').toLowerCase().trim().substring(0, 2);
  const hashedCountry = hashForMeta(countryRaw);
  if (hashedCountry) {
    userData.country = hashedCountry;
  }

  return userData;
}

// ============================================================================
// Core CAPI Functions
// ============================================================================

/**
 * Send a single event to Meta Conversions API
 * 
 * @param event - The CAPI event to send
 * @param options - Optional overrides for pixel ID, token, etc.
 * @returns Result object with success status and event ID
 */
export async function sendMetaCAPIEvent(
  event: MetaCAPIEvent,
  options: SendCAPIOptions = {}
): Promise<SendCAPIResult> {
  const pixelId = options.pixelId || META_PIXEL_ID;
  const accessToken = options.accessToken || META_CAPI_TOKEN;
  const testEventCode = options.testEventCode || META_TEST_EVENT_CODE;
  const maxRetries = options.retries ?? 3;

  // Fail-open: if pixel/token are missing, log a warning and skip rather than throw.
  if (!pixelId || !accessToken) {
    const error = 'Meta CAPI not configured: Missing pixel ID or access token';
    console.warn(`📡 [CAPI] SKIPPED ${event.event_name} | id:${event.event_id.slice(-8)} | ${error}`);
    return {
      success: false,
      eventId: event.event_id,
      error,
    };
  }

  const endpoint = `https://graph.facebook.com/${META_CAPI_VERSION}/${pixelId}/events`;
  const payload: any = {
    data: [event],
  };

  // Add test event code if provided (for testing in Events Manager)
  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  // Retry logic with exponential backoff
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${endpoint}?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let responseData: any;

      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      if (response.ok) {
        console.log(
          `📡 [CAPI] ✅ ${event.event_name} | id:${event.event_id.slice(-8)} | pixel:${pixelId}`
        );
        return {
          success: true,
          eventId: event.event_id,
          response: responseData,
        };
      } else {
        // API error
        const errorMessage = responseData?.error?.message || responseText || 'Unknown error';
        lastError = new Error(`Meta CAPI error (${response.status}): ${errorMessage}`);
        console.error(
          `📡 [CAPI] ❌ ${event.event_name} | status:${response.status} | id:${event.event_id.slice(-8)} | ${errorMessage}`
        );

        // Don't retry on certain errors (authentication, invalid data)
        if (response.status === 401 || response.status === 400) {
          console.error(`[Meta CAPI] Non-retryable error:`, lastError.message);
          return {
            success: false,
            eventId: event.event_id,
            error: lastError.message,
            response: responseData,
          };
        }

        // Retry on server errors (5xx) or rate limits (429)
        if (attempt < maxRetries && (response.status >= 500 || response.status === 429)) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
          console.warn(
            `[Meta CAPI] Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms:`,
            lastError.message
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        // Max retries reached or non-retryable error
        console.error(`[Meta CAPI] Failed after ${attempt + 1} attempts:`, lastError.message);
        return {
          success: false,
          eventId: event.event_id,
          error: lastError.message,
          response: responseData,
        };
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Retry on network errors
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(
          `[Meta CAPI] Network error, retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms:`,
          lastError.message
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Max retries reached
      console.error(`[Meta CAPI] Network error after ${attempt + 1} attempts:`, lastError.message);
      return {
        success: false,
        eventId: event.event_id,
        error: lastError.message,
      };
    }
  }

  // Should never reach here, but TypeScript needs it
  return {
    success: false,
    eventId: event.event_id,
    error: lastError?.message || 'Unknown error',
  };
}

/**
 * Send multiple events in a single batch request
 * More efficient than sending events individually
 */
export async function sendMetaCAPIBatch(
  events: MetaCAPIEvent[],
  options: SendCAPIOptions = {}
): Promise<SendCAPIResult[]> {
  if (events.length === 0) {
    return [];
  }

  const pixelId = options.pixelId || META_PIXEL_ID;
  const accessToken = options.accessToken || META_CAPI_TOKEN;
  const testEventCode = options.testEventCode || META_TEST_EVENT_CODE;

  if (!pixelId || !accessToken) {
    const error = 'Meta CAPI not configured';
    console.warn(`[Meta CAPI] ${error}`);
    return events.map((event) => ({
      success: false,
      eventId: event.event_id,
      error,
    }));
  }

  const endpoint = `https://graph.facebook.com/${META_CAPI_VERSION}/${pixelId}/events`;
  const payload: any = {
    data: events,
  };

  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  try {
    const response = await fetch(`${endpoint}?access_token=${accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (response.ok) {
      // Meta returns events_received array
      const eventsReceived = responseData.events_received || events.length;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Meta CAPI] Batch sent successfully:`, {
          eventsSent: events.length,
          eventsReceived,
          response: responseData,
        });
      }

      return events.map((event, index) => ({
        success: index < eventsReceived,
        eventId: event.event_id,
        response: responseData,
      }));
    } else {
      const errorMessage = responseData?.error?.message || 'Unknown error';
      console.error(`[Meta CAPI] Batch failed:`, errorMessage);
      
      return events.map((event) => ({
        success: false,
        eventId: event.event_id,
        error: errorMessage,
        response: responseData,
      }));
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[Meta CAPI] Batch network error:`, errorMessage);
    
    return events.map((event) => ({
      success: false,
      eventId: event.event_id,
      error: errorMessage,
    }));
  }
}

// ============================================================================
// Helper Functions for Common Event Types
// ============================================================================

/**
 * Create a standard Lead event
 */
export function createLeadEvent(params: {
  leadId: string;
  userData: MetaUserData;
  customData?: MetaCustomData;
  eventTime?: number;
  eventId?: string;
  eventSourceUrl?: string;
}): MetaCAPIEvent {
  const eventTime = params.eventTime || Math.floor(Date.now() / 1000);
  const eventId = params.eventId || generateEventId(params.leadId, 'Lead', eventTime);

  return {
    event_name: 'Lead',
    event_time: eventTime,
    event_id: eventId,
    action_source: 'website',
    user_data: params.userData,
    custom_data: params.customData,
    event_source_url: params.eventSourceUrl,
  };
}

/**
 * Create a standard PageView event
 */
export function createPageViewEvent(params: {
  pageId: string;
  userData: MetaUserData;
  customData?: MetaCustomData;
  eventTime?: number;
  eventId?: string;
  eventSourceUrl?: string;
}): MetaCAPIEvent {
  const eventTime = params.eventTime || Math.floor(Date.now() / 1000);
  const eventId = params.eventId || generateEventId(params.pageId, 'PageView', eventTime);

  return {
    event_name: 'PageView',
    event_time: eventTime,
    event_id: eventId,
    action_source: 'website',
    user_data: params.userData,
    custom_data: params.customData,
    event_source_url: params.eventSourceUrl,
  };
}

/**
 * Create a CompleteRegistration event (e.g., phone verification)
 */
export function createCompleteRegistrationEvent(params: {
  leadId: string;
  userData: MetaUserData;
  customData?: MetaCustomData;
  eventTime?: number;
  eventSourceUrl?: string;
}): MetaCAPIEvent {
  const eventTime = params.eventTime || Math.floor(Date.now() / 1000);
  const eventId = generateEventId(params.leadId, 'CompleteRegistration', eventTime);

  return {
    event_name: 'CompleteRegistration',
    event_time: eventTime,
    event_id: eventId,
    action_source: 'website',
    user_data: params.userData,
    custom_data: params.customData,
    event_source_url: params.eventSourceUrl,
  };
}

/**
 * Create a custom event (e.g., HighQualityLead, QualifiedLead)
 */
export function createCustomEvent(params: {
  eventName: string;
  leadId: string;
  userData: MetaUserData;
  customData?: MetaCustomData;
  actionSource?: ActionSource;
  eventTime?: number;
  eventSourceUrl?: string;
}): MetaCAPIEvent {
  const eventTime = params.eventTime || Math.floor(Date.now() / 1000);
  const eventId = generateEventId(params.leadId, params.eventName, eventTime);

  return {
    event_name: params.eventName,
    event_time: eventTime,
    event_id: eventId,
    action_source: params.actionSource || 'website',
    user_data: params.userData,
    custom_data: params.customData,
    event_source_url: params.eventSourceUrl,
  };
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Send a Lead event with automatic user data building
 * Most common use case - simplifies the API
 * 
 * @param params.funnelType - Optional funnel type to select the correct pixel ID (e.g., 'life_insurance_ca', 'college_consulting')
 */
export async function sendLeadEvent(params: {
  leadId: string;
  eventId?: string;
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  fbLoginId?: string | null; // Facebook Login ID (do NOT hash)
  ipAddress?: string | null;
  userAgent?: string | null;
  // EMQ signal fields — forwarded into user_data, hashed where required.
  externalId?: string | null;  // session_id, hashed
  city?: string | null;        // hashed
  state?: string | null;       // hashed
  zipCode?: string | null;     // hashed
  country?: string | null;     // hashed; defaults to 'us' if not provided
  value?: number;
  currency?: string;
  customData?: MetaCustomData;
  eventSourceUrl?: string;
  funnelType?: string | null; // Determines which pixel + token to use
  options?: SendCAPIOptions;
}): Promise<SendCAPIResult> {
  const userData = buildUserData({
    email: params.email,
    phone: params.phone,
    first_name: params.firstName,
    last_name: params.lastName,
    fbp: params.fbp,
    fbc: params.fbc,
    fb_login_id: params.fbLoginId,
    ip_address: params.ipAddress,
    user_agent: params.userAgent,
    external_id: params.externalId,
    city: params.city,
    state: params.state,
    zip_code: params.zipCode,
    country: params.country,
  });

  const customData: MetaCustomData = {
    value: params.value,
    currency: params.currency || 'USD',
    ...params.customData,
  };

  const event = createLeadEvent({
    leadId: params.leadId,
    userData,
    customData,
    eventId: params.eventId,
    eventSourceUrl: params.eventSourceUrl,
  });

  // Pixel + token must come from the same funnel — Meta rejects mismatched pairs.
  const finalOptions: SendCAPIOptions = {
    ...params.options,
    pixelId: params.options?.pixelId || getPixelIdForFunnel(params.funnelType),
    accessToken: params.options?.accessToken || getTokenForFunnel(params.funnelType),
  };

  return sendMetaCAPIEvent(event, finalOptions);
}

/**
 * Send a PageView event with automatic user data building
 */
export async function sendPageViewEvent(params: {
  pageId: string;
  eventId?: string;
  fbp?: string | null;
  fbc?: string | null;
  fbLoginId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  externalId?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string | null;
  customData?: MetaCustomData;
  eventSourceUrl?: string;
  funnelType?: string | null;
  options?: SendCAPIOptions;
}): Promise<SendCAPIResult> {
  const userData = buildUserData({
    fbp: params.fbp,
    fbc: params.fbc,
    fb_login_id: params.fbLoginId,
    ip_address: params.ipAddress,
    user_agent: params.userAgent,
    external_id: params.externalId,
    city: params.city,
    state: params.state,
    zip_code: params.zipCode,
    country: params.country,
  });

  const event = createPageViewEvent({
    pageId: params.pageId,
    userData,
    customData: params.customData,
    eventId: params.eventId,
    eventSourceUrl: params.eventSourceUrl,
  });

  const finalOptions: SendCAPIOptions = {
    ...params.options,
    pixelId: params.options?.pixelId || getPixelIdForFunnel(params.funnelType),
    accessToken: params.options?.accessToken || getTokenForFunnel(params.funnelType),
  };

  return sendMetaCAPIEvent(event, finalOptions);
}

/**
 * Check if Meta CAPI is configured for a specific funnel
 * 
 * @param funnelType - Optional funnel type to check specific pixel configuration
 * @returns true if pixel ID and token are configured
 */
export function isMetaCAPIConfigured(funnelType?: string | null): boolean {
  return !!(getPixelIdForFunnel(funnelType) && getTokenForFunnel(funnelType));
}
