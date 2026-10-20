'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Menu, Search, ShoppingBag, UserRound } from 'lucide-react';

export default function SecondarySiteHeader() {
  const [isArabic, setIsArabic] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const language = localStorage.getItem('dokan-language') === 'ar';
    setIsArabic(language);

    try {
      const favorites = JSON.parse(localStorage.getItem('dokan-favorites') || '[]');
      const cart = JSON.parse(localStorage.getItem('dokan-cart') || '[]');
      setFavoriteCount(Array.isArray(favorites) ? favorites.length : 0);
      setCartCount(Array.isArray(cart) ? cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0) : 0);
    } catch {
      setFavoriteCount(0);
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
  }, [isArabic]);

  const toggleLanguage = () => {
    const nextLanguage = !isArabic;
    setIsArabic(nextLanguage);
    localStorage.setItem('dokan-language', nextLanguage ? 'ar' : 'en');
    document.documentElement.lang = nextLanguage ? 'ar' : 'en';
    document.documentElement.dir = nextLanguage ? 'rtl' : 'ltr';
    window.dispatchEvent(new CustomEvent('dokan-language-changed', { detail: nextLanguage ? 'ar' : 'en' }));
  };

  const labels = isArabic
    ? { track: 'تتبع الطلب', collection: 'المجموعات', shop: 'تسوق', arrival: 'وصل حديثًا', about: 'من نحن', search: 'بحث', favorites: 'المفضلة', account: 'الحساب', cart: 'السلة', language: 'English' }
    : { track: 'Track Order', collection: 'Collection', shop: 'Shop', arrival: 'New Arrival', about: 'About', search: 'Search', favorites: 'Favorites', account: 'Account', cart: 'Cart', language: 'عربي' };

  return <>
    <div className="promo">
      <div className="promo-track">
        <div className="promo-group">
          <span>{isArabic ? 'خصم 25٪ عند الطلب من الموقع الآن' : 'sale up 25% if you order from website now'}</span>
          <span>{isArabic ? 'خصم 25٪ عند الطلب من الموقع الآن' : 'sale up 25% if you order from website now'}</span>
          <span>{isArabic ? 'خصم 25٪ عند الطلب من الموقع الآن' : 'sale up 25% if you order from website now'}</span>
        </div>
        <div className="promo-group" aria-hidden="true">
          <span>{isArabic ? 'خصم 25٪ عند الطلب من الموقع الآن' : 'sale up 25% if you order from website now'}</span>
          <span>{isArabic ? 'خصم 25٪ عند الطلب من الموقع الآن' : 'sale up 25% if you order from website now'}</span>
          <span>{isArabic ? 'خصم 25٪ عند الطلب من الموقع الآن' : 'sale up 25% if you order from website now'}</span>
        </div>
      </div>
    </div>
    <header className="header">
      <div className="mobile-controls">
        <Link className="mobile-only icon-button" href="/" aria-label={isArabic ? 'القائمة' : 'Menu'}><Menu size={18} /></Link>
        <button className="mobile-only mobile-language" type="button" onClick={toggleLanguage}>{labels.language}</button>
      </div>
      <Link className="logo" href="/">Dokan Lebss</Link>
      <nav>
        <Link href="/track-order">{labels.track}</Link>
        <Link href="/collections">{labels.collection}</Link>
        <Link href="/">{labels.shop}</Link>
        <Link href="/">{labels.arrival}</Link>
        <Link href="/">{labels.about}</Link>
        <button className="language-nav" type="button" onClick={toggleLanguage}>{labels.language}</button>
      </nav>
      <div className="header-actions">
        <Link href="/" aria-label={labels.search}><Search size={18} /></Link>
        <Link href="/" aria-label={`${labels.favorites} (${favoriteCount})`}><Heart size={19} fill={favoriteCount ? 'currentColor' : 'none'} /><span className="header-favorites-count">{favoriteCount}</span></Link>
        <Link href="/login" aria-label={labels.account}><UserRound size={18} /></Link>
        <Link href="/" aria-label={labels.cart}><ShoppingBag size={18} /></Link>
        <span>{cartCount}</span>
      </div>
    </header>
  </>;
}
