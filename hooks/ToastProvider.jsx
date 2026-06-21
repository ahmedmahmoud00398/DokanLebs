'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const notify = useCallback((msg, type = 'success') => setToast({ msg, type, id: Date.now() }), [])

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      {toast && <ToastView key={toast.id} {...toast} onClose={() => setToast(null)} />}
    </ToastContext.Provider>
  )
}

function ToastView({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  const styles = {
    success: 'bg-[#1A2E22] border-[#2E5040] text-[#7ec99a]',
    error:   'bg-[#2E1A1A] border-[#5C2C2C] text-[#E08080]',
    info:    'bg-[#1A1E2E] border-[#2C3260] text-[#8096E0]',
  }

  return (
    <div className={`fixed top-[88px] right-6 z-[9999] ${styles[type] || styles.info} border px-5 py-3.5 rounded-md text-sm font-medium shadow-lg flex items-center gap-2.5 max-w-[340px] animate-fadeUp`}>
      <span>{type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      {msg}
      <button onClick={onClose} className="ml-auto opacity-60 hover:opacity-100">✕</button>
    </div>
  )
}

export const useToast = () => useContext(ToastContext)
