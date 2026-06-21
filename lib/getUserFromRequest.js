import { createAdminClient } from '@/lib/supabase/admin'

// Verifies the bearer token from the Authorization header and returns the user, or null.
export async function getUserFromRequest(request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.split(' ')[1]
  const supabase = createAdminClient()
  const { data, error } = await supabase.auth.getUser(token)
  return error ? null : data.user
}
