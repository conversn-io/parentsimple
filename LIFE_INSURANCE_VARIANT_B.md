# Life Insurance CA - Variant B Landing Page

## Deployment Status

**Status:** ✅ Live in Production  
**Control URL:** https://parentsimple.org/quiz/life-insurance-ca  
**Variant B URL:** https://parentsimple.org/quiz/life-insurance-ca-b  
**Deployment:** https://parentsimple-xds840f1o-conversns-projects.vercel.app  
**Inspect:** https://vercel.com/conversns-projects/parentsimple/8uKQMmnFr8w9gvgFuYgLvS4uA9k6

---

## Design Changes

### Control (Original)

**Landing Page (Step 0):**
```
┌─────────────────────────────────────┐
│ ⏰ Join 25,000 Ontario Parents...  │ ← Yellow social proof banner
├─────────────────────────────────────┤
│                                     │
│  Protect Your Family's Future       │ ← Large headline
│  with up to $2M in Life Insurance   │
│                                     │
│  ✓ No Health Exam                   │
│  ✓ Low Monthly Premiums             │ ← Trust pills
│  ✓ Best Approvals                   │
│                                     │
│  Which province do you live in?     │ ← Question
│  [Ontario] [BC] [AB] ...            │
└─────────────────────────────────────┘
```

### Variant B (New - Modeled after comparemyloans.io)

**Landing Page (Step 0):**
```
┌─────────────────────────────────────┐
│ ⏰ Join 25,000 Ontario Parents...  │ ← Yellow social proof banner (KEPT)
├─────────────────────────────────────┤
│                                     │
│  Compare Insurance Quotes           │ ← Simple text (NEW)
│                                     │
│  ✓ No Health Exam                   │
│  ✓ Low Monthly Premiums             │ ← Trust pills (KEPT)
│  ✓ Best Approvals                   │
│                                     │
│  Which province do you live in?     │ ← Question
│  [Ontario] [BC] [AB] ...            │
└─────────────────────────────────────┘
```

---

## Key Differences

| Element | Control | Variant B |
|---------|---------|-----------|
| **Social Proof Banner** | ✅ Yellow alert bar | ✅ Yellow alert bar (SAME) |
| **Large Headline** | "Protect Your Family's Future..." | ❌ Removed |
| **Top Text** | (none - headline only) | "Compare Insurance Quotes" |
| **Trust Pills** | ✓ 3 pills | ✓ 3 pills (SAME) |
| **Question Display** | Same | Same |
| **Quiz Flow** | Same | Same |
| **Overall Design** | Prominent, emotional | Simple, direct |

---

## What Stays the Same

✅ **All Functionality:**
- Same quiz questions (province, purpose, coverage, age, smoker, gender, best_time, contact)
- Same form validation
- Same OTP verification
- Same webhook delivery (GHL + Zapier)
- Same results page

✅ **Trust Elements:**
- Yellow social proof banner (⏰ Join 25,000 Ontario Parents...)
- Trust pills (No Health Exam, Low Premiums, Best Approvals)

✅ **Tracking:**
- All events tracked
- Supabase analytics
- Meta CAPI
- GA4

**Only Difference:** Landing page design (step 0)

---

## Tracking & Analytics

### Funnel Identification

**Control:**
- Funnel Type: `life_insurance_ca`
- Session ID: `li_ca_TIMESTAMP_RANDOM`
- URL: `/quiz/life-insurance-ca`

**Variant B:**
- Funnel Type: `life_insurance_ca_variant_b`
- Session ID: `li_ca_b_TIMESTAMP_RANDOM`
- URL: `/quiz/life-insurance-ca-b`

### Analytics Queries

**Compare conversion rates:**
```sql
-- Supabase query
SELECT 
  properties->>'funnel_type' as variant,
  COUNT(DISTINCT session_id) as sessions,
  COUNT(DISTINCT CASE WHEN event_name = 'lead_form_submit' THEN session_id END) as conversions,
  ROUND(
    COUNT(DISTINCT CASE WHEN event_name = 'lead_form_submit' THEN session_id END)::numeric / 
    NULLIF(COUNT(DISTINCT session_id), 0) * 100, 
    2
  ) as conversion_rate
FROM analytics_events
WHERE properties->>'funnel_type' IN ('life_insurance_ca', 'life_insurance_ca_variant_b')
  AND created_at > NOW() - INTERVAL '7 days'
GROUP BY properties->>'funnel_type'
ORDER BY conversion_rate DESC;
```

**Compare step completion:**
```sql
-- Average steps completed per variant
SELECT 
  properties->>'funnel_type' as variant,
  AVG((properties->>'step_number')::int) as avg_steps_completed,
  COUNT(*) as total_step_views
FROM analytics_events
WHERE event_name = 'quiz_step_viewed'
  AND properties->>'funnel_type' IN ('life_insurance_ca', 'life_insurance_ca_variant_b')
  AND created_at > NOW() - INTERVAL '7 days'
GROUP BY properties->>'funnel_type';
```

---

## A/B Testing Setup

### Traffic Split Options

**Option 1: Manual Links (Current)**
- Control: Link to `/quiz/life-insurance-ca`
- Variant B: Link to `/quiz/life-insurance-ca-b`
- Split traffic at campaign level (50/50 Facebook ad sets)

**Option 2: Middleware Split (Future)**
- Add middleware to randomly assign users
- Set cookie for sticky assignment
- Automatic 50/50 split

**Option 3: UTM Parameter (Immediate)**
- Control: `?variant=control` → redirects to /quiz/life-insurance-ca
- Variant B: `?variant=variant_b` → redirects to /quiz/life-insurance-ca-b
- Track in UTM parameters

### Recommended: Manual Links (Option 1)

**Facebook Ads Setup:**
```
Ad Set 1: "Life Insurance - Control"
  Landing Page: https://parentsimple.org/quiz/life-insurance-ca
  Budget: 50%

Ad Set 2: "Life Insurance - Variant B"
  Landing Page: https://parentsimple.org/quiz/life-insurance-ca-b
  Budget: 50%
```

**Benefits:**
- Simple to implement
- Easy to control traffic distribution
- Clear separation in analytics
- No middleware complexity

---

## Design Philosophy

### Control: Emotional Appeal
- Large headline: "Protect Your Family's Future"
- Emphasis on family protection
- Emotional connection
- More prominent branding

### Variant B: Direct/Transactional
- Simple text: "Compare Insurance Quotes"
- Emphasis on comparison/value
- Direct call to action
- Modeled after comparemyloans.io
- Less emotional, more practical

**Hypothesis:** Direct, comparison-focused messaging may convert better for price-sensitive shoppers.

---

## Testing Recommendations

### Minimum Sample Size

**To detect 10% lift with 95% confidence:**
- Need: ~1,000 visitors per variant
- Timeline: 2-4 weeks (depending on traffic)
- Split: 50/50

**To detect 20% lift with 95% confidence:**
- Need: ~250 visitors per variant
- Timeline: 1 week
- Split: 50/50

### Metrics to Track

**Primary Metric:**
- Conversion Rate: (Leads / Sessions) × 100

**Secondary Metrics:**
- Quiz completion rate
- Average steps completed
- Time to complete
- Drop-off rates by step
- Cost per lead (CPL)

### Success Criteria

**Variant B wins if:**
- Conversion rate is >10% higher than control
- Statistically significant (p < 0.05)
- Sustained over 2+ weeks
- CPL is equal or lower

---

## URLs

### Control
- **Landing:** https://parentsimple.org/quiz/life-insurance-ca
- **Funnel:** life_insurance_ca
- **Design:** Emotional, family-focused

### Variant B
- **Landing:** https://parentsimple.org/quiz/life-insurance-ca-b
- **Funnel:** life_insurance_ca_variant_b
- **Design:** Simple, comparison-focused

### Shared
- **Results:** Both redirect to same results page (after OTP)
- **Webhook:** Both use PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK
- **GHL:** Both use PARENT_SIMPLE_GHL_WEBHOOK

---

## Next Steps

### Immediate Testing

1. **Visit Variant B:**
   ```bash
   open https://parentsimple.org/quiz/life-insurance-ca-b
   ```

2. **Compare visually:**
   - Open control and variant B side-by-side
   - Verify design differences
   - Check mobile responsiveness

3. **Test functionality:**
   - Complete quiz on variant B
   - Verify all steps work
   - Check OTP verification
   - Confirm webhook delivery

### Launch A/B Test

1. **Create Facebook ad sets:**
   - 50% traffic to control
   - 50% traffic to variant B

2. **Monitor for 2 weeks:**
   - Track conversion rates
   - Compare CPL
   - Check drop-off rates

3. **Declare winner:**
   - Use SQL queries above
   - Make decision based on data
   - Roll winning variant to 100%

---

## Documentation

- `LIFE_INSURANCE_VARIANT_B.md` - This file
- `FUNNEL_WEBHOOKS_DEPLOYED.md` - Webhook routing setup
- `TRACKING_ANALYSIS.md` - GA4/GTM tracking analysis

**Variant B is live and ready for testing! 🚀**
