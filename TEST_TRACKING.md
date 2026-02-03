# Testing PageView and Event Tracking

## Current Status
✅ Deployed enhanced logging to production  
🔍 Deployment: https://parentsimple-7y9r72b69-conversns-projects.vercel.app  
📊 Inspect: https://vercel.com/conversns-projects/parentsimple/8YrSiU8EdWUjBsed1E4oJSB4MKRz

## What Was Added

### Server-Side API Logging (Vercel Logs)
The following API routes now have comprehensive logging:

1. **`/api/analytics/track-pageview`**
   - `📊 PageView Tracking API Called` - When API is hit
   - `📥 PageView Data:` - Full request body
   - `💾 Inserting pageview to analytics_events:` - Before DB insert
   - `✅ PageView saved to Supabase successfully:` - Success with details
   - `❌` prefix - Any errors

2. **`/api/analytics/track-event`**
   - `📊 Analytics Event Tracking API Called`
   - `📥 Event Data:`
   - `💾 Inserting event to analytics_events:`
   - `✅ Event tracked successfully:`

### Client-Side Logging (Browser Console)
Enhanced `temp-tracking.ts` with:
- `🔄 Sending pageview to Supabase API:` - When fetch starts
- `✅ PageView sent to Supabase successfully:` - On success
- `⚠️ Supabase PageView tracking failed:` - On HTTP error
- `❌ Failed to send PageView to Supabase:` - On exception

## How to Test

### 1. Test PageView Tracking

```bash
# Option A: Check live site logs (most recent deployment)
vercel logs https://parentsimple-7y9r72b69-conversns-projects.vercel.app --json | jq 'select(.message | contains("PageView") or contains("📊"))'

# Option B: Check production domain logs
vercel logs parentsimple.org --json | jq 'select(.message | contains("PageView") or contains("📊"))'

# Option C: Simple grep (no jq required)
vercel logs https://parentsimple-7y9r72b69-conversns-projects.vercel.app | grep -E "(PageView|📊|✅|❌)"
```

### 2. Generate Test Traffic

Open these pages in your browser to trigger tracking:
- https://parentsimple.org/
- https://parentsimple.org/quiz/life-insurance-ca
- https://parentsimple.org/quiz/elite-university-readiness

### 3. Check Vercel Dashboard

Visit: https://vercel.com/conversns-projects/parentsimple/8YrSiU8EdWUjBsed1E4oJSB4MKRz

Look for:
- Function logs under "Functions" tab
- Real-time logs showing API calls

### 4. Check Browser Console

Open browser DevTools → Console tab and look for:
- `📊 Tracking page view:` - PageViewTracker component fired
- `🔄 Sending pageview to Supabase API:` - API call initiated
- `✅ PageView sent to Supabase successfully:` - API call succeeded
- `✅ Meta:` - Meta Pixel tracking
- `✅ GA4:` - Google Analytics tracking

## Expected Behavior

### On Every Page Load:
1. **Client-side (Browser Console):**
   ```
   📊 Tracking page view: Home
   🔄 Sending pageview to Supabase API: {...}
   ✅ PageView sent to Supabase successfully: {event_id: "..."}
   ✅ GA4: page_view {...}
   ✅ Meta: PageView {...}
   ```

2. **Server-side (Vercel Logs):**
   ```
   📊 PageView Tracking API Called
   📥 PageView Data: {...}
   💾 Inserting pageview to analytics_events: {...}
   ✅ PageView saved to Supabase successfully: {...}
   ```

### On Quiz Interactions:
1. Quiz start: `quiz_start` event
2. Step views: `quiz_step_viewed` events
3. Email capture: `email_capture` event
4. Form submit: `lead_form_submit` event

## Troubleshooting

### If you see NO logs in Vercel:

**Possible causes:**
1. **Bot detection** - Tracking skips known bots
2. **Ad blockers** - May block tracking requests
3. **CORS issues** - Check network tab for failed requests
4. **Supabase connection** - Check if SUPABASE_QUIZ_URL and SUPABASE_QUIZ_ANON_KEY are set

**Solutions:**
```bash
# Check environment variables
vercel env ls

# Check if variables are set correctly
vercel env pull .env.local
cat .env.local | grep SUPABASE
```

### If you see logs but tracking fails:

Check for:
- `❌ Supabase PageView insert error:` - Database issue
- `⚠️ Supabase not configured` - Missing env vars
- `🤖 Bot detected` - User agent flagged as bot

### If tracking works in browser but not server:

This is **expected behavior**:
- Client-side console.log statements appear in browser console only
- Server-side console.log statements appear in Vercel logs only
- Both should be working independently

## Quick Verification Script

```bash
#!/bin/bash
# test-tracking-now.sh

echo "🧪 Testing ParentSimple Tracking..."
echo ""
echo "1️⃣ Visiting homepage..."
curl -s "https://parentsimple.org/" > /dev/null
sleep 2

echo "2️⃣ Checking Vercel logs (last 2 minutes)..."
vercel logs parentsimple.org --since 2m | grep -E "(📊|PageView|Event)" | head -20

echo ""
echo "✅ Test complete. If you see log entries above, tracking is working!"
echo "If no logs appear, wait 30 seconds and try again (serverless cold start)"
```

## What to Look For in Vercel Logs

### Good Signs ✅
```
📊 PageView Tracking API Called
✅ PageView saved to Supabase successfully
```

### Warning Signs ⚠️
```
⚠️ Missing session_id in pageview request
⚠️ Supabase PageView tracking failed
```

### Error Signs ❌
```
❌ Supabase PageView insert error
❌ PageView Tracking Exception
💥 PageView Tracking Exception
```

## Next Steps

After confirming logs appear:
1. Check Supabase `analytics_events` table for actual data
2. Verify UTM parameters are being captured
3. Test Meta CAPI events (different from pageviews)
4. Test quiz conversion funnel tracking
