# Life Insurance CA - Variant B Redesign (Ultra-Clean)

## Deployment Status

**Status:** ✅ Live in Production  
**URL:** https://parentsimple.org/quiz/life-insurance-ca-b  
**Deployment:** https://vercel.com/conversns-projects/parentsimple/CJ6bqbppP8YTRYXoZrp34NHHUgvN  
**Deployed:** January 24, 2026

---

## Major Changes Summary

### 1. **Removed Navigation Header**
- ❌ ParentSimple logo removed
- ❌ Navigation menu removed
- ✅ Ultra-clean headerless design
- **Technical:** Added `headerType: 'none'` support to `ConditionalHeader`
- **Hook:** Created `useNoHeaderLayout()` for headerless pages

### 2. **Updated Green Social Proof Bar**
- **Old:** "Join 25,000 Ontario Parents Who Just Got Covered Today"
- **New:** "Join 250+ Ontario Parents who got quotes today"
- **Design:** Subtle green background (`bg-green-50`)

### 3. **Reorganized Trust Elements**
- Moved trust pills below province question options
- ❌ Removed inline scroller text ("Join 25,000...")
- ✅ Cleaner spacing and hierarchy

### 4. **Simplified Social Proof Section**
- ✅ Centered "Happy customers" image
- ❌ Removed star ratings (★★★★★)
- **Old:** "4.8 ratings and reviews"
- **New:** "Join 40,000 Canadians who found coverage with us"
- **Design:** Vertical centered layout

### 5. **Added "About ParentSimple" Section**
New informational card explaining:
- ParentSimple is part of **Simple Media Network**
- Offers resources for all aspects of **parenthood journey**
- From **education to financial resources**
- **We don't sell insurance directly**
- **We partner with the best** providers in every area
- Helps parents make **informed decisions**

### 6. **Added Scroll-to-Top Button**
- Appears at bottom of landing page (step 0)
- Blue button with upward arrow icon
- Smooth scroll animation
- Helps users return to province selection

---

## Visual Layout Comparison

### Old Design (Variant B v1)
```
┌─────────────────────────────────────┐
│ [ParentSimple Logo] [Menu]          │ ← Header with navigation
├─────────────────────────────────────┤
│ ⏰ Join 25,000 Ontario Parents...   │ ← Yellow social proof
├─────────────────────────────────────┤
│   Compare Insurance Quotes (H3)     │
│                                     │
│   Which province do you live in?    │
│   [Ontario] [BC] [AB] ...           │
│                                     │
│   ✓ No Health Exam, etc.            │ ← Trust pills
│   Join 25,000 Ontario Parents...    │ ← Inline scroller
│                                     │
│   [Testimonial]                     │
│   [Image + Stars] 4.8 ratings       │ ← Stars + text
└─────────────────────────────────────┘
```

### New Design (Variant B v2 - Current)
```
┌─────────────────────────────────────┐
│ ✓ Join 250+ Ontario Parents who got │ ← Subtle green bar (no header!)
│   quotes today                      │
├─────────────────────────────────────┤
│                                     │
│   Compare Insurance Quotes (H3)     │
│                                     │
│   Which province do you live in?    │
│   [Ontario] [BC] [AB] ...           │
│                                     │
│   ✓ No Health Exam                  │
│   ✓ Low Monthly Premiums            │ ← Trust pills
│   ✓ Best Approvals                  │
│                                     │
│   [Testimonial]                     │
│                                     │
│   [Centered Image]                  │
│   Join 40,000 Canadians who found   │ ← No stars, centered
│   coverage with us                  │
│                                     │
│   ╔═══════════════════════════╗    │
│   ║ About ParentSimple        ║    │ ← NEW section
│   ║ Part of Simple Media...   ║    │
│   ╚═══════════════════════════╝    │
│                                     │
│   [↑ Back to Top]                   │ ← NEW button
└─────────────────────────────────────┘
```

---

## Technical Implementation

### Files Modified

1. **`src/contexts/FooterContext.tsx`**
   - Added `'none'` to `HeaderType` union type
   ```typescript
   type HeaderType = 'standard' | 'funnel' | 'none';
   ```

2. **`src/components/navigation/ConditionalHeader.tsx`**
   - Added support for `headerType === 'none'`
   ```typescript
   if (headerType === 'none') return null;
   ```

3. **`src/hooks/useFunnelFooter.ts`**
   - Created new `useNoHeaderLayout()` hook
   ```typescript
   export const useNoHeaderLayout = () => {
     setHeaderType('none');
     setFooterType('funnel');
   };
   ```

4. **`src/components/quiz/LifeInsuranceCAQuizVariantB.tsx`**
   - Updated to use `useNoHeaderLayout()`
   - Changed green bar text
   - Removed inline scroller
   - Centered social proof image
   - Removed star ratings
   - Updated social proof text
   - Added "About ParentSimple" card
   - Added scroll-to-top button

---

## Design Principles

### Variant B Philosophy: **Ultra-Clean Conversion Focus**

1. **Minimal Distractions**
   - No navigation header
   - No logo to click away
   - Focus entirely on quiz completion

2. **Subtle Trust Building**
   - Soft green social proof bar
   - Lower numbers (250+ vs 25,000) feel more authentic
   - Trust pills positioned after CTA to avoid overwhelming

3. **Transparency & Education**
   - "About ParentSimple" section builds trust
   - Explains we're not selling, we're helping
   - Part of larger network = credibility

4. **Smooth UX**
   - Scroll-to-top button for long pages
   - Centered, balanced layout
   - Clear visual hierarchy

---

## A/B Testing Metrics to Watch

### Primary Metrics
- **Conversion Rate:** (Leads / Sessions) × 100
- **Step 1 Completion:** % who select province
- **Quiz Completion Rate:** % who reach final step

### Secondary Metrics
- **Bounce Rate:** % leaving on landing page
- **Time on Page:** Average time before action
- **Scroll Depth:** How far users scroll
- **Button Interactions:** Scroll-to-top usage

### Hypothesis
**Removing the header will:**
- ✅ Increase conversion rate by reducing exit opportunities
- ✅ Increase focus on province selection (first CTA)
- ✅ Feel less "salesy" and more helpful
- ⚠️ May reduce brand awareness (trade-off)

**More authentic numbers (250+ vs 25,000) will:**
- ✅ Build more trust (less "marketing-y")
- ✅ Feel more believable
- ✅ Align with transparency messaging

**"About ParentSimple" section will:**
- ✅ Build trust through transparency
- ✅ Reduce skepticism about affiliations
- ✅ Position as helpful resource, not sales page

---

## Testing Checklist

### Visual Testing
- [ ] Verify no header appears on `/quiz/life-insurance-ca-b`
- [ ] Green bar shows "Join 250+ Ontario Parents who got quotes today"
- [ ] Trust pills appear below province options
- [ ] No inline scroller text
- [ ] "Happy customers" image is centered
- [ ] No star ratings visible
- [ ] Text reads "Join 40,000 Canadians who found coverage with us"
- [ ] "About ParentSimple" card appears above scroll button
- [ ] "Back to Top" button appears at bottom
- [ ] Button scrolls smoothly to top when clicked

### Functional Testing
- [ ] Quiz functions normally (all steps work)
- [ ] OTP verification works
- [ ] Webhook delivery to GHL + Zapier
- [ ] Tracking events logged to Supabase
- [ ] Meta CAPI events fire correctly
- [ ] Mobile responsive design

### Analytics Verification
- [ ] Session IDs start with `li_ca_b_`
- [ ] Funnel type: `life_insurance_ca_variant_b`
- [ ] Events tracked in Supabase
- [ ] Can filter by variant in queries

---

## Comparison: Control vs Variant B

| Element | Control | Variant B |
|---------|---------|-----------|
| **Header** | ✅ ParentSimple logo + nav | ❌ No header |
| **Social Proof Bar** | Yellow, "25,000 Parents" | Green, "250+ Parents" |
| **Headline** | Large emotional | H3 simple |
| **Trust Pills** | Above question | Below question |
| **Inline Scroller** | ❌ None | ❌ Removed |
| **Social Proof Image** | Left-aligned with text | Centered alone |
| **Star Ratings** | ★★★★☆ 4.8 | ❌ None |
| **Social Proof Text** | "4.8 ratings and reviews" | "Join 40,000 Canadians..." |
| **About Section** | ❌ None | ✅ Added |
| **Scroll Button** | ❌ None | ✅ Added |
| **Overall Vibe** | Professional, branded | Ultra-clean, minimal |

---

## URLs

**Control:**  
https://parentsimple.org/quiz/life-insurance-ca

**Variant B (This Version):**  
https://parentsimple.org/quiz/life-insurance-ca-b

---

## Next Steps

1. **Deploy to Facebook Ads:**
   - Create separate ad set for Variant B
   - Split traffic 50/50 (Control vs Variant B)
   - Run for 2 weeks minimum

2. **Monitor Supabase:**
   ```sql
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
   GROUP BY properties->>'funnel_type';
   ```

3. **Declare Winner:**
   - Need 1,000+ sessions per variant for statistical significance
   - Winner = highest conversion rate + lowest CPL
   - Roll winner to 100% traffic

---

**Variant B v2 is live! Ultra-clean, minimal design focused on conversion. 🚀**
