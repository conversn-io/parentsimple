import { createClient } from "@supabase/supabase-js"

// CMS Supabase Configuration (for content management)
const cmsSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://placeholder.supabase.co'
const cmsSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'placeholder-key'

// Debug logging for CMS Supabase
console.log('🔍 CMS Supabase Config:', {
  url: cmsSupabaseUrl,
  keyLength: cmsSupabaseAnonKey.length,
  keyPrefix: cmsSupabaseAnonKey.substring(0, 20) + '...',
  envUrl: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
  envKey: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
});

export const supabase = createClient(cmsSupabaseUrl, cmsSupabaseAnonKey)

export interface Database {
  public: {
    Tables: {
      newsletter_signups?: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
