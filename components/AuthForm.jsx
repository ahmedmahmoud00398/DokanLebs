'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/AuthProvider'
import { Btn, Input, Divider } from '@/components/UI'

const SOCIAL = [
  {
    id: 'google', label: 'Google',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    ),
  },
  {
    id: 'facebook', label: 'Facebook',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: 'azure', label: 'Microsoft',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#00A4EF" d="M13 1h10v10H13z"/>
        <path fill="#7FBA00" d="M1 13h10v10H1z"/><path fill="#FFB900" d="M13 13h10v10H13z"/>
      </svg>
    ),
  },
]

export default function AuthForm({ mode: initialMode }) {
  const [mode, setMode] = useState(initialMode) // login | signup | forgot
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const router = useRouter()
  const auth = useAuth()

  const upd = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: null })) }

  const validate = () => {
    const e = {}
    if (mode !== 'forgot' && !form.email) e.email = 'Email is required'
    if (mode !== 'forgot' && !form.password) e.password = 'Password is required'
    if (mode === 'signup') {
      if (!form.name) e.name = 'Name is required'
      if (form.password.length < 6) e.password = 'Minimum 6 characters'
      if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    setMessage(null)

    if (mode === 'forgot') {
      const { error } = await auth.forgotPassword(form.email)
      setLoading(false)
      if (error) { setErrors({ email: error.message }); return }
      setMessage({ type: 'success', text: 'Check your email for a reset link.' })
      return
    }

    if (mode === 'signup') {
      const { error } = await auth.signUpWithEmail(form.email, form.password, form.name)
      setLoading(false)
      if (error) { setErrors({ email: error.message }); return }
      setMessage({ type: 'success', text: 'Check your email to confirm your account.' })
      return
    }

    const { error } = await auth.signInWithEmail(form.email, form.password)
    setLoading(false)
    if (error) { setErrors({ password: 'Invalid email or password' }); return }
    router.push('/')
  }

  const handleSocial = async (provider) => {
    setLoading(true)
    const fns = { google: auth.signInWithGoogle, facebook: auth.signInWithFacebook, azure: auth.signInWithMicrosoft }
    const { error } = await fns[provider]()
    if (error) { setMessage({ type: 'error', text: error.message }); setLoading(false) }
  }

  const titles = { login: 'Welcome Back', signup: 'Create Account', forgot: 'Reset Password' }
  const subs   = { login: 'Sign in to your VESTIS account', signup: 'Join for exclusive access & order tracking', forgot: "Enter your email and we'll send a reset link" }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative">
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,135,122,.08) 0%, transparent 70%)' }} />

      <div className="animate-scaleIn w-full max-w-[420px] bg-surface rounded-lg p-9 sm:p-10 border border-border shadow-lg relative">
        <p className="font-display text-xl font-light tracking-[6px] text-center mb-7 text-rose-light">VESTIS</p>

        <h1 className="font-display text-[28px] font-light text-center mb-1.5">{titles[mode]}</h1>
        <p className="text-muted text-center text-[13px] mb-7">{subs[mode]}</p>

        {message && (
          <div className={`p-3.5 rounded-sm border text-[13px] mb-5
            ${message.type === 'success' ? 'bg-success/10 border-success/30 text-[#7ec99a]' : 'bg-error/10 border-error/30 text-[#E08080]'}`}>
            {message.text}
          </div>
        )}

        {mode !== 'forgot' && (
          <>
            <div className="flex flex-col gap-2.5 mb-5">
              {SOCIAL.map(s => (
                <button key={s.id} onClick={() => handleSocial(s.id)} disabled={loading}
                  className="flex items-center gap-3 px-4 py-2.5 bg-card border border-border-light rounded-sm text-sm hover:border-rose hover:bg-surface transition-colors disabled:cursor-not-allowed"
                >
                  {s.icon}
                  <span>Continue with {s.label}</span>
                </button>
              ))}
            </div>
            <Divider label="or" />
          </>
        )}

        {mode === 'signup' && (
          <Input label="Full Name" value={form.name} onChange={e => upd('name', e.target.value)} placeholder="Your name" error={errors.name} icon="👤" />
        )}
        <Input label="Email" type="email" value={form.email} onChange={e => upd('email', e.target.value)} placeholder="you@example.com" error={errors.email} icon="✉" />
        {mode !== 'forgot' && (
          <Input label="Password" type="password" value={form.password} onChange={e => upd('password', e.target.value)} placeholder="••••••••" error={errors.password} icon="🔒" />
        )}
        {mode === 'signup' && (
          <Input label="Confirm Password" type="password" value={form.confirm} onChange={e => upd('confirm', e.target.value)} placeholder="••••••••" error={errors.confirm} icon="🔒" />
        )}

        {mode === 'login' && (
          <p className="text-right -mt-2.5 mb-4.5">
            <button onClick={() => setMode('forgot')} className="text-muted text-xs underline">Forgot password?</button>
          </p>
        )}

        <Btn className="w-full mt-1" onClick={handleSubmit} loading={loading}>
          {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
        </Btn>

        <p className="text-center mt-6 text-muted text-[13px]">
          {mode === 'forgot' ? (
            <><span>Remember it? </span><button onClick={() => setMode('login')} className="text-rose-light font-medium">Back to Sign In</button></>
          ) : mode === 'login' ? (
            <><span>New here? </span><Link href="/signup" className="text-rose-light font-medium">Create Account</Link></>
          ) : (
            <><span>Already have one? </span><Link href="/login" className="text-rose-light font-medium">Sign In</Link></>
          )}
        </p>
      </div>
    </div>
  )
}
