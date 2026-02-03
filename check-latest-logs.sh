#!/bin/bash

# Use the Vercel API to get function logs
SESSION_ID="test-smoke-1769964422005"
LEAD_ID="ca4d49aa-e840-460f-8e13-e0da5ab695f0"

echo "═══════════════════════════════════════════════════════════"
echo "🔍 Checking Meta CAPI Debug Logs"
echo "═══════════════════════════════════════════════════════════"
echo "Lead ID: $LEAD_ID"
echo "Session ID: $SESSION_ID"
echo ""

echo "📊 Checking Supabase for analytics events..."
SUPABASE_URL="https://jqjftrlnyysqcwbbigpw.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxamZ0cmxueXlzcWN3YmJpZ3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTQ2MzksImV4cCI6MjA2Njg3MDYzOX0.ZqgLIflQJY5zC3ZnU5K9k_KEM9bDdNhtqek6ckuwjAo"

curl -s "${SUPABASE_URL}/rest/v1/analytics_events?session_id=eq.${SESSION_ID}&select=event_name,properties&order=created_at.desc" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" | jq '.[] | select(.properties.meta_capi_result or .properties.meta_capi_event_id) | {event_name, meta_capi: .properties}'

echo ""
echo "✅ Check Complete"
echo ""
echo "To view full Vercel logs, visit:"
echo "https://vercel.com/conversns-projects/parentsimple/saPYcZcybUXG4ACw355fsyi1ZVg1"
