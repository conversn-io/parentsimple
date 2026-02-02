-- QUICK DEBUG: What ParentSimple events DO we have?
-- Run these 3 queries first to understand what's being tracked

-- ============================================================================
-- 1. ALL ParentSimple events in last 7 days
-- ============================================================================
SELECT 
  event_name,
  COUNT(*) as count,
  MAX(created_at) as most_recent
FROM analytics_events
WHERE 
  created_at >= CURRENT_DATE - INTERVAL '7 days'
  AND (
    page_url ILIKE '%parentsimple%'
    OR properties->>'site_key' ILIKE '%parentsimple%'
  )
GROUP BY event_name
ORDER BY count DESC;


-- ============================================================================
-- 2. Sample of recent ParentSimple events (any kind)
-- ============================================================================
SELECT 
  event_name,
  event_label,
  page_url,
  properties->>'funnel_type' as funnel_type,
  created_at,
  session_id
FROM analytics_events
WHERE 
  created_at >= CURRENT_DATE - INTERVAL '7 days'
  AND (
    page_url ILIKE '%parentsimple%'
    OR properties->>'site_key' ILIKE '%parentsimple%'
  )
ORDER BY created_at DESC
LIMIT 20;


-- ============================================================================
-- 3. Do we have ANY quiz/question events? (any platform)
-- ============================================================================
SELECT 
  event_name,
  page_url,
  COUNT(*) as count
FROM analytics_events
WHERE 
  created_at >= CURRENT_DATE - INTERVAL '7 days'
  AND (
    event_name ILIKE '%quiz%'
    OR event_name ILIKE '%question%'
    OR event_name ILIKE '%answer%'
    OR event_name ILIKE '%step%'
  )
GROUP BY event_name, page_url
ORDER BY count DESC;
