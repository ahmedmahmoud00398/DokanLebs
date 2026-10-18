'use client';

import Link from 'next/link';
import { useState } from 'react';
import { trackingService } from '@/lib/store-services';

const supportLink = 'https://wa.me/20123456789';

function HelpCard({ title, entries, sample }) {
  return <section className="tracking-card"><h2>{title}</h2>{entries && <ol>{entries.map(([heading, copy]) => <li key={heading}><strong>{heading}</strong><p>{copy}</p></li>)}</ol>}{sample && <div className="tracking-sample"><b>Dokan Lebss</b><p>Thanks for your order! Your order number is:</p><strong>#DL-10482</strong><small>Shipping in 4 days from confirming the order.</small></div>}</section>;
}

function Header() {
  return <header className="header track-header"><Link className="logo" href="/">Dokan Lebss</Link><nav><Link href="/">Shop</Link><Link href="/">New Arrival</Link><Link className="header-primary-link" href="/track-order">Track Order</Link><Link className="header-primary-link" href="/collections">Collections</Link><Link href="/">About</Link></nav><div className="header-actions"><Link href="/login">Account</Link><Link href="/">♡ 0</Link><Link href="/">Bag 0</Link></div></header>;
}

function Shipment({ order }) {
  const updates = Array.isArray(order.shipmentUpdates) ? order.shipmentUpdates : [];
  const items = Array.isArray(order.items) ? order.items : [];
  const stages = Array.isArray(order.progress) ? order.progress : [];
  return <><section className="tracking-status"><div><small>ORDER {order.orderNumber}{order.placedAt ? ' · PLACED ' + order.placedAt : ''}</small><h2>{order.statusLabel || order.status}</h2><p>{order.statusDescription || ''}</p></div>{order.estimatedDelivery && <div className="tracking-eta"><small>ESTIMATED DELIVERY</small><strong>{order.estimatedDelivery}</strong></div>}{stages.length > 0 && <ol className="tracking-progress">{stages.map((stage) => <li className={stage.complete ? 'complete' : ''} key={stage.label}>{stage.label}</li>)}</ol>}</section><div className="tracking-details"><section className="tracking-card"><h2>Shipment updates</h2>{updates.length ? <ol className="shipment-updates">{updates.map((update, index) => <li key={update.id || update.label || index}><span className={update.complete ? 'tracking-dot done' : 'tracking-dot'} /><div><strong>{update.label}</strong><p>{update.description}</p></div><time>{update.date || ''}</time></li>)}</ol> : <p>Shipment updates will appear when provided by the carrier.</p>}</section><aside className="tracking-card"><h2>Order summary</h2>{items.map((item) => <div className="tracking-item" key={item.id || item.name}><img src={item.image} alt="" /><span>{item.name}<small>Qty: {item.quantity}</small></span><b>{item.price} LE</b></div>)}<div className="tracking-total"><p><span>Total items</span><span>{order.subtotal} LE</span></p><p><span>Shipping</span><span>{order.shipping} LE</span></p><p><b>Total</b><b>{order.total} LE</b></p></div><h3>Delivery details</h3><p>{order.shippingAddress?.name}</p><p>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p><p>{order.shippingAddress?.phone}</p><small>PAYMENT</small><p>{order.paymentMethod}</p></aside></div></>;
}

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [status, setStatus] = useState('idle');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault(); setOrder(null); setError('');
    const number = orderNumber.trim().toUpperCase();
    const phoneDigits = whatsapp.replace(/\D/g, '');
    if (!/^DL-\d{4,}$/.test(number)) { setStatus('invalid'); setError('Order numbers start with DL- followed by digits, for example DL-10482.'); return; }
    if (phoneDigits.length < 9 || phoneDigits.length > 15) { setStatus('invalid'); setError('Enter the WhatsApp number used at checkout, including its country code.'); return; }
    setStatus('loading');
    try {
      const result = await trackingService.lookup({ orderNumber: number, whatsappNumber: whatsapp.trim() });
      if (result?.status === 'not-found' || result?.ok === false) { setStatus('not-found'); setError(result.message || 'We could not find an order with these details.'); }
      else if (result?.order) { setOrder(result.order); setStatus('found'); }
      else { setStatus('unavailable'); setError('The tracking service did not return a verified order.'); }
    } catch (cause) { setStatus('unavailable'); setError(cause instanceof Error ? cause.message : 'Order tracking is unavailable right now.'); }
  };

  const checking = status === 'loading';
  const invalid = status === 'invalid' || status === 'not-found';
  const reset = () => { setStatus('idle'); setError(''); setOrder(null); };
  return <><Header /><main className="track-order-page"><div className="track-breadcrumb"><Link href="/">Home</Link> / Track order</div><h1>Track your order</h1><p className="track-intro">Enter your order number and WhatsApp number to see where your order is right now.</p>
    <form className="tracking-form" onSubmit={submit} noValidate><label><span>ORDER NUMBER</span><input aria-invalid={invalid} placeholder="e.g. DL-10482" value={orderNumber} onChange={(event) => setOrderNumber(event.target.value)} /></label><label><span>WHATSAPP NUMBER</span><input type="tel" placeholder="+20 XXX XXX XXXX" value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} /></label><button className="black-button" type="submit" disabled={checking}>{checking ? 'Looking up…' : 'Track order →'}</button>{invalid && <p className="tracking-form-error" role="alert">{error}</p>}</form>
    {status === 'idle' && <><section className="tracking-empty"><span>◇</span><h2>Enter your order number to get started</h2><p>Once you add it, you’ll see the live status of your order, the estimated delivery date, and every update along the way.</p></section><div className="tracking-help-grid"><HelpCard title="Where to find your order number" entries={[["WhatsApp confirmation", "We send your order number in the confirmation message right after you place the order."], ["Confirmation email", "Check your inbox for the order confirmation email. The number starts with DL-."], ["Still can’t find it?", "Message us on WhatsApp with your phone number and we’ll send it to you."]]} /><HelpCard title="WHAT IT LOOKS LIKE" sample /></div></>}
    {checking && <section className="tracking-empty" role="status"><span className="tracking-spinner" /><h2>Looking up your order</h2><p>Checking the details with the order service…</p></section>}
    {(status === 'not-found' || status === 'unavailable') && <><section className="tracking-empty tracking-error"><span>×</span><h2>{status === 'not-found' ? 'We couldn’t find this order' : 'Tracking is temporarily unavailable'}</h2><p>{error}</p><div className="tracking-actions"><button className="black-button" onClick={reset}>Try again</button><a className="outline-button" href={supportLink} target="_blank" rel="noreferrer">Chat on WhatsApp</a></div></section><div className="tracking-help-grid"><HelpCard title="Things to check" entries={[["Order number format", "It starts with DL- followed by digits, like DL-10482."], ["Same WhatsApp number", "Use the same number you entered when you placed the order."], ["Just placed your order?", "It can take a few minutes to show up. Try again shortly."]]} /><HelpCard title="WHAT IT LOOKS LIKE" sample /></div></>}
    {status === 'found' && order && <Shipment order={order} />}
    <section className="tracking-contact"><div><strong>Need help with your order?</strong><p>Our team replies on WhatsApp, Sat – Fri, 9AM–12PM.</p></div><a href={supportLink} target="_blank" rel="noreferrer">Chat on WhatsApp</a></section>
  </main><footer><div className="footer-grid"><div><small>CONTACT US</small><p>+20 123 456 789</p><p>Dokan.EL-Labas@GMAIL.COM</p><p>SAT - FRI 9AM -12PM</p></div><div><small>CATEGORIES</small><p>Top</p><p>Bottom</p><p>Accessories</p><p>Shoes</p></div><div><small>CUSTOMERS</small><p>Refund Policy</p><p>DOKAN.ELABAS@GMAIL.COM</p><p>SAT - FRI 9AM -12PM</p></div><div><small>SOCIAL MEDIA</small><p>FACEBOOK</p><p>INSTAGRAM</p><p>TIKTOK</p></div></div><div className="footer-brand">Dokan Lebss</div></footer></>;
}
