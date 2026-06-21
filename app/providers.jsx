'use client'

import { AuthProvider } from '@/hooks/AuthProvider'
import { CartProvider } from '@/hooks/CartProvider'
import { ToastProvider } from '@/hooks/ToastProvider'

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  )
}
