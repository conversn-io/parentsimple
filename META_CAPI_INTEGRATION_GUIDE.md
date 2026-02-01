# Meta CAPI Integration Guide - ParentSimple

## Overview

This guide documents the Meta Conversions API (CAPI) implementation for ParentSimple with **separate pixels** for different funnels:

1. **Life Insurance CA Funnel** - Dedicated Meta Pixel
2. **Elite University/College Funnel** - Dedicated Meta Pixel

## Why Separate Pixels?

- **Better Attribution**: Track each funnel's performance independently
- **Audience Segmentation**: Build custom audiences for each product line
- **Campaign Optimization**: Optimize campaigns specific to each funnel
- **Reporting Clarity**: Clear ROI metrics for each vertical

## Environment Variables

Add these to your `.env.local` file:

```bash
# Life Insurance Funnel - Meta Pixel
META_PIXEL_ID_LIFE_INSURANCE=YOUR_LIFE_INSURANCE_PIXEL_ID
META_CAPI_TOKEN_LIFE_INSURANCE=YOUR_LIFE_INSURANCE_ACCESS_TOKEN

# College/University Funnel - Meta Pixel
META_PIXEL_ID_COLLEGE=YOUR_COLLEGE_PIXEL_ID
META_CAPI_TOKEN_COLLEGE=YOUR_COLLEGE_ACCESS_TOKEN

# Meta CAPI Configuration
META_CAPI_VERSION=v18.0

# Optional: Test Event Code (for testing in Events Manager)
META_TEST_EVENT_CODE_LIFE_INSURANCE=TEST12345
META_TEST_EVENT_CODE_COLLEGE=TEST67890
```

## Pixel Installation

### 1. Life Insurance Pixel (Frontend)

Add to `src/app/quiz/life-insurance-ca/layout.tsx` or use GTM:

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID_LIFE_INSURANCE}');
fbq('track', 'PageView');
    `,
  }}
/>
```

### 2. College Pixel (Frontend)

Add to `src/app/quiz/elite-university-readiness/layout.tsx`:

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `
fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID_COLLEGE}');
fbq('track', 'PageView');
    `,
  }}
/>
```

## Key Events to Track

### Life Insurance Funnel Events:
1. **PageView** - Landing page visit
2. **Lead** - Email/phone captured (initial form submission)
3. **CompleteRegistration** - OTP verified, lead sent to GHL
4. **ViewContent** - Quiz results page viewed

### College Funnel Events:
1. **PageView** - Landing page visit  
2. **Lead** - Contact info captured
3. **CompleteRegistration** - OTP verified
4. **ViewContent** - Results page viewed

## Implementation Examples

### Life Insurance - Email Capture

In `/api/leads/capture-email/route.ts`:

```typescript
import { sendLeadEvent, isMetaCAPIConfigured } from '@/lib/meta-capi-service';
import { getMetaCookies } from '@/lib/meta-capi-cookies';

// Determine which pixel to use based on funnel_type
const funnelType = body.funnelType || 'unknown';
const isLifeInsurance = funnelType === 'life_insurance_ca';
const isCollege = funnelType === 'elite_university_readiness';

// Get Meta cookies for deduplication
const metaCookies = body.metaCookies || {};
const { fbp, fbc, fbLoginId } = metaCookies;

// Send Meta CAPI Lead event
if (isMetaCAPIConfigured()) {
  const pixelId = isLifeInsurance 
    ? process.env.META_PIXEL_ID_LIFE_INSURANCE
    : isCollege
    ? process.env.META_PIXEL_ID_COLLEGE
    : undefined;
  
  const accessToken = isLifeInsurance
    ? process.env.META_CAPI_TOKEN_LIFE_INSURANCE
    : isCollege
    ? process.env.META_CAPI_TOKEN_COLLEGE
    : undefined;

  await sendLeadEvent({
    leadId: sessionId || newLead.id.toString(),
    email: email,
    phone: phoneNumber,
    firstName: firstName,
    lastName: lastName,
    fbp: fbp,
    fbc: fbc,
    fbLoginId: fbLoginId,
    ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
    userAgent: req.headers.get('user-agent'),
    eventSourceUrl: `https://parentsimple.org/quiz/${funnelType}`,
    customData: {
      content_name: isLifeInsurance ? 'Life Insurance Lead' : 'College Readiness Lead',
      content_category: isLifeInsurance ? 'life_insurance' : 'education',
      status: 'email_captured',
    },
    options: {
      pixelId,
      accessToken,
    },
  });
}
```

### Complete Registration - OTP Verified

In `/api/leads/verify-otp-and-send-to-ghl/route.ts`:

```typescript
import { 
  createCompleteRegistrationEvent, 
  buildUserData, 
  sendMetaCAPIEvent 
} from '@/lib/meta-capi-service';

// After successful OTP verification and GHL webhook
const funnelType = body.funnelType || 'unknown';
const isLifeInsurance = funnelType === 'life_insurance_ca';
const isCollege = funnelType === 'elite_university_readiness';

const userData = buildUserData({
  email: email,
  phone: phoneNumber,
  first_name: firstName,
  last_name: lastName,
  fbp: metaCookies.fbp,
  fbc: metaCookies.fbc,
  fb_login_id: metaCookies.fbLoginId,
  ip_address: req.headers.get('x-forwarded-for'),
  user_agent: req.headers.get('user-agent'),
});

const event = createCompleteRegistrationEvent({
  leadId: sessionId || leadId.toString(),
  userData,
  customData: {
    content_name: isLifeInsurance ? 'Life Insurance Registration' : 'College Quiz Registration',
    content_category: isLifeInsurance ? 'life_insurance' : 'education',
    status: 'completed',
  },
  eventSourceUrl: `https://parentsimple.org/quiz/${funnelType}/results`,
});

const pixelId = isLifeInsurance 
  ? process.env.META_PIXEL_ID_LIFE_INSURANCE
  : process.env.META_PIXEL_ID_COLLEGE;

const accessToken = isLifeInsurance
  ? process.env.META_CAPI_TOKEN_LIFE_INSURANCE
  : process.env.META_CAPI_TOKEN_COLLEGE;

await sendMetaCAPIEvent(event, { pixelId, accessToken });
```

## Client-Side Cookie Capture

Update your quiz components to capture Meta cookies:

```typescript
import { getMetaCookies } from '@/lib/meta-capi-cookies';

// In your form submission handler
const metaCookies = getMetaCookies();

const response = await fetch('/api/leads/capture-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    // ... other fields
    metaCookies: {
      fbp: metaCookies.fbp,
      fbc: metaCookies.fbc,
      fbLoginId: typeof window !== 'undefined' && (window as any).FB?.getAuthResponse?.()?.userID || null,
    },
  }),
});
```

## Testing

### 1. Enable Test Mode

Set test event codes in your environment:

```bash
META_TEST_EVENT_CODE_LIFE_INSURANCE=TEST12345
META_TEST_EVENT_CODE_COLLEGE=TEST67890
```

### 2. Check Events Manager

1. Go to Meta Events Manager
2. Select your pixel
3. Go to "Test Events" tab
4. You should see events arriving in real-time
5. Verify event parameters match expected values

### 3. Verify Deduplication

Check that:
- `event_id` is consistent between pixel and CAPI
- `fbp` cookie is present in CAPI events
- `fbc` is captured when users click Meta ads

## Monitoring

### Success Indicators:
- ✅ Events appear in Events Manager within 1 minute
- ✅ Event Match Quality Score > 7.0 (ideally 9.0+)
- ✅ Deduplication rate > 90%
- ✅ No errors in Next.js logs

### Common Issues:
- **Low Match Quality**: Missing email, phone, or cookies
- **Duplicate Events**: Missing or inconsistent event_id
- **401 Errors**: Invalid access token
- **400 Errors**: Invalid data format

## Best Practices

1. **Always Capture Cookies**: fbp and fbc are critical for deduplication
2. **Consistent Event IDs**: Use same format between pixel and CAPI
3. **Hash PII**: Service automatically hashes email, phone, names
4. **Include User Agent & IP**: Helps Meta match users
5. **Use Descriptive custom_data**: Helps with reporting and optimization

## Support

For issues:
1. Check Next.js server logs for Meta CAPI errors
2. Verify environment variables are set
3. Test events in Events Manager
4. Check Event Match Quality score

## References

- [Meta Conversions API Docs](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Event Deduplication](https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events)
- [Server Event Parameters](https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/server-event)
