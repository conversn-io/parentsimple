# Webhook Routing Recommendation - ParentSimple

## Current Situation

**Environment Variable:** `PARENTSIMPLE_ZAPIER_WEBHOOK`  
**Current Behavior:** Sends ALL verified leads from ALL funnels to this webhook
- ✅ Life Insurance CA leads
- ✅ Elite University Readiness leads

**Your Concern:** "Only life insurance goes to this endpoint"

---

## Two Options

### Option A: Make It Life Insurance Specific (Recommended)

**Rename variable to be explicit:**
```bash
OLD: PARENTSIMPLE_ZAPIER_WEBHOOK
NEW: PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK
```

**Update code to only send Life Insurance CA leads:**

```typescript
// In webhook-delivery.ts
const LIFE_INSURANCE_ZAPIER_WEBHOOK = process.env.PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK || '';
const ELITE_UNIVERSITY_ZAPIER_WEBHOOK = process.env.PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK || '';

// Conditional webhook selection based on funnel
function getZapierWebhookUrl(funnelType: string): string | null {
  if (funnelType === 'life_insurance_ca') {
    return LIFE_INSURANCE_ZAPIER_WEBHOOK || null;
  }
  if (funnelType === 'elite_university_readiness') {
    return ELITE_UNIVERSITY_ZAPIER_WEBHOOK || null;
  }
  return null; // Unknown funnel type
}
```

**Benefits:**
- ✅ Clear separation of lead routing
- ✅ Different endpoints for different funnels
- ✅ Can route Elite University leads elsewhere
- ✅ Explicit variable names prevent confusion

**Drawbacks:**
- Requires code changes
- Need to set new environment variables
- More complex webhook logic

---

### Option B: Keep Generic, Rename for Clarity

**Rename variable but keep behavior:**
```bash
OLD: PARENTSIMPLE_ZAPIER_WEBHOOK
NEW: PARENTSIMPLE_ALL_LEADS_ZAPIER_WEBHOOK
```

**Keep current behavior:**
- All funnels go to same endpoint
- Your Zap can route based on `funnelType` field

**Benefits:**
- ✅ Simple - no code changes needed
- ✅ Single endpoint to manage
- ✅ Zap can handle routing logic
- ✅ Easy to understand

**Drawbacks:**
- Elite University leads also go to this endpoint
- Need to filter in Zap if you only want Life Insurance

---

## My Recommendation: Option A (Funnel-Specific)

Since you said "only life insurance goes to this endpoint," I recommend:

### Step 1: Rename Environment Variable

**In Vercel:**
```bash
# Remove old variable
vercel env rm PARENTSIMPLE_ZAPIER_WEBHOOK

# Add new funnel-specific variable
vercel env add PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK
# Value: https://services.leadconnectorhq.com/hooks/rqTRxGq1yRvvDT6axp0M/webhook-trigger/ghPPPrV6ET9lzJ20bSlx
# Environments: Production, Preview, Development
```

### Step 2: Update Code

**File: `src/lib/webhook-delivery.ts`**

Change from:
```typescript
const ZAPIER_WEBHOOK_URL = process.env.PARENTSIMPLE_ZAPIER_WEBHOOK || '';
```

To:
```typescript
// Funnel-specific Zapier webhooks
const LIFE_INSURANCE_ZAPIER_WEBHOOK = process.env.PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK || '';
const ELITE_UNIVERSITY_ZAPIER_WEBHOOK = process.env.PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK || '';

// Get appropriate Zapier webhook based on funnel type
function getZapierWebhookUrl(funnelType: string): string {
  if (funnelType === 'life_insurance_ca') {
    return LIFE_INSURANCE_ZAPIER_WEBHOOK;
  }
  if (funnelType === 'elite_university_readiness') {
    return ELITE_UNIVERSITY_ZAPIER_WEBHOOK;
  }
  return ''; // Unknown funnel - no webhook
}
```

Update `sendLeadToWebhooks` function:
```typescript
export async function sendLeadToWebhooks(
  payload: WebhookPayload,
  isVerified: boolean = true
): Promise<WebhookDeliveryResult> {
  // ... existing code ...
  
  // Get funnel-specific Zapier webhook
  const zapierWebhookUrl = getZapierWebhookUrl(payload.funnelType);
  
  if (!zapierWebhookUrl) {
    console.log(`ℹ️ No Zapier webhook configured for funnel: ${payload.funnelType}`);
  }

  // Send to webhooks
  if (GHL_WEBHOOK_URL) {
    webhookPromises.push(
      sendWebhookWithTimeout(GHL_WEBHOOK_URL, payload, 'GHL')
    );
  }

  if (zapierWebhookUrl) {
    webhookPromises.push(
      sendWebhookWithTimeout(zapierWebhookUrl, payload, 'Zapier')
    );
  }
  
  // ... rest of function ...
}
```

### Step 3: Future-Proof for Elite University

When you're ready to route Elite University leads:
```bash
# Add Elite University Zapier webhook
vercel env add PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK
# Value: <your elite university endpoint>
# Environments: Production, Preview, Development
```

---

## Recommended Variable Naming

### Current (Generic)
```bash
PARENTSIMPLE_ZAPIER_WEBHOOK  # Unclear which funnel
```

### Proposed (Explicit)
```bash
PARENTSIMPLE_LIFE_INSURANCE_ZAPIER_WEBHOOK      # Life Insurance CA only
PARENTSIMPLE_ELITE_UNIVERSITY_ZAPIER_WEBHOOK    # Elite University only
```

### Alternative (If keeping generic)
```bash
PARENTSIMPLE_ALL_LEADS_ZAPIER_WEBHOOK  # All funnels
```

---

## Implementation Code

Would you like me to:

1. ✅ **Update the code** to use funnel-specific webhook variables
2. ✅ **Update environment variable name** in Vercel
3. ✅ **Test** the new routing logic
4. ✅ **Deploy** the changes

Or would you prefer to:

- Keep current behavior (all funnels to same endpoint)
- Just rename variable for clarity
- Handle routing in your Zap instead of in code

**Let me know which approach you prefer and I'll implement it!**
