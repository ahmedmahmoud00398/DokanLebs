'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/hooks/CartProvider'
import { Btn } from './UI'

export default function CartDrawer({ onClose }) {
  const router = useRouter()
  const { cart, cartTotal, removeFromCart, updateQty } = useCart()
  const shipping = cartTotal > 150 ? 0 : 15
  const total = cartTotal + shipping

  const go = (path) => { onClose(); router.push(path) }

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/70 z-[800] animate-fadeIn" />

      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-surface border-l border-border z-[900] flex flex-col animate-slideRight">
        <div className="px-6 py-5 border-b border-border flex justify-between items-center">
          <span className="font-display text-[22px] font-light">
            Your Cart <span className="text-muted text-base">({cart.length})</span>
          </span>
          <button onClick={onClose} className="text-muted hover:text-offwhite text-xl transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center pt-20">
              <div className="text-5xl mb-4 animate-float">🛍</div>
              <p className="text-muted mb-6">Your cart is empty</p>
              <Btn onClick={() => go('/shop')}>Start Shopping</Btn>
            </div>
          ) : (
            <div className="stagger">
              {cart.map(item => (
                <CartItem key={`${item.id}-${item.size}`} item={item} removeFromCart={removeFromCart} updateQty={updateQty} />
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-border bg-card">
            <div className="flex justify-between mb-2 text-[13px] text-muted">
              <span>Subtotal</span><span className="text-offwhite">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-[13px] text-muted">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'text-success' : 'text-offwhite'}>{shipping === 0 ? 'FREE' : `$${shipping}`}</span>
            </div>
            <div className="flex justify-between mb-5">
              <span className="text-base font-semibold">Total</span>
              <span className="text-xl font-semibold text-rose-light">${total.toFixed(2)}</span>
            </div>
            <Btn className="w-full mb-2.5" onClick={() => go('/checkout')}>Checkout</Btn>
            <Btn variant="outline" className="w-full" onClick={() => go('/cart')}>View Full Cart</Btn>
          </div>
        )}
      </div>
    </>
  )
}

function CartItem({ item, removeFromCart, updateQty }) {
  return (
    <div className="flex gap-3.5 pb-4.5 mb-4.5 border-b border-border animate-fadeUp">
      <img src={item.image} alt={item.name} className="w-18 h-[90px] object-cover rounded-sm shrink-0" style={{ width: 72, height: 90 }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium mb-1 truncate">{item.name}</p>
        <p className="text-muted text-xs mb-2.5">Size: {item.size}</p>
        <div className="flex items-center gap-2.5">
          <button onClick={() => updateQty(item.id, item.size, -1)} className="bg-border-light text-offwhite w-6 h-6 rounded text-sm flex items-center justify-center hover:bg-rose-dark transition-colors">−</button>
          <span className="text-sm min-w-[18px] text-center">{item.qty}</span>
          <button onClick={() => updateQty(item.id, item.size, 1)} className="bg-border-light text-offwhite w-6 h-6 rounded text-sm flex items-center justify-center hover:bg-rose-dark transition-colors">+</button>
        </div>
      </div>
      <div className="flex flex-col items-end justify-between shrink-0">
        <span className="text-rose-light font-semibold text-[15px]">${(item.price * item.qty).toFixed(2)}</span>
        <button onClick={() => removeFromCart(item.id, item.size)} className="text-muted text-[11px] underline hover:text-error transition-colors">Remove</button>
      </div>
    </div>
  )
}
