import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getUserFromRequest } from '@/lib/getUserFromRequest'

// POST /api/orders — create a new order
export async function POST(request) {
  const user = await getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const { items, subtotal, shipping_cost, total, payment_method, address } = await request.json()
  if (!items?.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })

  const supabase = createAdminClient()

  try {
    let addressId = null
    if (address) {
      const { data: addr, error: addrErr } = await supabase
        .from('addresses')
        .insert({ ...address, user_id: user.id })
        .select()
        .single()
      if (addrErr) throw addrErr
      addressId = addr.id
    }

    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        subtotal, shipping_cost, total,
        payment_method,
        payment_status: payment_method === 'cash' ? 'pending' : 'paid',
        address_id: addressId,
        status: 'pending',
      })
      .select()
      .single()
    if (orderErr) throw orderErr

    const orderItems = items.map(i => ({
      order_id: order.id,
      product_id: i.product_id,
      product_name: i.product_name,
      size: i.size,
      quantity: i.quantity,
      unit_price: i.unit_price,
      total_price: i.unit_price * i.quantity,
    }))
    const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)
    if (itemsErr) throw itemsErr

    await supabase.from('cart_items').delete().eq('user_id', user.id)

    return NextResponse.json({ order }, { status: 201 })
  } catch (err) {
    console.error('Order creation failed:', err)
    return NextResponse.json({ error: err.message || 'Could not place order' }, { status: 500 })
  }
}

// GET /api/orders — list current user's orders
export async function GET(request) {
  const user = await getUserFromRequest(request)
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ orders: data })
}
