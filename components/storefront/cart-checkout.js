'use client';
import { useEffect, useState } from 'react';
import { Minus, Plus, UserRound } from 'lucide-react';
import { t } from './data';

import { addressService, orderService } from '@/lib/store-services';
export function Cart({ ar, items, checkout, update, remove, shop }) {
    const label = (x) => t(ar, x);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return (
      <main className="cart-page">
        <div className="cart-title"><h1>{label('Bag')}</h1></div>
        {items.length ? (
          items.map((item) => {
            const itemKey = `${item.id}-${item.size}-${item.color}`;
            return (
              <div className="cart-row" key={itemKey}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h2>{t(ar, item.name)}</h2>
                  <p>{t(ar, item.color)} / {item.size}</p>
                  <p>{item.price * item.quantity} LE</p>
                  <div className="quantity">
                    <button
                      aria-label={ar ? 'تقليل الكمية' : 'Decrease'}
                      onClick={() => update(itemKey, -1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      aria-label={ar ? 'زيادة الكمية' : 'Increase'}
                      onClick={() => update(itemKey, 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button className="text-link" onClick={() => remove(itemKey)}>
                    {label('Remove')}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <>
            <p>{label('Your bag is empty.')}</p>
            <button className="black-button" onClick={shop}>{label('Shop Now')}</button>
          </>
        )}
        <button
          className="black-button"
          disabled={!items.length}
          onClick={checkout}
        >
          {label('Checkout')} ({subtotal}) LE
        </button>
      </main>
    );
}

export function Checkout({ ar, items }) {
    const label = (english) => t(ar, english);
    const empty = { country: '', firstName: '', lastName: '', name: '', phone: '', address: '', city: '', governorate: 'Alexandria' };
    const [addresses, setAddresses] = useState([]);
    const [selected, setSelected] = useState('');
    const [form, setForm] = useState(empty);
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const rates = { Alexandria: 85, 'Cairo/Giza': 100, Beheira: 95, Other: 150 };
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = items.length ? rates[form.governorate] : 0;
    const total = subtotal + shipping;
    const name = (form.firstName + ' ' + form.lastName).trim();

    useEffect(() => {
        const saved = addressService.list();
        setAddresses(saved);
        const initial = saved.find((item) => item.default) || saved[0];
        if (initial) {
            const split = (initial.name || '').split(' ');
            setSelected(initial.id);
            setForm({ ...empty, ...initial, firstName: split.shift() || '', lastName: split.join(' ') });
        }
    }, []);

    const persist = (next) => { setAddresses(next); addressService.save(next); };
    const pick = (address) => {
        const split = (address.name || '').split(' ');
        setSelected(address.id);
        setForm({ ...empty, ...address, firstName: split.shift() || '', lastName: split.join(' ') });
        setError('');
    };
    const saveAddress = () => {
        if (!form.country.trim() || !name || !form.phone.trim() || !form.address.trim() || !form.city.trim()) {
            setError(ar ? 'يرجى إكمال جميع بيانات التوصيل.' : 'Complete all shipping fields before saving.');
            return false;
        }
        const id = selected || (globalThis.crypto?.randomUUID?.() || String(Date.now()));
        const previous = addresses.find((item) => item.id === id);
        const address = { ...form, name, id, default: previous?.default ?? addresses.length === 0 };
        persist(previous ? addresses.map((item) => item.id === id ? address : item) : [...addresses, address]);
        setSelected(id);
        setError('');
        return true;
    };
    const removeAddress = (id) => {
        if (!window.confirm(ar ? 'هل تريد حذف هذا العنوان؟' : 'Delete this saved address?')) return;
        const next = addresses.filter((item) => item.id !== id);
        if (addresses.find((item) => item.id === id)?.default && next.length) next[0] = { ...next[0], default: true };
        persist(next);
        if (selected === id) { setSelected(''); setForm(empty); }
    };
    const setDefault = (id) => persist(addresses.map((item) => ({ ...item, default: item.id === id })));
    const submit = async (event) => {
        event.preventDefault();
        setError('');
        if (saving) return;
        if (!items.length) return setError(ar ? 'السلة فارغة.' : 'Your cart is empty.');
        if (!form.country.trim() || !name || !form.phone.trim() || !form.address.trim() || !form.city.trim()) return setError(ar ? 'يرجى إكمال بيانات التوصيل.' : 'Complete the shipping address before continuing.');
        if (remember && !saveAddress()) return;
        setSaving(true);
        try {
            const result = await orderService.create({ items, shippingAddress: { ...form, name, id: selected || 'unsaved-address' }, shippingFee: shipping, paymentMethod: 'cash' });
            if (!result.ok) setError(result.error);
        } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Order submission is unavailable.');
        } finally { setSaving(false); }
    };

    return <main className="checkout checkout-reference">
        <section className="checkout-delivery">
            <h1>{label('Delivery')}</h1>
            {addresses.length > 0 && <div className="saved-addresses"><h2>{label('Saved addresses')} <small>({label('on this device')})</small></h2>{addresses.map((address) => <div className="saved-address" key={address.id}><button type="button" className={selected === address.id ? 'selected' : ''} onClick={() => pick(address)} aria-pressed={selected === address.id}>{address.default ? '★ ' : ''}{address.name}, {address.address}, {address.city}</button><button type="button" className="text-link" onClick={() => removeAddress(address.id)}>{label('Delete')}</button><button type="button" className="text-link" onClick={() => setDefault(address.id)}>{label('Make default')}</button></div>)}</div>}
            <button type="button" className="text-link" onClick={() => { setSelected(''); setForm(empty); setError(''); }}>{label('Add a new address')}</button>
            <form onSubmit={submit}>
                <label>{label('Country')}<input required autoComplete="country-name" placeholder={label('Country / Region')} value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} /></label>
                <div className="checkout-name-row"><label>{label('First Name')}<input required autoComplete="given-name" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} /></label><label>{label('Last Name')}<input required autoComplete="family-name" value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} /></label></div>
                <label>{label('Address')}<input required autoComplete="street-address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></label>
                <div className="checkout-name-row"><label>{label('City')}<input required autoComplete="address-level2" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} /></label><label>{label('Governorate')}<select value={form.governorate} onChange={(event) => setForm({ ...form, governorate: event.target.value })}>{Object.entries(rates).map(([region, rate]) => <option key={region} value={region}>{label(region)} · {rate}.00 LE</option>)}</select></label></div>
                <label>{label('Phone')}<input dir="ltr" required type="tel" autoComplete="tel" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
                <label className="remember-address"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />{label('Save this information for next time')}</label>
                <button type="button" className="text-link" onClick={saveAddress}>{label('Save address')}</button>
                <h2>{label('Shipping Method')}</h2><p className="shipping-choice">{label(form.governorate)}<span>{shipping}.00 LE</span></p>
                <h2>{label('Payment Method')}</h2><div className="checkout-payment"><span>{label('Cash On Delivery')}</span><b aria-hidden="true">✓</b></div>
                <p className="payment-unavailable">{label('Card payment will be available when a payment provider is connected.')}</p>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button className="black-button" type="submit" disabled={saving || !items.length}>{saving ? (ar ? 'جارٍ التحقق…' : 'Checking…') : (ar ? 'إتمام الطلب' : 'Complete Order')}</button>
            </form>
        </section>
        <aside className="checkout-summary"><div className="checkout-summary-items">{items.map((item) => <div className="checkout-summary-item" key={item.id + '-' + item.size + '-' + item.color}><img src={item.image} alt="" /><span>{t(ar, item.name)} × {item.quantity}</span><strong>{item.price * item.quantity} LE</strong></div>)}</div>
            <p className="summary-total"><span>{ar ? `إجمالي المنتجات ${items.reduce((sum, item) => sum + item.quantity, 0)}` : 'Total Items ' + items.reduce((sum, item) => sum + item.quantity, 0)}</span><span>{subtotal} LE</span></p>
            <p className="summary-total"><span>{ar ? 'الشحن' : 'Shipping'}</span><span>{shipping}.00 LE</span></p>
            <p className="summary-total total-line"><strong>{ar ? 'الإجمالي' : 'Total'}</strong><strong>{total}.00 LE</strong></p>
            <p>{label('Shipping in 4 days from confirming the order')}</p>
            <p>{form.firstName && name + ', ' + form.address + ', ' + form.city}</p>
        </aside>
    </main>;
}

export function Account({ ar }) {
    return (
      <section className="account-panel">
        <UserRound size={28} />
        <h2>{t(ar, 'Account')}</h2>
        <p>{ar ? 'انتقل إلى صفحة تسجيل الدخول أو إنشاء الحساب.' : 'Continue to a dedicated sign-in or sign-up page.'}</p>
        <a className="outline-button" href="/login">{t(ar, 'Log in')}</a>
        <a className="black-button" href="/signup">{t(ar, 'Sign up')}</a>
      </section>
    );
}
