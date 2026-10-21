'use client';

import { useState } from 'react';
import { Check, Save } from 'lucide-react';
import { PageHeading } from './admin-ui';
import styles from './admin.module.css';

const initialSettings = {
  storeName: 'Dokan Lebss',
  email: 'hello@dokanlebss.com',
  currency: 'EGP — Egyptian Pound',
  timezone: 'Africa/Cairo (GMT+2)',
  address: 'Alexandria, Egypt',
  shippingRate: '85',
  freeShippingThreshold: '1500',
  codEnabled: true,
  cardsEnabled: true,
  notifyOrders: true,
  notifyLowStock: true,
};

const tabs = ['General', 'Payments', 'Shipping', 'Notifications'];

export function Settings() {
  const [settings, setSettings] = useState(initialSettings);
  const [team, setTeam] = useState([
    { name: 'Ahmed Mahmoud', role: 'Store owner' },
    { name: 'Nour Fathy', role: 'Administrator' },
    { name: 'Mariam Adel', role: 'Administrator' },
  ]);
  const [activeTab, setActiveTab] = useState('General');
  const [saved, setSaved] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const set = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  return (
    <>
      <PageHeading title="Settings" description="Manage your store preferences and business details." action={
        <button className={styles.primaryButton} onClick={() => setSaved(true)}><Save size={15} /> Save changes</button>
      } />
      {saved && <p className={styles.formSuccess} role="status"><Check size={15} /> Changes saved in this browser preview.</p>}
      <div className={styles.settingsTabs} role="tablist" aria-label="Settings sections">
        {tabs.map((tab) => <button key={tab} role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? styles.settingsTabActive : ''} onClick={() => setActiveTab(tab)}>{tab}</button>)}
      </div>
      {activeTab === 'General' && <div className={styles.settingsGrid}>
        <section className={styles.panel}>
          <div className={styles.sectionTitle}><h2>Store Information</h2><p>Update the basic information shown to your customers.</p></div>
          <label className={styles.formField}>Store name<input value={settings.storeName} onChange={(event) => set('storeName', event.target.value)} /></label>
          <label className={styles.formField}>Store email<input type="email" value={settings.email} onChange={(event) => set('email', event.target.value)} /></label>
          <label className={styles.formField}>Store address<input value={settings.address} onChange={(event) => set('address', event.target.value)} /></label>
          <div className={styles.formTwoCol}><label className={styles.formField}>Currency<select value={settings.currency} onChange={(event) => set('currency', event.target.value)}><option>EGP — Egyptian Pound</option><option>USD — US Dollar</option></select></label><label className={styles.formField}>Timezone<select value={settings.timezone} onChange={(event) => set('timezone', event.target.value)}><option>Africa/Cairo (GMT+2)</option><option>UTC (GMT+0)</option></select></label></div>
        </section>
        <section className={styles.panel}><div className={styles.sectionTitle}><h2>Team Access</h2><p>People who can manage this store.</p></div>
          {team.map(({ name, role }) => <div className={styles.teamMember} key={name}><span className={styles.avatar}>{name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span><span><strong>{name}</strong><small>{role}</small></span>{role !== 'Store owner' && <button aria-label={`Change ${name} access role`} onClick={() => setTeam((current) => current.map((member) => member.name === name ? { ...member, role: member.role === 'Administrator' ? 'Editor' : 'Administrator' } : member))}>Change</button>}</div>)}
          {inviteOpen ? <div className={styles.inviteForm}><label className={styles.formField}>Team member email<input type="email" value={inviteEmail} onChange={(event) => { setInviteEmail(event.target.value); setInviteError(''); }} placeholder="name@example.com" /></label>{inviteError && <small className={styles.inviteError}>{inviteError}</small>}<div><button className={styles.primaryButton} onClick={() => { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) { setInviteError('Enter a valid email address.'); return; } setTeam((current) => [...current, { name: inviteEmail.split('@')[0], role: 'Administrator' }]); setInviteEmail(''); setInviteOpen(false); }}>Add member</button><button className={styles.textButton} onClick={() => setInviteOpen(false)}>Cancel</button></div></div> : <button className={styles.secondaryButton} onClick={() => setInviteOpen(true)}>+ Invite team member</button>}
        </section>
      </div>}
      {activeTab === 'Payments' && <section className={`${styles.panel} ${styles.settingsNarrow}`}><div className={styles.sectionTitle}><h2>Payment Methods</h2><p>Choose which payment options are available at checkout.</p></div><ToggleRow label="Credit and debit cards" description="Accept Visa and Mastercard payments." checked={settings.cardsEnabled} onChange={(value) => set('cardsEnabled', value)} /><ToggleRow label="Cash on delivery" description="Allow customers to pay when their order arrives." checked={settings.codEnabled} onChange={(value) => set('codEnabled', value)} /></section>}
      {activeTab === 'Shipping' && <section className={`${styles.panel} ${styles.settingsNarrow}`}><div className={styles.sectionTitle}><h2>Shipping Options</h2><p>Set the default delivery rates for your store.</p></div><label className={styles.formField}>Standard shipping rate (EGP)<input type="number" value={settings.shippingRate} onChange={(event) => set('shippingRate', event.target.value)} /></label><label className={styles.formField}>Free shipping for orders over (EGP)<input type="number" value={settings.freeShippingThreshold} onChange={(event) => set('freeShippingThreshold', event.target.value)} /></label><ToggleRow label="Enable free shipping threshold" description="Offer free delivery when an order reaches the amount above." checked={Boolean(settings.freeShippingThreshold)} onChange={(value) => set('freeShippingThreshold', value ? '1500' : '')} /></section>}
      {activeTab === 'Notifications' && <section className={`${styles.panel} ${styles.settingsNarrow}`}><div className={styles.sectionTitle}><h2>Notifications</h2><p>Choose the updates you want to receive.</p></div><ToggleRow label="New orders" description="Get notified whenever a customer places an order." checked={settings.notifyOrders} onChange={(value) => set('notifyOrders', value)} /><ToggleRow label="Low stock alerts" description="Get notified when products are running low." checked={settings.notifyLowStock} onChange={(value) => set('notifyLowStock', value)} /></section>}
      <div className={styles.settingsFooter}><span>Settings are stored in this page only.</span><button className={styles.primaryButton} onClick={() => setSaved(true)}><Save size={15} /> Save changes</button></div>
    </>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return <div className={styles.toggleRow}><span><strong>{label}</strong><small>{description}</small></span><button type="button" role="switch" aria-checked={checked} aria-label={label} className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`} onClick={() => onChange(!checked)}><i /></button></div>;
}
