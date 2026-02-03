## Meta CAPI Log Checklist

Use this checklist to confirm Meta CAPI is firing without blocking lead flow.

### 1) Client Payload (Network)
- Verify `metaCookies.fbp` and `metaCookies.fbc` are present in request payloads
- Confirm `metaCookies.fbLoginId` is included when Facebook Login is used
- Ensure payload still includes expected lead fields (email, phone, quiz answers)

### 2) Server Logs (Success Path)
- Look for `[Meta CAPI] Lead event sent:` and an `eventId`
- Confirm the lead still saves to Supabase/DB
- Confirm downstream webhooks (GHL / LeadProsper) still run

### 3) Server Logs (Failure Path)
- If missing env vars: `[Meta CAPI] Meta CAPI not configured`
- If request fails: `[Meta CAPI] Lead event failed:` with error details
- Ensure request still returns success to client

### 4) Meta Events Manager
- If using test events, confirm the event appears within 5 minutes
- Validate event fields (email/phone hashed, fbp/fbc present)

### 5) Smoke Test Checklist
- Submit a test lead with UTM parameters
- Submit a test lead without UTM parameters
- Submit a test lead with OTP (where applicable)
- Submit a test lead without OTP (where applicable)

