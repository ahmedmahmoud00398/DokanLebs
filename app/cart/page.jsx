'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/CartProvider'
import { Btn } from '@/components/UI'

export default function CartPage() {
  const router = useRouter()
  const { cart, cartTotal, removeFromCart, updateQty } = useCart()
  const shipping = cartTotal > 150 ? 0 : 15
  const total = cartTotal + shipping

  return (
    <div className="animate-fadeIn max-w-5xl mx-auto px-8 md:px-10 pt-[120px] pb-20">
      <h1 className="font-display text-4xl mb-9">Shopping <em className="text-rose-light not-italic italic">Cart</em></h1>

      {cart.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-5 animate-float">🛍</div>
          <p className="text-muted mb-7 text-base">Your cart is empty</p>
          <Btn onClick={() => router.push('/shop')}>Continue Shopping</Btn>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          <div className="stagger">
            {cart.map(item => (
              <div key={`${item.id}-${item.size}`} className="animate-fadeUp flex gap-4.5 py-5.5 border-b border-border">
                <img src={item.image} alt={item.name} className="w-[110px] h-[130px] object-cover rounded-sm" />
                <div className="flex-1">
                  <p className="font-medium mb-1 text-base">{item.name}</p>
                  <p className="text-muted text-[13px] mb-3.5">Size: {item.size}</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQty(item.id, item.size, -1)} className="bg-surface border border-border-light text-offwhite w-[30px] h-[30px] rounded-sm text-base">−</button>
                    <span className="min-w-[20px] text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.size, 1)} className="bg-surface border border-border-light text-offwhite w-[30px] h-[30px] rounded-sm text-base">+</button>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <span className="text-rose-light font-semibold text-[19px]">${(item.price * item.qty).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.id, item.size)} className="text-muted text-xs underline hover:text-error transition-colors">Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="animate-fadeUp bg-surface p-7 rounded-md border border-border h-fit sticky top-[100px]">
            <h3 className="font-display text-[22px] mb-5.5">Order Summary</h3>
            {cart.map(i => (
              <div key={`${i.id}-${i.size}`} className="flex justify-between text-[13px] mb-2 text-muted">
                <span>{i.name} ×{i.qty}</span><span>${(i.price * i.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-border mt-4.5 pt-4.5">
              <div className="flex justify-between mb-2.5 text-[13px]">
                <span className="text-muted">Shipping</span>
                <span className={shipping === 0 ? 'text-success' : 'text-offwhite'}>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
              </div>
              <div className="flex justify-between mt-3.5 text-[22px] font-semibold">
                <span>Total</span><span className="text-rose-light">${total.toFixed(2)}</span>
              </div>
            </div>
            <Btn className="w-full mt-6" onClick={() => router.push('/checkout')}>Checkout</Btn>
            <Btn variant="outline" className="w-full mt-2.5" onClick={() => router.push('/shop')}>Continue Shopping</Btn>
          </div>
        </div>
      )}
    </div>
  )
}
