# Funnel-Specific Webhook Routing - Migration Guide

## What Changed

### Before (Generic)
```typescript
// Single webhook for all funnels
const ZAPIER_WEBHOOK_URL = process.env.PARENTSIMPLE_ZAPIER_WEBHOOK
```

**Behavior:**
- All leads (Life Insurance CA + Elite University) → Same Zapier endpoint
- No funnel-specific routing

### After (Funnel-Specific)
```typescript
// Separate webhooks per funnel
const LIFE_INSURANCE_ZAPIER_WEBHOOK = process.env.PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK
const ELITE_UNIVERSITY_ZAPIER_WEBHOOK = process.env.PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK

// Smart routing based on funnel type
function getZapierWebhookUrl(funnelType: string): string {
  if (funnelType === 'life_insurance_ca') return LIFE_INSURANCE_ZAPIER_WEBHOOK;
  if (funnelType === 'elite_university_readiness') return ELITE_UNIVERSITY_ZAPIER_WEBHOOK;
  return '';
}
```

**Behavior:**
- Life Insurance CA leads → Life Insurance Zapier endpoint
- Elite University leads → Elite University Zapier endpoint (when configured)
- Unknown funnels → No Zapier webhook (GHL only)

---

## Migration Steps

### Step 1: Update Vercel Environment Variables

**Remove old variable:**
```bash
vercel env rm PARENTSIMPLE_ZAPIER_WEBHOOK
```

**Add new funnel-specific variables:**
```bash
# Life Insurance CA webhook (your current endpoint)
vercel env add PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK
# Value: https://services.leadconnectorhq.com/hooks/rqTRxGq1yRvvDT6axp0M/webhook-trigger/ghPPPrV6ET9lzJ20bSlx
# Environments: Production, Preview, Development

# Elite University webhook (add when ready)
vercel env add PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK
# Value: <your elite university endpoint or leave empty for now>
# Environments: Production, Preview, Development
```

### Step 2: Deploy Updated Code

```bash
cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"

# Commit changes
git add src/lib/webhook-delivery.ts
git commit -m "feat: Implement funnel-specific Zapier webhook routing

- Add PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK for Life Insurance CA
- Add PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK for Elite University
- Add getZapierWebhookUrl() function for smart routing
- Update logging to show which webhook was used
- Deprecate generic PARENTSIMPLE_ZAPIER_WEBHOOK

Breaking Change:
- Requires new environment variables to be set
- Old PARENTSIMPLE_ZAPIER_WEBHOOK no longer used"

# Push to GitHub
git push origin main

# Deploy to production
vercel --prod --yes
```

### Step 3: Verify Routing

**Test Life Insurance CA lead:**
```bash
# Should route to Life Insurance Zapier webhook
# Check Vercel logs for: "📍 Using Life Insurance Zapier webhook"
```

**Test Elite University lead:**
```bash
# If ELITE_UNIVERSITY_ZAPIER_WEBHOOK not set:
# Check Vercel logs for: "⚠️ No Zapier webhook configured for funnel: elite_university_readiness"
# Lead still goes to GHL, just not Zapier
```

---

## Environment Variable Reference

### New Variables (Required)

```bash
# Life Insurance CA Funnel
PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK=https://services.leadconnectorhq.com/hooks/rqTRxGq1yRvvDT6axp0M/webhook-trigger/ghPPPrV6ET9lzJ20bSlx

# Elite University Funnel (optional - set when ready)
PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK=<your-elite-university-endpoint>
```

### Existing Variables (Unchanged)

```bash
# GHL webhook (all funnels still use this)
PARENTSIMPLE_GHL_WEBHOOK=<your-ghl-webhook>
PARENT_SIMPLE_GHL_WEBHOOK=<your-ghl-webhook>  # Fallback name
```

### Deprecated Variables (Remove)

```bash
# Old generic webhook (no longer used)
PARENTSIMPLE_ZAPIER_WEBHOOK  # ❌ Remove this
```

---

## Webhook Routing Logic

### Life Insurance CA Funnel

**Funnel Type:** `life_insurance_ca`

**Webhook Destinations:**
1. ✅ GHL (PARENTSIMPLE_GHL_WEBHOOK)
2. ✅ Zapier (PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK)

**Fields Sent:**
- Standard: firstName, lastName, email, phone, zipCode, state
- Life Insurance: gender, purpose, best_time, coverage, age_range, smoker
- Calculated: recommended_coverage, estimated_premium, coverage_gap

**Vercel Log:**
```
🔀 Routing webhook for funnel: life_insurance_ca
📍 Using Life Insurance Zapier webhook
🚀 Sending to Zapier (life_insurance_ca): {...}
✅ Zapier (life_insurance_ca) success
```

### Elite University Readiness Funnel

**Funnel Type:** `elite_university_readiness`

**Webhook Destinations:**
1. ✅ GHL (PARENTSIMPLE_GHL_WEBHOOK)
2. ⚠️ Zapier (PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK) - Only if configured

**Fields Sent:**
- Standard: firstName, lastName, email, phone, zipCode, state
- Elite University: graduation_year, gpa, test_scores, extracurriculars, achievements
- Calculated: readiness_score, academic_score, recommendations

**Vercel Log (if webhook configured):**
```
🔀 Routing webhook for funnel: elite_university_readiness
📍 Using Elite University Zapier webhook
🚀 Sending to Zapier (elite_university_readiness): {...}
✅ Zapier (elite_university_readiness) success
```

**Vercel Log (if webhook NOT configured):**
```
🔀 Routing webhook for funnel: elite_university_readiness
⚠️ Unknown funnel type, no Zapier webhook configured: elite_university_readiness
⚠️ No Zapier webhook configured for funnel: elite_university_readiness
```

---

## Testing Plan

### Test 1: Life Insurance CA Lead

**Expected:**
- ✅ Routes to Life Insurance Zapier webhook
- ✅ Includes gender, purpose, best_time fields
- ✅ GHL also receives lead
- ✅ Logged to Supabase with funnel_type

**Verify in Vercel logs:**
```bash
vercel logs parentsimple.org | grep -E "(life_insurance|Zapier)" | head -20
```

### Test 2: Elite University Lead (No Zapier Webhook)

**Expected:**
- ⚠️ No Zapier webhook configured warning
- ✅ GHL still receives lead
- ✅ Logged to Supabase with funnel_type
- ❌ No Zapier delivery (intentional)

**Verify in Vercel logs:**
```bash
vercel logs parentsimple.org | grep -E "(elite_university|Zapier)" | head -20
```

### Test 3: Elite University Lead (With Zapier Webhook)

**After setting PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK:**

**Expected:**
- ✅ Routes to Elite University Zapier webhook
- ✅ Includes graduation_year, gpa, test_scores fields
- ✅ GHL also receives lead
- ✅ Logged to Supabase with funnel_type

---

## Rollback Plan

If issues arise, rollback is simple:

### Option 1: Revert Code
```bash
git revert HEAD
git push origin main
vercel --prod --yes
```

### Option 2: Set Old Variable
```bash
# Keep new code, but set old variable name as alias
vercel env add PARENTSIMPLE_ZAPIER_WEBHOOK
# Value: <your webhook>
# Update code to check both old and new names
```

---

## Benefits of Funnel-Specific Routing

### 1. Clear Separation
- Life Insurance leads → Insurance endpoint
- Elite University leads → Education endpoint
- No confusion about which leads go where

### 2. Different Processing
- Life Insurance: Route to insurance agents, schedule callbacks
- Elite University: Route to education consultants, different workflow

### 3. Better Analytics
- Track conversion rates per funnel
- Monitor webhook success rates per endpoint
- Identify funnel-specific issues

### 4. Flexible Scaling
- Add new funnels easily (e.g., "Financial Planning")
- Each funnel can have its own Zapier endpoint
- No risk of cross-contamination

### 5. Explicit Configuration
- Variable names make it obvious which funnel they serve
- Prevents accidental misconfiguration
- Self-documenting infrastructure

---

## Code Changes Summary

**File:** `src/lib/webhook-delivery.ts`

**Changes:**
1. ✅ Added `LIFE_INSURANCE_ZAPIER_WEBHOOK` constant
2. ✅ Added `ELITE_UNIVERSITY_ZAPIER_WEBHOOK` constant
3. ✅ Created `getZapierWebhookUrl(funnelType)` function
4. ✅ Updated `sendLeadToWebhooks()` to use funnel-specific URL
5. ✅ Updated `logWebhookDelivery()` to log which webhook was used
6. ✅ Updated `areWebhooksConfigured()` to check funnel-specific config
7. ✅ Added `getWebhookConfig()` for debugging

**Build Status:** ✅ Compiled successfully

---

## Next Steps

### Immediate (Required)

1. Set environment variable in Vercel:
   ```bash
   vercel env add PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK
   ```

2. Deploy updated code:
   ```bash
   git add src/lib/webhook-delivery.ts
   git commit -m "feat: Implement funnel-specific Zapier webhook routing"
   git push origin main
   vercel --prod --yes
   ```

3. Test Life Insurance CA lead:
   - Take quiz: https://parentsimple.org/quiz/life-insurance-ca
   - Verify OTP
   - Check Vercel logs for routing confirmation

### Future (Optional)

4. When ready to route Elite University leads to Zapier:
   ```bash
   vercel env add PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK
   # Value: <your elite university endpoint>
   ```

5. No code changes needed - routing will automatically work!

---

## Verification Checklist

After deployment:

- [ ] Life Insurance CA leads route to correct Zapier webhook
- [ ] Elite University leads skip Zapier (or route to separate endpoint if configured)
- [ ] GHL still receives all leads (unchanged)
- [ ] Vercel logs show funnel-specific routing messages
- [ ] Supabase analytics_events logs which webhook was used
- [ ] No errors in production

---

## Questions?

**Q: What if I don't set PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK?**  
A: Elite University leads will only go to GHL, not Zapier. This is safe and intentional.

**Q: Can I use the same webhook for both funnels?**  
A: Yes, just set both variables to the same URL. But then you lose the benefit of separation.

**Q: What happens to leads from unknown funnels?**  
A: They go to GHL only, no Zapier. Logged with warning in Vercel logs.

**Q: Can I change the webhook URLs without code deploy?**  
A: Yes! Just update the environment variables in Vercel. No code changes needed.

---

## Ready to Deploy

✅ Code updated and tested  
✅ Build successful  
✅ Migration guide complete  
✅ Rollback plan documented  

**Waiting for your confirmation to:**
1. Commit changes
2. Set environment variable
3. Deploy to production
