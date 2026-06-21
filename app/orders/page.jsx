'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/AuthProvider'
import { createClient } from '@/lib/supabase/client'
import { Btn, Badge, Spinner } from '@/components/UI'

const STATUS_COLOR = { delivered: 'success', shipped: 'gold', processing: 'rose', pending: 'outline', cancelled: 'rose' }

export default function OrdersListPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const load = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${session.access_token}` } })
      const data = await res.json()
      setOrders(data.orders || [])
      setLoading(false)
    }
    load()
  }, [user])

  if (!user && !loading) {
    return (
      <div className="text-center py-40 px-6">
        <p className="text-muted mb-6">Sign in to view your orders.</p>
        <Btn onClick={() => router.push('/login')}>Sign In</Btn>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto px-8 md:px-10 pt-[120px] pb-20">
      <h1 className="font-display text-4xl mb-9">My <em className="text-rose-light not-italic italic">Orders</em></h1>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : orders.length === 0 ? (
        <div className="text-center text-muted py-16">
          <p className="mb-5">No orders yet.</p>
          <Btn onClick={() => router.push('/shop')}>Start Shopping</Btn>
        </div>
      ) : (
        <div className="stagger">
          {orders.map(o => (
            <div key={o.id} className="animate-fadeUp bg-surface rounded-md p-5.5 mb-4 border border-border flex justify-between items-center flex-wrap gap-4">
              <div>
                <p className="font-semibold mb-1.5">{o.order_number}</p>
                <p className="text-muted text-[13px] mb-2.5">
                  {new Date(o.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {o.order_items?.length || 0} item(s)
                </p>
                <Badge label={o.status} variant={STATUS_COLOR[o.status] || 'outline'} />
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className="text-rose-light font-semibold text-[19px]">${o.total}</span>
                <Link href={`/orders/${o.id}`}>
                  <Btn variant="ghost" size="sm">Track Order</Btn>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
