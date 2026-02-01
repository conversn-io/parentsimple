# ParentSimple Webhook & Tracking Implementation Guide

**Date:** February 1, 2026  
**Project:** ParentSimple Lead Delivery & Analytics  
**Status:** Ready for Implementation

---

## 🎯 Objective

Implement unified webhook delivery and comprehensive event tracking for ParentSimple following RateRoots/SeniorSimple proven architecture.

### Key Requirements

1. **Unified Webhook Delivery** - Send verified leads to both GHL and Zapier
2. **Failed OTP Handling** - Only save to Supabase, NOT send to webhooks
3. **Event Tracking** - GA4 + Supabase dual tracking for all quiz steps
4. **Step Tracking** - Track each quiz step for dropoff analysis

---

## 📦 Files Created

### 1. Unified Tracking Library
**Location:** `03-ParentSimple/src/lib/unified-tracking.ts`

**Purpose:** Complete tracking system for GA4 and Supabase

**Key Functions:**
- `trackQuizStart()` - Track quiz initiation
- `trackQuizStepViewed()` - Track individual step views
- `trackQuestionAnswer()` - Track quiz answers
- `trackQuizComplete()` - Track quiz completion
- `trackPageView()` - Track page views
- `trackEmailCapture()` - Track email capture
- `trackLeadFormSubmit()` - Track final lead submission

**Features:**
- ✅ Dual tracking (GA4 + Supabase)
- ✅ UTM parameter capture
- ✅ Session management
- ✅ Bot detection
- ✅ Graceful error handling
- ✅ Meta Pixel IDs capture

### 2. Webhook Delivery Service
**Location:** `03-ParentSimple/src/lib/webhook-delivery.ts`

**Purpose:** Unified webhook delivery to multiple destinations

**Key Functions:**
- `sendLeadToWebhooks()` - Send to GHL + Zapier in parallel
- `logWebhookDelivery()` - Log delivery results to analytics_events
- `buildWebhookPayload()` - Build standard webhook payload
- `areWebhooksConfigured()` - Check webhook configuration

**Features:**
- ✅ Parallel webhook delivery for speed
- ✅ Timeout protection (10 seconds)
- ✅ Comprehensive error handling
- ✅ Only sends VERIFIED leads (OTP complete)
- ✅ Detailed logging

**Webhook URLs:**
- GHL: `process.env.PARENTSIMPLE_GHL_WEBHOOK`
- Zapier: `https://hooks.zapier.com/hooks/catch/19194179/ulrctz4/`

### 3. Analytics Event Tracking API
**Location:** `03-ParentSimple/src/app/api/analytics/track-event/route.ts`

**Purpose:** API endpoint for server-side event tracking

**Features:**
- ✅ POST endpoint for tracking events
- ✅ Validates required fields
- ✅ Inserts to analytics_events table
- ✅ Uses `properties` JSONB (not event_data)
- ✅ Uses `page_url` (not site_key)
- ✅ CORS headers

---

## 🔧 Integration Points

### 1. Update verify-otp-and-send-to-ghl Route

**File to Update:** `src/app/api/leads/verify-otp-and-send-to-ghl/route.ts`

**Changes Required:**

```typescript
// 1. Add imports at top
import {
  sendLeadToWebhooks,
  logWebhookDelivery,
  buildWebhookPayload,
  areWebhooksConfigured
} from '@/lib/webhook-delivery';

// 2. Replace GHL webhook section (lines 449-576) with:

// Build webhook payload
const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
  request.headers.get('x-real-ip') ||
  null;
const userAgent = request.headers.get('user-agent') || null;

const webhookPayload = buildWebhookPayload({
  firstName: firstName || contact.first_name,
  lastName: lastName || contact.last_name,
  email: email,
  phone: formatPhoneForGHL(phoneNumber),
  zipCode: zipCode || lead.zip_code,
  state: state || lead.state,
  stateName: stateName || lead.state_name,
  householdIncome: quizAnswers?.household_income || null,
  funnelType: funnelType || lead.funnel_type || 'life_insurance_ca',
  quizAnswers: lead.quiz_answers || quizAnswers,
  calculatedResults: calculatedResults,
  licensingInfo: licensingInfo,
  leadScore: calculatedResults?.totalScore || calculatedResults?.readiness_score || 0,
  utmParams: utmParams || lead.quiz_answers?.utm_parameters || {},
  sessionId: sessionId,
  ipAddress: ipAddress,
  userAgent: userAgent
});

console.log('📤 Sending to webhooks (GHL + Zapier)...');

// Send to both GHL and Zapier in parallel
const deliveryResult = await sendLeadToWebhooks(webhookPayload, true); // true = is verified

// Log webhook delivery to analytics_events
await logWebhookDelivery(
  lead.id,
  contact.id,
  sessionId,
  deliveryResult,
  webhookPayload,
  utmParams
);

// Send Meta CAPI CompleteRegistration event (if configured)
// ... (keep existing Meta CAPI code) ...

// Return success if at least one webhook succeeded
if (deliveryResult.ghl.success || deliveryResult.zapier.success) {
  console.log('✅ Lead sent to webhooks:', {
    leadId: lead.id,
    ghl: deliveryResult.ghl.success ? 'Success' : 'Failed',
    zapier: deliveryResult.zapier.success ? 'Success' : 'Failed'
  });
  
  return createCorsResponse({ 
    success: true, 
    leadId: lead.id,
    contactId: contact.id,
    webhookDelivery: {
      ghl: deliveryResult.ghl.success,
      zapier: deliveryResult.zapier.success,
      allSuccessful: deliveryResult.allSuccessful
    }
  });
} else {
  console.error('❌ All webhooks failed:', deliveryResult);
  
  return createCorsResponse({ 
    error: 'All webhooks failed',
    leadId: lead.id,
    contactId: contact.id,
    webhookDelivery: deliveryResult
  }, 500);
}
```

**Key Changes:**
1. Replace single GHL webhook with unified webhook delivery
2. Send to both GHL and Zapier in parallel
3. Log comprehensive webhook delivery results
4. Return success if at least one webhook succeeds
5. Failed OTP leads never reach this code (verified status required)

---

## 📊 Event Tracking Protocol

### Database Schema (analytics_events table)

```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY,
  event_name TEXT NOT NULL,              -- e.g., 'quiz_step_viewed', 'email_capture'
  properties JSONB,                      -- ⚠️ CRITICAL: Use 'properties' NOT 'event_data'
  session_id TEXT,                       -- Links to quiz session
  user_id TEXT,                          -- User identifier (use session_id if anonymous)
  page_url TEXT,                         -- ⚠️ CRITICAL: Full URL with domain (not site_key!)
  referrer TEXT,                         -- Referrer URL
  user_agent TEXT,                       -- Browser user agent
  event_category TEXT,                   -- Category (e.g., 'quiz', 'tracking')
  event_label TEXT,                      -- Label (e.g., 'step_view', 'life_insurance_ca')
  event_value INTEGER,                   -- Numeric value if applicable
  created_at TIMESTAMP WITH TIME ZONE,
  contact_id UUID,
  lead_id UUID,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  ip_address TEXT
);
```

### Event Types

#### 1. quiz_start
**When:** User starts quiz  
**Properties:**
```json
{
  "site_key": "parentsimple.org",
  "quiz_type": "life_insurance_ca",
  "funnel_type": "life_insurance_ca",
  "utm_parameters": { ... },
  "contact": {
    "ga_client_id": "123.456",
    "fbc": "fb.1.xxx",
    "fbp": "fb.1.xxx"
  }
}
```

#### 2. quiz_step_viewed
**When:** User views each quiz step  
**Properties:**
```json
{
  "site_key": "parentsimple.org",
  "step_number": 1,
  "step_name": "coverage_type",
  "funnel_type": "life_insurance_ca",
  "previous_step": null,
  "time_on_previous_step": null,
  "utm_parameters": { ... }
}
```

#### 3. question_answer
**When:** User answers a quiz question  
**Properties:**
```json
{
  "site_key": "parentsimple.org",
  "question_id": "coverage_amount",
  "answer": "$500,000",
  "step": 2,
  "total_steps": 8,
  "progress_percentage": 25,
  "funnel_type": "life_insurance_ca",
  "utm_parameters": { ... }
}
```

#### 4. email_capture
**When:** User submits email  
**Properties:**
```json
{
  "site_key": "parentsimple.org",
  "funnel_type": "life_insurance_ca",
  "utm_parameters": { ... }
}
```

#### 5. quiz_complete
**When:** User completes entire quiz  
**Properties:**
```json
{
  "site_key": "parentsimple.org",
  "quiz_type": "life_insurance_ca",
  "funnel_type": "life_insurance_ca",
  "completion_time_seconds": 120,
  "utm_parameters": { ... }
}
```

#### 6. page_view
**When:** User views any page  
**Properties:**
```json
{
  "site_key": "parentsimple.org",
  "path": "/quiz/life-insurance-ca",
  "search": "?utm_source=facebook",
  "utm_parameters": { ... },
  "contact": {
    "ga_client_id": "123.456",
    "fbc": "fb.1.xxx",
    "fbp": "fb.1.xxx"
  }
}
```

#### 7. webhook_delivery
**When:** Lead sent to webhooks (logged by system)  
**Properties:**
```json
{
  "site_key": "parentsimple.org",
  "lead_id": "uuid",
  "contact_id": "uuid",
  "funnel_type": "life_insurance_ca",
  "delivery_result": {
    "ghl": { "success": true, "status": 200, "duration": 523 },
    "zapier": { "success": true, "status": 200, "duration": 412 },
    "allSuccessful": true,
    "timestamp": "2026-02-01T..."
  },
  "webhooks": { ... },
  "request_payload": { ... },
  "utm_parameters": { ... }
}
```

---

## 🎯 Implementation Checklist

### Phase 1: Core Files (✅ Completed)
- [x] Create `unified-tracking.ts`
- [x] Create `webhook-delivery.ts`
- [x] Create `/api/analytics/track-event/route.ts`

### Phase 2: Integration
- [ ] Update `verify-otp-and-send-to-ghl/route.ts` with webhook delivery service
- [ ] Update site_key from 'seniorsimple.org' to 'parentsimple.org' in all files
- [ ] Update source from 'SeniorSimple Quiz' to 'ParentSimple Quiz'

### Phase 3: Frontend Integration
- [ ] Import `unified-tracking.ts` in quiz components
- [ ] Add `trackQuizStart()` call when quiz begins
- [ ] Add `trackQuizStepViewed()` call for each step
- [ ] Add `trackQuestionAnswer()` call for each answer
- [ ] Add `trackEmailCapture()` call when email submitted
- [ ] Add `trackQuizComplete()` call when quiz finishes
- [ ] Add `trackPageView()` calls in layout or page components

### Phase 4: Environment Variables
- [ ] Add to Vercel/Environment:
  ```bash
  PARENTSIMPLE_GHL_WEBHOOK=https://services.leadconnectorhq.com/hooks/...
  PARENTSIMPLE_ZAPIER_WEBHOOK=https://hooks.zapier.com/hooks/catch/19194179/ulrctz4/
  ```

### Phase 5: Testing
- [ ] Test with failed OTP (should NOT send to webhooks)
- [ ] Test with successful OTP (should send to both GHL + Zapier)
- [ ] Verify events appear in Supabase analytics_events
- [ ] Verify GA4 events appear in GA4 dashboard
- [ ] Verify Meta Pixel events appear in Events Manager
- [ ] Test webhook timeout handling
- [ ] Test partial webhook failures (one succeeds, one fails)

---

## 📋 Test Data Sent

**Test Submission Date:** February 1, 2026  
**Zapier Webhook:** https://hooks.zapier.com/hooks/catch/19194179/ulrctz4/  
**Status:** ✅ Success  
**Request ID:** `019c1870-7fdc-5cfd-1759-8ede9c0b99bd`

**Test Payload Structure:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith.test@example.com",
  "phone": "+14165551234",
  "zipCode": "M5H2N2",
  "state": "ON",
  "stateName": "Ontario",
  "householdIncome": "$75,000 - $100,000",
  "source": "ParentSimple Quiz",
  "funnelType": "life_insurance_ca",
  "quizAnswers": {
    "coverage_type": "term_life",
    "coverage_amount": "$500,000",
    "age_range": "35-44",
    "gender": "male",
    "smoker": "no",
    "health_conditions": "none",
    "family_size": "4",
    "dependents": "2",
    "current_coverage": "no",
    "employment_status": "employed",
    "household_income": "$75,000 - $100,000",
    "primary_goal": "family_protection",
    "timeline": "within_30_days"
  },
  "calculatedResults": {
    "readiness_score": 85,
    "recommended_coverage": "$500,000",
    "estimated_monthly_premium": "$45-$65",
    "coverage_gap": "$350,000",
    "risk_level": "moderate"
  },
  "licensingInfo": {
    "province": "Ontario",
    "province_code": "ON",
    "license_required": true,
    "coverage_available": true
  },
  "leadScore": 85,
  "timestamp": "2026-02-01T...",
  "utmParams": {
    "utm_source": "facebook",
    "utm_medium": "cpc",
    "utm_campaign": "life_insurance_ca_test",
    "utm_content": "family_protection",
    "utm_term": "life_insurance_canada",
    "fbclid": "test_fbclid_12345"
  },
  "metadata": {
    "site_key": "parentsimple.org",
    "session_id": "test_session_...",
    "ip_address": "172.16.254.1",
    "user_agent": "Mozilla/5.0...",
    "landing_page": "https://parentsimple.org/quiz/life-insurance-ca",
    "test_submission": true
  }
}
```

---

## 🚨 Critical Notes

### ⚠️ Column Names
- ✅ Use `properties` NOT `event_data` (critical!)
- ✅ Use `page_url` NOT `site_key` (site_key doesn't exist in analytics_events!)
- ✅ Filter ParentSimple: `page_url LIKE '%parentsimple.org%'`
- ✅ Always include full URL with domain in `page_url`

### ⚠️ Failed OTP Handling
- ❌ Do NOT send to webhooks if OTP verification fails
- ✅ Only save failed attempts to Supabase database
- ✅ Only send VERIFIED leads (is_verified = true) to webhooks

### ⚠️ Session Management
- Must be consistent across all events in a user's journey
- Store in localStorage or sessionStorage
- Pass to all tracking API calls
- Also pass same value as `user_id` for anonymous users

### ⚠️ Required Fields for Every Event
```typescript
{
  event_name: string,        // REQUIRED
  properties: object,        // REQUIRED (use this, not event_data!)
  session_id: string,        // REQUIRED
  user_id: string,           // REQUIRED (use session_id if anonymous)
  page_url: string,          // REQUIRED (full URL with domain)
  referrer: string,          // REQUIRED
  user_agent: string,        // REQUIRED
  event_category: string,    // REQUIRED
  event_label: string        // REQUIRED
}
```

---

## 📊 Verification Queries

### Check webhook deliveries
```sql
SELECT 
  event_name,
  properties->>'funnel_type' as funnel_type,
  properties->'delivery_result'->>'allSuccessful' as all_successful,
  properties->'delivery_result'->'ghl'->>'success' as ghl_success,
  properties->'delivery_result'->'zapier'->>'success' as zapier_success,
  created_at
FROM analytics_events
WHERE page_url LIKE '%parentsimple.org%'
  AND event_name = 'webhook_delivery'
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### Check quiz step progression
```sql
SELECT 
  properties->>'step_name' as step_name,
  properties->>'step_number' as step_number,
  COUNT(*) as views
FROM analytics_events
WHERE event_name = 'quiz_step_viewed'
  AND page_url LIKE '%parentsimple.org%'
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY properties->>'step_name', properties->>'step_number'
ORDER BY step_number::int;
```

### Check quiz dropoff
```sql
WITH funnel AS (
  SELECT 
    event_name,
    COUNT(DISTINCT session_id) as unique_sessions
  FROM analytics_events
  WHERE page_url LIKE '%parentsimple.org%'
    AND created_at > NOW() - INTERVAL '24 hours'
    AND event_name IN ('quiz_start', 'email_capture', 'quiz_complete', 'webhook_delivery')
  GROUP BY event_name
)
SELECT 
  event_name,
  unique_sessions,
  LAG(unique_sessions) OVER (ORDER BY 
    CASE event_name
      WHEN 'quiz_start' THEN 1
      WHEN 'email_capture' THEN 2
      WHEN 'quiz_complete' THEN 3
      WHEN 'webhook_delivery' THEN 4
    END
  ) as previous_step,
  ROUND(100.0 * unique_sessions / LAG(unique_sessions) OVER (ORDER BY 
    CASE event_name
      WHEN 'quiz_start' THEN 1
      WHEN 'email_capture' THEN 2
      WHEN 'quiz_complete' THEN 3
      WHEN 'webhook_delivery' THEN 4
    END
  ), 2) as conversion_rate
FROM funnel
ORDER BY 
  CASE event_name
    WHEN 'quiz_start' THEN 1
    WHEN 'email_capture' THEN 2
    WHEN 'quiz_complete' THEN 3
    WHEN 'webhook_delivery' THEN 4
  END;
```

---

## 🎉 Success Criteria

After implementation, you should be able to:

1. ✅ Track every quiz step with dropoff analysis
2. ✅ Send verified leads to both GHL and Zapier automatically
3. ✅ See real-time events in GA4 dashboard
4. ✅ See all events in Supabase analytics_events table
5. ✅ Query webhook delivery success/failure rates
6. ✅ Failed OTP attempts saved to Supabase only (not sent to webhooks)
7. ✅ Identify which quiz steps have highest dropoff
8. ✅ Track UTM attribution for all leads
9. ✅ Monitor webhook performance and timeouts
10. ✅ See cross-platform attribution (GA4 client ID + Meta Pixel IDs)

---

**End of Implementation Guide**
