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
  return <><header className="header payment-header"><Link className="logo" href="/">Dokan Lebss</Link><nav><Link href="/">Shop</Link><Link href="/">New Arrival</Link><Link href="/track-order">Track Order</Link><Link href="/collections">Collections</Link></nav><div className="header-actions"><Link href="/login">Account</Link><Link href="/">♡ 0</Link><Link href="/">Bag 0</Link></div></header><main className="flex min-h-[510px] flex-col items-center px-5 pt-[60px] pb-20 text-center max-[700px]:px-4 max-[700px]:pt-[42px] max-[700px]:pb-14">
    {state.loading ? <p role="status">Verifying payment…</p> : <>
      <div className={`grid size-[58px] place-items-center rounded-full bg-[#111] text-[32px] font-bold text-white ${failed ? 'bg-[#a21b1b]' : ''}`} aria-hidden="true">{paid ? '✓' : failed ? '×' : '!'}</div>
      <h1 className="mt-4 mb-1 text-[32px] font-normal max-[700px]:text-[clamp(24px,7vw,30px)]">
        {paid ? 'Payment Successful' : failed ? 'Payment Failed' : 'Payment status unavailable'}
      </h1>
      <p className="max-w-[470px] text-[#777]">
        {paid ? 'Thank you for your purchase. Your payment has been confirmed.' : failed ? 'The payment provider did not confirm this payment. You can retry checkout or contact support.' : state.error}
      </p>
      {paid && order && (
        <section className="my-5 w-[min(520px,100%)] rounded-[10px] border border-[#ddd] p-[18px] text-left max-[700px]:p-[14px]">
          <h2 className="text-base">Order Summary</h2>
          <PaymentSummaryRow label="Order number" value={order.number} />
          <PaymentSummaryRow label="Date" value={order.date} />
          <PaymentSummaryRow label="Payment method" value={order.paymentMethod} />
          <PaymentSummaryRow label="Estimated delivery" value={order.estimatedDelivery} />
          {(order.items || []).map((item) => (
            <PaymentSummaryRow key={item.name} label={`${item.name} × ${item.quantity}`} value={`${item.total} LE`} />
          ))}
          <p className="flex justify-between gap-4 border-t border-[#ddd] pt-3 text-[13px] text-[#111]">
            <span className="text-[#777]">Total paid</span><strong>{order.total} LE</strong>
          </p>
        </section>
      )}
      <div className="mt-3 flex justify-center gap-3 [&>*]:min-w-[150px] [&>*]:text-center max-[700px]:w-full max-[700px]:flex-col max-[700px]:[&>*]:w-full">
        {paid && order?.trackingUrl && <Link className="black-button" href={order.trackingUrl}>Track Order</Link>}
        <Link className="outline-button" href="/">Continue Shopping</Link>
      </div>
    </>}
  </main><footer><div className="footer-grid"><div><small>CONTACT US</small><p>+20 123 456 789</p><p>Dokan.EL-Labas@GMAIL.COM</p><p>SAT - FRI 9AM -12PM</p></div><div><small>CATEGORIES</small><p>Top</p><p>Bottom</p><p>Accessories</p><p>Shoes</p></div><div><small>CUSTOMERS</small><p>Refund Policy</p><p>DOKAN.ELABAS@GMAIL.COM</p><p>SAT - FRI 9AM -12PM</p></div><div><small>SOCIAL MEDIA</small><p>FACEBOOK</p><p>INSTAGRAM</p><p>TIKTOK</p></div></div><div className="footer-brand">Dokan Lebss</div></footer></>;
}

function PaymentSummaryRow({ label, value }) {
  return (
    <p className="flex justify-between gap-4 text-[13px] max-[700px]:[overflow-wrap:anywhere]">
      <span className="text-[#777]">{label}</span>
      <strong>{value}</strong>
    </p>
  );
}
