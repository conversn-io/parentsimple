-- DEBUG QUERIES - Find out what data exists
-- Run these queries in order to diagnose the issue

-- ============================================================================
-- STEP 1: Check if analytics_events table exists and has any data
-- ============================================================================
SELECT COUNT(*) as total_events
FROM analytics_events;


-- ============================================================================
-- STEP 2: Check what event names exist in the last 7 days
-- ============================================================================
SELECT 
  event_name,
  COUNT(*) as count,
  MIN(created_at) as first_event,
  MAX(created_at) as last_event
FROM analytics_events
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY event_name
ORDER BY count DESC;


-- ============================================================================
-- STEP 3: Check if there are ANY ParentSimple events
-- ============================================================================
SELECT 
  event_name,
  page_url,
  properties->>'site_key' as site_key,
  COUNT(*) as count
FROM analytics_events
WHERE 
  created_at >= CURRENT_DATE - INTERVAL '7 days'
  AND (
    page_url LIKE '%parentsimple%'
    OR properties->>'site_key' LIKE '%parentsimple%'
  )
GROUP BY event_name, page_url, properties->>'site_key'
ORDER BY count DESC;


-- ============================================================================
-- STEP 4: Check yesterday's events (all platforms)
-- ============================================================================
SELECT 
  event_name,
  COUNT(*) as count,
  COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events
WHERE 
  created_at >= CURRENT_DATE - INTERVAL '1 day'
  AND created_at < CURRENT_DATE
GROUP BY event_name
ORDER BY count DESC;


-- ============================================================================
-- STEP 5: Sample of recent events to see structure
-- ============================================================================
SELECT 
  event_name,
  event_label,
  page_url,
  properties,
  session_id,
  user_id,
  created_at
FROM analytics_events
WHERE created_at >= CURRENT_DATE - INTERVAL '2 days'
ORDER BY created_at DESC
LIMIT 20;


-- ============================================================================
-- STEP 6: Check if there are quiz-related events with different names
-- ============================================================================
SELECT 
  event_name,
  event_label,
  COUNT(*) as count,
  ARRAY_AGG(DISTINCT properties->>'funnel_type') as funnel_types
FROM analytics_events
WHERE 
  created_at >= CURRENT_DATE - INTERVAL '7 days'
  AND (
    event_name LIKE '%quiz%'
    OR event_name LIKE '%question%'
    OR event_name LIKE '%answer%'
    OR event_name LIKE '%step%'
    OR page_url LIKE '%parentsimple%'
  )
GROUP BY event_name, event_label
ORDER BY count DESC;


-- ============================================================================
-- STEP 7: Check what properties exist in recent events
-- ============================================================================
SELECT DISTINCT
  event_name,
  jsonb_object_keys(properties) as property_key
FROM analytics_events
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY event_name, property_key;


-- ============================================================================
-- STEP 8: Check for ParentSimple events in last 30 days (broader search)
-- ============================================================================
SELECT 
  DATE(created_at) as event_date,
  event_name,
  COUNT(*) as count,
  COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events
WHERE 
  created_at >= CURRENT_DATE - INTERVAL '30 days'
  AND (
    page_url ILIKE '%parent%'
    OR properties->>'site_key' ILIKE '%parent%'
    OR properties->>'funnel_type' ILIKE '%life%insurance%'
  )
GROUP BY DATE(created_at), event_name
ORDER BY event_date DESC, count DESC;


-- ============================================================================
-- STEP 9: Find any events that look like quiz interactions
-- ============================================================================
SELECT 
  event_name,
  event_label,
  properties->>'question_id' as question_id,
  properties->>'answer' as answer,
  properties->>'step' as step,
  page_url,
  created_at
FROM analytics_events
WHERE 
  created_at >= CURRENT_DATE - INTERVAL '7 days'
  AND (
    properties ? 'question_id'
    OR properties ? 'answer'
    OR properties ? 'step'
    OR properties ? 'step_number'
  )
ORDER BY created_at DESC
LIMIT 50;


-- ============================================================================
-- STEP 10: Check table schema
-- ============================================================================
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'analytics_events'
ORDER BY ordinal_position;


-- ============================================================================
-- USAGE
-- ============================================================================
/*
Run these queries one by one in Supabase SQL Editor to understand:

1. Does the table have data?
2. What event names are actually being used?
3. Are ParentSimple events being tracked at all?
4. What does the data structure look like?
5. Are we looking for the right event_name?

Based on the results, we can fix the main query!
*/
