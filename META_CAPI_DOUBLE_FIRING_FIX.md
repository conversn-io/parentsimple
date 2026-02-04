# Meta CAPI Double-Firing Fix

## Issue

Meta Conversions API (CAPI) conversion events were firing **twice** for each lead:

1. **First firing:** When user enters email → `/api/leads/capture-email`
2. **Second firing:** When user verifies OTP → `/api/leads/verify-otp-and-send-to-ghl`

This resulted in:
- ❌ Duplicate conversion events in Meta
- ❌ Inflated conversion metrics
- ❌ Incorrect ROAS (Return on Ad Spend) calculations
- ❌ Double-counting leads

---

## Root Cause

The `sendLeadEvent()` function was being called in **both** endpoints:

### 1. Email Capture Endpoint
**File:** `src/app/api/leads/capture-email/route.ts`

```typescript
// ❌ BEFORE - Firing Meta CAPI on email capture
if (lead?.id) {
  try {
    const capiResult = await sendLeadEvent({
      leadId: lead.id,
      email,
      phone: phoneNumber || null,
      // ... other params
    });
  }
}
```

### 2. OTP Verification Endpoint  
**File:** `src/app/api/leads/verify-otp-and-send-to-ghl/route.ts`

```typescript
// ✅ CORRECT - Should fire Meta CAPI on conversion
if (lead?.id) {
  try {
    const capiResult = await sendLeadEvent({
      leadId: lead.id,
      email,
      phone: phoneNumber,
      // ... other params
    });
  }
}
```

---

## Solution

**Removed** `sendLeadEvent()` call from the email capture endpoint.

### Changes Made

**File:** `src/app/api/leads/capture-email/route.ts`

**Before:**
```typescript
import { sendLeadEvent } from '@/lib/meta-capi-service';

// ... later in code ...
if (lead?.id) {
  try {
    const capiResult = await sendLeadEvent({
      leadId: lead.id,
      email,
      // ... full CAPI call
    });
  }
}
```

**After:**
```typescript
// Removed Meta CAPI import - conversion should only fire on OTP verification
// import removed

// ... later in code ...
if (lead?.id) {
  console.log('[Email Capture] Lead created, Meta CAPI will fire on OTP verification:', lead.id);
}
```

---

## User Flow (Fixed)

### Life Insurance CA & Elite University Quizzes

**Step 1: Email Capture**
```
User enters email
    ↓
POST /api/leads/capture-email
    ↓
✅ Create lead in database
✅ Generate OTP code
✅ Send OTP via email
❌ NO Meta CAPI (removed!)
```

**Step 2: OTP Verification**
```
User enters OTP code
    ↓
POST /api/leads/verify-otp-and-send-to-ghl
    ↓
✅ Verify OTP
✅ Mark lead as verified
✅ Send to GHL webhook
✅ Send to Zapier webhook
✅ Fire Meta CAPI (ONLY HERE!)
```

---

## Result

✅ **Single Meta CAPI conversion per lead**
- Conversion only fires on OTP verification
- Accurate conversion tracking
- Correct ROAS calculations
- No duplicate events

---

## Other Funnels

### Annuity & FIA Quote Quizzes

These quizzes use a different endpoint that **does not use OTP verification**:

**File:** `src/app/api/process-lead/route.ts`

```typescript
// ✅ CORRECT - These funnels don't use OTP, so Meta CAPI fires here
const capiResult = await sendLeadEvent({
  leadId,
  email: body?.contact?.email || body?.email || null,
  // ...
});
```

**This endpoint is NOT affected** by the fix because:
- Annuity/FIA quizzes submit directly (no OTP)
- This is their only conversion point
- No double-firing issue

---

## Meta CAPI Firing Points (After Fix)

| Funnel | Endpoint | Fires Meta CAPI? | Reason |
|--------|----------|------------------|--------|
| **Life Insurance CA** | `/api/leads/capture-email` | ❌ No | Email capture only |
| **Life Insurance CA** | `/api/leads/verify-otp-and-send-to-ghl` | ✅ Yes | Final conversion |
| **Elite University** | `/api/leads/capture-email` | ❌ No | Email capture only |
| **Elite University** | `/api/leads/verify-otp-and-send-to-ghl` | ✅ Yes | Final conversion |
| **Annuity Quiz** | `/api/process-lead` | ✅ Yes | Direct submit (no OTP) |
| **FIA Quote Quiz** | `/api/process-lead` | ✅ Yes | Direct submit (no OTP) |

---

## Testing

### How to Verify the Fix

1. **Complete a Life Insurance CA quiz:**
   - Go to: https://parentsimple.org/quiz/life-insurance-ca-b
   - Fill out quiz and enter email
   - Verify OTP code
   - Complete submission

2. **Check Meta Events Manager:**
   - Look for "Lead" conversion event
   - Should see **1 event** per lead (not 2)
   - Event should fire **after OTP verification**

3. **Check Vercel Logs:**
   ```bash
   vercel logs --prod
   ```
   - Search for: `[Meta CAPI] Lead event sent`
   - Should appear **once per lead**
   - Should be in `verify-otp-and-send-to-ghl` logs
   - Should **not** appear in `capture-email` logs

4. **Check Supabase:**
   ```sql
   SELECT 
     id,
     email,
     meta_capi_result,
     created_at
   FROM leads
   WHERE created_at > NOW() - INTERVAL '1 hour'
   ORDER BY created_at DESC;
   ```
   - `meta_capi_result` should show single event

---

## Deployment

**Status:** ✅ Live in Production

**Deployment:**
- URL: https://parentsimple-7chq0lc29-conversns-projects.vercel.app
- Inspect: https://vercel.com/conversns-projects/parentsimple/HjjB76eEtp8v9k98dFx1P1z9bXw7
- Commit: `578ac1a`
- Date: February 4, 2026

---

## Related Files

### Modified
- `src/app/api/leads/capture-email/route.ts` - Removed Meta CAPI call

### Unchanged (Still Fire Meta CAPI)
- `src/app/api/leads/verify-otp-and-send-to-ghl/route.ts` - Final conversion point
- `src/app/api/process-lead/route.ts` - Annuity/FIA direct submissions
- `src/app/api/leads/submit-without-otp/route.ts` - Alternative submission path

---

## Summary

**Before Fix:**
- 2 Meta CAPI events per lead (email capture + OTP verification)
- Inflated conversion metrics
- Incorrect ROAS

**After Fix:**
- 1 Meta CAPI event per lead (OTP verification only)
- Accurate conversion tracking
- Correct attribution

**The fix ensures Meta CAPI conversion events fire only once per lead, at the true conversion point (OTP verification).**
