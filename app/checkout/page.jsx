'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/CartProvider'
import { useAuth } from '@/hooks/AuthProvider'
import { useToast } from '@/hooks/ToastProvider'
import { createClient } from '@/lib/supabase/client'
import { Btn, Input } from '@/components/UI'

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const { notify } = useToast()
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState({
    name: user?.user_metadata?.full_name || '', email: user?.email || '',
    address: '', city: '', zip: '', country: 'Egypt',
    payment: 'cash', card: '', expiry: '', cvv: '',
  })

  const shipping = cartTotal > 150 ? 0 : 15
  const total = cartTotal + shipping
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const placeOrder = async () => {
    setPlacing(true)
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          items: cart.map(i => ({ product_id: i.id, product_name: i.name, size: i.size, quantity: i.qty, unit_price: i.price })),
          subtotal: cartTotal,
          shipping_cost: shipping,
          total,
          payment_method: form.payment,
          address: { full_name: form.name, street: form.address, city: form.city, zip: form.zip, country: form.country },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not place order')

      await clearCart()
      notify('Order placed successfully! 🎉')
      router.push(`/orders/${data.order.id}`)
    } catch (err) {
      notify(err.message || 'Could not place order. Is the dev server running?', 'error')
    } finally {
      setPlacing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-40">
        <p className="text-muted">Your cart is empty.</p>
        <Btn className="mt-5" onClick={() => router.push('/shop')}>Go Shopping</Btn>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn max-w-5xl mx-auto px-8 md:px-10 pt-[120px] pb-20">
      <h1 className="font-display text-4xl mb-2">Checkout</h1>

      <div className="flex gap-2 mb-10 items-center flex-wrap">
        {['Shipping', 'Payment', 'Review'].map((s, i) => (
          <div key={s} className="flex items-center gap-2.5">
            <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${step >= i + 1 ? 'bg-rose text-white' : 'bg-surface text-muted border border-border-light'}
              ${step === i + 1 ? 'ring-2 ring-rose-light' : ''}`}
            >{step > i + 1 ? '✓' : i + 1}</div>
            <span className={`text-[13px] ${step >= i + 1 ? 'text-offwhite' : 'text-muted'}`}>{s}</span>
            {i < 2 && <span className="text-border-light mx-1.5">───</span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div>
          {step === 1 && (
            <div className="animate-fadeUp">
              <h2 className="font-display text-2xl mb-5.5">Shipping Details</h2>
              <Input label="Full Name" value={form.name} onChange={e => upd('name', e.target.value)} />
              <Input label="Email" type="email" value={form.email} onChange={e => upd('email', e.target.value)} />
              <Input label="Address" value={form.address} onChange={e => upd('address', e.target.value)} />
              <div className="grid grid-cols-2 gap-3.5">
                <Input label="City" value={form.city} onChange={e => upd('city', e.target.value)} />
                <Input label="ZIP Code" value={form.zip} onChange={e => upd('zip', e.target.value)} />
              </div>
              <Btn className="w-full mt-1.5" onClick={() => setStep(2)} disabled={!form.name || !form.email || !form.address}>Continue to Payment</Btn>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fadeUp">
              <h2 className="font-display text-2xl mb-5.5">Payment Method</h2>
              <div className="grid grid-cols-2 gap-3.5 mb-5.5">
                {[['cash', '💵', 'Cash on Delivery'], ['card', '💳', 'Credit / Debit Card']].map(([m, icon, label]) => (
                  <button key={m} onClick={() => upd('payment', m)}
                    className={`p-4.5 border-2 rounded-sm text-sm font-medium transition-all
                      ${form.payment === m ? 'border-rose bg-rose/10 text-rose-light' : 'border-border-light text-muted'}`}
                  >{icon} {label}</button>
                ))}
              </div>
              {form.payment === 'card' && (
                <div className="animate-fadeUp">
                  <Input label="Card Number" value={form.card} onChange={e => upd('card', e.target.value)} placeholder="•••• •••• •••• ••••" />
                  <div className="grid grid-cols-2 gap-3.5">
                    <Input label="Expiry" value={form.expiry} onChange={e => upd('expiry', e.target.value)} placeholder="MM / YY" />
                    <Input label="CVV" value={form.cvv} onChange={e => upd('cvv', e.target.value)} placeholder="•••" />
                  </div>
                  <p className="text-muted text-xs -mt-2 mb-4">
                    For production, replace this with Stripe Elements (see app/api/payments/create-intent).
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <Btn variant="outline" onClick={() => setStep(1)} className="flex-1">← Back</Btn>
                <Btn onClick={() => setStep(3)} className="flex-[2]">Review Order</Btn>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fadeUp">
              <h2 className="font-display text-2xl mb-5.5">Review Order</h2>
              <div className="bg-surface rounded-md p-5.5 border border-border mb-4">
                <p className="text-muted text-[11px] tracking-wide uppercase mb-2.5">Shipping to</p>
                <p className="text-sm">{form.name} · {form.email}</p>
                <p className="text-sm text-muted">{form.address}, {form.city} {form.zip}</p>
              </div>
              <div className="bg-surface rounded-md p-5.5 border border-border mb-6">
                <p className="text-muted text-[11px] tracking-wide uppercase mb-2.5">Payment</p>
                <p className="text-sm">{form.payment === 'cash' ? '💵 Cash on Delivery' : `💳 Card ending ****${form.card.slice(-4) || '0000'}`}</p>
              </div>
              <div className="flex gap-3">
                <Btn variant="outline" onClick={() => setStep(2)} className="flex-1">← Back</Btn>
                <Btn onClick={placeOrder} loading={placing} className="flex-[2]">Place Order</Btn>
              </div>
            </div>
          )}
        </div>

        <div className="animate-fadeUp bg-surface p-5.5 rounded-md border border-border h-fit sticky top-[100px]">
          <h3 className="font-display text-[19px] mb-4.5">Summary</h3>
          {cart.map(i => (
            <div key={`${i.id}-${i.size}`} className="flex justify-between text-xs mb-2 text-muted">
              <span>{i.name} ×{i.qty}</span><span>${(i.price * i.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-border mt-3.5 pt-3.5">
            <div className="flex justify-between text-[13px] mb-2">
              <span className="text-muted">Subtotal</span><span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[13px] mb-2">
              <span className="text-muted">Shipping</span>
              <span className={shipping === 0 ? 'text-success' : 'text-offwhite'}>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
            </div>
            <div className="flex justify-between text-[19px] font-semibold mt-3.5">
              <span>Total</span><span className="text-rose-light">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
