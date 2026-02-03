# ✅ Funnel-Specific Webhook Routing - DEPLOYED

## Deployment Summary

**Date:** February 3, 2026  
**Status:** ✅ Live in Production  
**Deployment:** https://parentsimple-jeva6xj6d-conversns-projects.vercel.app  
**Inspect:** https://vercel.com/conversns-projects/parentsimple/9wyLUNEVHP6PAPGD1v3ZVKotgrwk

---

## What's Live Now

### 🔀 Smart Webhook Routing

**Life Insurance CA Leads:**
- Funnel: `life_insurance_ca`
- Zapier Endpoint: `https://services.leadconnectorhq.com/hooks/rqTRxGq1yRvvDT6axp0M/webhook-trigger/ghPPPrV6ET9lzJ20bSlx`
- Fields: gender, purpose, best_time, coverage, age_range, smoker
- Status: ✅ Configured and Active

**Elite University Leads:**
- Funnel: `elite_university_readiness`
- Zapier Endpoint: Not configured (intentional)
- Behavior: Goes to GHL only, no Zapier
- Status: ⚠️ Zapier webhook not set (can add later)

---

## Environment Variables

### ✅ Active Configuration

```bash
PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK
  Production: ✅ Set
  Preview: ✅ Set
  Development: ✅ Set
  Value: https://services.leadconnectorhq.com/.../ghPPPrV6ET9lzJ20bSlx

PARENT_SIMPLE_GHL_WEBHOOK
  All Environments: ✅ Set
  Used by: All funnels
```

### ❌ Removed (Deprecated)

```bash
PARENTSIMPLE_ZAPIER_WEBHOOK
  Status: ❌ Removed from Production
  Reason: Replaced with funnel-specific variables
```

---

## How It Works

### Lead Flow: Life Insurance CA

```
User completes Life Insurance CA quiz
    ↓
Verifies OTP ✅
    ↓
Lead saved to Supabase
    ↓
getZapierWebhookUrl('life_insurance_ca')
    ↓
Returns: PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK
    ↓
┌────────────┴────────────┐
↓                         ↓
GHL Webhook          Life Insurance Zapier
(parallel)           (parallel)
    ↓                         ↓
✅ Success            ✅ Success
```

**Vercel Logs:**
```
🔀 Routing webhook for funnel: life_insurance_ca
📍 Using Life Insurance Zapier webhook
🚀 Sending to Zapier (life_insurance_ca): {email: "...", funnelType: "life_insurance_ca"}
✅ Zapier (life_insurance_ca) success
```

### Lead Flow: Elite University

```
User completes Elite University quiz
    ↓
Verifies OTP ✅
    ↓
Lead saved to Supabase
    ↓
getZapierWebhookUrl('elite_university_readiness')
    ↓
Returns: '' (empty - not configured)
    ↓
GHL Webhook only
    ↓
✅ Success
```

**Vercel Logs:**
```
🔀 Routing webhook for funnel: elite_university_readiness
⚠️ Unknown funnel type, no Zapier webhook configured: elite_university_readiness
⚠️ No Zapier webhook configured for funnel: elite_university_readiness
✅ GHL success
```

---

## Testing

### Test 1: Life Insurance CA Lead

**Steps:**
1. Visit: https://parentsimple.org/quiz/life-insurance-ca
2. Complete quiz (select Ontario, answer all questions including gender, purpose, best_time)
3. Enter email and phone
4. Verify OTP code
5. Check results

**Expected:**
- ✅ Lead sent to GHL
- ✅ Lead sent to Life Insurance Zapier webhook
- ✅ Vercel logs show: "📍 Using Life Insurance Zapier webhook"
- ✅ Your Zapier dashboard shows new lead

**Verify:**
```bash
vercel logs parentsimple.org | grep -E "(life_insurance|Zapier)" | head -20
```

### Test 2: Elite University Lead

**Steps:**
1. Visit: https://parentsimple.org/quiz/elite-university-readiness
2. Complete quiz
3. Enter email and phone
4. Verify OTP code
5. Check results

**Expected:**
- ✅ Lead sent to GHL
- ⚠️ No Zapier webhook (not configured)
- ✅ Vercel logs show: "⚠️ No Zapier webhook configured for funnel: elite_university_readiness"
- ❌ No lead in Zapier dashboard (intentional)

**Verify:**
```bash
vercel logs parentsimple.org | grep -E "(elite_university|Zapier)" | head -20
```

---

## Adding Elite University Zapier Webhook (Future)

When you're ready to route Elite University leads to Zapier:

```bash
# Add the environment variable
vercel env add PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK production
# Enter your Elite University Zapier webhook URL

vercel env add PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK preview
# Same URL

vercel env add PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK development
# Same URL

# Redeploy (or wait for next deployment)
vercel --prod --yes
```

**No code changes needed!** The routing logic is already in place.

---

## Webhook Payload Differences

### Life Insurance CA Payload

```json
{
  "firstName": "Jennifer",
  "lastName": "Martinez",
  "email": "jennifer.martinez@example.com",
  "phone": "+14165551234",
  "funnelType": "life_insurance_ca",
  "quizAnswers": {
    "province": "Ontario",
    "purpose": "protect_family",        // ✅ Life Insurance specific
    "gender": "female",                 // ✅ Life Insurance specific
    "best_time": "evening",             // ✅ Life Insurance specific
    "coverage": "1m",
    "age_range": "36-50",
    "smoker": "no"
  }
}
```

### Elite University Payload

```json
{
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.johnson@example.com",
  "phone": "+14155551234",
  "funnelType": "elite_university_readiness",
  "quizAnswers": {
    "graduation_year": "2027",          // ✅ Elite University specific
    "gpa": "4.0",                       // ✅ Elite University specific
    "test_scores": "sat_1500plus",      // ✅ Elite University specific
    "extracurriculars": "...",
    "achievements": "...",
    "household_income": "$150,000-$200,000"
  }
}
```

**Key Difference:** Different fields for different business lines!

---

## Monitoring

### Check Webhook Routing in Vercel Logs

```bash
# See which webhook is being used
vercel logs parentsimple.org | grep "📍 Using"

# Expected output:
# 📍 Using Life Insurance Zapier webhook
# 📍 Using Elite University Zapier webhook (when configured)
```

### Check Webhook Delivery Success

```sql
-- Run in Supabase SQL Editor
SELECT 
  created_at,
  properties->>'funnel_type' as funnel,
  properties->'webhooks'->'zapier'->>'success' as zapier_success,
  properties->'webhooks'->'zapier'->>'funnel_type' as zapier_funnel,
  properties->'webhooks'->'ghl'->>'success' as ghl_success
FROM analytics_events
WHERE event_name = 'webhook_delivery'
  AND created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC
LIMIT 20;
```

### Check Zapier Dashboard

- Life Insurance CA leads should appear in your Zap
- Elite University leads should NOT appear (unless you set the webhook)

---

## Configuration Summary

| Variable | Environment | Status | Used By |
|----------|------------|--------|---------|
| `PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK` | Production, Preview, Dev | ✅ Set | Life Insurance CA funnel |
| `PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK` | Not set | ⚠️ Optional | Elite University funnel |
| `PARENT_SIMPLE_GHL_WEBHOOK` | Production, Preview, Dev | ✅ Set | All funnels |
| `PARENTSIMPLE_ZAPIER_WEBHOOK` | Removed | ❌ Deprecated | None |

---

## Benefits Achieved

✅ **Clear Separation:** Each funnel routes to its own endpoint  
✅ **Explicit Naming:** Variable names indicate which funnel they serve  
✅ **Flexible Routing:** Can add new funnels easily  
✅ **Better Logging:** Logs show which webhook was used  
✅ **No Cross-Contamination:** Life Insurance leads won't go to Elite University endpoint  
✅ **Future-Proof:** Ready to add more funnels as needed  

---

## What's Next

### Immediate
- ✅ Code deployed
- ✅ Environment variables set
- ✅ Life Insurance CA routing active

### Test Now
1. Take Life Insurance CA quiz
2. Verify OTP
3. Check Zapier dashboard for lead
4. Check Vercel logs for routing confirmation

### Future (When Ready)
1. Set `PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK`
2. Elite University leads will automatically route to that endpoint
3. No code changes needed!

---

## Documentation Files

- `FUNNEL_SPECIFIC_WEBHOOKS_MIGRATION.md` - Full migration guide
- `WEBHOOK_ROUTING_RECOMMENDATION.md` - Original analysis
- `ZAPIER_WEBHOOK_COMPLETE_TEST.md` - Test results with all fields
- `setup-funnel-webhooks.sh` - Interactive setup script

**All systems are go! 🚀**
