'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/AuthProvider'
import { useToast } from '@/hooks/ToastProvider'
import { createClient } from '@/lib/supabase/client'
import { Btn, Input, Badge } from '@/components/UI'

const TABS = [
  { id: 'details', label: 'My Details' },
  { id: 'addresses', label: 'Addresses' },
  { id: 'payments', label: 'Payment Methods' },
]

export default function ProfilePage() {
  const { user, profile, updateProfile, signOut, loading: authLoading } = useAuth()
  const { notify } = useToast()
  const router = useRouter()

  const [tab, setTab] = useState('details')
  const [form, setForm] = useState({ full_name: '', phone: '' })
  const [addresses, setAddresses] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [newAddr, setNewAddr] = useState({ label: 'Home', full_name: '', street: '', city: '', country: 'Egypt' })
  const [newCard, setNewCard] = useState({ card_brand: 'Visa', number: '', expiry_month: '', expiry_year: '', is_default: false })
  const [saving, setSaving] = useState(false)

  useEffect(() => { setForm({ full_name: profile?.full_name || '', phone: profile?.phone || '' }) }, [profile])

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase.from('addresses').select('*').eq('user_id', user.id).then(({ data }) => setAddresses(data || []))
    supabase.from('payment_methods').select('*').eq('user_id', user.id).then(({ data }) => setPaymentMethods(data || []))
  }, [user, tab])

  useEffect(() => {
    if (!authLoading && !user) router.push('/login')
  }, [authLoading, user, router])

  const saveDetails = async () => {
    setSaving(true)
    const { error } = await updateProfile(form)
    setSaving(false)
    notify(error ? (error.message || 'Could not save changes') : 'Profile updated!', error ? 'error' : 'success')
  }

  const saveAddress = async () => {
    if (!newAddr.full_name || !newAddr.street || !newAddr.city) { notify('Fill in all address fields', 'error'); return }
    const supabase = createClient()
    const { data, error } = await supabase.from('addresses').insert({ ...newAddr, user_id: user.id }).select().single()
    if (!error) {
      setAddresses(a => [...a, data])
      setNewAddr({ label: 'Home', full_name: '', street: '', city: '', country: 'Egypt' })
      notify('Address saved!')
    } else notify('Could not save address', 'error')
  }

  const deleteAddress = async (id) => {
    const supabase = createClient()
    await supabase.from('addresses').delete().eq('id', id)
    setAddresses(a => a.filter(x => x.id !== id))
  }

  const saveCard = async () => {
    const digits = newCard.number.replace(/\s/g, '')
    if (digits.length < 12) { notify('Enter a valid card number', 'error'); return }
    if (!newCard.expiry_month || !newCard.expiry_year) { notify('Enter the expiry date', 'error'); return }

    const supabase = createClient()
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: user.id,
        card_brand: newCard.card_brand,
        last_four: digits.slice(-4),
        expiry_month: Number(newCard.expiry_month),
        expiry_year: Number(newCard.expiry_year),
        is_default: paymentMethods.length === 0 ? true : newCard.is_default,
      })
      .select()
      .single()

    if (error) { notify('Could not save card', 'error'); return }
    setPaymentMethods(p => [...p, data])
    setNewCard({ card_brand: 'Visa', number: '', expiry_month: '', expiry_year: '', is_default: false })
    notify('Card saved!')
  }

  const deleteCard = async (id) => {
    const supabase = createClient()
    await supabase.from('payment_methods').delete().eq('id', id)
    setPaymentMethods(p => p.filter(x => x.id !== id))
  }

  if (!user) return null

  return (
    <div className="animate-fadeIn max-w-4xl mx-auto px-8 md:px-10 pt-[120px] pb-20">
      <div className="animate-fadeUp flex items-center gap-5.5 mb-10 flex-wrap">
        <div className="w-[76px] h-[76px] rounded-full bg-gradient-to-br from-rose-dark to-gold flex items-center justify-center text-[28px] font-semibold text-white">
          {(profile?.full_name || user.email)[0].toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-[28px]">{profile?.full_name || 'Welcome'}</h1>
          <p className="text-muted text-sm">{user.email}</p>
        </div>
        <Btn variant="outline" size="sm" className="ml-auto" onClick={async () => { await signOut(); router.push('/') }}>Sign Out</Btn>
      </div>

      <div className="flex border-b border-border mb-8 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5.5 py-3 text-[13px] whitespace-nowrap border-b-2 transition-colors
              ${tab === t.id ? 'text-rose-light border-rose font-semibold' : 'text-muted border-transparent font-normal'}`}
          >{t.label}</button>
        ))}
      </div>

      {tab === 'details' && (
        <div className="animate-fadeUp max-w-[460px]">
          <Input label="Full Name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
          <Input label="Email" value={user.email} onChange={() => {}} className="opacity-60" />
          <Input label="Phone Number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+20 ..." />
          <Btn onClick={saveDetails} loading={saving} className="mt-1.5">Save Changes</Btn>
        </div>
      )}

      {tab === 'addresses' && (
        <div className="animate-fadeUp">
          {addresses.map(a => (
            <div key={a.id} className="bg-surface border border-border rounded-md p-4.5 mb-3.5 flex justify-between">
              <div>
                <Badge label={a.label} variant="gold" className="mb-2" />
                <p className="text-sm">{a.full_name}</p>
                <p className="text-[13px] text-muted">{a.street}, {a.city}, {a.country}</p>
              </div>
              <button onClick={() => deleteAddress(a.id)} className="text-muted text-xs h-fit hover:text-error transition-colors">Remove</button>
            </div>
          ))}

          <div className="bg-surface border border-dashed border-border-light rounded-md p-5.5 max-w-[460px] mt-5">
            <p className="text-[13px] text-muted mb-4 tracking-wide uppercase">Add New Address</p>
            <Input label="Full Name" value={newAddr.full_name} onChange={e => setNewAddr(a => ({ ...a, full_name: e.target.value }))} />
            <Input label="Street Address" value={newAddr.street} onChange={e => setNewAddr(a => ({ ...a, street: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3.5">
              <Input label="City" value={newAddr.city} onChange={e => setNewAddr(a => ({ ...a, city: e.target.value }))} />
              <Input label="Country" value={newAddr.country} onChange={e => setNewAddr(a => ({ ...a, country: e.target.value }))} />
            </div>
            <Btn onClick={saveAddress}>Save Address</Btn>
          </div>
        </div>
      )}

      {tab === 'payments' && (
        <div className="animate-fadeUp">
          {paymentMethods.length === 0 ? (
            <p className="text-muted mb-5">No saved payment methods yet.</p>
          ) : paymentMethods.map(pm => (
            <div key={pm.id} className="bg-surface border border-border rounded-md p-5 max-w-[360px] mb-4 relative">
              <div className="flex justify-between mb-3">
                <span className="text-xs text-muted tracking-[2px]">{pm.card_brand?.toUpperCase()}</span>
                {pm.is_default && <Badge label="Default" variant="gold" />}
              </div>
              <p className="text-base tracking-[4px]">•••• •••• •••• {pm.last_four}</p>
              <p className="text-muted text-xs mt-2">Expires {pm.expiry_month}/{pm.expiry_year}</p>
              <button onClick={() => deleteCard(pm.id)} className="absolute top-5 right-5 text-muted text-xs hover:text-error transition-colors">Remove</button>
            </div>
          ))}

          <div className="bg-surface border border-dashed border-border-light rounded-md p-5.5 max-w-[460px] mt-5">
            <p className="text-[13px] text-muted mb-4 tracking-wide uppercase">Add New Card</p>
            <div className="grid grid-cols-2 gap-3.5">
              <div className="mb-4.5">
                <label className="block text-[11px] font-medium tracking-wider uppercase mb-1.5 text-muted">Card Brand</label>
                <select
                  value={newCard.card_brand}
                  onChange={e => setNewCard(c => ({ ...c, card_brand: e.target.value }))}
                  className="w-full bg-surface border border-border-light rounded-sm text-offwhite text-sm px-3.5 py-3 outline-none focus:border-rose"
                >
                  <option>Visa</option>
                  <option>Mastercard</option>
                  <option>American Express</option>
                </select>
              </div>
              <Input label="Card Number" value={newCard.number} onChange={e => setNewCard(c => ({ ...c, number: e.target.value }))} placeholder="•••• •••• •••• ••••" />
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <Input label="Expiry Month" value={newCard.expiry_month} onChange={e => setNewCard(c => ({ ...c, expiry_month: e.target.value }))} placeholder="MM" />
              <Input label="Expiry Year" value={newCard.expiry_year} onChange={e => setNewCard(c => ({ ...c, expiry_year: e.target.value }))} placeholder="YYYY" />
            </div>
            <Btn onClick={saveCard}>Save Card</Btn>
          </div>

          <p className="text-muted text-[13px] mt-5 max-w-[460px] leading-6">
            ⚠️ Cards saved here are for display/checkout convenience only — no real charges are processed yet.
            Wire up Stripe in <code className="text-rose-light">app/api/payments/create-intent</code> to enable
            real card payments and tokenized (PCI-compliant) card storage.
          </p>
        </div>
      )}
    </div>
  )
}
