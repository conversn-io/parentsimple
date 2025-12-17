-- ========================================
-- INSERT PARENTSIMPLE NETWORK PARTNERS
-- ========================================
-- Direct SQL script to insert network partners
-- Run this in your Supabase SQL Editor or via psql
-- ========================================

-- Step 1: Ensure the 'parentsimple' site exists
INSERT INTO sites (id, name, domain, description, article_route_path, is_active)
VALUES (
  'parentsimple',
  'ParentSimple',
  'parentsimple.org',
  'Elite education and legacy planning for affluent parents',
  '/articles',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Get a user_id (replace with your actual user_id if you have one)
-- If you don't have a user_id, you may need to:
-- Option A: Create a system user first
-- Option B: Modify the lenders table to allow NULL user_id (if your schema allows)
-- Option C: Use a specific user_id from your auth.users table

-- For now, we'll use a subquery to get the first user
-- REPLACE THIS with your actual user_id UUID if you have one:
-- SET @user_id = 'your-user-id-here';

-- Step 3: Insert Empowerly (College Planning & Admissions)
INSERT INTO lenders (
  user_id,
  site_id,
  name,
  slug,
  description,
  highlights,
  lender_type,
  is_published,
  states_available,
  nationwide
)
VALUES (
  (SELECT id FROM auth.users LIMIT 1), -- Replace with specific UUID if needed
  'parentsimple',
  'Empowerly',
  'empowerly',
  'Empowerly provides expert college counseling and admissions support to help students navigate the elite university application process. Their counselors have admissions office experience at top universities including Harvard, Yale, MIT, and more.',
  ARRAY[
    'Admissions office experience at top universities',
    'Strategic application support',
    'Personalized college counseling',
    'Elite university expertise'
  ],
  'college_planning',
  true,
  ARRAY[]::TEXT[],
  true
)
ON CONFLICT (site_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  highlights = EXCLUDED.highlights,
  lender_type = EXCLUDED.lender_type,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- Step 4: Insert Global Financial Impact (Education Savings & Financial Planning)
INSERT INTO lenders (
  user_id,
  site_id,
  name,
  slug,
  description,
  highlights,
  lender_type,
  is_published,
  states_available,
  nationwide
)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'parentsimple',
  'Global Financial Impact',
  'global-financial-impact',
  'Global Financial Impact specializes in education savings strategies, 529 plans, and comprehensive family financial planning to help parents prepare for their children''s educational expenses.',
  ARRAY[
    '529 plan expertise',
    'Education savings strategies',
    'Family financial planning',
    'Comprehensive wealth management'
  ],
  'financial_planning',
  true,
  ARRAY[]::TEXT[],
  true
)
ON CONFLICT (site_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  highlights = EXCLUDED.highlights,
  lender_type = EXCLUDED.lender_type,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- Step 5: Insert Legacy Financial Group (Insurance & Estate Planning)
INSERT INTO lenders (
  user_id,
  site_id,
  name,
  slug,
  description,
  highlights,
  lender_type,
  is_published,
  states_available,
  nationwide
)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'parentsimple',
  'Legacy Financial Group',
  'legacy-financial-group',
  'Legacy Financial Group provides life insurance, estate planning, and financial protection products designed to secure your family''s future and protect your children''s educational legacy.',
  ARRAY[
    'Life insurance for families',
    'Estate planning services',
    'Financial protection products',
    'Legacy planning expertise'
  ],
  'insurance',
  true,
  ARRAY[]::TEXT[],
  true
)
ON CONFLICT (site_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  highlights = EXCLUDED.highlights,
  lender_type = EXCLUDED.lender_type,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- ========================================
-- VERIFICATION
-- ========================================
-- Run this query to verify the partners were inserted:
SELECT 
  id,
  name,
  slug,
  lender_type,
  is_published,
  description,
  highlights,
  created_at
FROM lenders
WHERE site_id = 'parentsimple'
ORDER BY name ASC;

