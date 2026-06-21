import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserFromRequest } from '@/lib/getUserFromRequest'

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

// PATCH /api/orders/:id/status — update order status (admin use / simulate fulfillment)
export async function PATCH(request, { params }) {
  const user = await getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { status } = await request.json()
  if (!VALID_STATUSES.includes(status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ order: data })
}
