# Life Insurance CA - Variant Swap

## Summary

**Date:** February 4, 2026  
**Action:** Swapped Life Insurance CA control and Variant B  
**Reason:** Variant B design performed better, promoted to control

---

## What Changed

### Control URL: `/quiz/life-insurance-ca`

**Before (Old Control):**
- Header with ParentSimple logo
- 2-column province grid
- Lucide React icons
- Static insurer logos in footer
- Large headline: "Protect Your Family's Future..."
- funnel_type: `life_insurance_ca`

**After (New Control - Promoted from Variant B):**
- ✅ No header (headerless design)
- ✅ Single column province layout
- ✅ Emojis instead of Lucide icons
- ✅ Scrolling insurer logo marquee
- ✅ Trustpilot rating (25% larger, transparent bg)
- ✅ Simple headline: "Compare Insurance Quotes"
- ✅ Transparent About section
- ✅ funnel_type: `life_insurance_ca`

---

### Variant B URL: `/quiz/life-insurance-ca-b`

**Before (Variant B):**
- No header
- Single column layout
- Emojis
- Scrolling logos
- Trustpilot rating
- funnel_type: `life_insurance_ca_variant_b`

**After (New Variant B - Old Control):**
- Header with logo/navigation
- 2-column province grid
- Lucide React icons
- Static insurer logos
- Large emotional headline
- funnel_type: `life_insurance_ca_variant_b`

---

## Design Comparison

### New Control Features (Formerly Variant B)

```
┌─────────────────────────────────────┐
│ ✓ Join 250+ Ontario Parents...     │ ← Subtle green bar (NO HEADER!)
├─────────────────────────────────────┤
│   Compare Insurance Quotes (H3)     │
│                                     │
│   Which province do you live in?    │
│   📍 Ontario                        │ ← Single column with emojis
│   📍 British Columbia               │
│   📍 Alberta                        │
│   ... (8 provinces)                 │
│                                     │
│   ✓ No Health Exam, etc.            │ ← Trust pills
│                                     │
│   [Scrolling Logos Animation]       │ ← Animated marquee
│                                     │
│   😊 Happy customers image          │
│   Join 40,000 Canadians...          │
│   [Trustpilot Rating - Large]       │ ← 25% bigger, transparent
│   💬 Michael T. testimonial         │
│   ⬆️ Back to Top                    │
│   About ParentSimple (transparent)  │
└─────────────────────────────────────┘
```

### New Variant B Features (Formerly Control)

```
┌─────────────────────────────────────┐
│ [ParentSimple Logo] [Menu]          │ ← Header with navigation
├─────────────────────────────────────┤
│ ⏰ Join 25,000 Ontario Parents...   │ ← Yellow alert bar
├─────────────────────────────────────┤
│   Protect Your Family's Future      │ ← Large emotional headline
│   with up to $2M in Life Insurance  │
│                                     │
│   ✓ No Health Exam, etc.            │ ← Trust pills at top
│                                     │
│   Which province do you live in?    │
│   [ON] [BC]                         │ ← 2-column grid with Lucide icons
│   [AB] [SK]                         │
│   ... (8 provinces)                 │
│                                     │
│   [Testimonial]                     │
│   [Static Logos in Footer]          │ ← Non-animated
└─────────────────────────────────────┘
```

---

## Key Differences Summary

| Feature | New Control (Promoted B) | New Variant B (Old Control) |
|---------|-------------------------|----------------------------|
| **Header** | ❌ None | ✅ Logo + Navigation |
| **Social Proof Bar** | Green, subtle | Yellow, bold |
| **Headline** | Simple "Compare Quotes" | Emotional "Protect Family" |
| **Province Layout** | Single column | 2-column grid |
| **Icons** | 📍 Emojis | Lucide React icons |
| **Insurer Logos** | Animated marquee | Static footer |
| **Trustpilot** | ✅ Large, prominent | ❌ None |
| **About Section** | Transparent | White card |
| **Overall Vibe** | Ultra-clean, minimal | Professional, branded |

---

## Tracking & Analytics

### Funnel Types (Unchanged)

**Control:**
- URL: `/quiz/life-insurance-ca`
- Funnel Type: `life_insurance_ca`
- Session ID: `li_ca_TIMESTAMP_RANDOM`

**Variant B:**
- URL: `/quiz/life-insurance-ca-b`
- Funnel Type: `life_insurance_ca_variant_b`
- Session ID: `li_ca_b_TIMESTAMP_RANDOM`

### Analytics Queries

```sql
-- Compare conversion rates (same query works before/after swap)
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

---

## Impact

### Before Swap
- **Control** got majority traffic (direct links, campaigns)
- **Variant B** got A/B test traffic only
- Old design was the primary experience

### After Swap
- **New control** (clean design) gets majority traffic
- **New Variant B** (old design) available for comparison
- Clean, minimal design is now primary experience

---

## Deployment

**Status:** ✅ Live in Production

**Deployment:**
- URL: https://parentsimple-mkh42ak3d-conversns-projects.vercel.app
- Inspect: https://vercel.com/conversns-projects/parentsimple/C5m8xEaFsVYKYhH2pLRBHp5ATTou
- Commit: `538b585`
- Date: February 4, 2026

---

## URLs

### Control (New - Formerly Variant B)
**URL:** https://parentsimple.org/quiz/life-insurance-ca

**Features:**
- Headerless
- Emojis
- Scrolling logos
- Trustpilot
- Single column

### Variant B (Old Control)
**URL:** https://parentsimple.org/quiz/life-insurance-ca-b

**Features:**
- With header
- Lucide icons
- Static logos
- 2-column grid
- Emotional headline

---

## Testing Checklist

After swap, verify:
- ✅ `/quiz/life-insurance-ca` shows clean design (no header, emojis, scrolling logos)
- ✅ `/quiz/life-insurance-ca-b` shows old design (with header, Lucide icons, 2-column)
- ✅ All quiz steps work on both variants
- ✅ OTP verification works
- ✅ Webhooks deliver to GHL + Zapier
- ✅ Meta CAPI fires correctly
- ✅ Analytics track with correct funnel_type

---

## Reason for Swap

**Performance Data Suggested:**
- Variant B had better conversion metrics
- Cleaner design tested better
- Headerless reduced bounce rate
- Emojis more engaging than icons
- Trustpilot increased trust

**Decision:** Promote Variant B to control to maximize conversions

---

## Rollback Plan

If needed, can swap back by running:
```bash
cd src/components/quiz
cp LifeInsuranceCAQuiz.tsx temp.tsx
cp LifeInsuranceCAQuizVariantB.tsx LifeInsuranceCAQuiz.tsx
cp temp.tsx LifeInsuranceCAQuizVariantB.tsx
rm temp.tsx
```

Then update function names and funnel_type values back.

---

**Variant swap complete! Clean design is now the primary Life Insurance CA experience. 🚀**
