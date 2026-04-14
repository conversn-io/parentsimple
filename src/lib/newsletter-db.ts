import { createClient } from '@supabase/supabase-js'

// CMS Supabase — newsletter_subscribers, newsletter_issues, newsletter_poll_responses all live here
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vpysqshhafthuxvokwqj.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const newsletterDb = createClient(supabaseUrl, supabaseServiceKey)

// Site ID from deploy-time env var
export const SITE_ID = process.env.NEXT_PUBLIC_SITE_ID || process.env.NEXT_PUBLIC_SITE_KEY || 'parentsimple'
