'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { paymentService } from '@/lib/store-services';
import { useSiteLanguage } from '@/lib/use-site-language';

export default function PaymentResult() {
  const { isArabic } = useSiteLanguage();
  const text = (english, arabic) => isArabic ? arabic : english;
  const errorText = (error) => {
    if (!isArabic) return error;
    return ({
      'A payment reference is required to verify this payment.': 'يلزم إدخال مرجع الدفع للتحقق من العملية.',
      'Payment status is unavailable.': 'حالة الدفع غير متاحة حاليًا.',
    })[error] || error;
  };
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
  return <><header dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'} className="header payment-header"><Link className="logo" href="/">Dokan Lebss</Link><nav><Link href="/">{text('Shop', 'تسوق')}</Link><Link href="/">{text('New Arrival', 'وصل حديثًا')}</Link><Link href="/track-order">{text('Track Order', 'تتبع الطلب')}</Link><Link href="/collections">{text('Collections', 'المجموعات')}</Link></nav><div className="header-actions"><Link href="/login">{text('Account', 'الحساب')}</Link><Link href="/">♡ 0</Link><Link href="/">{text('Bag', 'السلة')} 0</Link></div></header><main dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'} className="flex min-h-[510px] flex-col items-center px-5 pt-[60px] pb-20 text-center max-[700px]:px-4 max-[700px]:pt-[42px] max-[700px]:pb-14">
    {state.loading ? <p role="status">{text('Verifying payment…', 'جارٍ التحقق من الدفع…')}</p> : <>
      <div className={`grid size-[58px] place-items-center rounded-full bg-[#111] text-[32px] font-bold text-white ${failed ? 'bg-[#a21b1b]' : ''}`} aria-hidden="true">{paid ? '✓' : failed ? '×' : '!'}</div>
      <h1 className="mt-4 mb-1 text-[32px] font-normal max-[700px]:text-[clamp(24px,7vw,30px)]">
        {paid ? text('Payment Successful', 'تم الدفع بنجاح') : failed ? text('Payment Failed', 'تعذر إتمام الدفع') : text('Payment status unavailable', 'حالة الدفع غير متاحة')}
      </h1>
      <p className="max-w-[470px] text-[#777]">
        {paid ? text('Thank you for your purchase. Your payment has been confirmed.', 'شكرًا لشرائك. تم تأكيد عملية الدفع.') : failed ? text('The payment provider did not confirm this payment. You can retry checkout or contact support.', 'لم يؤكد مزود الدفع هذه العملية. يمكنك إعادة المحاولة أو التواصل مع الدعم.') : errorText(state.error)}
      </p>
      {paid && order && (
        <section className={`my-5 w-[min(520px,100%)] rounded-[10px] border border-[#ddd] p-[18px] ${isArabic ? 'text-right' : 'text-left'} max-[700px]:p-[14px]`}>
          <h2 className="text-base">{text('Order Summary', 'ملخص الطلب')}</h2>
          <PaymentSummaryRow label={text('Order number', 'رقم الطلب')} value={order.number} />
          <PaymentSummaryRow label={text('Date', 'التاريخ')} value={order.date} />
          <PaymentSummaryRow label={text('Payment method', 'طريقة الدفع')} value={order.paymentMethod} />
          <PaymentSummaryRow label={text('Estimated delivery', 'موعد التوصيل المتوقع')} value={order.estimatedDelivery} />
          {(order.items || []).map((item) => (
            <PaymentSummaryRow key={item.name} label={`${item.name} × ${item.quantity}`} value={`${item.total} LE`} />
          ))}
          <p className="flex justify-between gap-4 border-t border-[#ddd] pt-3 text-[13px] text-[#111]">
            <span className="text-[#777]">{text('Total paid', 'إجمالي المبلغ المدفوع')}</span><strong>{order.total} LE</strong>
          </p>
        </section>
      )}
      <div className="mt-3 flex justify-center gap-3 [&>*]:min-w-[150px] [&>*]:text-center max-[700px]:w-full max-[700px]:flex-col max-[700px]:[&>*]:w-full">
        {paid && order?.trackingUrl && <Link className="black-button" href={order.trackingUrl}>{text('Track Order', 'تتبع الطلب')}</Link>}
        <Link className="outline-button" href="/">{text('Continue Shopping', 'متابعة التسوق')}</Link>
      </div>
    </>}
  </main><footer dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'}><div className="footer-grid"><div><small>{text('CONTACT US', 'تواصل معنا')}</small><p>+20 123 456 789</p><p>Dokan.EL-Labas@GMAIL.COM</p><p>{text('SAT - FRI 9AM -12PM', 'السبت - الجمعة، 9 صباحًا - 12 ظهرًا')}</p></div><div><small>{text('CATEGORIES', 'الفئات')}</small><p>{text('Top', 'ملابس علوية')}</p><p>{text('Bottom', 'ملابس سفلية')}</p><p>{text('Accessories', 'إكسسوارات')}</p><p>{text('Shoes', 'أحذية')}</p></div><div><small>{text('CUSTOMERS', 'خدمة العملاء')}</small><p>{text('Refund Policy', 'سياسة الاسترجاع')}</p><p>DOKAN.ELABAS@GMAIL.COM</p><p>{text('SAT - FRI 9AM -12PM', 'السبت - الجمعة، 9 صباحًا - 12 ظهرًا')}</p></div><div><small>{text('SOCIAL MEDIA', 'وسائل التواصل الاجتماعي')}</small><p>FACEBOOK</p><p>INSTAGRAM</p><p>TIKTOK</p></div></div><div className="footer-brand">Dokan Lebss</div></footer></>;
}

function PaymentSummaryRow({ label, value }) {
  return (
    <p className="flex justify-between gap-4 text-[13px] max-[700px]:[overflow-wrap:anywhere]">
      <span className="text-[#777]">{label}</span>
      <strong>{value}</strong>
    </p>
  );
}
