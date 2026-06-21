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

    if (error) {
      console.error('Profile update failed:', error.message)
      return { data: null, error }
    }
    if (!data) {
      // Update ran but matched/returned 0 rows — almost always an RLS policy
      // missing WITH CHECK, or the profiles row doesn't exist yet for this user.
      const err = { message: 'Update did not apply — check Supabase RLS policy on profiles (needs WITH CHECK) or that a profiles row exists for this user.' }
      console.error(err.message)
      return { data: null, error: err }
    }
    setProfile(data)
    return { data, error: null }
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
