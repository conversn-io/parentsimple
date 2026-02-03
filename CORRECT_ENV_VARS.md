# ⚠️ CORRECT Environment Variable Names

## ❌ What You Set (Incorrect)
```
META_PIXEL_ID_INSURANCE = 1207654221006842  ❌ Wrong name!
META_CAPI_TOKEN = EAAGWT0Ajy... ✅ Correct!
```

## ✅ What the Code Expects
From `src/lib/meta-capi-service.ts` line 21-22:
```typescript
const META_PIXEL_ID = process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
const META_CAPI_TOKEN = process.env.META_CAPI_TOKEN || process.env.META_CAPI_ACCESS_TOKEN;
```

## 🔧 Fix in Vercel

### Option 1: Rename the Variable
1. Delete: `META_PIXEL_ID_INSURANCE`
2. Add: `META_PIXEL_ID` = `1207654221006842`

### Option 2: Keep Token, Add Pixel ID
1. Keep: `META_CAPI_TOKEN` ✅ (already correct)
2. Add new: `META_PIXEL_ID` = `1207654221006842`

---

## ⚡ Quick Fix via Vercel CLI

```bash
cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"

# Add the CORRECT pixel ID variable
vercel env add META_PIXEL_ID production
# When prompted, enter: 1207654221006842

# Remove the incorrect one (optional but recommended)
vercel env rm META_PIXEL_ID_INSURANCE production

# Redeploy
vercel --prod
```

---

## 📋 Final Required Variables

| Variable Name | Value | Status |
|---------------|-------|--------|
| `META_PIXEL_ID` | `1207654221006842` | ❌ MISSING |
| `META_CAPI_TOKEN` | `EAAGWT0Ajy...` | ✅ SET |

---

## ✅ After Fix

Run smoke test again:
```bash
node smoke-test-lead-conversion.js https://parentsimple.org
```

Then check logs should show:
```
✅ [Meta CAPI] Lead event sent: evt_xxxxx
```

Not:
```
❌ [Meta CAPI] Meta CAPI not configured
```
