'use client';

import Link from 'next/link';
import { useState } from 'react';
import { trackingService } from '@/lib/store-services';
import SecondarySiteHeader from '@/components/secondary-site-header';
import HelpCard from '@/components/tracking/help-card';
import Shipment from '@/components/tracking/shipment';
import { translateTracking } from '@/lib/tracking-translations';
import styles from '@/components/tracking/tracking.module.css';
import { useSiteLanguage } from '@/lib/use-site-language';
import { Footer } from './storefront/site-shell';

const supportLink = 'https://wa.me/201212813273';

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [status, setStatus] = useState('idle');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const { isArabic } = useSiteLanguage();

  const submit = async (event) => {
    event.preventDefault(); setOrder(null); setError('');
    const number = orderNumber.trim().toUpperCase();
    const phoneDigits = whatsapp.replace(/\D/g, '');
    if (!/^DL-\d{4,}$/.test(number)) { setStatus('invalid'); setError('Order numbers start with DL- followed by digits, for example DL-10482.'); return; }
    if (phoneDigits.length < 9 || phoneDigits.length > 15) { setStatus('invalid'); setError('Enter the WhatsApp number used at checkout, including its country code.'); return; }
    setStatus('loading');
    try {
      const result = await trackingService.lookup({ orderNumber: number, whatsappNumber: whatsapp.trim() });
      if (result?.status === 'not-found' || result?.ok === false) { setStatus('not-found'); setError(result.message || 'We couldn’t find an order with these details.'); }
      else if (result?.order) { setOrder(result.order); setStatus('found'); }
      else { setStatus('unavailable'); setError('The tracking service did not return a verified order.'); }
    } catch (cause) { setStatus('unavailable'); setError(cause instanceof Error ? cause.message : 'Order tracking is unavailable right now.'); }
  };

  const checking = status === 'loading';
  const invalid = status === 'invalid' || status === 'not-found';
  const reset = () => { setStatus('idle'); setError(''); setOrder(null); };
  return <div className={styles.trackingRoot} dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'}><SecondarySiteHeader /><main className="track-order-page" dir={isArabic ? 'rtl' : 'ltr'}><div className="track-breadcrumb"><Link href="/">{translateTracking(isArabic, 'Home')}</Link> / {translateTracking(isArabic, 'Track order')}</div><h1>{translateTracking(isArabic, 'Track your order')}</h1><p className="track-intro">{translateTracking(isArabic, 'Enter your order number and WhatsApp number to see where your order is right now.')}</p>
    <form className="tracking-form" onSubmit={submit} noValidate><label><span>{translateTracking(isArabic, 'ORDER NUMBER')}</span><input dir="ltr" aria-invalid={invalid} placeholder="e.g. DL-10482" value={orderNumber} onChange={(event) => setOrderNumber(event.target.value)} /></label><label><span>{translateTracking(isArabic, 'WHATSAPP NUMBER')}</span><input dir="ltr" type="tel" placeholder="+20 XXX XXX XXXX" value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} /></label><button className="black-button" type="submit" disabled={checking}>{checking ? translateTracking(isArabic, 'Looking up…') : translateTracking(isArabic, 'Track order →')}</button>{invalid && <p className="tracking-form-error" role="alert">{translateTracking(isArabic, error)}</p>}</form>
    {status === 'idle' && <><section className="tracking-empty"><span>◇</span><h2>{translateTracking(isArabic, 'Enter your order number to get started')}</h2><p>{translateTracking(isArabic, 'Once you add it, you’ll see the live status of your order, the estimated delivery date, and every update along the way.')}</p></section><div className="tracking-help-grid"><HelpCard isArabic={isArabic} title="Where to find your order number" entries={[["WhatsApp confirmation", "We send your order number in the confirmation message right after you place the order."], ["Confirmation email", "Check your inbox for the order confirmation email. The number starts with DL-."], ["Still can’t find it?", "Message us on WhatsApp with your phone number and we’ll send it to you."]]} /><HelpCard isArabic={isArabic} title="WHAT IT LOOKS LIKE" sample /></div></>}
    {checking && <section className="tracking-empty" role="status"><span className="tracking-spinner" /><h2>{translateTracking(isArabic, 'Looking up your order')}</h2><p>{translateTracking(isArabic, 'Checking the details with the order service…')}</p></section>}
    {(status === 'not-found' || status === 'unavailable') && <><section className="tracking-empty tracking-error"><span>X</span><h2>{translateTracking(isArabic, status === 'not-found' ? 'We couldn’t find this order' : 'Tracking is temporarily unavailable')}</h2><p>{translateTracking(isArabic, error)}</p><div className="tracking-actions"><button className="black-button" onClick={reset}>{translateTracking(isArabic, 'Try again')}</button><a className="outline-button" href={supportLink} target="_blank" rel="noreferrer">{translateTracking(isArabic, 'Chat on WhatsApp')}</a></div></section><div className="tracking-help-grid"><HelpCard isArabic={isArabic} title="Things to check" entries={[["Order number format", "It starts with DL- followed by digits, like DL-10482."], ["Same WhatsApp number", "Use the same number you entered when you placed the order."], ["Just placed your order?", "It can take a few minutes to show up. Try again shortly."]]} /><HelpCard isArabic={isArabic} title="WHAT IT LOOKS LIKE" sample /></div></>}
    {status === 'found' && order && <Shipment order={order} isArabic={isArabic} />}
    <section className="tracking-contact"><div><strong>{translateTracking(isArabic, 'Need help with your order?')}</strong><p>{translateTracking(isArabic, 'Our team replies on WhatsApp, Sat – Fri, 9AM–12PM.')}</p></div><a href={supportLink} target="_blank" rel="noreferrer">{translateTracking(isArabic, 'Chat on WhatsApp')}</a></section>
  </main><Footer /></div>;
}
