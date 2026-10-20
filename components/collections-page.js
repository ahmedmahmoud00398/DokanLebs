'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { collectionService } from '@/lib/store-services';
import SecondarySiteHeader from '@/components/secondary-site-header';

export default function CollectionsPage() {
  const [products, setProducts] = useState([]);
  const [state, setState] = useState('loading');
  const [isArabic, setIsArabic] = useState(false);

  useEffect(() => {
    const syncLanguage = (event) => setIsArabic(event.detail === 'ar');
    setIsArabic(localStorage.getItem('dokan-language') === 'ar');
    window.addEventListener('dokan-language-changed', syncLanguage);
    return () => window.removeEventListener('dokan-language-changed', syncLanguage);
  }, []);
  const load = useCallback(async () => {
    setState('loading');
    try {
      const topwear = await collectionService.listTopwear();
      setProducts(topwear);
      setState('ready');
    } catch {
      setState('unavailable');
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const text = (english, arabic) => isArabic ? arabic : english;

  return <><SecondarySiteHeader /><main className="collections-page" dir={isArabic ? 'rtl' : 'ltr'}>
    <p className="collections-breadcrumb"><Link href="/">{text('Home', 'الرئيسية')}</Link> / {text('Collection', 'المجموعة')}</p>
    <h1>{text('Collection', 'المجموعة')}</h1>
    <p className="collections-description">{text('Jackets, T-shirts and sweatshirts.', 'جاكيتات وتيشيرتات وسويت شيرت.')}</p>
    {state === 'loading' && <p role="status">{text('Loading collection…', 'جارٍ تحميل المجموعة…')}</p>}
    {state === 'unavailable' && <section className="collections-empty"><h2>{text('Collection is unavailable', 'المجموعة غير متاحة')}</h2><p>{text('The catalog service is not connected yet. This collection will show only products categorized as jackets, T-shirts or sweatshirts by the CMS.', 'خدمة المنتجات غير متصلة حاليًا. ستعرض هذه المجموعة المنتجات المصنفة كجاكيتات أو تيشيرتات أو سويت شيرت من خلال نظام إدارة المحتوى.')}</p><button className="outline-button" onClick={load}>{text('Try again', 'حاول مرة أخرى')}</button></section>}
    {state === 'ready' && products.length === 0 && <section className="collections-empty"><h2>{text('No topwear products yet', 'لا توجد منتجات ملابس علوية حتى الآن')}</h2><p>{text('When the CMS adds jackets, T-shirts or sweatshirts, they will appear here.', 'ستظهر هنا الجاكيتات والتيشيرتات والسويت شيرت عند إضافتها من نظام إدارة المحتوى.')}</p></section>}
    {state === 'ready' && products.length > 0 && <div className="product-grid">{products.map((product) => <article key={product.id}><div className="product-open"><img src={product.image} alt={product.name} /><h2>{product.name}</h2><p>{product.price} LE</p></div></article>)}</div>}
  </main></>;
}
