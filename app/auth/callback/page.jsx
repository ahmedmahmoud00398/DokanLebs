'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Spinner } from '@/components/UI'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/')
      } else {
        setTimeout(async () => {
          const { data: { session: s2 } } = await supabase.auth.getSession()
          router.replace(s2 ? '/' : '/login')
        }, 800)
      }
    }
    check()
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Spinner size={40} />
      <p className="text-muted text-sm">Signing you in…</p>
    </div>
  )
}
