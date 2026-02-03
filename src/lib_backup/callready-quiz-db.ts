import { createClient } from "@supabase/supabase-js"

// CallReady Quiz Database Configuration
const CALLREADY_QUIZ_URL = process.env.SUPABASE_QUIZ_URL || "https://jqjftrlnyysqcwbbigpw.supabase.co"
const CALLREADY_QUIZ_ANON_KEY = process.env.SUPABASE_QUIZ_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxamZ0cmxueXlzcWN3YmJpZ3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyOTQ2MzksImV4cCI6MjA2Njg3MDYzOX0.ZqgLIflQJY5zC3ZnU5K9k_KEM9bDdNhtq3ek6ckuwjAo"
const CALLREADY_QUIZ_SERVICE_KEY = process.env.SUPABASE_QUIZ_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxamZ0cmxueXlzcWN3YmJpZ3B3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTI5NDYzOSwiZXhwIjoyMDY2ODcwNjM5fQ.-PkMYXKDjL-7sINBFJt6GoF7TOzq_Py-VWX03rFYRjI"

// Debug logging
console.log('🔍 CallReady Quiz DB Config:', {
  url: CALLREADY_QUIZ_URL,
  anonKeyLength: CALLREADY_QUIZ_ANON_KEY.length,
  serviceKeyLength: CALLREADY_QUIZ_SERVICE_KEY.length,
  anonKeyPrefix: CALLREADY_QUIZ_ANON_KEY.substring(0, 20) + '...',
  serviceKeyPrefix: CALLREADY_QUIZ_SERVICE_KEY.substring(0, 20) + '...',
  envUrl: process.env.SUPABASE_QUIZ_URL ? 'SET' : 'NOT SET',
  envAnonKey: process.env.SUPABASE_QUIZ_ANON_KEY ? 'SET' : 'NOT SET',
  envServiceKey: process.env.SUPABASE_QUIZ_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET'
});

// Use service role key for server-side operations (bypasses RLS)
export const callreadyQuizDb = createClient(CALLREADY_QUIZ_URL, CALLREADY_QUIZ_SERVICE_KEY)

// Use anon key for client-side operations (respects RLS)
export const callreadyQuizDbAnon = createClient(CALLREADY_QUIZ_URL, CALLREADY_QUIZ_ANON_KEY)

export interface CallReadyQuizDatabase {
  public: {
    Tables: {
      verified_leads: {
        Row: {
          id: string
          phone_number: string
          email: string | null
          first_name: string | null
          last_name: string | null
          source: string
          status: string
          quiz_answers: any
          property_value: string | null
          current_mortgage: string | null
          loan_purpose: string | null
          credit_score: string | null
          property_location: string | null
          verified_at: string
          contacted_at: string | null
          converted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone_number: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          source: string
          status?: string
          quiz_answers?: any
          property_value?: string | null
          current_mortgage?: string | null
          loan_purpose?: string | null
          credit_score?: string | null
          property_location?: string | null
          verified_at?: string
          contacted_at?: string | null
          converted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone_number?: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          source?: string
          status?: string
          quiz_answers?: any
          property_value?: string | null
          current_mortgage?: string | null
          loan_purpose?: string | null
          credit_score?: string | null
          property_location?: string | null
          verified_at?: string
          contacted_at?: string | null
          converted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      otp_verifications: {
        Row: {
          id: string
          phone_number: string
          otp_code: string
          expires_at: string
          attempts: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone_number: string
          otp_code: string
          expires_at: string
          attempts?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone_number?: string
          otp_code?: string
          expires_at?: string
          attempts?: number
          created_at?: string
          updated_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          event_name: string
          event_category: string | null
          event_label: string | null
          event_value: number | null
          user_id: string | null
          session_id: string | null
          page_url: string | null
          referrer: string | null
          user_agent: string | null
          ip_address: string | null
          properties: any
          created_at: string
        }
        Insert: {
          id?: string
          event_name: string
          event_category?: string | null
          event_label?: string | null
          event_value?: number | null
          user_id?: string | null
          session_id?: string | null
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          properties?: any
          created_at?: string
        }
        Update: {
          id?: string
          event_name?: string
          event_category?: string | null
          event_label?: string | null
          event_value?: number | null
          user_id?: string | null
          session_id?: string | null
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          properties?: any
          created_at?: string
        }
      }
    }
  }
}