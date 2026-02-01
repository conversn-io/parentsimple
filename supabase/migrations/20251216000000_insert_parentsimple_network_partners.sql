-- ========================================
-- INSERT PARENTSIMPLE NETWORK PARTNERS
-- ========================================
-- Migration: insert_parentsimple_network_partners
-- Purpose: Insert initial network partners for ParentSimple
-- ========================================

-- Note: This assumes the lenders table exists and has a user_id column
-- You may need to adjust the user_id value or use a different approach
-- depending on your database setup.

-- First, ensure the 'parentsimple' site exists in the sites table
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

-- Insert Empowerly (College Planning & Admissions)
-- Note: Replace (SELECT id FROM auth.users LIMIT 1) with a specific user_id UUID if needed
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
SELECT 
  COALESCE((SELECT id FROM auth.users LIMIT 1), gen_random_uuid()) as user_id, -- Fallback to random UUID if no users exist
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
  ARRAY[]::TEXT[], -- Nationwide - empty array means all states
  true
ON CONFLICT (site_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  highlights = EXCLUDED.highlights,
  lender_type = EXCLUDED.lender_type,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- Insert Global Financial Impact (Education Savings & Financial Planning)
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
SELECT 
  COALESCE((SELECT id FROM auth.users LIMIT 1), gen_random_uuid()) as user_id,
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
ON CONFLICT (site_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  highlights = EXCLUDED.highlights,
  lender_type = EXCLUDED.lender_type,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- Insert Legacy Financial Group (Insurance & Estate Planning)
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
SELECT 
  COALESCE((SELECT id FROM auth.users LIMIT 1), gen_random_uuid()) as user_id,
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
ON CONFLICT (site_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  highlights = EXCLUDED.highlights,
  lender_type = EXCLUDED.lender_type,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- ========================================
-- VERIFICATION QUERY
-- ========================================
-- Run this to verify the partners were inserted:
-- SELECT id, name, slug, lender_type, is_published, created_at
-- FROM lenders
-- WHERE site_id = 'parentsimple'
-- ORDER BY name ASC;

