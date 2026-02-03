-- ========================================
-- INSERT PARENTSIMPLE NETWORK PARTNERS
-- ========================================
-- Direct SQL script to insert network partners
-- Run this in your Supabase SQL Editor or via psql
-- ========================================

-- Step 0: Ensure the unique constraint exists (Fixes ERROR: 42P10)
-- This is required for the ON CONFLICT (site_id, slug) clause to work.
-- Backups like 'CREATE TABLE AS SELECT' do not preserve constraints.
DO $$
BEGIN
    -- Check if the unique constraint on (site_id, slug) exists
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'lenders_site_id_slug_unique' 
           OR (contype = 'u' AND (
               SELECT array_agg(attname ORDER BY attnum) 
               FROM pg_attribute 
               WHERE attrelid = 'lenders'::regclass 
                 AND attnum = ANY(conkey)
           ) = ARRAY['site_id', 'slug']::name[])
    ) THEN
        -- Add the unique constraint so ON CONFLICT works
        ALTER TABLE lenders ADD CONSTRAINT lenders_site_id_slug_unique UNIQUE (site_id, slug);
    END IF;
END $$;

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

-- Step 2: Ensure a system user exists for managing these records
-- This creates a dedicated 'system' user so partners aren't tied to a specific employee account.
-- The password is a random UUID as this user is not intended for login.
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- Consistent UUID for system user
  'system@parentsimple.org',
  crypt(gen_random_uuid()::text, gen_salt('bf')),
  now(),
  'authenticated',
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"ParentSimple System"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (email) DO NOTHING;

-- Define the system user ID for use in subsequent inserts
DO $$
DECLARE
    sys_user_id UUID;
BEGIN
    SELECT id INTO sys_user_id FROM auth.users WHERE email = 'system@parentsimple.org';
    
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
      sys_user_id,
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
      sys_user_id,
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
      sys_user_id,
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
END $$;

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

