import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Service role key — bypasses Row Level Security.
// Only ever import this inside app/api/** route handlers, never in client code.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
