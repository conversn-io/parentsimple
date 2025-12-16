# Tracking Implementation - ParentSimple

## ✅ Status: Implemented

Meta Pixel and Google Analytics 4 (GA4) tracking have been implemented using the same configuration as SeniorSimple.

## 📊 Tracking IDs

### Google Analytics 4 (GA4)
- **Measurement ID:** `G-ZC29XQ0W2J`
- **Implementation:** Direct gtag.js (synchronous loading)
- **Location:** `src/app/layout.tsx` in `<head>` section

### Meta Pixel
- **Pixel ID:** `799755069642014`
- **Implementation:** Direct fbq.js with bot detection
- **Location:** `src/app/layout.tsx` in `<head>` section

## 🔧 Implementation Details

### GA4 Configuration
- Uses Google's `gtag.js` library
- Synchronous initialization for immediate availability
- Tracks page views automatically
- `window.gtag` function available immediately on page load

### Meta Pixel Configuration
- Uses Facebook's `fbevents.js` library
- Bot detection to prevent tracking crawlers
- Tracks PageView events automatically
- Includes noscript fallback for users with JavaScript disabled

## 🎯 Features

### Bot Detection
Both tracking scripts include bot detection to:
- Prevent tracking of search engine crawlers
- Reduce false analytics data
- Improve data quality

**Detected Bots:**
- Googlebot, Bingbot, Slurp, DuckDuckBot
- Baiduspider, YandexBot, Sogou, Exabot
- Facebook crawlers, IA archiver
- Generic bots, crawlers, spiders

### Tracking Events
- **PageView:** Automatically tracked on every page load
- **Custom Events:** Can be added via `window.gtag()` and `window.fbq()`

## 📝 Usage

### GA4 Event Tracking
```javascript
// Track custom event
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('event', 'event_name', {
    event_category: 'category',
    event_label: 'label',
    value: 1
  });
}
```

### Meta Pixel Event Tracking
```javascript
// Track custom event
if (typeof window !== 'undefined' && window.fbq) {
  window.fbq('track', 'EventName', {
    content_name: 'Content Name',
    content_category: 'Category'
  });
}
```

## ✅ Verification

### Check GA4
1. Open browser console
2. Type: `typeof window.gtag`
3. Should return: `"function"`

### Check Meta Pixel
1. Open browser console
2. Type: `typeof window.fbq`
3. Should return: `"function"`

### Browser DevTools
1. Open Network tab
2. Filter by "gtag" or "fbevents"
3. Should see requests to:
   - `googletagmanager.com/gtag/js?id=G-ZC29XQ0W2J`
   - `connect.facebook.net/en_US/fbevents.js`

## 🔍 Testing

### Test in Browser Console
```javascript
// Test GA4
console.log('GA4 Available:', typeof window.gtag !== 'undefined');

// Test Meta Pixel
console.log('Meta Pixel Available:', typeof window.fbq !== 'undefined');

// Test PageView tracking
if (window.gtag) {
  window.gtag('event', 'test_event', { test: true });
}

if (window.fbq) {
  window.fbq('track', 'TestEvent', { test: true });
}
```

## 📊 Analytics Dashboards

### Google Analytics 4
- Dashboard: https://analytics.google.com/
- Property: ParentSimple (G-ZC29XQ0W2J)
- Real-time reports available immediately

### Meta Pixel
- Dashboard: https://business.facebook.com/events_manager2
- Pixel ID: 799755069642014
- Events Manager shows real-time activity

## 🎯 Configuration Match

This implementation matches SeniorSimple's tracking configuration:
- ✅ Same GA4 implementation (direct gtag.js)
- ✅ Same Meta Pixel implementation (direct fbq.js)
- ✅ Same bot detection logic
- ✅ Same synchronous loading approach
- ✅ Same noscript fallback

## 📚 References

- GA4 Documentation: https://developers.google.com/analytics/devguides/collection/gtagjs
- Meta Pixel Documentation: https://developers.facebook.com/docs/meta-pixel



