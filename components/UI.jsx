'use client'

import { useState } from 'react'

// ─── Button ────────────────────────────────────────────────────
const SIZE_CLS = { sm: 'px-4.5 py-2 text-[13px]', md: 'px-7 py-3 text-sm', lg: 'px-10 py-4 text-[15px]' }
const VARIANT_CLS = {
  primary: 'bg-gradient-to-br from-rose to-rose-dark text-white shadow-[0_2px_16px_rgba(201,135,122,.25)]',
  outline: 'bg-transparent text-offwhite border border-border-light',
  ghost:   'bg-transparent text-rose border border-rose',
  gold:    'bg-gradient-to-br from-gold to-rose-dark text-white',
  surface: 'bg-surface text-offwhite border border-border',
  danger:  'bg-transparent text-error border border-error',
}

export function Btn({ children, onClick, variant = 'primary', size = 'md', className = '', disabled, loading, type = 'button' }) {
  return (
    <button
      type={type} onClick={onClick} disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-sm font-medium tracking-wide transition-all duration-200 hover:brightness-110 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${SIZE_CLS[size]} ${VARIANT_CLS[variant]} ${className}`}
    >
      {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {children}
    </button>
  )
}

// ─── Input ────────────────────────────────────────────────────
export function Input({ label, type = 'text', value, onChange, placeholder, error, hint, icon, className = '' }) {
  const [focused, setFocused] = useState(false)
  return (
    <div className={`mb-4.5 ${className}`}>
      {label && (
        <label className={`block text-[11px] font-medium tracking-wider uppercase mb-1.5 transition-colors ${focused ? 'text-rose-light' : 'text-muted'}`}>
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-base pointer-events-none">{icon}</span>}
        <input
          type={type} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className={`w-full bg-surface rounded-sm text-offwhite text-sm transition-all outline-none border
            ${icon ? 'pl-[42px] pr-3.5 py-3' : 'px-3.5 py-3'}
            ${error ? 'border-error' : focused ? 'border-rose shadow-[0_0_0_3px_rgba(201,135,122,.12)]' : 'border-border-light'}`}
        />
      </div>
      {error && <p className="text-error text-xs mt-1.5">{error}</p>}
      {hint && !error && <p className="text-muted text-xs mt-1.5">{hint}</p>}
    </div>
  )
}

// ─── Badge ────────────────────────────────────────────────────
const BADGE_CLS = {
  rose:    'bg-rose/15 text-rose-light',
  gold:    'bg-gold/15 text-gold-light',
  success: 'bg-success/15 text-[#7ec99a]',
  solid:   'bg-rose text-white',
  outline: 'bg-transparent text-rose border border-rose',
}

export function Badge({ label, variant = 'rose', className = '' }) {
  return (
    <span className={`inline-block text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full ${BADGE_CLS[variant] || BADGE_CLS.rose} ${className}`}>
      {label}
    </span>
  )
}

// ─── Stars ────────────────────────────────────────────────────
export function Stars({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gold text-[13px] tracking-wide">
        {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      </span>
      <span className="text-gold text-[13px]">{Number(rating).toFixed(1)}</span>
      {count !== undefined && <span className="text-muted text-xs">({count})</span>}
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────
export function Spinner({ size = 32 }) {
  return (
    <div
      className="border-2 border-border-light border-t-rose rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  )
}

// ─── Divider ──────────────────────────────────────────────────
export function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-border-light" />
      {label && <span className="text-muted text-xs tracking-wide">{label}</span>}
      <div className="flex-1 h-px bg-border-light" />
    </div>
  )
}
