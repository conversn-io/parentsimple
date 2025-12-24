# Database Agent Instructions: Insert ParentSimple Network Partners

## Overview
Insert three network partners into the `lenders` table for ParentSimple:
1. **Empowerly** - College Planning & Admissions
2. **Global Financial Impact** - Education Savings & Financial Planning  
3. **Legacy Financial Group** - Insurance & Estate Planning

## Prerequisites
- The `lenders` table must exist (from the lender directory migration)
- The `sites` table must exist with a `parentsimple` entry
- You need a `user_id` from the `auth.users` table (or modify the table to allow NULL)

## SQL Script Location
The SQL script is located at:
```
supabase/migrations/20251216000000_insert_parentsimple_network_partners.sql
```

Or use the direct SQL file:
```
INSERT_NETWORK_PARTNERS.sql
```

## Execution Steps

### Option 1: Via Supabase SQL Editor (Recommended)
1. Open your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `INSERT_NETWORK_PARTNERS.sql`
4. Execute the script (it now automatically creates a system user if needed)
5. Verify with the verification query at the bottom

### Option 2: Via psql Command Line
```bash
psql -h your-supabase-host -U postgres -d postgres -f INSERT_NETWORK_PARTNERS.sql
```

### Option 3: Via Supabase CLI
```bash
supabase db execute -f INSERT_NETWORK_PARTNERS.sql
```

## Important Notes

### User ID Requirement
The `lenders` table requires a `user_id` that references `auth.users(id)`. The script uses:
```sql
(SELECT id FROM auth.users LIMIT 1)
```

**If this fails**, you have three options:

1. **Use a specific user_id**: Replace with an actual UUID:
   ```sql
   '00000000-0000-0000-0000-000000000000' -- Replace with actual UUID
   ```

2. **Create a system user**: Create a dedicated system user for ParentSimple:
   ```sql
   INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
   VALUES (
     gen_random_uuid(),
     'system@parentsimple.org',
     crypt('system-password', gen_salt('bf')),
     NOW(),
     NOW(),
     NOW()
   );
   ```

3. **Modify table schema** (if allowed): Make user_id nullable:
   ```sql
   ALTER TABLE lenders ALTER COLUMN user_id DROP NOT NULL;
   ```

## Verification Query

After running the script, verify the partners were inserted:

```sql
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
```

Expected result: 3 rows
- Empowerly (college_planning)
- Global Financial Impact (financial_planning)
- Legacy Financial Group (insurance)

## Troubleshooting

### Error: "relation 'lenders' does not exist"
- Run the lender directory migration first: `20250130000000_create_lender_directory.sql`

### Error: "relation 'sites' does not exist"
- Ensure the sites table exists or run the site creation migration

### Error: "violates foreign key constraint" (user_id)
- Use one of the user_id solutions above

### Error: "duplicate key value violates unique constraint"
- The partners already exist. The script uses `ON CONFLICT DO UPDATE` so it's safe to run again.

## Partner Details Summary

| Partner | Type | Slug | Description |
|---------|------|------|-------------|
| Empowerly | college_planning | empowerly | College counseling and admissions support |
| Global Financial Impact | financial_planning | global-financial-impact | Education savings and 529 plans |
| Legacy Financial Group | insurance | legacy-financial-group | Life insurance and estate planning |

## Next Steps

After inserting the partners:
1. Verify they appear on `/network-partners` page
2. Check that `is_published = true` for all three
3. Verify the page displays them grouped by type correctly
4. Test the database connection in the Next.js app

