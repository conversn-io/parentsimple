#!/bin/bash

SESSION_ID="test-smoke-1769962668202"
SUPABASE_URL="https://jqjftrlnyysqcwbbigpw.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxamZ0cmxueXlzcWN3YmJpZ3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTQ2MzksImV4cCI6MjA2Njg3MDYzOX0.ZqgLIflQJY5zC3ZnU5K9k_KEM9bDdNhtqek6ckuwjAo"

echo "═══════════════════════════════════════════════════════════"
echo "🔍 Checking Supabase Logs for Session: $SESSION_ID"
echo "═══════════════════════════════════════════════════════════"
echo ""

echo "📊 Leads Table:"
curl -s "${SUPABASE_URL}/rest/v1/leads?session_id=eq.${SESSION_ID}&select=id,contact_id,funnel_type,status,is_verified,created_at" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" | jq '.'

echo ""
echo "📊 Analytics Events:"
curl -s "${SUPABASE_URL}/rest/v1/analytics_events?session_id=eq.${SESSION_ID}&select=event_name,event_category,properties,created_at&order=created_at.desc" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" | jq '.'

echo ""
echo "✅ Verification Complete"
