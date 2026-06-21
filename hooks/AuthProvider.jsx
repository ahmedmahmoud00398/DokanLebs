'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const supabase = createClient()
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data)
  }, [supabase])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [supabase, fetchProfile])

  const signUpWithEmail = (email, password, fullName) =>
    supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName }, emailRedirectTo: `${location.origin}/auth/callback` },
    })

  const signInWithEmail = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const forgotPassword = (email) =>
    supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/auth/reset-password` })

  const resetPassword = (newPassword) =>
    supabase.auth.updateUser({ password: newPassword })

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/auth/callback` } })

  const signInWithFacebook = () =>
    supabase.auth.signInWithOAuth({ provider: 'facebook', options: { redirectTo: `${location.origin}/auth/callback` } })

  const signInWithMicrosoft = () =>
    supabase.auth.signInWithOAuth({ provider: 'azure', options: { redirectTo: `${location.origin}/auth/callback` } })

  const updateProfile = async (updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single()
    if (data) setProfile(data)
    return { data, error }
  }

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      signUpWithEmail, signInWithEmail, forgotPassword, resetPassword,
      signInWithGoogle, signInWithFacebook, signInWithMicrosoft,
      updateProfile, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
