'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Spinner } from '@/components/UI'

const STEPS = ['pending', 'processing', 'shipped', 'delivered']
const STEP_LABELS = ['Order Placed', 'Processing', 'Shipped', 'Delivered']

export default function OrderTrackerPage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      try {
        const res = await fetch(`/api/orders/${id}`, { headers: { Authorization: `Bearer ${session.access_token}` } })
        const data = await res.json()
        if (res.ok) setOrder(data.order)
      } catch {}
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="flex justify-center py-40"><Spinner size={40} /></div>
  if (!order) return <div className="text-center py-40 text-muted">Order not found.</div>

  const currentStep = STEPS.indexOf(order.status)

  return (
    <div className="animate-fadeIn max-w-3xl mx-auto px-8 md:px-10 pt-[120px] pb-20">
      <button onClick={() => router.push('/orders')} className="text-muted text-[13px] mb-6 hover:text-rose-light transition-colors">← All Orders</button>
      <h1 className="font-display text-[34px] mb-1.5">Order Tracker</h1>
      <p className="text-muted text-sm mb-9">{order.order_number} · Placed {new Date(order.created_at).toLocaleDateString()}</p>

      <div className="animate-fadeUp bg-surface rounded-lg p-9 mb-6 border border-border">
        <div className="flex justify-between relative">
          <div className="absolute top-[15px] left-[6%] right-[6%] h-0.5 bg-border-light z-0">
            <div
              className="h-full bg-gradient-to-r from-rose to-gold transition-all duration-1000 ease-out"
              style={{ width: `${Math.max(currentStep, 0) / 3 * 100}%` }}
            />
          </div>
          {STEP_LABELS.map((label, i) => {
            const done = i <= currentStep
            return (
              <div key={label} className="flex flex-col items-center z-10 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-300
                  ${done ? 'bg-rose text-white border-2 border-rose' : 'bg-surface text-muted border-2 border-border-light'}
                  ${done && i === currentStep ? 'ring-[5px] ring-rose/20' : ''}`}
                >{done ? '✓' : i + 1}</div>
                <p className={`text-[11px] mt-2.5 text-center ${done ? 'text-offwhite' : 'text-muted'}`}>{label}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="animate-fadeUp bg-surface rounded-md p-5.5 border border-border">
        <p className="text-muted text-[11px] tracking-wide uppercase mb-3.5">Items</p>
        {order.order_items?.map(item => (
          <div key={item.id} className="flex justify-between text-sm mb-2">
            <span>{item.product_name} ({item.size}) ×{item.quantity}</span>
            <span className="text-muted">${item.total_price}</span>
          </div>
        ))}
        <div className="border-t border-border mt-4 pt-4 flex justify-between">
          <span className="text-muted">Total</span>
          <span className="text-rose-light font-semibold text-[19px]">${order.total}</span>
        </div>
      </div>
    </div>
  )
}
