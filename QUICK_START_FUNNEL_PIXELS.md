# ⚡ Quick Start: Funnel-Specific Meta Pixels

## What Changed?

Your Meta CAPI integration now supports **different pixel IDs for different funnels** while sharing one access token.

### Before:
```
❌ Single META_PIXEL_ID for all funnels
```

### After:
```
✅ META_PIXEL_ID_INSURANCE for life insurance
✅ META_PIXEL_ID_COLLEGE for college consulting
✅ Automatic pixel selection based on funnel type
```

---

## 🚀 2-Minute Setup

### Step 1: Add Environment Variables

**Option A - Interactive Script (Recommended):**
```bash
cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"
./setup-meta-capi-env.sh
```

**Option B - Manual (Vercel CLI):**
```bash
# Insurance pixel (Life Insurance CA funnel)
vercel env add META_PIXEL_ID_INSURANCE production
# Enter: 1207654221006842

# College pixel (Elite College funnel)
vercel env add META_PIXEL_ID_COLLEGE production
# Enter: YOUR_COLLEGE_PIXEL_ID
```

**Option C - Vercel Dashboard:**
https://vercel.com/conversns-projects/parentsimple/settings/environment-variables

Add:
- `META_PIXEL_ID_INSURANCE` = `1207654221006842`
- `META_PIXEL_ID_COLLEGE` = `YOUR_COLLEGE_PIXEL_ID`

### Step 2: Deploy
```bash
./DEPLOY_FUNNEL_PIXELS.sh
```

Or manually:
```bash
git add .
git commit -m "feat: Add funnel-specific pixel support"
git push origin main
vercel --prod
```

### Step 3: Test
```bash
node smoke-test-lead-conversion.js https://parentsimple.org
```

Expected in logs:
```
[Meta CAPI] Lead event sent: evt_xxxxx
```

---

## 📋 Required Variables

| Variable | Value | Funnel | Status |
|----------|-------|--------|--------|
| `META_CAPI_TOKEN` | (your token) | All funnels | ✅ Already set |
| `META_PIXEL_ID_INSURANCE` | `1207654221006842` | Life Insurance | ⏳ Add this |
| `META_PIXEL_ID_COLLEGE` | (your pixel) | Elite College | ⏳ Add this |

---

## 🔍 How It Works

### Code automatically selects the right pixel:

```typescript
// Life Insurance CA funnel
funnelType: 'life_insurance_ca' → Uses META_PIXEL_ID_INSURANCE

// Elite College funnel
funnelType: 'college_consulting' → Uses META_PIXEL_ID_COLLEGE

// Unknown funnel
funnelType: 'something_new' → Uses META_PIXEL_ID (fallback)
```

### Matching Logic:
- Contains "insurance" or "life" → Insurance pixel
- Contains "college" or "consulting" → College pixel
- Anything else → Fallback pixel

---

## ✅ Verification Checklist

After deployment:

- [ ] Environment variables added to Vercel
- [ ] Deployed to production
- [ ] Smoke test passed
- [ ] Logs show: `[Meta CAPI] Lead event sent`
- [ ] Events appear in Meta Events Manager

---

## 🐛 Troubleshooting

### "Meta CAPI not configured"
```bash
# Check variables
vercel env ls | grep META

# Should see:
# META_CAPI_TOKEN
# META_PIXEL_ID_INSURANCE
# META_PIXEL_ID_COLLEGE (optional)
```

### Wrong pixel receiving events
Check funnel type in database:
```sql
SELECT id, funnel_type, email 
FROM leads 
WHERE session_id = 'your-session-id';
```

---

## 📖 Full Documentation

See `META_CAPI_FUNNEL_CONFIG.md` for:
- Complete setup guide
- Pixel matching logic details
- Testing instructions
- Troubleshooting steps
- Adding new funnel types

---

## 🎯 What You Need to Do Now

1. **Run:** `./setup-meta-capi-env.sh`
2. **Deploy:** `./DEPLOY_FUNNEL_PIXELS.sh`
3. **Test:** `node smoke-test-lead-conversion.js https://parentsimple.org`
4. **Done!** ✅

Total time: **~5 minutes**
