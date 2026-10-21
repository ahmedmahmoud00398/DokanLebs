'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { useSiteLanguage } from '@/lib/use-site-language';

export default function SecondarySiteHeader() {
  const { isArabic, toggleLanguage } = useSiteLanguage();
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const toggleMenu = (event) => {
    if (menuOpen) {
      setMenuOpen(false);
      setMenuAnchor(null);
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const width = Math.min(280, viewportWidth - 24);
    const alignRight = bounds.left + bounds.width / 2 > viewportWidth / 2;
    const left = alignRight ? bounds.right - width : bounds.left;
    setMenuAnchor({
      top: bounds.bottom + 8,
      left: Math.max(12, Math.min(left, viewportWidth - width - 12)),
      width,
    });
    setMenuOpen(true);
  };

  useEffect(() => {
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

  const labels = isArabic
    ? { track: 'تتبع الطلب', collection: 'المجموعات', shop: 'تسوق', arrival: 'وصل حديثًا', search: 'بحث', favorites: 'المفضلة', account: 'الحساب', cart: 'السلة', language: 'English' }
    : { track: 'Track Order', collection: 'Collection', shop: 'Shop', arrival: 'New Arrival', search: 'Search', favorites: 'Favorites', account: 'Account', cart: 'Cart', language: 'عربي' };

  return <>
    <div className="promo max-[700px]:!hidden" dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'}>
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
    <header className="header" dir={isArabic ? 'rtl' : 'ltr'} lang={isArabic ? 'ar' : 'en'}>
      <div className="mobile-controls">
        <button className="mobile-only icon-button" type="button" aria-label={isArabic ? 'القائمة' : 'Menu'} aria-expanded={menuOpen} aria-controls="secondary-mobile-nav" onClick={toggleMenu}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        <button className="mobile-only mobile-language" type="button" onClick={toggleLanguage}>{labels.language}</button>
      </div>
      <div className="header-brand-nav">
        <Link className="logo" href="/">Dokan Lebss</Link>
        <nav>
          <Link href="/">{labels.shop}</Link>
          <Link href="/">{labels.arrival}</Link>
          <Link href="/track-order">{labels.track}</Link>
          <Link href="/collections">{labels.collection}</Link>
        </nav>
      </div>
      <div className="header-actions">
        <button className="language-nav" type="button" onClick={toggleLanguage}>{labels.language}</button>
        <Link href="/" aria-label={labels.search}><Search size={18} /></Link>
        <Link href="/" aria-label={`${labels.favorites} (${favoriteCount})`}><Heart size={19} fill={favoriteCount ? 'currentColor' : 'none'} /><span className="header-favorites-count">{favoriteCount}</span></Link>
        <Link href="/" aria-label={`${labels.cart} (${cartCount})`}><ShoppingBag size={18} /><span className="header-cart-count">{cartCount}</span></Link>
        <Link href="/login" aria-label={labels.account}><UserRound size={18} /></Link>
      </div>
    </header>
    {menuOpen && (
      <div
        className="secondary-menu-overlay"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setMenuOpen(false);
            setMenuAnchor(null);
          }
        }}
      >
        <nav
          id="secondary-mobile-nav"
          className="secondary-mobile-menu"
          style={{
            '--menu-top': `${menuAnchor?.top ?? 0}px`,
            left: `${menuAnchor?.left ?? 12}px`,
            width: `${menuAnchor?.width ?? 280}px`,
          }}
          dir={isArabic ? 'rtl' : 'ltr'}
          lang={isArabic ? 'ar' : 'en'}
          aria-label={isArabic ? 'التنقل الرئيسي' : 'Main navigation'}
        >
          <Link href="/" onClick={() => setMenuOpen(false)}>{labels.shop}</Link>
          <Link href="/track-order" onClick={() => setMenuOpen(false)}>{labels.track}</Link>
          <Link href="/collections" onClick={() => setMenuOpen(false)}>{labels.collection}</Link>
          <button type="button" onClick={() => { setMenuOpen(false); setMenuAnchor(null); toggleLanguage(); }}>
            {labels.language}
          </button>
        </nav>
      </div>
    )}
  </>;
}
