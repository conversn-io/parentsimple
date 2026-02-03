# ParentSimple GTM Implementation Guide

## Quick Start (15 minutes)

### Step 1: Create GTM Container (5 min)

1. Go to https://tagmanager.google.com/
2. Create new container
   - Name: `www.parentsimple.org`
   - Target platform: Web
3. Note your GTM ID (e.g., `GTM-XXXXXXX`)

### Step 2: Import Configuration (2 min)

1. In GTM, go to **Admin** → **Import Container**
2. Choose file: `PARENTSIMPLE_GTM_CONTAINER.json`
3. Select workspace: Default Workspace
4. Import option: **Merge** (to keep any existing setup)
5. Click **Confirm**

### Step 3: Review & Publish (3 min)

1. Go to **Tags** - verify all tags imported
2. Go to **Triggers** - verify all triggers imported
3. Go to **Variables** - verify all variables imported
4. Click **Submit** → **Publish**
5. Container is now live!

### Step 4: Add GTM to ParentSimple (5 min)

**Option A: Environment Variable (Recommended)**

Add to `.env.local`:
```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

Add to Vercel:
```bash
vercel env add NEXT_PUBLIC_GTM_ID
# Enter value: GTM-XXXXXXX
# Select environments: Production, Preview, Development
```

**Option B: Hardcode (Quick Test)**

Update `src/app/layout.tsx` directly (line ~96):
```typescript
// Replace the GTM script with:
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-XXXXXXX');
    `
  }}
/>
```

---

## Full Implementation (Hybrid Approach)

### Why Hybrid?

**Keep existing direct tracking** (temp-tracking.ts, unified-tracking.ts)
- ✅ Proven, working
- ✅ Can't be blocked by ad blockers (partially)
- ✅ Supabase tracking always works

**Add GTM dataLayer** (new)
- ✅ Flexible pixel management (add/remove without code)
- ✅ A/B testing pixels
- ✅ Better event debugging (GTM Preview mode)
- ✅ Easier for marketing team to manage tags

### File Structure

```
src/
├── lib/
│   ├── temp-tracking.ts          # Existing (keep)
│   ├── unified-tracking.ts       # Existing (keep)  
│   └── gtm-tracking.ts           # NEW (add)
└── app/
    └── layout.tsx                # Update (add GTM code)
```

### Implementation Code

**File 1: src/lib/gtm-tracking.ts** (NEW)

```typescript
/**
 * ParentSimple Google Tag Manager Integration
 * Complements existing direct tracking with dataLayer
 */

declare global {
  interface Window {
    dataLayer: any[];
  }
}

// Initialize dataLayer if not exists
export function initializeDataLayer(): void {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    console.log('✅ GTM dataLayer initialized');
  }
}

// Push event to dataLayer
function pushToDataLayer(eventData: Record<string, any>): void {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(eventData);
    console.log('📊 GTM dataLayer:', eventData.event, eventData);
  }
}

/**
 * Track quiz start to GTM
 */
export function trackQuizStartGTM(
  sessionId: string,
  quizType: string,
  funnelType: string
): void {
  pushToDataLayer({
    event: 'quiz_start',
    session_id: sessionId,
    quiz_type: quizType,
    funnel_type: funnelType,
    event_category: 'quiz'
  });
}

/**
 * Track quiz step viewed to GTM
 */
export function trackQuizStepViewedGTM(
  stepNumber: number,
  stepName: string,
  sessionId: string,
  funnelType: string
): void {
  pushToDataLayer({
    event: 'quiz_step_viewed',
    step_number: stepNumber,
    step_name: stepName,
    session_id: sessionId,
    funnel_type: funnelType,
    event_category: 'quiz'
  });
}

/**
 * Track question answer to GTM
 */
export function trackQuestionAnswerGTM(
  questionId: string,
  questionText: string,
  answerValue: any,
  questionNumber: number,
  sessionId: string,
  funnelType: string
): void {
  pushToDataLayer({
    event: 'question_answer',
    question_id: questionId,
    question_text: questionText,
    answer_value: String(answerValue),
    question_number: questionNumber,
    session_id: sessionId,
    funnel_type: funnelType,
    event_category: 'quiz'
  });
}

/**
 * Track lead form submit to GTM
 */
export function trackLeadFormSubmitGTM(
  sessionId: string,
  leadScore: number | undefined,
  funnelType: string,
  eventCategory: string,
  eventLabel: string,
  value: number,
  graduationYear?: string,
  gpa?: string,
  householdIncome?: string
): void {
  pushToDataLayer({
    event: 'lead_form_submit',
    session_id: sessionId,
    lead_score: leadScore || 0,
    funnel_type: funnelType,
    event_category: eventCategory,
    event_label: eventLabel,
    value: value,
    // ParentSimple-specific parameters
    graduation_year: graduationYear || '',
    gpa: gpa || '',
    household_income: householdIncome || ''
  });
}

/**
 * Track quiz complete to GTM
 */
export function trackQuizCompleteGTM(
  sessionId: string,
  quizType: string,
  funnelType: string,
  completionTime: number,
  leadScore?: number
): void {
  pushToDataLayer({
    event: 'quiz_complete',
    session_id: sessionId,
    quiz_type: quizType,
    funnel_type: funnelType,
    completion_time: completionTime,
    lead_score: leadScore || 0,
    event_category: 'quiz'
  });
}
```

**File 2: src/lib/unified-tracking.ts** (UPDATE)

Add GTM imports at top:
```typescript
import * as GTM from './gtm-tracking';
```

Update `trackQuizStart`:
```typescript
export function trackQuizStart(...) {
  // Existing code (keep)
  trackGA4Event('quiz_start', {...});
  
  // NEW: Add GTM dataLayer
  GTM.trackQuizStartGTM(sessionId, quizType, funnelType);
  
  // Existing Supabase (keep)
  sendToSupabase({...});
}
```

Update `trackQuizStepViewed`:
```typescript
export function trackQuizStepViewed(...) {
  // Existing code (keep)
  trackGA4Event('quiz_step_viewed', {...});
  
  // NEW: Add GTM dataLayer
  GTM.trackQuizStepViewedGTM(stepNumber, stepName, sessionId, funnelType);
  
  // Existing Supabase (keep)
  sendToSupabase({...});
}
```

Repeat for other tracking functions...

**File 3: src/app/layout.tsx** (UPDATE)

Find the existing GTM code (around line 96) and ensure it uses the env var:

```tsx
{/* Google Tag Manager */}
{process.env.NEXT_PUBLIC_GTM_ID && (
  <script
    dangerouslySetInnerHTML={{
      __html: `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
      `
    }}
  />
)}
```

Add noscript in body:
```tsx
{/* Google Tag Manager (noscript) */}
{process.env.NEXT_PUBLIC_GTM_ID && (
  <noscript>
    <iframe 
      src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
      height="0" 
      width="0" 
      style={{display:'none',visibility:'hidden'}}
    />
  </noscript>
)}
```

---

## Testing Checklist

### Test 1: GTM Preview Mode

1. In GTM, click **Preview**
2. Enter URL: `https://parentsimple.org/quiz/elite-university-readiness`
3. GTM debugger opens in new window
4. Take quiz and check:
   - ✅ `quiz_start` event fires
   - ✅ `quiz_step_viewed` fires on each step
   - ✅ `question_answer` fires on each answer
   - ✅ `lead_form_submit` fires on form completion
   - ✅ `quiz_complete` fires at end

### Test 2: GA4 DebugView

1. Open Chrome DevTools → Console
2. Look for GTM dataLayer logs: `📊 GTM dataLayer: quiz_start`
3. Open GA4 → Reports → Realtime → DebugView
4. Take quiz and verify events appear in GA4

### Test 3: Verify No Duplicates

Check GA4 Realtime report:
- Should see **1** `quiz_start` per quiz (not 2)
- Should see **1** `quiz_step_viewed` per step (not 2)
- Should see **1** `lead_form_submit` per lead (not 2)

If you see duplicates:
1. Check GTM tags - make sure they fire only once
2. Check if direct gtag() calls are still active
3. Consider removing direct gtag() calls (keep Supabase)

### Test 4: Check Supabase

```sql
-- Run in Supabase SQL Editor
SELECT 
  event_name,
  COUNT(*) as count,
  MAX(created_at) as last_event
FROM analytics_events
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY event_name
ORDER BY last_event DESC;
```

Should see:
- ✅ `page_view` events
- ✅ `quiz_start` events
- ✅ `quiz_step_viewed` events
- ✅ `question_answer` events
- ✅ `lead_form_submit` events

---

## Troubleshooting

### Issue: GTM not loading

**Symptoms:** No GTM debugger, no events in GA4

**Solutions:**
1. Check NEXT_PUBLIC_GTM_ID is set in Vercel
2. View page source, search for "GTM-" - should see your GTM ID
3. Check browser console for GTM errors
4. Disable ad blockers (they block GTM)

### Issue: Events not firing

**Symptoms:** GTM loads, but events don't fire

**Solutions:**
1. Check GTM Preview mode - see which events fire
2. Check browser console for dataLayer logs
3. Verify triggers are configured correctly in GTM
4. Check if event names match exactly (case-sensitive)

### Issue: Duplicate events in GA4

**Symptoms:** 2x `quiz_start`, 2x `lead_form_submit`

**Solutions:**
1. GTM and direct gtag() both sending to GA4
2. Option A: Remove direct gtag() calls from temp-tracking.ts
3. Option B: Configure GTM tag to not fire if already sent
4. Option C: Keep both (not recommended)

### Issue: Some events work, others don't

**Symptoms:** `quiz_start` works, `quiz_step_viewed` doesn't

**Solutions:**
1. Check if GTM dataLayer calls are being made (browser console)
2. Check GTM Preview to see which triggers fire
3. Verify trigger configuration matches event name exactly
4. Check if components are calling the GTM tracking functions

---

## Current vs Target State

### Before GTM Implementation

```
User Action → Component
             ↓
         temp-tracking.ts
             ↓
    ┌────────┴────────┐
    ↓                 ↓
window.gtag()    window.fbq()
    ↓                 ↓
  GA4              Meta Pixel
    
AND separately:
    
unified-tracking.ts
    ↓
Supabase API
    ↓
analytics_events table
```

### After GTM Implementation (Hybrid)

```
User Action → Component
             ↓
    ┌────────┴────────┐
    ↓                 ↓
temp-tracking.ts  gtm-tracking.ts (NEW)
    ↓                 ↓
window.gtag()    dataLayer.push()
    ↓                 ↓
   GA4              GTM Container
   (fallback)           ↓
                   ┌────┴────┐
                   ↓         ↓
                  GA4     Meta Pixel
                         + others

AND (unchanged):

unified-tracking.ts
    ↓
Supabase API
    ↓
analytics_events table
```

**Benefits:**
- ✅ GTM manages pixels (no code deploys)
- ✅ Direct tracking as fallback (reliability)
- ✅ Supabase always tracks (audit trail)
- ✅ Easy A/B testing (GTM variables)
- ✅ Marketing can add pixels independently

---

## FAQ

**Q: Will this break existing tracking?**
A: No. We're adding GTM on top, not replacing anything.

**Q: Should we remove direct gtag() calls?**
A: Optional. Keep them as fallback initially. Remove after GTM proven working.

**Q: What about Meta CAPI (server-side)?**
A: Keep it. GTM handles client-side Meta Pixel only.

**Q: Do we need GTM for Supabase tracking?**
A: No. Supabase tracking is independent and should always stay.

**Q: Can marketing team manage tags without developer?**
A: Yes! That's the main benefit. They can add/remove pixels in GTM.

**Q: What if GTM is blocked by ad blockers?**
A: Direct tracking (gtag/fbq) works as fallback. Supabase always works.

**Q: How do we A/B test pixels?**
A: Use GTM variables to control which tags fire for which users.

---

## Next Steps

1. ✅ Review `TRACKING_ANALYSIS.md`
2. Create GTM container in Google Tag Manager
3. Import `PARENTSIMPLE_GTM_CONTAINER.json`
4. Add NEXT_PUBLIC_GTM_ID to Vercel environment variables
5. Create `src/lib/gtm-tracking.ts`
6. Update `src/lib/unified-tracking.ts` to call GTM functions
7. Test in GTM Preview mode
8. Deploy to production
9. Monitor GA4 and Supabase for event accuracy
10. Optional: Remove direct gtag() calls after 1 week if GTM working perfectly

---

## Support

If you encounter issues:
1. Check GTM Preview mode first
2. Review browser console for dataLayer logs
3. Verify triggers and variables in GTM
4. Check GA4 DebugView for event receipt
5. Query Supabase analytics_events table

**Remember:** Supabase tracking is your source of truth. Even if GTM/GA4 have issues, Supabase will capture everything.
