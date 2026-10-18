'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { paymentService } from '@/lib/store-services';

export default function PaymentResult() {
  const [state, setState] = useState({ loading: true, result: null, error: '' });

  useEffect(() => {
    let active = true;
    const reference = new URLSearchParams(window.location.search).get('reference');
    if (!reference) {
      setState({ loading: false, result: null, error: 'A payment reference is required to verify this payment.' });
      return () => { active = false; };
    }
    paymentService.verify(reference).then((result) => {
      if (active) setState({ loading: false, result, error: '' });
    }).catch((error) => {
      if (active) setState({ loading: false, result: null, error: error instanceof Error ? error.message : 'Payment status is unavailable.' });
    });
    return () => { active = false; };
  }, []);

  const paid = state.result?.status === 'paid';
  const failed = state.result?.status === 'failed';
  const order = state.result?.order;
  return <><header className="header payment-header"><Link className="logo" href="/">Dokan Lebss</Link><nav><Link href="/">Shop</Link><Link href="/">New Arrival</Link><Link href="/track-order">Track Order</Link><Link href="/collections">Collections</Link></nav><div className="header-actions"><Link href="/login">Account</Link><Link href="/">♡ 0</Link><Link href="/">Bag 0</Link></div></header><main className="payment-result-page">
    {state.loading ? <p role="status">Verifying payment…</p> : <>
      <div className={`payment-result-icon ${paid ? 'is-success' : failed ? 'is-failed' : ''}`} aria-hidden="true">{paid ? '✓' : failed ? '×' : '!'}</div>
      <h1>{paid ? 'Payment Successful' : failed ? 'Payment Failed' : 'Payment status unavailable'}</h1>
      <p className="payment-result-message">{paid ? 'Thank you for your purchase. Your payment has been confirmed.' : failed ? 'The payment provider did not confirm this payment. You can retry checkout or contact support.' : state.error}</p>
      {paid && order && <section className="payment-order-summary"><h2>Order Summary</h2><p><span>Order number</span><strong>{order.number}</strong></p><p><span>Date</span><strong>{order.date}</strong></p><p><span>Payment method</span><strong>{order.paymentMethod}</strong></p><p><span>Estimated delivery</span><strong>{order.estimatedDelivery}</strong></p>{(order.items || []).map((item) => <p key={item.name}><span>{item.name} × {item.quantity}</span><strong>{item.total} LE</strong></p>)}<p className="payment-total"><span>Total paid</span><strong>{order.total} LE</strong></p></section>}
      <div className="payment-result-actions">{paid && order?.trackingUrl && <Link className="black-button" href={order.trackingUrl}>Track Order</Link>}<Link className="outline-button" href="/">Continue Shopping</Link></div>
    </>}
  </main><footer><div className="footer-grid"><div><small>CONTACT US</small><p>+20 123 456 789</p><p>Dokan.EL-Labas@GMAIL.COM</p><p>SAT - FRI 9AM -12PM</p></div><div><small>CATEGORIES</small><p>Top</p><p>Bottom</p><p>Accessories</p><p>Shoes</p></div><div><small>CUSTOMERS</small><p>Refund Policy</p><p>DOKAN.ELABAS@GMAIL.COM</p><p>SAT - FRI 9AM -12PM</p></div><div><small>SOCIAL MEDIA</small><p>FACEBOOK</p><p>INSTAGRAM</p><p>TIKTOK</p></div></div><div className="footer-brand">Dokan Lebss</div></footer></>;
}
