import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserFromRequest } from '@/lib/getUserFromRequest'

// GET /api/orders/:id — fetch one order with items, for tracking
export async function GET(request, { params }) {
  const user = await getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json({ order: data })
}
