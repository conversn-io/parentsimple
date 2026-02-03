# 🔧 Fix Meta CAPI Configuration

## ❌ Current Issue
```
[warning] [Meta CAPI] Meta CAPI not configured: Missing META_PIXEL_ID or META_CAPI_TOKEN
[error] [Meta CAPI] Lead event failed: Meta CAPI not configured: Missing META_PIXEL_ID or META_CAPI_TOKEN
```

## 📋 Required Environment Variables

The Meta Conversions API service (`src/lib/meta-capi-service.ts`) needs these variables:

### Option 1: Standard Names (Recommended)
```bash
META_PIXEL_ID=799755069642014
META_CAPI_TOKEN=<your-meta-capi-access-token>
```

### Option 2: Alternative Names
```bash
NEXT_PUBLIC_META_PIXEL_ID=799755069642014
META_CAPI_ACCESS_TOKEN=<your-meta-capi-access-token>
```

---

## 🔍 Finding Your Meta CAPI Access Token

### Step 1: Access Meta Events Manager
1. Go to https://business.facebook.com/events_manager2/list/pixel
2. Select your ParentSimple Pixel (ID: 799755069642014)

### Step 2: Generate Access Token
1. Go to **Settings** tab
2. Scroll to **Conversions API**
3. Click **Generate Access Token**
4. Copy the token (starts with `EAA...`)

**OR**

### Use System User Token (Recommended for Production)
1. Go to https://business.facebook.com/settings/system-users
2. Select or create a system user
3. Generate token with permissions:
   - `ads_management`
   - `business_management`
4. Assign the user to your Ad Account and Pixel

---

## ⚙️ Add to Vercel

### Method 1: Via Vercel Dashboard
1. Go to https://vercel.com/conversn-io/parentsimple/settings/environment-variables
2. Add these variables:

```bash
# Meta Pixel ID (for ParentSimple)
META_PIXEL_ID=799755069642014

# Meta CAPI Access Token (get from Meta Business Suite)
META_CAPI_TOKEN=EAA...

# Optional: Test Event Code (for debugging)
META_TEST_EVENT_CODE=TEST12345
```

3. Redeploy: `vercel --prod`

### Method 2: Via Vercel CLI
```bash
cd "/Users/funkyfortress/Documents/01-ALL DOCUMENTS/05 - Projects/CallReady/02-Expansion-Operations-Planning/02-Publisher-Platforms/04-ParentSimple"

vercel env add META_PIXEL_ID production
# Paste: 799755069642014

vercel env add META_CAPI_TOKEN production
# Paste: Your access token

vercel --prod
```

---

## ✅ Verify Configuration

After adding the environment variables, test with:

```bash
node smoke-test-lead-conversion.js https://parentsimple.org
```

**Expected Log Output:**
```
✅ Meta CAPI configured
🚀 Sending Lead event to Meta CAPI
✅ Meta CAPI Lead event sent successfully
```

**Check Vercel Logs:**
```bash
vercel logs https://parentsimple.org --follow
```

Look for:
- ✅ `[Meta CAPI] Lead event sent: evt_xxxxx`
- ❌ NOT: `Meta CAPI not configured`

---

## 🔐 Security Notes

1. **Never commit** Meta CAPI tokens to git
2. **Use System User tokens** (not personal user tokens) for production
3. **Rotate tokens** every 60-90 days
4. **Limit permissions** to only what's needed (`ads_management`)

---

## 📊 Test in Meta Events Manager

After configuration:
1. Go to **Test Events** in Events Manager
2. Look for your test event code (if configured)
3. You should see **Server** events appearing
4. Verify event details match your lead data

---

## 🐛 Troubleshooting

### Token Invalid Error
```
Error: (#100) Invalid OAuth 2.0 Access Token
```
**Fix:** Regenerate token in Meta Business Suite

### Pixel Not Found
```
Error: (#803) Cannot find object with Pixel ID
```
**Fix:** Verify Pixel ID is correct: `799755069642014`

### Rate Limiting
```
Error: (#4) Application request limit reached
```
**Fix:** This is normal for high volume. Meta will queue events.

---

## 📖 Documentation

- [Meta Conversions API Docs](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Best Practices](https://developers.facebook.com/docs/marketing-api/conversions-api/best-practices)
- [Event Parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/server-event)

---

**Current Status:** ⚠️ Missing `META_CAPI_TOKEN` environment variable  
**Next Action:** Add token to Vercel and redeploy
