-- ParentSimple Analytics Queries
-- Date: February 1, 2026

-- ============================================================================
-- QUERY 1: Question Answer Events for Non-Converted Users (Yesterday)
-- Excludes test submissions
-- ============================================================================

-- Non-converted users who answered questions but didn't complete quiz
SELECT 
  ae.session_id,
  ae.user_id,
  ae.event_name,
  ae.properties->>'question_id' as question_id,
  ae.properties->>'answer' as answer,
  ae.properties->>'step' as step_number,
  ae.properties->>'funnel_type' as funnel_type,
  ae.page_url,
  ae.created_at,
  -- Check if session completed quiz
  EXISTS (
    SELECT 1 FROM analytics_events ae2 
    WHERE ae2.session_id = ae.session_id 
    AND ae2.event_name = 'quiz_complete'
  ) as completed_quiz,
  -- Check if session converted to lead
  EXISTS (
    SELECT 1 FROM analytics_events ae3 
    WHERE ae3.session_id = ae.session_id 
    AND ae3.event_name IN ('webhook_delivery', 'lead_form_submit')
  ) as converted_to_lead
FROM analytics_events ae
WHERE 
  -- Yesterday's data
  ae.created_at >= CURRENT_DATE - INTERVAL '1 day'
  AND ae.created_at < CURRENT_DATE
  
  -- Question answer events only
  AND ae.event_name = 'question_answer'
  
  -- ParentSimple only
  AND (
    ae.page_url LIKE '%parentsimple.org%'
    OR ae.properties->>'site_key' = 'parentsimple.org'
  )
  
  -- Exclude test data
  AND ae.user_id NOT LIKE '%test%'
  AND ae.user_id NOT LIKE '%smoke%'
  AND ae.page_url NOT LIKE '%test%'
  AND COALESCE(ae.properties->>'test_submission', 'false') = 'false'
  AND ae.user_id NOT IN ('keenan@conversn.io', 'test@example.com', 'smoke.test@parentsimple.test')
  
  -- Only non-converted sessions
  AND NOT EXISTS (
    SELECT 1 FROM analytics_events ae_conv
    WHERE ae_conv.session_id = ae.session_id
    AND ae_conv.event_name IN ('webhook_delivery', 'lead_form_submit', 'quiz_complete')
  )
ORDER BY ae.created_at DESC;


-- ============================================================================
-- QUERY 2: Non-Converted Sessions Summary (Yesterday)
-- Shows which step users dropped off at
-- ============================================================================

WITH session_progress AS (
  SELECT 
    session_id,
    properties->>'funnel_type' as funnel_type,
    MAX((properties->>'step')::int) as last_step_reached,
    COUNT(*) as total_answers,
    MIN(created_at) as session_start,
    MAX(created_at) as last_activity,
    EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) as session_duration_seconds
  FROM analytics_events
  WHERE 
    created_at >= CURRENT_DATE - INTERVAL '1 day'
    AND created_at < CURRENT_DATE
    AND event_name = 'question_answer'
    AND (page_url LIKE '%parentsimple.org%' OR properties->>'site_key' = 'parentsimple.org')
    -- Exclude tests
    AND user_id NOT LIKE '%test%'
    AND user_id NOT LIKE '%smoke%'
    AND COALESCE(properties->>'test_submission', 'false') = 'false'
  GROUP BY session_id, properties->>'funnel_type'
)
SELECT 
  sp.*,
  -- Check if session converted
  EXISTS (
    SELECT 1 FROM analytics_events ae 
    WHERE ae.session_id = sp.session_id 
    AND ae.event_name IN ('webhook_delivery', 'lead_form_submit')
  ) as converted
FROM session_progress sp
WHERE NOT EXISTS (
  SELECT 1 FROM analytics_events ae
  WHERE ae.session_id = sp.session_id
  AND ae.event_name IN ('webhook_delivery', 'lead_form_submit', 'quiz_complete')
)
ORDER BY sp.last_activity DESC;


-- ============================================================================
-- QUERY 3: Dropoff Analysis by Step (Yesterday)
-- Shows which quiz steps have highest abandonment
-- ============================================================================

WITH step_events AS (
  SELECT 
    properties->>'funnel_type' as funnel_type,
    (properties->>'step')::int as step_number,
    properties->>'question_id' as question_id,
    session_id,
    created_at
  FROM analytics_events
  WHERE 
    created_at >= CURRENT_DATE - INTERVAL '1 day'
    AND created_at < CURRENT_DATE
    AND event_name = 'question_answer'
    AND (page_url LIKE '%parentsimple.org%' OR properties->>'site_key' = 'parentsimple.org')
    -- Exclude tests
    AND user_id NOT LIKE '%test%'
    AND user_id NOT LIKE '%smoke%'
    AND COALESCE(properties->>'test_submission', 'false') = 'false'
),
session_status AS (
  SELECT DISTINCT
    session_id,
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM analytics_events ae 
        WHERE ae.session_id = step_events.session_id 
        AND ae.event_name IN ('webhook_delivery', 'lead_form_submit')
      ) THEN 'converted'
      WHEN EXISTS (
        SELECT 1 FROM analytics_events ae 
        WHERE ae.session_id = step_events.session_id 
        AND ae.event_name = 'quiz_complete'
      ) THEN 'completed'
      ELSE 'dropped'
    END as status
  FROM step_events
)
SELECT 
  se.funnel_type,
  se.step_number,
  se.question_id,
  COUNT(DISTINCT se.session_id) as total_sessions,
  COUNT(DISTINCT CASE WHEN ss.status = 'converted' THEN se.session_id END) as converted_sessions,
  COUNT(DISTINCT CASE WHEN ss.status = 'completed' THEN se.session_id END) as completed_sessions,
  COUNT(DISTINCT CASE WHEN ss.status = 'dropped' THEN se.session_id END) as dropped_sessions,
  ROUND(
    100.0 * COUNT(DISTINCT CASE WHEN ss.status = 'dropped' THEN se.session_id END) / 
    COUNT(DISTINCT se.session_id), 
    2
  ) as dropout_rate_percent
FROM step_events se
LEFT JOIN session_status ss ON se.session_id = ss.session_id
GROUP BY se.funnel_type, se.step_number, se.question_id
ORDER BY se.funnel_type, se.step_number;


-- ============================================================================
-- QUERY 4: Individual Non-Converted User Journey (Yesterday)
-- Detailed view of what each non-converted user did
-- ============================================================================

WITH non_converted_sessions AS (
  SELECT DISTINCT session_id
  FROM analytics_events
  WHERE 
    created_at >= CURRENT_DATE - INTERVAL '1 day'
    AND created_at < CURRENT_DATE
    AND event_name = 'question_answer'
    AND (page_url LIKE '%parentsimple.org%' OR properties->>'site_key' = 'parentsimple.org')
    -- Exclude tests
    AND user_id NOT LIKE '%test%'
    AND user_id NOT LIKE '%smoke%'
    AND COALESCE(properties->>'test_submission', 'false') = 'false'
    -- Not converted
    AND NOT EXISTS (
      SELECT 1 FROM analytics_events ae
      WHERE ae.session_id = analytics_events.session_id
      AND ae.event_name IN ('webhook_delivery', 'lead_form_submit', 'quiz_complete')
    )
)
SELECT 
  ae.session_id,
  ae.user_id,
  ae.event_name,
  ae.event_label,
  ae.properties->>'funnel_type' as funnel_type,
  ae.properties->>'step' as step_number,
  ae.properties->>'step_name' as step_name,
  ae.properties->>'question_id' as question_id,
  ae.properties->>'answer' as answer,
  ae.page_url,
  ae.created_at,
  ROW_NUMBER() OVER (PARTITION BY ae.session_id ORDER BY ae.created_at) as event_sequence
FROM analytics_events ae
INNER JOIN non_converted_sessions ncs ON ae.session_id = ncs.session_id
WHERE 
  ae.created_at >= CURRENT_DATE - INTERVAL '1 day'
  AND ae.created_at < CURRENT_DATE
ORDER BY ae.session_id, ae.created_at;


-- ============================================================================
-- QUERY 5: Non-Converted Users - Answers by Question (Yesterday)
-- See what answers non-converted users gave to each question
-- ============================================================================

SELECT 
  properties->>'funnel_type' as funnel_type,
  properties->>'question_id' as question_id,
  properties->>'answer' as answer,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(*) as total_answers,
  ARRAY_AGG(DISTINCT session_id ORDER BY session_id) as sample_sessions
FROM analytics_events
WHERE 
  created_at >= CURRENT_DATE - INTERVAL '1 day'
  AND created_at < CURRENT_DATE
  AND event_name = 'question_answer'
  AND (page_url LIKE '%parentsimple.org%' OR properties->>'site_key' = 'parentsimple.org')
  -- Exclude tests
  AND user_id NOT LIKE '%test%'
  AND user_id NOT LIKE '%smoke%'
  AND COALESCE(properties->>'test_submission', 'false') = 'false'
  -- Not converted
  AND NOT EXISTS (
    SELECT 1 FROM analytics_events ae
    WHERE ae.session_id = analytics_events.session_id
    AND ae.event_name IN ('webhook_delivery', 'lead_form_submit', 'quiz_complete')
  )
GROUP BY 
  properties->>'funnel_type',
  properties->>'question_id',
  properties->>'answer'
ORDER BY 
  properties->>'funnel_type',
  properties->>'question_id',
  unique_sessions DESC;


-- ============================================================================
-- QUERY 6: Time-Based Dropoff Analysis (Yesterday)
-- When during the day do most users drop off?
-- ============================================================================

SELECT 
  DATE_TRUNC('hour', created_at) as hour_bucket,
  COUNT(DISTINCT session_id) as sessions_with_answers,
  COUNT(DISTINCT CASE 
    WHEN NOT EXISTS (
      SELECT 1 FROM analytics_events ae
      WHERE ae.session_id = analytics_events.session_id
      AND ae.event_name IN ('webhook_delivery', 'lead_form_submit', 'quiz_complete')
    ) THEN session_id 
  END) as non_converted_sessions,
  ROUND(
    100.0 * COUNT(DISTINCT CASE 
      WHEN NOT EXISTS (
        SELECT 1 FROM analytics_events ae
        WHERE ae.session_id = analytics_events.session_id
        AND ae.event_name IN ('webhook_delivery', 'lead_form_submit', 'quiz_complete')
      ) THEN session_id 
    END) / COUNT(DISTINCT session_id),
    2
  ) as dropoff_rate_percent
FROM analytics_events
WHERE 
  created_at >= CURRENT_DATE - INTERVAL '1 day'
  AND created_at < CURRENT_DATE
  AND event_name = 'question_answer'
  AND (page_url LIKE '%parentsimple.org%' OR properties->>'site_key' = 'parentsimple.org')
  -- Exclude tests
  AND user_id NOT LIKE '%test%'
  AND user_id NOT LIKE '%smoke%'
  AND COALESCE(properties->>'test_submission', 'false') = 'false'
GROUP BY DATE_TRUNC('hour', created_at)
ORDER BY hour_bucket;


-- ============================================================================
-- QUERY 7: Export Non-Converted Session Details for Further Analysis
-- ============================================================================

SELECT 
  session_id,
  user_id,
  properties->>'funnel_type' as funnel_type,
  MAX((properties->>'step')::int) as furthest_step,
  COUNT(*) as total_questions_answered,
  MIN(created_at) as quiz_start_time,
  MAX(created_at) as last_activity_time,
  EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) as time_spent_seconds,
  STRING_AGG(
    CONCAT(
      properties->>'question_id', 
      ':', 
      properties->>'answer'
    ), 
    ' | ' 
    ORDER BY created_at
  ) as answer_sequence,
  -- UTM data
  MAX(properties->'utm_parameters'->>'utm_source') as utm_source,
  MAX(properties->'utm_parameters'->>'utm_medium') as utm_medium,
  MAX(properties->'utm_parameters'->>'utm_campaign') as utm_campaign
FROM analytics_events
WHERE 
  created_at >= CURRENT_DATE - INTERVAL '1 day'
  AND created_at < CURRENT_DATE
  AND event_name = 'question_answer'
  AND (page_url LIKE '%parentsimple.org%' OR properties->>'site_key' = 'parentsimple.org')
  -- Exclude tests
  AND user_id NOT LIKE '%test%'
  AND user_id NOT LIKE '%smoke%'
  AND COALESCE(properties->>'test_submission', 'false') = 'false'
  -- Not converted
  AND NOT EXISTS (
    SELECT 1 FROM analytics_events ae
    WHERE ae.session_id = analytics_events.session_id
    AND ae.event_name IN ('webhook_delivery', 'lead_form_submit', 'quiz_complete')
  )
GROUP BY session_id, user_id, properties->>'funnel_type'
ORDER BY last_activity_time DESC;


-- ============================================================================
-- USAGE NOTES
-- ============================================================================

/*
To run these queries:

1. Connect to Supabase:
   - URL: https://jqjftrlnyysqcwbbigpw.supabase.co
   - Go to SQL Editor in Supabase Dashboard

2. Modify date ranges as needed:
   - Current queries use CURRENT_DATE - INTERVAL '1 day' for yesterday
   - Change to specific dates: WHERE created_at >= '2026-02-01' AND created_at < '2026-02-02'
   - Last 7 days: WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'

3. Additional filters:
   - Specific funnel: AND properties->>'funnel_type' = 'life_insurance_ca'
   - Specific UTM source: AND properties->'utm_parameters'->>'utm_source' = 'facebook'
   - Specific step: AND (properties->>'step')::int = 3

4. Test exclusion patterns (customize as needed):
   - Add more test emails: AND user_id NOT IN ('test1@example.com', 'test2@example.com')
   - Exclude IP addresses: AND ip_address NOT IN ('127.0.0.1', '::1')
*/
