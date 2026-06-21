'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './AuthProvider'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const supabase = createClient()
  const { user } = useAuth()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)

  const loadCart = useCallback(async () => {
    if (!user) {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('vestis_cart') : null
      if (saved) setCart(JSON.parse(saved))
      return
    }
    setLoading(true)
    const { data } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', user.id)
    if (data) {
      setCart(data.map(item => ({
        id:    item.product_id,
        name:  item.products.name,
        price: item.products.price,
        image: item.products.images?.[0],
        size:  item.size,
        qty:   item.quantity,
      })))
    }
    setLoading(false)
  }, [user, supabase])

  useEffect(() => { loadCart() }, [loadCart])

  useEffect(() => {
    if (!user && typeof window !== 'undefined') localStorage.setItem('vestis_cart', JSON.stringify(cart))
  }, [cart, user])

  const addToCart = async (product, size) => {
    if (user) {
      const existing = cart.find(i => i.id === product.id && i.size === size)
      if (existing) {
        await supabase.from('cart_items').update({ quantity: existing.qty + 1 })
          .eq('user_id', user.id).eq('product_id', product.id).eq('size', size)
      } else {
        await supabase.from('cart_items').insert({ user_id: user.id, product_id: product.id, size, quantity: 1 })
      }
      await loadCart()
    } else {
      setCart(prev => {
        const ex = prev.find(i => i.id === product.id && i.size === size)
        if (ex) return prev.map(i => i.id === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i)
        return [...prev, { id: product.id, name: product.name, price: product.price, image: product.images?.[0], size, qty: 1 }]
      })
    }
  }

  const removeFromCart = async (productId, size) => {
    if (user) {
      await supabase.from('cart_items').delete()
        .eq('user_id', user.id).eq('product_id', productId).eq('size', size)
    }
    setCart(prev => prev.filter(i => !(i.id === productId && i.size === size)))
  }

  const updateQty = async (productId, size, delta) => {
    const item = cart.find(i => i.id === productId && i.size === size)
    if (!item) return
    const newQty = Math.max(1, item.qty + delta)
    if (user) {
      await supabase.from('cart_items').update({ quantity: newQty })
        .eq('user_id', user.id).eq('product_id', productId).eq('size', size)
    }
    setCart(prev => prev.map(i => i.id === productId && i.size === size ? { ...i, qty: newQty } : i))
  }

  const clearCart = async () => {
    if (user) await supabase.from('cart_items').delete().eq('user_id', user.id)
    setCart([])
    if (typeof window !== 'undefined') localStorage.removeItem('vestis_cart')
  }

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
