# ParentSimple Tracking Implementation Status
**Date:** February 1, 2026

## ✅ TRACKING NOW LIVE

### Implemented Quizzes

#### 1. ✅ Life Insurance CA Quiz (`LifeInsuranceCAQuiz.tsx`)
**Status:** Tracking FULLY implemented (January 31, 2026)

**Events Tracked:**
- ✅ `quiz_start` - When quiz loads
- ✅ `quiz_step_viewed` - Every step view
- ✅ `question_answer` - Every answer selection
- ✅ `email_capture` - Contact form submission
- ✅ `lead_form_submit` - Full lead submission

**Tracking Library:** `unified-tracking.ts`

**Funnel Type:** `life_insurance_ca`

**Implementation Details:**
```tsx
// Quiz start (on mount)
trackQuizStart(sessionId, 'life_insurance_ca')

// Step views (on step change)
trackQuizStepViewed(step + 1, stepId, sessionId, 'life_insurance_ca', previousStep, TOTAL_STEPS)

// Province selection
trackQuestionAnswer('province', value, 1, TOTAL_STEPS, sessionId, 'life_insurance_ca')

// Multiple choice answers
trackQuestionAnswer(questionId, value, step + 1, TOTAL_STEPS, sessionId, 'life_insurance_ca')

// Contact form submission
trackEmailCapture(email, sessionId, 'life_insurance_ca')
trackLeadFormSubmit(sessionId, 'life_insurance_ca', fullAnswers)
```

#### 2. ✅ FIA Quote Quiz (`FIAQuoteQuiz.tsx`)
**Status:** Tracking already implemented (using `temp-tracking.ts`)

**Events Tracked:**
- ✅ `quiz_start`
- ✅ `question_answer`
- ✅ `quiz_complete`
- ✅ `lead_form_submit`

**Funnel Type:** `fia_quote`

#### 3. ✅ Annuity Quiz (`AnnuityQuiz.tsx`)
**Status:** Tracking already implemented (using `temp-tracking.ts`)

**Events Tracked:**
- ✅ `quiz_start`
- ✅ `question_answer`
- ✅ `quiz_complete`
- ✅ `lead_form_submit`

**Funnel Type:** `medicare` (or annuity-specific)

#### 4. ✅ Elite University Readiness Quiz (`EliteUniversityReadinessQuiz.tsx`)
**Status:** Tracking already implemented

**Events Tracked:**
- ✅ `quiz_start`
- ✅ `question_answer`
- ✅ `quiz_complete`

---

## 📊 What Data Gets Tracked

### Event Structure (Supabase `analytics_events` table)

```typescript
{
  event_name: 'question_answer',
  properties: {
    site_key: 'parentsimple.org',
    question_id: 'province',
    answer: 'Ontario',
    step: 1,
    total_steps: 7,
    progress_percentage: 14,
    funnel_type: 'life_insurance_ca',
    utm_parameters: { ... }
  },
  session_id: 'li_ca_1738454400_abc123',
  user_id: 'li_ca_1738454400_abc123',
  page_url: 'https://parentsimple.org/quiz/life-insurance-ca',
  referrer: 'https://google.com',
  user_agent: 'Mozilla/5.0...',
  event_category: 'quiz',
  event_label: 'life_insurance_ca',
  utm_source: 'facebook',
  utm_medium: 'cpc',
  utm_campaign: 'life_insurance_ca_jan_2026',
  created_at: '2026-01-31T12:00:00.000Z'
}
```

### Key Fields for Analysis

1. **Session Tracking:**
   - `session_id` - Unique per quiz session
   - `user_id` - Same as session_id

2. **Event Identification:**
   - `event_name` - Type of event (quiz_start, question_answer, etc.)
   - `event_label` - Usually the funnel_type

3. **Quiz Context:**
   - `properties.funnel_type` - Which quiz (life_insurance_ca, fia_quote, etc.)
   - `properties.step` - Current step number
   - `properties.question_id` - Question identifier
   - `properties.answer` - User's answer

4. **Attribution:**
   - `utm_source`, `utm_medium`, `utm_campaign` - Traffic source
   - `properties.utm_parameters` - Full UTM object

5. **Page Context:**
   - `page_url` - Full URL with domain
   - `referrer` - Where user came from

---

## 🔍 Analytics Queries

### Find Non-Converted Users (Yesterday)

```sql
SELECT 
  session_id,
  properties->>'question_id' as question_id,
  properties->>'answer' as answer,
  properties->>'step' as step,
  created_at
FROM analytics_events
WHERE 
  created_at >= CURRENT_DATE - INTERVAL '1 day'
  AND created_at < CURRENT_DATE
  AND event_name = 'question_answer'
  AND (page_url LIKE '%parentsimple%' OR properties->>'site_key' = 'parentsimple.org')
  AND user_id NOT LIKE '%test%'
  AND NOT EXISTS (
    SELECT 1 FROM analytics_events ae
    WHERE ae.session_id = analytics_events.session_id
    AND ae.event_name IN ('webhook_delivery', 'lead_form_submit', 'quiz_complete')
  )
ORDER BY created_at DESC;
```

**See:** `ANALYTICS_QUERIES.sql` for 7 comprehensive analysis queries

---

## 🚀 Testing the Implementation

### 1. Check Events Are Being Created

```sql
-- Recent events from last hour
SELECT 
  event_name,
  properties->>'funnel_type' as funnel,
  properties->>'step' as step,
  created_at
FROM analytics_events
WHERE 
  page_url LIKE '%parentsimple%'
  AND created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

### 2. Test a Complete Flow

1. Visit: `https://parentsimple.org/quiz/life-insurance-ca`
2. Answer all questions
3. Submit contact form
4. Check Supabase for session events:

```sql
SELECT 
  event_name,
  properties->>'step' as step,
  properties->>'question_id' as question,
  created_at
FROM analytics_events
WHERE session_id = 'YOUR_SESSION_ID'
ORDER BY created_at ASC;
```

Expected events:
1. `quiz_start`
2. `quiz_step_viewed` (step 1)
3. `question_answer` (province)
4. `quiz_step_viewed` (step 2)
5. `question_answer` (purpose)
6. ... (repeat for each step)
7. `email_capture`
8. `lead_form_submit`

---

## 📝 Notes

### Tracking Libraries

**Two tracking libraries exist:**
1. `unified-tracking.ts` - New standardized version (used by LifeInsuranceCAQuiz)
2. `temp-tracking.ts` - Older version (used by FIAQuoteQuiz, AnnuityQuiz)

**Both write to the same Supabase table**, so all events are captured consistently.

### Session IDs

Different prefixes by quiz:
- Life Insurance CA: `li_ca_...`
- FIA Quote: Generated by component
- Annuity: Generated by component

### Data Exclusions

To exclude test data, queries should filter:
```sql
AND user_id NOT LIKE '%test%'
AND user_id NOT LIKE '%smoke%'
AND page_url NOT LIKE '%test%'
AND COALESCE(properties->>'test_submission', 'false') = 'false'
```

---

## ✅ What's Working Now

With today's implementation:

1. **✅ Life Insurance CA quiz** tracks all user interactions
2. **✅ Events flow to Supabase** (`analytics_events` table)
3. **✅ Non-converted user queries** work (once traffic resumes)
4. **✅ Step-by-step dropoff analysis** is possible
5. **✅ UTM attribution** is captured
6. **✅ Session journey tracking** is available

---

## 🎯 Next Steps (Optional)

1. **Consolidate tracking libraries** - Migrate FIA/Annuity quizzes to `unified-tracking.ts`
2. **Add conversion tracking** - Track successful OTP verification
3. **Dashboard setup** - Build Supabase dashboard for real-time analytics
4. **Automated alerts** - Set up notifications for conversion drops

---

## 📚 Related Files

- **Tracking Libraries:**
  - `/src/lib/unified-tracking.ts` - New standardized tracking
  - `/src/lib/temp-tracking.ts` - Legacy tracking (still functional)
  
- **Quiz Components:**
  - `/src/components/quiz/LifeInsuranceCAQuiz.tsx` - ✅ Tracking implemented
  - `/src/components/quiz/FIAQuoteQuiz.tsx` - ✅ Already has tracking
  - `/src/components/quiz/AnnuityQuiz.tsx` - ✅ Already has tracking
  - `/src/components/quiz/EliteUniversityReadinessQuiz.tsx` - ✅ Already has tracking

- **Analytics Queries:**
  - `ANALYTICS_QUERIES.sql` - 7 comprehensive queries
  - `DEBUG_ANALYTICS.sql` - Diagnostic queries
  - `QUICK_DEBUG.sql` - Quick health check

- **API Routes:**
  - `/src/app/api/analytics/track-event/route.ts` - Server-side event ingestion

- **Documentation:**
  - `PARENTSIMPLE_WEBHOOK_TRACKING_IMPLEMENTATION.md`
  - `TRACKING_VERIFICATION.md`
  - `IMPLEMENTATION_SUMMARY.md`

---

**Status:** ✅ READY FOR PRODUCTION

When traffic resumes, all quiz interactions will be tracked and queryable for analysis.
