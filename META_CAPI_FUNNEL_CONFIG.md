# 🎯 Meta CAPI Funnel-Specific Configuration

## Overview

The Meta CAPI integration now supports **funnel-specific pixel IDs** while sharing a single `META_CAPI_TOKEN`. This allows you to track different funnels with different pixels for accurate attribution and campaign optimization.

---

## ✅ Required Environment Variables

### 1. Meta CAPI Access Token (Shared)
```bash
META_CAPI_TOKEN = "YOUR_ACCESS_TOKEN_HERE"
```
- **Used by:** All funnels
- **Where to find:** Meta Events Manager → Settings → Conversions API → Generate Access Token
- **Scope:** Must have access to all pixel IDs you want to use

### 2. Funnel-Specific Pixel IDs

#### Life Insurance Funnel
```bash
META_PIXEL_ID_INSURANCE = "1207654221006842"
```
- **Funnel types:** `life_insurance_ca`, `insurance`, or any funnel with "insurance" in the name

#### Elite College Funnel
```bash
META_PIXEL_ID_COLLEGE = "YOUR_COLLEGE_PIXEL_ID"
```
- **Funnel types:** `college_consulting`, `elite_college`, or any funnel with "college" in the name

#### Fallback (Optional)
```bash
META_PIXEL_ID = "FALLBACK_PIXEL_ID"
```
- **Used when:** Funnel type doesn't match any specific pixel OR as a default for new funnels

---

## 🔧 How It Works

### 1. Automatic Pixel Selection
The system automatically selects the correct pixel based on the `funnelType`:

```typescript
// In verify-otp-and-send-to-ghl route
const capiResult = await sendLeadEvent({
  leadId: lead.id,
  funnelType: 'life_insurance_ca', // ← System uses this to select pixel
  email,
  phone,
  // ... other params
});
```

### 2. Pixel Matching Logic
From `src/lib/meta-capi-service.ts`:

```typescript
export function getPixelIdForFunnel(funnelType?: string | null): string | undefined {
  // Life Insurance → META_PIXEL_ID_INSURANCE
  if (funnelType includes 'insurance' or 'life') {
    return META_PIXEL_ID_INSURANCE || META_PIXEL_ID;
  }
  
  // College Consulting → META_PIXEL_ID_COLLEGE
  if (funnelType includes 'college' or 'consulting') {
    return META_PIXEL_ID_COLLEGE || META_PIXEL_ID;
  }
  
  // Default fallback
  return META_PIXEL_ID;
}
```

### 3. Fallback Hierarchy
1. **Primary:** Funnel-specific pixel (e.g., `META_PIXEL_ID_INSURANCE`)
2. **Fallback:** Generic `META_PIXEL_ID`
3. **Error:** If neither exists, CAPI event is skipped with warning

---

## 📋 Setup Instructions

### Step 1: Add Variables to Vercel

#### Via CLI:
```bash
cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"

# Add the shared CAPI token (already done ✅)
vercel env add META_CAPI_TOKEN production
# Paste your access token when prompted

# Add Life Insurance pixel
vercel env add META_PIXEL_ID_INSURANCE production
# Enter: 1207654221006842

# Add College pixel
vercel env add META_PIXEL_ID_COLLEGE production
# Enter: YOUR_COLLEGE_PIXEL_ID

# Optional: Add fallback pixel
vercel env add META_PIXEL_ID production
# Enter: FALLBACK_PIXEL_ID
```

#### Via Vercel Dashboard:
1. Go to: https://vercel.com/conversns-projects/parentsimple/settings/environment-variables
2. Add each variable:
   - `META_CAPI_TOKEN` (if not already added)
   - `META_PIXEL_ID_INSURANCE` = `1207654221006842`
   - `META_PIXEL_ID_COLLEGE` = `YOUR_COLLEGE_PIXEL_ID`
   - `META_PIXEL_ID` = `FALLBACK_PIXEL_ID` (optional)
3. Select environment: **Production**, **Preview**, **Development**
4. Click "Save"

### Step 2: Redeploy
```bash
vercel --prod
```

---

## 🧪 Testing

### Smoke Test Command:
```bash
node smoke-test-lead-conversion.js https://parentsimple.org
```

### Expected Logs (Success):
```
[Meta CAPI] Using pixel for funnel life_insurance_ca: 1207654221006842
[Meta CAPI] Lead event sent: dd1ea7fe-5493-41dc-8733-348328497ae3-Lead-1738432123
```

### Check Vercel Logs:
```bash
vercel logs https://parentsimple.org --since 5m | grep "Meta CAPI"
```

### Verify in Meta Events Manager:
1. Go to: https://business.facebook.com/events_manager2
2. Select your pixel (1207654221006842 for insurance)
3. Go to: **Test Events** (if using test event code) or **Overview** (for production)
4. Look for `Lead` events with matching `event_id`

---

## 🎯 Funnel Type Mapping

| Funnel Type | Environment Variable | Pixel ID | Status |
|-------------|---------------------|----------|--------|
| `life_insurance_ca` | `META_PIXEL_ID_INSURANCE` | `1207654221006842` | ✅ Set |
| `insurance` | `META_PIXEL_ID_INSURANCE` | `1207654221006842` | ✅ Set |
| `college_consulting` | `META_PIXEL_ID_COLLEGE` | TBD | ⏳ Pending |
| `elite_college` | `META_PIXEL_ID_COLLEGE` | TBD | ⏳ Pending |
| *(any other)* | `META_PIXEL_ID` | Fallback | 🔄 Optional |

---

## 🐛 Troubleshooting

### Issue: "Meta CAPI not configured"
**Solution:** Check environment variables in Vercel:
```bash
vercel env ls
```
Ensure both `META_CAPI_TOKEN` and at least one pixel ID are set.

### Issue: Wrong pixel receiving events
**Solution:** Check funnel type in Supabase `leads` table:
```sql
SELECT id, funnel_type, email FROM leads WHERE session_id = 'your-session-id';
```
Ensure `funnel_type` matches expected patterns (`life_insurance_ca`, `college_consulting`, etc.)

### Issue: Pixel ID not found for funnel
**Solution:** Add funnel type to matching logic in `src/lib/meta-capi-service.ts`:
```typescript
// Add new funnel type
if (normalized.includes('your_new_funnel')) {
  return META_PIXEL_ID_YOUR_FUNNEL || META_PIXEL_ID;
}
```

---

## 📊 Current Configuration Status

### ✅ Configured
- Meta CAPI Token: Set in Vercel
- Life Insurance Pixel: `1207654221006842`
- Code: Updated to support funnel-specific pixels

### ⏳ Pending
- Elite College Pixel ID (need to create/find in Meta)
- Fallback Pixel ID (optional)

### 🚀 Ready to Deploy
Yes! Once you add `META_PIXEL_ID_INSURANCE` to Vercel, the life insurance funnel will work.

---

## 🔗 Related Files

- **Service:** `src/lib/meta-capi-service.ts` - Core CAPI logic with pixel selection
- **API Route:** `src/app/api/leads/verify-otp-and-send-to-ghl/route.ts` - Where `sendLeadEvent` is called
- **Test Script:** `smoke-test-lead-conversion.js` - End-to-end smoke test

---

## 📝 Notes

1. **One Token, Multiple Pixels:** The same `META_CAPI_TOKEN` can access multiple pixels as long as it has the correct permissions in Meta Business Manager.

2. **Deduplication:** Each pixel tracks separately, so you can run different ad campaigns for each funnel without cross-contamination.

3. **Backward Compatibility:** Existing code that doesn't pass `funnelType` will use the fallback `META_PIXEL_ID`.

4. **Frontend Integration:** Future work should update frontend tracking to use funnel-specific pixel IDs for the browser pixel (not just CAPI).

---

## ✅ Next Steps

1. **Add `META_PIXEL_ID_INSURANCE` to Vercel** ← Do this now
2. **Redeploy to production**
3. **Run smoke test** to verify
4. **Get College Pixel ID** from Meta
5. **Add `META_PIXEL_ID_COLLEGE` to Vercel**
6. **Test college funnel** when ready
