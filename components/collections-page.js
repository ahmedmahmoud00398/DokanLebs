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

  return (
    <>
      <SecondarySiteHeader />
      <main
        className="mx-auto min-h-[65vh] max-w-[1180px] px-[26px] pt-8 pb-20 max-[1100px]:px-5 max-[700px]:px-4 max-[700px]:pt-6 max-[700px]:pb-[52px]"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <p className="mb-5 text-xs text-[#777] max-[700px]:mb-5">
          <Link className="text-inherit" href="/">{text('Home', 'الرئيسية')}</Link>
          {' / '}
          {text('Collection', 'المجموعة')}
        </p>
        <h1 className="mb-2 text-[34px] font-normal max-[700px]:text-[30px]">
          {text('Collection', 'المجموعة')}
        </h1>
        <p className="mb-9 text-[#777]">
          {text('Jackets, T-shirts and sweatshirts.', 'جاكيتات وتيشيرتات وسويت شيرت.')}
        </p>
        {state === 'loading' && <p role="status">{text('Loading collection…', 'جارٍ تحميل المجموعة…')}</p>}
        {state === 'unavailable' && (
          <CollectionEmptyState
            title={text('Collection is unavailable', 'المجموعة غير متاحة')}
            description={text(
              'The catalog service is not connected yet. This collection will show only products categorized as jackets, T-shirts or sweatshirts by the CMS.',
              'خدمة المنتجات غير متصلة حاليًا. ستعرض هذه المجموعة المنتجات المصنفة كجاكيتات أو تيشيرتات أو سويت شيرت من خلال نظام إدارة المحتوى.',
            )}
            action={<button className="outline-button px-[18px] py-[10px]" onClick={load}>{text('Try again', 'حاول مرة أخرى')}</button>}
          />
        )}
        {state === 'ready' && products.length === 0 && (
          <CollectionEmptyState
            title={text('No topwear products yet', 'لا توجد منتجات ملابس علوية حتى الآن')}
            description={text(
              'When the CMS adds jackets, T-shirts or sweatshirts, they will appear here.',
              'ستظهر هنا الجاكيتات والتيشيرتات والسويت شيرت عند إضافتها من نظام إدارة المحتوى.',
            )}
          />
        )}
        {state === 'ready' && products.length > 0 && (
          <div className="grid grid-cols-4 gap-x-5 gap-y-[52px] pt-[54px] max-[820px]:grid-cols-3 max-[820px]:gap-x-4 max-[820px]:gap-y-9 max-[700px]:grid-cols-2 max-[700px]:gap-x-3 max-[700px]:gap-y-7 max-[700px]:pt-7">
            {products.map((product) => (
              <article className="group cursor-pointer transition-transform duration-[250ms] hover:-translate-y-1" key={product.id}>
                <div>
                  <img className="aspect-[.87] w-full object-cover transition-transform duration-[350ms] group-hover:scale-[1.018]" src={product.image} alt={product.name} />
                  <h2 className="mt-[10px] mb-[5px] text-base font-normal max-[700px]:text-sm">{product.name}</h2>
                  <p className="m-0 text-base max-[700px]:text-sm">{product.price} LE</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function CollectionEmptyState({ title, description, action }) {
  return (
    <section className="max-w-[760px] rounded-xl border border-[#e5e5e5] p-[34px] shadow-[0_4px_18px_#00000008] max-[700px]:px-[18px] max-[700px]:py-[22px]">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="leading-[1.6] text-[#777]">{description}</p>
      {action}
    </section>
  );
}
