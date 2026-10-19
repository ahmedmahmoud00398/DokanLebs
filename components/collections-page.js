'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { collectionService } from '@/lib/store-services';

export default function CollectionsPage() {
  const [products, setProducts] = useState([]);
  const [state, setState] = useState('loading');
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

  return <><header className="header"><Link className="logo" href="/">Dokan Lebss</Link><nav><Link href="/track-order">Track Order</Link><Link href="/collections">Collection</Link><Link href="/">Shop</Link><Link href="/">New Arrival</Link></nav><div className="header-actions"><Link href="/login">Account</Link><Link href="/">♡ 0</Link><Link href="/">Bag 0</Link></div></header><main className="collections-page">
    <p className="collections-breadcrumb"><Link href="/">Home</Link> / Collection</p>
    <h1>Collection</h1>
    <p className="collections-description">Jackets, T-shirts and sweatshirts.</p>
    {state === 'loading' && <p role="status">Loading collection…</p>}
    {state === 'unavailable' && <section className="collections-empty"><h2>Collection is unavailable</h2><p>The catalog service is not connected yet. This collection will show only products categorized as jackets, T-shirts or sweatshirts by the CMS.</p><button className="outline-button" onClick={load}>Try again</button></section>}
    {state === 'ready' && products.length === 0 && <section className="collections-empty"><h2>No topwear products yet</h2><p>When the CMS adds jackets, T-shirts or sweatshirts, they will appear here.</p></section>}
    {state === 'ready' && products.length > 0 && <div className="product-grid">{products.map((product) => <article key={product.id}><div className="product-open"><img src={product.image} alt={product.name} /><h2>{product.name}</h2><p>{product.price} LE</p></div></article>)}</div>}
  </main></>;
}
