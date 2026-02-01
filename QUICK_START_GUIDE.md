# ParentSimple Webhook & Tracking - Quick Start

## ✅ What's Been Done

### Files Created
1. **`03-ParentSimple/src/lib/unified-tracking.ts`** - Complete tracking system (GA4 + Supabase)
2. **`03-ParentSimple/src/lib/webhook-delivery.ts`** - Unified webhook delivery (GHL + Zapier)
3. **`03-ParentSimple/src/app/api/analytics/track-event/route.ts`** - Event tracking API endpoint

### Test Submission Completed
- ✅ Test data sent to Zapier webhook: https://hooks.zapier.com/hooks/catch/19194179/ulrctz4/
- ✅ Webhook confirmed working (Request ID: 019c1870-7fdc-5cfd-1759-8ede9c0b99bd)
- ✅ Life insurance Canada submission structure validated

---

## 🚀 Next Steps

### 1. Update verify-otp Route (5 min)

**File:** `src/app/api/leads/verify-otp-and-send-to-ghl/route.ts`

Add at top:
```typescript
import {
  sendLeadToWebhooks,
  logWebhookDelivery,
  buildWebhookPayload
} from '@/lib/webhook-delivery';
```

Replace webhook section with:
```typescript
const webhookPayload = buildWebhookPayload({
  firstName, lastName, email,
  phone: formatPhoneForGHL(phoneNumber),
  zipCode, state, stateName,
  householdIncome: quizAnswers?.household_income,
  funnelType, quizAnswers,
  calculatedResults, licensingInfo,
  leadScore: calculatedResults?.totalScore || 0,
  utmParams, sessionId,
  ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0],
  userAgent: request.headers.get('user-agent')
});

const deliveryResult = await sendLeadToWebhooks(webhookPayload, true);
await logWebhookDelivery(lead.id, contact.id, sessionId, deliveryResult, webhookPayload, utmParams);
```

### 2. Add Frontend Tracking (10 min)

In quiz components:
```typescript
import {
  trackQuizStart,
  trackQuizStepViewed,
  trackQuestionAnswer,
  trackEmailCapture,
  trackLeadFormSubmit,
  getSessionId
} from '@/lib/unified-tracking';

// On quiz start
trackQuizStart('life_insurance_ca', getSessionId(), 'life_insurance_ca');

// On each step
trackQuizStepViewed(stepNumber, stepName, getSessionId(), 'life_insurance_ca');

// On answer
trackQuestionAnswer(questionId, answer, step, totalSteps, getSessionId(), 'life_insurance_ca');

// On email capture
trackEmailCapture(email, getSessionId(), 'life_insurance_ca');
```

### 3. Environment Variables (2 min)

Add to Vercel:
```bash
PARENTSIMPLE_GHL_WEBHOOK=<your-ghl-webhook-url>
PARENTSIMPLE_ZAPIER_WEBHOOK=https://hooks.zapier.com/hooks/catch/19194179/ulrctz4/
```

---

## 🔍 Testing

### Test Failed OTP
Should save to Supabase but NOT send to webhooks ✓

### Test Successful OTP
Should send to both GHL and Zapier ✓

### Verify in Supabase
```sql
SELECT * FROM analytics_events 
WHERE page_url LIKE '%parentsimple.org%'
ORDER BY created_at DESC LIMIT 10;
```

---

## 📊 Key Points

### ✅ Verified Leads Only
- Failed OTP → Supabase only
- Successful OTP → Supabase + GHL + Zapier

### ✅ Dual Tracking
- Every event → GA4 + Supabase
- Bot detection built-in
- Graceful error handling

### ✅ Parallel Webhooks
- GHL and Zapier sent simultaneously
- 10-second timeout protection
- Detailed logging

---

## 📖 Full Documentation

See `PARENTSIMPLE_WEBHOOK_TRACKING_IMPLEMENTATION.md` for:
- Complete implementation guide
- Event tracking protocol
- Database schema
- Verification queries
- Troubleshooting

---

## 🎯 Success Metrics

After implementation:
1. Every quiz step tracked ✓
2. Webhook delivery rate visible ✓
3. Failed OTP doesn't reach webhooks ✓
4. GA4 events flowing ✓
5. Supabase analytics populated ✓

---

**Questions?** See full implementation guide or tracking architecture docs.
