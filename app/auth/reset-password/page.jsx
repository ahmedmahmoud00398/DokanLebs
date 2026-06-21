'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/AuthProvider'
import { Btn, Input } from '@/components/UI'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const auth = useAuth()

  const submit = async () => {
    if (password.length < 6) { setError('Minimum 6 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    const { error: err } = await auth.resetPassword(password)
    setLoading(false)
    if (err) { setError(err.message); return }
    setDone(true)
    setTimeout(() => router.push('/'), 1800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="animate-scaleIn w-full max-w-[400px] bg-surface rounded-lg p-9 sm:p-10 border border-border">
        <h1 className="font-display text-[26px] font-light text-center mb-2">Set New Password</h1>
        <p className="text-muted text-[13px] text-center mb-7">Choose a strong new password for your account</p>

        {done ? (
          <div className="text-center text-[#7ec99a] py-5">✓ Password updated! Redirecting…</div>
        ) : (
          <>
            <Input label="New Password" type="password" value={password} onChange={e => { setPassword(e.target.value); setError(null) }} placeholder="••••••••" error={error} icon="🔒" />
            <Input label="Confirm Password" type="password" value={confirm} onChange={e => { setConfirm(e.target.value); setError(null) }} placeholder="••••••••" icon="🔒" />
            <Btn className="w-full mt-1" onClick={submit} loading={loading}>Update Password</Btn>
          </>
        )}
      </div>
    </div>
  )
}
