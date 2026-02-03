#!/bin/bash

SESSION_ID="test-smoke-1769963466554"
SUPABASE_URL="https://jqjftrlnyysqcwbbigpw.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxamZ0cmxueXlzcWN3YmJpZ3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTQ2MzksImV4cCI6MjA2Njg3MDYzOX0.ZqgLIflQJY5zC3ZnU5K9k_KEM9bDdNhtqek6ckuwjAo"

echo "═══════════════════════════════════════════════════════════"
echo "🔍 Checking Meta CAPI Event Status"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📊 Session: $SESSION_ID"
echo ""

echo "1️⃣ Lead Details:"
curl -s "${SUPABASE_URL}/rest/v1/leads?session_id=eq.${SESSION_ID}&select=id,funnel_type,status,is_verified,created_at" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" | jq '.'

echo ""
echo "2️⃣ Analytics Events (checking for meta_capi in properties):"
curl -s "${SUPABASE_URL}/rest/v1/analytics_events?session_id=eq.${SESSION_ID}&select=event_name,properties&order=created_at.desc" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" | jq '.[] | {event_name, meta_capi_result: .properties.meta_capi_result, meta_capi_event_id: .properties.meta_capi_event_id, funnel_type: .properties.funnel_type}'

echo ""
echo "✅ Check Complete"
