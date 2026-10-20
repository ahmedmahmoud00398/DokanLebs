'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { trackingService } from '@/lib/store-services';
import SecondarySiteHeader from '@/components/secondary-site-header';

const supportLink = 'https://wa.me/201212813273';

const trackingTranslations = {
  'Home': 'الرئيسية',
  'Track order': 'تتبع الطلب',
  'Track your order': 'تتبع طلبك',
  'Enter your order number and WhatsApp number to see where your order is right now.': 'أدخل رقم الطلب ورقم واتساب لمعرفة حالة طلبك الحالية.',
  'ORDER NUMBER': 'رقم الطلب',
  'WHATSAPP NUMBER': 'رقم واتساب',
  'Track order →': 'تتبع الطلب ←',
  'Looking up…': 'جارٍ البحث…',
  'Enter your order number to get started': 'أدخل رقم طلبك للبدء',
  'Once you add it, you’ll see the live status of your order, the estimated delivery date, and every update along the way.': 'بعد إدخال البيانات ستظهر حالة الطلب وموعد التوصيل المتوقع وآخر التحديثات.',
  'Where to find your order number': 'أين تجد رقم الطلب؟',
  'WhatsApp confirmation': 'رسالة تأكيد واتساب',
  'We send your order number in the confirmation message right after you place the order.': 'نرسل رقم الطلب في رسالة التأكيد بعد إتمام الطلب.',
  'Confirmation email': 'رسالة تأكيد البريد الإلكتروني',
  'Check your inbox for the order confirmation email. The number starts with DL-.': 'تحقق من بريدك الإلكتروني للعثور على رسالة تأكيد الطلب. يبدأ الرقم بـ DL-.',
  'Still can’t find it?': 'ما زلت لا تجده؟',
  'Message us on WhatsApp with your phone number and we’ll send it to you.': 'راسلنا على واتساب برقم هاتفك وسنساعدك في العثور عليه.',
  'WHAT IT LOOKS LIKE': 'شكل رقم الطلب',
  'Thanks for your order! Your order number is:': 'شكرًا لطلبك! رقم طلبك هو:',
  'Shipping in 4 days from confirming the order.': 'الشحن خلال 4 أيام من تأكيد الطلب.',
  'Need help with your order?': 'هل تحتاج إلى مساعدة بشأن طلبك؟',
  'Our team replies on WhatsApp, Sat – Fri, 9AM–12PM.': 'فريقنا يرد عبر واتساب من السبت إلى الجمعة، من 9 صباحًا حتى 12 ظهرًا.',
  'Enter the WhatsApp number used at checkout, including its country code.': 'أدخل رقم واتساب المستخدم عند إتمام الشراء، شاملًا مفتاح الدولة.',
  'Order numbers start with DL- followed by digits, for example DL-10482.': 'يبدأ رقم الطلب بـ DL- متبوعًا بأرقام، مثل DL-10482.',
  'The tracking service did not return a verified order.': 'لم تُرجع خدمة التتبع طلبًا مؤكدًا.',
  'Order tracking is unavailable right now.': 'خدمة تتبع الطلب غير متاحة حاليًا.',
  'We could not find this order.': 'لم نتمكن من العثور على هذا الطلب.',
  'We couldn’t find an order with these details.': 'لم نعثر على طلب بهذه البيانات.',
  'We couldn’t find this order': 'لم نعثر على هذا الطلب',
  'Tracking is temporarily unavailable': 'التتبع غير متاح مؤقتًا',
  'Order tracking is unavailable because the tracking service is not connected yet.': 'خدمة تتبع الطلب غير متاحة لأن خدمة التتبع لم يتم ربطها بعد.',
  'Try again': 'حاول مرة أخرى',
  'Chat on WhatsApp': 'تواصل عبر واتساب',
  'Things to check': 'أمور يجب التحقق منها',
  'Order number format': 'صيغة رقم الطلب',
  'It starts with DL- followed by digits, like DL-10482.': 'يبدأ بـ DL- متبوعًا بأرقام، مثل DL-10482.',
  'Same WhatsApp number': 'رقم واتساب نفسه',
  'Use the same number you entered when you placed the order.': 'استخدم الرقم نفسه الذي أدخلته عند إتمام الطلب.',
  'Just placed your order?': 'هل أتممت طلبك للتو؟',
  'It can take a few minutes to show up. Try again shortly.': 'قد يستغرق ظهور الطلب بضع دقائق. حاول مرة أخرى بعد قليل.',
  'Shipment updates': 'تحديثات الشحنة',
  'Order summary': 'ملخص الطلب',
  'Delivery details': 'تفاصيل التوصيل',
  'Total items': 'إجمالي المنتجات',
  'Shipping': 'الشحن',
  'Total': 'الإجمالي',
  'PAYMENT': 'الدفع',
  'Qty:': 'الكمية:',
  'PAYMENT METHOD': 'طريقة الدفع',
  'Out for delivery': 'خرج الطلب للتوصيل',
  'Order placed': 'تم استلام الطلب',
  'Confirmed': 'تم تأكيد الطلب',
  'Packed': 'تم تجهيز الطلب',
  'Delivered': 'تم التوصيل',
  'Cash on Delivery': 'الدفع عند الاستلام',
  'Checking the details with the order service…': 'جارٍ التحقق من البيانات عبر خدمة الطلبات…',
  'Looking up your order': 'جارٍ البحث عن طلبك',
  'CONTACT US': 'تواصل معنا',
  'CATEGORIES': 'الفئات',
  'CUSTOMERS': 'العملاء',
  'SOCIAL MEDIA': 'وسائل التواصل الاجتماعي',
  'Top': 'ملابس علوية',
  'Bottom': 'ملابس سفلية',
  'Accessories': 'إكسسوارات',
  'Shoes': 'أحذية',
  'Refund Policy': 'سياسة الاسترجاع',
  'SAT - FRI 9AM -12PM': 'السبت - الجمعة، 9 صباحًا - 12 ظهرًا',
  'We couldn’t find an order with these details.': 'لم نعثر على طلب بهذه البيانات.',
  'Thanks for your order! Your order number is:': 'شكرًا لطلبك! رقم طلبك هو:',
};

const translateTracking = (isArabic, text) => isArabic ? (trackingTranslations[text] || text) : text;

function HelpCard({ title, entries, sample, isArabic }) {
  return <section className="tracking-card"><h2>{translateTracking(isArabic, title)}</h2>{entries && <ol>{entries.map(([heading, copy]) => <li key={heading}><strong>{translateTracking(isArabic, heading)}</strong><p>{translateTracking(isArabic, copy)}</p></li>)}</ol>}{sample && <div className="tracking-sample"><b>Dokan Lebss</b><p>{translateTracking(isArabic, 'Thanks for your order! Your order number is:')}</p><strong>#DL-10482</strong><small>{translateTracking(isArabic, 'Shipping in 4 days from confirming the order.')}</small></div>}</section>;
}

function Shipment({ order, isArabic }) {
  const updates = Array.isArray(order.shipmentUpdates) ? order.shipmentUpdates : [];
  const items = Array.isArray(order.items) ? order.items : [];
  const stages = Array.isArray(order.progress) ? order.progress : [];
  return <><section className="tracking-status"><div><small>{isArabic ? 'الطلب' : 'ORDER'} {order.orderNumber}{order.placedAt ? (isArabic ? ' · تاريخ الطلب ' : ' · PLACED ') + order.placedAt : ''}</small><h2>{order.statusLabel || order.status}</h2><p>{order.statusDescription || ''}</p></div>{order.estimatedDelivery && <div className="tracking-eta"><small>{isArabic ? 'موعد التوصيل المتوقع' : 'ESTIMATED DELIVERY'}</small><strong>{order.estimatedDelivery}</strong></div>}{stages.length > 0 && <ol className="tracking-progress">{stages.map((stage) => <li className={stage.complete ? 'complete' : ''} key={stage.label}>{stage.label}</li>)}</ol>}</section><div className="tracking-details"><section className="tracking-card"><h2>{translateTracking(isArabic, 'Shipment updates')}</h2>{updates.length ? <ol className="shipment-updates">{updates.map((update, index) => <li key={update.id || update.label || index}><span className={update.complete ? 'tracking-dot done' : 'tracking-dot'} /><div><strong>{update.label}</strong><p>{update.description}</p></div><time>{update.date || ''}</time></li>)}</ol> : <p>{isArabic ? 'ستظهر تحديثات الشحنة عند توفرها من شركة التوصيل.' : 'Shipment updates will appear when provided by the carrier.'}</p>}</section><aside className="tracking-card"><h2>{translateTracking(isArabic, 'Order summary')}</h2>{items.map((item) => <div className="tracking-item" key={item.id || item.name}><img src={item.image} alt="" /><span>{item.name}<small>{translateTracking(isArabic, 'Qty:')} {item.quantity}</small></span><b>{item.price} LE</b></div>)}<div className="tracking-total"><p><span>{translateTracking(isArabic, 'Total items')}</span><span>{order.subtotal} LE</span></p><p><span>{translateTracking(isArabic, 'Shipping')}</span><span>{order.shipping} LE</span></p><p><b>{translateTracking(isArabic, 'Total')}</b><b>{order.total} LE</b></p></div><h3>{translateTracking(isArabic, 'Delivery details')}</h3><p>{order.shippingAddress?.name}</p><p>{order.shippingAddress?.address}, {order.shippingAddress?.city}</p><p>{order.shippingAddress?.phone}</p><small>{translateTracking(isArabic, 'PAYMENT')}</small><p>{order.paymentMethod}</p></aside></div></>;
}

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [status, setStatus] = useState('idle');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {
    const syncLanguage = (event) => setIsArabic(event.detail === 'ar');
    setIsArabic(localStorage.getItem('dokan-language') === 'ar');
    window.addEventListener('dokan-language-changed', syncLanguage);
    return () => window.removeEventListener('dokan-language-changed', syncLanguage);
  }, []);

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
  return <><SecondarySiteHeader /><main className="track-order-page" dir={isArabic ? 'rtl' : 'ltr'}><div className="track-breadcrumb"><Link href="/">{translateTracking(isArabic, 'Home')}</Link> / {translateTracking(isArabic, 'Track order')}</div><h1>{translateTracking(isArabic, 'Track your order')}</h1><p className="track-intro">{translateTracking(isArabic, 'Enter your order number and WhatsApp number to see where your order is right now.')}</p>
    <form className="tracking-form" onSubmit={submit} noValidate><label><span>{translateTracking(isArabic, 'ORDER NUMBER')}</span><input aria-invalid={invalid} placeholder="e.g. DL-10482" value={orderNumber} onChange={(event) => setOrderNumber(event.target.value)} /></label><label><span>{translateTracking(isArabic, 'WHATSAPP NUMBER')}</span><input type="tel" placeholder="+20 XXX XXX XXXX" value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} /></label><button className="black-button" type="submit" disabled={checking}>{checking ? translateTracking(isArabic, 'Looking up…') : translateTracking(isArabic, 'Track order →')}</button>{invalid && <p className="tracking-form-error" role="alert">{translateTracking(isArabic, error)}</p>}</form>
    {status === 'idle' && <><section className="tracking-empty"><span>◇</span><h2>{translateTracking(isArabic, 'Enter your order number to get started')}</h2><p>{translateTracking(isArabic, 'Once you add it, you’ll see the live status of your order, the estimated delivery date, and every update along the way.')}</p></section><div className="tracking-help-grid"><HelpCard isArabic={isArabic} title="Where to find your order number" entries={[["WhatsApp confirmation", "We send your order number in the confirmation message right after you place the order."], ["Confirmation email", "Check your inbox for the order confirmation email. The number starts with DL-."], ["Still can’t find it?", "Message us on WhatsApp with your phone number and we’ll send it to you."]]} /><HelpCard isArabic={isArabic} title="WHAT IT LOOKS LIKE" sample /></div></>}
    {checking && <section className="tracking-empty" role="status"><span className="tracking-spinner" /><h2>{translateTracking(isArabic, 'Looking up your order')}</h2><p>{translateTracking(isArabic, 'Checking the details with the order service…')}</p></section>}
    {(status === 'not-found' || status === 'unavailable') && <><section className="tracking-empty tracking-error"><span>×</span><h2>{translateTracking(isArabic, status === 'not-found' ? 'We couldn’t find this order' : 'Tracking is temporarily unavailable')}</h2><p>{translateTracking(isArabic, error)}</p><div className="tracking-actions"><button className="black-button" onClick={reset}>{translateTracking(isArabic, 'Try again')}</button><a className="outline-button" href={supportLink} target="_blank" rel="noreferrer">{translateTracking(isArabic, 'Chat on WhatsApp')}</a></div></section><div className="tracking-help-grid"><HelpCard isArabic={isArabic} title="Things to check" entries={[["Order number format", "It starts with DL- followed by digits, like DL-10482."], ["Same WhatsApp number", "Use the same number you entered when you placed the order."], ["Just placed your order?", "It can take a few minutes to show up. Try again shortly."]]} /><HelpCard isArabic={isArabic} title="WHAT IT LOOKS LIKE" sample /></div></>}
    {status === 'found' && order && <Shipment order={order} isArabic={isArabic} />}
    <section className="tracking-contact"><div><strong>{translateTracking(isArabic, 'Need help with your order?')}</strong><p>{translateTracking(isArabic, 'Our team replies on WhatsApp, Sat – Fri, 9AM–12PM.')}</p></div><a href={supportLink} target="_blank" rel="noreferrer">{translateTracking(isArabic, 'Chat on WhatsApp')}</a></section>
  </main><footer dir={isArabic ? 'rtl' : 'ltr'}><div className="footer-grid"><div><small>{translateTracking(isArabic, 'CONTACT US')}</small><p>+20 123 456 789</p><p>Dokan.EL-Labas@GMAIL.COM</p><p>{translateTracking(isArabic, 'SAT - FRI 9AM -12PM')}</p></div><div><small>{translateTracking(isArabic, 'CATEGORIES')}</small><p>{translateTracking(isArabic, 'Top')}</p><p>{translateTracking(isArabic, 'Bottom')}</p><p>{translateTracking(isArabic, 'Accessories')}</p><p>{translateTracking(isArabic, 'Shoes')}</p></div><div><small>{translateTracking(isArabic, 'CUSTOMERS')}</small><p>{translateTracking(isArabic, 'Refund Policy')}</p><p>DOKAN.ELABAS@GMAIL.COM</p><p>{translateTracking(isArabic, 'SAT - FRI 9AM -12PM')}</p></div><div><small>{translateTracking(isArabic, 'SOCIAL MEDIA')}</small><p>FACEBOOK</p><p>INSTAGRAM</p><p>TIKTOK</p></div></div><div className="footer-brand">Dokan Lebss</div></footer></>;
}
