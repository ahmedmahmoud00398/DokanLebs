'use client';
import { useEffect, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, UserRound } from 'lucide-react';
import { t } from './data';

export function Header({ ar, toggle, navigate, open, count, favoriteCount }) {
    const label = (x) => t(ar, x);
    const [savedFavoriteCount, setSavedFavoriteCount] = useState(0);
    useEffect(() => {
        try { setSavedFavoriteCount(JSON.parse(localStorage.getItem('dokan-favorites') || '[]').length); } catch { setSavedFavoriteCount(0); }
        const updateCount = (event) => setSavedFavoriteCount(Array.isArray(event.detail) ? event.detail.length : Number.isInteger(event.detail) ? event.detail : 0);
        window.addEventListener('dokan-favorites-updated', updateCount);
        return () => window.removeEventListener('dokan-favorites-updated', updateCount);
    }, []);
    return <>
        <div className="promo max-[700px]:!hidden">
            <div className="promo-track">
                <div className="promo-group">
                    <span>{ar ? 'خصم 25٪ عند الطلب من الموقع الآن' : 'sale up 25% if you order from website now'}</span>
                    <span>{ar ? 'خصم 25٪ عند الطلب من الموقع الآن' : 'sale up 25% if you order from website now'}</span>
                    <span>{ar ? 'خصم 25٪ عند الطلب من الموقع الآن' : 'sale up 25% if you order from website now'}</span>
                </div>
                <div className="promo-group" aria-hidden="true">
                    <span>{ar ? 'خصم 25٪ عند الطلب من الموقع الآن' : 'sale up 25% if you order from website now'}</span>
                    <span>{ar ? 'خصم 25٪ عند الطلب من الموقع الآن' : 'sale up 25% if you order from website now'}</span>
                    <span>{ar ? 'خصم 25٪ عند الطلب من الموقع الآن' : 'sale up 25% if you order from website now'}</span>
                </div>
            </div>
        </div>
        <header className="header" dir={ar ? 'rtl' : 'ltr'}>
            <div className="mobile-controls">
                <button className="mobile-only icon-button" onClick={(event) => open('menu', event.currentTarget)} aria-label={label('Menu')}>
                    <Menu size={18} />
                </button>
                <button className="mobile-only mobile-language" onClick={toggle}>{ar ? 'EN' : 'عربي'}
                </button>
            </div>
            <div className="header-brand-nav">
                <button className="logo" onClick={() => navigate('home')}>Dokan Lebss</button>
                <nav>
                    <button onClick={() => navigate('shop')}>{label('Shop')}</button>
                    <button onClick={() => navigate('shop')}>{label('New Arrival')}</button>
                    <a href="/track-order">{ar ? 'تتبع الطلب' : 'Track Order'}</a>
                    <a href="/collections">{ar ? 'المجموعات' : 'Collection'}</a>
                </nav>
            </div>
            <div className="header-actions">
                <button className="language-nav" onClick={toggle}>{ar ? 'EN' : 'عربي'}</button>
                <button onClick={(event) => open('search', event.currentTarget)} aria-label={label('Search')}>
                    <Search size={18} />
                </button>
                <button onClick={(event) => open('favorites', event.currentTarget)} aria-label={`${label('Favorites')} (${savedFavoriteCount})`}>
                    <Heart size={19} fill={savedFavoriteCount ? 'currentColor' : 'none'} />
                    <span className="header-favorites-count">{savedFavoriteCount}</span>
                </button>
                <button onClick={(event) => open('cart', event.currentTarget)} aria-label={`${label('Cart')} (${count})`}>
                    <ShoppingBag size={18} />
                    <span className="header-cart-count">{count}</span>
                </button>
                <button onClick={() => open('account')} aria-label={label('Account')}>
                    <UserRound size={18} />
                </button>
            </div>
        </header>
    </>;
}

export function Footer({ ar, navigate }) {
    const label = (text) => t(ar, text);
    const openShop = (event) => {
        event.preventDefault();
        navigate('shop');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const openRefundPolicy = (event) => {
        event.preventDefault();
        navigate('refund');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer>
            <div className="footer-grid">
                <div>
                    <small>{label('CONTACT US')}</small>
                    <p><a className="text-inherit no-underline" href="tel:+201212813273">+20 121 281 3273</a></p>
                    <p><a className="text-inherit no-underline" href="mailto:Dokan.EL-Labas@GMAIL.COM">Dokan.EL-Labas@GMAIL.COM</a></p>
                    <p>{label('SAT - FRI 9AM -12PM')}</p>
                </div>
                <div>
                    <small>{label('CATEGORIES')}</small>
                    {['Top', 'Bottom', 'Accessories', 'Shoes'].map((category) => (
                        <p key={category}>
                            <a className="text-inherit no-underline" href="/shop" onClick={openShop}>{label(category)}</a>
                        </p>
                    ))}
                </div>
                <div>
                    <small>{label('CUSTOMERS')}</small>
                    <p><a className="text-inherit no-underline" href="/refund-policy" onClick={openRefundPolicy}>{label('Refund Policy')}</a></p>
                    <p><a className="text-inherit no-underline" href="mailto:Dokan.EL-Labas@GMAIL.COM">DOKAN.ELABAS@GMAIL.COM</a></p>
                    <p>{label('SAT - FRI 9AM -12PM')}</p>
                </div>
                <div>
                    <small>{label('SOCIAL MEDIA')}</small>
                    <p><a className="text-inherit no-underline" href="https://www.facebook.com/profile.php?id=100091251616407" target="_blank" rel="noreferrer">FACEBOOK</a></p>
                    <p><a className="text-inherit no-underline" href="https://www.instagram.com/" target="_blank" rel="noreferrer">INSTAGRAM</a></p>
                    <p><a className="text-inherit no-underline" href="https://www.tiktok.com/" target="_blank" rel="noreferrer">TIKTOK</a></p>
                </div>
            </div>
            <a className="footer-brand text-inherit no-underline" href="/">Dokan Lebss</a>
        </footer>
    );
}
